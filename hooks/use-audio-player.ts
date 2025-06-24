import { useEffect, useRef, useState } from "react";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up the audio player once on mount
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "none";
    audioRef.current = audio;

    const context = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    audioContextRef.current = context;

    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;

      sourceRef.current?.disconnect();
      analyserRef.current?.disconnect();
      context.close();

      sourceRef.current = null;
      audioContextRef.current = null;
      analyserRef.current = null;
    };
  }, []);

  const connectGraph = () => {
    if (
      audioRef.current &&
      audioContextRef.current &&
      analyserRef.current &&
      !sourceRef.current
    ) {
      sourceRef.current = audioContextRef.current.createMediaElementSource(
        audioRef.current
      );
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  };

  const loadStation = async (url: string, fallbackUrls: string[] = []) => {
    if (!audioRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      audioRef.current.src = url;
      connectGraph();

      // Try to play
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.warn("Failed to play:", err);
      if (fallbackUrls.length > 0) {
        await loadStation(fallbackUrls[0], fallbackUrls.slice(1));
      } else {
        setError("Failed to load stream");
        setIsPlaying(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const play = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (e) {
      console.error("Play error:", e);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  const changeVolume = (v: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = v;
    setVolume(v);
  };

  return {
    isPlaying,
    isMuted,
    volume,
    isLoading,
    error,
    play,
    pause,
    toggleMute,
    setVolume: changeVolume,
    loadStation,
    audioContextRef,
    analyserRef,
  };
}
