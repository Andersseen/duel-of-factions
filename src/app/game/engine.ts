import type {
  CardDefinition,
  CardInstance,
  Deck,
  Player,
  GameState,
  Action,
  CardSeed,
} from "./models";
import { CARD_EN } from "./i18n";
export const FACTIONS = ["forest", "granite", "tides", "sun"];
export const LEADER_ART: Record<string, number> = {
  forest: 0,
  granite: 6,
  tides: 12,
  sun: 18,
};
export const DIFFICULTIES = ["easy", "normal", "hard"];
export const ROWS = ["melee", "ranged", "siege"];
export const cards: Record<string, CardDefinition> = {};
function add(
  id: string,
  f: string,
  es: string,
  uk: string,
  power: number,
  row: string,
  ability: string,
  art: number,
  max = 2,
  group = "",
) {
  cards[id] = {
    id,
    f,
    name: [es, uk],
    power,
    row,
    ability,
    art,
    max,
    group,
    unit: row !== "special",
  };
}
const forest: CardSeed[] = [
  [
    "fox",
    "Explorador Zorro",
    "Лис-розвідник",
    4,
    "ranged",
    "bond",
    1,
    3,
    "fox",
  ],
  ["lynx", "Arquero Lince", "Рись-лучник", 5, "ranged", "bond", 2, 3, "lynx"],
  ["deer", "Guardián Ciervo", "Олень-вартовий", 7, "melee", "", 0, 2],
  ["owl", "Sabio Búho", "Мудрий пугач", 4, "ranged", "medic", 3, 2],
  [
    "hare",
    "Centinela Liebre",
    "Заєць-дозорець",
    3,
    "melee",
    "muster",
    4,
    3,
    "hare",
  ],
  ["squirrel", "Espía Ardilla", "Білка-шпигун", 1, "melee", "spy", 5, 2],
  ["ballista", "Balista del Bosque", "Лісова баліста", 6, "siege", "", 9, 2],
  ["warden", "Vigía del Robledal", "Вартовий діброви", 6, "ranged", "", 2, 2],
  ["ranger", "Lancero del Alba", "Списник світанку", 5, "melee", "", 4, 2],
  ["sage", "Herbolario del Valle", "Травник долини", 3, "siege", "medic", 3, 2],
  [
    "stalker",
    "Cazador de la Bruma",
    "Мисливець у тумані",
    8,
    "ranged",
    "",
    1,
    2,
  ],
  [
    "elder",
    "Alder, corazón del bosque",
    "Альдер, серце лісу",
    10,
    "melee",
    "hero",
    0,
    1,
  ],
  [
    "moon",
    "Nara, flecha lunar",
    "Нара, місячна стріла",
    10,
    "ranged",
    "hero",
    2,
    1,
  ],
];
const granite: CardSeed[] = [
  [
    "badger",
    "Guardia Tejón",
    "Борсук-гвардієць",
    5,
    "melee",
    "bond",
    6,
    3,
    "badger",
  ],
  ["mole", "Minero Topo", "Кріт-шахтар", 3, "melee", "muster", 8, 3, "mole"],
  ["beaver", "Ingeniero Castor", "Бобер-інженер", 4, "siege", "medic", 9, 2],
  ["boar", "Guerrero Jabalí", "Кабан-воїн", 8, "melee", "", 7, 2],
  [
    "goat",
    "Ballestero de Granito",
    "Арбалетник Граніту",
    6,
    "ranged",
    "",
    10,
    2,
  ],
  [
    "smith",
    "Maestro Forjador",
    "Майстер-коваль",
    5,
    "siege",
    "bond",
    11,
    3,
    "smith",
  ],
  [
    "catapult",
    "Catapulta de Montaña",
    "Гірська катапульта",
    8,
    "siege",
    "bond",
    9,
    2,
    "catapult",
  ],
  ["scout", "Espía de las Minas", "Шпигун копалень", 2, "melee", "spy", 8, 2],
  ["ram", "Ariete de Cobre", "Мідний таран", 6, "siege", "", 9, 2],
  [
    "healer",
    "Sanador de la Cumbre",
    "Цілитель вершини",
    3,
    "ranged",
    "medic",
    11,
    2,
  ],
  ["pike", "Piqueros del Paso", "Пікінери перевалу", 4, "melee", "", 10, 2],
  [
    "king",
    "Bram, puño de granito",
    "Брам, гранітний кулак",
    10,
    "melee",
    "hero",
    6,
    1,
  ],
  [
    "forge",
    "Brasa, maestra del hierro",
    "Жарина, майстриня заліза",
    10,
    "siege",
    "hero",
    11,
    1,
  ],
];
const tides: CardSeed[] = [
  [
    "seal",
    "Escudero Foca",
    "Тюлень-щитоносець",
    5,
    "melee",
    "bond",
    13,
    3,
    "tides-seal",
  ],
  [
    "otter",
    "Marinero Nutria",
    "Видра-моряк",
    4,
    "melee",
    "muster",
    12,
    3,
    "tides-otter",
  ],
  ["heron", "Arquero Garza", "Чапля-лучник", 6, "ranged", "", 14, 2],
  [
    "turtle",
    "Sanador Tortuga",
    "Черепаха-цілитель",
    3,
    "ranged",
    "medic",
    15,
    2,
  ],
  [
    "pelican",
    "Ingeniero Pelícano",
    "Пелікан-інженер",
    5,
    "siege",
    "bond",
    16,
    3,
    "tides-pelican",
  ],
  ["raccoon", "Espía del Puerto", "Шпигун порту", 2, "melee", "spy", 17, 2],
  [
    "harpoon",
    "Arponero de la Costa",
    "Береговий гарпунник",
    7,
    "ranged",
    "",
    14,
    2,
  ],
  ["barge", "Balista de Cubierta", "Палубна баліста", 7, "siege", "", 16, 2],
  [
    "healer",
    "Guardián del Arrecife",
    "Вартовий рифу",
    4,
    "siege",
    "medic",
    15,
    2,
  ],
  ["diver", "Buzo de las Mareas", "Пірнальник припливу", 5, "melee", "", 12, 2],
  ["watch", "Vigía del Faro", "Вартовий маяка", 4, "ranged", "", 13, 2],
  [
    "mira",
    "Mira, voz del océano",
    "Міра, голос океану",
    10,
    "ranged",
    "hero",
    12,
    1,
  ],
  [
    "neri",
    "Neri, escudo del puerto",
    "Нері, щит порту",
    10,
    "melee",
    "hero",
    13,
    1,
  ],
];
const sun: CardSeed[] = [
  [
    "caracal",
    "Lancero Caracal",
    "Каракал-списник",
    5,
    "melee",
    "bond",
    20,
    3,
    "sun-caracal",
  ],
  [
    "meerkat",
    "Centinela Suricata",
    "Сурикат-дозорець",
    3,
    "melee",
    "muster",
    21,
    3,
    "sun-meerkat",
  ],
  ["fennec", "Explorador Fénec", "Фенек-розвідник", 6, "ranged", "", 19, 2],
  ["ibis", "Sanador Ibis", "Ібіс-цілитель", 4, "ranged", "medic", 23, 2],
  ["camel", "Ingeniero Camello", "Верблюд-інженер", 7, "siege", "", 22, 2],
  ["spy", "Espía de las Dunas", "Шпигун дюн", 2, "melee", "spy", 19, 2],
  ["guard", "Guardia del Oasis", "Вартовий оази", 7, "melee", "", 20, 2],
  [
    "slinger",
    "Hondero del Desierto",
    "Пустельний пращник",
    4,
    "ranged",
    "bond",
    21,
    3,
    "sun-slinger",
  ],
  ["caravan", "Caravana de Asedio", "Облоговий караван", 8, "siege", "", 22, 2],
  ["sage", "Sabio de las Arenas", "Мудрець пісків", 3, "siege", "medic", 23, 2],
  ["lion", "Guerrero de la Aurora", "Воїн світанку", 6, "melee", "", 18, 2],
  [
    "sahir",
    "Sahir, corona del sol",
    "Сахір, сонячна корона",
    10,
    "melee",
    "hero",
    18,
    1,
  ],
  [
    "zahra",
    "Zahra, flecha del alba",
    "Захра, стріла світанку",
    10,
    "ranged",
    "hero",
    19,
    1,
  ],
];
for (const [f, list] of Object.entries({ forest, granite, tides, sun }))
  for (const [id, es, uk, power, row, ability, art, max, group] of list)
    add(f + "-" + id, f, es, uk, power, row, ability, art, max, group);
