import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import ComputerModel from "./ComputerModel";

export default function HeroCanvas({ config }) {
  const { canvas, lights, model } = config;
  return (
    <Canvas
      dpr={canvas.dpr}
      shadows
      camera={canvas.camera}
      gl={{ antialias: true, alpha: true }}
      className="hero-canvas"
    >
      <color attach="background" args={["#050507"]} />
      <fog attach="fog" args={[canvas.fog.color, canvas.fog.near, canvas.fog.far]} />
      <ambientLight intensity={lights.ambientIntensity} />
      <hemisphereLight intensity={lights.hemisphere.intensity} color={lights.hemisphere.color} groundColor={lights.hemisphere.groundColor} />
      <spotLight
        position={lights.spot.position}
        angle={lights.spot.angle}
        penumbra={lights.spot.penumbra}
        intensity={lights.spot.intensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={lights.point.position} intensity={lights.point.intensity} color={lights.point.color} />
      <Suspense fallback={null}>
        <ComputerModel modelConfig={model} />
        <ContactShadows
          position={lights.contactShadow.position}
          blur={lights.contactShadow.blur}
          opacity={lights.contactShadow.opacity}
          scale={lights.contactShadow.scale}
          far={lights.contactShadow.far}
        />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
