import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const PRESET_EFFECTS = {
  popHello: {
    noteCount: 11,
    driftX: 148,
    driftY: -128,
    scatter: 34,
    duration: 1.12,
  },
  swayTease: {
    noteCount: 13,
    driftX: 164,
    driftY: -144,
    scatter: 42,
    duration: 1.2,
  },
  miniFlourish: {
    noteCount: 15,
    driftX: 182,
    driftY: -156,
    scatter: 48,
    duration: 1.28,
  },
};

const NOTE_GLYPHS = ["♪", "♫", "♩", "♬", "♪", "♫"];

function buildNotes(count, driftX, driftY, scatter, preset) {
  if (!count) return [];
  return Array.from({ length: count }, (_, index) => {
    const progress = count === 1 ? 1 : index / (count - 1);
    const wobble = Math.sin(progress * Math.PI * 2.4 + index * 0.55) * scatter;
    const flutter = Math.cos(progress * Math.PI * 1.8 + index * 0.38) * (scatter * 0.34);
    const presetNudge = preset === "swayTease" ? (index % 2 === 0 ? -16 : 16) : preset === "miniFlourish" ? 10 : 0;
    return {
      id: `${preset}-${index}`,
      x: driftX * (0.16 + progress * 0.92) + wobble * 0.42 + presetNudge,
      y: driftY * (0.12 + progress * 0.94) + flutter - (index % 3) * 6,
      size: 18 + (index % 3) * 6,
      rotate: -18 + progress * 42 + (index % 2 === 0 ? -8 : 10),
      delay: index * 0.036,
      glyph: NOTE_GLYPHS[index % NOTE_GLYPHS.length],
    };
  });
}

export default function ModelInteractionBurst({
  interactionToken,
  preset = "popHello",
  themeVariant = "light",
  anchorY = "70%",
}) {
  const prefersReducedMotion = useReducedMotion();
  const effect = PRESET_EFFECTS[preset] || PRESET_EFFECTS.popHello;
  const noteCount = prefersReducedMotion ? 0 : effect.noteCount;
  const notes = useMemo(
    () => buildNotes(noteCount, effect.driftX, effect.driftY, effect.scatter, preset),
    [effect.driftX, effect.driftY, effect.scatter, noteCount, preset]
  );

  if (!interactionToken) return null;

  return (
    <div className={`model-interaction-stage model-interaction-stage--${themeVariant}`} aria-hidden="true">
      <div
        key={`${preset}-${interactionToken}`}
        className="model-interaction-burst"
        style={{ top: anchorY }}
      >
        <motion.span
          className="model-interaction-note-trail"
          initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
          animate={{ opacity: [0, 0.72, 0.18, 0], scale: [0.9, 1.02, 1.06, 1.04], rotate: [-8, -4, -2, -2] }}
          transition={{ duration: prefersReducedMotion ? 0.5 : 1.18, ease: [0.22, 0.61, 0.24, 1] }}
        />

        {notes.map((note) => (
          <motion.span
            key={`${interactionToken}-${note.id}`}
            className="model-interaction-note"
            style={{ fontSize: `${note.size}px` }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.52, rotate: note.rotate - 10 }}
            animate={{
              x: [0, note.x * 0.34, note.x * 0.7, note.x],
              y: [0, note.y * 0.26 - 6, note.y * 0.66 + 10, note.y],
              opacity: [0, 0.92, 0.9, 0],
              scale: [0.52, 0.9, 1, 0.82],
              rotate: [note.rotate - 10, note.rotate - 1, note.rotate + 3, note.rotate + 6],
            }}
            transition={{
              duration: prefersReducedMotion ? 0.64 : effect.duration,
              delay: note.delay,
              times: [0, 0.28, 0.72, 1],
              ease: [0.22, 0.74, 0.2, 1],
            }}
          >
            {note.glyph}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
