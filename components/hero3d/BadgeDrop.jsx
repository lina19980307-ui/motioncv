import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function BadgeDrop({ badge }) {
  const [open, setOpen] = useState(false);
  const dropTransition = badge.animation?.dropSpring || {
    stiffness: 148,
    damping: 16,
    mass: 0.72,
  };

  const sway = useMemo(
    () => ({
      rotate: badge.animation?.swayRotate || [2, 1.2, 2, 1.5, 2],
      transition: {
        duration: badge.animation?.swayDuration || 5.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: badge.animation?.swayDelay || 1.1,
      },
    }),
    [badge.animation]
  );

  return (
    <>
      <button
        type="button"
        className="hero-drop-btn"
        style={{ top: badge.button?.top, right: badge.button?.right }}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {badge.buttonLabel}
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            className="hero-badge"
            style={{ top: badge.drop?.top, right: badge.drop?.right, width: badge.drop?.width }}
            initial={{ y: -220, rotate: badge.drop?.initialRotate || -8, opacity: 0 }}
            animate={{ y: 0, rotate: badge.drop?.finalRotate || 2, opacity: 1 }}
            exit={{ y: -140, rotate: -4, opacity: 0, transition: { duration: badge.animation?.exitDuration || 0.25 } }}
            transition={dropTransition}
          >
            <div className="hero-badge-strap" />
            <motion.div className="hero-badge-card" animate={sway}>
              <Image src={badge.baseImage} alt="" fill className="hero-badge-base" sizes="(max-width: 768px) 80vw, 280px" />
              <div className="hero-badge-overlay" />
              <div className="hero-badge-brand">{badge.brand}</div>
              <div className="hero-badge-main">
                <Image src={badge.avatarImage} alt={badge.name} className="hero-badge-avatar" width={44} height={44} />
                <div className="hero-badge-meta">
                  <p className="hero-badge-name">{badge.name}</p>
                  <p className="hero-badge-title">{badge.title}</p>
                </div>
              </div>
              <Image src={badge.qrImage} alt={`${badge.brand} qr`} className="hero-badge-qr" width={220} height={220} />
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
