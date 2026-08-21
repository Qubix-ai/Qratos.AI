import { useEffect, useRef } from "react";
import * as THREE from "three";

interface FloatingRevenueObject3DProps {
  className?: string;
}

export function FloatingRevenueObject3D({ className = "" }: FloatingRevenueObject3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isVisible = true;
    let animationFrameId: number;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.debug.checkShaderErrors = false;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.appendChild(renderer.domElement);

    // MASTER REVENUE SYSTEM GROUP
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. 24K GOLD ICOSAHEDRON / REVENUE VAULT CORE
    const coreGeo = new THREE.IcosahedronGeometry(1.25, 0); // Low poly smooth for high fps
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FFB52E"),
      emissive: new THREE.Color("#6B4200"),
      emissiveIntensity: 0.35,
      metalness: 0.9,
      roughness: 0.22,
    });

    const coreMesh = new THREE.Mesh(coreGeo, goldMaterial);
    masterGroup.add(coreMesh);

    // 2. INNER GLOWING CYBER WIREFRAME
    const wireGeo = new THREE.IcosahedronGeometry(1.28, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FFE28A"),
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    masterGroup.add(wireMesh);

    // 3. ORBITING CONVERSION TELEMETRY RINGS
    const ringGroup = new THREE.Group();
    masterGroup.add(ringGroup);

    // Equator Ring
    const ring1Geo = new THREE.TorusGeometry(1.85, 0.02, 8, 36);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FFB52E"),
      transparent: true,
      opacity: 0.8,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    // Polar Ring
    const ring2Geo = new THREE.TorusGeometry(2.1, 0.015, 8, 36);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#A855F7"),
      transparent: true,
      opacity: 0.7,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    ringGroup.add(ring2);

    // 4. FLOATING PARTICLES
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.8 + Math.random() * 1.2;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color("#FFD700"),
      size: 0.05,
      transparent: true,
      opacity: 0.7,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particlePoints);

    // LIGHTS
    const keyLight = new THREE.DirectionalLight(0xfffaed, 3.0);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    rimLight.position.set(-4, -3, -3);
    scene.add(rimLight);

    // IntersectionObserver to pause loop when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animationFrameId) {
            animate();
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let time = 0;
    const animate = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      time += 0.01;

      // Smooth idle rotation
      coreMesh.rotation.y = time * 0.4;
      coreMesh.rotation.x = Math.sin(time * 0.3) * 0.2;
      wireMesh.rotation.y = time * 0.4;
      wireMesh.rotation.x = Math.sin(time * 0.3) * 0.2;

      ringGroup.rotation.y = -time * 0.3;
      ring1.rotation.z = time * 0.2;
      ring2.rotation.z = -time * 0.25;

      particlePoints.rotation.y = time * 0.15;

      // Subtle levitation
      masterGroup.position.y = Math.sin(time * 1.2) * 0.1;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      goldMaterial.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-[320px] sm:h-[400px] flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ transform: "translateZ(0)" }}
    />
  );
}
