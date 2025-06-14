"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { BookOpen, Plus, Search, Edit, Trash2 } from "lucide-react"
import { useLibrary } from "@/contexts/LibraryContext"
import { useToast } from "@/hooks/use-toast"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"

export function BooksContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { books, deleteBook, searchBooks } = useLibrary()
  const [filteredBooks, setFilteredBooks] = useState(books)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<string | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)

  const categories = Array.from(new Set(books.map((book) => book.category)))

  useEffect(() => {
    if (searchParams.get("search") === "true") {
      // Focus search input when coming from search action
      const searchInput = document.getElementById("search-input")
      if (searchInput) {
        searchInput.focus()
      }
    }
  }, [searchParams])

  useEffect(() => {
    filterBooks()
  }, [books, searchQuery, categoryFilter, statusFilter])

  const filterBooks = async () => {
    let filtered = books

    // If there's a search query, use Firebase search
    if (searchQuery.trim()) {
      setSearchLoading(true)
      try {
        filtered = await searchBooks(searchQuery.trim())
      } catch (error) {
        console.error("Search error:", error)
        toast({
          title: "Search Error",
          description: "Failed to search books. Please try again.",
          variant: "destructive",
        })
        filtered = books
      } finally {
        setSearchLoading(false)
      }
    }

    // Apply local filters
    if (categoryFilter !== "all") {
      filtered = filtered.filter((book) => book.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((book) => book.status === statusFilter)
    }

    setFilteredBooks(filtered)
  }

  const handleDeleteBook = async (id: string) => {
    try {
      await deleteBook(id)
      toast({
        title: "Book deleted",
        description: "The book has been successfully removed from the library.",
      })
    } catch (error: any) {
      console.error("Error deleting book:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete the book. Please try again.",
        variant: "destructive",
      })
    }
    setDeleteDialogOpen(false)
    setBookToDelete(null)
  }

  const openDeleteDialog = (bookId: string) => {
    setBookToDelete(bookId)
    setDeleteDialogOpen(true)
  }

  const getBookToDeleteTitle = () => {
    if (!bookToDelete) return ""
    const book = books.find((b) => b.id === bookToDelete)
    return book ? book.title : ""
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Books Management</h1>
          <p className="text-gray-600">Manage your library's book collection ({books.length} books)</p>
        </div>
        <Button onClick={() => router.push("/books/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Book
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search-input"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  disabled={searchLoading}
                />
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="checked-out">Checked Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-[3/4] bg-gray-100 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                {book.imageUrl ? (
                  <img
                    src={book.imageUrl || "/placeholder.svg"}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      target.parentElement!.innerHTML =
                        '<div class="flex items-center justify-center w-full h-full"><svg class="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div>'
                    }}
                  />
                ) : (
                  <BookOpen className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm line-clamp-2" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-gray-600 text-xs" title={book.author}>
                  {book.author}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{book.category}</span>
                  <Badge
                    variant={book.status === "available" ? "default" : "secondary"}
                    className={
                      book.status === "available" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                    }
                  >
                    {book.status === "available" ? "Available" : "Checked Out"}
                  </Badge>
                </div>
                <div className="text-xs text-gray-400">Added: {book.addedAt.toDate().toLocaleDateString()}</div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => openDeleteDialog(book.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && !searchLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by adding your first book to the library"}
            </p>
            <Button onClick={() => router.push("/books/add")}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Book
            </Button>
          </CardContent>
        </Card>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => bookToDelete && handleDeleteBook(bookToDelete)}
        title="Delete Book"
        description={`Are you sure you want to delete "${getBookToDeleteTitle()}"? This action cannot be undone.`}
      />
    </div>
  )
}
