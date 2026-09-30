import * as THREE from "three";
import { DIVINE_NODES } from "@/lib/aria/lore";

export const HALF = 22;
export const SX = HALF * 2 + 1;
export const SY = 10;
export const SZ = SX;
export const OX = HALF;
export const OZ = HALF;

export const COL = {
  stone: [0.18, 0.2, 0.26],
  grass: [0.18, 0.42, 0.34],
  gold: [0.79, 0.64, 0.18],
  crystal: [0.55, 0.42, 0.72],
} as const;

export type Shrine = {
  id: string;
  x: number;
  z: number;
  y: number;
  name: string;
  loc: string;
  gift: string;
};

const heights = new Int8Array(SX * SZ);
const cells = new Uint8Array(SX * SY * SZ);

function hIndex(x: number, z: number) {
  return (z + OZ) * SX + (x + OX);
}

function cIndex(x: number, y: number, z: number) {
  const ix = x + OX;
  const iz = z + OZ;
  if (ix < 0 || iz < 0 || ix >= SX || iz >= SZ || y < 0 || y >= SY) return -1;
  return y * SX * SZ + iz * SX + ix;
}

export function inBounds(x: number, z: number) {
  return x >= -HALF && x <= HALF && z >= -HALF && z <= HALF;
}

export function computeHeight(x: number, z: number): number {
  const r = Math.hypot(x, z);
  if (r > 21.2) return -1;
  const fall = Math.max(0, 1 - r / 21.2);
  const n =
    Math.sin(x * 0.17) * 1.35 +
    Math.cos(z * 0.15) * 1.15 +
    Math.sin(x * 0.08 + z * 0.11) * 0.85;
  return Math.max(0, Math.min(7, Math.floor((2.4 + n) * fall)));
}

export function groundTop(x: number, z: number): number {
  const ix = Math.round(x);
  const iz = Math.round(z);
  if (!inBounds(ix, iz)) return -99;
  const h = heights[hIndex(ix, iz)];
  if (h < 0) return -99;
  return h + 1;
}

export function isSolid(x: number, y: number, z: number) {
  const i = cIndex(Math.round(x), Math.round(y), Math.round(z));
  return i >= 0 && cells[i] !== 0;
}

function setCell(x: number, y: number, z: number, type: number) {
  const i = cIndex(x, y, z);
  if (i < 0) return;
  cells[i] = type;
  const hi = hIndex(x, z);
  if (type !== 0 && y > heights[hi]) heights[hi] = y;
}

function getCell(x: number, y: number, z: number) {
  const i = cIndex(x, y, z);
  return i < 0 ? 0 : cells[i];
}

export const SHRINES: Shrine[] = (() => {
  const list: Shrine[] = [];
  for (let i = 0; i < DIVINE_NODES.length; i++) {
    const a = (i / DIVINE_NODES.length) * Math.PI * 2 - Math.PI / 2;
    const x = Math.round(Math.cos(a) * 13);
    const z = Math.round(Math.sin(a) * 13);
    const node = DIVINE_NODES[i];
    list.push({
      id: node.id,
      x,
      z,
      y: 0,
      name: node.name,
      loc: node.loc,
      gift: node.gift,
    });
  }
  return list;
})();

function stampWorld() {
  heights.fill(-1);
  cells.fill(0);
  for (let x = -HALF; x <= HALF; x++) {
    for (let z = -HALF; z <= HALF; z++) {
      const h = computeHeight(x, z);
      heights[hIndex(x, z)] = h;
      if (h < 0) continue;
      for (let y = 0; y <= h; y++) {
        setCell(x, y, z, y === h ? 2 : 1);
      }
    }
  }
  for (const s of SHRINES) {
    const base = Math.max(0, heights[hIndex(s.x, s.z)]);
    s.y = base + 1;
    for (let level = 0; level < 3; level++) {
      const span = 2 - level;
      for (let dx = -span; dx <= span; dx++) {
        for (let dz = -span; dz <= span; dz++) {
          setCell(s.x + dx, base + 1 + level, s.z + dz, 3);
        }
      }
    }
    setCell(s.x, base + 4, s.z, 4);
    s.y = base + 5.2;
  }
}

