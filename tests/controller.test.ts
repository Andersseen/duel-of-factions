import "@angular/compiler";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createGameController } from "../src/app/game/game.store";
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost",
});
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  localStorage: dom.window.localStorage,
});
const setViewport = (width: number, height = 844) => {
  Object.defineProperty(window, "innerWidth", {
    value: width,
    configurable: true,
  });
  Object.defineProperty(window, "innerHeight", {
    value: height,
    configurable: true,
  });
  window.dispatchEvent(new dom.window.Event("resize"));
};
setViewport(1366, 936);
const c = createGameController();
try {
  assert.equal(c.screen, "menu");
  assert.equal(document.body.dataset["theme"], "neutral");
  for (const faction of c.E.FACTIONS) {
    c.action("faction", { faction });
    assert.equal(document.body.dataset["theme"], faction);
    assert(c.valid.valid);
  }
  c.action("difficulty", { level: "hard" });
  c.action("prepare");
  assert.equal(c.game?.difficulty, "hard");
  assert.equal(c.startingHand.length, 10);
  // Phones show the whole opening hand too (no paging).
  setViewport(308, 741);
  assert.equal(c.startingHand.length, 10);
  setViewport(1366, 936);
  assert.equal(c.startingHand.length, 10);
  const old = c.startingHand[0];
  c.action("swap-preview", { uid: String(old.uid) });
  assert.equal(c.inspectId, old.id);
  c.action("swap", { uid: String(old.uid) });
  assert.equal(c.swaps, 1);
  assert.equal(c.modal, null);
  assert(c.swapped.has(c.startingHand[0].uid));
  const once = c.startingHand[0].uid;
  c.action("swap", { uid: String(once) });
  assert.equal(c.swaps, 1);
  c.action("settings");
  c.action("difficulty", { level: "easy" });
  assert.equal(c.game?.difficulty, "hard");
  assert.equal(c.difficulty, "easy");
  c.action("lang", { lang: "2" });
  assert.equal(c.t("play"), "New game");
  assert.equal(document.documentElement.lang, "en");
  c.action("close");
  c.action("begin");
  assert.equal(c.screen, "battle");
  // Phones get the whole hand in one swipeable strip; desktops page it.
  setViewport(390, 844);
  assert.equal(c.hand.length, c.game!.players[0].hand.length);
  assert.equal(c.handPages, 1);
  setViewport(1366, 936);
  const unit = c.hand.find((card) => c.E.def(card).unit)!;
  assert.equal(c.selectDrag(-1), false);
  assert.equal(c.selected, null);
  assert.equal(c.selectDrag(unit.uid), true);
  assert.equal(c.selected, unit.uid);
  const row = c.E.ROWS.indexOf(c.E.def(unit).row);
  const side = c.E.def(unit).ability === "spy" ? 1 : 0;
  assert(c.rowValid(side, row));
  c.drop(row);
  assert(c.game!.players[side].rows[row].some((card) => card.uid === unit.uid));
  assert.equal(c.selectDrag(unit.uid), false);
  c.action("menu");
  assert.equal(c.modal, "quit");
  c.action("quit");
  assert.equal(Boolean(c.game), false);
  assert.equal(c.screen, "menu");
  c.action("faction", { faction: "forest" });
  c.action("prepare");
  assert.equal((() => c.game)()?.difficulty, "easy");
} finally {
  c.destroy();
  dom.window.close();
}
console.log(
  "PASS: faction themes, desktop/mobile hands, mulligan constraints, settings persistence, fixed match difficulty, native actions and lifecycle cleanup.",
);
