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

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.debug.checkShaderErrors = false;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    container.appendChild(renderer.domElement);

    // MASTER REVENUE SYSTEM GROUP
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. 24K GOLD ICOSAHEDRON / REVENUE VAULT CORE
    const coreGeo = new THREE.IcosahedronGeometry(1.25, 1);
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FFB52E"),
      emissive: new THREE.Color("#825200"),
      emissiveIntensity: 0.35,
      metalness: 0.95,
      roughness: 0.18,
      wireframe: false,
    });

    const coreMesh = new THREE.Mesh(coreGeo, goldMaterial);
    masterGroup.add(coreMesh);

    // 2. INNER GLOWING CYBER WIREFRAME
    const wireGeo = new THREE.IcosahedronGeometry(1.28, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FFE28A"),
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    masterGroup.add(wireMesh);

    // 3. ORBITING CONVERSION TELEMETRY RINGS
    const ringGroup = new THREE.Group();
    masterGroup.add(ringGroup);

    // Equator Ring
    const ring1Geo = new THREE.TorusGeometry(1.85, 0.02, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FFB52E"),
      transparent: true,
      opacity: 0.8,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    // Polar Ring
    const ring2Geo = new THREE.TorusGeometry(2.1, 0.015, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#00F0FF"),
      transparent: true,
      opacity: 0.6,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    ringGroup.add(ring2);

    // 4. FLOATING GOLDEN STARDUST / PARTICLES
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.9 + Math.random() * 1.5;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      scales[i] = Math.random();
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color("#FFD700"),
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particlePoints);

    // 5. CINEMATIC LUXURY LIGHTING
    const keyLight = new THREE.DirectionalLight(0xfffaed, 3.5);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00e5ff, 2.0);
    rimLight.position.set(-4, -3, -3);
    scene.add(rimLight);

    const centerGlow = new THREE.PointLight(0xffb52e, 2.5, 8);
    centerGlow.position.set(0, 0, 0);
    scene.add(centerGlow);

    // MOUSE PARALLAX & SCROLL SCRUBBING
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // ANIMATION LOOP
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Scroll scrubbing effect
      const scrollRotation = scrollY * 0.0025;

      // Smooth floating physics
      masterGroup.position.y = Math.sin(t * 1.5) * 0.12;
      masterGroup.rotation.y = t * 0.4 + mouseX * 0.6 + scrollRotation;
      masterGroup.rotation.x = Math.sin(t * 0.8) * 0.15 - mouseY * 0.4;

      // Reverse orbiting rings
      ring1.rotation.z = t * 0.8;
      ring2.rotation.z = -t * 0.6;
      particlePoints.rotation.y = -t * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER
    const ro = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background Volumetric Gold Radiance */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FFB52E]/20 via-amber-500/10 to-transparent rounded-full blur-[60px] pointer-events-none animate-pulse" />
      
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full min-h-[300px]" />
    </div>
  );
}