// Preserve the original portraits; each is assigned to exactly one card identity.
const originalArt = {
  "forest-fox": 1,
  "forest-lynx": 2,
  "forest-owl": 3,
  "forest-hare": 4,
  "forest-squirrel": 5,
  "forest-elder": 0,
  "granite-king": 6,
  "granite-mole": 8,
  "granite-beaver": 9,
  "granite-boar": 7,
  "granite-goat": 10,
  "granite-smith": 11,
  "tides-mira": 12,
  "tides-seal": 13,
  "tides-heron": 14,
  "tides-turtle": 15,
  "tides-pelican": 16,
  "tides-raccoon": 17,
  "sun-sahir": 18,
  "sun-fennec": 19,
  "sun-caracal": 20,
  "sun-meerkat": 21,
  "sun-camel": 22,
  "sun-ibis": 23,
};
const extraArt: Record<string, string[]> = {
  forest: ["deer", "ballista", "warden", "ranger", "sage", "stalker", "moon"],
  granite: ["badger", "catapult", "scout", "ram", "healer", "pike", "forge"],
  tides: ["otter", "harpoon", "barge", "healer", "diver", "watch", "neri"],
  sun: ["spy", "guard", "slinger", "caravan", "sage", "lion", "zahra"],
};
for (const [id, art] of Object.entries(originalArt)) cards[id].art = art;
for (const [fi, f] of FACTIONS.entries())
  extraArt[f].forEach((id, i) => (cards[f + "-" + id].art = 200 + fi * 8 + i));
