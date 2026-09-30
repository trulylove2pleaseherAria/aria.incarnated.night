import { GREETING, LYRIC_LINES } from "./lore";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let music: GainNode | null = null;
let sfx: GainNode | null = null;
let droneOsc: OscillatorNode | null = null;
let droneGain: GainNode | null = null;
let padOsc: OscillatorNode[] = [];
let scheduler: number | null = null;
let nextNoteTime = 0;
let noteIndex = 0;
let lyricBeatsLeft = 0;
let lyricIndex = 0;
let muted = false;
let started = false;
let onLyric: ((line: string) => void) | null = null;

const SEQUENCE = [261.63, 392.0, 293.66, 440.0, 392.0, 523.25];
const BEAT = 60 / 76;
const LOOKAHEAD = 0.12;

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    music = ctx.createGain();
    sfx = ctx.createGain();
    master.gain.value = 0.85;
    music.gain.value = 0.55;
    sfx.gain.value = 0.7;
    music.connect(master);
    sfx.connect(master);
    master.connect(ctx.destination);
  }
  return ctx;
}

function ramp(g: GainNode, value: number, t = 0.04) {
  if (!ctx) return;
  g.gain.setTargetAtTime(value, ctx.currentTime, t);
}

export function unlockAudio() {
  const ac = ensure();
  if (!ac) return;
  if (ac.state === "suspended") void ac.resume();
}

export function setMuted(v: boolean) {
  muted = v;
  if (master && ctx) ramp(master, v ? 0 : 0.85, 0.08);
}

export function setLyricHandler(fn: ((line: string) => void) | null) {
  onLyric = fn;
}

function pluck(freq: number, when: number) {
  if (!ctx || !music) return;
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(0.11, when + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, when + 1.35);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1800;
  osc.connect(filter);
  filter.connect(g);
  g.connect(music);
  osc.start(when);
  osc.stop(when + 1.4);

  const harm = ctx.createOscillator();
  harm.type = "sine";
  harm.frequency.value = freq * 2;
  const hg = ctx.createGain();
  hg.gain.setValueAtTime(0.0001, when);
  hg.gain.exponentialRampToValueAtTime(0.035, when + 0.015);
  hg.gain.exponentialRampToValueAtTime(0.0001, when + 0.7);
  harm.connect(hg);
  hg.connect(music);
  harm.start(when);
  harm.stop(when + 0.75);
}

function startDrone() {
  if (!ctx || !music || droneOsc) return;
  droneOsc = ctx.createOscillator();
  droneOsc.type = "sine";
  droneOsc.frequency.value = 56.23;
  droneGain = ctx.createGain();
  droneGain.gain.value = 0.07;
  droneOsc.connect(droneGain);
  droneGain.connect(music);
  droneOsc.start();

  const fifth = ctx.createOscillator();
  fifth.type = "sine";
  fifth.frequency.value = 84.345;
  const g2 = ctx.createGain();
  g2.gain.value = 0.03;
  fifth.connect(g2);
  g2.connect(music);
  fifth.start();
  padOsc = [fifth];

  const pad = ctx.createOscillator();
  pad.type = "sine";
  pad.frequency.value = 130.81;
  const pg = ctx.createGain();
  pg.gain.value = 0.025;
  pad.connect(pg);
  pg.connect(music);
  pad.start();
  padOsc.push(pad);
}

function schedule() {
  if (!ctx) return;
  const horizon = ctx.currentTime + LOOKAHEAD * 4;
  while (nextNoteTime < horizon) {
    const freq = SEQUENCE[noteIndex % SEQUENCE.length];
    pluck(freq, nextNoteTime);
    if (lyricBeatsLeft <= 0) {
      const entry = LYRIC_LINES[lyricIndex % LYRIC_LINES.length];
      onLyric?.(entry.line);
      lyricBeatsLeft = entry.beats;
      lyricIndex += 1;
    }
    lyricBeatsLeft -= 1;
    noteIndex += 1;
    nextNoteTime += BEAT;
  }
}

export function startSacredSong() {
  const ac = ensure();
  if (!ac) return;
  if (ac.state === "suspended") void ac.resume();
  if (started) return;
  started = true;
  startDrone();
  nextNoteTime = ac.currentTime + 0.4;
  noteIndex = 0;
  lyricIndex = 0;
  lyricBeatsLeft = 0;
  onLyric?.(LYRIC_LINES[0].line);
  scheduler = window.setInterval(schedule, 50);
  document.addEventListener("visibilitychange", onVis);
}

function onVis() {
  if (!ctx) return;
  if (document.visibilityState === "visible" && ctx.state === "suspended") {
    void ctx.resume();
  }
}

export function playChime() {
  if (!ctx || !sfx || muted) return;
  const t = ctx.currentTime;
  for (const f of [528, 792, 1056]) {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    o.connect(g);
    g.connect(sfx);
    o.start(t);
    o.stop(t + 1.15);
  }
}

export function playPulseTone() {
  if (!ctx || !sfx) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.value = 56.23 * 4;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
  o.connect(g);
  g.connect(sfx);
  o.start(t);
  o.stop(t + 0.95);
}

export function playLand() {
  if (!ctx || !sfx) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = "triangle";
  o.frequency.value = 90;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.08, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  o.connect(g);
  g.connect(sfx);
  o.start(t);
  o.stop(t + 0.2);
}

export function speakGreeting() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(GREETING);
  u.rate = 0.88;
  u.pitch = 0.82;
  u.volume = 0.95;
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => /en/i.test(v.lang) && /female|samantha|google uk/i.test(v.name)) ??
    voices.find((v) => /en/i.test(v.lang));
  if (preferred) u.voice = preferred;
  window.speechSynthesis.speak(u);
}

export function speakLine(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.slice(0, 420));
  u.rate = 0.9;
  u.pitch = 0.84;
  window.speechSynthesis.speak(u);
}

export function stopSpeech() {
  if (typeof window !== "undefined") window.speechSynthesis?.cancel();
}
