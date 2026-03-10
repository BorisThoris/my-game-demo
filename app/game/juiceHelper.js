/**
 * Minimal "juice" helper using Phaser tweens: impact/squash (scale bounce), short flash,
 * camera shake/zoom, and particle burst presets for key moments.
 * Use when no external juice plugin is available; camera shake/zoom use Phaser built-ins.
 */

/**
 * Applies an impact/squash effect to a display object: scale bounce (scaleX/scaleY up then back) and optional flash.
 * @param {Phaser.Scene} scene - The scene (for tweens).
 * @param {Phaser.GameObjects.GameObject} target - Target to animate (e.g. player sprite).
 * @param {Object} [opts] - Options: { flash: boolean } (default true for flash).
 */
export function impactSquash(scene, target, opts = {}) {
  const { flash = true } = opts;
  const startScaleX = target.scaleX;
  const startScaleY = target.scaleY;

  scene.tweens.add({
    targets: target,
    scaleX: startScaleX * 1.2,
    scaleY: startScaleY * 1.15,
    duration: 50,
    ease: "Power2.Out",
    yoyo: true,
    hold: 0,
    onComplete: () => {
      target.setScale(startScaleX, startScaleY);
    }
  });

  if (flash && target.setTint) {
    target.setTint(0xffffff);
    scene.time.delayedCall(80, () => {
      if (target.scene) target.clearTint();
    });
  }
}

/**
 * Screen shake using the main camera. Use for player hit, boss spawn, boss defeat, death.
 * @param {Phaser.Scene} scene - Scene with cameras.main.
 * @param {number} [duration=150] - Shake duration in ms.
 * @param {number} [intensity=0.004] - Shake intensity (pixels).
 */
export function cameraShake(scene, duration = 150, intensity = 0.004) {
  if (scene.cameras?.main) {
    scene.cameras.main.shake(duration, intensity);
  }
}

/**
 * Subtle camera zoom pulse (zoom in then back). Use sparingly for boss spawn, exit unlock.
 * @param {Phaser.Scene} scene - Scene with cameras.main.
 * @param {number} [peakZoom=1.04] - Zoom at peak.
 * @param {number} [duration=200] - Total duration (half in, half out).
 */
export function cameraZoomPulse(scene, peakZoom = 1.04, duration = 200) {
  const cam = scene.cameras?.main;
  if (!cam) return;
  const startZoom = cam.zoom;
  const half = duration / 2;
  scene.tweens.add({
    targets: cam,
    zoom: peakZoom,
    duration: half,
    ease: "Power2.Out",
    onComplete: () => {
      scene.tweens.add({
        targets: cam,
        zoom: startZoom,
        duration: half,
        ease: "Power2.In"
      });
    }
  });
}

/**
 * Particle burst preset for phase change (center screen). Uses scene.emitParticleBurst.
 * @param {Phaser.Scene} scene - Scene with emitParticleBurst(x, y, quantity, lifespan, scaleStart, tint).
 * @param {number} x - X position.
 * @param {number} y - Y position.
 */
export function emitPhaseChangeBurst(scene, x, y) {
  if (typeof scene.emitParticleBurst === "function") {
    scene.emitParticleBurst(x, y, 12, 280, 0.4, 0x55d6ff);
  }
}

/**
 * Particle burst preset for objective complete. Uses scene.emitParticleBurst.
 * @param {Phaser.Scene} scene - Scene with emitParticleBurst(x, y, quantity, lifespan, scaleStart, tint).
 * @param {number} x - X position.
 * @param {number} y - Y position.
 */
export function emitObjectiveCompleteBurst(scene, x, y) {
  if (typeof scene.emitParticleBurst === "function") {
    scene.emitParticleBurst(x, y, 10, 320, 0.35, 0x8be9b1);
  }
}

export function emitBossTelegraph(scene, x, y, signature = "fan") {
  const tintBySignature = {
    fan: 0xff9f43,
    aimedBurst: 0xff6b6b,
    cross: 0x9d4edd
  };
  if (typeof scene.emitParticleBurst === "function") {
    scene.emitParticleBurst(x, y, 10, 260, 0.32, tintBySignature[signature] ?? 0xff9f43);
  }

  const ring = scene.add?.circle?.(x, y, 24, 0xffffff, 0.14);
  if (!ring) return;
  ring.setStrokeStyle(2, tintBySignature[signature] ?? 0xffffff, 0.55);
  ring.setDepth(6);
  scene.tweens.add({
    targets: ring,
    radius: 68,
    alpha: 0,
    duration: 260,
    ease: "Sine.Out",
    onComplete: () => ring.destroy()
  });
}

export function playBossTelegraphSfx(scene, signature = "fan") {
  const keyBySignature = {
    fan: "sfxPhaseChange",
    aimedBurst: "sfxObjectiveComplete",
    cross: "sfxChallengeComplete"
  };
  if (typeof scene.playEventSfx === "function") {
    scene.playEventSfx(keyBySignature[signature] ?? "sfxPhaseChange");
  }
}
