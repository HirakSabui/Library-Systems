"use client"

import { useAuth } from "@/contexts/AuthContext"
import { LoginForm } from "@/components/auth/LoginForm"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { AddBookForm } from "@/components/books/AddBookForm"

export default function AddBookPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <DashboardLayout>
      <AddBookForm />
    </DashboardLayout>
  )
}
