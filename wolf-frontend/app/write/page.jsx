"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { postApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  ImagePlus,
  LinkIcon,
  Heading1,
  Heading2,
  Save,
  Eye,
  Send,
  X,
} from "lucide-react"

const categories = ["Technology", "Design", "Productivity", "Business", "Lifestyle", "Science", "Health", "Finance"]

export default function WritePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [coverImage, setCoverImage] = useState(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required")
      return
    }
    setIsPublishing(true)
    setError(null)
    try {
      await postApi.create({
        title,
        content,
        subredditName: category || "General",
        type: "TEXT",
        hashtags: tags,
      })
      router.push("/feed")
    } catch (err) {
      setError(err.message || "Failed to publish post")
    } finally {
      setIsPublishing(false)
    }
  }

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() && tags.length < 5) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const toolbarButtons = [
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
    { icon: Underline, label: "Underline" },
    { divider: true },
    { icon: Heading1, label: "Heading 1" },
    { icon: Heading2, label: "Heading 2" },
    { divider: true },
    { icon: List, label: "Bullet List" },
    { icon: ListOrdered, label: "Numbered List" },
    { icon: Quote, label: "Quote" },
    { icon: Code, label: "Code" },
    { divider: true },
    { icon: LinkIcon, label: "Link" },
    { icon: ImagePlus, label: "Image" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </Link>
            <span className="text-sm text-muted-foreground">Draft in WolfDire</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button size="sm" className="gap-2" onClick={handlePublish} disabled={isPublishing}>
              <Send className="h-4 w-4" />
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Cover Image */}
        <div className="mb-8">
          {coverImage ? (
            <div className="relative aspect-[2/1] overflow-hidden rounded-lg">
              <img src={coverImage || "/placeholder.svg"} alt="Cover" className="h-full w-full object-cover" />
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-4 top-4"
                onClick={() => setCoverImage(null)}
              >
                Change Cover
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setCoverImage("/blog-cover.png")}
              className="flex aspect-[2/1] w-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary hover:bg-muted"
            >
              <div className="text-center">
                <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium text-muted-foreground">Add a cover image</p>
                <p className="text-xs text-muted-foreground">Recommended: 1600 x 840</p>
              </div>
            </button>
          )}
        </div>

        {/* Title */}
        <Input
          placeholder="Article title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-0 bg-transparent text-4xl font-bold placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0"
        />

        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}

        {/* Category & Tags */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-1 flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button onClick={() => handleRemoveTag(tag)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {tags.length < 5 && (
              <Input
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="h-7 w-24 border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
              />
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-8 flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-2">
          {toolbarButtons.map((item, index) =>
            item.divider ? (
              <div key={index} className="mx-1 h-6 w-px bg-border" />
            ) : (
              <Button key={index} variant="ghost" size="sm" className="h-8 w-8 p-0">
                <item.icon className="h-4 w-4" />
                <span className="sr-only">{item.label}</span>
              </Button>
            ),
          )}
        </div>

        {/* Content Editor */}
        <Textarea
          placeholder="Tell your story..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-4 min-h-[400px] resize-none border-0 bg-transparent text-lg leading-relaxed placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0"
        />

        {/* Publishing Options */}
        <div className="mt-12 rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">Publishing Options</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Schedule Publication</Label>
                <p className="text-sm text-muted-foreground">Set a specific date and time to publish</p>
              </div>
              <Button variant="outline" size="sm" className="bg-transparent">
                Set Schedule
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Community</Label>
                <p className="text-sm text-muted-foreground">Post to a specific community</p>
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select community" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Tech Enthusiasts</SelectItem>
                  <SelectItem value="writers">Creative Writers</SelectItem>
                  <SelectItem value="startup">Startup Founders</SelectItem>
                  <SelectItem value="design">Design Hub</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">SEO Settings</Label>
                <p className="text-sm text-muted-foreground">Customize meta description and URL</p>
              </div>
              <Button variant="outline" size="sm" className="bg-transparent">
                Edit SEO
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
