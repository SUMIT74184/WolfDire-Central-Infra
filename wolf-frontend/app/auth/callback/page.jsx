"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const accessToken = searchParams.get("access_token")
    const refreshToken = searchParams.get("refresh_token")

    if (accessToken && refreshToken) {
      // Save tokens and update auth state
      login(accessToken, refreshToken)

      // Decode the token to check roles and redirect appropriately
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]))
        const roles = payload.roles || []
        const isAdmin = roles.some(r => r === "ADMIN" || r === "TENANT_ADMIN" || r === "SUPER_ADMIN")
        router.push(isAdmin ? "/admin" : "/feed")
      } catch (e) {
        // Fallback if decode fails
        router.push("/feed")
      }
    } else {
      // If tokens are missing, redirect back to login
      router.push("/login?error=OAuthFailed")
    }
  }, [searchParams, login, router])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <h2 className="text-xl font-semibold">Completing login...</h2>
        <p className="text-sm text-muted-foreground">Please wait while we redirect you.</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
