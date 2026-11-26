"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Deterministic pseudo-random generator so particle layout is a pure
// function of `count` (avoids calling Math.random during render).
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createShellPositions(count: number) {
  const rand = mulberry32(count * 9973 + 17);
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 2.15 + rand() * 0.35;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = radius * Math.cos(phi);
  }
  return arr;
}

function ParticleShell({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const target = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => createShellPositions(count), [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    target.current.x = state.pointer.y * 0.25;
    target.current.y = state.pointer.x * 0.35;
    points.current.rotation.y += delta * 0.06;
    points.current.rotation.x = THREE.MathUtils.lerp(
      points.current.rotation.x,
      target.current.x,
      0.03
    );
    points.current.rotation.y = THREE.MathUtils.lerp(
      points.current.rotation.y,
      points.current.rotation.y + target.current.y * 0.02,
      0.03
    );
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#8b5cf6"
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

function WireCore() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.12;
    mesh.current.rotation.x += delta * 0.05;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.35, 1]} />
      <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

function Core() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y -= delta * 0.08;
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[0.85, 4]} />
      <meshStandardMaterial
        color="#0b0b0d"
        emissive="#8b5cf6"
        emissiveIntensity={0.55}
        roughness={0.25}
        metalness={0.6}
        wireframe
      />
    </mesh>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  useFrame((state) => {
    if (!group.current) return;
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      state.pointer.x * (viewport.width > 8 ? 0.15 : 0.05),
      0.04
    );
  });
  return <group ref={group}>{children}</group>;
}

export default function AICore({ particleCount = 2400 }: { particleCount?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 5]} intensity={40} color="#8b5cf6" />
      <pointLight position={[-4, -3, -5]} intensity={25} color="#22d3ee" />
      <Rig>
        <Core />
        <WireCore />
        <ParticleShell count={particleCount} />
      </Rig>
    </Canvas>
  );
}
