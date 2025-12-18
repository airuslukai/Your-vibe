import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, MeshDistortMaterial, SpotLight, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Memory } from '../types';

const CameraController = () => {
  const { camera, mouse } = useThree();
  useFrame(() => {
    // Smoother interpolation
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (mouse.y * 2 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });
  return null;
};

const FallingItems = ({ count = 30, type = 'petal' }: { count?: number; type?: 'petal' | 'heart' | 'flower' }) => {
  const groupRef = useRef<THREE.Group>(null!);

  const heartShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0, -0.2, -0.4, -0.2, -0.4, 0);
    s.bezierCurveTo(-0.4, 0.2, 0, 0.4, 0, 0.6);
    s.bezierCurveTo(0, 0.4, 0.4, 0.2, 0.4, 0);
    s.bezierCurveTo(0.4, -0.2, 0, -0.2, 0, 0);
    return s;
  }, []);

  const flowerShape = useMemo(() => {
    const s = new THREE.Shape();
    const points = 5;
    for (let i = 0; i < points * 2; i++) {
      const angle = (i / (points * 2)) * Math.PI * 2;
      const radius = i % 2 === 0 ? 0.3 : 0.15;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    return s;
  }, []);

  const items = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [THREE.MathUtils.randFloatSpread(70), THREE.MathUtils.randFloat(10, 60), THREE.MathUtils.randFloatSpread(60)],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      speed: 0.02 + Math.random() * 0.04, // Slightly slower for relaxed feel
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      baseScale: 0.25 + Math.random() * 0.6,
      opacity: 0.3 + Math.random() * 0.5,
      horizontalOscillation: Math.random() * 0.05,
      phase: Math.random() * Math.PI * 2
    }));
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Optimization: Use a simple for loop instead of forEach for marginally better perf in hot paths
    const children = groupRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const data = items[i];

      child.position.y -= data.speed;
      child.position.x += Math.sin(t + data.phase) * data.horizontalOscillation;
      child.rotation.x += data.rotationSpeed;
      child.rotation.y += data.rotationSpeed;

      // Removed blooming calculation from hot path or simplified it
      // Only checking bounds
      if (child.position.y < -35) {
        child.position.y = 45;
        child.position.x = THREE.MathUtils.randFloatSpread(70);
      }
    }
  });

  const getColor = () => {
    if (type === 'heart') return "#ff0066";
    if (type === 'flower') return "#ffb7d5";
    return "#ff4d6d";
  };

  const getGeometry = () => {
    if (type === 'heart') return <shapeGeometry args={[heartShape]} />;
    if (type === 'flower') return <shapeGeometry args={[flowerShape]} />;
    return <planeGeometry args={[0.7, 0.7]} />; // Simple plane is faster than shape
  };

  return (
    <group ref={groupRef}>
      {items.map((p, i) => (
        <mesh key={i} position={p.position as any} rotation={p.rotation as any}>
          {getGeometry()}
          <meshStandardMaterial
            color={getColor()}
            side={THREE.DoubleSide}
            transparent
            opacity={p.opacity}
            depthWrite={false}
            emissive={getColor()}
            emissiveIntensity={1.2}
          />
        </mesh>
      ))}
    </group>
  );
};

const CrystalHeart = ({ isPlaying }: { isPlaying: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
    s.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1.2);
    s.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
    s.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);
    return s;
  }, []);

  const extrudeSettings = {
    depth: 1,
    bevelEnabled: true,
    bevelSegments: 12, // Reduced from 32
    steps: 1, // Reduced from 2
    bevelSize: 0.5,
    bevelThickness: 0.5
  };

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = Math.sin(t / 1.5) * 0.6;

    // Simplified pulse calculation
    const pulseSpeed = isPlaying ? 8 : 4;
    const pulseIntensity = isPlaying ? 0.35 : 0.2;
    const scale = 1.8 + Math.sin(t * pulseSpeed) * pulseIntensity;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={1.2}>
      <mesh ref={meshRef} rotation={[Math.PI, 0, 0]} position={[0, -1, 0]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <MeshDistortMaterial
          color="#ff0044"
          speed={isPlaying ? 7 : 3}
          distort={0.6}
          radius={1}
          emissive="#880022"
          emissiveIntensity={isPlaying ? 15 : 5}
          roughness={0}
          metalness={1}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
};

interface VisualizerProps {
  isPlaying: boolean;
  memories: Memory[];
}

const Visualizer: React.FC<VisualizerProps> = ({ isPlaying }) => {
  const isMobile = window.innerWidth < 768;

  return (
    <div className="fixed inset-0 -z-20 bg-transparent pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 45 }}
        dpr={[1, isMobile ? 1.5 : 2]} // Lower DPR on mobile for performance
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }} // preserveDrawingBuffer false is faster
      >
        <fog attach="fog" args={['#0a0104', 20, 70]} />
        <ambientLight intensity={2} />

        {/* Significantly reduced star count for performance */}
        <Stars radius={150} depth={100} count={isMobile ? 3000 : 7000} factor={10} saturation={1} fade speed={3} />

        <Sparkles
          count={isMobile ? 300 : 700}
          scale={50}
          size={isMobile ? 8 : 6}
          speed={1}
          color="#ff4d6d"
          opacity={1}
        />

        <CrystalHeart isPlaying={isPlaying} />

        <FallingItems count={isMobile ? 30 : 50} type="petal" />
        <FallingItems count={isMobile ? 20 : 30} type="heart" />
        <FallingItems count={isMobile ? 15 : 30} type="flower" />

        <SpotLight
          position={[20, 30, 20]}
          angle={0.6}
          penumbra={1}
          intensity={15}
          color="#ff4d6d"
        />

        <SpotLight
          position={[-20, -30, 20]}
          angle={0.6}
          penumbra={1}
          intensity={12}
          color="#d4af37"
        />

        <CameraController />
      </Canvas>
    </div>
  );
};

export default Visualizer;