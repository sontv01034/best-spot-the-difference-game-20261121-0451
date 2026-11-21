// The screenshot scenes behind ?shot=start|play|clear|win, with &found=N
// pre-marking that many differences and &scene=harbor|foxglove|workshop picking
// the scene. Each scene is staged from the real game state — a fresh world with
// real clicks applied — so the frame is what a short game really looks like, and
// the same query always gives the same frame.
//
//   ?shot=start            title screen over the harbour scene
//   ?shot=play&found=2     mid-hunt: 2 found, 5 still unfound, counter visible
//   ?shot=play&found=3&scene=foxglove
//   ?shot=clear&found=7    scene-clear card over a finished scene
//   ?shot=win              win card over a finished third scene

import { SCENE_ORDER } from './config.js';
import { sceneDifferences } from './scenes.js';
import {
  SCREEN_CLEAR, SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN,
} from './render.js';
import { clickAt, nextScene, startScene } from './world.js';

/** Stage `world` for the named shot; returns the screen to draw. */
export function stageShot(params, world) {
  const name = params.get('shot') ?? 'start';
  const sceneParam = params.get('scene');
  const sceneIndex = SCENE_ORDER.includes(sceneParam) ? SCENE_ORDER.indexOf(sceneParam) : 0;
  const foundParam = Number.parseInt(params.get('found') ?? '', 10);
  const foundCount = Number.isInteger(foundParam) ? Math.max(0, foundParam) : 0;

  startScene(world, sceneIndex);
  if (name === 'start') return SCREEN_TITLE;

  // Apply real clicks at the differences' own centres, in their fixed order,
  // so the markers, the score and the counter are all genuinely earned.
  // The win shot stages its own full run below, so it marks nothing here.
  const diffs = sceneDifferences(SCENE_ORDER[sceneIndex]);
  const toMark = name === 'clear' ? diffs.length : Math.min(foundCount, diffs.length);
  if (name !== 'win') {
    for (let index = 0; index < toMark; index += 1) {
      clickAt(world, 'left', diffs[index].x, diffs[index].y);
    }
  }

  if (name === 'win') {
    // Clear all three scenes in order, ending on the win card.
    for (let index = 0; index < SCENE_ORDER.length; index += 1) {
      startScene(world, index);
      const sceneDiffs = sceneDifferences(SCENE_ORDER[index]);
      for (const diff of sceneDiffs) clickAt(world, 'left', diff.x, diff.y);
      if (index + 1 < SCENE_ORDER.length) nextScene(world);
    }
    return SCREEN_WIN;
  }
  if (name === 'clear') return SCREEN_CLEAR;
  if (name === 'end') return SCREEN_OVER;
  return SCREEN_PLAY;
}
