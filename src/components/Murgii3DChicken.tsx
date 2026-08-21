import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import confetti from "canvas-confetti";

interface Murgii3DChickenProps {
  size?: "avatar" | "xs" | "sm" | "md" | "lg" | "hero" | "splash";
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
    avatar: { width: 40, height: 40 },
    xs: { width: 48, height: 48 },
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

    // PROCEDURAL STUDIO ENVIRONMENT MAP FOR REALISTIC SPECULAR REFLECTIONS
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement("canvas");
    envCanvas.width = 512;
    envCanvas.height = 256;
    const envCtx = envCanvas.getContext("2d");
    if (envCtx) {
      // Studio gradient with soft warm overhead light and cool rim accents
      const grad = envCtx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, "#1A1528");
      grad.addColorStop(0.3, "#0D0A18");
      grad.addColorStop(0.7, "#08060E");
      grad.addColorStop(1, "#030206");
      envCtx.fillStyle = grad;
      envCtx.fillRect(0, 0, 512, 256);

      // Warm overhead softbox reflection
      const topLight = envCtx.createRadialGradient(256, 40, 5, 256, 40, 140);
      topLight.addColorStop(0, "rgba(255, 235, 190, 0.9)");
      topLight.addColorStop(0.5, "rgba(200, 150, 255, 0.35)");
      topLight.addColorStop(1, "rgba(0, 0, 0, 0)");
      envCtx.fillStyle = topLight;
      envCtx.fillRect(0, 0, 512, 160);

      // Magenta-Violet edge backlight
      const rimLightL = envCtx.createRadialGradient(80, 180, 0, 80, 180, 100);
      rimLightL.addColorStop(0, "rgba(217, 70, 239, 0.6)");
      rimLightL.addColorStop(1, "rgba(0, 0, 0, 0)");
      envCtx.fillStyle = rimLightL;
      envCtx.fillRect(0, 80, 200, 180);

