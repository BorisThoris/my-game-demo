import assert from "node:assert/strict";
import test from "node:test";
import ChallengeDirector from "../app/game/challengeDirector.js";

test("ChallengeDirector emits challenge after trigger score", () => {
  const director = new ChallengeDirector(() => 0.2);
  const none = director.maybeCreateChallenge(11, 0.4);
  assert.equal(none, null);

  const challenge = director.maybeCreateChallenge(12, 0.4);
  assert.ok(challenge);
  assert.equal(typeof challenge.prompt, "string");
  assert.equal(challenge.options.length, 3);
  assert.ok(challenge.correctIndex >= 0 && challenge.correctIndex < 3);
});

test("ChallengeDirector evaluates success and failure", () => {
  const director = new ChallengeDirector(() => 0.2);
  const challenge = {
    correctIndex: 1,
    reward: {
      scoreBonus: 4,
      shieldBonus: 1,
      perkPoint: 1
    }
  };

  const success = director.evaluate(challenge, 1, 2000);
  assert.equal(success.success, true);
  assert.equal(success.reward.scoreBonus, 4);

  const failure = director.evaluate(challenge, 0, 0);
  assert.equal(failure.success, false);
  assert.equal(failure.reward.scoreBonus, 0);
  assert.equal(failure.reward.shieldPenalty, 1);
});

test("ChallengeDirector can generate sequence lock challenge", () => {
  const director = new ChallengeDirector(() => 0.99);
  const challenge = director.maybeCreateChallenge(12, 1);
  assert.ok(challenge);
  assert.ok(challenge.type.length > 0);
  assert.equal(challenge.options.length, 3);
});
