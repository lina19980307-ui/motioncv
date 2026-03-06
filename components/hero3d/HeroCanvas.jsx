import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import ComputerModel from "./ComputerModel";

export default function HeroCanvas({ config }) {
  const { canvas, lights, model } = config;
  return (
    <Canvas
      dpr={canvas.dpr}
      shadows
      camera={canvas.camera}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        if (canvas?.renderer?.toneMapping === "aces") {
          gl.toneMapping = ACESFilmicToneMapping;
        }
        gl.toneMappingExposure = canvas?.renderer?.exposure ?? 1;
        gl.outputColorSpace = SRGBColorSpace;
      }}
      className="hero-canvas"
      style={{ background: "transparent" }}
    >
      {canvas.fog?.enabled !== false && <fog attach="fog" args={[canvas.fog.color, canvas.fog.near, canvas.fog.far]} />}
      <ambientLight intensity={lights.ambientIntensity} />
      <hemisphereLight intensity={lights.hemisphere.intensity} color={lights.hemisphere.color} groundColor={lights.hemisphere.groundColor} />
      {lights.key && <directionalLight position={lights.key.position} intensity={lights.key.intensity} color={lights.key.color} />}
      {lights.fill && <directionalLight position={lights.fill.position} intensity={lights.fill.intensity} color={lights.fill.color} />}
      {lights.rim && <directionalLight position={lights.rim.position} intensity={lights.rim.intensity} color={lights.rim.color} />}
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
        {lights.environment && (
          <Environment
            preset={lights.environment.preset}
            intensity={lights.environment.intensity}
            blur={lights.environment.blur}
            background={false}
          />
        )}
        <ComputerModel modelConfig={model} />
        <ContactShadows
          position={lights.contactShadow.position}
          blur={lights.contactShadow.blur}
          opacity={lights.contactShadow.opacity}
          scale={lights.contactShadow.scale}
          far={lights.contactShadow.far}
        />
      </Suspense>
    </Canvas>
  );
}
