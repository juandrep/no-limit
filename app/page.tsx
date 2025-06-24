import { Hero } from "@/components/hero"
import { AboutSection } from "@/components/about-section"
import { StationSelection } from "@/components/station-selection"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <AboutSection />
      <StationSelection />
    </div>
  )
}
