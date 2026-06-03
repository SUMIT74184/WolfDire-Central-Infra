"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { communityApi } from "@/lib/api-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { UploadDropzone } from "@/utils/uploadthing"

export function EditCommunityModal({ isOpen, onClose, community }) {
  const queryClient = useQueryClient()
  const [description, setDescription] = useState(community?.description || "")
  const [imageUrl, setImageUrl] = useState(community?.imageUrl || "")
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(community?.backgroundImageUrl || "")

  const updateMutation = useMutation({
    mutationFn: (data) => communityApi.update(community.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", community.id] })
      onClose()
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate({ description, imageUrl, backgroundImageUrl })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Community</DialogTitle>
          <DialogDescription>
            Update your community's details, profile picture, and background image.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Background Image (Cover)</Label>
            {backgroundImageUrl ? (
              <div className="relative h-32 w-full overflow-hidden rounded-md border">
                <img src={backgroundImageUrl} alt="Background" className="h-full w-full object-cover" />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={() => setBackgroundImageUrl("")}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) setBackgroundImageUrl(res[0].url)
                }}
                onUploadError={(error) => alert(`ERROR! ${error.message}`)}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Profile Picture (Avatar)</Label>
            {imageUrl ? (
              <div className="relative h-24 w-24 overflow-hidden rounded-full border">
                <img src={imageUrl} alt="Profile" className="h-full w-full object-cover" />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm" 
                  className="absolute bottom-0 left-0 right-0 h-6 text-xs rounded-none"
                  onClick={() => setImageUrl("")}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) setImageUrl(res[0].url)
                }}
                onUploadError={(error) => alert(`ERROR! ${error.message}`)}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="What is this community about?"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
