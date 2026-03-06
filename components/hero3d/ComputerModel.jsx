import { MathUtils } from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useMemo, useRef } from "react";

export default function ComputerModel({ modelConfig }) {
  const { scene } = useGLTF(modelConfig.assetPath);
  const modelScene = useMemo(() => scene.clone(true), [scene]);
  const rigRef = useRef(null);
  const modelRef = useRef(null);
  const rotateOffsetRef = useRef(0);

  const [baseX = 0, baseY = 0, baseZ = 0] = modelConfig.transform.rotation || [0, 0, 0];
  const [posX = 0, posY = 0, posZ = 0] = modelConfig.transform.position || [0, 0, 0];
  const baseScale = Number(modelConfig.transform.scale || 1);

  const motion = modelConfig.motion || {};
  const autoRotateSpeed = Number(motion.autoRotateSpeed || 0.12);
  const breathingAmplitude = Number(motion.breathingAmplitude || 0.02);
  const breathingFrequency = Number(motion.breathingFrequency || 1);
  const scaleBreathingAmplitude = Number(motion.scaleBreathingAmplitude || 0.005);
  const scaleBreathingFrequency = Number(motion.scaleBreathingFrequency || 0.9);
  const parallaxX = Number(motion.parallaxRotationX || 0.06);
  const parallaxY = Number(motion.parallaxRotationY || 0.1);
  const damping = Number(motion.damping || 3.6);

  useMemo(() => {
    modelScene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return modelScene;
  }, [modelScene]);

  useFrame((state, delta) => {
    if (!rigRef.current || !modelRef.current) return;

    const t = state.clock.getElapsedTime();
    rotateOffsetRef.current += delta * autoRotateSpeed;

    const targetX = baseX + state.pointer.y * parallaxX;
    const targetY = baseY + rotateOffsetRef.current + state.pointer.x * parallaxY;

    rigRef.current.rotation.x = MathUtils.damp(rigRef.current.rotation.x, targetX, damping, delta);
    rigRef.current.rotation.y = MathUtils.damp(rigRef.current.rotation.y, targetY, damping, delta);
    rigRef.current.rotation.z = MathUtils.damp(rigRef.current.rotation.z, baseZ, damping, delta);

    modelRef.current.position.set(posX, posY + Math.sin(t * breathingFrequency) * breathingAmplitude, posZ);

    const scalePulse = 1 + Math.sin(t * scaleBreathingFrequency) * scaleBreathingAmplitude;
    modelRef.current.scale.setScalar(baseScale * scalePulse);
  });

  return (
    <group ref={rigRef}>
      <group ref={modelRef} position={modelConfig.transform.position} rotation={modelConfig.transform.rotation} scale={modelConfig.transform.scale}>
        <primitive object={modelScene} />
      </group>
    </group>
  );
}

useGLTF.preload("/hero/computer.glb");
