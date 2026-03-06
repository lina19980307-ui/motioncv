import { MathUtils } from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";

export default function StickerDecal({ sticker }) {
  const texture = useTexture(sticker.image);
  const [hovered, setHovered] = useState(false);
  const peelRef = useRef(0);
  const flapRef = useRef(null);
  const shadowRef = useRef(null);

  const [width, height] = sticker.size;
  const pivotX = sticker.peelDirection === "right" ? width / 2 : -width / 2;
  const meshX = sticker.peelDirection === "right" ? -width / 2 : width / 2;
  const peelSign = sticker.peelDirection === "right" ? -1 : 1;

  const underlayColor = useMemo(() => "#d2d9e4", []);

  useFrame((_, delta) => {
    peelRef.current = MathUtils.damp(peelRef.current, hovered ? 1 : 0, 7, delta);
    const peel = peelRef.current;

    if (flapRef.current) {
      flapRef.current.rotation.x = -peel * 0.48;
      flapRef.current.rotation.z = peelSign * peel * 0.28;
      flapRef.current.position.z = 0.001 + peel * 0.025;
    }

    if (shadowRef.current) {
      shadowRef.current.material.opacity = 0.12 + peel * 0.24;
      shadowRef.current.position.y = -0.01 - peel * 0.012;
      shadowRef.current.scale.setScalar(1 + peel * 0.08);
    }
  });

  return (
    <group position={sticker.position} rotation={sticker.rotation}>
      <mesh position={[0, 0, -0.002]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={underlayColor} roughness={0.92} metalness={0.02} />
      </mesh>

      <mesh ref={shadowRef} position={[0, -0.01, -0.0015]}>
        <planeGeometry args={[width * 1.02, height * 1.02]} />
        <meshBasicMaterial color="#1a2235" transparent opacity={0.12} />
      </mesh>

      <group ref={flapRef} position={[pivotX, height / 2, 0.001]}>
        <mesh
          position={[meshX, -height / 2, 0]}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial map={texture} transparent roughness={0.72} metalness={0.02} />
        </mesh>
      </group>
    </group>
  );
}
