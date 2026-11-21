// Scene 3 — The Clockwork Workshop. A bench, a robot, shelves of jars, a big wall
// gear and one very sleepy cat. Same contract as the other scenes: base picture
// identical on both panels, DIFFERENCES painted on one side only.

export const WORKSHOP_ID = 'workshop';

export function paintWorkshop(ctx, side) {
  // Wall and floor.
  ctx.fillStyle = '#7a6a8a';
  ctx.fillRect(0, 0, 560, 340);
  ctx.fillStyle = '#5d4f70';
  for (let y = 0; y < 340; y += 56) ctx.fillRect(0, y, 560, 3);
  ctx.fillStyle = '#4a3a28';
  ctx.fillRect(0, 340, 560, 140);
  ctx.fillStyle = '#5d4a32';
  for (let x = 0; x < 560; x += 70) ctx.fillRect(x, 340, 3, 140);

  // Window with the moon, top left.
  ctx.fillStyle = '#2b2350';
  ctx.fillRect(40, 40, 120, 130);
  ctx.fillStyle = '#f4e6b8';
  ctx.beginPath(); ctx.arc(100, 90, 26, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#7a6a8a';
  ctx.fillRect(96, 40, 8, 130);
  ctx.fillRect(40, 100, 120, 8);
  ctx.fillStyle = '#3a2f55';
  ctx.fillRect(36, 36, 128, 8);
  ctx.fillRect(36, 166, 128, 8);
  ctx.fillRect(36, 36, 8, 138);
  ctx.fillRect(156, 36, 8, 138);

  // Big wall gear, centre right.
  gear(ctx, 420, 170, 62, '#c9a227', 8);
  gear(ctx, 420, 170, 30, '#8a6d1f', 0);
  ctx.fillStyle = '#2b2350';
  ctx.beginPath(); ctx.arc(420, 170, 8, 0, Math.PI * 2); ctx.fill();

  // Shelves with jars, top right.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(300, 60, 220, 10);
  ctx.fillRect(300, 150, 220, 10);
  jar(ctx, 330, 58, '#8ecae6');
  jar(ctx, 380, 58, '#7bd88a');
  jar(ctx, 480, 58, '#e07b39');
  jar(ctx, 355, 148, '#c77ddb');
  jar(ctx, 455, 148, '#ffd166');

  // Workbench across the bottom.
  ctx.fillStyle = '#8a6a42';
  ctx.fillRect(30, 380, 500, 18);
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(46, 398, 14, 70);
  ctx.fillRect(500, 398, 14, 70);
  // Bench tools: hammer and screwdriver lying flat.
  ctx.fillStyle = '#5d5d5d';
  ctx.fillRect(70, 366, 44, 8);
  ctx.fillRect(88, 356, 8, 22);
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(150, 368, 6, 12);
  ctx.fillStyle = '#8ecae6';
  ctx.fillRect(148, 356, 10, 14);

  // The robot, standing on the bench.
  robot(ctx, 280, 380);

  // Hanging lamp, top centre.
  ctx.strokeStyle = '#2b2350';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(240, 0); ctx.lineTo(240, 60); ctx.stroke();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath(); ctx.moveTo(218, 60); ctx.lineTo(262, 60); ctx.lineTo(248, 92); ctx.lineTo(232, 92); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255, 209, 102, 0.22)';
  ctx.beginPath(); ctx.moveTo(232, 92); ctx.lineTo(248, 92); ctx.lineTo(290, 200); ctx.lineTo(190, 200); ctx.closePath(); ctx.fill();

  // Rug and the sleeping cat, bottom left of the floor.
  ctx.fillStyle = '#a34a5e';
  ctx.beginPath(); ctx.ellipse(120, 440, 96, 26, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(120, 440, 78, 18, 0, 0, Math.PI * 2); ctx.stroke();
  cat(ctx, 120, 432);
}

function gear(ctx, x, y, radius, colour, teeth) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = colour;
  if (teeth > 0) {
    for (let k = 0; k < teeth; k += 1) {
      const a = (k / teeth) * Math.PI * 2;
      ctx.save();
      ctx.rotate(a);
      ctx.fillRect(-6, -radius - 12, 12, 14);
      ctx.restore();
    }
  }
  ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function jar(ctx, x, y, colour) {
  ctx.fillStyle = colour;
  ctx.fillRect(x - 12, y - 34, 24, 34);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillRect(x - 9, y - 30, 5, 26);
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(x - 13, y - 40, 26, 7);
}

function robot(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  // Legs and body.
  ctx.fillStyle = '#8ecae6';
  ctx.fillRect(-26, -84, 18, 44);
  ctx.fillRect(8, -84, 18, 44);
  ctx.fillStyle = '#5d8a9e';
  ctx.fillRect(-30, -44, 22, 8);
  ctx.fillRect(8, -44, 22, 8);
  ctx.fillStyle = '#b8c4cc';
  ctx.fillRect(-34, -140, 68, 60);
  ctx.fillStyle = '#2b2350';
  ctx.fillRect(-20, -128, 40, 18);
  // Chest lights.
  ctx.fillStyle = '#7bd88a';
  ctx.beginPath(); ctx.arc(-10, -96, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath(); ctx.arc(8, -96, 5, 0, Math.PI * 2); ctx.fill();
  // Arms.
  ctx.fillStyle = '#8ecae6';
  ctx.fillRect(-48, -136, 12, 44);
  ctx.fillRect(36, -136, 12, 44);
  ctx.fillStyle = '#5d8a9e';
  ctx.beginPath(); ctx.arc(-42, -88, 9, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(42, -88, 9, 0, Math.PI * 2); ctx.fill();
  // Head.
  ctx.fillStyle = '#b8c4cc';
  ctx.fillRect(-26, -178, 52, 38);
  ctx.fillStyle = '#2b2350';
  ctx.beginPath(); ctx.arc(-10, -160, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(10, -160, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#7bd88a';
  ctx.beginPath(); ctx.arc(-10, -160, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(10, -160, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#2b2350';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-8, -148); ctx.lineTo(8, -148); ctx.stroke();
  ctx.restore();
}

function cat(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  // Curled body.
  ctx.fillStyle = '#e8a34c';
  ctx.beginPath(); ctx.ellipse(0, 0, 42, 18, 0, 0, Math.PI * 2); ctx.fill();
  // Head tucked in.
  ctx.beginPath(); ctx.arc(34, -6, 15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(24, -16); ctx.lineTo(26, -28); ctx.lineTo(34, -18); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(38, -18); ctx.lineTo(44, -29); ctx.lineTo(47, -17); ctx.closePath(); ctx.fill();
  // Stripes.
  ctx.strokeStyle = '#b8742e';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-20, -14); ctx.lineTo(-16, -4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-4, -16); ctx.lineTo(0, -6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(12, -15); ctx.lineTo(16, -5); ctx.stroke();
  ctx.restore();
}

export const WORKSHOP_DIFFERENCES = [
  {
    id: 'floor-gear', x: 150, y: 420, r: 24, side: 'left',
    hint: 'A small gear lies on the floor, lower left.',
    paint(ctx) { gear(ctx, 150, 420, 16, '#c9a227', 6); },
  },
  {
    id: 'extra-jar', x: 428, y: 58, r: 24, side: 'right',
    hint: 'Count the jars on the top shelf.',
    paint(ctx) { jar(ctx, 428, 58, '#ff6b6b'); },
  },
  {
    id: 'antenna-ball', x: 280, y: 186, r: 20, side: 'left',
    hint: 'Look at the top of the robot’s head.',
    paint(ctx) {
      ctx.strokeStyle = '#2b2350'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(280, 202); ctx.lineTo(280, 184); ctx.stroke();
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath(); ctx.arc(280, 178, 7, 0, Math.PI * 2); ctx.fill();
    },
  },
  {
    id: 'wrench', x: 500, y: 200, r: 24, side: 'right',
    hint: 'A tool hangs on the wall, right side.',
    paint(ctx) {
      ctx.strokeStyle = '#5d5d5d'; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(500, 180); ctx.lineTo(500, 216); ctx.stroke();
      ctx.beginPath(); ctx.arc(500, 176, 9, Math.PI * 0.9, Math.PI * 2.1); ctx.stroke();
    },
  },
  {
    id: 'mug', x: 380, y: 368, r: 24, side: 'left',
    hint: 'Something to drink sits on the workbench.',
    paint(ctx) {
      ctx.fillStyle = '#7bd88a';
      ctx.fillRect(368, 352, 22, 26);
      ctx.strokeStyle = '#5d8a6a'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(392, 365, 8, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    },
  },
  {
    id: 'spider', x: 90, y: 150, r: 22, side: 'right',
    hint: 'Something with eight legs hides near the window.',
    paint(ctx) {
      ctx.strokeStyle = '#2b2350'; ctx.lineWidth = 2;
      for (let k = 0; k < 4; k += 1) {
        const a = (k / 4) * Math.PI;
        ctx.beginPath(); ctx.moveTo(90, 150); ctx.lineTo(90 + Math.cos(a) * 16, 150 + Math.sin(a) * 12 - 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(90, 150); ctx.lineTo(90 - Math.cos(a) * 16, 150 + Math.sin(a) * 12 - 6); ctx.stroke();
      }
      ctx.fillStyle = '#2b2350';
      ctx.beginPath(); ctx.arc(90, 150, 7, 0, Math.PI * 2); ctx.fill();
    },
  },
  {
    id: 'gear-cog', x: 362, y: 128, r: 22, side: 'left',
    hint: 'The big wall gear has a little friend on one side.',
    paint(ctx) { gear(ctx, 362, 128, 14, '#c9a227', 6); },
  },
];
