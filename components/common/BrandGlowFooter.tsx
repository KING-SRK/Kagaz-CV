// components/BrandGlowFooter.tsx
"use client";

import { useEffect, useRef } from "react";

interface BrandGlowFooterProps {
  brandName?: string;
}

export default function BrandGlowFooter({
  brandName = "SutraNet",
}: BrandGlowFooterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const strokeGradRef = useRef<SVGRadialGradientElement>(null);
  const fillGradRef = useRef<SVGRadialGradientElement>(null);
  const glowGroupRef = useRef<SVGGElement>(null);

  const targetRef = useRef({ x: 500, y: 110 });
  const currentRef = useRef({ x: 500, y: 110 });
  const opacityRef = useRef(0);
  const activeRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      const targetOpacity = activeRef.current ? 1 : 0;
      opacityRef.current += (targetOpacity - opacityRef.current) * 0.08;

      currentRef.current.x +=
        (targetRef.current.x - currentRef.current.x) * 0.1;
      currentRef.current.y +=
        (targetRef.current.y - currentRef.current.y) * 0.1;

      const cx = currentRef.current.x.toFixed(1);
      const cy = currentRef.current.y.toFixed(1);

      if (strokeGradRef.current) {
        strokeGradRef.current.setAttribute("cx", cx);
        strokeGradRef.current.setAttribute("cy", cy);
      }
      if (fillGradRef.current) {
        fillGradRef.current.setAttribute("cx", cx);
        fillGradRef.current.setAttribute("cy", cy);
      }
      if (glowGroupRef.current) {
        glowGroupRef.current.style.opacity = opacityRef.current.toFixed(3);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const updatePointer = (e: React.MouseEvent<HTMLDivElement>, snap = false) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * 1000;
    const svgY = ((e.clientY - rect.top) / rect.height) * 210;

    targetRef.current = { x: svgX, y: svgY };
    if (snap) {
      currentRef.current = { x: svgX, y: svgY };
    }
    activeRef.current = true;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => updatePointer(e, !activeRef.current)}
      onMouseEnter={(e) => updatePointer(e, true)}
      onMouseLeave={() => {
        activeRef.current = false;
      }}
      className="relative w-full overflow-hidden bg-black pt-10 pb-5 sm:pt-14 sm:pb-7 px-3 sm:px-6 lg:px-8 select-none"
    >
      {/* ওপরের সাদা থেকে কালোতে নরম ট্রানজিশন */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-white to-transparent"
      />

      <div className="relative mx-auto w-full">
        <svg
          viewBox="0 0 1000 210"
          className="w-full h-auto block overflow-visible"
          aria-label={brandName}
        >
          <defs>
            <radialGradient
              ref={strokeGradRef}
              id="sutranet-stroke-glow"
              gradientUnits="userSpaceOnUse"
              cx="500"
              cy="105"
              r="260"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#d4d4d4" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#737373" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            <radialGradient
              ref={fillGradRef}
              id="sutranet-fill-glow"
              gradientUnits="userSpaceOnUse"
              cx="500"
              cy="105"
              r="240"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          <text
            x="50%"
            y="82%"
            textAnchor="middle"
            className="font-sans font-extrabold tracking-[-0.04em]"
            style={{ fontSize: "195px" }}
            fill="#141414"
            stroke="#1f1f1f"
            strokeWidth="1"
          >
            {brandName}
          </text>

          <g ref={glowGroupRef} style={{ opacity: 0 }}>
            <text
              x="50%"
              y="82%"
              textAnchor="middle"
              className="font-sans font-extrabold tracking-[-0.04em]"
              style={{ fontSize: "195px" }}
              fill="url(#sutranet-fill-glow)"
              stroke="url(#sutranet-stroke-glow)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            >
              {brandName}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
