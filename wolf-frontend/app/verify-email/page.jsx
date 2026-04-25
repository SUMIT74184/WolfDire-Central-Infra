"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PenSquare, Mail, Loader2, CheckCircle, ArrowLeft, XCircle } from "lucide-react"
import { toast } from "sonner"

function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isVerified, setIsVerified] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef([])

  const mutation = useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      setIsVerified(true)
      toast.success("Email verified successfully!")
    },
    onError: (error) => {
      toast.error(error?.message || "Verification failed")
    }
  })

  // Auto-verify if token is present in URL
  useEffect(() => {
    if (token && !isVerified && !mutation.isPending && !mutation.isError) {
      mutation.mutate(token)
    }
  }, [token])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleChange = (index, value) => {
    if (value.length > 1) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    const newCode = [...code]
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newCode[i] = char
    })
    setCode(newCode)
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
  }

  const handleVerify = () => {
    const fullCode = code.join("")
    mutation.mutate(fullCode)
  }

  const handleResend = async () => {
    // This would likely call an endpoint to resend the verification link/code
    setResendCooldown(60)
    toast.info("Verification email resent!")
  }

  if (isVerified) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Email Verified!</h1>
          <p className="mt-2 text-muted-foreground">
            Your email has been successfully verified. You can now access all features.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <img src="/wolf-logo-realistic.jpg" alt="WolfDire" className="h-10 w-10 rounded-lg" />
          <span className="text-2xl font-bold text-foreground">WolfDire</span>
        </Link>

        <Card className="border-border">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription>
              {"We've sent a verification code to"}
              <br />
              <span className="font-medium text-foreground">john@example.com</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                   onPaste={handlePaste}
                   className="h-12 w-12 text-center text-lg font-semibold sm:h-14 sm:w-14 sm:text-xl"
                   disabled={mutation.isPending}
                 />
               ))}
             </div>
 
             <Button onClick={handleVerify} className="w-full" disabled={mutation.isPending || code.some((d) => !d)}>
               {mutation.isPending ? (
                 <>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   Verifying...
                 </>
               ) : (
                 "Verify Email"
               )}
             </Button>

             {mutation.isError && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                   <XCircle className="h-4 w-4" />
                   <p>{mutation.error?.message || "Invalid or expired verification token"}</p>
                </div>
             )}


            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {"Didn't receive the code? "}
                {resendCooldown > 0 ? (
                  <span className="text-muted-foreground">Resend in {resendCooldown}s</span>
                ) : (
                  <button onClick={handleResend} className="font-medium text-primary hover:underline">
                    Resend code
                  </button>
                )}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link
              href="/signup"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign up
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>}>
      <VerifyEmailForm />
    </Suspense>
  )
}
