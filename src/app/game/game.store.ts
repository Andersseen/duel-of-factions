import {
  Injectable,
  signal,
  computed,
  DestroyRef,
  effect,
  inject,
  untracked,
} from "@angular/core";
import { ViewportService } from "@quartz-headless/core";
import * as E from "./engine";
import type {
  GameState,
  Deck,
  CardDefinition,
  CardInstance,
  SoundSettings,
  GameLog,
} from "./models";
import { T, AB, symbols, rowIcon } from "./translations";
import { GameAudio } from "./audio";
type Screen = "menu" | "faction" | "deck" | "prepare" | "battle" | "result";
type Modal =
  | "settings"
  | "help"
  | "deck-help"
  | "prepare-help"
  | "quit"
  | "pass"
  | { type: "inspect"; id: string }
  | { type: "grave"; side: number }
  | { type: "swap-preview"; uid: number }
  | null;
const read = <T>(k: string, f: T): T => {
  try {
    return JSON.parse(localStorage.getItem(k) ?? "null") ?? f;
  } catch {
    return f;
  }
};
const save = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};
/** Reactive viewport size. In the app it is Quartz's `ViewportService`. */
export interface ViewportSize {
  readonly width: () => number;
  readonly height: () => number;
}
export function createGameController(viewport?: ViewportSize) {
  // Without an injected viewport (engine tests, plain scripts) fall back to window events.
  const ownViewport = viewport
    ? null
    : { width: signal(window.innerWidth), height: signal(window.innerHeight) };
  const vp: ViewportSize = viewport ?? ownViewport!;
  const revision = signal(0);
  let lang = read("df-lang", 0),
    faction = read("df-faction", "forest"),
    decks = read<Record<string, Deck>>("df-decks", {});
  let screen: Screen = "menu",
    filter = "all",
    selected: number | null = null,
    hover: string | null = null,
    game: GameState | null = null;
  let swaps = 0,
    swapped = new Set<number>(),
    modal: Modal = null,
    roundNotice: [number, number] | null = null,
    aiTimer: ReturnType<typeof setTimeout> | null = null;
  let handPage = 0,
    factionPage = 0;
  let difficulty = read("df-difficulty", "normal");
  if (!E.DIFFICULTIES.includes(difficulty)) difficulty = "normal";
  if (![0, 1, 2].includes(lang)) lang = 0;
  if (!E.FACTIONS.includes(faction)) faction = "forest";
  const soundSettings: SoundSettings = {
    music: true,
    effects: true,
    volume: 0.45,
    ...read<Partial<SoundSettings>>("df-audio", {}),
  };
  const audio = new GameAudio(soundSettings);
  const t = (k: string) => {
    revision();
    return T[k]?.[lang] ?? k;
  };
  const definition = (c: CardDefinition | CardInstance) => E.cards[c.id];
  const name = (c: CardDefinition | CardInstance) => definition(c).name[lang];
  const ab = (c: CardDefinition | CardInstance) => AB[definition(c).ability];
  function deck(): Deck {
    return decks[faction] ?? (decks[faction] = E.starter(faction));
  }
  function render() {
    audio.setScene(screen === "battle" && !game?.over ? "battle" : "menu");
    document.documentElement.lang = ["es", "uk", "en"][lang];
    document.title = t("title");
    document.body.dataset["screen"] = screen;
    document.body.dataset["theme"] = ["menu", "faction"].includes(screen)
      ? "neutral"
      : faction;
    revision.update((n) => n + 1);
    scheduleAI();
  }
  function beginPreparation() {
    clearTimeout(aiTimer ?? undefined);
    aiTimer = null;
    game = E.create(
      faction,
      deck(),
      screen === "result" ? game?.players[1].f : null,
      difficulty,
    );
    handPage = 0;
    selected = null;
    hover = null;
    swaps = 0;
    swapped = new Set();
    roundNotice = null;
    modal = null;
    screen = "prepare";
    render();
  }
  function perform(a: E.Action, side = 0) {
    const before = game!.history.length,
      c = a.uid
        ? game!.players[side].hand.find((c) => c.uid === a.uid)
        : undefined,
      ability = c && E.def(c).ability;
    if (!E.act(game!, side, a)) return;
    audio.cue(
      a.kind === "pass"
        ? "pass"
        : a.kind === "revive" || ability === "medic"
          ? "medic"
          : ability === "scorch"
            ? "scorch"
            : E.ROWS.includes(ability || "") || ability === "clear"
              ? "weather"
              : "play",
    );
    selected = null;
    hover = null;
    if (game!.history.length > before) {
      roundNotice = game!.history.at(-1)!;
      audio.cue(
        game!.over
          ? game!.winner === 0
            ? "win"
            : "lose"
          : roundNotice[0] >= roundNotice[1]
            ? "win"
            : "lose",
      );
    }
    render();
  }
  function scheduleAI() {
    if (
      aiTimer ||
      !game ||
      screen !== "battle" ||
      modal ||
      roundNotice ||
      game!.over ||
      game!.turn !== 1
    )
      return;
    aiTimer = setTimeout(() => {
      aiTimer = null;
      if (screen === "battle" && !modal && !roundNotice && game!.turn === 1)
        perform(E.ai(game!), 1);
    }, 750);
  }

  function action(action: string, data: Record<string, string> = {}) {
    const uid = Number(data["uid"]),
      id = data["id"] || data["card"];
    audio.unlock();
    if (
      ![
        "hand",
        "row",
        "play-special",
        "decoy-target",
        "revive",
        "confirm-pass",
      ].includes(action)
    )
      audio.cue("click");
    switch (action) {
      case "deck-help":
        modal = "deck-help";
        break;
      case "prepare-help":
        modal = "prepare-help";
        break;
      case "swap-preview":
        modal = { type: "swap-preview", uid };
        break;
      case "difficulty":
        if (E.DIFFICULTIES.includes(data.level)) {
          difficulty = data.level;
          save("df-difficulty", difficulty);
        }
        break;
      case "settings":
        modal = "settings";
        break;
      case "music":
      case "effects":
        soundSettings[action] = !soundSettings[action];
        save("df-audio", soundSettings);
        audio.update();
        break;
      case "audio-test":
        audio.cue("win");
        break;
      case "fullscreen":
        if (document.fullscreenElement)
          document.exitFullscreen?.().catch(() => {});
        else document.documentElement.requestFullscreen?.().catch(() => {});
        break;
      case "hand-prev":
        handPage = Math.max(0, handPage - 1);
        break;
      case "hand-next":
        handPage++;
        break;
      case "back-factions":
        factionPage = 0;
        screen = "faction";
        break;
      case "factions-prev":
        factionPage = Math.max(0, factionPage - 1);
        break;
      case "factions-next":
        factionPage++;
        break;
      case "lang":
        lang = Number(data.lang);
        save("df-lang", lang);
        break;
      case "help":
        modal = "help";
        break;
      case "close":
        modal = null;
        break;
      case "new":
        factionPage = 0;
        screen = "faction";
        break;
      case "menu":
        if (screen === "battle" || screen === "prepare") modal = "quit";
        else {
          screen = "menu";
          modal = null;
        }
        break;
      case "quit":
        clearTimeout(aiTimer ?? undefined);
        aiTimer = null;
        game = null;
        modal = null;
        roundNotice = null;
        screen = "menu";
        break;
      case "faction":
        faction = data.faction;
        save("df-faction", faction);
        filter = "all";
        selected = null;
        hover = null;
        screen = "deck";
        break;
      case "filter":
        filter = data.filter;
        break;
      case "add":
      case "remove": {
        let d = deck();
        d[id] = Math.min(
          E.cards[id].max,
          Math.max(0, (d[id] || 0) + (action === "add" ? 1 : -1)),
        );
        save("df-decks", decks);
        break;
      }
      case "restore":
        decks[faction] = E.starter(faction);
        save("df-decks", decks);
        modal = null;
        break;
      case "prepare":
        if (E.validate(decks[faction], faction).valid) beginPreparation();
        return;
      case "swap": {
        modal = null;
        if (swaps >= 2 || swapped.has(uid)) return;
        const index = game!.players[0].hand.findIndex((c) => c.uid === uid);
        if (index >= 0 && E.mulligan(game!, uid)) {
          swaps++;
          swapped.add(game!.players[0].hand[index].uid);
        }
        break;
      }
      case "begin":
        handPage = 0;
        screen = "battle";
        break;
      case "hand":
        if (
          game!.turn !== 0 ||
          game!.players[0].passed ||
          game!.pending ||
          roundNotice
        )
          return;
        selected = selected === uid ? null : uid;
        hover = null;
        break;
      case "cancel":
        selected = null;
        hover = null;
        break;
      case "row":
        if (selected)
          perform({ kind: "play", uid: selected, row: Number(data.row) });
        return;
      case "play-special":
        perform({ kind: "play", uid: selected ?? undefined });
        return;
      case "decoy-target": {
        let row = game!.players[0].rows.findIndex((rr) =>
          rr.some((c) => c.uid === uid),
        );
        perform({ kind: "play", uid: selected ?? undefined, row, target: uid });
        return;
      }
      case "pass":
        modal = "pass";
        break;
      case "confirm-pass":
        modal = null;
        perform({ kind: "pass" });
        return;
      case "leader":
        perform({ kind: "leader" });
        return;
      case "revive":
        perform({ kind: "revive", target: uid });
        return;
      case "skip-revive":
        perform({ kind: "revive", target: null });
        return;
      case "next-round":
        roundNotice = null;
        if (game!.over) screen = "result";
        break;
      case "rematch":
        beginPreparation();
        return;
      case "change-deck":
        screen = "deck";
        hover = null;
        selected = null;
        break;
      case "grave":
        modal = { type: "grave", side: Number(data.side) };
        break;
      case "board-inspect":
        modal = { type: "inspect", id };
        break;
      case "inspect":
        modal = { type: "inspect", id };
        break;
    }
    render();
  }

  /** Phones scroll the whole hand sideways (swipe); wider screens page it. */
  function handPageSize() {
    const all = Math.max(1, game?.players[0].hand.length ?? 0);
    return vp.width() < 700 ? all : vp.width() < 1000 ? 6 : 10;
  }

  function resize() {
    ownViewport?.width.set(window.innerWidth);
    ownViewport?.height.set(window.innerHeight);
    handPage = 0;
    factionPage = 0;
    render();
  }
  function visibility() {
    audio.setActive(!document.hidden);
  }
  if (ownViewport) window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", visibility);
  render();
  const filters = [
    "all",
    "units",
    "melee",
    "ranged",
    "siege",
    "special",
    "neutral",
  ];
  const selectedCard = () =>
    game?.players[0].hand.find((c) => c.uid === selected);
  const canPlay = () =>
    !!game &&
    game.turn === 0 &&
    !game.players[0].passed &&
    !game.pending &&
    !roundNotice &&
    !game.over;
  function rowValid(side: number, row: number) {
    const sel = selectedCard();
    if (!game || !sel || !canPlay()) return false;
    const d = E.def(sel);
    return (
      (d.unit &&
        E.ROWS[row] === d.row &&
        side === (d.ability === "spy" ? 1 : 0)) ||
      (side === 0 && d.ability === "horn" && !game.players[0].horn[row])
    );
  }
  function decoyTarget(side: number, c: CardInstance) {
    const sel = selectedCard();
    return (
      !!sel &&
      canPlay() &&
      side === 0 &&
      E.def(sel).ability === "decoy" &&
      E.def(c).unit &&
      E.def(c).ability !== "hero"
    );
  }
  function logText(e: GameLog) {
    const who = t(e.args[0] === 0 ? "you" : "rival");
    if (e.key === "played" || e.key === "revived")
      return (
        who +
        " " +
        (lang === 0 && e.args[0] === 0
          ? e.key === "played"
            ? "jugaste"
            : "recuperaste"
          : t(e.key)) +
        " " +
        name(E.cards[e.args[1]])
      );
    if (e.key === "passed")
      return (
        who + " " + (lang === 0 && e.args[0] === 0 ? "pasaste" : t("passedLog"))
      );
    if (e.key === "leaderUsed") return who + " " + t("leaderUsed");
    return t("roundEnd") + " · " + e.args.join(" : ");
  }
  return {
    revision,
    t,
    name,
    ab,
    /** Localised name of an ability key (horn, medic, spy…). */
    abilityName: (key: string) => {
      revision();
      return AB[key]?.[lang] ?? key;
    },
    definition,
    deck,
    action,
    rowValid,
    decoyTarget,
    logText,
    canPlay,
    E,
    symbols,
    rowIcon,
    filters,
    emblems: { forest: "❧", granite: "❖", tides: "≈", sun: "☀" } as Record<
      string,
      string
    >,
    get lang() {
      revision();
      return lang;
    },
    get faction() {
      revision();
      return faction;
    },
    get screen() {
      revision();
      return screen;
    },
    get filter() {
      revision();
      return filter;
    },
    get game() {
      revision();
      return game;
    },
    get hover() {
      revision();
      return hover;
    },
    get selected() {
      revision();
      return selected;
    },
    get swaps() {
      revision();
      return swaps;
    },
    get swapped() {
      revision();
      return swapped;
    },
    get modal() {
      revision();
      return modal;
    },
    get roundNotice() {
      revision();
      return roundNotice;
    },
    get difficulty() {
      revision();
      return difficulty;
    },
    soundSettings,
    get selectedDefinition() {
      revision();
      const c = selectedCard();
      return c ? E.def(c) : undefined;
    },
    get special() {
      revision();
      const c = selectedCard();
      return (
        !!c && !E.def(c).unit && !["horn", "decoy"].includes(E.def(c).ability)
      );
    },
    get handHint() {
      revision();
      const c = selectedCard();
      if (!c) return "";
      const d = E.def(c);
      return t(
        d.ability === "decoy"
          ? "decoyHint"
          : d.unit || d.ability === "horn"
            ? "placeHint"
            : "specialHint",
      );
    },
    get valid() {
      revision();
      return E.validate(deck(), faction);
    },
    get collection() {
      revision();
      return E.available(faction).filter(
        (c) =>
          filter === "all" ||
          (filter === "units" && c.unit) ||
          (filter === "special" && !c.unit) ||
          (filter === "neutral" && c.f === "neutral") ||
          filter === c.row,
      );
    },
    get factionPage() {
      revision();
      return factionPage;
    },
    /** Short wide screens page the factions two by two; phones scroll all four. */
    get factionPages() {
      revision();
      return vp.width() >= 700 && vp.height() < 650 ? 2 : 1;
    },
    get factions() {
      revision();
      const size = vp.width() >= 700 && vp.height() < 650 ? 2 : 4;
      return E.FACTIONS.slice(factionPage * size, (factionPage + 1) * size);
    },
    /** The whole opening hand: a 5 × 2 grid on desktop, a compact grid on phones. */
    get startingHand() {
      revision();
      return game?.players[0].hand ?? [];
    },
    get handPage() {
      revision();
      return handPage;
    },
    get handPages() {
      revision();
      return Math.max(
        1,
        Math.ceil((game?.players[0].hand.length ?? 0) / handPageSize()),
      );
    },
    get hand() {
      revision();
      const size = handPageSize();
      handPage = Math.min(
        handPage,
        Math.max(0, Math.ceil((game?.players[0].hand.length ?? 0) / size) - 1),
      );
      return (
        game?.players[0].hand.slice(handPage * size, (handPage + 1) * size) ??
        []
      );
    },
    get inspectId() {
      revision();
      const current = modal;
      return typeof current === "object" && current?.type === "inspect"
        ? current.id
        : typeof current === "object" && current?.type === "swap-preview"
          ? game?.players[0].hand.find((c) => c.uid === current.uid)?.id
          : undefined;
    },
    get swapUid() {
      revision();
      return typeof modal === "object" && modal?.type === "swap-preview"
        ? modal.uid
        : undefined;
    },
    get graveSide() {
      revision();
      return typeof modal === "object" && modal?.type === "grave"
        ? modal.side
        : undefined;
    },
    get fullscreenEnabled() {
      revision();
      return document.fullscreenEnabled;
    },
    get fullscreen() {
      revision();
      return !!document.fullscreenElement;
    },
    setFilter(value: string) {
      filter = value;
      render();
    },
    setVolume(value: string) {
      soundSettings.volume = Number(value) / 100;
      save("df-audio", soundSettings);
      audio.update();
      revision.update((n) => n + 1);
    },
    preview(id: string | null) {
      hover = id;
      revision.update((n) => n + 1);
    },
    selectDrag(uid: number) {
      if (!canPlay() || !game?.players[0].hand.some((card) => card.uid === uid))
        return false;
      selected = uid;
      hover = null;
      audio.unlock();
      render();
      return true;
    },
    drop(row?: number, target?: number) {
      if (selected !== null)
        perform({
          kind: "play",
          uid: selected,
          ...(row === undefined ? {} : { row }),
          ...(target === undefined ? {} : { target }),
        });
    },
    /** Called when an injected viewport changes size: pagination restarts. */
    viewportChanged: resize,
    destroy() {
      clearTimeout(aiTimer ?? undefined);
      audio.destroy();
      if (ownViewport) window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
      delete document.body.dataset["screen"];
      delete document.body.dataset["theme"];
    },
  };
}
@Injectable()
export class GameStore {
  readonly controller = createGameController(inject(ViewportService));
  readonly theme = computed(() => {
    this.controller.revision();
    return ["menu", "faction"].includes(this.controller.screen)
      ? "neutral"
      : this.controller.faction;
  });
  constructor() {
    const viewport = inject(ViewportService);
    let first = true;
    effect(() => {
      viewport.width();
      viewport.height();
      if (first) first = false;
      else untracked(() => this.controller.viewportChanged());
    });
    inject(DestroyRef).onDestroy(() => this.controller.destroy());
  }
}
