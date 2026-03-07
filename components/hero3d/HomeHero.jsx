import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import heroSceneConfig from "../../config/heroScene";
import ModelInteractionBurst from "./ModelInteractionBurst";
import { MODEL_CLICK_PRESET_ORDER } from "./modelInteraction";
import useInteractionAudio from "./useInteractionAudio";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export default function HomeHero({ interactionAudio = null }) {
  const [interactionState, setInteractionState] = useState({ token: 0, comboIndex: -1 });
  const playInteractionAudio = useInteractionAudio(interactionAudio);
  const interactionPreset = useMemo(
    () => MODEL_CLICK_PRESET_ORDER[Math.max(interactionState.comboIndex, 0)] || MODEL_CLICK_PRESET_ORDER[0],
    [interactionState.comboIndex]
  );

  const onModelClick = () => {
    playInteractionAudio();
    setInteractionState((prev) => ({
      token: prev.token + 1,
      comboIndex: (prev.comboIndex + 1) % MODEL_CLICK_PRESET_ORDER.length,
    }));
  };

  return (
    <section className="hero-root">
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-gradient" aria-hidden="true" />
      <div className="hero-canvas-wrap">
        <HeroCanvas
          config={heroSceneConfig}
          onModelClick={onModelClick}
          interactionPreset={interactionPreset}
          interactionToken={interactionState.token}
        />
      </div>
      <ModelInteractionBurst
        interactionToken={interactionState.token}
        preset={interactionPreset}
        themeVariant="light"
        anchorY="70%"
      />
    </section>
  );
}
