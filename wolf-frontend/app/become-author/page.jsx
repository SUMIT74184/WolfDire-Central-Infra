"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PenSquare, DollarSign, Users, TrendingUp, Award, CheckCircle, ArrowRight, Star } from "lucide-react"

const benefits = [
  {
    icon: DollarSign,
    title: "Earn From Your Writing",
    description: "Get paid for every reader who engages with your content through our Partner Program.",
  },
  {
    icon: Users,
    title: "Build Your Audience",
    description: "Reach millions of readers actively looking for quality content in your niche.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Brand",
    description: "Establish yourself as a thought leader and expert in your field.",
  },
  {
    icon: Award,
    title: "Get Featured",
    description: "Top authors get featured on our homepage and curated collections.",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Tech Writer",
    avatar: "/woman-developer.png",
    earnings: "$4,200",
    quote: "WolfDire has transformed my writing career. I've built an audience of 50K+ readers.",
  },
  {
    name: "Marcus Johnson",
    role: "Productivity Coach",
    avatar: "/professional-man.png",
    earnings: "$3,800",
    quote: "The community here is incredible. My articles consistently reach thousands.",
  },
  {
    name: "Emma Williams",
    role: "Design Educator",
    avatar: "/woman-designer.png",
    earnings: "$5,100",
    quote: "I've earned more from WolfDire in 6 months than years of freelancing.",
  },
]

const expertiseAreas = [
  "Technology",
  "Design",
  "Business",
  "Productivity",
  "Health & Wellness",
  "Science",
  "Finance",
  "Education",
  "Lifestyle",
  "Other",
]

export default function BecomeAuthorPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    expertise: "",
    bio: "",
    sampleWork: "",
    agreeToTerms: false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setStep(3)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4" variant="secondary">
              <Star className="mr-1 h-3 w-3" /> Join 50,000+ Authors
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Turn Your Knowledge Into
              <span className="text-primary"> Income</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
              Join thousands of writers earning from their expertise. Share your insights, build your audience, and get
              paid for your passion.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" onClick={() => setStep(2)}>
                Apply to Write
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent" asChild>
                <Link href="/explore">See Author Stories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-foreground">Why Create on WolfDire?</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="border-border text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-foreground">What Authors Are Saying</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-muted-foreground italic">{`"${testimonial.quote}"`}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">{testimonial.earnings}/month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 sm:py-20" id="apply">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {step === 1 && (
            <Card className="border-border">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <PenSquare className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Ready to Start Writing?</CardTitle>
                <CardDescription>
                  Apply to become a WolfDire creator and start building your community.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button size="lg" onClick={() => setStep(2)}>
                  Start Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Author Application</CardTitle>
                <CardDescription>Tell us about yourself and your writing experience.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website/Portfolio (optional)</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expertise">Area of Expertise</Label>
                    <Select
                      value={formData.expertise}
                      onValueChange={(value) => setFormData({ ...formData, expertise: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your expertise" />
                      </SelectTrigger>
                      <SelectContent>
                        {expertiseAreas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Short Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself and your writing experience..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sampleWork">Link to Sample Work</Label>
                    <Input
                      id="sampleWork"
                      type="url"
                      placeholder="https://"
                      value={formData.sampleWork}
                      onChange={(e) => setFormData({ ...formData, sampleWork: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked })}
                    />
                    <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Author Terms
                      </Link>{" "}
                      and{" "}
                      <Link href="/guidelines" className="text-primary hover:underline">
                        Content Guidelines
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={!formData.agreeToTerms}>
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="border-border">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Application Submitted!</h2>
                <p className="mt-2 text-muted-foreground">
                  {"We'll review your application and get back to you within 3-5 business days."}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button asChild>
                    <Link href="/explore">Explore Stories</Link>
                  </Button>
                  <Button variant="outline" className="bg-transparent" asChild>
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
