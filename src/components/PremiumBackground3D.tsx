import { useEffect, useRef, useState } from "react";

interface Node3D {
  x: number;
  y: number;
  z: number;
  speedX: number;
  speedY: number;
  speedZ: number;
}

export function PremiumBackground3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let gridNodes: Node3D[] = [];
    const nodeCount = 36; // Highly optimized for 60fps on mobile & desktop
    const fov = 400;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const initCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // Cap DPR at 1.5 for performance
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    initCanvasSize();

    // Create 3D nodes
    gridNodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 100 + Math.random() * 250;

      gridNodes.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta) * 0.7,
        z: Math.random() * 400 - 200,
        speedX: (Math.random() - 0.5) * 0.08,
        speedY: (Math.random() - 0.5) * 0.06,
        speedZ: (Math.random() - 0.5) * 0.08,
      });
    }

    // Parallax tracking
    const onMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - cx) * 0.04;
      mouseRef.current.targetY = (e.clientY - cy) * 0.04;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Resize handler
    let resizeTimer: any;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initCanvasSize();
      }, 200);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // IntersectionObserver to pause rendering when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animationFrameId) {
            renderLoop();
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const rotSpeedX = 0.00012;
    const rotSpeedY = 0.00018;

    const renderLoop = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      const centerX = width / 2;
      const centerY = height / 2;

      const cosX = Math.cos(rotSpeedX);
      const sinX = Math.sin(rotSpeedX);
      const cosY = Math.cos(rotSpeedY);
      const sinY = Math.sin(rotSpeedY);

      for (let i = 0; i < gridNodes.length; i++) {
        const node = gridNodes[i];
        node.x += node.speedX;
        node.y += node.speedY;
        node.z += node.speedZ;

        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.x * sinY + node.z * cosY;

        const y2 = node.y * cosX - z1 * sinX;
        const z2 = node.y * sinX + z1 * cosX;

        node.x = x1;
        node.y = y2;
        node.z = z2;

        const dist = Math.hypot(node.x, node.y, node.z);
        if (dist > 350) {
          node.x *= 0.98;
          node.y *= 0.98;
          node.z *= 0.98;
        }
      }

      ctx.lineWidth = 0.75;

      for (let i = 0; i < gridNodes.length; i++) {
        const n1 = gridNodes[i];
        const scale1 = fov / (fov + n1.z);
        const scrX1 = centerX + n1.x * scale1 + mouseRef.current.x * (scale1 * 0.5);
        const scrY1 = centerY + n1.y * scale1 + mouseRef.current.y * (scale1 * 0.5);

        for (let j = i + 1; j < gridNodes.length; j++) {
          const n2 = gridNodes[j];
          const dist3D = Math.hypot(n1.x - n2.x, n1.y - n2.y, n1.z - n2.z);

          if (dist3D < 140) {
            const scale2 = fov / (fov + n2.z);
            const scrX2 = centerX + n2.x * scale2 + mouseRef.current.x * (scale2 * 0.5);
            const scrY2 = centerY + n2.y * scale2 + mouseRef.current.y * (scale2 * 0.5);

            const alpha = (1 - dist3D / 140) * 0.18;
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(scrX1, scrY1);
            ctx.lineTo(scrX2, scrY2);
            ctx.stroke();
          }
        }

        // Draw small glowing node
        const nodeAlpha = Math.max(0.1, Math.min(0.6, (1 + n1.z / 300) * 0.35));
        ctx.fillStyle = `rgba(217, 70, 239, ${nodeAlpha})`;
        ctx.beginPath();
        ctx.arc(scrX1, scrY1, 1.8 * scale1, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ transform: "translateZ(0)" }}
    >
      <canvas ref={canvasRef} className="w-full h-full block opacity-75" />
    </div>
  );
}
