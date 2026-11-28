import { test } from "node:test";
import assert from "node:assert/strict";
import { SAHNELER, TOPLAM, pencere, hizGerekli } from "./ses.mjs";

test("sahneler boşluksuz ve toplam süreyi kapsar", () => {
  assert.equal(SAHNELER[0][0], 0);
  for (let i = 1; i < SAHNELER.length; i++) assert.equal(SAHNELER[i][0], SAHNELER[i - 1][1]);
  assert.equal(SAHNELER.at(-1)[1], TOPLAM);
});

test("sığan ses hızlandırılmaz, uzun ses oranında hızlanır", () => {
  assert.equal(hizGerekli(1, 0), 1);
  assert.ok(Math.abs(hizGerekli(pencere(1) * 1.2, 1) - 1.2) < 1e-9);
});
