// Scene 1 — Harbour at Dusk. A quiet bay at sunset: sky, sea, a lighthouse, two
// boats and a pier. The base picture is identical on both panels; each entry of
// DIFFERENCES is painted on one side only, so the two views differ in exactly
// seven places. All drawing is in panel space, 560 wide by 480 tall.

export const HARBOR_ID = 'harbor';

/** Paint the shared base picture. `side` is 'left' or 'right'. */
export function paintHarbor(ctx, side) {
  // Dusk sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#2b2350');
  sky.addColorStop(0.55, '#7a4a72');
  sky.addColorStop(1, '#e08a4e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 560, 300);

  // Low sun and its reflection path.
  ctx.fillStyle = '#ffb347';
  ctx.beginPath();
  ctx.arc(430, 250, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 179, 71, 0.25)';
  ctx.fillRect(408, 300, 44, 180);

  // Distant hills.
  ctx.fillStyle = '#3d3358';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.quadraticCurveTo(120, 240, 260, 296);
  ctx.quadraticCurveTo(380, 260, 560, 300);
  ctx.lineTo(560, 300);
  ctx.closePath();
  ctx.fill();

  // Sea.
  const sea = ctx.createLinearGradient(0, 300, 0, 480);
  sea.addColorStop(0, '#4a5a8a');
  sea.addColorStop(1, '#232c4e');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 300, 560, 180);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 2;
  for (let row = 0; row < 5; row += 1) {
    const y = 322 + row * 32;
    ctx.beginPath();
    for (let x = 20; x <= 540; x += 40) {
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 20, y - 6, x + 40, y);
    }
    ctx.stroke();
  }

  // Clouds.
  ctx.fillStyle = 'rgba(255, 214, 180, 0.85)';
  cloud(ctx, 90, 80, 1);
  cloud(ctx, 300, 55, 0.7);
  cloud(ctx, 480, 110, 0.8);

  // Lighthouse on the right headland.
  ctx.fillStyle = '#5a4632';
  ctx.beginPath();
  ctx.moveTo(500, 300);
  ctx.lineTo(560, 300);
  ctx.lineTo(560, 268);
  ctx.lineTo(500, 268);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f4efe6';
  ctx.fillRect(508, 150, 34, 120);
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(508, 180, 34, 18);
  ctx.fillRect(508, 222, 34, 18);
  ctx.fillStyle = '#2b2350';
  ctx.fillRect(504, 128, 42, 24);
  ctx.fillStyle = '#ffe08a';
  ctx.fillRect(512, 134, 26, 12);
  // Light beam sweeping left over the water.
  ctx.fillStyle = 'rgba(255, 224, 138, 0.20)';
  ctx.beginPath();
  ctx.moveTo(512, 140);
  ctx.lineTo(300, 90);
  ctx.lineTo(300, 190);
  ctx.closePath();
  ctx.fill();

  // Pier on the left, with two posts and a lantern pole.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(20, 340, 150, 14);
  ctx.fillRect(30, 354, 12, 60);
  ctx.fillRect(140, 354, 12, 60);
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(24, 326, 8, 16);
  ctx.fillRect(24, 300, 6, 28);
  ctx.fillStyle = '#ffe08a';
  ctx.beginPath();
  ctx.arc(27, 296, 7, 0, Math.PI * 2);
  ctx.fill();

  // Boat one: a small sailboat mid-bay.
  boat(ctx, 330, 350, 1, '#e8e0d0', '#c0392b');
  // Boat two: a rowboat near the pier.
  boat(ctx, 210, 410, 0.7, '#d8c9a3', '#2e6f8e');

  // A few gulls far away (shared; the differing gull is a difference, not this).
  ctx.strokeStyle = '#2b2350';
  ctx.lineWidth = 2;
  gull(ctx, 200, 90);
  gull(ctx, 250, 70);
}

