"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music2,
  Heart,
  Zap,
  Loader2,
} from "lucide-react";
import { AudioVisualizer } from "@/components/audio-visualizer";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { PageHeader } from "@/components/page-header";

const stations = [
  {
    id: "hip-hop",
    name: "Hip-Hop Station",
    description: "The hottest hip-hop tracks from underground to mainstream",
    streamUrl: "https://radio.nolimit.pt/listen/nol/radio.mp3",
    fallbackUrls: [
      "https://radio.nolimit.pt/listen/nol/radio.mp3",
      "https://radio.nolimit.pt/listen/nol/radio.mp3",
    ],
    currentTrack: "Loading",
    listeners: "Loading",
    genre: "Hip-Hop",
    icon: Music2,
    color: "from-orange-500 to-yellow-500",
    about:
      "Our Hip-Hop station features the latest and greatest in hip-hop music, from chart-topping hits to underground gems. We showcase both established artists and emerging talent.",
    schedule: [
      { time: "6:00 AM - 10:00 AM", show: "Morning Hip-Hop Mix" },
      { time: "10:00 AM - 2:00 PM", show: "Classic Hip-Hop Hits" },
      { time: "2:00 PM - 6:00 PM", show: "New School Vibes" },
      { time: "6:00 PM - 10:00 PM", show: "Underground Spotlight" },
      { time: "10:00 PM - 6:00 AM", show: "Late Night Beats" },
    ],
  },
  {
    id: "rnb",
    name: "R&B Station",
    description: "Classic and contemporary R&B that moves your soul",
    streamUrl: "https://radio.nolimit.pt/listen/rb/radio.mp3",
    fallbackUrls: [
      "https://radio.nolimit.pt/listen/rb/radio.mp3",
      "https://radio.nolimit.pt/listen/rb/radio.mp3",
    ],
    currentTrack: "Loading",
    listeners: "Loading",
    genre: "R&B",
    icon: Heart,
    color: "from-purple-500 to-pink-500",
    about:
      "Experience the smooth sounds of R&B, from classic Motown to contemporary soul. Our R&B station delivers the perfect blend of rhythm and blues to soothe your soul.",
    schedule: [
      { time: "6:00 AM - 10:00 AM", show: "Smooth Morning R&B" },
      { time: "10:00 AM - 2:00 PM", show: "Classic Soul Hits" },
      { time: "2:00 PM - 6:00 PM", show: "Contemporary R&B" },
      { time: "6:00 PM - 10:00 PM", show: "Neo-Soul Sessions" },
      { time: "10:00 PM - 6:00 AM", show: "Midnight Slow Jams" },
    ],
  },
  {
    id: "rock-pop",
    name: "Rock/Pop Station",
    description: "From rock anthems to pop hits that get you moving",
    streamUrl: "https://edge-bauerall-03-gos2.sharp-stream.com/kiss100.aac",
    fallbackUrls: [
      "https://edge-bauerall-03-gos2.sharp-stream.com/kiss100.aac",
      "https://edge-bauerall-03-gos2.sharp-stream.com/kiss100.aac",
    ],
    currentTrack: "Loading",
    listeners: "Loading",
    genre: "Rock/Pop",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    about:
      "Get energized with our Rock/Pop station featuring everything from classic rock anthems to the latest pop hits. Perfect for getting pumped up or singing along.",
    schedule: [
      { time: "6:00 AM - 10:00 AM", show: "Morning Rock Energy" },
      { time: "10:00 AM - 2:00 PM", show: "Pop Hits Countdown" },
      { time: "2:00 PM - 6:00 PM", show: "Alternative Rock Mix" },
      { time: "6:00 PM - 10:00 PM", show: "Classic Rock Legends" },
      { time: "10:00 PM - 6:00 AM", show: "Indie & Alternative" },
    ],
  },
];

export default function StationsPage() {
  const [selectedStation, setSelectedStation] = useState(stations[0]);
  const {
    isPlaying,
    isLoading,
    volume,
    isMuted,
    error,
    play,
    pause,
    setVolume,
    toggleMute,
    loadStation,
    audioContextRef,
    analyserRef,
  } = useAudioPlayer();

  // ✅ Auto-play on first load
  useEffect(() => {
    const init = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (audioContextRef.current?.state === "suspended") {
          await audioContextRef.current.resume();
        }
        await loadStation(
          selectedStation.streamUrl,
          selectedStation.fallbackUrls
        );
      } catch (err) {
        console.error("Autoplay error:", err);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStationChange = async (station: (typeof stations)[0]) => {
    setSelectedStation(station);
    await loadStation(station.streamUrl, station.fallbackUrls);
  };

  const togglePlayback = async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  };

  const Icon = selectedStation.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Radio Stations"
        description="Choose your station and enjoy unlimited streaming"
      />

      {/* Station Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-3 gap-4 mb-8"
      >
        {stations.map((station, index) => {
          const StationIcon = station.icon;
          return (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Button
                variant={
                  selectedStation.id === station.id ? "default" : "outline"
                }
                className="h-auto p-4 flex flex-col items-center space-y-2 w-full"
                onClick={() => handleStationChange(station)}
                disabled={isLoading}
              >
                <StationIcon className="h-6 w-6" />
                <span className="font-semibold">{station.name}</span>
                <span className="text-xs opacity-75">
                  {station.listeners} listeners
                </span>
              </Button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Player */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${selectedStation.color} flex items-center justify-center`}
              >
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">
                  {selectedStation.name}
                </CardTitle>
                <p className="text-muted-foreground">
                  {selectedStation.description}
                </p>
                {error && (
                  <div className="mt-2">
                    <p className="text-red-500 text-sm">Error: {error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-1"
                      onClick={() => handleStationChange(selectedStation)}
                    >
                      Retry Connection
                    </Button>
                  </div>
                )}
              </div>
              <Badge variant="secondary">
                {selectedStation.listeners} listeners
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Now Playing</p>
                <p className="font-semibold text-lg">
                  {selectedStation.currentTrack}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="h-8 w-8"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      onValueChange={(value) => setVolume(value[0] / 100)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={togglePlayback}
                  className="rounded-full w-12 h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <AudioVisualizer
                audioContext={audioContextRef.current}
                analyser={analyserRef.current}
                isPlaying={isPlaying}
              />
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Status:{" "}
                {isLoading ? "Connecting..." : isPlaying ? "Live" : "Stopped"}
              </span>
              <span>Quality: 128 kbps</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Station Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid md:grid-cols-2 gap-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>About {selectedStation.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {selectedStation.about}
            </p>
            <div className="flex items-center space-x-2">
              <Badge>{selectedStation.genre}</Badge>
              <Badge variant="outline">
                {selectedStation.listeners} listeners
              </Badge>
              <Badge
                variant="outline"
                className={isPlaying ? "bg-green-100 text-green-800" : ""}
              >
                {isPlaying ? "Live" : "Offline"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedStation.schedule.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-muted last:border-0"
                >
                  <span className="text-sm font-medium">{item.time}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.show}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
