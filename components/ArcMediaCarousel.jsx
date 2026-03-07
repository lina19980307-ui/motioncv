import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

function buildArcMedia(items, count = 6) {
  if (!Array.isArray(items) || items.length === 0) return [];
  if (items.length === 1) {
    return [{ ...items[0], _arcId: "arc-0", _sourceIndex: 0 }];
  }
  return Array.from({ length: count }, (_, index) => {
    const sourceIndex = index % items.length;
    const source = items[sourceIndex];
    return {
      ...source,
      _arcId: `arc-${sourceIndex}-${index}`,
      _sourceIndex: sourceIndex,
    };
  });
}

export default function ArcMediaCarousel({ items = [], count = 6, className = "", onActiveIndexChange, variant = "default" }) {
  const [arcAnim, setArcAnim] = useState({ step: 0, phase: 0 });
  const [viewportWidth, setViewportWidth] = useState(1440);
  const arcMedia = useMemo(() => buildArcMedia(items, count), [items, count]);
  const layoutConfig = useMemo(() => {
    if (variant === "wide") {
      return {
        stepX: Math.min(Math.max(viewportWidth * 0.19, 196), 360),
        baseY: -72,
        curveDepth: 18,
        rotateStep: 8.5,
        cardSize: Math.min(Math.max(viewportWidth * 0.12, 154), 236),
        top: "48%",
      };
    }
    return {
      stepX: 242,
      baseY: -136,
      curveDepth: 30,
      rotateStep: 11,
      cardSize: 172,
      top: "40%",
    };
  }, [variant, viewportWidth]);

  const arcLayout = useMemo(() => {
    if (!arcMedia.length) return [];
    const total = arcMedia.length;
    const shift = total === 1 ? 0 : arcAnim.step + arcAnim.phase;
    return arcMedia.map((item, index) => {
      let relative = index - shift;
      while (relative < -3.1) relative += total;
      while (relative > 3.1) relative -= total;
      const absRelative = Math.abs(relative);
      const x = relative * layoutConfig.stepX;
      const y = layoutConfig.baseY + Math.pow(absRelative, 2) * layoutConfig.curveDepth;
      const scale = Math.max(0.74, 1.08 - absRelative * 0.19);
      const rotate = relative * layoutConfig.rotateStep;
      const opacity =
        absRelative > 2.25
          ? Math.max(0, 0.6 - (absRelative - 2.25) * 1.35)
          : Math.max(0.6, 1 - absRelative * 0.18);
      const zIndex = Math.round(120 - absRelative * 36);
      return {
        ...item,
        _layout: { x, y, scale, rotate, opacity, zIndex },
      };
    });
  }, [arcAnim.phase, arcAnim.step, arcMedia, layoutConfig.baseY, layoutConfig.curveDepth, layoutConfig.rotateStep, layoutConfig.stepX]);

  useEffect(() => {
    if (typeof window === "undefined" || variant !== "wide") return undefined;

    let frameId = window.requestAnimationFrame(() => {
      setViewportWidth(window.innerWidth);
    });

    const onResize = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        setViewportWidth(window.innerWidth);
      });
    };

    window.addEventListener("resize", onResize);
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
    };
  }, [variant]);

  useEffect(() => {
    if (!arcMedia.length) return undefined;
    if (arcMedia.length === 1) return undefined;

    let rafId = 0;
    let lastPaint = 0;
    const moveMs = 2200;
    const holdMs = 1000;
    const cycleMs = moveMs + holdMs;
    const start = performance.now();

    const update = (now) => {
      if (now - lastPaint >= 40) {
        const elapsedMs = now - start;
        const cycleIndex = Math.floor(elapsedMs / cycleMs);
        const cycleElapsed = elapsedMs % cycleMs;
        if (cycleElapsed < moveMs) {
          setArcAnim({
            step: cycleIndex % arcMedia.length,
            phase: cycleElapsed / moveMs,
          });
        } else {
          setArcAnim({
            step: cycleIndex % arcMedia.length,
            phase: 1,
          });
        }
        lastPaint = now;
      }
      rafId = window.requestAnimationFrame(update);
    };

    rafId = window.requestAnimationFrame(update);
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [arcMedia]);

  useEffect(() => {
    if (!items.length || typeof onActiveIndexChange !== "function") return;
    const nextIndex = ((Math.round(arcAnim.step + arcAnim.phase) % items.length) + items.length) % items.length;
    onActiveIndexChange(nextIndex);
  }, [arcAnim.phase, arcAnim.step, items.length, onActiveIndexChange]);

  if (!arcLayout.length) return null;

  return (
    <div
      className={`arc-carousel relative w-full ${className}`}
      style={{
        "--arc-card-size": `${layoutConfig.cardSize}px`,
        "--arc-card-top": layoutConfig.top,
      }}
    >
      <div className="hero-arc-stage relative h-full w-full">
        {arcLayout.map((item) => (
          <div
            key={item._arcId}
            className="hero-arc-card"
            style={{
              transform: `translate3d(${item._layout.x}px, ${item._layout.y}px, 0) scale(${item._layout.scale}) rotate(${item._layout.rotate}deg)`,
              opacity: item._layout.opacity,
              zIndex: item._layout.zIndex,
            }}
          >
            <div className="hero-arc-flip">
              <div className="hero-arc-face hero-arc-face--front">
                {item.type === "image" ? (
                  <Image
                    src={item.url}
                    alt={item.name || "arc media"}
                    fill
                    sizes="172px"
                    unoptimized
                    className="hero-arc-media-inner"
                  />
                ) : (
                  <video autoPlay loop muted playsInline className="hero-arc-media-inner">
                    <source src={item.url} />
                  </video>
                )}
              </div>
              <div className="hero-arc-face hero-arc-face--back">
                {item.type === "image" ? (
                  <Image
                    src={item.url}
                    alt={item.name || "arc media"}
                    fill
                    sizes="172px"
                    unoptimized
                    className="hero-arc-media-inner"
                  />
                ) : (
                  <video autoPlay loop muted playsInline className="hero-arc-media-inner">
                    <source src={item.url} />
                  </video>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
