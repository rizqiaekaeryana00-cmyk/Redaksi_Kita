// Simple synth for sound effects to avoid external asset dependency issues
const getContext = () => {
  const Ctx = window.AudioContext || (window as any).webkitAudioContext;
  return new Ctx();
};

let audioCtx: AudioContext | null = null;

const playTone = (freq: number, type: OscillatorType, duration: number, delay: number = 0, volume: number = 0.1) => {
  try {
    if (!audioCtx) audioCtx = getContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
    
    gain.gain.setValueAtTime(volume, audioCtx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + delay + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + duration);
  } catch (e) {
    console.warn("Audio playback failed", e);
  }
};

export const AudioService = {
  playClick: () => playTone(800, 'sine', 0.05, 0, 0.05),
  playCorrect: () => {
    playTone(600, 'sine', 0.1, 0);
    playTone(1200, 'sine', 0.2, 0.1);
  },
  playWrong: () => {
    playTone(150, 'sawtooth', 0.3, 0, 0.05);
    playTone(100, 'sawtooth', 0.3, 0.1, 0.05);
  },
  playWin: () => {
    playTone(523.25, 'triangle', 0.1, 0); // C5
    playTone(659.25, 'triangle', 0.1, 0.1); // E5
    playTone(783.99, 'triangle', 0.1, 0.2); // G5
    playTone(1046.50, 'triangle', 0.4, 0.3); // C6
  },
  playShoot: () => {
    playTone(400, 'square', 0.05, 0, 0.02);
  }
};