"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { postApi, communityApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadDropzone } from "@/utils/uploadthing"
import RichTextEditor from "@/components/editor/RichTextEditor"
import {
  Save,
  Eye,
  EyeOff,
  Send,
  X,
} from "lucide-react"
import { toast } from "sonner"

const DRAFT_STORAGE_KEY = "wolfdire_draft"

export default function WritePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedCommunity, setSelectedCommunity] = useState(null)
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [coverImage, setCoverImage] = useState(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState(null)
  const [isPreview, setIsPreview] = useState(false)
  const [scheduledPublishAt, setScheduledPublishAt] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [seoSlug, setSeoSlug] = useState("")
  const router = useRouter()

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (saved) {
        const draft = JSON.parse(saved)
        if (draft.title) setTitle(draft.title)
        if (draft.content) setContent(draft.content)
        if (draft.tags) setTags(draft.tags)
        if (draft.coverImage) setCoverImage(draft.coverImage)
        if (draft.selectedCommunity) setSelectedCommunity(draft.selectedCommunity)
        if (draft.scheduledPublishAt) setScheduledPublishAt(draft.scheduledPublishAt)
        if (draft.seoDescription) setSeoDescription(draft.seoDescription)
        if (draft.seoSlug) setSeoSlug(draft.seoSlug)
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  const { data: communitiesData } = useQuery({
    queryKey: ["communities-list"],
    queryFn: () => communityApi.list(0, 100),
  })

  const communities = communitiesData?.content || []

  const handleSaveDraft = () => {
    try {
      const draft = { title, content, tags, coverImage, selectedCommunity, scheduledPublishAt, seoDescription, seoSlug }
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
      toast?.success?.("Draft saved!")
    } catch {
      // fallback if toast not available
    }
  }

  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY)
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required")
      return
    }
    if (!selectedCommunity) {
      setError("Please select a community")
      return
    }

    setIsPublishing(true)
    setError(null)
    try {
      await postApi.create({
        title,
        content,
        communityId: String(selectedCommunity.id),
        communityName: selectedCommunity.name,
        type: "TEXT",
        hashtags: tags,
        mediaUrl: coverImage, // Use as cover
        scheduledPublishAt: scheduledPublishAt || null,
        seoDescription: seoDescription || null,
        seoSlug: seoSlug || null,
      })
      handleClearDraft()
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

  // Using dynamic editor now so static toolbar removed

  // Simple content renderer for preview
  const renderPreview = (text) => {
    if (!text) return <p className="text-muted-foreground italic">Nothing to preview yet...</p>
    return text.split("\n").map((line, i) => {
      if (!line.trim()) return <br key={i} />
      return <p key={i} className="mb-2 text-foreground leading-relaxed">{line}</p>
    })
  }

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
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleSaveDraft}>
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button
              variant={isPreview ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isPreview ? "Edit" : "Preview"}
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
            <UploadDropzone
              endpoint="postImage"
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  setCoverImage(res[0].url)
                  toast?.success?.("Cover image uploaded!")
                }
              }}
              onUploadError={(error) => {
                toast?.error?.(`Upload failed: ${error.message}`)
              }}
            />
          )}
        </div>

        {/* Title */}
        {isPreview ? (
          <h1 className="text-4xl font-bold text-foreground">
            {title || <span className="text-muted-foreground/50">Untitled</span>}
          </h1>
        ) : (
          <Input
            placeholder="Article title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-0 bg-transparent text-4xl font-bold placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0"
          />
        )}

        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}

        {/* Community selection */}
        {!isPreview && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Select
              value={selectedCommunity?.id?.toString()}
              onValueChange={(id) => {
                const comm = communities.find(c => c.id.toString() === id);
                setSelectedCommunity(comm);
              }}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a community to post in" />
              </SelectTrigger>
              <SelectContent>
                {communities.map((comm) => (
                  <SelectItem key={comm.id} value={comm.id.toString()}>
                    {comm.name}
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
        )}

        {/* Preview: show community + tags as badges */}
        {isPreview && selectedCommunity && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline">c/{selectedCommunity.name}</Badge>
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}

        {/* Dynamic Toolbar handled by RichTextEditor inside */}

        {/* Content Editor / Preview */}
        {isPreview ? (
          <div className="mt-4 min-h-[400px] prose prose-invert max-w-none text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <RichTextEditor content={content} onChange={setContent} />
        )}

        {/* Publishing Options */}
        {!isPreview && (
          <div className="mt-12 rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">Publishing Options</h3>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="schedule" className="text-foreground">Schedule Publication</Label>
                <p className="text-sm text-muted-foreground">Set a specific date and time to automatically publish this post (leave blank to publish immediately).</p>
                <Input
                  id="schedule"
                  type="datetime-local"
                  className="w-full sm:max-w-xs"
                  value={scheduledPublishAt}
                  onChange={(e) => setScheduledPublishAt(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDesc" className="text-foreground">SEO Description</Label>
                <p className="text-sm text-muted-foreground">Customize the meta description that appears in search engines.</p>
                <Textarea
                  id="seoDesc"
                  placeholder="A short summary of your article..."
                  className="w-full"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoSlug" className="text-foreground">Custom URL Slug</Label>
                <p className="text-sm text-muted-foreground">Customize the URL for this post (e.g. "my-awesome-post").</p>
                <Input
                  id="seoSlug"
                  placeholder="custom-url-slug"
                  className="w-full sm:max-w-md"
                  value={seoSlug}
                  onChange={(e) => setSeoSlug(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

