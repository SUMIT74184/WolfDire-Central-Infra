"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Zap } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const llmModels = [
  {
    id: "claude-opus",
    name: "Claude Opus",
    provider: "Anthropic",
    description: "Most capable, best for complex tasks",
    status: "active",
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    provider: "Anthropic",
    description: "Balanced performance and speed",
    status: "available",
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    description: "Advanced reasoning and code generation",
    status: "available",
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    description: "Faster processing with lower cost",
    status: "available",
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    description: "Multimodal AI capabilities",
    status: "available",
  },
  {
    id: "llama-2",
    name: "Llama 2",
    provider: "Meta",
    description: "Open-source, self-hosted option",
    status: "available",
  },
]

export function LLMModelSelector() {
  const [selectedModel, setSelectedModel] = useState("claude-opus")
  const [saved, setSaved] = useState(false)

  const currentModel = llmModels.find((m) => m.id === selectedModel)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    console.log("Selected LLM Model:", selectedModel)
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              LLM Model Configuration
            </CardTitle>
            <CardDescription>Select and configure your AI model for code generation</CardDescription>
          </div>
          <Badge variant={currentModel?.status === "active" ? "default" : "secondary"}>
            {currentModel?.status === "active" ? "Active" : "Available"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Select LLM Model</label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {llmModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-muted-foreground text-xs">({model.provider})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Model Details */}
        {currentModel && (
          <div className="rounded-lg bg-muted/50 p-4 space-y-3">
            <div>
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                {currentModel.status === "active" && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {currentModel.name}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">{currentModel.provider}</p>
            </div>
            <p className="text-sm text-foreground">{currentModel.description}</p>
            <div className="flex items-center gap-2 pt-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Status: {currentModel.status}</span>
            </div>
          </div>
        )}

        {/* Model Comparison */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Available Models</label>
          <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
            {llmModels.map((model) => (
              <div
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                  selectedModel === model.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-foreground text-sm">{model.name}</h5>
                    <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
                  </div>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {model.provider}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full"
          disabled={!selectedModel}
        >
          {saved ? "Model Saved Successfully!" : "Save Model Configuration"}
        </Button>

        {/* API Key Input */}
        <div className="space-y-3 border-t border-border pt-6">
          <label className="text-sm font-medium text-foreground">API Configuration</label>
          <input
            type="password"
            placeholder="Enter API key (if required)"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
          />
          <p className="text-xs text-muted-foreground">
            Store API keys securely. They will not be displayed after saving.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