add(
  "wanderer",
  "neutral",
  "Errante del Camino",
  "Мандрівник",
  6,
  "melee",
  "",
  207,
  2,
);
add("frost", "neutral", "Escarcha", "Мороз", 0, "special", "melee", -1, 2);
add("fog", "neutral", "Niebla", "Туман", 0, "special", "ranged", -2, 2);
add("rain", "neutral", "Lluvia", "Злива", 0, "special", "siege", -3, 2);
add(
  "clear",
  "neutral",
  "Cielo abierto",
  "Чисте небо",
  0,
  "special",
  "clear",
  -4,
  2,
);
add(
  "horn",
  "neutral",
  "Cuerno de batalla",
  "Бойовий ріг",
  0,
  "special",
  "horn",
  -5,
  3,
);
add(
  "scorch",
  "neutral",
  "Quemadura",
  "Спопелення",
  0,
  "special",
  "scorch",
  -6,
  2,
);
add("decoy", "neutral", "Señuelo", "Приманка", 0, "special", "decoy", -7, 2);
for (const [id, c] of Object.entries(cards)) {
  if (!CARD_EN[id]) throw new Error("Missing English card: " + id);
  c.name.push(CARD_EN[id]);
}
export const def = (c: Pick<CardInstance, "id">) => cards[c.id];
export function available(f: string) {
  return Object.values(cards).filter((c) => c.f === f || c.f === "neutral");
}
export function starter(f: string): Deck {
  const d: Deck = {};
  for (const c of available(f)) if (c.unit && c.f === f) d[c.id] = c.max;
  for (const id of ["frost", "fog", "rain", "clear", "horn", "scorch", "decoy"])
    d[id] = 1;
  return d;
}
/** Deck rules: at least this many unit cards… */
export const MIN_UNITS = 22;
/** …and at most this many special cards. */
export const MAX_SPECIAL = 10;
export function validate(d: Deck, f: string) {
  let units = 0,
    special = 0,
    legal = true;
  for (const [id, n] of Object.entries(d)) {
    let c = cards[id];
    if (
      !c ||
      !Number.isInteger(n) ||
      n < 0 ||
      n > c.max ||
      (c.f !== f && c.f !== "neutral")
    ) {
      legal = false;
      continue;
    }
    if (c.unit) units += n;
    else special += n;
  }
  return {
    units,
    special,
    valid: legal && units >= MIN_UNITS && special <= MAX_SPECIAL,
  };
}
let serial = 0;
export function expand(d: Deck) {
  return Object.entries(d).flatMap(([id, n]) =>
    Array.from({ length: n }, () => ({ id, uid: ++serial })),
  );
}
export function shuffle<T>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function player(f: string, d: Deck): Player {
  let deck = shuffle(expand(d));
  return {
    f,
    deck,
    hand: deck.splice(0, 10),
    grave: [],
    rows: [[], [], []],
    horn: [null, null, null],
    passed: false,
    wins: 0,
    leader: false,
  };
}
export function create(
  f: string,
  d: Deck,
  opponent: string | null = null,
  difficulty = "normal",
): GameState {
  if (!FACTIONS.includes(f) || !validate(d, f).valid)
    throw new Error("Invalid faction or deck");
  const rivals = FACTIONS.filter((x) => x !== f);
  if (!rivals.includes(opponent ?? ""))
    opponent = rivals[Math.floor(Math.random() * rivals.length)];
  return {
    difficulty: DIFFICULTIES.includes(difficulty) ? difficulty : "normal",
    players: [player(f, d), player(opponent!, starter(opponent!))],
    weather: [],
    spent: [],
    round: 1,
    turn: 0,
    starter: 0,
    history: [],
    log: [],
    pending: null,
    over: false,
    winner: null,
  };
}
export function leaderReady(s: GameState, side: number) {
  const p = s.players[side];
  if (p.leader) return false;
  if (p.f === "granite") return !p.horn[2];
  if (p.f === "sun") return !p.horn[0];
  if (p.f === "tides") return p.deck.length > 0;
  return true;
}
export function mulligan(s: GameState, uid: number) {
  const p = s.players[0],
    i = p.hand.findIndex((c) => c.uid === uid);
  if (i < 0 || !p.deck.length) return false;
  let old = p.hand[i];
  p.hand[i] = p.deck.shift()!;
  p.deck.push(old);
  return true;
}
export function strength(
  s: GameState,
  side: number,
  row: number,
  c: CardInstance,
) {
  const d = def(c);
  if (!d.unit) return 0;
  if (d.ability === "hero") return d.power;
  let v = s.weather.some((w) => def(w.card).ability === ROWS[row])
    ? 1
    : d.power;
  if (d.ability === "bond")
    v *= s.players[side].rows[row].filter(
      (x) => def(x).group === d.group,
    ).length;
  if (s.players[side].horn[row]) v *= 2;
  return v;
}
export function scores(s: GameState, side: number) {
  return s.players[side].rows.map((row, r) =>
    row.reduce((a, c) => a + strength(s, side, r, c), 0),
  );
}
export function total(s: GameState, side: number) {
  return scores(s, side).reduce((a, b) => a + b, 0);
}
export function eligible(p: Player) {
  return p.grave.filter((c) => def(c).unit && def(c).ability !== "hero");
}
function log(s: GameState, key: string, args: (string | number)[] = []) {
  s.log.unshift({ key, args });
  s.log = s.log.slice(0, 30);
}
function place(s: GameState, side: number, c: CardInstance, row: number) {
  const d = def(c),
    p = s.players[side],
    destination = d.ability === "spy" ? 1 - side : side;
  s.players[destination].rows[row].push(c);
  if (d.ability === "spy") {
    for (let n = 0; n < 2 && p.deck.length; n++) p.hand.push(p.deck.shift()!);
  }
  if (d.ability === "muster") {
    for (const source of [p.hand, p.deck]) {
      for (let i = source.length - 1; i >= 0; i--)
        if (def(source[i]).group === d.group) {
          p.rows[row].push(source.splice(i, 1)[0]);
        }
    }
  }
  if (d.ability === "medic" && eligible(p).length) s.pending = { side };
}
export function finish(s: GameState) {
  if (s.pending || s.over) return;
  const [a, b] = s.players;
  if (a.passed && b.passed) {
    let x = total(s, 0),
      y = total(s, 1);
    if (x >= y) a.wins++;
    if (y >= x) b.wins++;
    s.history.push([x, y]);
    log(s, "roundEnd", [x, y]);
    if (a.wins >= 2 || b.wins >= 2 || s.round >= 3) {
      s.over = true;
      s.winner = a.wins === b.wins ? null : a.wins > b.wins ? 0 : 1;
      return;
    }
    for (const p of s.players) {
      for (let r = 0; r < 3; r++) {
        p.grave.push(...p.rows[r]);
        p.rows[r] = [];
        if (p.horn[r]?.id) p.grave.push(p.horn[r] as CardInstance);
        p.horn[r] = null;
      }
      p.passed = false;
    }
    for (const w of s.weather) s.players[w.side].grave.push(w.card);
    s.weather = [];
    for (const w of s.spent) s.players[w.side].grave.push(w.card);
    s.spent = [];
    s.round++;
    s.starter = 1 - s.starter;
    s.turn = s.starter;
    return;
  }
  s.turn = s.players[1 - s.turn].passed ? s.turn : 1 - s.turn;
}
export function targets(
  s: GameState,
  side: number,
  c: CardInstance,
): { row?: number; target?: number }[] {
  let d = def(c),
    p = s.players[side];
  if (d.unit) return [{ row: ROWS.indexOf(d.row) }];
  if (d.ability === "horn")
    return [0, 1, 2].filter((r) => !p.horn[r]).map((row) => ({ row }));
  if (d.ability === "decoy")
    return p.rows.flatMap((rr, row) =>
      rr
        .filter((x) => def(x).unit && def(x).ability !== "hero")
        .map((x) => ({ row, target: x.uid })),
    );
  return [{}];
}
export function act(s: GameState, side: number, a: Action) {
  if (s.over || s.turn !== side) return false;
  let p = s.players[side];
  if (s.pending) {
    if (s.pending.side !== side || a.kind !== "revive") return false;
    const c = eligible(p).find((x) => x.uid === a.target);
    if (a.target != null && !c) return false;
    s.pending = null;
    if (c) {
      p.grave.splice(
        p.grave.findIndex((x) => x.uid === c.uid),
        1,
      );
      place(s, side, c, ROWS.indexOf(def(c).row));
      log(s, "revived", [side, c.id]);
    }
    finish(s);
    return true;
  }
  if (p.passed) return false;
  if (a.kind === "pass") {
    p.passed = true;
    log(s, "passed", [side]);
    finish(s);
    return true;
  }
  if (a.kind === "leader") {
    if (!leaderReady(s, side)) return false;
    p.leader = true;
    if (p.f === "forest") {
      for (const w of s.weather) s.players[w.side].grave.push(w.card);
      s.weather = [];
    } else if (p.f === "tides") p.hand.push(p.deck.shift()!);
    else p.horn[p.f === "sun" ? 0 : 2] = { leader: true };
    log(s, "leaderUsed", [side]);
    finish(s);
    return true;
  }
  if (a.kind !== "play") return false;
  let i = p.hand.findIndex((c) => c.uid === a.uid);
  if (i < 0) return false;
  let c = p.hand[i],
    d = def(c);
  if (
    !targets(s, side, c).some(
      (t) =>
        (t.row === undefined || t.row === a.row!) &&
        (t.target === undefined || t.target === a.target),
    )
  )
    return false;
  p.hand.splice(i, 1);
  log(s, "played", [side, c.id]);
  if (d.unit) place(s, side, c, a.row!);
  else if (d.ability === "horn") p.horn[a.row!] = c;
  else if (d.ability === "decoy") {
    let ix = p.rows[a.row!].findIndex((x) => x.uid === a.target);
    p.hand.push(p.rows[a.row!][ix]);
    p.rows[a.row!][ix] = c;
  } else if (ROWS.includes(d.ability)) {
    if (s.weather.some((w) => def(w.card).ability === d.ability))
      s.spent.push({ side, card: c });
    else s.weather.push({ side, card: c });
  } else {
    s.spent.push({ side, card: c });
    if (d.ability === "clear") {
      for (const w of s.weather) s.players[w.side].grave.push(w.card);
      s.weather = [];
    }
    if (d.ability === "scorch") {
      let all = s.players.flatMap((q, k) =>
        q.rows.flatMap((rr, r) =>
          rr
            .filter((x) => def(x).unit && def(x).ability !== "hero")
            .map((x) => ({ c: x, k, r, v: strength(s, k, r, x) })),
        ),
      );
      let max = Math.max(0, ...all.map((x) => x.v));
      for (const x of all.filter((x) => x.v === max)) {
        let rr = s.players[x.k].rows[x.r];
        rr.splice(
          rr.findIndex((c) => c.uid === x.c.uid),
          1,
        );
        s.players[x.k].grave.push(x.c);
      }
    }
  }
  finish(s);
  return true;
}
function normalAI(s: GameState, side = 1): Action {
  const p = s.players[side],
    opp = s.players[1 - side];
  if (s.pending) {
    let best = eligible(p).sort((a, b) => {
      const value = (c: CardInstance) =>
        def(c).power +
        (def(c).ability === "spy" ? 14 : 0) +
        (def(c).ability === "medic" ? 8 : 0);
      return value(b) - value(a);
    })[0];
    return { kind: "revive", target: best?.uid ?? null };
  }
  const ours = total(s, side),
    theirs = total(s, 1 - side),
    gap = theirs - ours;
  if (opp.passed && ours > theirs) return { kind: "pass" };
  const actions: Action[] = p.hand.flatMap((c) =>
    targets(s, side, c).map((t) => ({ kind: "play", uid: c.uid, ...t })),
  );
  if (leaderReady(s, side) && (p.f !== "forest" || s.weather.length))
    actions.push({ kind: "leader" });
  if (!actions.length) return { kind: "pass" };
  let best: Action | null = null,
    bestValue = -Infinity;
  for (const a of actions) {
    const copy = structuredClone(s);
    act(copy, side, a);
    let value =
      total(copy, side) -
      ours -
      (total(copy, 1 - side) - theirs) +
      (copy.players[side].hand.length - p.hand.length + 1) * 6;
    const c = p.hand.find((c) => c.uid === a.uid);
    if (c && def(c).ability === "medic")
      value += Math.max(0, ...eligible(p).map((c) => def(c).power)) + 3;
    if (c && def(c).ability === "hero" && !opp.passed) value -= 2;
    if (a.kind === "leader") value -= 1;
    if (opp.passed && total(copy, side) > total(copy, 1 - side))
      value = 60 - (total(copy, side) - total(copy, 1 - side)) * 0.4;
    if (value > bestValue) {
      bestValue = value;
      best = a;
    }
  }
  if (
    !opp.passed &&
    p.wins < 2 &&
    opp.wins < 1 &&
    gap > 15 &&
    p.hand.length < 7
  )
    return { kind: "pass" };
  if (!opp.passed && ours > theirs + 9 && p.hand.length < opp.hand.length)
    return { kind: "pass" };
  if (opp.passed && gap >= 0 && bestValue < 1) return { kind: "pass" };
  if (!opp.passed && bestValue <= 0) return { kind: "pass" };
  return best ?? { kind: "pass" };
}