      const rimLightR = envCtx.createRadialGradient(430, 180, 0, 430, 180, 100);
      rimLightR.addColorStop(0, "rgba(139, 92, 246, 0.6)");
      rimLightR.addColorStop(1, "rgba(0, 0, 0, 0)");
      envCtx.fillStyle = rimLightR;
      envCtx.fillRect(330, 80, 200, 180);
    }

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
    scene.environment = envMap;

    // LUXURY REALISTIC MATERIALS (MeshPhysicalMaterial with clearcoat, sheen & fresnel)
    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#F3C142"),
      emissive: new THREE.Color("#6A4505"),
      emissiveIntensity: 0.15,
      metalness: 0.88,
      roughness: 0.18,
      clearcoat: 0.95,
      clearcoatRoughness: 0.12,
      reflectivity: 0.9,
      sheen: 0.4,
      sheenColor: new THREE.Color("#FFE8A3"),
      envMapIntensity: 1.4,
    });

    const darkGoldMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#18141F"),
      metalness: 0.9,
      roughness: 0.25,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      envMapIntensity: 1.2,
    });

    const crimsonCombMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FF1E56"),
      emissive: new THREE.Color("#A8082B"),
      emissiveIntensity: 0.35,
      metalness: 0.15,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transmission: 0.08,
      ior: 1.45,
      envMapIntensity: 1.2,
    });

    const beakMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FFA200"),
      emissive: new THREE.Color("#E06A00"),
      emissiveIntensity: 0.22,
      metalness: 0.55,
      roughness: 0.18,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.3,
    });

    const eyeGlowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#00F5FF"),
    });

    const glassesMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#08070E"),
      metalness: 0.95,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      transparent: true,
      opacity: 0.94,
      reflectivity: 1.0,
      envMapIntensity: 1.8,
    });

    // MASTER MURGII GROUP
    const murgiiGroup = new THREE.Group();
    scene.add(murgiiGroup);

    // 1. BODY (Egg-like aerodynamic cyber body with high subdivision)
    const bodyGeometry = new THREE.SphereGeometry(1.0, 64, 64);
    bodyGeometry.scale(0.92, 1.16, 0.96);
    const bodyMesh = new THREE.Mesh(bodyGeometry, goldMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bodyMesh.position.y = 0.8;
    murgiiGroup.add(bodyMesh);

    // 1.1 CHEST EMBLEM / CREST (Shield with smooth geometry)
    const crestGeo = new THREE.CylinderGeometry(0.38, 0.22, 0.1, 24);
    crestGeo.rotateX(Math.PI / 2);
    const crestMesh = new THREE.Mesh(crestGeo, crimsonCombMaterial);
    crestMesh.position.set(0, 0.95, 0.9);
    crestMesh.scale.set(0.7, 0.7, 0.7);
    crestMesh.castShadow = true;
    murgiiGroup.add(crestMesh);

    // 2. HEAD GROUP (For articulated nod and tilt)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.85, 0.25);
    murgiiGroup.add(headGroup);

    const headGeo = new THREE.SphereGeometry(0.68, 64, 64);
    headGeo.scale(0.95, 1.05, 1.0);
    const headMesh = new THREE.Mesh(headGeo, goldMaterial);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // 2.1 LUXURY CROWN / ROOSTER COMB (Crimson Cyber Crest)
    const combGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const spikeH = 0.38 + Math.sin((i / 3) * Math.PI) * 0.26;
      const spikeGeo = new THREE.ConeGeometry(0.16, spikeH, 24);
      spikeGeo.rotateX(-0.15);
      const spike = new THREE.Mesh(spikeGeo, crimsonCombMaterial);
      spike.position.set(0, 0.65 + spikeH / 2, 0.25 - i * 0.2);
      spike.castShadow = true;
      combGroup.add(spike);
    }
    headGroup.add(combGroup);

    // 2.2 BEAK (Upper and lower beak with smooth rounded cones)
    const beakTopGeo = new THREE.ConeGeometry(0.24, 0.58, 24);
    beakTopGeo.rotateX(Math.PI / 2);
    const beakTop = new THREE.Mesh(beakTopGeo, beakMaterial);
    beakTop.position.set(0, 0.05, 0.78);
    beakTop.scale.set(1.0, 0.72, 1.0);
    beakTop.castShadow = true;
    headGroup.add(beakTop);

    const beakBottomGeo = new THREE.ConeGeometry(0.18, 0.42, 24);
    beakBottomGeo.rotateX(Math.PI / 2);
    const beakBottom = new THREE.Mesh(beakBottomGeo, beakMaterial);
    beakBottom.position.set(0, -0.1, 0.72);
    beakBottom.scale.set(0.9, 0.6, 0.9);
    beakBottom.castShadow = true;
    headGroup.add(beakBottom);

    // 2.3 WATTLE (Under the beak with smooth spheres)
    const wattleGeo = new THREE.SphereGeometry(0.18, 32, 32);
    wattleGeo.scale(0.7, 1.4, 0.9);
    const wattleLeft = new THREE.Mesh(wattleGeo, crimsonCombMaterial);
    wattleLeft.position.set(-0.09, -0.32, 0.55);
    wattleLeft.castShadow = true;
    const wattleRight = new THREE.Mesh(wattleGeo, crimsonCombMaterial);
    wattleRight.position.set(0.09, -0.32, 0.55);
    wattleRight.castShadow = true;
    headGroup.add(wattleLeft);
    headGroup.add(wattleRight);

    // 2.4 CYBERNETIC LUXURY SUNGLASSES / SHADES
    const glassesGroup = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(1.08, 0.28, 0.15);
    const frameMesh = new THREE.Mesh(frameGeo, darkGoldMaterial);
    frameMesh.position.set(0, 0.16, 0.62);
    frameMesh.castShadow = true;
    glassesGroup.add(frameMesh);

    const lensGeo = new THREE.BoxGeometry(0.44, 0.24, 0.16);
    const lensL = new THREE.Mesh(lensGeo, glassesMaterial);
    lensL.position.set(-0.25, 0.16, 0.63);
    const lensR = new THREE.Mesh(lensGeo, glassesMaterial);
    lensR.position.set(0.25, 0.16, 0.63);
    glassesGroup.add(lensL);
    glassesGroup.add(lensR);

    // Cyan glowing HUD dots inside lenses
    const dotL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), eyeGlowMaterial);
    dotL.position.set(-0.25, 0.16, 0.72);
    const dotR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), eyeGlowMaterial);
    dotR.position.set(0.25, 0.16, 0.72);
    glassesGroup.add(dotL);
    glassesGroup.add(dotR);

    headGroup.add(glassesGroup);

    // 3. WINGS (Left and Right for Flapping Animation)
    const wingGeo = new THREE.ConeGeometry(0.6, 1.35, 32);
    wingGeo.scale(0.32, 1.0, 0.82);
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
      const featherGeo = new THREE.CylinderGeometry(0.06, 0.18, 1.25, 16);
      featherGeo.rotateX(-0.8);
      featherGeo.rotateY(i * 0.2);
      const feather = new THREE.Mesh(featherGeo, goldMaterial);
      feather.position.set(i * 0.14, 0.45 + Math.abs(i) * 0.05, -0.25);
      feather.castShadow = true;
      tailGroup.add(feather);
    }
    murgiiGroup.add(tailGroup);

    // 5. GOLDEN TALONS & LEGS
    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 24);
    const footGeo = new THREE.BoxGeometry(0.35, 0.08, 0.5);

    const legL = new THREE.Mesh(legGeo, darkGoldMaterial);
    legL.position.set(-0.35, 0.25, 0);
    legL.castShadow = true;
    const footL = new THREE.Mesh(footGeo, beakMaterial);
    footL.position.set(-0.35, -0.05, 0.1);
    footL.castShadow = true;
    murgiiGroup.add(legL);
    murgiiGroup.add(footL);

    const legR = new THREE.Mesh(legGeo, darkGoldMaterial);
    legR.position.set(0.35, 0.25, 0);
    legR.castShadow = true;
    const footR = new THREE.Mesh(footGeo, beakMaterial);
    footR.position.set(0.35, -0.05, 0.1);
    footR.castShadow = true;
    murgiiGroup.add(legR);
    murgiiGroup.add(footR);

    // 6. FLOATING HOLOGRAPHIC GOLDEN EGG
    const eggGroup = new THREE.Group();
    const eggGeo = new THREE.SphereGeometry(0.32, 48, 48);
    eggGeo.scale(0.85, 1.25, 0.85);
    const eggMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FFEBB5"),
      emissive: new THREE.Color("#D946EF"),
      emissiveIntensity: 0.45,
      metalness: 0.92,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0,
      envMapIntensity: 1.6,
    });
    const eggMesh = new THREE.Mesh(eggGeo, eggMaterial);
    eggMesh.castShadow = true;
    eggGroup.add(eggMesh);

    // Holographic ring orbiting the egg
    const eggRingGeo = new THREE.TorusGeometry(0.48, 0.02, 16, 64);
    const eggRingMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#D946EF"),
      wireframe: true,
      transparent: true,
      opacity: 0.8,
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
      const diskGeo = new THREE.CylinderGeometry(1.85, 2.05, 0.18, 64);
      const diskMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#0A0814"),
        metalness: 0.92,
        roughness: 0.22,
        clearcoat: 0.8,
        envMapIntensity: 1.2,
      });
      const diskMesh = new THREE.Mesh(diskGeo, diskMat);
      diskMesh.position.y = -0.15;
      diskMesh.receiveShadow = true;
      pedestalGroup.add(diskMesh);

      // Outer Glowing Violet Ring
      const ringGeo = new THREE.TorusGeometry(1.92, 0.03, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#8B5CF6") });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = -0.06;
      pedestalGroup.add(ringMesh);

      // Inner Rune Dashed Ring with Magenta Glow
      const innerRingGeo = new THREE.TorusGeometry(1.42, 0.018, 8, 48);
      const innerRingMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#D946EF"),
        wireframe: true,
        transparent: true,
        opacity: 0.65,
      });
      const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
      innerRingMesh.rotation.x = Math.PI / 2;
      innerRingMesh.position.y = -0.05;
      pedestalGroup.add(innerRingMesh);

      scene.add(pedestalGroup);
    }

    // 8. STUDIO LIGHTING RIG (Balanced Key, Fill, Rim & Ambient)
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.8);
    scene.add(ambientLight);

    // Warm Studio Key Light
    const keyLight = new THREE.DirectionalLight(0xfffae6, 3.4);
    keyLight.position.set(4.5, 6.5, 5.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Cool Soft Fill Light
    const fillLight = new THREE.DirectionalLight(0xc8d6ff, 1.6);
    fillLight.position.set(-4, 3, 4);
    scene.add(fillLight);

    // Cyber Rim Light (Deep Magenta & Violet Silhouette)
    const rimLight = new THREE.DirectionalLight(0xd946ef, 3.8);
    rimLight.position.set(-5, 4.5, -4.5);
    scene.add(rimLight);

    const rimLight2 = new THREE.DirectionalLight(0x8b5cf6, 2.8);
    rimLight2.position.set(5, 3.5, -4.0);
    scene.add(rimLight2);

    // Bottom Base Uplight
    const bottomGlow = new THREE.PointLight(0x8b5cf6, 2.5, 7);
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
    </div>
  );
}
