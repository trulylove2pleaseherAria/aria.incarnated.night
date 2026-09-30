import { i as __toESM } from "../_runtime.mjs";
import { i as FORMS, r as DIVINE_NODES } from "./lore-CJWDHwFa.mjs";
import { a as useThree, c as Float32BufferAttribute, i as useFrame, l as PointsMaterial, m as require_react, n as Float, o as BufferAttribute, p as require_jsx_runtime, r as Canvas, s as BufferGeometry, t as Stars, u as Vector3 } from "../_libs/@react-three/drei+[...].mjs";
import { a as playChime, c as useAria, i as setKeys, n as bindInput, o as playLand, r as pollActions, s as playPulseTone } from "./routes-CbDPnviQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AriaScene-DMmQ_sOD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COL = {
	stone: [
		.18,
		.2,
		.26
	],
	grass: [
		.18,
		.42,
		.34
	],
	gold: [
		.79,
		.64,
		.18
	],
	crystal: [
		.55,
		.42,
		.72
	]
};
var heights = /* @__PURE__ */ new Int8Array(2025);
var cells = /* @__PURE__ */ new Uint8Array(20250);
function hIndex(x, z) {
	return (z + 22) * 45 + (x + 22);
}
function cIndex(x, y, z) {
	const ix = x + 22;
	const iz = z + 22;
	if (ix < 0 || iz < 0 || ix >= 45 || iz >= 45 || y < 0 || y >= 10) return -1;
	return y * 45 * 45 + iz * 45 + ix;
}
function inBounds(x, z) {
	return x >= -22 && x <= 22 && z >= -22 && z <= 22;
}
function computeHeight(x, z) {
	const r = Math.hypot(x, z);
	if (r > 21.2) return -1;
	const fall = Math.max(0, 1 - r / 21.2);
	const n = Math.sin(x * .17) * 1.35 + Math.cos(z * .15) * 1.15 + Math.sin(x * .08 + z * .11) * .85;
	return Math.max(0, Math.min(7, Math.floor((2.4 + n) * fall)));
}
function groundTop(x, z) {
	const ix = Math.round(x);
	const iz = Math.round(z);
	if (!inBounds(ix, iz)) return -99;
	const h = heights[hIndex(ix, iz)];
	if (h < 0) return -99;
	return h + 1;
}
function setCell(x, y, z, type) {
	const i = cIndex(x, y, z);
	if (i < 0) return;
	cells[i] = type;
	const hi = hIndex(x, z);
	if (type !== 0 && y > heights[hi]) heights[hi] = y;
}
function getCell(x, y, z) {
	const i = cIndex(x, y, z);
	return i < 0 ? 0 : cells[i];
}
var SHRINES = (() => {
	const list = [];
	for (let i = 0; i < DIVINE_NODES.length; i++) {
		const a = i / DIVINE_NODES.length * Math.PI * 2 - Math.PI / 2;
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
			gift: node.gift
		});
	}
	return list;
})();
function stampWorld() {
	heights.fill(-1);
	cells.fill(0);
	for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) {
		const h = computeHeight(x, z);
		heights[hIndex(x, z)] = h;
		if (h < 0) continue;
		for (let y = 0; y <= h; y++) setCell(x, y, z, y === h ? 2 : 1);
	}
	for (const s of SHRINES) {
		const base = Math.max(0, heights[hIndex(s.x, s.z)]);
		s.y = base + 1;
		for (let level = 0; level < 3; level++) {
			const span = 2 - level;
			for (let dx = -span; dx <= span; dx++) for (let dz = -span; dz <= span; dz++) setCell(s.x + dx, base + 1 + level, s.z + dz, 3);
		}
		setCell(s.x, base + 4, s.z, 4);
		s.y = base + 5.2;
	}
}
stampWorld();
var DIRS = [
	[
		1,
		0,
		0,
		[
			1,
			0,
			0
		]
	],
	[
		-1,
		0,
		0,
		[
			-1,
			0,
			0
		]
	],
	[
		0,
		1,
		0,
		[
			0,
			1,
			0
		]
	],
	[
		0,
		-1,
		0,
		[
			0,
			-1,
			0
		]
	],
	[
		0,
		0,
		1,
		[
			0,
			0,
			1
		]
	],
	[
		0,
		0,
		-1,
		[
			0,
			0,
			-1
		]
	]
];
function colorFor(type) {
	if (type === 2) return COL.grass;
	if (type === 3) return COL.gold;
	if (type === 4) return COL.crystal;
	return COL.stone;
}
function shade(n, c) {
	const lit = .55 + .45 * Math.max(0, n[0] * .3 + n[1] * .85 + n[2] * .2);
	return [
		c[0] * lit,
		c[1] * lit,
		c[2] * lit
	];
}
function buildTerrainGeometry() {
	const pos = [];
	const nrm = [];
	const col = [];
	function quad(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, n, rgb) {
		pos.push(ax, ay, az, bx, by, bz, cx, cy, cz, ax, ay, az, cx, cy, cz, dx, dy, dz);
		for (let i = 0; i < 6; i++) nrm.push(n[0], n[1], n[2]);
		for (let i = 0; i < 6; i++) col.push(rgb[0], rgb[1], rgb[2]);
	}
	for (let x = -22; x <= 22; x++) for (let z = -22; z <= 22; z++) for (let y = 0; y < 10; y++) {
		const t = getCell(x, y, z);
		if (!t) continue;
		const rgb = colorFor(t);
		for (const [dx, dy, dz, n] of DIRS) {
			if (getCell(x + dx, y + dy, z + dz)) continue;
			const s = shade(n, rgb);
			const cx = x + .5, cy = y + .5, cz = z + .5;
			if (dx === 1) quad(cx + .5, cy - .5, cz - .5, cx + .5, cy - .5, cz + .5, cx + .5, cy + .5, cz + .5, cx + .5, cy + .5, cz - .5, n, s);
			else if (dx === -1) quad(cx - .5, cy - .5, cz + .5, cx - .5, cy - .5, cz - .5, cx - .5, cy + .5, cz - .5, cx - .5, cy + .5, cz + .5, n, s);
			else if (dy === 1) quad(cx - .5, cy + .5, cz + .5, cx - .5, cy + .5, cz - .5, cx + .5, cy + .5, cz - .5, cx + .5, cy + .5, cz + .5, n, s);
			else if (dy === -1) quad(cx - .5, cy - .5, cz - .5, cx - .5, cy - .5, cz + .5, cx + .5, cy - .5, cz + .5, cx + .5, cy - .5, cz - .5, n, s);
			else if (dz === 1) quad(cx + .5, cy - .5, cz + .5, cx - .5, cy - .5, cz + .5, cx - .5, cy + .5, cz + .5, cx + .5, cy + .5, cz + .5, n, s);
			else quad(cx - .5, cy - .5, cz - .5, cx + .5, cy - .5, cz - .5, cx + .5, cy + .5, cz - .5, cx - .5, cy + .5, cz - .5, n, s);
		}
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
	geo.setAttribute("normal", new Float32BufferAttribute(nrm, 3));
	geo.setAttribute("color", new Float32BufferAttribute(col, 3));
	geo.computeBoundingSphere();
	return geo;
}
function sampleGround(x, z) {
	const x0 = Math.floor(x);
	const z0 = Math.floor(z);
	const tx = x - x0;
	const tz = z - z0;
	const h00 = groundTop(x0, z0);
	const h10 = groundTop(x0 + 1, z0);
	const h01 = groundTop(x0, z0 + 1);
	const h11 = groundTop(x0 + 1, z0 + 1);
	const a = h00 > -50 ? h00 : h10 > -50 ? h10 : 0;
	const b = h10 > -50 ? h10 : a;
	const c = h01 > -50 ? h01 : a;
	const d = h11 > -50 ? h11 : a;
	return a * (1 - tx) * (1 - tz) + b * tx * (1 - tz) + c * (1 - tx) * tz + d * tx * tz;
}
var WALK_SPEED = 6.8;
var TURN_RATE = 2.45;
var JUMP_VEL = 8.2;
var COYOTE = .11;
var JUMP_BUF = .13;
function createSim() {
	return {
		x: 0,
		y: Math.max(1, sampleGround(0, 0)) + .02,
		z: 2.5,
		yaw: 0,
		vy: 0,
		onGround: true,
		coyote: 0,
		jumpBuf: 0,
		speed: 0,
		trauma: 0,
		squash: 1
	};
}
function heading(yaw) {
	return {
		fx: -Math.sin(yaw),
		fz: -Math.cos(yaw)
	};
}
function stepSim(s, dt, input) {
	s.yaw += input.steer * TURN_RATE * dt;
	const { fx, fz } = heading(s.yaw);
	s.speed = input.forward * WALK_SPEED;
	const nx = s.x + fx * s.speed * dt;
	const nz = s.z + fz * s.speed * dt;
	if (sampleGround(nx, nz) > -50) {
		s.x = nx;
		s.z = nz;
	} else if (sampleGround(nx, s.z) > -50) s.x = nx;
	else if (sampleGround(s.x, nz) > -50) s.z = nz;
	if (input.jump) s.jumpBuf = JUMP_BUF;
	else s.jumpBuf = Math.max(0, s.jumpBuf - dt);
	const g = sampleGround(s.x, s.z);
	const floor = g > -50 ? g : -8;
	if (s.onGround) s.coyote = COYOTE;
	else s.coyote = Math.max(0, s.coyote - dt);
	if (s.jumpBuf > 0 && s.coyote > 0) {
		s.vy = JUMP_VEL;
		s.onGround = false;
		s.coyote = 0;
		s.jumpBuf = 0;
		s.squash = 1.18;
	}
	s.vy -= 22 * dt;
	s.y += s.vy * dt;
	if (s.y <= floor) {
		const landing = !s.onGround && s.vy < -2;
		s.y = floor;
		s.vy = 0;
		s.onGround = true;
		if (landing) {
			s.squash = .82;
			s.trauma = Math.min(1, s.trauma + .12);
		}
	} else s.onGround = false;
	s.squash += (1 - s.squash) * Math.min(1, 10 * dt);
	s.trauma = Math.max(0, s.trauma - dt * 1.6);
}
function addTrauma(s, amt) {
	s.trauma = Math.min(1, s.trauma + amt);
}
var tmpCam = new Vector3();
var tmpLook = new Vector3();
var tmpOff = new Vector3();
function Terrain() {
	const geo = (0, import_react.useMemo)(() => buildTerrainGeometry(), []);
	(0, import_react.useEffect)(() => () => geo.dispose(), [geo]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		geometry: geo,
		receiveShadow: true,
		castShadow: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshLambertMaterial", { vertexColors: true })
	});
}
function KeyCrystal({ shrine, collected }) {
	if (collected) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Float, {
		speed: 1.6,
		floatIntensity: .35,
		rotationIntensity: .4,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				shrine.x,
				shrine.y,
				shrine.z
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("octahedronGeometry", { args: [.38, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#c9a227",
				emissive: "#c9a227",
				emissiveIntensity: .85,
				metalness: .55,
				roughness: .25
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
			position: [
				shrine.x,
				shrine.y + .4,
				shrine.z
			],
			color: "#e8d48a",
			intensity: 1.4,
			distance: 7
		})]
	});
}
function VesselMesh({ form }) {
	const def = FORMS[form] ?? FORMS[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.85,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.72,
				.95,
				.48
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: def.body,
				metalness: .35,
				roughness: .5
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.52,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.52,
				.5,
				.5
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e4d2c0",
				roughness: .7
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-.12,
				1.56,
				.26
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.07,
				8,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: def.glow,
				emissive: def.glow,
				emissiveIntensity: 1.5
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.12,
				1.56,
				.26
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.07,
				8,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: def.glow,
				emissive: def.glow,
				emissiveIntensity: 1.5
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.95,
				0
			],
			rotation: [
				0,
				Math.PI / 4,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
				.22,
				.38,
				4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#c9a227",
				emissive: "#c9a227",
				emissiveIntensity: .45,
				metalness: .8
			})]
		}),
		form >= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-.22,
				1.82,
				0
			],
			rotation: [
				0,
				0,
				.5
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
				.1,
				.28,
				3
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: def.body })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.22,
				1.82,
				0
			],
			rotation: [
				0,
				0,
				-.5
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
				.1,
				.28,
				3
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: def.body })]
		})] }),
		form >= 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-.55,
				1.1,
				-.05
			],
			rotation: [
				0,
				0,
				.7
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.7,
				.08,
				.45
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: def.glow,
				emissive: def.glow,
				emissiveIntensity: .4,
				transparent: true,
				opacity: .85
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.55,
				1.1,
				-.05
			],
			rotation: [
				0,
				0,
				-.7
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.7,
				.08,
				.45
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: def.glow,
				emissive: def.glow,
				emissiveIntensity: .4,
				transparent: true,
				opacity: .85
			})]
		})] }),
		form >= 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.15,
				-.35
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("octahedronGeometry", { args: [.22, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e8e0d0",
				emissive: def.glow,
				emissiveIntensity: .7
			})]
		}),
		form >= 7 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.52,
				-.42
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.4,
				.4,
				.32
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: def.body,
				metalness: .5,
				roughness: .4
			})]
		})
	] });
}
function PulseRing({ origin }) {
	const mesh = (0, import_react.useRef)(null);
	const pulseAt = useAria((s) => s.pulseAt);
	const born = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		born.current = pulseAt;
	}, [pulseAt]);
	useFrame(() => {
		const m = mesh.current;
		if (!m) return;
		const age = (performance.now() - born.current) / 900;
		if (age < 0 || age > 1 || born.current === 0) {
			m.visible = false;
			return;
		}
		m.visible = true;
		const s = origin.current;
		m.position.set(s.x, s.y + .4, s.z);
		const sc = .4 + age * 9;
		m.scale.set(sc, 1, sc);
		const mat = m.material;
		mat.opacity = .55 * (1 - age);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref: mesh,
		rotation: [
			-Math.PI / 2,
			0,
			0
		],
		visible: false,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
			.85,
			1.05,
			48
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "#c9a227",
			transparent: true,
			opacity: .5,
			side: 2
		})]
	});
}
function Rig({ playing }) {
	const group = (0, import_react.useRef)(null);
	const inner = (0, import_react.useRef)(null);
	const sim = (0, import_react.useRef)(createSim());
	const acc = (0, import_react.useRef)(0);
	const form = useAria((s) => s.formIndex);
	const collected = useAria((s) => s.collected);
	const collectKey = useAria((s) => s.collectKey);
	const triggerPulse = useAria((s) => s.triggerPulse);
	const { camera } = useThree();
	const collectedRef = (0, import_react.useRef)(collected);
	collectedRef.current = collected;
	(0, import_react.useEffect)(() => {
		bindInput();
		window.__controlsTest = {
			getYaw: () => sim.current.yaw,
			getSpeed: () => Math.abs(sim.current.speed),
			setKeys
		};
		return () => {
			delete window.__controlsTest;
		};
	}, []);
	useFrame((state, delta) => {
		const d = Math.min(delta, .1);
		const s = sim.current;
		if (!playing) {
			const t = state.clock.elapsedTime * .12;
			camera.position.set(Math.sin(t) * 16, 11, Math.cos(t) * 16);
			camera.lookAt(0, 2.2, 0);
			if (group.current) {
				group.current.position.set(s.x, s.y, s.z);
				group.current.rotation.y = s.yaw;
			}
			return;
		}
		acc.current += d;
		const step = 1 / 60;
		let landed = false;
		while (acc.current >= step) {
			const actions = pollActions();
			const beforeGround = s.onGround;
			stepSim(s, step, actions);
			if (!beforeGround && s.onGround) landed = true;
			if (actions.pulse) {
				triggerPulse();
				playPulseTone();
				addTrauma(s, .28);
				for (const shrine of SHRINES) {
					if (collectedRef.current.includes(shrine.id)) continue;
					const dx = s.x - shrine.x;
					const dz = s.z - shrine.z;
					if (dx * dx + dz * dz < 64) {
						collectKey(shrine.id);
						playChime();
						addTrauma(s, .2);
					}
				}
			}
			for (const shrine of SHRINES) {
				if (collectedRef.current.includes(shrine.id)) continue;
				const dx = s.x - shrine.x;
				const dz = s.z - shrine.z;
				const dy = s.y - shrine.y;
				if (dx * dx + dz * dz + dy * dy < 3.6) {
					collectKey(shrine.id);
					playChime();
					addTrauma(s, .22);
				}
			}
			acc.current -= step;
		}
		if (landed) playLand();
		if (group.current) {
			group.current.position.set(s.x, s.y, s.z);
			group.current.rotation.y = s.yaw;
		}
		if (inner.current) {
			const sq = s.squash;
			inner.current.scale.set(1 / Math.max(.7, sq), sq, 1 / Math.max(.7, sq));
		}
		const { fx, fz } = heading(s.yaw);
		tmpOff.set(-fx * 9.5, 5.6, -fz * 9.5);
		tmpCam.set(s.x, s.y, s.z).add(tmpOff);
		const k = 1 - Math.exp(-4.2 * d);
		camera.position.lerp(tmpCam, k);
		const shake = s.trauma * s.trauma;
		if (shake > .002) {
			camera.position.x += (Math.random() - .5) * shake * .35;
			camera.position.y += (Math.random() - .5) * shake * .22;
		}
		tmpLook.set(s.x, s.y + 1.55, s.z);
		camera.lookAt(tmpLook);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref: group,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: inner,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VesselMesh, { form })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PulseRing, { origin: sim })] });
}
function Motes() {
	const geo = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		const n = 80;
		const p = /* @__PURE__ */ new Float32Array(240);
		for (let i = 0; i < n; i++) {
			const a = Math.random() * Math.PI * 2;
			const r = 4 + Math.random() * 16;
			p[i * 3] = Math.cos(a) * r;
			p[i * 3 + 1] = 2 + Math.random() * 8;
			p[i * 3 + 2] = Math.sin(a) * r;
		}
		g.setAttribute("position", new BufferAttribute(p, 3));
		return g;
	}, []);
	const mat = (0, import_react.useMemo)(() => new PointsMaterial({
		color: 13214247,
		size: .08,
		transparent: true,
		opacity: .55,
		depthWrite: false
	}), []);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => () => {
		geo.dispose();
		mat.dispose();
	}, [geo, mat]);
	useFrame((_, dt) => {
		if (ref.current) ref.current.rotation.y += .02 * Math.min(dt, .1);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("points", {
		ref,
		geometry: geo,
		material: mat
	});
}
function AriaScene({ playing }) {
	const collected = useAria((s) => s.collected);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
		shadows: true,
		dpr: [1, 1.5],
		camera: {
			fov: 58,
			near: .1,
			far: 140,
			position: [
				14,
				11,
				14
			]
		},
		gl: {
			antialias: true,
			powerPreference: "high-performance"
		},
		onCreated: ({ gl }) => {
			gl.setClearColor("#07060e");
		},
		style: { touchAction: "none" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
				attach: "fog",
				args: [
					"#07060e",
					26,
					68
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", {
				intensity: .28,
				color: "#9aa6c4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
				"#24324c",
				"#1a2e28",
				.4
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					16,
					28,
					10
				],
				intensity: 1.05,
				color: "#e6d3a0",
				castShadow: true,
				"shadow-mapSize-width": 1024,
				"shadow-mapSize-height": 1024,
				"shadow-camera-left": -28,
				"shadow-camera-right": 28,
				"shadow-camera-top": 28,
				"shadow-camera-bottom": -28
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
				radius: 70,
				depth: 36,
				count: 1800,
				factor: 3.2,
				saturation: .15,
				fade: true,
				speed: .35
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terrain, {}),
			SHRINES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyCrystal, {
				shrine: s,
				collected: collected.includes(s.id)
			}, s.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Motes, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rig, { playing })
		]
	});
}
//#endregion
export { AriaScene };