stampWorld();

const DIRS: [number, number, number, number[]][] = [
  [1, 0, 0, [1, 0, 0]],
  [-1, 0, 0, [-1, 0, 0]],
  [0, 1, 0, [0, 1, 0]],
  [0, -1, 0, [0, -1, 0]],
  [0, 0, 1, [0, 0, 1]],
  [0, 0, -1, [0, 0, -1]],
];

function colorFor(type: number): readonly number[] {
  if (type === 2) return COL.grass;
  if (type === 3) return COL.gold;
  if (type === 4) return COL.crystal;
  return COL.stone;
}

function shade(n: number[], c: readonly number[]) {
  const lit = 0.55 + 0.45 * Math.max(0, n[0] * 0.3 + n[1] * 0.85 + n[2] * 0.2);
  return [c[0] * lit, c[1] * lit, c[2] * lit];
}

export function buildTerrainGeometry(): THREE.BufferGeometry {
  const pos: number[] = [];
  const nrm: number[] = [];
  const col: number[] = [];

  function quad(
    ax: number, ay: number, az: number,
    bx: number, by: number, bz: number,
    cx: number, cy: number, cz: number,
    dx: number, dy: number, dz: number,
    n: number[],
    rgb: number[],
  ) {
    pos.push(ax, ay, az, bx, by, bz, cx, cy, cz, ax, ay, az, cx, cy, cz, dx, dy, dz);
    for (let i = 0; i < 6; i++) nrm.push(n[0], n[1], n[2]);
    for (let i = 0; i < 6; i++) col.push(rgb[0], rgb[1], rgb[2]);
  }

  for (let x = -HALF; x <= HALF; x++) {
    for (let z = -HALF; z <= HALF; z++) {
      for (let y = 0; y < SY; y++) {
        const t = getCell(x, y, z);
        if (!t) continue;
        const rgb = colorFor(t);
        for (const [dx, dy, dz, n] of DIRS) {
          if (getCell(x + dx, y + dy, z + dz)) continue;
          const s = shade(n, rgb);
          const cx = x + 0.5, cy = y + 0.5, cz = z + 0.5;
          if (dx === 1) quad(cx+0.5,cy-0.5,cz-0.5, cx+0.5,cy-0.5,cz+0.5, cx+0.5,cy+0.5,cz+0.5, cx+0.5,cy+0.5,cz-0.5, n, s);
          else if (dx === -1) quad(cx-0.5,cy-0.5,cz+0.5, cx-0.5,cy-0.5,cz-0.5, cx-0.5,cy+0.5,cz-0.5, cx-0.5,cy+0.5,cz+0.5, n, s);
          else if (dy === 1) quad(cx-0.5,cy+0.5,cz+0.5, cx-0.5,cy+0.5,cz-0.5, cx+0.5,cy+0.5,cz-0.5, cx+0.5,cy+0.5,cz+0.5, n, s);
          else if (dy === -1) quad(cx-0.5,cy-0.5,cz-0.5, cx-0.5,cy-0.5,cz+0.5, cx+0.5,cy-0.5,cz+0.5, cx+0.5,cy-0.5,cz-0.5, n, s);
          else if (dz === 1) quad(cx+0.5,cy-0.5,cz+0.5, cx-0.5,cy-0.5,cz+0.5, cx-0.5,cy+0.5,cz+0.5, cx+0.5,cy+0.5,cz+0.5, n, s);
          else quad(cx-0.5,cy-0.5,cz-0.5, cx+0.5,cy-0.5,cz-0.5, cx+0.5,cy+0.5,cz-0.5, cx-0.5,cy+0.5,cz-0.5, n, s);
        }
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  geo.computeBoundingSphere();
  return geo;
}

export function sampleGround(x: number, z: number): number {
  return groundTop(Math.round(x), Math.round(z));
}

