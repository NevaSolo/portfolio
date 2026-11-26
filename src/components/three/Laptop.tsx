"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, ContactShadows, Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { createCodeScreen, fitScreenUVs } from "./codeScreen";

/**
 * "Laptop" by GeniusPilot2016 — https://sketchfab.com/3d-models/laptop-676e365f61f544e9a0236b7519e1bc90
 * Licensed CC-BY-4.0: the credit must stay visible on the site (see Footer).
 */
export const LAPTOP_URL = "/models/laptop.glb";

const ACCENT = "#8b5cf6";

/** Largest side of the laptop in scene units, whatever the file's own scale. */
const TARGET_SIZE = 3.4;

function Model({ still }: { still: boolean }) {
  const { scene } = useGLTF(LAPTOP_URL);
  const screen = useMemo(() => createCodeScreen(still), [still]);

  useEffect(() => () => screen.dispose(), [screen]);
  useFrame((state) => screen.update(state.clock.elapsedTime));

  // The Sketchfab export carries a ~0.11 scale: normalise it.
  const scale = useMemo(() => {
    const size = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3());
    return TARGET_SIZE / Math.max(size.x, size.y, size.z);
  }, [scene]);

  // The model ships untextured and near-black (invisible on our dark bg):
  // lift the shell to a dark metal and put the code editor on the screen.
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat.name === "display" || mesh.userData.isScreen) {
        if (!mesh.userData.isScreen) fitScreenUVs(mesh.geometry);
        mesh.userData.isScreen = true;
        // Unlit + no tone mapping: the screen renders at full white brightness.
        mesh.material = new THREE.MeshBasicMaterial({ map: screen.texture, toneMapped: false });
        // White light spilling from the panel onto the keyboard.
        if (!mesh.getObjectByName("screen-glow")) {
          const box = mesh.geometry.boundingBox ?? new THREE.Box3().setFromBufferAttribute(
            mesh.geometry.getAttribute("position") as THREE.BufferAttribute
          );
          const glow = new THREE.PointLight("#ffffff", 6, 6, 2);
          glow.name = "screen-glow";
          box.getCenter(glow.position);
          mesh.add(glow);
        }
        return;
      }
      switch (mat.name) {
        case "case":
        case "bezel":
          mat.color.set("#2a2a31");
          mat.metalness = 0.7;
          mat.roughness = 0.35;
          break;
        case "keyboard":
          mat.color.set("#141418");
          break;
      }
    });
  }, [scene, screen]);

  return <primitive object={scene} scale={scale} />;
}

// The file's screen faces -Z: turn it around, three-quarter view.
const BASE_YAW = Math.PI + 0.5;
const BASE_PITCH = 0.2;

/** Tilts the laptop toward the pointer. */
function Rig({ children, still }: { children: React.ReactNode; still: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g || still) return;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, BASE_YAW + state.pointer.x * 0.35, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, BASE_PITCH - state.pointer.y * 0.12, 0.05);
  });

  return (
    <group ref={group} rotation={[BASE_PITCH, BASE_YAW, 0]}>
      {children}
    </group>
  );
}

export default function Laptop({ still = false }: { still?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 9], fov: 35 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 6, 6]} intensity={2.5} />
      {/* Rim lights from behind: outline the silhouette against the dark bg. */}
      <pointLight position={[-5, 3, -4]} intensity={60} color={ACCENT} />
      <pointLight position={[5, 1, -4]} intensity={45} color="#22d3ee" />
      <pointLight position={[0, 2, 5]} intensity={15} color="#ffffff" />

      <Suspense fallback={null}>
        <Rig still={still}>
          <Float
            speed={still ? 0 : 1.6}
            rotationIntensity={still ? 0 : 0.2}
            floatIntensity={still ? 0 : 0.6}
          >
            <Center>
              <Model still={still} />
            </Center>
          </Float>
        </Rig>
        <ContactShadows position={[0, -1.9, 0]} opacity={0.45} scale={10} blur={2.6} far={4} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(LAPTOP_URL);
