import { Box3, MathUtils, SRGBColorSpace, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ComputerModel({ modelConfig }) {
  const { scene } = useGLTF(modelConfig.assetPath);
  const modelScene = useMemo(() => scene.clone(true), [scene]);
  const fallbackMap = useTexture(modelConfig.materialFallback?.diffuseMap || "/hero/computer-diffuse.png");
  const preparedFallbackMap = useMemo(() => {
    if (!fallbackMap) return null;
    const next = fallbackMap.clone();
    next.colorSpace = SRGBColorSpace;
    next.needsUpdate = true;
    return next;
  }, [fallbackMap]);
  const rigRef = useRef(null);
  const modelRef = useRef(null);
  const centeredRef = useRef(null);
  const [interactive, setInteractive] = useState(false);

  const [baseX = 0, baseY = 0, baseZ = 0] = modelConfig.transform.rotation || [0, 0, 0];
  const [posX = 0, posY = 0, posZ = 0] = modelConfig.transform.position || [0, 0, 0];
  const baseScale = Number(modelConfig.transform.scale || 1);

  const motion = modelConfig.motion || {};
  const breathingAmplitude = Number(motion.breathingAmplitude || 0.02);
  const breathingFrequency = Number(motion.breathingFrequency || 1);
  const scaleBreathingAmplitude = Number(motion.scaleBreathingAmplitude || 0.005);
  const scaleBreathingFrequency = Number(motion.scaleBreathingFrequency || 0.9);
  const parallaxX = Number(motion.parallaxRotationX || 0.06);
  const parallaxY = Number(motion.parallaxRotationY || 0.08);
  const damping = Number(motion.damping || 3.6);
  const targetSize = Number(modelConfig.transform.targetSize || 2.5);
  const sizeMode = modelConfig.transform.targetBy || "height";

  const { centerOffset, normalizeScale } = useMemo(() => {
    const box = new Box3().setFromObject(modelScene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const base = sizeMode === "max" ? Math.max(size.x, size.y, size.z) : size.y;
    const safeBase = base > 0 ? base : 1;
    return {
      centerOffset: [-center.x, -center.y, -center.z],
      normalizeScale: targetSize / safeBase,
    };
  }, [modelScene, sizeMode, targetSize]);

  useEffect(() => {
    modelScene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        materials.forEach((mat) => {
          if (!mat) return;
          if (!mat.map && preparedFallbackMap) {
            mat.map = preparedFallbackMap;
            if (typeof mat.roughness === "number") mat.roughness = modelConfig.materialFallback?.roughness ?? mat.roughness;
            if (typeof mat.metalness === "number") mat.metalness = modelConfig.materialFallback?.metalness ?? mat.metalness;
            if (typeof mat.envMapIntensity === "number") {
              mat.envMapIntensity = modelConfig.materialFallback?.envMapIntensity ?? mat.envMapIntensity;
            }
          }
          mat.needsUpdate = true;
        });
      }
    });
  }, [modelConfig.materialFallback, modelScene, preparedFallbackMap]);

  useFrame((state, delta) => {
    if (!rigRef.current || !modelRef.current) return;

    const t = state.clock.getElapsedTime();
    const pointerX = interactive ? state.pointer.x : 0;
    const pointerY = interactive ? state.pointer.y : 0;
    const targetX = baseX + pointerY * parallaxX;
    const targetY = baseY + pointerX * parallaxY;

    rigRef.current.rotation.x = MathUtils.damp(rigRef.current.rotation.x, targetX, damping, delta);
    rigRef.current.rotation.y = MathUtils.damp(rigRef.current.rotation.y, targetY, damping, delta);
    rigRef.current.rotation.z = MathUtils.damp(rigRef.current.rotation.z, baseZ, damping, delta);

    modelRef.current.position.set(posX, posY + Math.sin(t * breathingFrequency) * breathingAmplitude, posZ);

    const scalePulse = 1 + Math.sin(t * scaleBreathingFrequency) * scaleBreathingAmplitude;
    modelRef.current.scale.setScalar(baseScale * normalizeScale * scalePulse);
  });

  return (
    <group
      ref={rigRef}
      onPointerOver={() => setInteractive(true)}
      onPointerOut={() => setInteractive(false)}
      onPointerMissed={() => setInteractive(false)}
    >
      <group ref={modelRef} position={modelConfig.transform.position} rotation={modelConfig.transform.rotation} scale={modelConfig.transform.scale}>
        <group ref={centeredRef} position={centerOffset}>
          <primitive object={modelScene} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/hero/computer.glb");
