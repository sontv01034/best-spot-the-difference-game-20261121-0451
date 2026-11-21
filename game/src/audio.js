// Tiny synthesised sounds via WebAudio — no audio files, no network. A short
// chime on a find, a low buzz on a miss, a rising arpeggio on a scene clear.

/** Create the sound player; the AudioContext starts on the first user gesture. */
export function createAudio() {
  let context = null;
  let muted = false;

  function ensure() {
    if (context === null) {
      const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
      if (AudioContextClass === undefined) return null;
      context = new AudioContextClass();
    }
    if (context.state === 'suspended') void context.resume();
    return context;
  }

  function tone(frequency, startAt, duration, type, volume) {
    const audio = ensure();
    if (audio === null || muted) return;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, audio.currentTime + startAt);
    gain.gain.linearRampToValueAtTime(volume, audio.currentTime + startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + startAt + duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(audio.currentTime + startAt);
    oscillator.stop(audio.currentTime + startAt + duration + 0.05);
  }

  return {
    unlock() {
      ensure();
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    isMuted() {
      return muted;
    },
    found() {
      tone(660, 0, 0.18, 'sine', 0.16);
      tone(880, 0.07, 0.22, 'sine', 0.16);
      tone(1320, 0.14, 0.26, 'sine', 0.1);
    },
    wrong() {
      tone(160, 0, 0.22, 'sawtooth', 0.08);
      tone(110, 0.08, 0.25, 'sawtooth', 0.06);
    },
    hint() {
      tone(520, 0, 0.15, 'triangle', 0.12);
      tone(780, 0.08, 0.18, 'triangle', 0.1);
    },
    clear() {
      [523, 659, 784, 1047].forEach((frequency, index) => {
        tone(frequency, index * 0.09, 0.3, 'sine', 0.14);
      });
    },
    win() {
      [523, 659, 784, 1047, 1319].forEach((frequency, index) => {
        tone(frequency, index * 0.11, 0.4, 'sine', 0.14);
      });
    },
    tick() {
      tone(980, 0, 0.06, 'square', 0.05);
    },
  };
}
