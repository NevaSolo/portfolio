"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, createPortal, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { toggleTheme, useTheme } from "@/lib/theme";

/**
 * "Pixar Lampe" by TiSzma — https://sketchfab.com/3d-models/pixar-lampe-da09cec0fbc043f7a08c0d0165a643ee
 * Licensed CC-BY-4.0: the credit must stay visible on the site (see Footer).
 * Simplified + meshopt-compressed with gltf-transform (15.4 MB → 0.35 MB).
 */
export const LAMP_URL = "/models/lamp.glb";

/** Tallest side of the lamp in scene units. */
const TARGET_SIZE = 3.6;

/**
 * Where the bulb would be, in the model's own (file) coordinates: inside the
 * shade, near its opening. The model has no bulb mesh, so a light stands in.
 */
const BULB_POSITION = new THREE.Vector3(0, 1.3, 1.6);

const WARM = "#ffd9a0";

const PALETTE = {
  dark: { body: "#2b2b32", detail: "#1c1c21" },
  light: { body: "#e4e0d6", detail: "#bdb8ac" },
};

function Model({ lit }: { lit: boolean }) {
  const { scene } = useGLTF(LAMP_URL);
  const bulbRef = useRef<THREE.PointLight>(null);

  const scale = useMemo(() => {
    const size = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3());
    return TARGET_SIZE / Math.max(size.x, size.y, size.z);
  }, [scene]);

  // Untextured model: recolor per theme.
  useEffect(() => {
    const colors = lit ? PALETTE.light : PALETTE.dark;
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.color.set(mat.name === "material" ? colors.body : colors.detail);
      mat.metalness = lit ? 0.1 : 0.6;
      mat.roughness = lit ? 0.55 : 0.4;
    });
  }, [scene, lit]);

  // Mount the bulb light in the model's own space, so BULB_POSITION
  // follows the file's coordinates whatever transforms sit above it.
  const anchor = useMemo(() => {
    let node: THREE.Object3D | null = null;
    scene.traverse((obj) => {
      if (!node && (obj as THREE.Mesh).isMesh) node = obj;
    });
    return node as THREE.Object3D | null;
  }, [scene]);

  // Fade the bulb in/out instead of snapping.
  useFrame((_, delta) => {
    const bulb = bulbRef.current;
    if (!bulb) return;
    const k = 1 - Math.exp(-delta * 6);
    bulb.intensity += ((lit ? 12 : 0) - bulb.intensity) * k;
  });

  const bulb = (
    <pointLight
      ref={bulbRef}
      position={BULB_POSITION}
      color={WARM}
      intensity={0}
      distance={6}
      decay={2}
    />
  );

  return (
    <>
      <primitive object={scene} scale={scale} />
      {anchor && createPortal(bulb, anchor)}
    </>
  );
}

/** Head faces right, three-quarter so the inside of the shade shows. */
const BASE_YAW = -Math.PI / 2 - 0.6;
/** Distance from the canvas' left edge to the lamp's center, in scene units. */
const LEFT_INSET = 1.9;

function Rig({
  children,
  hovered,
  kick,
}: {
  children: React.ReactNode;
  hovered: boolean;
  kick: number;
}) {
  const group = useRef<THREE.Group>(null);
  const bounce = useRef(0);
  const lastKick = useRef(kick);
  // Anchor the lamp to the canvas' left edge (the canvas is wide so the
  // head never gets clipped on the right).
  const { viewport } = useThree();
  const baseX = -viewport.width / 2 + LEFT_INSET;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (kick !== lastKick.current) {
      lastKick.current = kick;
      bounce.current = 1;
    }
    bounce.current = Math.max(0, bounce.current - delta * 2.2);

    // Click: quick squash-and-stretch hop.
    const b = Math.sin(bounce.current * Math.PI) * bounce.current;
    const hover = hovered ? 1.03 : 1;
    g.scale.set(hover * (1 + b * 0.05), hover * (1 - b * 0.08), hover * (1 + b * 0.05));
    g.position.set(baseX, b * 0.25, 0);

    // Gentle look toward the pointer.
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, BASE_YAW + state.pointer.x * 0.12, 0.04);
  });

  return (
    <group ref={group} position={[baseX, 0, 0]} rotation={[0, BASE_YAW, 0]}>
      {children}
    </group>
  );
}

export default function Lamp() {
  const theme = useTheme();
  const lit = theme === "light";
  const [hovered, setHovered] = useState(false);
  const [kick, setKick] = useState(0);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setKick((k) => k + 1);
    toggleTheme({ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY });
  };

  return (
    <Canvas
      camera={{ position: [0, 0.5, 9], fov: 35 }}
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={lit ? 1 : 0.35} />
      <directionalLight position={[3, 5, 6]} intensity={lit ? 2 : 0.8} />
      {/* Rim lights: outline the dark lamp against the dark background. */}
      <pointLight position={[-4, 3, -3]} intensity={lit ? 0 : 50} color="#8b5cf6" />
      <pointLight position={[4, 2, -4]} intensity={lit ? 0 : 30} color="#22d3ee" />

      <Suspense fallback={null}>
        <Rig hovered={hovered} kick={kick}>
          <Center>
            <group
              onClick={onClick}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
              }}
              onPointerOut={() => setHovered(false)}
            >
              <Model lit={lit} />
            </group>
          </Center>
        </Rig>
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(LAMP_URL);
