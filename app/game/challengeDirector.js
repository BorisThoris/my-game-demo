import { emitTelemetryEvent } from "./telemetry.js";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const pickWrongAnswers = (answer, rng) => {
  const offsets = [1, 2, 3, 4, 5, 6].sort(() => rng() - 0.5);
  const wrong = [];

  offsets.forEach(offset => {
    if (wrong.length >= 2) {
      return;
    }

    const candidate = answer + (rng() > 0.5 ? offset : -offset);
    if (candidate !== answer && candidate >= 0 && !wrong.includes(candidate)) {
      wrong.push(candidate);
    }
  });

  while (wrong.length < 2) {
    wrong.push(answer + wrong.length + 7);
  }

  return wrong;
};

const shuffle = (items, rng) => {
  const clone = [...items];

  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }

  return clone;
};

const buildMathChallenge = (rng, intensity) => {
  const ceiling = 8 + Math.floor(intensity * 10);
  const first = 2 + Math.floor(rng() * ceiling);
  const second = 2 + Math.floor(rng() * ceiling);
  const operator = rng() > 0.5 ? "+" : "-";
  const answer = operator === "+" ? first + second : Math.max(0, first - second);
  const options = shuffle([answer, ...pickWrongAnswers(answer, rng)], rng);

  return {
    type: "math-rush",
    title: "Quick Math Burst",
    prompt: `${first} ${operator} ${second} = ?`,
    options,
    correctIndex: options.indexOf(answer)
  };
};

const buildSimonChallenge = rng => {
  const symbols = ["▲", "■", "●", "◆"];
  const seqLength = 3 + Math.floor(rng() * 2);
  const sequence = Array.from({ length: seqLength }, () =>
    symbols[Math.floor(rng() * symbols.length)]
  );
  const correct = sequence.join(" ");
  const wrongA = shuffle(sequence, rng).join(" ");
  const wrongB = shuffle([...sequence, symbols[Math.floor(rng() * symbols.length)]], rng)
    .slice(0, seqLength)
    .join(" ");
  const options = shuffle([correct, wrongA, wrongB], rng);

  return {
    type: "simon-says",
    title: "Simon Pulse",
    prompt: `Remember: ${correct}`,
    options,
    correctIndex: options.indexOf(correct)
  };
};

const buildLogicChallenge = (rng, intensity) => {
  const magnitude = 10 + Math.floor(intensity * 25);
  const left = 1 + Math.floor(rng() * magnitude);
  const right = 1 + Math.floor(rng() * magnitude);
  const correct = left > right ? "Left" : left < right ? "Right" : "Equal";
  const options = shuffle(["Left", "Right", "Equal"], rng);

  return {
    type: "logic-gate",
    title: "Logic Gate",
    prompt: `Which is larger? ${left} vs ${right}`,
    options,
    correctIndex: options.indexOf(correct)
  };
};

const buildSequenceChallenge = (rng, intensity) => {
  const base = 2 + Math.floor(rng() * 4);
  const step = 1 + Math.floor(intensity * 3);
  const length = 4;
  const sequence = Array.from({ length }, (_, index) => base + index * step);
  const answer = base + length * step;
  const options = shuffle([
    answer,
    answer + step,
    Math.max(0, answer - (1 + Math.floor(rng() * 3)))
  ], rng);

  return {
    type: "sequence-lock",
    title: "Sequence Lock",
    prompt: `${sequence.join(", ")}, ?`,
    options,
    correctIndex: options.indexOf(answer)
  };
};

const CHALLENGE_BUILDERS = [buildMathChallenge, buildSimonChallenge, buildLogicChallenge, buildSequenceChallenge];

export default class ChallengeDirector {
  constructor(random = Math.random) {
    this.random = random;
    this.reset();
  }

  reset() {
    this.nextTriggerScore = 12;
    this.lastChallengeScore = 0;
  }

  maybeCreateChallenge(score, intensity) {
    if (score < this.nextTriggerScore) {
      return null;
    }

    this.lastChallengeScore = score;
    this.nextTriggerScore += 14 + Math.floor(this.random() * 7);
    const builder = CHALLENGE_BUILDERS[Math.floor(this.random() * CHALLENGE_BUILDERS.length)];
    const challenge = builder(this.random, clamp(intensity, 0.2, 1.2));

    emitTelemetryEvent("challenge_spawned", {
      challengeType: challenge.type,
      intensity
    });

    return {
      ...challenge,
      durationMs: 6500 - Math.floor(clamp(intensity, 0, 1) * 1800),
      reward: {
        scoreBonus: 3 + Math.floor(intensity * 3),
        shieldBonus: intensity > 0.7 ? 1 : 0,
        perkPoint: 1
      }
    };
  }

  evaluate(challenge, selectedIndex, remainingMs) {
    const success =
      selectedIndex === challenge.correctIndex && remainingMs > 0;

    emitTelemetryEvent("challenge_evaluated", {
      challengeType: challenge?.type ?? "unknown",
      selectedIndex,
      correctIndex: challenge?.correctIndex,
      remainingMs,
      success
    });

    if (!success) {
      return {
        success: false,
        message: "Challenge failed. Survive and catch the next one.",
        reward: {
          scoreBonus: 0,
          shieldBonus: 0,
          perkPoint: 0,
          shieldPenalty: 1
        }
      };
    }

    return {
      success: true,
      message: `Perfect. +${challenge.reward.scoreBonus} score and momentum up.`,
      reward: {
        ...challenge.reward,
        shieldPenalty: 0
      }
    };
  }
}
