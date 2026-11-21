// The game state: which scene is up, which differences are found, the clock, the
// score, hints and wrong clicks. No drawing here — render.js reads this state.

import { CLICK_RADIUS, HINTS_PER_SCENE, SCORE, SCENE_ORDER, TIMER } from './config.js';
import { sceneDifferences } from './scenes.js';

export const EVENT_NONE = 0;
export const EVENT_FOUND = 1;
export const EVENT_WRONG = 2;
export const EVENT_SCENE_CLEAR = 4;
export const EVENT_TIME_UP = 8;
export const EVENT_HINT = 16;

export function createWorld() {
  return {
    sceneIndex: 0,
    found: new Set(),
    foundOrder: [],
    timeLeft: TIMER.start,
    score: 0,
    combo: 0,
    bestCombo: 0,
    hintsLeft: HINTS_PER_SCENE,
    hint: null,
    wrongClicks: 0,
    flash: null,
    particles: [],
    scenesCleared: 0,
    totalFound: 0,
    won: false,
    over: false,
    startedAt: 0,
  };
}

/** The id of the scene currently being played. */
export function currentSceneId(world) {
  return SCENE_ORDER[world.sceneIndex];
}

/** How many differences the current scene has, and how many are found. */
export function remainingCount(world) {
  return sceneDifferences(currentSceneId(world)).length - world.found.size;
}

/** Start (or restart) a scene from scratch. */
export function startScene(world, index) {
  world.sceneIndex = index;
  world.found = new Set();
  world.foundOrder = [];
  world.timeLeft = TIMER.start;
  world.combo = 0;
  world.hintsLeft = HINTS_PER_SCENE;
  world.hint = null;
  world.flash = null;
  world.particles = [];
  world.won = false;
  world.over = false;
}

/** Advance the clock; returns EVENT_TIME_UP when it hits zero. */
export function stepWorld(world, dt) {
  if (world.over || world.won) return EVENT_NONE;
  world.timeLeft = Math.max(0, world.timeLeft - dt);
  for (let index = world.particles.length - 1; index >= 0; index -= 1) {
    const p = world.particles[index];
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 260 * dt;
    if (p.life <= 0) world.particles.splice(index, 1);
  }
  if (world.flash !== null) {
    world.flash.life -= dt;
    if (world.flash.life <= 0) world.flash = null;
  }
  if (world.timeLeft <= 0) {
    world.over = true;
    return EVENT_TIME_UP;
  }
  return EVENT_NONE;
}

/**
 * A click in panel space: `panel` is 'left' or 'right', `x`/`y` are panel
 * coordinates (0..560, 0..480). Returns an event flag; found differences are
 * recorded once, whichever panel was clicked.
 */
export function clickAt(world, panel, x, y) {
  if (world.over || world.won) return EVENT_NONE;
  const diffs = sceneDifferences(currentSceneId(world));
  let best = null;
  let bestDistance = Infinity;
  for (const diff of diffs) {
    if (world.found.has(diff.id)) continue;
    const dx = x - diff.x;
    const dy = y - diff.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = diff;
    }
  }
  if (best !== null && bestDistance <= CLICK_RADIUS) {
    world.found.add(best.id);
    world.foundOrder.push(best.id);
    world.totalFound += 1;
    world.combo += 1;
    world.bestCombo = Math.max(world.bestCombo, world.combo);
    world.score += SCORE.find + SCORE.comboStep * (world.combo - 1);
    world.hint = null;
    burst(world, best);
    if (world.found.size === diffs.length) {
      world.score += SCORE.sceneBonus + Math.round(world.timeLeft) * SCORE.timeBonusPerSecond;
      world.scenesCleared += 1;
      if (world.sceneIndex + 1 >= SCENE_ORDER.length) {
        world.won = true;
        return EVENT_FOUND | EVENT_SCENE_CLEAR;
      }
      return EVENT_FOUND | EVENT_SCENE_CLEAR;
    }
    return EVENT_FOUND;
  }
  world.wrongClicks += 1;
  world.combo = 0;
  world.timeLeft = Math.max(0, world.timeLeft - TIMER.wrongCost);
  world.flash = { panel, x, y, life: 0.6 };
  if (world.timeLeft <= 0) {
    world.over = true;
    return EVENT_WRONG | EVENT_TIME_UP;
  }
  return EVENT_WRONG;
}

/** Spend a hint: reveal the next unfound difference for a few seconds. */
export function useHint(world) {
  if (world.over || world.won || world.hintsLeft <= 0) return EVENT_NONE;
  const diffs = sceneDifferences(currentSceneId(world));
  const next = diffs.find((diff) => !world.found.has(diff.id)) ?? null;
  if (next === null) return EVENT_NONE;
  world.hintsLeft -= 1;
  world.combo = 0;
  world.timeLeft = Math.max(0, world.timeLeft - TIMER.hintCost);
  world.hint = { id: next.id, x: next.x, y: next.y, life: 4 };
  return EVENT_HINT;
}

/** Move to the next scene after a clear, or restart the current one. */
export function nextScene(world) {
  if (world.sceneIndex + 1 < SCENE_ORDER.length) {
    startScene(world, world.sceneIndex + 1);
    return true;
  }
  return false;
}

/** A burst of sparks at a found difference, in panel space on both panels. */
function burst(world, diff) {
  for (let index = 0; index < 22; index += 1) {
    const angle = (index / 22) * Math.PI * 2;
    const speed = 60 + (index % 5) * 26;
    world.particles.push({
      x: diff.x,
      y: diff.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 40,
      life: 0.7,
      maxLife: 0.7,
      size: 3 + (index % 3),
    });
  }
}
