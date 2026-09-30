import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { FORMS } from "@/lib/aria/lore";
import { useAria } from "@/lib/aria/store";
import { playChime, playLand, playPulseTone } from "@/lib/aria/audio";
import { bindInput, pollActions, queuePulse, setKeys } from "./input";
import { addTrauma, createSim, heading, stepSim, type Sim } from "./sim";
import { SHRINES, buildTerrainGeometry } from "./world";

const tmpCam = new THREE.Vector3();
const tmpLook = new THREE.Vector3();
const tmpOff = new THREE.Vector3();

type Probe = {
  getYaw: () => number;
  getSpeed: () => number;
  setKeys: (codes: string[]) => void;
  pulse?: () => void;
};

declare global {
  interface Window {
    __controlsTest?: Probe;
  }
}

function Terrain() {
  const geo = useMemo(() => buildTerrainGeometry(), []);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} receiveShadow castShadow>
      <meshLambertMaterial vertexColors />
    </mesh>
  );
}

function KeyCrystal({
  shrine,
  collected,
}: {
  shrine: (typeof SHRINES)[number];
  collected: boolean;
}) {
  if (collected) return null;
  return (
    <Float speed={1.6} floatIntensity={0.35} rotationIntensity={0.4}>
      <mesh position={[shrine.x, shrine.y, shrine.z]} castShadow>
        <octahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          color="#c9a227"
          emissive="#c9a227"
          emissiveIntensity={0.85}
          metalness={0.55}
          roughness={0.25}
        />
      </mesh>
      <pointLight
        position={[shrine.x, shrine.y + 0.4, shrine.z]}
        color="#e8d48a"
        intensity={1.4}
        distance={7}
      />
    </Float>
  );
}

function VesselMesh({ form }: { form: number }) {
  const def = FORMS[form] ?? FORMS[0];
  return (
    <group>
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.72, 0.95, 0.48]} />
        <meshStandardMaterial color={def.body} metalness={0.35} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.52, 0]} castShadow>
        <boxGeometry args={[0.52, 0.5, 0.5]} />
        <meshStandardMaterial color="#e4d2c0" roughness={0.7} />
      </mesh>
      <mesh position={[-0.12, 1.56, 0.26]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color={def.glow} emissive={def.glow} emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0.12, 1.56, 0.26]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color={def.glow} emissive={def.glow} emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, 1.95, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.22, 0.38, 4]} />
        <meshStandardMaterial color="#c9a227" emissive="#c9a227" emissiveIntensity={0.45} metalness={0.8} />
      </mesh>
      {form >= 1 && (
        <>
          <mesh position={[-0.22, 1.82, 0]} rotation={[0, 0, 0.5]}>
            <coneGeometry args={[0.1, 0.28, 3]} />
            <meshStandardMaterial color={def.body} />
          </mesh>
          <mesh position={[0.22, 1.82, 0]} rotation={[0, 0, -0.5]}>
            <coneGeometry args={[0.1, 0.28, 3]} />
            <meshStandardMaterial color={def.body} />
          </mesh>
        </>
      )}
      {form >= 3 && (
        <>
          <mesh position={[-0.55, 1.1, -0.05]} rotation={[0, 0, 0.7]}>
            <boxGeometry args={[0.7, 0.08, 0.45]} />
            <meshStandardMaterial
              color={def.glow}
              emissive={def.glow}
              emissiveIntensity={0.4}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh position={[0.55, 1.1, -0.05]} rotation={[0, 0, -0.7]}>
            <boxGeometry args={[0.7, 0.08, 0.45]} />
            <meshStandardMaterial
              color={def.glow}
              emissive={def.glow}
              emissiveIntensity={0.4}
              transparent
              opacity={0.85}
            />
          </mesh>
        </>
      )}
      {form >= 5 && (
        <mesh position={[0, 1.15, -0.35]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color="#e8e0d0" emissive={def.glow} emissiveIntensity={0.7} />
        </mesh>
      )}
      {form >= 7 && (
        <mesh position={[0, 1.52, -0.42]}>
          <boxGeometry args={[0.4, 0.4, 0.32]} />
          <meshStandardMaterial color={def.body} metalness={0.5} roughness={0.4} />
        </mesh>
      )}
    </group>
  );
}

