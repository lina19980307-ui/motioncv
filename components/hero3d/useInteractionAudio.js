import { useEffect, useRef } from "react";

export default function useInteractionAudio(interactionAudio) {
  const audioRef = useRef(null);

  useEffect(
    () => () => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    },
    []
  );

  return () => {
    if (!interactionAudio?.url || typeof Audio === "undefined") return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(interactionAudio.url);
    audio.preload = "auto";
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0.92;
    audioRef.current = audio;
    audio.play().catch(() => {});
  };
}
