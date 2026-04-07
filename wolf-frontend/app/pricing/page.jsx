"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, X, Zap, Star, Crown, HelpCircle } from "lucide-react"

const plans = [
  {
    name: "Free",
    description: "Perfect for casual readers and hobby writers",
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Star,
    features: [
      { name: "Unlimited reading", included: true },
      { name: "3 articles per month", included: true },
      { name: "Basic analytics", included: true },
      { name: "Community access", included: true },
      { name: "Email support", included: true },
      { name: "Custom domain", included: false },
      { name: "Ad-free experience", included: false },
      { name: "Priority support", included: false },
      { name: "Partner Program", included: false },
      { name: "API access", included: false },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    description: "For serious writers looking to grow their audience",
    monthlyPrice: 12,
    yearlyPrice: 99,
    icon: Zap,
    features: [
      { name: "Unlimited reading", included: true },
      { name: "Unlimited articles", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Community access", included: true },
      { name: "Priority email support", included: true },
      { name: "Custom domain", included: true },
      { name: "Ad-free experience", included: true },
      { name: "Priority support", included: true },
      { name: "Partner Program (70% revenue)", included: true },
      { name: "API access", included: false },
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Business",
    description: "For teams and publications with advanced needs",
    monthlyPrice: 49,
    yearlyPrice: 399,
    icon: Crown,
    features: [
      { name: "Unlimited reading", included: true },
      { name: "Unlimited articles", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Community access", included: true },
      { name: "Dedicated support", included: true },
      { name: "Custom domain", included: true },
      { name: "Ad-free experience", included: true },
      { name: "Priority support", included: true },
      { name: "Partner Program (85% revenue)", included: true },
      { name: "API access", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

const faqs = [
  {
    question: "What is the Partner Program?",
    answer:
      "The Partner Program allows authors to earn money from their content. You'll receive a share of the revenue generated from readers who engage with your articles. Pro members receive 70% of their earned revenue, while Business members receive 85%.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to your paid features until the end of your billing period.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! Pro and Business plans come with a 14-day free trial. No credit card required to start your trial.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual Business plans.",
  },
  {
    question: "Can I switch between plans?",
    answer:
      "You can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, the change will take effect at the start of your next billing cycle.",
  },
  {
    question: "What's included in the custom domain feature?",
    answer:
      "With a custom domain, you can have your blog accessible at your own domain (e.g., blog.yourdomain.com). We handle all the technical setup including SSL certificates.",
  },
]

const comparisons = [
  { feature: "Articles per month", free: "3", pro: "Unlimited", business: "Unlimited" },
  { feature: "Analytics", free: "Basic", pro: "Advanced", business: "Enterprise" },
  { feature: "Storage", free: "500MB", pro: "10GB", business: "100GB" },
  { feature: "Team members", free: "1", pro: "3", business: "Unlimited" },
  { feature: "API requests/month", free: "-", pro: "-", business: "100,000" },
  { feature: "Revenue share", free: "-", pro: "70%", business: "85%" },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4" variant="secondary">
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Choose the Plan That
              <span className="text-primary"> Fits Your Needs</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
              Start for free, upgrade when you're ready. All plans include a 14-day free trial.
            </p>

            {/* Billing Toggle */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <span className={`text-sm ${!isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className={`text-sm ${isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                Yearly
                <Badge className="ml-2" variant="secondary">
                  Save 20%
                </Badge>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col border-border ${plan.popular ? "border-primary shadow-lg shadow-primary/10" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gap-1">
                      <Zap className="h-3 w-3" /> Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <plan.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-muted-foreground">/{isYearly ? "year" : "month"}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-primary shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground shrink-0" />
                        )}
                        <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                    <Link href="/signup">{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="border-y border-border bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Compare Plans</h2>
            <p className="mt-2 text-muted-foreground">See what's included in each plan</p>
          </div>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 pr-6 text-left text-sm font-semibold text-foreground">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Free</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-primary">Pro</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisons.map((row) => (
                  <tr key={row.feature}>
                    <td className="py-4 pr-6 text-sm text-foreground">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">{row.free}</td>
                    <td className="px-6 py-4 text-center text-sm text-foreground font-medium">{row.pro}</td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">{row.business}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
            <p className="mt-2 text-muted-foreground">Everything you need to know about our pricing</p>
          </div>

          <Accordion type="single" collapsible className="mt-12">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="text-left text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-primary p-8 sm:p-12 lg:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent" />
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold text-primary-foreground sm:text-4xl">
                Ready to Start Writing?
              </h2>
              <p className="mt-4 text-pretty text-lg text-primary-foreground/80 leading-relaxed">
                Join thousands of writers who are already sharing their stories and earning from their expertise.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/signup">Start Your Free Trial</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                  asChild
                >
                  <Link href="/contact">Talk to Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
