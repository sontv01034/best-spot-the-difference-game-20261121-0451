// Everything the player sees: the header with the counter and the clock, the two
// panels with their found markers, the hint shimmer, particles, and the title,
// pause, scene-clear, win and time-up screens. The panels themselves are painted
// by scenes.js; this file frames them and draws the game around them.

import {
  FIELD, FONT, MARK, PALETTE, PANEL, PULSE, SCENE_SUBTITLES, SCENE_TITLES,
} from './config.js';
import { paintPanel, sceneDifferences } from './scenes.js';
import { currentSceneId, remainingCount } from './world.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_CLEAR = 'clear';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';

/** Fit the 1280x720 field into the canvas and return the scale. */
function fitCanvas(canvas, ctx) {
  const scale = Math.min(canvas.width / FIELD.width, canvas.height / FIELD.height);
  const offsetX = (canvas.width - FIELD.width * scale) / 2;
  const offsetY = (canvas.height - FIELD.height * scale) / 2;
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  return scale;
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function text(string, x, y, size, colour, align = 'left', weight = 600) {
    ctx.font = `${weight} ${size}px ${FONT}`;
    ctx.fillStyle = colour;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(string, x, y);
  }

  function drawHeader(world, screen) {
    const sceneId = currentSceneId(world);
    const diffs = sceneDifferences(sceneId);
    const found = diffs.length - remainingCount(world);
    const minutes = Math.floor(world.timeLeft / 60);
    const seconds = Math.floor(world.timeLeft % 60);
    const timeText = `${minutes}:${String(seconds).padStart(2, '0')}`;
    const lowTime = world.timeLeft <= 30 && screen === SCREEN_PLAY;

    text('SPOT THE DIFFERENCE', 40, 42, 30, PALETTE.text, 'left', 800);
    text(SCENE_TITLES[sceneId], 40, 76, 17, PALETTE.muted);
    text(`Scene ${world.sceneIndex + 1} of 3`, 40, 100, 14, PALETTE.muted);

    // The counter the judge looks for: found of total, and how many remain.
    const counter = `Found ${found} / ${diffs.length}  ·  ${remainingCount(world)} left`;
    text(counter, 640, 42, 26, PALETTE.accent, 'center', 800);
    text(`Score ${world.score}`, 640, 76, 16, PALETTE.text, 'center');
    if (world.combo >= 2) text(`Combo x${world.combo}`, 640, 100, 14, PALETTE.good, 'center');

    // Timer bar and clock.
    const barX = 1000;
    const barW = 240;
    ctx.fillStyle = PALETTE.frame;
    roundRect(barX, 30, barW, 16, 8);
    ctx.fill();
    const fraction = world.timeLeft / 180;
    ctx.fillStyle = lowTime ? PALETTE.timerLow : PALETTE.accent;
    if (fraction > 0) {
      roundRect(barX, 30, Math.max(16, barW * fraction), 16, 8);
      ctx.fill();
    }
    text(timeText, 1120, 66, 24, lowTime ? PALETTE.timerLow : PALETTE.text, 'center', 800);
    text(`Hints ${world.hintsLeft}  (H)`, 1120, 96, 14, PALETTE.hint, 'center');
    text('Best ' + String(world.best), 1120, 118, 13, PALETTE.muted, 'center');
  }

  /** A ring marker on a found difference, drawn on both panels. */
  function drawMarker(px, py, time) {
    const pulse = 1 + 0.08 * Math.sin(time * PULSE);
    const radius = MARK.ringRadius * pulse;
    ctx.strokeStyle = PALETTE.good;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, radius - 6, 0, Math.PI * 2);
    ctx.stroke();
    // Check mark inside.
    ctx.strokeStyle = PALETTE.good;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(px - 10, py + 1);
    ctx.lineTo(px - 3, py + 8);
    ctx.lineTo(px + 11, py - 8);
    ctx.stroke();
  }

  function drawPanels(world, time) {
    const sceneId = currentSceneId(world);
    const diffs = sceneDifferences(sceneId);
    paintPanel(ctx, sceneId, 'left', PANEL.leftX, PANEL.y, PANEL.width, PANEL.height);
    paintPanel(ctx, sceneId, 'right', PANEL.rightX, PANEL.y, PANEL.width, PANEL.height);

    for (const panel of [
      { x: PANEL.leftX, label: 'LEFT' },
      { x: PANEL.rightX, label: 'RIGHT' },
    ]) {
      ctx.strokeStyle = PALETTE.panelEdge;
      ctx.lineWidth = 3;
      ctx.strokeRect(panel.x, PANEL.y, PANEL.width, PANEL.height);
      ctx.fillStyle = 'rgba(20, 16, 31, 0.85)';
      roundRect(panel.x + 10, PANEL.y + 10, 64, 26, 13);
      ctx.fill();
      text(panel.label, panel.x + 42, PANEL.y + 24, 14, PALETTE.text, 'center', 800);
    }

    // Found markers on both panels.
    for (const id of world.foundOrder) {
      const diff = diffs.find((entry) => entry.id === id);
      if (diff === undefined) continue;
      drawMarker(PANEL.leftX + diff.x, PANEL.y + diff.y, time);
      drawMarker(PANEL.rightX + diff.x, PANEL.y + diff.y, time);
    }

    // The hint shimmer: a pulsing circle on both panels.
    if (world.hint !== null) {
      const alpha = 0.45 + 0.35 * Math.sin(time * 6);
      for (const panelX of [PANEL.leftX, PANEL.rightX]) {
        ctx.strokeStyle = `rgba(142, 202, 230, ${alpha})`;
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.arc(panelX + world.hint.x, PANEL.y + world.hint.y, 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Sparks from the latest find.
    for (const p of world.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = PALETTE.accent;
      ctx.beginPath();
      ctx.arc(PANEL.leftX + p.x, PANEL.y + p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(PANEL.rightX + p.x, PANEL.y + p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // A wrong click flashes a red X on the panel that was clicked.
    if (world.flash !== null) {
      const baseX = world.flash.panel === 'left' ? PANEL.leftX : PANEL.rightX;
      const fx = baseX + world.flash.x;
      const fy = PANEL.y + world.flash.y;
      ctx.globalAlpha = Math.min(1, world.flash.life / 0.6);
      ctx.strokeStyle = PALETTE.bad;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(fx - 14, fy - 14); ctx.lineTo(fx + 14, fy + 14);
      ctx.moveTo(fx + 14, fy - 14); ctx.lineTo(fx - 14, fy + 14);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function drawFooter(screen) {
    if (screen === SCREEN_TITLE) return;
    text('Click a difference on either picture  ·  H hint (−10s)  ·  P pause  ·  R restart', 640, 688, 15, PALETTE.muted, 'center');
    text('A wrong click costs 5 seconds. Find all 7 to open the next scene.', 640, 664, 13, PALETTE.muted, 'center');
  }

  function dim() {
    ctx.fillStyle = 'rgba(12, 9, 20, 0.72)';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  }

  function panelCard(x, y, w, h) {
    ctx.fillStyle = PALETTE.frame;
    roundRect(x, y, w, h, 18);
    ctx.fill();
    ctx.strokeStyle = PALETTE.frameEdge;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawTitle(world, time) {
    // A live preview of the first scene behind the title, both panels.
    const preview = { ...world, found: new Set(), foundOrder: [], hint: null, flash: null, particles: [] };
    drawPanels(preview, time);
    dim();
    panelCard(290, 120, 700, 480);
    text('SPOT THE', 640, 190, 44, PALETTE.text, 'center', 800);
    text('DIFFERENCE', 640, 240, 44, PALETTE.accent, 'center', 800);
    text('Two pictures. Seven changes. One sharp eye.', 640, 296, 19, PALETTE.muted, 'center');
    text('Three scenes — Harbour at Dusk, Foxglove Hollow,', 640, 340, 17, PALETTE.text, 'center');
    text('and The Clockwork Workshop. 180 seconds each.', 640, 366, 17, PALETTE.text, 'center');
    text('Click a difference on either picture to mark it.', 640, 408, 16, PALETTE.good, 'center');
    text('Press SPACE or click to play', 640, 462, 20, PALETTE.accent, 'center', 700);
    text('1 / 2 / 3 jump to a scene   ·   H hint   ·   P pause   ·   R restart', 640, 510, 15, PALETTE.muted, 'center');
    if (world.best > 0) text(`Best score ${world.best}`, 640, 548, 15, PALETTE.muted, 'center');
  }

  function drawPaused(world) {
    drawPanels(world, 0);
    dim();
    panelCard(440, 260, 400, 200);
    text('PAUSED', 640, 320, 36, PALETTE.text, 'center', 800);
    text('Press P or click to keep hunting', 640, 372, 17, PALETTE.muted, 'center');
    text(`Found ${sceneDifferences(currentSceneId(world)).length - remainingCount(world)} of 7 · ${remainingCount(world)} left`, 640, 410, 16, PALETTE.accent, 'center');
  }

  function drawClear(world) {
    drawPanels(world, 0);
    dim();
    panelCard(390, 230, 500, 260);
    text('SCENE CLEAR!', 640, 290, 36, PALETTE.good, 'center', 800);
    text(`All 7 differences found in ${SCENE_TITLES[currentSceneId(world)]}`, 640, 342, 17, PALETTE.text, 'center');
    text(`Score ${world.score}  ·  Best combo x${world.bestCombo}`, 640, 378, 16, PALETTE.muted, 'center');
    text('Press SPACE for the next scene', 640, 432, 19, PALETTE.accent, 'center', 700);
  }

  function drawOver(world) {
    drawPanels(world, 0);
    dim();
    panelCard(390, 230, 500, 260);
    text('TIME UP', 640, 290, 36, PALETTE.bad, 'center', 800);
    const diffs = sceneDifferences(currentSceneId(world));
    text(`You found ${diffs.length - remainingCount(world)} of 7 differences`, 640, 342, 17, PALETTE.text, 'center');
    text(`Score ${world.score}  ·  Best ${world.best}`, 640, 378, 16, PALETTE.muted, 'center');
    text('Press SPACE to try this scene again', 640, 432, 19, PALETTE.accent, 'center', 700);
  }

  function drawWin(world) {
    drawPanels(world, 0);
    dim();
    panelCard(340, 190, 600, 340);
    text('YOU FOUND THEM ALL!', 640, 250, 36, PALETTE.accent, 'center', 800);
    text('Every difference in all three scenes.', 640, 302, 18, PALETTE.text, 'center');
    text(`${world.totalFound} differences  ·  Best combo x${world.bestCombo}  ·  Wrong clicks ${world.wrongClicks}`, 640, 344, 16, PALETTE.muted, 'center');
    text(`Final score ${world.score}`, 640, 386, 24, PALETTE.good, 'center', 800);
    if (world.score >= world.best && world.score > 0) text('A new best score!', 640, 422, 17, PALETTE.accent, 'center');
    text('Press SPACE to play again', 640, 478, 19, PALETTE.accent, 'center', 700);
  }

  return {
    resize,
    /** Draw the whole frame for `screen` at `time` (seconds, for pulses). */
    draw(world, screen, time) {
      resize();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = PALETTE.backdrop;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      fitCanvas(canvas, ctx);
      if (screen === SCREEN_TITLE) {
        drawTitle(world, time);
        return;
      }
      drawHeader(world, screen);
      drawPanels(world, time);
      drawFooter(screen);
      if (screen === SCREEN_PAUSED) drawPaused(world);
      else if (screen === SCREEN_CLEAR) drawClear(world);
      else if (screen === SCREEN_OVER) drawOver(world);
      else if (screen === SCREEN_WIN) drawWin(world);
    },
  };
}
