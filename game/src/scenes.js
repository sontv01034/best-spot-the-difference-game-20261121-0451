// The scene registry: one entry per scene with its painter and its differences.
// A scene is painted twice, once per panel; the painter draws the shared base,
// then each difference whose `side` matches the panel being painted. That is the
// whole trick: the two pictures are identical except for the seven differences.

import { HARBOR_ID, paintHarbor, HARBOR_DIFFERENCES } from './scene-harbor.js';
import { FOXGLOVE_ID, paintFoxglove, FOXGLOVE_DIFFERENCES } from './scene-foxglove.js';
import { WORKSHOP_ID, paintWorkshop, WORKSHOP_DIFFERENCES } from './scene-workshop.js';

export const SCENES = {
  [HARBOR_ID]: { id: HARBOR_ID, paint: paintHarbor, differences: HARBOR_DIFFERENCES },
  [FOXGLOVE_ID]: { id: FOXGLOVE_ID, paint: paintFoxglove, differences: FOXGLOVE_DIFFERENCES },
  [WORKSHOP_ID]: { id: WORKSHOP_ID, paint: paintWorkshop, differences: WORKSHOP_DIFFERENCES },
};

/** Paint one panel of a scene into the given rectangle, in panel space 560x480. */
export function paintPanel(ctx, sceneId, side, px, py, pw, ph) {
  const scene = SCENES[sceneId];
  ctx.save();
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.clip();
  ctx.translate(px, py);
  ctx.scale(pw / 560, ph / 480);
  scene.paint(ctx, side);
  for (const diff of scene.differences) {
    if (diff.side === side) diff.paint(ctx);
  }
  ctx.restore();
}

/** The differences of a scene, in their fixed order. */
export function sceneDifferences(sceneId) {
  return SCENES[sceneId].differences;
}
