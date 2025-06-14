"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { BookOpen, AlertCircle } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("admin@library.com")
  const [password, setPassword] = useState("admin123")
  const [loading, setLoading] = useState(false)
  const { login, firebaseReady } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to the library system.",
      })
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">KRR Library</CardTitle>
          <CardDescription>Sign in to access the library management system</CardDescription>
        </CardHeader>
        <CardContent>
          {!firebaseReady && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-800">Running in demo mode</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@library.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                <strong>Email:</strong> admin@library.com
              </p>
              <p>
                <strong>Password:</strong> admin123
              </p>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              {firebaseReady
                ? "Firebase is connected. Create your admin account in Firebase Console for production."
                : "Firebase not configured. Using demo mode with mock data."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
