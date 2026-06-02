"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronRight, Briefcase, Code, Terminal, GitPullRequest, Eye, Server, Database, Shield, Smartphone } from "lucide-react"

export default function CareersPage() {
  const [activeFilter, setActiveFilter] = useState("All")

  const roles = [
    {
      title: "Senior Data Scientist",
      department: "Data & ML",
      type: "Open Source",
      location: "Remote",
      description: "Help us build the next generation of data pipelines and predictive models to improve feed ranking and content discovery.",
      skills: ["Python", "PyTorch", "Spark", "Data Pipelines"],
      icon: Terminal,
    },
    {
      title: "ML Researcher",
      department: "Research & Development",
      type: "Open Source",
      location: "Remote",
      description: "Push the boundaries of NLP and GenAI. Work on integrating foundational models to empower creators with better writing tools.",
      skills: ["LLMs", "Hugging Face", "NLP", "Fine-Tuning"],
      icon: Briefcase,
    },
    {
      title: "Frontend Developer",
      department: "Engineering",
      type: "Open Source",
      location: "Remote",
      description: "Create pixel-perfect, highly responsive user interfaces. You will be instrumental in building the dynamic editor and feed.",
      skills: ["React 18", "Next.js 14+", "Tailwind CSS", "TypeScript"],
      icon: Code,
    },
    {
      title: "Spring Boot Backend Developer",
      department: "Engineering",
      type: "Open Source",
      location: "Remote",
      description: "Architect and scale our microservices. Build resilient APIs that handle thousands of concurrent social interactions.",
      skills: ["Java 21", "Spring Boot 3", "PostgreSQL", "Kafka"],
      icon: GitPullRequest,
    },
    {
      title: "Computer Vision Engineer",
      department: "Research & Development",
      type: "Open Source",
      location: "Remote",
      description: "Build automated moderation systems for images and multimodal AI integrations to improve feed recommendations.",
      skills: ["OpenCV", "TensorFlow", "Multimodal AI", "Python"],
      icon: Eye,
    },
    {
      title: "DevOps / MLOps Engineer",
      department: "Infrastructure",
      type: "Open Source",
      location: "Remote",
      description: "Manage our complex microservices infrastructure and build deployment pipelines for our machine learning models.",
      skills: ["Kubernetes", "Docker", "CI/CD", "Model Deployment"],
      icon: Server,
    },
    {
      title: "Data Engineer",
      department: "Data & ML",
      type: "Open Source",
      location: "Remote",
      description: "Build robust ETL pipelines and manage event streams to ensure our ML researchers have clean data to train on.",
      skills: ["Kafka", "Data Lakes", "SQL", "Apache Spark"],
      icon: Database,
    },
    {
      title: "Security / Cybersecurity Engineer",
      department: "Security",
      type: "Open Source",
      location: "Remote",
      description: "Audit our microservices, secure API Gateways, and ensure user PII is encrypted and protected from vulnerabilities.",
      skills: ["OAuth2", "API Security", "Penetration Testing"],
      icon: Shield,
    },
    {
      title: "Mobile Developer",
      department: "Engineering",
      type: "Open Source",
      location: "Remote",
      description: "Bring WolfDire to mobile devices by building a fast, cross-platform app consuming our Spring Boot APIs.",
      skills: ["React Native / Flutter", "Mobile UI", "API Integration"],
      icon: Smartphone,
    },
  ]

  const departments = ["All", ...new Set(roles.map((role) => role.department))]

  const filteredRoles = activeFilter === "All" ? roles : roles.filter((role) => role.department === activeFilter)

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#0A0A0A] text-[#1A1A1A] dark:text-[#E5E5E5] selection:bg-black/10 dark:selection:bg-white/10">
      {/* Minimalist Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight text-black dark:text-white leading-[1.1] mb-8">
            Build the future of <br className="hidden sm:block" /> intelligent social media.
          </h1>
          <p className="text-xl sm:text-2xl font-light text-black/60 dark:text-white/60 leading-relaxed max-w-2xl mb-12">
            We're looking for world-class open source contributors to help us research, design, and deploy the next generation of GenAI-powered content creation.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="#roles" className="flex items-center gap-2 border-b border-black/20 dark:border-white/20 pb-1 hover:border-black dark:hover:border-white transition-colors">
              View open roles <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="https://github.com/WolfDire" target="_blank" className="flex items-center gap-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
              Visit GitHub
            </Link>
          </div>
        </div>
      </section>

      <div className="border-t border-black/10 dark:border-white/10" id="roles"></div>

      {/* Roles Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16">
          
          {/* Minimalist Filter Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-black/40 dark:text-white/40 mb-6">Filter by Department</h3>
            <div className="flex flex-col gap-3">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveFilter(dept)}
                  className={`text-left text-sm transition-colors ${
                    activeFilter === dept 
                      ? "text-black dark:text-white font-medium" 
                      : "text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80"
                  }`}
                >
                  {dept} <span className="text-black/30 dark:text-white/30 ml-1">({dept === "All" ? roles.length : roles.filter(r => r.department === dept).length})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Roles List */}
          <div className="flex-1">
            <h2 className="text-3xl font-semibold text-black dark:text-white mb-12 tracking-tight">Open Roles</h2>
            
            <div className="flex flex-col border-t border-black/10 dark:border-white/10">
              {filteredRoles.length === 0 ? (
                <div className="py-12 text-black/50 dark:text-white/50 font-light">No open roles in this department currently.</div>
              ) : (
                filteredRoles.map((role) => (
                  <Link 
                    key={role.title} 
                    href="/contact"
                    className="group block py-8 border-b border-black/10 dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] -mx-6 px-6 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-medium text-black dark:text-white group-hover:underline underline-offset-4 decoration-1 mb-2">
                          {role.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-black/50 dark:text-white/50 font-light">
                          <span>{role.department}</span>
                          <span className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20"></span>
                          <span>{role.location}</span>
                          <span className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20"></span>
                          <span>{role.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors sm:translate-x-0 sm:opacity-100 opacity-50 sm:group-hover:translate-x-2">
                        Apply <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="mt-4 text-sm font-light text-black/60 dark:text-white/60 leading-relaxed max-w-2xl">
                      {role.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {role.skills.map((skill) => (
                        <span key={skill} className="text-xs px-2 py-1 bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 rounded-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Minimal Footer CTA */}
      <section className="border-t border-black/10 dark:border-white/10 py-24 px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-medium text-black dark:text-white tracking-tight mb-6">Don't see a fit?</h2>
        <p className="text-black/60 dark:text-white/60 font-light max-w-lg mx-auto mb-8">
          We are always looking for exceptional engineers, researchers, and designers. If you believe you can contribute to our mission, we'd love to hear from you.
        </p>
        <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-medium border-b border-black/20 dark:border-white/20 pb-1 hover:border-black dark:hover:border-white transition-colors">
          Send a general application <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  )
}
