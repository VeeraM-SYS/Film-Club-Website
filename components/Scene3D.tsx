import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

const FilmItem: React.FC<{ index: number }> = ({ index }) => {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Unique rotation for each item based on its index
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2 + index) * 0.1;
            meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.1 + index) * 0.1;
            meshRef.current.position.y = (Math.sin(index) * 2) + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.2;
        }
    });

    return (
        <group 
            ref={meshRef} 
            position={[index * 2.5 - 5, Math.sin(index) * 2, -5 + index]} 
            rotation={[0.2, 0.1, 0]}
        >
            <mesh>
                <planeGeometry args={[1.5, 2]} />
                <meshStandardMaterial 
                    color="#1a1a1a" 
                    emissive="#000000"
                    metalness={0.8}
                    roughness={0.2}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.8}
                />
            </mesh>
            {/* Perforations */}
            <mesh position={[-0.6, 0, 0.01]}>
                <planeGeometry args={[0.1, 1.8]} />
                <meshBasicMaterial color="#333" />
            </mesh>
            <mesh position={[0.6, 0, 0.01]}>
                <planeGeometry args={[0.1, 1.8]} />
                <meshBasicMaterial color="#333" />
            </mesh>
        </group>
    );
};

const Scene3D: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#050505']} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={5} color="#d4af37" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#8a1c1c" />
        
        {/* Dust Particles */}
        <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.5} color="#ffffff" />
        
        {/* Background Stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Floating Film Elements */}
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <group rotation={[0, 0, Math.PI / 4]}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <FilmItem key={i} index={i} />
                ))}
            </group>
        </Float>
        
        {/* Fog for depth */}
        <fog attach="fog" args={['#050505', 5, 20]} />
      </Canvas>
    </div>
  );
};

export default Scene3D;