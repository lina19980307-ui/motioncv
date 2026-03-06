import dynamic from "next/dynamic";
import heroSceneConfig from "../../config/heroScene";
import BadgeDrop from "./BadgeDrop";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export default function HomeHero() {
  const { ui, badge } = heroSceneConfig;

  return (
    <section className="hero-root">
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-gradient" aria-hidden="true" />
      <div className="hero-canvas-wrap">
        <HeroCanvas config={heroSceneConfig} />
      </div>

      <header className="hero-heading">
        <p className="hero-kicker">{ui.heading.kicker}</p>
        <h1 className="hero-title">{ui.heading.title}</h1>
        <p className="hero-subtitle">{ui.heading.subtitle}</p>
      </header>

      <span className="hero-crosshair" aria-hidden="true">
        {ui.heading.crosshair}
      </span>

      <BadgeDrop badge={badge} />
    </section>
  );
}
