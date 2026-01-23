'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    // Fog to fade particles in the distance
    // Using a very dark color matching slate-950 (#020617)
    scene.fog = new THREE.FogExp2(0x020617, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance
    mount.appendChild(renderer.domElement);

    // 2. Create Particles
    const geometry = new THREE.BufferGeometry();
    const count = 2000; // Adjusted count for balance
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // Colors matching the "Cosmic" theme: Indigo and Pink/Magenta
    const color1 = new THREE.Color(0x6366f1); // Indigo-500
    const color2 = new THREE.Color(0xec4899); // Pink-500

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;     // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // z

      // Mix colors
      const mixedColor = Math.random() > 0.5 ? color1 : color2;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Animation Loop
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let animationFrameId: number;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
    };

    // Only add listener if not mobile (simple check)
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      document.addEventListener('mousemove', onDocumentMouseMove);
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;

      // Rotate entire system slowly
      particles.rotation.y += 0.0005;
      
      // Mouse interaction (Parallax)
      particles.rotation.x += 0.05 * (targetY - particles.rotation.x);
      particles.rotation.y += 0.05 * (targetX - particles.rotation.y);

      renderer.render(scene, camera);
    };

    animate();

    // 4. Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      cancelAnimationFrame(animationFrameId);
      
      // Dispose Three.js resources
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-0 pointer-events-none bg-slate-950" 
      style={{
        background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)'
      }}
      aria-hidden="true"
    />
  );
}
