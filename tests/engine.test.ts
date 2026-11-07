import type { GameState, CardInstance } from "../src/app/game/models";
import assert from "node:assert/strict";
import * as E from "../src/app/game/engine";
const make = () => E.create("forest", E.starter("forest"));
let uid = 10000;
const c = (id: string) => ({ id, uid: ++uid });
function blank() {
  let s = make();
  for (const p of s.players) {
    p.rows = [[], [], []];
    p.horn = [null, null, null];
    p.hand = [];
    p.deck = [];
    p.grave = [];
  }
  return s;
}
function play(
  s: GameState,
  side: number,
  card: CardInstance,
  row?: number,
  target?: number,
) {
  s.turn = side;
  s.players[side].hand.push(card);
  assert(E.act(s, side, { kind: "play", uid: card.uid, row, target }));
}
assert(E.validate(E.starter("forest"), "forest").valid);
assert(E.validate(E.starter("granite"), "granite").valid);
assert(!E.validate({ "forest-fox": 2 }, "forest").valid);
let s = blank();
play(s, 0, c("forest-fox"), 1);
play(s, 0, c("forest-fox"), 1);
assert.equal(E.total(s, 0), 16);
play(s, 1, c("fog"));
assert.equal(E.total(s, 0), 4);
play(s, 0, c("horn"), 1);
assert.equal(E.total(s, 0), 8);
play(s, 0, c("forest-moon"), 1);
assert.equal(E.total(s, 0), 18);
play(s, 0, c("clear"));
assert.equal(E.total(s, 0), 42);
s = blank();
s.players[0].rows[0] = [c("forest-deer")];
s.players[1].rows[0] = [c("forest-deer"), c("granite-king")];
play(s, 0, c("scorch"));
assert.equal(s.players[0].rows[0].length, 0);
assert.equal(s.players[1].rows[0].length, 1);
assert.equal(s.players[0].grave.length, 1);
assert.equal(s.players[1].grave.length, 1);
s = blank();
s.players[0].deck = [c("forest-deer"), c("forest-lynx")];
play(s, 0, c("forest-squirrel"), 0);
assert.equal(s.players[0].hand.length, 2);
assert.equal(E.total(s, 1), 1);
let spy = s.players[1].rows[0][0];
play(s, 1, c("decoy"), 0, spy.uid);
assert(s.players[1].hand.some((c) => c.uid === spy.uid));
assert.equal(E.total(s, 1), 0);
s = blank();
s.players[0].hand = [c("forest-hare")];
s.players[0].deck = [c("forest-hare")];
play(s, 0, c("forest-hare"), 0);
assert.equal(s.players[0].rows[0].length, 3);
assert.equal(E.total(s, 0), 9);
s = blank();
let dead = c("forest-owl"),
  deadSpy = c("forest-squirrel");
s.players[0].grave = [dead, deadSpy, c("forest-moon")];
s.players[0].deck = [c("forest-deer")];
play(s, 0, c("forest-sage"), 2);
assert.equal(s.pending!.side, 0);
assert(E.act(s, 0, { kind: "revive", target: dead.uid }));
assert.equal(s.pending!.side, 0);
assert(E.act(s, 0, { kind: "revive", target: deadSpy.uid }));
assert.equal(s.pending, null);
assert.equal(s.players[0].hand.length, 1);
assert.equal(s.players[0].grave.length, 1);
assert.equal(E.total(s, 1), 1);
s = blank();
s.players[0].hand = [c("forest-deer")];
s.players[1].hand = [c("granite-boar")];
let snapshot = JSON.stringify(s);
assert(!E.act(s, 0, { kind: "play", uid: s.players[0].hand[0].uid, row: 2 }));
assert.equal(JSON.stringify(s), snapshot);
assert(!E.act(s, 1, { kind: "pass" }));
s = blank();
E.act(s, 0, { kind: "pass" });
E.act(s, 1, { kind: "pass" });
assert.equal(s.round, 2);
assert.deepEqual(
  s.players.map((p) => p.wins),
  [1, 1],
);
E.act(s, 1, { kind: "pass" });
E.act(s, 0, { kind: "pass" });
assert(s.over);
assert.equal(s.winner, null);
const stats = [0, 0, 0];
for (let n = 0; n < 150; n++) {
  let s = E.create(
    n % 2 ? "forest" : "granite",
    E.starter(n % 2 ? "forest" : "granite"),
  );
  let turns = 0;
  while (!s.over && turns++ < 160) {
    let side = s.turn;
    assert(E.act(s, side, E.ai(s, side)), `invalid AI action ${n} ${turns}`);
    for (let p of s.players) {
      let owned = [
        ...p.hand,
        ...p.deck,
        ...p.grave,
        ...p.rows.flat(),
        ...p.horn.filter((x) => x?.id),
      ];
      assert.equal(new Set(owned.map((c) => c?.uid)).size, owned.length);
      assert(E.total(s, s.players.indexOf(p)) >= 0);
    }
  }
  assert(s.over, `stuck game ${n}`);
  assert(s.history.length >= 2 && s.history.length <= 3);
  stats[s.winner === null ? 2 : s.winner]++;
}
console.log(
  "PASS: deck validation, legal actions, weather + bond + horn + hero, simultaneous scorch, spy + decoy, muster, chained medics, draws, 150 complete AI matches. Outcomes:",
  stats,
);
// Four decks, every directed matchup, and faction-specific leader effects.
for (const f of E.FACTIONS) {
  assert(E.validate(E.starter(f), f).valid);
  assert(
    E.available(f)
      .filter((c) => c.unit && c.f === f)
      .reduce((n, c) => n + c.max, 0) >= 25,
  );
  for (const d of E.available(f))
    assert(d.name.length === 3 && d.name.every(Boolean));
}
s = E.create("tides", E.starter("tides"), "sun");
let handBefore = s.players[0].hand.length,
  deckBefore = s.players[0].deck.length;
