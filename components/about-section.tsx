import { Card, CardContent } from "@/components/ui/card"
import { Music, Users, Radio } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About No Limit Radio</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're passionate about bringing you the best music experience with no limits. Our carefully curated stations
            deliver the hottest tracks across Hip-Hop, R&B, and Rock/Pop genres.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Music className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Quality Music</h3>
              <p className="text-muted-foreground">
                High-quality streaming with crystal clear sound for the best listening experience.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Radio className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">24/7 Streaming</h3>
              <p className="text-muted-foreground">
                Non-stop music streaming across all our stations, available anytime, anywhere.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">
                Join thousands of music lovers who trust No Limit Radio for their daily soundtrack.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
