"use client";

import { MeshDistortMaterial, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function useCompactScene() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px), (pointer: coarse)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return compact;
}

function NeuralParticles({ compact }) {
  const points = useRef(null);
  const positions = useMemo(() => {
    const count = compact ? 150 : 260;
    const data = new Float32Array(count * 3);
    for (let i = 0; i < data.length; i += 3) {
      const radius = 5 + Math.random() * (compact ? 3.6 : 5.4);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      data[i] = radius * Math.sin(phi) * Math.cos(theta);
      data[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      data[i + 2] = radius * Math.cos(phi);
    }
    return data;
  }, [compact]);

  useFrame(({ clock, pointer }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.elapsedTime * 0.018 + pointer.x * 0.08;
    points.current.rotation.x = Math.sin(clock.elapsedTime * 0.14) * 0.025 + pointer.y * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.021}
        color="#d8c28b"
        transparent
        opacity={0.68}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function MovingStarField({ compact }) {
  const near = useRef(null);
  const far = useRef(null);
  const nearPositions = useMemo(() => makeStarPositions(compact ? 120 : 220, compact), [compact]);
  const farPositions = useMemo(() => makeStarPositions(compact ? 180 : 320, compact), [compact]);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;
    if (near.current) {
      near.current.rotation.y = t * 0.018 + pointer.x * 0.025;
      near.current.rotation.x = pointer.y * 0.018;
      near.current.position.z = Math.sin(t * 0.22) * 0.18;
    }
    if (far.current) {
      far.current.rotation.y = -t * 0.008;
      far.current.rotation.z = t * 0.004;
    }
  });

  return (
    <>
      <points ref={far}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={farPositions.length / 3}
            array={farPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.016} color="#d7e3f4" transparent opacity={0.42} depthWrite={false} />
      </points>
      <points ref={near}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nearPositions.length / 3}
            array={nearPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.024}
          color="#f1dfb4"
          transparent
          opacity={0.66}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

function makeStarPositions(count, compact) {
  const data = new Float32Array(count * 3);
  for (let i = 0; i < data.length; i += 3) {
    const radius = 7 + Math.random() * (compact ? 6 : 9);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    data[i] = radius * Math.sin(phi) * Math.cos(theta);
    data[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    data[i + 2] = radius * Math.cos(phi) - 2.5;
  }
  return data;
}

function Core() {
  const group = useRef(null);
  const innerRing = useRef(null);
  const outerRing = useRef(null);
  const { pointer } = useThree();

  useFrame(({ clock }) => {
    if (!group.current || !innerRing.current || !outerRing.current) return;
    const t = clock.elapsedTime;
    group.current.rotation.y = t * 0.05 + pointer.x * 0.14;
    group.current.rotation.x = -0.2 + Math.sin(t * 0.18) * 0.035 + pointer.y * 0.08;
    innerRing.current.rotation.z = t * 0.055;
    outerRing.current.rotation.z = -t * 0.035;
  });

  return (
    <group ref={group} position={[1.55, -0.05, -0.8]}>
      <mesh>
        <sphereGeometry args={[1.42, 64, 64]} />
        <MeshDistortMaterial
          color="#0c1019"
          emissive="#25334c"
          emissiveIntensity={0.3}
          metalness={0.92}
          roughness={0.28}
          distort={0.08}
          speed={0.55}
        />
      </mesh>
      <mesh position={[0.42, 0.34, 0.72]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial
          color="#d4b676"
          emissive="#d4b676"
          emissiveIntensity={0.55}
          metalness={0.4}
          roughness={0.28}
        />
      </mesh>
      <mesh ref={innerRing} rotation={[Math.PI / 2.45, 0.35, 0]}>
        <torusGeometry args={[1.96, 0.01, 12, 220]} />
        <meshBasicMaterial color="#f0d89b" transparent opacity={0.6} />
      </mesh>
      <mesh ref={outerRing} rotation={[Math.PI / 2.7, -0.1, 0]}>
        <torusGeometry args={[2.34, 0.006, 10, 240]} />
        <meshBasicMaterial color="#9fb0d0" transparent opacity={0.38} />
      </mesh>
      <mesh rotation={[0.2, -0.4, 0.6]}>
        <torusGeometry args={[2.9, 0.0035, 8, 260]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  const compact = useCompactScene();

  return (
    <Canvas
      camera={{ position: [0, 0, compact ? 7.1 : 6.2], fov: compact ? 50 : 45 }}
      dpr={compact ? [1, 1.25] : [1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#05070d"]} />
      <fog attach="fog" args={["#05070d", 7, 16]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 5]} intensity={1.55} color="#f5e1ad" />
      <pointLight position={[-3.5, 1.5, 3]} intensity={1.85} color="#9fb0d0" />
      <pointLight position={[2.5, -2.4, 2.2]} intensity={1.45} color="#d8c28b" />
      <Stars radius={42} depth={24} count={compact ? 180 : 340} factor={2.3} fade speed={0.35} />
      <MovingStarField compact={compact} />
      <NeuralParticles compact={compact} />
      <Core />
    </Canvas>
  );
}
