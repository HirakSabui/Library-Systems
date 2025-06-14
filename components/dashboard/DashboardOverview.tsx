"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLibrary } from "@/contexts/LibraryContext"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Users,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Download,
  Eye,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function DashboardOverview() {
  const { stats, books, exportBooks, refreshStats, firebaseReady } = useLibrary()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const recentBooks = books.slice(0, 5)

  const statCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      description: "in collection",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Available Books",
      value: stats.availableBooks,
      description: "ready to borrow",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Checked Out",
      value: stats.checkedOutBooks,
      description: "currently borrowed",
      icon: XCircle,
      color: "text-orange-600",
    },
    {
      title: "Total Members",
      value: stats.totalMembers,
      description: "registered users",
      icon: Users,
      color: "text-purple-600",
    },
  ]

  const handleExportBooks = async () => {
    try {
      exportBooks()
      toast({
        title: "Export successful",
        description: "Books data has been exported to CSV file.",
      })
    } catch (error: any) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: error.message || "Failed to export books data.",
        variant: "destructive",
      })
    }
  }

  const handleRefreshStats = async () => {
    try {
      await refreshStats()
      toast({
        title: "Stats refreshed",
        description: "Dashboard statistics have been updated.",
      })
    } catch (error: any) {
      console.error("Refresh error:", error)
      toast({
        title: "Refresh failed",
        description: error.message || "Failed to refresh statistics.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-2">
              {firebaseReady ? (
                <div className="flex items-center gap-1 text-green-600">
                  <Wifi className="h-4 w-4" />
                  <span className="text-xs">Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-orange-600">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-xs">Demo</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600">
            Welcome back, {user?.displayName || user?.email || "Admin"}! Here's your library overview.
          </p>
          {!firebaseReady && (
            <p className="text-sm text-orange-600 mt-1">Running in demo mode. Firebase connection not available.</p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleRefreshStats}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Additions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Additions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentBooks.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                    <div>Book</div>
                    <div>Author</div>
                    <div>Category</div>
                    <div>Status</div>
                  </div>
                  {recentBooks.map((book) => (
                    <div key={book.id} className="grid grid-cols-4 gap-4 text-sm">
                      <div className="font-medium truncate" title={book.title}>
                        {book.title}
                      </div>
                      <div className="text-gray-600 truncate" title={book.author}>
                        {book.author}
                      </div>
                      <div className="text-gray-600">{book.category}</div>
                      <div>
                        <Badge
                          variant={book.status === "available" ? "default" : "secondary"}
                          className={
                            book.status === "available"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }
                        >
                          {book.status === "available" ? "Available" : "Checked Out"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No books added yet</p>
                  <Button className="mt-4" onClick={() => router.push("/books/add")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Book
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start bg-primary hover:bg-primary/90"
                onClick={() => router.push("/books/add")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Book
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/books")}>
                <Eye className="mr-2 h-4 w-4" />
                Browse All Books
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/books?search=true")}
              >
                <Search className="mr-2 h-4 w-4" />
                Search Books
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExportBooks}
                disabled={books.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Books
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recently Added Books Section */}
      {books.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recently Added Books</CardTitle>
            <Button variant="link" className="text-primary" onClick={() => router.push("/books")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentBooks.slice(0, 3).map((book) => (
                <div key={book.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-[3/4] bg-gray-100 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                    {book.imageUrl ? (
                      <img
                        src={book.imageUrl || "/placeholder.svg"}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.parentElement!.innerHTML =
                            '<svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>'
                        }}
                      />
                    ) : (
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2" title={book.title}>
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-2" title={book.author}>
                    {book.author}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{book.category}</span>
                    <Badge
                      variant={book.status === "available" ? "default" : "secondary"}
                      className={`text-xs ${book.status === "available" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                    >
                      {book.status === "available" ? "Available" : "Checked Out"}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Added: {book.addedAt.toDate().toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
