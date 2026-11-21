// Mouse and keyboard input, translated into game actions. The canvas is scaled to
// the window, so clicks are mapped back into the 1280x720 logical field first.

import { FIELD, PANEL } from './config.js';

export const ACTION_CONFIRM = 1;
export const ACTION_PAUSE = 2;
export const ACTION_HINT = 4;
export const ACTION_RESTART = 8;
export const ACTION_SCENE_1 = 16;
export const ACTION_SCENE_2 = 32;
export const ACTION_SCENE_3 = 64;

/**
 * Attach listeners to `canvas`. Returns an object with `takeClicks()` (panel
 * clicks since the last call, in panel space) and `takeActions()` (a bitmask of
 * keyboard actions since the last call).
 */
export function createInput(canvas) {
  const clicks = [];
  let actions = 0;

  function toField(event) {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / FIELD.width, rect.height / FIELD.height);
    const offsetX = (rect.width - FIELD.width * scale) / 2;
    const offsetY = (rect.height - FIELD.height * scale) / 2;
    return {
      x: (event.clientX - rect.left - offsetX) / scale,
      y: (event.clientY - rect.top - offsetY) / scale,
    };
  }

  /** Which panel a field point falls in, with panel-local coordinates. */
  function toPanel(point) {
    if (point.y >= PANEL.y && point.y <= PANEL.y + PANEL.height) {
      if (point.x >= PANEL.leftX && point.x <= PANEL.leftX + PANEL.width) {
        return { panel: 'left', x: point.x - PANEL.leftX, y: point.y - PANEL.y };
      }
      if (point.x >= PANEL.rightX && point.x <= PANEL.rightX + PANEL.width) {
        return { panel: 'right', x: point.x - PANEL.rightX, y: point.y - PANEL.y };
      }
    }
    return null;
  }

  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    const panel = toPanel(toField(event));
    if (panel !== null) clicks.push(panel);
    else actions |= ACTION_CONFIRM;
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    switch (event.key) {
      case ' ':
      case 'Enter':
        actions |= ACTION_CONFIRM;
        event.preventDefault();
        break;
      case 'p':
      case 'P':
      case 'Escape':
        actions |= ACTION_PAUSE;
        break;
      case 'h':
      case 'H':
        actions |= ACTION_HINT;
        break;
      case 'r':
      case 'R':
        actions |= ACTION_RESTART;
        break;
      case '1':
        actions |= ACTION_SCENE_1;
        break;
      case '2':
        actions |= ACTION_SCENE_2;
        break;
      case '3':
        actions |= ACTION_SCENE_3;
        break;
      default:
        break;
    }
  });

  return {
    takeClicks() {
      return clicks.splice(0, clicks.length);
    },
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },
  };
}
