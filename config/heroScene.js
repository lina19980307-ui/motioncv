const heroSceneConfig = {
  canvas: {
    dpr: [1, 1.8],
    camera: {
      position: [0, 0.38, 5.4],
      fov: 31,
    },
    fog: {
      color: "#050507",
      near: 8,
      far: 15,
    },
  },
  lights: {
    ambientIntensity: 0.42,
    hemisphere: {
      intensity: 0.32,
      color: "#cfdefd",
      groundColor: "#1f1f27",
    },
    spot: {
      position: [2.6, 3.8, 4.6],
      angle: 0.42,
      penumbra: 0.8,
      intensity: 1.5,
    },
    point: {
      position: [-2.8, 1.6, -2.4],
      intensity: 0.44,
      color: "#95a8dd",
    },
    contactShadow: {
      position: [0, -1.6, 0],
      blur: 2.2,
      opacity: 0.34,
      scale: 7.8,
      far: 2.5,
    },
  },
  model: {
    assetPath: "/hero/computer.glb",
    transform: {
      position: [0, -0.78, 0],
      rotation: [0, -0.08, 0],
      scale: 2.35,
    },
    motion: {
      autoRotateSpeed: 0.14,
      breathingAmplitude: 0.03,
      breathingFrequency: 1.05,
      scaleBreathingAmplitude: 0.008,
      scaleBreathingFrequency: 0.74,
      parallaxRotationX: 0.07,
      parallaxRotationY: 0.11,
      damping: 3.8,
    },
  },
  ui: {
    heading: {
      kicker: "MotionCV",
      title: "Digital Presence Object",
      subtitle: "Minimal. Sculptural. Interactive.",
      crosshair: "+",
    },
  },
  badge: {
    buttonLabel: "Drop Badge",
    button: {
      top: "2rem",
      right: "2.2rem",
    },
    drop: {
      top: "clamp(5.4rem, 16vh, 8.6rem)",
      right: "clamp(1rem, 4vw, 3.2rem)",
      width: "min(280px, calc(100vw - 2rem))",
      finalRotate: 2,
      initialRotate: -8,
    },
    animation: {
      dropSpring: {
        stiffness: 148,
        damping: 16,
        mass: 0.72,
      },
      exitDuration: 0.25,
      swayRotate: [2, 1.2, 2, 1.5, 2],
      swayDuration: 5.2,
      swayDelay: 1.1,
    },
    baseImage: "/hero/base.png",
    name: "Chloe Zhang",
    title: "Product Designer",
    brand: "MOTIONCV",
    qrImage: "/hero/qr-placeholder.svg",
    avatarImage: "/hero/avatar-placeholder.svg",
  },
};

export default heroSceneConfig;
