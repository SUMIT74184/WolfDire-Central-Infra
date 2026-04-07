"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Zap, Globe, Heart, ArrowRight, Trophy } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const stats = [
    { label: "Active Members", value: "50K+", icon: Users },
    { label: "Posts Created", value: "500K+", icon: Heart },
    { label: "Communities", value: "500+", icon: Globe },
    { label: "Countries", value: "150+", icon: Zap },
  ]

  const values = [
    {
      title: "Community First",
      description: "We believe in the power of communities to drive meaningful conversations and connections.",
      icon: Users,
    },
    {
      title: "Free Speech",
      description: "A platform where diverse voices can be heard, ideas can be shared, and conversations can flourish.",
      icon: Globe,
    },
    {
      title: "Quality Content",
      description: "We empower creators to produce high-quality content and engage with their audience.",
      icon: Trophy,
    },
    {
      title: "User Privacy",
      description: "Your data is yours. We respect your privacy and never sell your information.",
      icon: Heart,
    },
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/female-engineer-working.png",
      bio: "Passionate about building communities and fostering meaningful conversations.",
    },
    {
      name: "Mike Chen",
      role: "CTO",
      image: "/male-developer.png",
      bio: "Full-stack engineer with 10+ years of experience in scaling web platforms.",
    },
    {
      name: "Emma Davis",
      role: "Head of Community",
      image: "/woman-designer.png",
      bio: "Community manager dedicated to creating safe and inclusive spaces.",
    },
    {
      name: "Alex Rivera",
      role: "Lead Designer",
      image: "/professional-interior-designer.png",
      bio: "UX/UI designer focused on creating intuitive and beautiful interfaces.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-card py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              About WolfDire
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
              A community-driven platform where ideas thrive, voices are heard, and meaningful connections are made.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                WolfDire is built on the belief that everyone deserves a platform to share their voice and connect with
                like-minded individuals. We're creating a space where:
              </p>
              <ul className="space-y-3">
                {[
                  "Communities thrive and grow organically",
                  "Quality discussions and content flourish",
                  "Users have control over their data and experience",
                  "Everyone feels safe and respected",
                ].map((point, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground">
                    <span className="text-primary font-bold">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden bg-muted">
              <img
                src="/vibrant-tech-community.png"
                alt="Community"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex rounded-lg bg-primary/10 p-3 mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Values</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {values.map((value) => (
              <Card key={value.title} className="border-border">
                <CardHeader>
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="border-t border-border bg-card py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Team</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {team.map((member) => (
              <Card key={member.name} className="border-border overflow-hidden">
                <div className="h-48 overflow-hidden bg-muted">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <p className="text-sm text-primary font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Join the WolfDire Community</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you want to share your voice, discover new perspectives, or build a community, WolfDire is the
            place to be.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
