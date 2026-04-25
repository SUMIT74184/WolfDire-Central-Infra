"use client"

import { useState } from "react"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, Loader2, MessageSquare } from "lucide-react"
import { commentApi } from "@/lib/api-client"

function CommentItem({ comment, postId, onReplySuccess, activeReplyId, setActiveReplyId }) {
  const queryClient = useQueryClient()
  const isReplying = activeReplyId === comment.id
  const [replyText, setReplyText] = useState("")

  const upvoteMutation = useMutation({
    mutationFn: (id) => commentApi.upvote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', postId] })
  })

  const createReplyMutation = useMutation({
    mutationFn: (content) => commentApi.create({
      postId,
      content,
      parentCommentId: comment.id
    }),
    onSuccess: () => {
      setActiveReplyId(null)
      setReplyText("")
      onReplySuccess()
    }
  })

  const handleReplySubmit = () => {
    if (!replyText.trim()) return
    createReplyMutation.mutate(replyText.trim())
  }

  return (
    <div className="flex gap-4">
      <Avatar className="h-10 w-10">
        <AvatarFallback>{comment.username?.[0] || '?'}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{comment.username}</span>
          <span className="text-sm text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="mt-1 text-foreground">{comment.content}</p>
        <div className="mt-2 flex items-center gap-4">
          <button
            onClick={() => upvoteMutation.mutate(comment.id)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ThumbsUp className="h-4 w-4" />
            {comment.score || 0}
          </button>
          <button 
            onClick={() => setActiveReplyId(isReplying ? null : comment.id)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <MessageSquare className="h-4 w-4" />
            Reply
          </button>
        </div>

        {isReplying && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2">
            <Textarea
              placeholder={`Reply to ${comment.username}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setActiveReplyId(null)}>Cancel</Button>
              <Button size="sm" disabled={!replyText.trim() || createReplyMutation.isPending} onClick={handleReplySubmit}>
                {createReplyMutation.isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                Post Reply
              </Button>
            </div>
          </div>
        )}

        {/* Recursive Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-6 space-y-6 pl-6 border-l-2 border-border/50">
            {comment.replies.map(reply => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                postId={postId}
                onReplySuccess={onReplySuccess}
                activeReplyId={activeReplyId}
                setActiveReplyId={setActiveReplyId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CommentSection({ postId }) {
  const [commentText, setCommentText] = useState("")
  const [activeReplyId, setActiveReplyId] = useState(null)
  const queryClient = useQueryClient()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam = 0 }) => commentApi.getPostComments(postId, pageParam, 50),
    getNextPageParam: (lastPage, allPages) => {
      return !lastPage.last ? allPages.length : undefined
    },
    enabled: !!postId,
  })

  const comments = data ? data.pages.flatMap(page => page.content) : []
  const totalElements = data?.pages[0]?.totalElements || 0

  const createCommentMutation = useMutation({
    mutationFn: (newComment) => commentApi.create(newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      setCommentText("")
    }
  })

  const handlePostComment = () => {
    if (!commentText.trim()) return
    createCommentMutation.mutate({
      postId,
      content: commentText.trim()
    })
  }

  const handleReplySuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['comments', postId] })
  }

  return (
    <div className="mt-12 bg-card rounded-xl p-6 border border-border shadow-sm">
      <h2 className="text-2xl font-bold text-foreground">Comments ({totalElements})</h2>

      {/* Main Comment Form */}
      <div className="mt-6 flex gap-4">
        <Avatar className="h-10 w-10 shadow-sm">
          <AvatarFallback className="bg-primary/10 text-primary">U</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Share your thoughts..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[100px] border-border focus:ring-primary"
          />
          <div className="mt-2 flex justify-end">
            <Button disabled={!commentText.trim() || createCommentMutation.isPending} onClick={handlePostComment} className="rounded-full px-6">
              {createCommentMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Post Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="mt-10 space-y-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              postId={postId}
              onReplySuccess={handleReplySuccess}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
            />
          ))
        )}
        
        {comments.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-accent/5 rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>

      {/* Load More Option */}
      {hasNextPage && comments.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="rounded-full">
            {isFetchingNextPage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Load More Comments"}
          </Button>
        </div>
      )}
    </div>
  )
}
