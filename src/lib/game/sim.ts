import { groundTop, sampleGround } from "./world";

export type Sim = {
  x: number;
  y: number;
  z: number;
  yaw: number;
  vy: number;
  onGround: boolean;
  coyote: number;
  jumpBuf: number;
  speed: number;
  trauma: number;
  squash: number;
};

export const WALK_SPEED = 6.8;
export const TURN_RATE = 2.45;
export const JUMP_VEL = 8.2;
export const GRAVITY = 22;
export const COYOTE = 0.11;
export const JUMP_BUF = 0.13;

export function createSim(): Sim {
  const gy = Math.max(1, sampleGround(0, 2.5));
  return {
    x: 0,
    y: gy + 0.02,
    z: 2.5,
    yaw: 0,
    vy: 0,
    onGround: true,
    coyote: 0,
    jumpBuf: 0,
    speed: 0,
    trauma: 0,
    squash: 1,
  };
}

export function heading(yaw: number) {
  return { fx: -Math.sin(yaw), fz: -Math.cos(yaw) };
}

export function stepSim(
  s: Sim,
  dt: number,
  input: { forward: number; steer: number; jump: boolean },
) {
  s.yaw += input.steer * TURN_RATE * dt;
  const { fx, fz } = heading(s.yaw);

  const wish = input.forward;
  s.speed = wish * WALK_SPEED;
  const nx = s.x + fx * s.speed * dt;
  const nz = s.z + fz * s.speed * dt;

  const tryGround = sampleGround(nx, nz);
  if (tryGround > -50) {
    s.x = nx;
    s.z = nz;
  } else {
    if (sampleGround(nx, s.z) > -50) s.x = nx;
    else if (sampleGround(s.x, nz) > -50) s.z = nz;
  }

  if (input.jump) s.jumpBuf = JUMP_BUF;
  else s.jumpBuf = Math.max(0, s.jumpBuf - dt);

  const g = sampleGround(s.x, s.z);
  if (g <= -50) {
    s.x = 0;
    s.z = 2.5;
    s.y = Math.max(1, sampleGround(0, 2.5)) + 0.02;
    s.vy = 0;
    s.onGround = true;
  }
  const floor = sampleGround(s.x, s.z);

  if (s.onGround) s.coyote = COYOTE;
  else s.coyote = Math.max(0, s.coyote - dt);

  if (s.jumpBuf > 0 && s.coyote > 0) {
    s.vy = JUMP_VEL;
    s.onGround = false;
    s.coyote = 0;
    s.jumpBuf = 0;
    s.squash = 1.18;
  }

  s.vy -= GRAVITY * dt;
  s.y += s.vy * dt;

  if (s.y <= floor) {
    const landing = !s.onGround && s.vy < -2;
    s.y = floor;
    s.vy = 0;
    s.onGround = true;
    if (landing) {
      s.squash = 0.82;
      s.trauma = Math.min(1, s.trauma + 0.12);
    }
  } else {
    s.onGround = false;
  }

  s.squash += (1 - s.squash) * Math.min(1, 10 * dt);
  s.trauma = Math.max(0, s.trauma - dt * 1.6);
}

export function addTrauma(s: Sim, amt: number) {
  s.trauma = Math.min(1, s.trauma + amt);
}

export function cellAhead(s: Sim, dist = 2) {
  const { fx, fz } = heading(s.yaw);
  return {
    x: Math.round(s.x + fx * dist),
    z: Math.round(s.z + fz * dist),
    y: Math.max(0, Math.round(groundTop(s.x + fx * dist, s.z + fz * dist))),
  };
}
