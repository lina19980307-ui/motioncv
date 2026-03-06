import dynamic from "next/dynamic";
import heroSceneConfig from "../../config/heroScene";
import BadgeDrop from "./BadgeDrop";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export default function HomeHero() {
  const { badge } = heroSceneConfig;

  return (
    <section className="hero-root">
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-gradient" aria-hidden="true" />
      <div className="hero-canvas-wrap">
        <HeroCanvas config={heroSceneConfig} />
      </div>

      <BadgeDrop badge={badge} />
    </section>
  );
}
