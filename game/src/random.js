// A tiny seeded generator (mulberry32) so a scene's decoration is the same every
// visit for the same seed, while two panels of one scene stay identical except
// for the differences the scene itself declares.

/** Build a generator from any integer seed. */
export function createRandom(seed) {
  let state = seed >>> 0;
  return {
    /** Next float in [0, 1). */
    next() {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    /** Integer in [min, max]. */
    int(min, max) {
      return min + Math.floor(this.next() * (max - min + 1));
    },
    /** Pick one item from an array. */
    pick(items) {
      return items[Math.floor(this.next() * items.length)];
    },
  };
}

/** Hash a short string to a 32-bit seed. */
export function hashSeed(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
