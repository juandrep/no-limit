"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Radio, Users, Award, Clock, Globe } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="About No Limit Radio"
        description="Your premier destination for unlimited music streaming across Hip-Hop, R&B, and Rock/Pop genres."
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-16"
      >
        <div className="relative h-64 rounded-lg overflow-hidden mb-8">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/img/slide/slide1.png)" }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative h-full flex items-center justify-center text-center text-white">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Music Without Boundaries
              </h2>
              <p className="text-lg">
                Since 2020, bringing you the best in digital radio
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid md:grid-cols-4 gap-6 mb-16"
      >
        {[
          { icon: Users, value: "50K+", label: "Active Listeners" },
          { icon: Music, value: "10K+", label: "Songs in Library" },
          { icon: Radio, value: "3", label: "Unique Stations" },
          { icon: Clock, value: "24/7", label: "Live Streaming" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
          >
            <Card className="text-center">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Our Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid md:grid-cols-2 gap-12 mb-16"
      >
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              No Limit Radio was born from a passion for music and the belief
              that great music should be accessible to everyone, everywhere.
              Founded in 2020, we started as a small online radio station with a
              big dream.
            </p>
            <p>
              Today, we've grown into a premier digital radio platform serving
              thousands of music lovers worldwide. Our carefully curated
              stations deliver the best in Hip-Hop, R&B, and Rock/Pop, ensuring
              there's always something for every mood and moment.
            </p>
            <p>
              We believe music has no limits, and neither should your listening
              experience. That's why we're committed to providing high-quality,
              uninterrupted streaming 24/7.
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  <Music className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Quality First</h3>
                    <p className="text-sm text-muted-foreground">
                      Delivering crystal-clear audio quality and carefully
                      curated playlists.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  <Globe className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Global Reach</h3>
                    <p className="text-sm text-muted-foreground">
                      Connecting music lovers from around the world through
                      shared experiences.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Innovation</h3>
                    <p className="text-sm text-muted-foreground">
                      Constantly evolving our platform to enhance your listening
                      experience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Team */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
        <p className="text-muted-foreground mb-8">
          The passionate individuals behind No Limit Radio
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="grid md:grid-cols-3 gap-8 mb-16"
      >
        {[
          {
            name: "Alex Johnson",
            role: "Founder & CEO",
            bio: "Music enthusiast with 15+ years in digital media",
            image: "/placeholder.svg?height=200&width=200",
          },
          {
            name: "Sarah Chen",
            role: "Music Director",
            bio: "Former radio DJ with expertise in music curation",
            image: "/placeholder.svg?height=200&width=200",
          },
          {
            name: "Mike Rodriguez",
            role: "Technical Director",
            bio: "Audio engineer ensuring the best streaming quality",
            image: "/placeholder.svg?height=200&width=200",
          },
        ].map((member, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 overflow-hidden">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
              <Badge variant="secondary" className="mb-3">
                {member.role}
              </Badge>
              <p className="text-sm text-muted-foreground">{member.bio}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mb-16"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Authenticity</h3>
                <p className="text-muted-foreground">
                  We stay true to the music and the artists, bringing you
                  authentic sounds without compromise.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Community</h3>
                <p className="text-muted-foreground">
                  Building a global community of music lovers who share the same
                  passion for great music.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  Continuously improving our platform with the latest technology
                  and user feedback.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Accessibility</h3>
                <p className="text-muted-foreground">
                  Making great music accessible to everyone, regardless of
                  location or device.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