assert(E.act(s, 0, { kind: "leader" }));
assert.equal(s.players[0].hand.length, handBefore + 1);
assert.equal(s.players[0].deck.length, deckBefore - 1);
s.turn = 0;
assert(!E.act(s, 0, { kind: "leader" }));
s = E.create("sun", E.starter("sun"), "tides");
s.players[0].rows[0] = [c("sun-guard"), c("sun-sahir")];
assert.equal(E.total(s, 0), 17);
assert(E.act(s, 0, { kind: "leader" }));
assert.equal(E.total(s, 0), 24);
assert(s.players[0].horn[0]);
assert.equal(s.players[0].horn[2], null);
s = E.create("tides", E.starter("tides"), "sun");
s.players[0].deck = [];
assert(!E.leaderReady(s, 0));
assert(!E.act(s, 0, { kind: "leader" }));
let crossGames = 0;
for (const f of E.FACTIONS)
  for (const rival of E.FACTIONS.filter((x) => x !== f))
    for (let n = 0; n < 12; n++) {
      const s = E.create(f, E.starter(f), rival);
      assert.equal(s.players[1].f, rival);
      let turn = 0;
      while (!s.over && turn++ < 180) assert(E.act(s, s.turn, E.ai(s, s.turn)));
      assert(s.over, `Unfinished ${f} vs ${rival}`);
      crossGames++;
    }
console.log(
  "PASS:",
  crossGames,
  "matches across all 12 faction matchups; new leader actions and three-language card names.",
);
// Each unit definition has unique artwork; neutral remains explicitly neutral.
const units = Object.values(E.cards).filter((c) => c.unit);
assert.equal(new Set(units.map((c) => c.art)).size, units.length);
assert.equal(E.cards.wanderer.f, "neutral");
let difficultyMatches = 0;
for (const level of E.DIFFICULTIES)
  for (const f of E.FACTIONS)
    for (const rival of E.FACTIONS.filter((x) => x !== f))
      for (let n = 0; n < 4; n++) {
        const state = E.create(f, E.starter(f), rival, level);
        assert.equal(state.difficulty, level);
        let turns = 0;
        while (!state.over && turns++ < 180)
          assert(
            E.act(state, state.turn, E.ai(state, state.turn)),
            `${level}: illegal action`,
          );
        assert(state.over, `${level}: stuck`);
        difficultyMatches++;
      }
// Hidden enemy card identities cannot affect deterministic normal/hard decisions.
for (const level of ["normal", "hard"]) {
  const a = E.create("tides", E.starter("tides"), "sun", level),
    b = structuredClone(a);
  b.players[0].hand = b.players[0].hand.map((c) => ({
    ...c,
    id: "forest-moon",
  }));
  b.players[0].deck.reverse();
  assert.deepEqual(E.ai(a, 1), E.ai(b, 1));
}
console.log(
  "PASS:",
  difficultyMatches,
  "matches across all three difficulties; unique unit portraits; hidden-information independence.",
);
