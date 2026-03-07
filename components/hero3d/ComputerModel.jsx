import { Box3, MathUtils, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ComputerModel({ modelConfig, onModelClick, interactionPreset, interactionToken }) {
  const { scene } = useGLTF(modelConfig.assetPath);
  const modelScene = useMemo(() => scene.clone(true), [scene]);
  const rigRef = useRef(null);
  const modelRef = useRef(null);
  const centeredRef = useRef(null);
  const [interactive, setInteractive] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragRotationRef = useRef({ x: 0, y: 0 });
  const interactionRef = useRef({
    token: 0,
    presetName: null,
    startedAt: null,
  });
  const dragStateRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    moved: false,
    startRotationX: 0,
    startRotationY: 0,
  });

  const [baseX = 0, baseY = 0, baseZ = 0] = modelConfig.transform.rotation || [0, 0, 0];
  const [posX = 0, posY = 0, posZ = 0] = modelConfig.transform.position || [0, 0, 0];
  const baseScale = Number(modelConfig.transform.scale || 1);

  const motion = modelConfig.motion || {};
  const autoRotateSpeed = Number(motion.autoRotateSpeed || 0);
  const idleYawAmplitude = Math.min(
    Number(motion.idleYawAmplitude || 0.42),
    Math.PI / 4
  );
  const breathingAmplitude = Number(motion.breathingAmplitude || 0.02);
  const breathingFrequency = Number(motion.breathingFrequency || 1);
  const scaleBreathingAmplitude = Number(motion.scaleBreathingAmplitude || 0.005);
  const scaleBreathingFrequency = Number(motion.scaleBreathingFrequency || 0.9);
  const idleTiltAmplitude = Number(motion.idleTiltAmplitude || 0.03);
  const idleRollAmplitude = Number(motion.idleRollAmplitude || 0.02);
  const parallaxX = Number(motion.parallaxRotationX || 0.12);
  const parallaxY = Number(motion.parallaxRotationY || 0.18);
  const dragRotateX = Number(motion.dragRotationX || 1.35);
  const dragRotateY = Number(motion.dragRotationY || 1.7);
  const dragLimitX = Number(motion.dragLimitX || 0.85);
  const dragLimitY = Number(motion.dragLimitY || 1.25);
  const damping = Number(motion.damping || 3.6);
  const interactionMultiplier = Number(motion.interactionMultiplier || 1);
  const clickPresets = motion.clickPresets || {};
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
      }
    });
  }, [modelScene]);

  useEffect(() => {
    dragRotationRef.current = { x: 0, y: 0 };
    interactionRef.current = {
      token: 0,
      presetName: null,
      startedAt: null,
    };
    dragStateRef.current = {
      active: false,
      pointerId: null,
      startX: 0,
      startY: 0,
      moved: false,
      startRotationX: 0,
      startRotationY: 0,
    };
    if (rigRef.current) {
      rigRef.current.rotation.set(baseX, baseY, baseZ);
    }
  }, [baseX, baseY, baseZ, modelConfig.assetPath]);

  useEffect(() => {
    if (!interactionToken || !interactionPreset) return;
    interactionRef.current = {
      token: interactionToken,
      presetName: interactionPreset,
      startedAt: null,
    };
  }, [interactionPreset, interactionToken]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const previousCursor = document.body.style.cursor;
    if (dragging) {
      document.body.style.cursor = "grabbing";
    } else if (interactive) {
      document.body.style.cursor = "grab";
    } else {
      document.body.style.cursor = "";
    }

    return () => {
      document.body.style.cursor = previousCursor;
    };
  }, [dragging, interactive]);

  const onPointerDown = (event) => {
    event.stopPropagation();
    setInteractive(true);
    setDragging(true);
    dragStateRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      startRotationX: dragRotationRef.current.x,
      startRotationY: dragRotationRef.current.y,
    };
    event.target.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!dragStateRef.current.active) return;
    event.stopPropagation();
    const viewportWidth = typeof window === "undefined" ? 1 : Math.max(window.innerWidth, 1);
    const viewportHeight = typeof window === "undefined" ? 1 : Math.max(window.innerHeight, 1);
    const deltaX = (event.clientX - dragStateRef.current.startX) / viewportWidth;
    const deltaY = (event.clientY - dragStateRef.current.startY) / viewportHeight;
    const movedX = Math.abs(event.clientX - dragStateRef.current.startX);
    const movedY = Math.abs(event.clientY - dragStateRef.current.startY);
    if (movedX > 6 || movedY > 6) {
      dragStateRef.current.moved = true;
    }

    dragRotationRef.current.x = MathUtils.clamp(
      dragStateRef.current.startRotationX - deltaY * dragRotateX,
      -dragLimitX,
      dragLimitX
    );
    dragRotationRef.current.y = MathUtils.clamp(
      dragStateRef.current.startRotationY + deltaX * dragRotateY,
      -dragLimitY,
      dragLimitY
    );
  };

  const endDrag = (event) => {
    const wasClick = dragStateRef.current.active && !dragStateRef.current.moved;
    if (dragStateRef.current.pointerId !== null) {
      event?.target?.releasePointerCapture?.(dragStateRef.current.pointerId);
    }
    dragStateRef.current.active = false;
    dragStateRef.current.pointerId = null;
    dragStateRef.current.moved = false;
    setDragging(false);
    if (wasClick) {
      onModelClick?.();
    }
  };

  useFrame((state, delta) => {
    if (!rigRef.current || !modelRef.current) return;

    const t = state.clock.getElapsedTime();
    const idleActive = !dragStateRef.current.active;
    const pointerX = interactive ? state.pointer.x : 0;
    const pointerY = interactive ? state.pointer.y : 0;
    const hoverRotationX = interactive ? pointerY * parallaxX : 0;
    const hoverRotationY = interactive ? pointerX * parallaxY : 0;
    const idleFloatY = idleActive ? Math.sin(t * breathingFrequency) * breathingAmplitude : 0;
    const idleYawY = idleActive
      ? Math.sin(t * autoRotateSpeed * Math.PI * 2) * idleYawAmplitude
      : 0;
    const idleTiltX = idleActive ? Math.sin(t * breathingFrequency * 0.72) * idleTiltAmplitude : 0;
    const idleRollZ = idleActive ? Math.cos(t * breathingFrequency * 0.54) * idleRollAmplitude : 0;
    let interactionRotationX = 0;
    let interactionRotationY = 0;
    let interactionRotationZ = 0;
    let interactionPositionX = 0;
    let interactionPositionY = 0;
    let interactionPositionZ = 0;
    let interactionScale = 0;

    const activePresetName = interactionRef.current.presetName;
    const activePreset = activePresetName ? clickPresets[activePresetName] : null;
    if (activePreset) {
      if (interactionRef.current.startedAt === null) {
        interactionRef.current.startedAt = t;
      }
      const duration = Math.max(0.42, Number(activePreset.duration || 0.82));
      const elapsed = t - interactionRef.current.startedAt;
      const progress = Math.min(elapsed / duration, 1);
      const strength = interactionMultiplier * Number(activePreset.strength || 1);
      const [presetRotX = 0, presetRotY = 0, presetRotZ = 0] = activePreset.rotation || [0, 0, 0];
      const [presetPosX = 0, presetPosY = 0, presetPosZ = 0] = activePreset.position || [0, 0, 0];
      const presetScale = Number(activePreset.scale || 0);

      if (activePresetName === "swayTease") {
        const arc = Math.sin(progress * Math.PI);
        const sway = Math.sin(progress * Math.PI * 2.2) * (1 - progress * 0.18);
        interactionRotationX = presetRotX * arc * 0.56 * strength;
        interactionRotationY = presetRotY * sway * strength;
        interactionRotationZ = presetRotZ * sway * 0.78 * strength;
        interactionPositionX = presetPosX * sway * strength;
        interactionPositionY = presetPosY * arc * 0.72 * strength;
        interactionScale = presetScale * arc * 0.74 * strength;
      } else if (activePresetName === "miniFlourish") {
        const arc = Math.sin(progress * Math.PI);
        const flourish = Math.sin(progress * Math.PI * 1.18);
        const rebound = Math.sin(progress * Math.PI * 2.36) * (1 - progress) * 0.26;
        interactionRotationX = (presetRotX * arc + rebound * 0.08) * strength;
        interactionRotationY = (presetRotY * flourish + presetRotY * 0.16 * rebound) * strength;
        interactionRotationZ = (presetRotZ * arc + presetRotZ * 0.2 * rebound) * strength;
        interactionPositionX = presetPosX * flourish * 0.42 * strength;
        interactionPositionY = presetPosY * arc * strength;
        interactionPositionZ = presetPosZ * arc * strength;
        interactionScale = presetScale * arc * strength;
      } else {
        const pop = Math.sin(progress * Math.PI);
        const nod = Math.sin(progress * Math.PI * 1.52) * (1 - progress) * 0.34;
        interactionRotationX = (presetRotX * pop + presetRotX * nod) * strength;
        interactionRotationY = presetRotY * pop * strength;
        interactionRotationZ = presetRotZ * pop * 0.76 * strength;
        interactionPositionX = presetPosX * pop * strength;
        interactionPositionY = presetPosY * pop * strength;
        interactionPositionZ = presetPosZ * pop * strength;
        interactionScale = presetScale * pop * strength;
      }

      if (progress >= 1) {
        interactionRef.current.presetName = null;
        interactionRef.current.startedAt = null;
      }
    }

    const targetX =
      baseX + dragRotationRef.current.x + hoverRotationX + idleTiltX + interactionRotationX;
    const targetY =
      baseY + dragRotationRef.current.y + hoverRotationY + idleYawY + interactionRotationY;
    const targetZ = baseZ + idleRollZ + interactionRotationZ;

    rigRef.current.rotation.x = MathUtils.damp(rigRef.current.rotation.x, targetX, damping, delta);
    rigRef.current.rotation.y = MathUtils.damp(rigRef.current.rotation.y, targetY, damping, delta);
    rigRef.current.rotation.z = MathUtils.damp(rigRef.current.rotation.z, targetZ, damping, delta);

    modelRef.current.position.set(
      posX + interactionPositionX,
      posY + idleFloatY + interactionPositionY,
      posZ + interactionPositionZ
    );

    const scalePulse = 1 + Math.sin(t * scaleBreathingFrequency) * scaleBreathingAmplitude;
    modelRef.current.scale.setScalar(baseScale * normalizeScale * scalePulse * (1 + interactionScale));
  });

  return (
    <group
      ref={rigRef}
      onPointerOver={() => setInteractive(true)}
      onPointerOut={() => {
        if (!dragStateRef.current.active) setInteractive(false);
      }}
      onPointerMissed={() => {
        if (!dragStateRef.current.active) setInteractive(false);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <group ref={modelRef} position={modelConfig.transform.position} rotation={modelConfig.transform.rotation} scale={modelConfig.transform.scale}>
        <group ref={centeredRef} position={centerOffset}>
          <primitive object={modelScene} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/hero/mr-mime-pokemon-reboot.glb");
useGLTF.preload("/hero/singer.glb");