function PulseRing({ origin }: { origin: React.MutableRefObject<Sim> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const pulseAt = useAria((s) => s.pulseAt);
  const born = useRef(0);
  useEffect(() => {
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
    m.position.set(s.x, s.y + 0.4, s.z);
    const sc = 0.4 + age * 9;
    m.scale.set(sc, 1, sc);
    const mat = m.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.55 * (1 - age);
  });
  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
      <ringGeometry args={[0.85, 1.05, 48]} />
      <meshBasicMaterial color="#c9a227" transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Rig({ playing }: { playing: boolean }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const sim = useRef<Sim>(createSim());
  const acc = useRef(0);
  const form = useAria((s) => s.formIndex);
  const collected = useAria((s) => s.collected);
  const collectKey = useAria((s) => s.collectKey);
  const triggerPulse = useAria((s) => s.triggerPulse);
  const { camera } = useThree();
  const collectedRef = useRef(collected);
  collectedRef.current = collected;

  useEffect(() => {
    bindInput();
    window.__controlsTest = {
      getYaw: () => sim.current.yaw,
      getSpeed: () => Math.abs(sim.current.speed),
      setKeys,
      pulse: queuePulse,
      getPos: () => ({
        x: sim.current.x,
        y: sim.current.y,
        z: sim.current.z,
        yaw: sim.current.yaw,
        playing,
      }),
    };
    return () => {
      delete window.__controlsTest;
    };
  }, []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1);
    const s = sim.current;

    if (!playing) {
      const t = state.clock.elapsedTime * 0.12;
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
        addTrauma(s, 0.28);
        for (const shrine of SHRINES) {
          if (collectedRef.current.includes(shrine.id)) continue;
          const dx = s.x - shrine.x;
          const dz = s.z - shrine.z;
          if (dx * dx + dz * dz < 64) {
            collectKey(shrine.id);
            playChime();
            addTrauma(s, 0.2);
          }
        }
      }

      for (const shrine of SHRINES) {
        if (collectedRef.current.includes(shrine.id)) continue;
        const dx = s.x - shrine.x;
        const dz = s.z - shrine.z;
        if (dx * dx + dz * dz < 20) {
          collectKey(shrine.id);
          playChime();
          addTrauma(s, 0.22);
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
      inner.current.scale.set(1 / Math.max(0.7, sq), sq, 1 / Math.max(0.7, sq));
    }

    const { fx, fz } = heading(s.yaw);
    tmpOff.set(-fx * 9.5, 5.6, -fz * 9.5);
    tmpCam.set(s.x, s.y, s.z).add(tmpOff);
    const k = 1 - Math.exp(-4.2 * d);
    camera.position.lerp(tmpCam, k);
    const shake = s.trauma * s.trauma;
    if (shake > 0.002) {
      camera.position.x += (Math.random() - 0.5) * shake * 0.35;
      camera.position.y += (Math.random() - 0.5) * shake * 0.22;
    }
    tmpLook.set(s.x, s.y + 1.55, s.z);
    camera.lookAt(tmpLook);
  });

  return (
    <>
      <group ref={group}>
        <group ref={inner}>
          <VesselMesh form={form} />
        </group>
      </group>
      <PulseRing origin={sim} />
    </>
  );
}

function Motes() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 80;
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 4 + Math.random() * 16;
      p[i * 3] = Math.cos(a) * r;
      p[i * 3 + 1] = 2 + Math.random() * 8;
      p[i * 3 + 2] = Math.sin(a) * r;
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, []);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0xc9a227,
        size: 0.08,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    [],
  );
  const ref = useRef<THREE.Points>(null);
  useEffect(
    () => () => {
      geo.dispose();
      mat.dispose();
    },
    [geo, mat],
  );
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += 0.02 * Math.min(dt, 0.1);
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

export function AriaScene({ playing }: { playing: boolean }) {
  const collected = useAria((s) => s.collected);
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ fov: 58, near: 0.1, far: 140, position: [14, 11, 14] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#07060e");
      }}
      style={{ touchAction: "none" }}
    >
      <fog attach="fog" args={["#07060e", 26, 68]} />
      <ambientLight intensity={0.28} color="#9aa6c4" />
      <hemisphereLight args={["#24324c", "#1a2e28", 0.4]} />
      <directionalLight
        position={[16, 28, 10]}
        intensity={1.05}
        color="#e6d3a0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
      />
      <Stars radius={70} depth={36} count={1800} factor={3.2} saturation={0.15} fade speed={0.35} />
      <Terrain />
      {SHRINES.map((s) => (
        <KeyCrystal key={s.id} shrine={s} collected={collected.includes(s.id)} />
      ))}
      <Motes />
      <Rig playing={playing} />
    </Canvas>
  );
}
