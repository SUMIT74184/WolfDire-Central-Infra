"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api-client"

// ── JWT helpers (no library needed — just base64 decode) ────────────────────

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

function isTokenExpired(token) {
  const payload = parseJwt(token)
  if (!payload?.exp) return true
  return Date.now() >= payload.exp * 1000
}

// ── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>")
  return ctx
}

// ── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Derive auth state from user
  const isAuthenticated = !!user
  const isAdmin = user?.roles?.some(
    (r) => r === "ADMIN" || r === "SUPER_ADMIN" || r === "TENANT_ADMIN"
  ) ?? false

  // ── Bootstrap: read token from localStorage on mount ────────────────────

  const bootstrap = useCallback(() => {
    const token = localStorage.getItem("access_token")
    if (!token || isTokenExpired(token)) {
      setUser(null)
      setLoading(false)
      return
    }

    const payload = parseJwt(token)
    if (payload) {
      setUser({
        userId: payload.userId,
        email: payload.sub,
        firstName: payload.firstName,
        tenantId: payload.tenantId,
        roles: Array.isArray(payload.roles) ? payload.roles : [],
      })
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  // ── Login: called after successful authApi.login() ──────────────────────

  const login = useCallback((accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken)
    localStorage.setItem("refresh_token", refreshToken)
    const payload = parseJwt(accessToken)
    if (payload) {
      setUser({
        userId: payload.userId,
        email: payload.sub,
        firstName: payload.firstName,
        tenantId: payload.tenantId,
        roles: Array.isArray(payload.roles) ? payload.roles : [],
      })
    }
  }, [])

  // ── Logout ──────────────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore — server might be down
    }
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
    router.push("/login")
  }, [router])

  // ── Token refresh ───────────────────────────────────────────────────────

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) return false
    try {
      const response = await authApi.refresh(refreshToken)
      login(response.accessToken, response.refreshToken)
      return true
    } catch {
      logout()
      return false
    }
  }, [login, logout])

  // ── Auto-refresh: check token expiry every 60s ──────────────────────────

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("access_token")
      if (token && isTokenExpired(token)) {
        refreshAccessToken()
      }
    }, 60_000)
    return () => clearInterval(interval)
  }, [refreshAccessToken])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
