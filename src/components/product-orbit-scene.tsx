"use client";

import { Suspense, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

function Field({ dragging }: { dragging: RefObject<boolean> }) {
  const group = useRef<THREE.Group>(null);
  const dust = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const phi = Math.acos(-1 + (2 * index) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 4.4 + Math.sin(index * 12.9898) * 0.55;
      positions[index * 3] = radius * Math.cos(theta) * Math.sin(phi);
      positions[index * 3 + 1] = radius * Math.cos(phi);
      positions[index * 3 + 2] = radius * Math.sin(theta) * Math.sin(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (dragging.current || !group.current) return;
    group.current.rotation.y += delta * 0.18;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#f4f4f0" size={0.03} sizeAttenuation />
      </points>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.35, 0.012, 12, 80]} />
        <meshBasicMaterial color="#f4f4f0" transparent opacity={0.45} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.4, 0]}>
        <torusGeometry args={[3.15, 0.006, 8, 80]} />
        <meshBasicMaterial color="#f4f4f0" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function Mark({ texture }: { texture: THREE.Texture }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const object = group.current;
    if (!object) return;
    const t = clock.elapsedTime;
    object.rotation.y = Math.sin(t * 0.55) * 0.7;
    object.rotation.x = Math.sin(t * 0.32) * 0.08;
    object.position.y = Math.sin(t * 0.85) * 0.16;
  });

  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[3.15, 0.53]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3.15, 0.53]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const amount = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return amount * amount * (3 - 2 * amount);
}

function ScrollDrive({
  progress,
  dragging,
  children,
}: {
  progress: RefObject<number>;
  dragging: RefObject<boolean>;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const object = group.current;
    if (!object) return;
    const amount = progress.current ?? 0;
    const arrive = smoothstep(0.02, 0.45, amount);
    const leave = smoothstep(0.78, 1, amount);
    object.scale.setScalar(0.38 + arrive * (1 - leave * 0.28) * 0.62);
    if (dragging.current) return;
    object.rotation.x = (0.5 - amount) * 0.75;
    object.rotation.y = amount * Math.PI * 1.8;
  });

  return <group ref={group}>{children}</group>;
}

function Scene({ progress }: { progress: RefObject<number> }) {
  const dragging = useRef(false);
  const texture = useTexture("/brand/logo-white.png");

  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.85}
        onStart={() => {
          dragging.current = true;
        }}
        onEnd={() => {
          dragging.current = false;
        }}
      />
      <ScrollDrive progress={progress} dragging={dragging}>
        <Field dragging={dragging} />
        <Mark texture={texture} />
      </ScrollDrive>
    </>
  );
}

export default function ProductOrbitScene({ progress }: { progress: RefObject<number> }) {
  return (
    <Canvas camera={{ position: [0, 0.15, 8.4], fov: 42 }} dpr={[1, 1.5]} style={{ cursor: "grab" }}>
      <Suspense fallback={null}>
        <Scene progress={progress} />
      </Suspense>
    </Canvas>
  );
}
