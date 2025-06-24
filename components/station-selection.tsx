import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music2, Heart, Zap, Radio } from "lucide-react"

const stations = [
  {
    id: "hip-hop",
    name: "Hip-Hop",
    description: "The hottest hip-hop tracks from underground to mainstream",
    icon: Music2,
    color: "from-orange-500 to-red-500",
    listeners: "2,847",
  },
  {
    id: "rnb",
    name: "R&B",
    description: "Classic and contemporary R&B that moves your soul",
    icon: Heart,
    color: "from-purple-500 to-pink-500",
    listeners: "1,923",
  },
  {
    id: "rock-pop",
    name: "Rock/Pop",
    description: "From rock anthems to pop hits that get you moving",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    listeners: "3,156",
  },
]

export function StationSelection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Station</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select from our three carefully curated stations, each delivering the best music in their genre with
            high-quality streaming.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stations.map((station) => {
            const Icon = station.icon
            return (
              <Card key={station.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${station.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{station.name}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Radio className="h-4 w-4" />
                    <span>{station.listeners} listeners</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{station.description}</p>
                  <Link href="/stations">
                    <Button className="w-full group-hover:bg-primary/90 transition-colors">Listen Live Now</Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <Radio className="h-4 w-4" />
            <span>High-quality 128kbps streaming • 24/7 live radio</span>
          </div>
        </div>
      </div>
    </section>
  )
}
