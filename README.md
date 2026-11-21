# Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/sontv01034/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/sontv01034/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Two near-identical pictures, side by side. Seven changes hiding between them.
Three hand-drawn scenes, a 180-second clock, and one sharp eye.

## How to play

Open `game/index.html` in a desktop browser (or run `node serve.ts` and open
http://localhost:8080). No build step, no network: every file the game loads
lives under `game/`.

- **Click** a difference on either picture to mark it. A green ring and a
  chime confirm the find; a wrong click flashes red and costs 5 seconds.
- Find all **7 differences** before the clock runs out to open the next scene.
- **H** spends a hint (−10s, pulsing circle around the next difference).
- **P** / **Esc** pause, **R** restart the scene, **1 / 2 / 3** jump to a scene.

## The three scenes

1. **Harbour at Dusk** — lanterns over the bay: a gull, first stars, a flag,
   a glowing pier lantern, a jumping fish, a lighthouse window, a buoy.
2. **Foxglove Hollow** — a fox naps among the foxgloves: a butterfly, a
   mushroom, a bird on a branch, an extra bell flower, an acorn, a sunbeam
   patch, berries on the bush.
3. **The Clockwork Workshop** — gears, jars and one sleepy cat: a floor gear,
   an extra jar, the robot's antenna ball, a hanging wrench, a mug, a spider,
   a little cog on the big gear.

Scoring rewards streaks: 100 points a find, +25 per combo step, a scene bonus
plus 5 points per second left on the clock. The best score is kept in the
browser.

## Layout

- `game/index.html` — the page, one canvas, one module script.
- `game/src/main.js` — boot and the one loop.
- `game/src/world.js` — state: found set, clock, score, hints, clicks.
- `game/src/render.js` — header, panels, markers, particles, all screens.
- `game/src/scenes.js` — the scene registry; each scene paints its base
  picture identically on both panels, then its differences on one side only.
- `game/src/scene-harbor.js`, `scene-foxglove.js`, `scene-workshop.js` — the
  three scenes, each with its seven differences.
- `game/src/input.js` — mouse + keyboard, mapped into panel space.
- `game/src/audio.js` — synthesised WebAudio chimes, no audio files.
- `game/src/shots.js` — deterministic screenshot scenes (`?shot=play&found=2`).
- `game/src/config.js`, `game/src/random.js` — tuning and a seeded generator.
- `main.ts` — the hand-in: copies `game/` and `screenshots/` to `/output` and
  writes `dossier.json` with the vendored make.fun library.
- `screenshots/` — real captures of the game running in Chrome.

## License

MIT — see [LICENSE](LICENSE).
