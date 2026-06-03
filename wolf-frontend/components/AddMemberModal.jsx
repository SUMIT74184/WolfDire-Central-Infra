"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { communityApi } from "@/lib/api-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function AddMemberModal({ isOpen, onClose, communityId }) {
  const queryClient = useQueryClient()
  const [targetUserId, setTargetUserId] = useState("")
  const [role, setRole] = useState("MEMBER")

  const addMemberMutation = useMutation({
    mutationFn: (data) => communityApi.addMember(communityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", communityId] })
      onClose()
      setTargetUserId("")
      setRole("MEMBER")
    },
    onError: (error) => {
      alert(`Failed to add member: ${error.message}`)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!targetUserId.trim()) return
    addMemberMutation.mutate({ targetUserId: targetUserId.trim(), role })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Enter the User ID of the person you want to add to this community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              placeholder="e.g. 123e4567-e89b-12d3..."
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="MEMBER">Member</option>
              <option value="MODERATOR">Moderator</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={addMemberMutation.isPending || !targetUserId.trim()}>
              {addMemberMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
