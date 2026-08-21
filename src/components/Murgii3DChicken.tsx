import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import confetti from "canvas-confetti";

interface Murgii3DChickenProps {
  size?: "sm" | "md" | "lg" | "hero" | "splash";
  interactive?: boolean;
  showPedestal?: boolean;
  showHologram?: boolean;
  className?: string;
  onCluck?: () => void;
}

export function Murgii3DChicken({
  size = "md",
  interactive = true,
  showPedestal = true,
  showHologram = true,
  className = "",
  onCluck,
}: Murgii3DChickenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cluckCount, setCluckCount] = useState(0);

  // Compute container dimensions based on size preset
  const dimensions = {
    sm: { width: 120, height: 120 },
    md: { width: 220, height: 220 },
    lg: { width: 340, height: 340 },
    hero: { width: 480, height: 460 },
    splash: { width: 320, height: 320 },
  }[size];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.8, 5.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.debug.checkShaderErrors = false;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.appendChild(renderer.domElement);

    // LUXURY LUXE MATERIALS
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#F6C444"),
      emissive: new THREE.Color("#7A5005"),
      emissiveIntensity: 0.25,
      metalness: 0.92,
      roughness: 0.22,
    });

    const darkGoldMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1B160C"),
      metalness: 0.85,
      roughness: 0.3,
    });

    const crimsonCombMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FF2A55"),
      emissive: new THREE.Color("#D81138"),
      emissiveIntensity: 0.55,
      metalness: 0.3,
      roughness: 0.2,
    });

    const beakMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FFA000"),
      emissive: new THREE.Color("#FF8000"),
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.25,
    });

    const eyeGlowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#00F0FF"),
    });

    const glassesMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0A0A0A"),
      metalness: 0.95,
      roughness: 0.1,
      transparent: true,
      opacity: 0.92,
    });

    // MASTER MURGII GROUP
    const murgiiGroup = new THREE.Group();
    scene.add(murgiiGroup);

    // 1. BODY (Egg-like aerodynamic cyber body)
    const bodyGeometry = new THREE.SphereGeometry(1.0, 32, 32);
    bodyGeometry.scale(0.9, 1.15, 0.95);
    const bodyMesh = new THREE.Mesh(bodyGeometry, goldMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bodyMesh.position.y = 0.8;
    murgiiGroup.add(bodyMesh);

    // 1.1 CHEST EMBLEM / CREST (Golden Shield)
    const crestGeo = new THREE.CylinderGeometry(0.4, 0.2, 0.1, 6);
    crestGeo.rotateX(Math.PI / 2);
    const crestMesh = new THREE.Mesh(crestGeo, crimsonCombMaterial);
    crestMesh.position.set(0, 0.95, 0.9);
    crestMesh.scale.set(0.7, 0.7, 0.7);
    murgiiGroup.add(crestMesh);

    // 2. HEAD GROUP (For articulated nod and tilt)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.85, 0.25);
    murgiiGroup.add(headGroup);

    const headGeo = new THREE.SphereGeometry(0.68, 32, 32);
    headGeo.scale(0.95, 1.05, 1.0);
    const headMesh = new THREE.Mesh(headGeo, goldMaterial);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // 2.1 LUXURY CROWN / ROOSTER COMB (Crimson Cyber Crest)
    const combGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const spikeH = 0.35 + Math.sin((i / 3) * Math.PI) * 0.25;
      const spikeGeo = new THREE.ConeGeometry(0.16, spikeH, 16);
      spikeGeo.rotateX(-0.15);
      const spike = new THREE.Mesh(spikeGeo, crimsonCombMaterial);
      spike.position.set(0, 0.65 + spikeH / 2, 0.25 - i * 0.2);
      combGroup.add(spike);
    }
    headGroup.add(combGroup);

    // 2.2 BEAK (Upper and lower beak)
    const beakTopGeo = new THREE.ConeGeometry(0.24, 0.55, 4);
    beakTopGeo.rotateX(Math.PI / 2);
    const beakTop = new THREE.Mesh(beakTopGeo, beakMaterial);
    beakTop.position.set(0, 0.05, 0.78);
    beakTop.scale.set(1.0, 0.7, 1.0);
    headGroup.add(beakTop);

    const beakBottomGeo = new THREE.ConeGeometry(0.18, 0.4, 4);
    beakBottomGeo.rotateX(Math.PI / 2);
    const beakBottom = new THREE.Mesh(beakBottomGeo, beakMaterial);
    beakBottom.position.set(0, -0.1, 0.72);
    beakBottom.scale.set(0.9, 0.6, 0.9);
    headGroup.add(beakBottom);

    // 2.3 WATTLE (Under the beak)
    const wattleGeo = new THREE.SphereGeometry(0.18, 16, 16);
    wattleGeo.scale(0.7, 1.4, 0.9);
    const wattleLeft = new THREE.Mesh(wattleGeo, crimsonCombMaterial);
    wattleLeft.position.set(-0.09, -0.32, 0.55);
    const wattleRight = new THREE.Mesh(wattleGeo, crimsonCombMaterial);
    wattleRight.position.set(0.09, -0.32, 0.55);
    headGroup.add(wattleLeft);
    headGroup.add(wattleRight);

    // 2.4 CYBERNETIC LUXURY SUNGLASSES / SHADES
    const glassesGroup = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(1.05, 0.28, 0.15);
    const frameMesh = new THREE.Mesh(frameGeo, darkGoldMaterial);
    frameMesh.position.set(0, 0.16, 0.62);
    glassesGroup.add(frameMesh);

    const lensGeo = new THREE.BoxGeometry(0.42, 0.24, 0.16);
    const lensL = new THREE.Mesh(lensGeo, glassesMaterial);
    lensL.position.set(-0.25, 0.16, 0.63);
    const lensR = new THREE.Mesh(lensGeo, glassesMaterial);
    lensR.position.set(0.25, 0.16, 0.63);
    glassesGroup.add(lensL);
    glassesGroup.add(lensR);

    // Cyan glowing HUD dots inside lenses
    const dotL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeGlowMaterial);
    dotL.position.set(-0.25, 0.16, 0.72);
    const dotR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeGlowMaterial);
    dotR.position.set(0.25, 0.16, 0.72);
    glassesGroup.add(dotL);
    glassesGroup.add(dotR);

    headGroup.add(glassesGroup);

    // 3. WINGS (Left and Right for Flapping Animation)
    const wingGeo = new THREE.ConeGeometry(0.6, 1.3, 16);
    wingGeo.scale(0.3, 1.0, 0.8);
    wingGeo.rotateZ(Math.PI / 2);

    const wingLeftGroup = new THREE.Group();
    wingLeftGroup.position.set(-0.85, 0.9, 0);
    const wingLeftMesh = new THREE.Mesh(wingGeo, goldMaterial);
    wingLeftMesh.position.set(-0.35, -0.2, 0);
    wingLeftMesh.castShadow = true;
    wingLeftGroup.add(wingLeftMesh);
    murgiiGroup.add(wingLeftGroup);

    const wingRightGroup = new THREE.Group();
    wingRightGroup.position.set(0.85, 0.9, 0);
    const wingRightMesh = new THREE.Mesh(wingGeo, goldMaterial);
    wingRightMesh.position.set(0.35, -0.2, 0);
    wingRightMesh.castShadow = true;
    wingRightGroup.add(wingRightMesh);
    murgiiGroup.add(wingRightGroup);

    // 4. TAIL FEATHERS (Cascading golden feathers)
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.75, -0.85);
    for (let i = -2; i <= 2; i++) {
      const featherGeo = new THREE.CylinderGeometry(0.06, 0.18, 1.2, 8);
      featherGeo.rotateX(-0.8);
      featherGeo.rotateY(i * 0.2);
      const feather = new THREE.Mesh(featherGeo, goldMaterial);
      feather.position.set(i * 0.14, 0.45 + Math.abs(i) * 0.05, -0.25);
      tailGroup.add(feather);
    }
    murgiiGroup.add(tailGroup);

    // 5. GOLDEN TALONS & LEGS
    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16);
    const footGeo = new THREE.BoxGeometry(0.35, 0.08, 0.5);

    const legL = new THREE.Mesh(legGeo, darkGoldMaterial);
    legL.position.set(-0.35, 0.25, 0);
    const footL = new THREE.Mesh(footGeo, beakMaterial);
    footL.position.set(-0.35, -0.05, 0.1);
    murgiiGroup.add(legL);
    murgiiGroup.add(footL);

    const legR = new THREE.Mesh(legGeo, darkGoldMaterial);
    legR.position.set(0.35, 0.25, 0);
    const footR = new THREE.Mesh(footGeo, beakMaterial);
    footR.position.set(0.35, -0.05, 0.1);
    murgiiGroup.add(legR);
    murgiiGroup.add(footR);

    // 6. FLOATING HOLOGRAPHIC GOLDEN EGG
    const eggGroup = new THREE.Group();
    const eggGeo = new THREE.SphereGeometry(0.32, 24, 24);
    eggGeo.scale(0.85, 1.25, 0.85);
    const eggMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FFE28A"),
      emissive: new THREE.Color("#FFB52E"),
      emissiveIntensity: 0.6,
      metalness: 0.95,
      roughness: 0.15,
    });
    const eggMesh = new THREE.Mesh(eggGeo, eggMaterial);
    eggGroup.add(eggMesh);

    // Holographic ring orbiting the egg
    const eggRingGeo = new THREE.TorusGeometry(0.48, 0.02, 16, 48);
    const eggRingMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FFD700"),
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const eggRing = new THREE.Mesh(eggRingGeo, eggRingMat);
    eggRing.rotation.x = Math.PI / 3;
    eggGroup.add(eggRing);

    if (showHologram) {
      scene.add(eggGroup);
    }

    // 7. CYBER PEDESTAL WITH TELEMETRY RINGS
    const pedestalGroup = new THREE.Group();
    if (showPedestal) {
      const diskGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.18, 48);
      const diskMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#08070F"),
        metalness: 0.9,
        roughness: 0.35,
      });
      const diskMesh = new THREE.Mesh(diskGeo, diskMat);
      diskMesh.position.y = -0.15;
      diskMesh.receiveShadow = true;
      pedestalGroup.add(diskMesh);

      // Outer Glowing Gold Ring
      const ringGeo = new THREE.TorusGeometry(1.9, 0.03, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#FFB52E") });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = -0.06;
      pedestalGroup.add(ringMesh);

      // Inner Rune Dashed Ring
      const innerRingGeo = new THREE.TorusGeometry(1.4, 0.015, 8, 32);
      const innerRingMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#FFE28A"),
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      });
      const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
      innerRingMesh.rotation.x = Math.PI / 2;
      innerRingMesh.position.y = -0.05;
      pedestalGroup.add(innerRingMesh);

      scene.add(pedestalGroup);
    }

    // 8. LUXURY LIGHTING RIG
    const ambientLight = new THREE.AmbientLight(0xfff0dd, 0.9);
    scene.add(ambientLight);

    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xffdf88, 3.2);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Cyber Rim Light (Deep Cyan / Electric Amber)
    const rimLight = new THREE.DirectionalLight(0x44d7ff, 2.5);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0xffb52e, 2.0, 6);
    bottomGlow.position.set(0, 0.1, 0);
    scene.add(bottomGlow);

    // MOUSE PARALLAX & INTERACTIVITY
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x;
      mouse.targetY = y;
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // ANIMATION LOOP
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // 1. Idle Bobbing & Hovering
      const hoverFloat = Math.sin(elapsedTime * 2.4) * 0.08;
      murgiiGroup.position.y = hoverFloat;

      // 2. Body Organic Sway
      murgiiGroup.rotation.y = mouse.x * 0.45 + Math.sin(elapsedTime * 1.2) * 0.05;
      murgiiGroup.rotation.x = -mouse.y * 0.25;

      // 3. Head Articulated Bob (Chicken Pecking/Nodding Motion)
      const headBob = Math.sin(elapsedTime * 4.8) * 0.08;
      headGroup.position.z = 0.25 + Math.max(0, Math.sin(elapsedTime * 2.4) * 0.06);
      headGroup.rotation.x = headBob + mouse.y * 0.3;
      headGroup.rotation.y = mouse.x * 0.4;

      // 4. Wing Flapping (Idle gentle flutter + rapid flutter on hover)
      const wingSpeed = isHovered ? 16 : 3.5;
      const wingAngle = Math.sin(elapsedTime * wingSpeed) * (isHovered ? 0.45 : 0.15);
      wingLeftGroup.rotation.z = -wingAngle;
      wingRightGroup.rotation.z = wingAngle;

      // 5. Beak subtle speaking micro-nod
      beakBottom.position.y = -0.1 - Math.abs(Math.sin(elapsedTime * 3.0)) * 0.03;

      // 6. Golden Egg Orbit & Spin
      if (showHologram) {
        const orbitRadius = 1.6;
        const orbitSpeed = 1.4;
        eggGroup.position.x = Math.cos(elapsedTime * orbitSpeed) * orbitRadius;
        eggGroup.position.z = Math.sin(elapsedTime * orbitSpeed) * orbitRadius;
        eggGroup.position.y = 1.6 + Math.sin(elapsedTime * 3.2) * 0.2;
        eggGroup.rotation.y += 0.03;
        eggRing.rotation.z += 0.02;
      }

      // 7. Pedestal Rotation
      if (showPedestal) {
        pedestalGroup.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isHovered, showPedestal, showHologram, interactive]);

  const handleCluckClick = () => {
    setCluckCount((prev) => prev + 1);
    // Launch golden confetti celebration!
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#FFB52E", "#FFD700", "#FFE28A", "#FF2A55", "#FFFFFF"],
    });

    if (onCluck) onCluck();
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCluckClick}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      {/* Background Volumetric Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FFB52E]/15 via-transparent to-purple-600/10 rounded-full blur-[45px] pointer-events-none" />

      {/* WebGL 3D Canvas Mount */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-pointer relative z-10 transition-transform duration-300 active:scale-95"
      />

      {/* Interactive Micro Badge */}
      {interactive && size !== "sm" && (
        <div className="absolute -bottom-2 z-20 px-3 py-0.5 rounded-full bg-black/60 border border-[#FFB52E]/30 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.2em] text-[#FFB52E] flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,181,46,0.2)]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF2A55] animate-ping" />
          <span>MURGII 3D // CLICK TO CLUCK</span>
        </div>
      )}
    </div>
  );
}
