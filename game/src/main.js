// Boot and the one loop: input is read every frame, the world advances in fixed
// 1/60 s steps, and the renderer paints what is there. The game moves between
// six screens: title, play, paused, scene clear, game over and win.
//
// ?shot=start|play|clear|win (with &found=N and &scene=...) stages that scene
// instead of running the loop, paints it twice and sets window.__shotReady for
// a screenshot.

import { BEST_KEY, STEP } from './config.js';
import { createAudio } from './audio.js';
import {
  ACTION_CONFIRM, ACTION_HINT, ACTION_PAUSE, ACTION_RESTART,
  ACTION_SCENE_1, ACTION_SCENE_2, ACTION_SCENE_3, createInput,
} from './input.js';
import { createRenderer, SCREEN_CLEAR, SCREEN_OVER, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './render.js';
import { stageShot } from './shots.js';
import {
  EVENT_FOUND, EVENT_HINT, EVENT_SCENE_CLEAR, EVENT_TIME_UP, EVENT_WRONG,
  clickAt, createWorld, nextScene, remainingCount, startScene, stepWorld, useHint,
} from './world.js';

/** The longest frame the loop catches up on; a longer stall is dropped. */
const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld();
const renderer = createRenderer(canvas);
const audio = createAudio();

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score lasts this visit only.
  }
}

world.best = readBest();

function runShot(name) {
  const screen = stageShot(params, world);
  let painted = 0;
  function paint() {
    renderer.draw(world, screen, 1.2);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas);
  let screen = SCREEN_TITLE;
  let accumulator = 0;
  let last = performance.now();
  let lastTickSecond = -1;

  // Screen readers (and anyone watching the page's text) hear screen changes.
  function announce(message) {
    status.textContent = message;
  }

  function bankBest() {
    if (world.score > world.best) {
      world.best = world.score;
      saveBest(world.best);
    }
  }

  function startPlay(sceneIndex) {
    startScene(world, sceneIndex);
    screen = SCREEN_PLAY;
    announce(`Playing ${sceneIndex + 1} of 3. Find 7 differences.`);
  }

  function endGame() {
    bankBest();
    screen = SCREEN_OVER;
    announce(`Time up. Score ${world.score}. Best ${world.best}.`);
  }

  function finishWin() {
    bankBest();
    screen = SCREEN_WIN;
    audio.win();
    announce(`You found them all. Final score ${world.score}.`);
  }

  function handleClicks() {
    for (const click of input.takeClicks()) {
      if (screen === SCREEN_PAUSED) {
        screen = SCREEN_PLAY;
        announce('Playing.');
        continue;
      }
      if (screen !== SCREEN_PLAY) continue;
      audio.unlock();
      const events = clickAt(world, click.panel, click.x, click.y);
      if (events & EVENT_FOUND) {
        audio.found();
        if (events & EVENT_SCENE_CLEAR) {
          audio.clear();
          if (world.won) finishWin();
          else {
            bankBest();
            screen = SCREEN_CLEAR;
            announce(`Scene clear. ${remainingCount(world)} differences were left in the next scene.`);
          }
        } else {
          announce(`Found one. ${remainingCount(world)} left.`);
        }
      } else if (events & EVENT_WRONG) {
        audio.wrong();
        announce(`Not a difference. 5 seconds lost. ${remainingCount(world)} left.`);
        if (events & EVENT_TIME_UP) endGame();
      }
    }
  }

  function handleActions() {
    const actions = input.takeActions();
    if (actions & ACTION_CONFIRM) {
      audio.unlock();
      if (screen === SCREEN_TITLE) startPlay(0);
      else if (screen === SCREEN_OVER) startPlay(world.sceneIndex);
      else if (screen === SCREEN_CLEAR) {
        if (nextScene(world)) {
          screen = SCREEN_PLAY;
          announce('Next scene. Find 7 differences.');
        }
      } else if (screen === SCREEN_WIN) startPlay(0);
      else if (screen === SCREEN_PAUSED) {
        screen = SCREEN_PLAY;
        announce('Playing.');
      }
    }
    if (actions & ACTION_PAUSE) {
      if (screen === SCREEN_PLAY) {
        screen = SCREEN_PAUSED;
        announce('Paused.');
      } else if (screen === SCREEN_PAUSED) {
        screen = SCREEN_PLAY;
        announce('Playing.');
      }
    }
    if (actions & ACTION_HINT && screen === SCREEN_PLAY) {
      if (useHint(world) & EVENT_HINT) {
        audio.hint();
        announce('Hint: look inside the pulsing circle.');
      }
    }
    if (actions & ACTION_RESTART && screen !== SCREEN_TITLE) {
      startPlay(world.sceneIndex);
    }
    if (screen === SCREEN_TITLE) {
      if (actions & ACTION_SCENE_1) startPlay(0);
      else if (actions & ACTION_SCENE_2) startPlay(1);
      else if (actions & ACTION_SCENE_3) startPlay(2);
    }
  }

  function step() {
    if (screen !== SCREEN_PLAY) return;
    const events = stepWorld(world, STEP);
    if (events & EVENT_TIME_UP) endGame();
    const second = Math.floor(world.timeLeft);
    if (world.timeLeft <= 10 && second !== lastTickSecond) {
      lastTickSecond = second;
      audio.tick();
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    handleClicks();
    handleActions();
    while (accumulator >= STEP && screen === SCREEN_PLAY) {
      step();
      accumulator -= STEP;
    }
    if (screen !== SCREEN_PLAY) accumulator = 0;
    renderer.draw(world, screen, now / 1000);
  }

  // Leaving the tab pauses a running game rather than letting the clock run unseen.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && screen === SCREEN_PLAY) {
      screen = SCREEN_PAUSED;
      announce('Paused.');
    }
  });

  announce('Spot the Difference. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
