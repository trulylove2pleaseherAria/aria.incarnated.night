export type Actions = {
  forward: number;
  steer: number;
  jump: boolean;
  pulse: boolean;
};

const keys = new Set<string>();
let override: string[] | null = null;
let jumpEdge = false;
let pulseEdge = false;
let prevJump = false;
let prevPulse = false;
let queuedPulse = false;
let queuedJump = false;

export const touch = {
  forward: 0,
  steer: 0,
  jumpHeld: false,
  pulseHeld: false,
};

const GAME_CODES = new Set([
  "KeyW", "KeyA", "KeyS", "KeyD",
  "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight",
  "Space", "KeyF", "KeyB", "KeyC", "KeyJ", "KeyM", "KeyL",
]);

function typing(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || (el as HTMLElement).isContentEditable;
}

function isDown(code: string) {
  if (override) return override.includes(code);
  return keys.has(code);
}

function onKeyDown(e: KeyboardEvent) {
  if (typing()) return;
  if (GAME_CODES.has(e.code)) e.preventDefault();
  keys.add(e.code);
}

function onKeyUp(e: KeyboardEvent) {
  keys.delete(e.code);
}

function onBlur() {
  keys.clear();
}

let bound = false;

export function bindInput() {
  if (bound) return;
  bound = true;
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) keys.clear();
  });
}

export function setKeys(codes: string[]) {
  override = codes.length === 0 ? null : codes;
}

export function queuePulse() {
  queuedPulse = true;
}

export function queueJump() {
  queuedJump = true;
}

function radial(x: number, y: number, dz = 0.18) {
  const m = Math.hypot(x, y);
  if (m < dz) return { x: 0, y: 0 };
  const scale = ((m - dz) / (1 - dz)) / m;
  return { x: x * scale, y: y * scale };
}

export function pollActions(): Actions {
  let forward = 0;
  let steer = 0;
  let jumpHeld = queuedJump;
  let pulseHeld = queuedPulse;
  queuedJump = false;
  queuedPulse = false;

  if (isDown("KeyW") || isDown("ArrowUp")) forward += 1;
  if (isDown("KeyS") || isDown("ArrowDown")) forward -= 1;
  if (isDown("KeyA") || isDown("ArrowLeft")) steer += 1;
  if (isDown("KeyD") || isDown("ArrowRight")) steer -= 1;
  if (isDown("Space")) jumpHeld = true;
  if (isDown("KeyF")) pulseHeld = true;

  const pads = typeof navigator !== "undefined" ? navigator.getGamepads?.() : null;
  if (pads) {
    for (const pad of pads) {
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

  return { forward, steer, jump: jumpEdge, pulse: pulseEdge };
}
