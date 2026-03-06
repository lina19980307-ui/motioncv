import Head from "next/head";
import HomeHero from "../components/hero3d/HomeHero";

export default function Home() {
  return (
    <>
      <Head>
        <title>MotionCV | 3D Hero</title>
        <meta
          name="description"
          content="MotionCV high-fidelity 3D hero homepage with procedural monitor, peel stickers and badge drop."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <HomeHero />
    </>
  );
}
