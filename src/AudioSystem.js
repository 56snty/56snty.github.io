// A simple synth to avoid external file dependencies
const ctx = new (window.AudioContext || window.webkitAudioContext)();

export const playHover = (enabled) => {
  if (!enabled || ctx.state === 'suspended') { ctx.resume(); return; }
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
  
  gain.gain.setValueAtTime(0.02, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

export const playClick = (enabled) => {
  if (!enabled || ctx.state === 'suspended') { ctx.resume(); return; }
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(100, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}
