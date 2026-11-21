// Every tuning number, colour and label in one place. The playfield is a fixed
// 1280x720 logical area; the renderer scales it to the window, so no rule below
// depends on the screen size. Two panels sit side by side inside it.

export const FIELD = { width: 1280, height: 720 };

export const PANEL = {
  width: 560,
  height: 480,
  leftX: 40,
  rightX: 680,
  y: 150,
  gap: 80,
};

/** The simulation's fixed step, in seconds. */
export const STEP = 1 / 60;

/** Seconds on the clock when a scene starts; a wrong click costs WRONG_COST. */
export const TIMER = { start: 180, wrongCost: 5, hintCost: 10 };

export const HINTS_PER_SCENE = 3;

/** Score for a find, times the combo (1 + found streak). A hint breaks the streak. */
export const SCORE = { find: 100, comboStep: 25, sceneBonus: 250, timeBonusPerSecond: 5 };

/** How close a click must land to a difference's centre, in panel pixels. */
export const CLICK_RADIUS = 34;

/** A found difference keeps its ring marker; a wrong click flashes this long. */
export const MARK = { ringRadius: 26, flashSeconds: 0.6 };

/** Marker pulse speed, in radians per second. */
export const PULSE = 3.2;

export const PALETTE = {
  backdrop: '#14101f',
  frame: '#241d33',
  frameEdge: '#4a3f66',
  panelEdge: '#6b5a8f',
  text: '#f4efe6',
  muted: '#b7abc9',
  accent: '#ffd166',
  good: '#7bd88a',
  bad: '#ff6b6b',
  hint: '#8ecae6',
  timerLow: '#ff6b6b',
  button: '#3a2f55',
  buttonEdge: '#6b5a8f',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best score is kept between visits (this browser only). */
export const BEST_KEY = 'spot-the-difference.best';

/** Scene order: each entry names its painter and its seven differences. */
export const SCENE_ORDER = ['harbor', 'foxglove', 'workshop'];

export const SCENE_TITLES = {
  harbor: 'Harbour at Dusk',
  foxglove: 'Foxglove Hollow',
  workshop: 'The Clockwork Workshop',
};

export const SCENE_SUBTITLES = {
  harbor: 'Lanterns over the bay — seven things changed between the two views.',
  foxglove: 'A fox naps among the foxgloves — seven things changed between the two views.',
  workshop: 'Gears, tools and one sleepy cat — seven things changed between the two views.',
};

/** Keyboard shortcuts, shown on the title screen and the help line. */
export const KEYS_HELP = 'Click a difference · H hint · P pause · R restart · 1/2/3 scene · Esc pause';