function cloud(ctx, x, y, scale) {
  ctx.beginPath();
  ctx.arc(x, y, 22 * scale, 0, Math.PI * 2);
  ctx.arc(x + 26 * scale, y + 4 * scale, 18 * scale, 0, Math.PI * 2);
  ctx.arc(x - 26 * scale, y + 6 * scale, 16 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function gull(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.quadraticCurveTo(x - 4, y - 7, x, y);
  ctx.quadraticCurveTo(x + 4, y - 7, x + 10, y);
  ctx.stroke();
}

function boat(ctx, x, y, scale, hull, sail) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = hull;
  ctx.beginPath();
  ctx.moveTo(-34, 0);
  ctx.lineTo(34, 0);
  ctx.lineTo(22, 16);
  ctx.lineTo(-22, 16);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3a2a1a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -44);
  ctx.stroke();
  ctx.fillStyle = sail;
  ctx.beginPath();
  ctx.moveTo(0, -44);
  ctx.lineTo(0, -4);
  ctx.lineTo(26, -4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * The seven differences. Each has panel coordinates, a click radius, a hint, the
 * side it is painted on, and a painter that draws only that difference.
 */
export const HARBOR_DIFFERENCES = [
  {
    id: 'gull', x: 120, y: 70, r: 26, side: 'left',
    hint: 'Something is flying in the sky, top left.',
    paint(ctx) { ctx.strokeStyle = '#2b2350'; ctx.lineWidth = 2.5; gull(ctx, 120, 70); },
  },
  {
    id: 'fish', x: 300, y: 402, r: 26, side: 'right',
    hint: 'Something jumped out of the water, centre right.',
    paint(ctx) {
      ctx.fillStyle = '#9fc3e8';
      ctx.beginPath();
      ctx.ellipse(300, 402, 16, 7, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(314, 398); ctx.lineTo(326, 392); ctx.lineTo(322, 406);
      ctx.closePath(); ctx.fill();
    },
  },
  {
    id: 'flag', x: 356, y: 300, r: 24, side: 'left',
    hint: 'Look at the mast of the sailboat.',
    paint(ctx) {
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.moveTo(330, 306); ctx.lineTo(352, 312); ctx.lineTo(330, 318);
      ctx.closePath(); ctx.fill();
    },
  },
  {
    id: 'buoy', x: 200, y: 432, r: 24, side: 'left',
    hint: 'Something bobs on the water, lower left.',
    paint(ctx) {
      ctx.fillStyle = '#e5534b';
      ctx.beginPath(); ctx.arc(200, 432, 12, Math.PI, 0); ctx.fill();
      ctx.fillRect(188, 432, 24, 6);
      ctx.fillStyle = '#f4efe6';
      ctx.fillRect(196, 414, 8, 12);
    },
  },
  {
    id: 'stars', x: 62, y: 46, r: 30, side: 'right',
    hint: 'The first stars are out, top left corner.',
    paint(ctx) {
      ctx.fillStyle = '#fff6c9';
      star(ctx, 48, 36); star(ctx, 70, 52); star(ctx, 88, 34); star(ctx, 60, 66);
    },
  },
  {
    id: 'pier-glow', x: 27, y: 296, r: 26, side: 'right',
    hint: 'The pier lantern glows differently.',
    paint(ctx) {
      ctx.fillStyle = 'rgba(255, 224, 138, 0.35)';
      ctx.beginPath(); ctx.arc(27, 296, 22, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff3b0';
      ctx.beginPath(); ctx.arc(27, 296, 10, 0, Math.PI * 2); ctx.fill();
    },
  },
  {
    id: 'lighthouse-window', x: 525, y: 200, r: 20, side: 'left',
    hint: 'Count the lit windows on the lighthouse.',
    paint(ctx) {
      ctx.fillStyle = '#ffe08a';
      ctx.fillRect(518, 192, 14, 16);
    },
  },
];

function star(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y - 6); ctx.lineTo(x + 2, y - 2); ctx.lineTo(x + 6, y);
  ctx.lineTo(x + 2, y + 2); ctx.lineTo(x, y + 6); ctx.lineTo(x - 2, y + 2);
  ctx.lineTo(x - 6, y); ctx.lineTo(x - 2, y - 2);
  ctx.closePath(); ctx.fill();
}
