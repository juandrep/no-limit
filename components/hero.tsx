"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    image: "/img/slide/slide1.png",
    title: "No Limit Radio",
    subtitle: "Your Music, No Limits",
    description: "Stream the best Hip-Hop, R&B, and Rock/Pop music 24/7",
  },
  {
    image: "/img/slide/slide2.png",
    title: "Hip-Hop Beats",
    subtitle: "Feel the Rhythm",
    description: "The hottest hip-hop tracks from underground to mainstream",
  },
  {
    image: "/img/slide/slide3.png",
    title: "Smooth R&B",
    subtitle: "Soul & Rhythm",
    description: "Classic and contemporary R&B that moves your soul",
  },
  {
    image: "/img/slide/slide4.png",
    title: "Rock & Pop",
    subtitle: "Energy & Melody",
    description: "From rock anthems to pop hits that get you moving",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative h-full flex items-center justify-center text-center text-white">
            <div className="max-w-4xl px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                {slide.title}
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                {slide.subtitle}
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {slide.description}
              </p>
              <Button size="lg" className="text-lg px-8 py-3">
                Start Listening
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}
