import Image from "next/image";
import { LayoutGroup, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";

const SPRING = { type: "spring", stiffness: 320, damping: 28, mass: 0.8 };

function getBasePose(index, total) {
  const center = (total - 1) / 2;
  const distance = index - center;
  return {
    x: distance * 118,
    y: Math.abs(distance) * 12,
    rotate: distance * 5.2,
    scale: 1 - Math.min(Math.abs(distance) * 0.03, 0.1),
    zIndex: 100 - index,
  };
}

function getHoverPose(index, activeIndex, total, pointerDir, collisionEnergy) {
  const base = getBasePose(index, total);
  if (activeIndex === null) return base;
  if (index === activeIndex) {
    return {
      ...base,
      y: base.y - 26,
      scale: base.scale + 0.05,
      rotate: base.rotate * 0.45,
      zIndex: 300,
    };
  }

  const isAbove = index < activeIndex;
  const direction = isAbove ? -pointerDir || -1 : pointerDir || 1;
  const distance = Math.abs(index - activeIndex);
  const push = Math.max(10, 26 - distance * 6) + collisionEnergy * 0.45;
  const sideBias = isAbove ? -1 : 1;

  return {
    ...base,
    x: base.x + direction * push + sideBias * 4,
    y: base.y + 7 + distance * 4,
    rotate: base.rotate + direction * (2.8 + distance * 0.8),
    scale: Math.max(0.85, base.scale - 0.02),
    zIndex: 100 - index,
  };
}

export default function CardStack({ cards = [], maxVisible = 4 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [sweepIndex, setSweepIndex] = useState(null);
  const [pointerDir, setPointerDir] = useState(1);
  const [collisionEnergy, setCollisionEnergy] = useState(0);
  const lastPointerXRef = useRef(null);
  const visibleCards = useMemo(() => cards.slice(0, maxVisible), [cards, maxVisible]);
  const activeIndex = hoveredIndex ?? sweepIndex;

  if (!visibleCards.length) return null;

  return (
    <div
      className="w-full"
      onClick={(event) => event.stopPropagation()}
      onMouseLeave={() => {
        setSweepIndex(null);
        setCollisionEnergy(0);
        lastPointerXRef.current = null;
      }}
    >
      <LayoutGroup id="custom-card-stack">
        <div
          className="relative mx-auto h-[300px] w-full max-w-[1320px] md:h-[360px]"
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const ratio = Math.max(0, Math.min(1, x / rect.width));
            const nextIndex = Math.round(ratio * (visibleCards.length - 1));
            setSweepIndex(nextIndex);

            if (lastPointerXRef.current !== null) {
              const deltaX = x - lastPointerXRef.current;
              if (Math.abs(deltaX) > 0.6) {
                setPointerDir(deltaX >= 0 ? 1 : -1);
                setCollisionEnergy(Math.min(18, Math.abs(deltaX)));
              }
            }
            lastPointerXRef.current = x;
          }}
        >
          {visibleCards.map((card, index) => {
            const pose = getHoverPose(index, activeIndex, visibleCards.length, pointerDir, collisionEnergy);
            const distanceDelay = activeIndex === null ? 0 : Math.min(0.16, Math.abs(index - activeIndex) * 0.028);
            return (
              <motion.article
                key={card.id || `${card.image}-${index}`}
                layout
                initial={false}
                transition={{
                  ...SPRING,
                  delay: distanceDelay + index * 0.008,
                }}
                animate={{
                  x: pose.x,
                  y: pose.y,
                  rotate: pose.rotate,
                  scale: pose.scale,
                }}
                style={{ zIndex: pose.zIndex }}
                className="absolute left-1/2 top-1/2 h-[210px] w-[280px] -translate-x-1/2 -translate-y-1/2 will-change-transform md:h-[270px] md:w-[360px]"
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <motion.div
                  layout
                  transition={SPRING}
                  whileHover={{
                    boxShadow: "0 16px 34px rgba(110, 124, 158, 0.16)",
                  }}
                  className="card-stack-card relative h-full w-full overflow-hidden rounded-2xl"
                >
                  <Image
                    src={card.image}
                    alt={card.title || "custom media"}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 280px, 360px"
                  />
                </motion.div>
              </motion.article>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
