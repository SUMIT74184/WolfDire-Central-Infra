"use client"

import { useState } from "react"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, Loader2 } from "lucide-react"
import { commentApi } from "@/lib/api-client"

export default function CommentSection({ postId }) {
  const [commentText, setCommentText] = useState("")
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
      // Return next page number if not last
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

  const upvoteMutation = useMutation({
    mutationFn: (commentId) => commentApi.upvote(commentId),
    onMutate: async (commentId) => {
      // Optimistic upvote update
      await queryClient.cancelQueries({ queryKey: ['comments', postId] })
      const previousComments = queryClient.getQueryData(['comments', postId])
      
      queryClient.setQueryData(['comments', postId], old => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            content: page.content.map(c => c.id === commentId ? { ...c, score: (c.score || 0) + 1 } : c)
          }))
        }
      })
      return { previousComments }
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(['comments', postId], context.previousComments)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    }
  })

  const handlePostComment = () => {
    if (!commentText.trim()) return
    createCommentMutation.mutate({
      postId,
      content: commentText.trim()
    })
  }

  const handleLoadMore = () => {
    fetchNextPage()
  }

  const handleUpvote = (commentId) => {
    upvoteMutation.mutate(commentId)
  }


  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-foreground">Comments ({totalElements})</h2>

      {/* Comment Form */}
      <div className="mt-6 flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="mt-2 flex justify-end">
            <Button disabled={!commentText.trim() || createCommentMutation.isPending} onClick={handlePostComment}>
              {createCommentMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Post Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="mt-8 space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
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
                  onClick={() => handleUpvote(comment.id)} 
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  {comment.score || 0}
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground">Reply</button>
              </div>
              
              {/* Render Replies minimally */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4 pl-8 border-l-2 border-border">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="flex gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{reply.username?.[0] || '?'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{reply.username}</span>
                          <span className="text-sm text-muted-foreground">{new Date(reply.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="mt-1 text-sm text-foreground">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {comments.length === 0 && !isLoading && (
          <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>

      {/* Load More Option */}
      {hasNextPage && comments.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={handleLoadMore} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Load Next 50 Comments"}
          </Button>
        </div>
      )}
    </div>
  )
}
