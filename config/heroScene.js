const heroSceneConfig = {
  canvas: {
    dpr: [1, 1.8],
    transparent: true,
    renderer: {
      toneMapping: "aces",
      exposure: 1,
    },
    camera: {
      position: [0, 0.08, 8.4],
      fov: 27,
    },
    fog: {
      color: "#f1f3f8",
      near: 11,
      far: 19,
      enabled: false,
    },
  },
  lights: {
    ambientIntensity: 0.56,
    environment: {
      preset: "studio",
      intensity: 0.92,
      blur: 0.28,
    },
    hemisphere: {
      intensity: 0.22,
      color: "#dfe7ff",
      groundColor: "#6e7285",
    },
    key: {
      position: [2.8, 3.6, 4.4],
      intensity: 1.35,
      color: "#fff8f1",
    },
    fill: {
      position: [-3.6, 1.8, 2.2],
      intensity: 0.58,
      color: "#d7e4ff",
    },
    rim: {
      position: [-2.4, 1.7, -3.8],
      intensity: 0.76,
      color: "#b8cbff",
    },
    spot: {
      position: [2.6, 3.8, 4.6],
      angle: 0.42,
      penumbra: 0.8,
      intensity: 1.22,
    },
    point: {
      position: [-2.8, 1.6, -2.4],
      intensity: 0.3,
      color: "#d0d8ef",
    },
    contactShadow: {
      position: [0, -1.96, 0],
      blur: 2.05,
      opacity: 0.28,
      resolution: 1024,
      scale: 7.8,
      far: 4.2,
    },
  },
  model: {
    assetPath: "/hero/mr-mime-pokemon-reboot.glb",
    transform: {
      position: [0, -0.54, 0],
      rotation: [0, -0.02, 0],
      scale: 1,
      targetSize: 2.65,
      targetBy: "height",
    },
    motion: {
      autoRotateSpeed: 0.14,
      idleYawAmplitude: 0.42,
      breathingAmplitude: 0.12,
      breathingFrequency: 0.92,
      scaleBreathingAmplitude: 0.03,
      scaleBreathingFrequency: 0.74,
      idleTiltAmplitude: 0.045,
      idleRollAmplitude: 0.028,
      parallaxRotationX: 0.16,
      parallaxRotationY: 0.24,
      dragRotationX: 1.5,
      dragRotationY: 1.9,
      dragLimitX: 0.9,
      dragLimitY: 1.3,
      damping: 5,
      interactionMultiplier: 1,
      clickPresets: {
        popHello: {
          duration: 0.78,
          rotation: [-0.14, 0.2, 0.07],
          position: [0, 0.16, 0.03],
          scale: 0.07,
          strength: 1,
        },
        swayTease: {
          duration: 0.96,
          rotation: [0.08, 0.28, 0.13],
          position: [0.08, 0.08, 0],
          scale: 0.05,
          strength: 1,
        },
        miniFlourish: {
          duration: 1.02,
          rotation: [-0.1, 0.52, 0.16],
          position: [0.04, 0.14, 0.05],
          scale: 0.085,
          strength: 1,
        },
      },
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
