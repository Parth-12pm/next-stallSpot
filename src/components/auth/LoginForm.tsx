"use client"

import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { handleApiError } from "@/lib/error-handling"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        throw new Error("Invalid credentials")
      } else {
        const profileResponse = await fetch("/api/profile")
        const profileData = await profileResponse.json()

        if (!profileData.profileComplete) {
          toast({
            title: "Welcome back!",
            description: "Please complete your profile to continue.",
          })
          router.push("/profile")
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          })
          router.push("/dashboard")
        }
      }
    } catch (error) {
      const apiError = handleApiError(error)
      toast({
        title: "Error",
        description: apiError.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-20 mb-20">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} autoComplete="username" />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button variant="link" asChild>
          <a href="/auth/forgot-password">Forgot Password?</a>
        </Button>
        <Button variant="link" asChild>
          <a href="/auth/role-select">Don&apos;t have an account? Sign up</a>
        </Button>
      </CardFooter>
    </Card>
  )
}

