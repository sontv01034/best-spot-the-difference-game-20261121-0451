// Scene 2 — Foxglove Hollow. A forest clearing where a fox naps among purple
// foxgloves, mushrooms and ferns. Same contract as the harbour scene: the base
// picture is identical on both panels, DIFFERENCES are painted on one side only.

export const FOXGLOVE_ID = 'foxglove';

export function paintFoxglove(ctx, side) {
  // Sky through the canopy.
  const sky = ctx.createLinearGradient(0, 0, 0, 240);
  sky.addColorStop(0, '#bfe3a8');
  sky.addColorStop(1, '#e8f3c9');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 560, 240);

  // Sunbeams.
  ctx.fillStyle = 'rgba(255, 244, 180, 0.35)';
  ctx.beginPath();
  ctx.moveTo(120, 0); ctx.lineTo(200, 0); ctx.lineTo(120, 240); ctx.lineTo(60, 240);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(380, 0); ctx.lineTo(430, 0); ctx.lineTo(480, 240); ctx.lineTo(420, 240);
  ctx.closePath(); ctx.fill();

  // Distant trees.
  ctx.fillStyle = '#5d8a4a';
  for (const [x, h] of [[40, 150], [150, 180], [300, 160], [430, 190], [520, 150]]) {
    ctx.beginPath();
    ctx.moveTo(x - 46, 240); ctx.lineTo(x, 240 - h); ctx.lineTo(x + 46, 240);
    ctx.closePath(); ctx.fill();
  }

  // Ground.
  const ground = ctx.createLinearGradient(0, 240, 0, 480);
  ground.addColorStop(0, '#7ba85c');
  ground.addColorStop(1, '#4c7038');
  ctx.fillStyle = ground;
  ctx.fillRect(0, 240, 560, 240);

  // Grass tufts.
  ctx.strokeStyle = '#3f6030';
  ctx.lineWidth = 2;
  for (let x = 20; x < 560; x += 34) {
    const y = 268 + ((x * 7) % 170);
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x - 5, y - 14);
    ctx.moveTo(x + 6, y); ctx.lineTo(x + 10, y - 12);
    ctx.moveTo(x + 12, y); ctx.lineTo(x + 14, y - 15);
    ctx.stroke();
  }

  // Big oak on the left.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(52, 150, 30, 150);
  ctx.fillStyle = '#4a7a35';
  ctx.beginPath(); ctx.arc(66, 120, 70, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(20, 160, 44, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(118, 158, 46, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3c6b2c';
  ctx.beginPath(); ctx.arc(66, 96, 44, 0, Math.PI * 2); ctx.fill();

  // Berry bush on the right.
  ctx.fillStyle = '#2f5d23';
  ctx.beginPath(); ctx.arc(500, 320, 52, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(460, 340, 36, 0, Math.PI * 2); ctx.fill();

  // Foxgloves: tall purple bells, left and centre.
  foxglove(ctx, 170, 330, 1);
  foxglove(ctx, 250, 360, 0.85);
  foxglove(ctx, 330, 340, 0.95);

  // Ferns along the bottom.
  ctx.strokeStyle = '#2f5d23';
  ctx.lineWidth = 3;
  for (const x of [60, 130, 420, 500]) {
    for (let k = -2; k <= 2; k += 1) {
      ctx.beginPath();
      ctx.moveTo(x, 470);
      ctx.quadraticCurveTo(x + k * 14, 430, x + k * 26, 408);
      ctx.stroke();
    }
  }

  // The sleeping fox, centre.
  fox(ctx, 280, 400);

  // Mushroom cluster, bottom right.
  mushroom(ctx, 440, 430, 1);
  mushroom(ctx, 468, 438, 0.7);
}

function foxglove(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = '#3f6030';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -90); ctx.stroke();
  ctx.fillStyle = '#9b59b6';
  for (let k = 0; k < 4; k += 1) {
    const by = -78 + k * 16;
    ctx.beginPath();
    ctx.ellipse(-10, by, 9, 12, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(10, by + 4, 9, 12, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#c77ddb';
  ctx.beginPath(); ctx.arc(0, -88, 8, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function mushroom(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#f4efe6';
  ctx.fillRect(-5, -16, 10, 20);
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.arc(0, -14, 18, Math.PI, 0);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f4efe6';
  ctx.beginPath(); ctx.arc(-8, -22, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(6, -26, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function fox(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  // Curled tail.
  ctx.strokeStyle = '#d2691e';
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-58, 8);
  ctx.quadraticCurveTo(-90, -6, -70, -34);
  ctx.stroke();
  ctx.strokeStyle = '#f4efe6';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-70, -34);
  ctx.quadraticCurveTo(-66, -40, -58, -38);
  ctx.stroke();
  // Body.
  ctx.fillStyle = '#e07b39';
  ctx.beginPath();
  ctx.ellipse(0, 0, 62, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head, resting on paws.
  ctx.beginPath();
  ctx.arc(52, -8, 24, 0, Math.PI * 2);
  ctx.fill();
  // Ears.
  ctx.beginPath();
  ctx.moveTo(36, -24); ctx.lineTo(40, -44); ctx.lineTo(52, -28);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(56, -28); ctx.lineTo(64, -46); ctx.lineTo(70, -26);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2b2350';
  ctx.beginPath(); ctx.moveTo(40, -40); ctx.lineTo(42, -32); ctx.lineTo(47, -34); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(62, -42); ctx.lineTo(60, -33); ctx.lineTo(65, -34); ctx.closePath(); ctx.fill();
  // Closed eye and nose.
  ctx.strokeStyle = '#2b2350';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(58, -12); ctx.quadraticCurveTo(64, -9, 70, -12); ctx.stroke();
  ctx.fillStyle = '#2b2350';
  ctx.beginPath(); ctx.arc(76, -6, 4, 0, Math.PI * 2); ctx.fill();
  // Paws.
  ctx.fillStyle = '#f4efe6';
  ctx.beginPath(); ctx.ellipse(48, 18, 12, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(66, 18, 12, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export const FOXGLOVE_DIFFERENCES = [
  {
    id: 'butterfly', x: 420, y: 90, r: 26, side: 'right',
    hint: 'A butterfly floats near the top right.',
    paint(ctx) {
      ctx.fillStyle = '#ffd166';
      ctx.beginPath(); ctx.ellipse(412, 84, 10, 14, -0.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(428, 84, 10, 14, 0.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e07b39';
      ctx.beginPath(); ctx.ellipse(412, 96, 8, 10, -0.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(428, 96, 8, 10, 0.4, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#2b2350'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(420, 78); ctx.lineTo(420, 102); ctx.stroke();
    },
  },
  {
    id: 'mushroom', x: 96, y: 412, r: 26, side: 'left',
    hint: 'Count the mushrooms near the bottom left.',
    paint(ctx) { mushroom(ctx, 96, 412, 0.9); },
  },
  {
    id: 'berries', x: 500, y: 300, r: 26, side: 'right',
    hint: 'The berry bush has fruit on one side only.',
    paint(ctx) {
      ctx.fillStyle = '#c0392b';
      for (const [bx, by] of [[486, 292], [508, 308], [496, 322], [516, 288]]) {
        ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI * 2); ctx.fill();
      }
    },
  },
  {
    id: 'foxglove-flower', x: 300, y: 352, r: 26, side: 'left',
    hint: 'One more purple bell hides among the flowers.',
    paint(ctx) { foxglove(ctx, 300, 352, 0.7); },
  },
  {
    id: 'acorn', x: 180, y: 446, r: 22, side: 'right',
    hint: 'Look at the ground, lower left of centre.',
    paint(ctx) {
      ctx.fillStyle = '#8a5a2b';
      ctx.beginPath(); ctx.arc(180, 446, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#6b4a2f';
      ctx.beginPath(); ctx.arc(180, 438, 10, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = '#6b4a2f'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(180, 430); ctx.lineTo(186, 424); ctx.stroke();
    },
  },
  {
    id: 'branch-bird', x: 452, y: 82, r: 26, side: 'right',
    hint: 'Something small sits high on the right.',
    paint(ctx) {
      ctx.fillStyle = '#3a6ea5';
      ctx.beginPath(); ctx.ellipse(452, 82, 14, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(462, 74, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffd166';
      ctx.beginPath(); ctx.moveTo(468, 74); ctx.lineTo(476, 76); ctx.lineTo(468, 78); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#2b2350'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(448, 92); ctx.lineTo(446, 100); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(456, 92); ctx.lineTo(458, 100); ctx.stroke();
    },
  },
  {
    id: 'sunbeam-patch', x: 250, y: 210, r: 30, side: 'left',
    hint: 'A patch of sunlight falls where it should not.',
    paint(ctx) {
      ctx.fillStyle = 'rgba(255, 244, 180, 0.5)';
      ctx.beginPath(); ctx.ellipse(250, 210, 34, 18, 0.2, 0, Math.PI * 2); ctx.fill();
    },
  },
];
