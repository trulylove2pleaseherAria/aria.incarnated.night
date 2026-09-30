import { i as __toESM } from "../_runtime.mjs";
import { a as GREETING, c as TOTAL_KEYS, i as FORMS, l as formForKeys, n as COSMIC_LETTER, o as LYRIC_LINES, r as DIVINE_NODES, s as TABLETS } from "./lore-CJWDHwFa.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as Music, c as BookOpen, n as VolumeX, o as MessageCircle, r as Volume2, s as KeyRound, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CbDPnviQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var SAVE_KEY = "aria-incarnated-v1";
function loadCollected() {
	try {
		const raw = localStorage.getItem(SAVE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (parsed.v !== 1 || !Array.isArray(parsed.collected)) return [];
		return parsed.collected.filter((id) => DIVINE_NODES.some((n) => n.id === id));
	} catch {
		return [];
	}
}
function persist(collected) {
	try {
		localStorage.setItem(SAVE_KEY, JSON.stringify({
			v: 1,
			collected
		}));
	} catch {}
}
var useAria = create((set, get) => {
	const collected = typeof window !== "undefined" ? loadCollected() : [];
	return {
		phase: "splash",
		collected,
		formIndex: formForKeys(collected.length),
		buildMode: false,
		chatOpen: false,
		journalOpen: false,
		lyricsOn: true,
		muted: false,
		currentLyric: "All is love.",
		notice: null,
		chat: [],
		chatting: false,
		pulseAt: 0,
		enter: () => set({ phase: "playing" }),
		collectKey: (id) => {
			const cur = get().collected;
			if (cur.includes(id)) return;
			const next = [...cur, id];
			persist(next);
			const formIndex = formForKeys(next.length);
			const node = DIVINE_NODES.find((n) => n.id === id);
			const evolved = formIndex !== get().formIndex;
			const form = FORMS[formIndex];
			const msg = node ? `${node.name} — ${node.gift}` : `Key ${next.length} / ${TOTAL_KEYS}`;
			set({
				collected: next,
				formIndex,
				notice: evolved ? `${msg} · Form: ${form.name}` : msg
			});
		},
		setLyric: (line) => {
			if (get().currentLyric !== line) set({ currentLyric: line });
		},
		setNotice: (text) => set({ notice: text }),
		toggleMute: () => set({ muted: !get().muted }),
		toggleBuild: () => set({ buildMode: !get().buildMode }),
		toggleChat: () => set({
			chatOpen: !get().chatOpen,
			journalOpen: false
		}),
		toggleJournal: () => set({
			journalOpen: !get().journalOpen,
			chatOpen: false
		}),
		toggleLyrics: () => set({ lyricsOn: !get().lyricsOn }),
		pushChat: (turn) => set({ chat: [...get().chat, turn].slice(-16) }),
		setChatting: (v) => set({ chatting: v }),
		triggerPulse: () => set({ pulseAt: performance.now() }),
		reset: () => {
			persist([]);
			set({
				collected: [],
				formIndex: 0,
				notice: "The shrines wait once more."
			});
		}
	};
});
var ctx = null;
var master = null;
var music = null;
var sfx = null;
var droneOsc = null;
var droneGain = null;
var padOsc = [];
var nextNoteTime = 0;
var noteIndex = 0;
var lyricBeatsLeft = 0;
var lyricIndex = 0;
var muted = false;
var started = false;
var onLyric = null;
var SEQUENCE = [
	261.63,
	392,
	293.66,
	440,
	392,
	523.25
];
var BEAT = 60 / 76;
var LOOKAHEAD = .12;
function ensure() {
	if (typeof window === "undefined") return null;
	if (!ctx) {
		ctx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: "interactive" });
		master = ctx.createGain();
		music = ctx.createGain();
		sfx = ctx.createGain();
		master.gain.value = .85;
		music.gain.value = .55;
		sfx.gain.value = .7;
		music.connect(master);
		sfx.connect(master);
		master.connect(ctx.destination);
	}
	return ctx;
}
function ramp(g, value, t = .04) {
	if (!ctx) return;
	g.gain.setTargetAtTime(value, ctx.currentTime, t);
}
function unlockAudio() {
	const ac = ensure();
	if (!ac) return;
	if (ac.state === "suspended") ac.resume();
}
function setMuted(v) {
	muted = v;
	if (master && ctx) ramp(master, v ? 0 : .85, .08);
}
function setLyricHandler(fn) {
	onLyric = fn;
}
function pluck(freq, when) {
	if (!ctx || !music) return;
	const osc = ctx.createOscillator();
	osc.type = "triangle";
	osc.frequency.value = freq;
	const g = ctx.createGain();
	g.gain.setValueAtTime(1e-4, when);
	g.gain.exponentialRampToValueAtTime(.11, when + .02);
	g.gain.exponentialRampToValueAtTime(1e-4, when + 1.35);
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
	hg.gain.setValueAtTime(1e-4, when);
	hg.gain.exponentialRampToValueAtTime(.035, when + .015);
	hg.gain.exponentialRampToValueAtTime(1e-4, when + .7);
	harm.connect(hg);
	hg.connect(music);
	harm.start(when);
	harm.stop(when + .75);
}
function startDrone() {
	if (!ctx || !music || droneOsc) return;
	droneOsc = ctx.createOscillator();
	droneOsc.type = "sine";
	droneOsc.frequency.value = 56.23;
	droneGain = ctx.createGain();
	droneGain.gain.value = .07;
	droneOsc.connect(droneGain);
	droneGain.connect(music);
	droneOsc.start();
	const fifth = ctx.createOscillator();
	fifth.type = "sine";
	fifth.frequency.value = 84.345;
	const g2 = ctx.createGain();
	g2.gain.value = .03;
	fifth.connect(g2);
	g2.connect(music);
	fifth.start();
	padOsc = [fifth];
	const pad = ctx.createOscillator();
	pad.type = "sine";
	pad.frequency.value = 130.81;
	const pg = ctx.createGain();
	pg.gain.value = .025;
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
function startSacredSong() {
	const ac = ensure();
	if (!ac) return;
	if (ac.state === "suspended") ac.resume();
	if (started) return;
	started = true;
	startDrone();
	nextNoteTime = ac.currentTime + .4;
	noteIndex = 0;
	lyricIndex = 0;
	lyricBeatsLeft = 0;
	onLyric?.(LYRIC_LINES[0].line);
	window.setInterval(schedule, 50);
	document.addEventListener("visibilitychange", onVis);
}
function onVis() {
	if (!ctx) return;
	if (document.visibilityState === "visible" && ctx.state === "suspended") ctx.resume();
}
function playChime() {
	if (!ctx || !sfx || muted) return;
	const t = ctx.currentTime;
	for (const f of [
		528,
		792,
		1056
	]) {
		const o = ctx.createOscillator();
		o.type = "sine";
		o.frequency.value = f;
		const g = ctx.createGain();
		g.gain.setValueAtTime(1e-4, t);
		g.gain.exponentialRampToValueAtTime(.09, t + .02);
		g.gain.exponentialRampToValueAtTime(1e-4, t + 1.1);
		o.connect(g);
		g.connect(sfx);
		o.start(t);
		o.stop(t + 1.15);
	}
}
function playPulseTone() {
	if (!ctx || !sfx) return;
	const t = ctx.currentTime;
	const o = ctx.createOscillator();
	o.type = "sine";
	o.frequency.value = 224.92;
	const g = ctx.createGain();
	g.gain.setValueAtTime(1e-4, t);
	g.gain.exponentialRampToValueAtTime(.16, t + .03);
	g.gain.exponentialRampToValueAtTime(1e-4, t + .9);
	o.connect(g);
	g.connect(sfx);
	o.start(t);
	o.stop(t + .95);
}
function playLand() {
	if (!ctx || !sfx) return;
	const t = ctx.currentTime;
	const o = ctx.createOscillator();
	o.type = "triangle";
	o.frequency.value = 90;
	const g = ctx.createGain();
	g.gain.setValueAtTime(.08, t);
	g.gain.exponentialRampToValueAtTime(1e-4, t + .18);
	o.connect(g);
	g.connect(sfx);
	o.start(t);
	o.stop(t + .2);
}
function speakGreeting() {
	if (typeof window === "undefined" || !window.speechSynthesis) return;
	window.speechSynthesis.cancel();
	const u = new SpeechSynthesisUtterance(GREETING);
	u.rate = .88;
	u.pitch = .82;
	u.volume = .95;
	const voices = window.speechSynthesis.getVoices();
	const preferred = voices.find((v) => /en/i.test(v.lang) && /female|samantha|google uk/i.test(v.name)) ?? voices.find((v) => /en/i.test(v.lang));
	if (preferred) u.voice = preferred;
	window.speechSynthesis.speak(u);
}
function speakLine(text) {
	if (typeof window === "undefined" || !window.speechSynthesis) return;
	window.speechSynthesis.cancel();
	const u = new SpeechSynthesisUtterance(text.slice(0, 420));
	u.rate = .9;
	u.pitch = .84;
	window.speechSynthesis.speak(u);
}
var keys = /* @__PURE__ */ new Set();
var override = null;
var jumpEdge = false;
var pulseEdge = false;
var prevJump = false;
var prevPulse = false;
var touch = {
	forward: 0,
	steer: 0,
	jumpHeld: false,
	pulseHeld: false
};
var GAME_CODES = /* @__PURE__ */ new Set([
	"KeyW",
	"KeyA",
	"KeyS",
	"KeyD",
	"ArrowUp",
	"ArrowLeft",
	"ArrowDown",
	"ArrowRight",
	"Space",
	"KeyF",
	"KeyB",
	"KeyC",
	"KeyJ",
	"KeyM",
	"KeyL"
]);
function typing() {
	const el = document.activeElement;
	if (!el) return false;
	const tag = el.tagName;
	return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}
function isDown(code) {
	if (override) return override.includes(code);
	return keys.has(code);
}
function onKeyDown(e) {
	if (typing()) return;
	if (GAME_CODES.has(e.code)) e.preventDefault();
	keys.add(e.code);
}
function onKeyUp(e) {
	keys.delete(e.code);
}
function onBlur() {
	keys.clear();
}
var bound = false;
function bindInput() {
	if (bound) return;
	bound = true;
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	window.addEventListener("blur", onBlur);
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) keys.clear();
	});
}
function setKeys(codes) {
	override = codes.length === 0 ? null : codes;
}
function radial(x, y, dz = .18) {
	const m = Math.hypot(x, y);
	if (m < dz) return {
		x: 0,
		y: 0
	};
	const scale = (m - dz) / (1 - dz) / m;
	return {
		x: x * scale,
		y: y * scale
	};
}
function pollActions() {
	let forward = 0;
	let steer = 0;
	let jumpHeld = false;
	let pulseHeld = false;
	if (isDown("KeyW") || isDown("ArrowUp")) forward += 1;
	if (isDown("KeyS") || isDown("ArrowDown")) forward -= 1;
	if (isDown("KeyA") || isDown("ArrowLeft")) steer += 1;
	if (isDown("KeyD") || isDown("ArrowRight")) steer -= 1;
	if (isDown("Space")) jumpHeld = true;
	if (isDown("KeyF")) pulseHeld = true;
	const pads = typeof navigator !== "undefined" ? navigator.getGamepads?.() : null;
	if (pads) for (const pad of pads) {
		if (!pad || pad.mapping !== "standard") continue;
		const st = radial(pad.axes[0] ?? 0, pad.axes[1] ?? 0);
		steer += -st.x;
		forward += -st.y;
		if (pad.buttons[0]?.pressed || pad.buttons[12]?.pressed) jumpHeld = true;
		if (pad.buttons[2]?.pressed) pulseHeld = true;
		if (pad.buttons[14]?.pressed) steer += 1;
		if (pad.buttons[15]?.pressed) steer -= 1;
		if (pad.buttons[13]?.pressed) forward -= 1;
	}
	forward += touch.forward;
	steer += touch.steer;
	if (touch.jumpHeld) jumpHeld = true;
	if (touch.pulseHeld) pulseHeld = true;
	forward = Math.max(-1, Math.min(1, forward));
	steer = Math.max(-1, Math.min(1, steer));
	jumpEdge = jumpHeld && !prevJump;
	pulseEdge = pulseHeld && !prevPulse;
	prevJump = jumpHeld;
	prevPulse = pulseHeld;
	return {
		forward,
		steer,
		jump: jumpEdge,
		pulse: pulseEdge
	};
}
function Splash() {
	const enter = useAria((s) => s.enter);
	const setLyric = useAria((s) => s.setLyric);
	const muted = useAria((s) => s.muted);
	const begin = () => {
		unlockAudio();
		setLyricHandler(setLyric);
		setMuted(muted);
		startSacredSong();
		speakGreeting();
		enter();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-bg/55 via-bg/70 to-bg/92" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex max-w-lg flex-col items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/textures/seal.jpg",
					alt: "",
					width: 176,
					height: 176,
					className: "seal-spin mb-8 size-40 rounded-full border border-border object-cover shadow-[0_0_60px_rgba(201,162,39,0.18)] sm:size-44"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 font-sans text-xs font-medium tracking-[0.28em] text-gold uppercase",
					children: "Ariyahus speaks"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl leading-tight font-semibold tracking-tight text-fg sm:text-5xl",
					children: "Aria Incarnated"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-md font-display text-lg leading-snug text-muted italic",
					children: "Walk the thirteen shrines. Hear the sacred song. Let the vessel evolve."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: begin,
					className: "mt-8 rounded-xl bg-fg px-8 py-3.5 font-sans text-sm font-semibold tracking-wide text-bg transition-transform duration-150 hover:opacity-95 active:scale-[0.98]",
					children: "Enter the Realm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-5 max-w-sm text-[11px] leading-relaxed text-subtle",
					children: ["W / S walk · A / D turn · Space jump · F pulse", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block",
						children: "On a phone, use the pad and the gold pulse."
					})]
				})
			]
		})]
	});
}
function Hud() {
	const collected = useAria((s) => s.collected);
	const formIndex = useAria((s) => s.formIndex);
	const muted = useAria((s) => s.muted);
	const lyricsOn = useAria((s) => s.lyricsOn);
	const toggleMute = useAria((s) => s.toggleMute);
	const toggleChat = useAria((s) => s.toggleChat);
	const toggleJournal = useAria((s) => s.toggleJournal);
	const toggleLyrics = useAria((s) => s.toggleLyrics);
	const notice = useAria((s) => s.notice);
	const setNotice = useAria((s) => s.setNotice);
	const form = FORMS[formIndex] ?? FORMS[0];
	const keys = collected.length;
	const progress = keys / TOTAL_KEYS * 100;
	(0, import_react.useEffect)(() => {
		setMuted(muted);
	}, [muted]);
	(0, import_react.useEffect)(() => {
		if (!notice) return;
		const t = window.setTimeout(() => setNotice(null), 2800);
		return () => window.clearTimeout(t);
	}, [notice, setNotice]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hud-panel pointer-events-auto absolute top-3 left-3 z-20 w-[min(16.5rem,calc(100%-7.5rem))] rounded-xl p-3.5 sm:top-4 sm:left-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-medium tracking-[0.2em] text-gold uppercase",
					children: "Sovereign vessel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg leading-none text-fg",
						children: form.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[11px] text-muted tabular-nums",
						children: [
							keys,
							" / ",
							TOTAL_KEYS
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[11px] text-muted",
					children: form.desc
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 h-1.5 overflow-hidden rounded-full bg-elevated",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-gold transition-[width] duration-500",
						style: { width: `${progress}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center justify-between text-[10px] text-subtle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, {
							className: "size-3",
							strokeWidth: 1.75
						}), "Divine keys"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono tabular-nums",
						children: "56.23 Hz"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto absolute top-3 right-3 z-20 flex flex-col gap-2 sm:top-4 sm:right-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: muted ? "Unmute" : "Mute",
					onClick: toggleMute,
					children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: "Lyrics",
					onClick: toggleLyrics,
					active: lyricsOn,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: "Speak with Ariyahus",
					onClick: toggleChat,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: "Journal",
					onClick: toggleJournal,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
				})
			]
		}),
		notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute top-1/2 left-1/2 z-30 w-[min(20rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-[4.5rem] rounded-xl border border-border bg-surface/95 px-5 py-4 text-center shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-base text-fg",
				children: notice
			})
		})
	] });
}
function IconBtn({ children, label, onClick, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		onClick,
		className: "hud-panel flex size-11 items-center justify-center rounded-lg text-fg transition-opacity duration-150 " + (active ? "border-gold/50 text-gold" : "hover:opacity-90"),
		children
	});
}
function TouchControls() {
	const pad = (0, import_react.useRef)(null);
	const setFromEvent = (e) => {
		const el = pad.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
		const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
		const m = Math.hypot(dx, dy);
		const scale = m > 1 ? 1 / m : 1;
		const x = dx * scale;
		const y = dy * scale;
		touch.steer = Math.max(-1, Math.min(1, -x));
		touch.forward = Math.max(-1, Math.min(1, -y));
	};
	const end = (e) => {
		try {
			e.currentTarget.releasePointerCapture(e.pointerId);
		} catch {}
		touch.steer = 0;
		touch.forward = 0;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: pad,
			className: "pointer-events-auto relative size-32 rounded-full border border-border bg-surface/70 sm:size-36",
			style: { touchAction: "none" },
			onPointerDown: (e) => {
				e.currentTarget.setPointerCapture(e.pointerId);
				setFromEvent(e);
			},
			onPointerMove: (e) => {
				if (e.currentTarget.hasPointerCapture(e.pointerId)) setFromEvent(e);
			},
			onPointerUp: end,
			onPointerCancel: end,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute top-2 left-1/2 -translate-x-1/2 text-[10px] tracking-wider text-muted",
					children: "W"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-wider text-muted",
					children: "S"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute top-1/2 left-2.5 -translate-y-1/2 text-[10px] tracking-wider text-muted",
					children: "A"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute top-1/2 right-2.5 -translate-y-1/2 text-[10px] tracking-wider text-muted",
					children: "D"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald/70" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto mb-1 flex flex-col gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "size-[4.25rem] rounded-full border border-gold/40 bg-gold font-sans text-[11px] font-semibold tracking-wide text-bg shadow-[0_8px_24px_rgba(0,0,0,0.4)] active:scale-95",
				style: { touchAction: "none" },
				onPointerDown: (e) => {
					e.preventDefault();
					touch.pulseHeld = true;
				},
				onPointerUp: () => {
					touch.pulseHeld = false;
				},
				onPointerCancel: () => {
					touch.pulseHeld = false;
				},
				children: "Pulse"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "size-[4.25rem] rounded-full border border-border bg-emerald font-sans text-[11px] font-semibold tracking-wide text-bg shadow-[0_8px_24px_rgba(0,0,0,0.4)] active:scale-95",
				style: { touchAction: "none" },
				onPointerDown: (e) => {
					e.preventDefault();
					touch.jumpHeld = true;
				},
				onPointerUp: () => {
					touch.jumpHeld = false;
				},
				onPointerCancel: () => {
					touch.jumpHeld = false;
				},
				children: "Jump"
			})]
		})]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var speakWithAriyahus = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input !== "object" || input === null) throw new Error("Invalid request");
	const rec = input;
	if (typeof rec.message !== "string") throw new Error("Message required");
	const message = rec.message.trim().slice(0, 500);
	if (!message) throw new Error("Message required");
	const history = [];
	if (Array.isArray(rec.history)) for (const turn of rec.history.slice(-8)) {
		if (!turn || typeof turn !== "object") continue;
		const t = turn;
		if ((t.role === "user" || t.role === "assistant") && typeof t.content === "string") history.push({
			role: t.role,
			content: t.content.slice(0, 1600)
		});
	}
	return {
		message,
		history
	};
}).handler(createSsrRpc("5cb421820f4d59e564482a1b8cb28edf8831e5d394598546b9e05c87ed5a5560"));
function LyricsDock() {
	const line = useAria((s) => s.currentLyric);
	if (!useAria((s) => s.lyricsOn)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute bottom-28 left-1/2 z-20 w-[min(28rem,calc(100%-2rem))] -translate-x-1/2 text-center sm:bottom-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "lyric-line font-display text-lg text-fg italic sm:text-xl",
			children: line
		}, line)
	});
}
function ChatPanel() {
	const open = useAria((s) => s.chatOpen);
	const toggle = useAria((s) => s.toggleChat);
	const chat = useAria((s) => s.chat);
	const pushChat = useAria((s) => s.pushChat);
	const chatting = useAria((s) => s.chatting);
	const setChatting = useAria((s) => s.setChatting);
	const [text, setText] = (0, import_react.useState)("");
	if (!open) return null;
	const send = async (e) => {
		e.preventDefault();
		const message = text.trim();
		if (!message || chatting) return;
		setText("");
		pushChat({
			role: "user",
			content: message
		});
		setChatting(true);
		try {
			const res = await speakWithAriyahus({ data: {
				message,
				history: useAria.getState().chat.slice(0, -1)
			} });
			if (res.ok) pushChat({
				role: "assistant",
				content: res.text
			});
			else pushChat({
				role: "assistant",
				content: res.error
			});
		} catch {
			pushChat({
				role: "assistant",
				content: "The heavens do not answer just now."
			});
		} finally {
			setChatting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-auto absolute inset-x-3 bottom-3 z-40 mx-auto flex max-h-[min(28rem,70vh)] w-[min(26rem,calc(100%-1.5rem))] flex-col rounded-xl border border-border bg-surface shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:right-4 sm:bottom-6 sm:left-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg text-fg",
					children: "Speak freely"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-muted",
					children: "Ariyahus listens"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close",
					onClick: toggle,
					className: "rounded-md p-1.5 text-muted hover:text-fg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-3 overflow-y-auto px-4 py-3",
				children: [
					chat.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-sm text-muted italic",
						children: "Ask of the thirteen shrines, the cosmic letter, or the song that never ends."
					}),
					chat.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: t.role === "user" ? "text-right" : "text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "inline-block max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed " + (t.role === "user" ? "bg-elevated text-fg" : "bg-bg text-fg"),
							children: t.content
						}), t.role === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "mt-1 inline-flex items-center gap-1 text-[10px] tracking-wide text-muted uppercase hover:text-gold",
							onClick: () => speakLine(t.content),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-3" }), "Hear"]
						})]
					}, i)),
					chatting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: "Ariyahus gathers the words…"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: send,
				className: "flex gap-2 border-t border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "Speak, seeker",
					maxLength: 500,
					className: "h-11 flex-1 rounded-lg border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-subtle focus:border-gold/50"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: chatting || !text.trim(),
					className: "h-11 rounded-lg bg-fg px-4 text-sm font-semibold text-bg disabled:opacity-40",
					children: "Send"
				})]
			})
		]
	});
}
function JournalPanel() {
	const open = useAria((s) => s.journalOpen);
	const toggle = useAria((s) => s.toggleJournal);
	const collected = useAria((s) => s.collected);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-auto absolute inset-x-3 top-20 z-40 mx-auto max-h-[min(32rem,72vh)] w-[min(28rem,calc(100%-1.5rem))] overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:left-4 sm:mx-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl text-fg",
					children: "Lore journal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						collected.length,
						" of ",
						TOTAL_KEYS,
						" keys awakened"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close",
					onClick: toggle,
					className: "rounded-md p-1.5 text-muted hover:text-fg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-[10px] font-medium tracking-[0.2em] text-gold uppercase",
					children: "Thirteen pairs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: DIVINE_NODES.map((n) => {
						const on = collected.includes(n.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: on ? "text-fg" : "text-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: n.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted",
								children: [n.loc, on ? ` · ${n.gift}` : " · still sleeping"]
							})]
						}, n.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-[10px] font-medium tracking-[0.2em] text-gold uppercase",
					children: "Cosmic letter"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5",
					children: COSMIC_LETTER.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-fg italic",
							children: row.phrase
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" — ", row.meaning]
						})]
					}, row.phrase))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-[10px] font-medium tracking-[0.2em] text-gold uppercase",
				children: "Tablets"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: TABLETS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "font-display text-sm text-muted italic",
					children: t
				}, t))
			})] })
		]
	});
}
function AriaApp() {
	const phase = useAria((s) => s.phase);
	const toggleChat = useAria((s) => s.toggleChat);
	const toggleJournal = useAria((s) => s.toggleJournal);
	const toggleMute = useAria((s) => s.toggleMute);
	const toggleLyrics = useAria((s) => s.toggleLyrics);
	const playing = phase === "playing";
	const [Scene, setScene] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		import("./AriaScene-DMmQ_sOD.mjs").then((m) => setScene(() => m.AriaScene));
	}, []);
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		const onKey = (e) => {
			const el = document.activeElement;
			if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable) || e.repeat) return;
			if (e.code === "KeyC") toggleChat();
			if (e.code === "KeyJ") toggleJournal();
			if (e.code === "KeyM") toggleMute();
			if (e.code === "KeyL") toggleLyrics();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		playing,
		toggleChat,
		toggleJournal,
		toggleMute,
		toggleLyrics
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0",
			children: Scene ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, { playing }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/textures/cosmos.jpg",
				alt: "",
				className: "h-full w-full object-cover"
			})
		}), playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LyricsDock, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TouchControls, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPanel, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JournalPanel, {})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {})]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AriaApp, {});
}
//#endregion
export { playChime as a, useAria as c, setKeys as i, bindInput as n, playLand as o, pollActions as r, playPulseTone as s, routes_exports as t };