// Difficulty changes choices only. Never inspect the opponent hand or deck identities.
export function ai(
  s: GameState,
  side = 1,
  difficulty = s.difficulty || "normal",
): Action {
  if (difficulty === "normal" || !DIFFICULTIES.includes(difficulty))
    return normalAI(s, side);
  const p = s.players[side],
    opp = s.players[1 - side];
  if (s.pending) {
    const options = eligible(p);
    if (difficulty === "easy")
      return { kind: "revive", target: options[0]?.uid ?? null };
    return normalAI(s, side);
  }
  const ours = total(s, side),
    theirs = total(s, 1 - side);
  if (opp.passed && ours > theirs) return { kind: "pass" };
  const actions: Action[] = p.hand.flatMap((c) =>
    targets(s, side, c).map((t) => ({ kind: "play", uid: c.uid, ...t })),
  );
  if (leaderReady(s, side) && (p.f !== "forest" || s.weather.length))
    actions.push({ kind: "leader" });
  if (!actions.length) return { kind: "pass" };
  const value = (state: GameState) =>
    total(state, side) - total(state, 1 - side);
  // Simulation deliberately redacts hidden enemy information. The bot knows its own
  // deck composition, but not its draw order: no future draws are scored by identity.
  const simulate = (a: Action) => {
    const copy = structuredClone(s);
    copy.players[1 - side].hand = opp.hand.map((_, i) => ({
      id: "wanderer",
      uid: -1000 - i,
    }));
    copy.players[1 - side].deck = [];
    act(copy, side, a);
    return copy;
  };
  const ranked = actions.map((a) => {
    const copy = simulate(a),
      c = p.hand.find((c) => c.uid === a.uid),
      d = c && def(c);
    let gain = value(copy) - (ours - theirs);
    return { a, copy, d, gain };
  });
  if (difficulty === "easy") {
    const useful = ranked.filter((x) => x.gain > 0 || x.d?.ability === "spy");
    if (opp.passed && !useful.length) return { kind: "pass" };
    const list = useful.length ? useful : ranked;
    // Basic immediate plays, without planning combinations or conserving heroes.
    return list[Math.floor(Math.random() * list.length)].a;
  }
  let best: Action | null = null,
    bestScore = -Infinity;
  for (const { a, copy, d, gain } of ranked) {
    let score = gain + (copy.players[side].hand.length - p.hand.length + 1) * 7;
    if (d?.ability === "medic")
      score +=
        Math.max(
          0,
          ...eligible(p).map(
            (c) => def(c).power + (def(c).ability === "spy" ? 12 : 0),
          ),
        ) + 2;
    if (d?.ability === "hero" && !opp.passed && opp.wins === 0) score -= 3;
    if (a.kind === "leader") score -= 1.5;
    if (d?.ability === "decoy") {
      const target = p.rows.flat().find((c) => c.uid === a.target);
      if (target) {
        const ability = def(target).ability;
        score +=
          ability === "spy"
            ? 18
            : ability === "medic" && eligible(p).length
              ? 12
              : 0;
      }
    }
    if (d?.ability === "bond") {
      const copies = copy.players[side].hand.filter(
        (c) => def(c).group === d.group,
      ).length;
      score += Math.min(12, copies * d.power * 1.5);
    }
    if (d?.ability === "muster")
      score -=
        Math.max(0, p.hand.filter((c) => def(c).group === d.group).length - 1) *
        2;
    // Avoid exposing an unprotected large formation to a future scorch.
    const powers = copy.players[side].rows.flatMap((rr, r) =>
      rr
        .filter((c) => def(c).ability !== "hero")
        .map((c) => strength(copy, side, r, c)),
    );
    if (!opp.passed && powers.length) {
      const max = Math.max(...powers),
        exposed = powers.filter((n) => n === max).reduce((a, b) => a + b, 0);
      if (max >= 10) score -= exposed * 0.16;
    }
    if (opp.passed && total(copy, side) > total(copy, 1 - side))
      score =
        100 -
        gain * 0.2 +
        (a.kind === "leader" ? 2 : 0) -
        (d?.ability === "hero" ? 3 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = a;
    }
  }
  if (opp.passed && bestScore <= 0) return { kind: "pass" };
  if (
    !opp.passed &&
    opp.wins === 0 &&
    theirs - ours > 18 &&
    p.hand.length <= opp.hand.length
  )
    return { kind: "pass" };
  if (!opp.passed && ours > theirs + 12 && p.hand.length < opp.hand.length)
    return { kind: "pass" };
  if (!opp.passed && bestScore <= 0) return { kind: "pass" };
  return best ?? { kind: "pass" };
}

export type { Action } from "./models";
