"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type Book,
  type Member,
  type LibraryStats,
  addBook,
  updateBook,
  deleteBook,
  addMember,
  updateMember,
  deleteMember,
  searchBooks,
  getLibraryStats,
  subscribeToBooks,
  subscribeToMembers,
} from "@/lib/firestore"

interface LibraryContextType {
  books: Book[]
  members: Member[]
  stats: LibraryStats
  loading: boolean
  firebaseReady: boolean
  addBook: (book: Omit<Book, "id" | "addedAt" | "updatedAt">, imageFile?: File) => Promise<void>
  updateBook: (id: string, book: Partial<Book>, imageFile?: File) => Promise<void>
  deleteBook: (id: string) => Promise<void>
  addMember: (member: Omit<Member, "id" | "joinedAt">) => Promise<void>
  updateMember: (id: string, member: Partial<Member>) => Promise<void>
  deleteMember: (id: string) => Promise<void>
  searchBooks: (query: string) => Promise<Book[]>
  exportBooks: () => void
  refreshStats: () => Promise<void>
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined)

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [firebaseReady, setFirebaseReady] = useState(false)

  const [stats, setStats] = useState<LibraryStats>({
    totalBooks: 0,
    availableBooks: 0,
    checkedOutBooks: 0,
    totalMembers: 0,
  })

  // Initialize Firebase services when component mounts
  useEffect(() => {
    let mounted = true
    let unsubscribeBooks: (() => void) | undefined
    let unsubscribeMembers: (() => void) | undefined

    const initializeLibrary = async () => {
      try {
        // Check Firebase configuration
        const { isFirebaseConfigured } = await import("@/lib/firebase")

        if (mounted) {
          setFirebaseReady(isFirebaseConfigured)
        }

        // Set up real-time listeners
        unsubscribeBooks = subscribeToBooks((booksData) => {
          if (mounted) {
            setBooks(booksData)
          }
        })

        unsubscribeMembers = subscribeToMembers((membersData) => {
          if (mounted) {
            setMembers(membersData)
          }
        })

        // Load initial stats
        const initialStats = await getLibraryStats()
        if (mounted) {
          setStats(initialStats)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error initializing library:", error)
        if (mounted) {
          setFirebaseReady(false)
          setLoading(false)
        }
      }
    }

    initializeLibrary()

    return () => {
      mounted = false
      if (unsubscribeBooks) {
        unsubscribeBooks()
      }
      if (unsubscribeMembers) {
        unsubscribeMembers()
      }
    }
  }, [])

  // Update stats when books or members change
  useEffect(() => {
    const availableBooks = books.filter((book) => book.status === "available").length
    const checkedOutBooks = books.filter((book) => book.status === "checked-out").length

    setStats({
      totalBooks: books.length,
      availableBooks,
      checkedOutBooks,
      totalMembers: members.length,
    })
  }, [books, members])

  const handleAddBook = async (bookData: Omit<Book, "id" | "addedAt" | "updatedAt">, imageFile?: File) => {
    try {
      const bookId = await addBook(bookData)

      if (imageFile && firebaseReady) {
        // Handle image upload if needed
        const { uploadBookImage } = await import("@/lib/storage")
        const imageUrl = await uploadBookImage(imageFile, bookId)
        await updateBook(bookId, { imageUrl })
      }
    } catch (error) {
      console.error("Error adding book:", error)
      throw error
    }
  }

  const handleUpdateBook = async (id: string, bookData: Partial<Book>, imageFile?: File) => {
    try {
      const updateData = { ...bookData }

      if (imageFile && firebaseReady) {
        const { uploadBookImage } = await import("@/lib/storage")
        const imageUrl = await uploadBookImage(imageFile, id)
        updateData.imageUrl = imageUrl
      }

      await updateBook(id, updateData)
    } catch (error) {
      console.error("Error updating book:", error)
      throw error
    }
  }

  const handleDeleteBook = async (id: string) => {
    try {
      await deleteBook(id)
    } catch (error) {
      console.error("Error deleting book:", error)
      throw error
    }
  }

  const handleAddMember = async (memberData: Omit<Member, "id" | "joinedAt">) => {
    try {
      await addMember(memberData)
    } catch (error) {
      console.error("Error adding member:", error)
      throw error
    }
  }

  const handleUpdateMember = async (id: string, memberData: Partial<Member>) => {
    try {
      await updateMember(id, memberData)
    } catch (error) {
      console.error("Error updating member:", error)
      throw error
    }
  }

  const handleDeleteMember = async (id: string) => {
    try {
      await deleteMember(id)
    } catch (error) {
      console.error("Error deleting member:", error)
      throw error
    }
  }

  const handleSearchBooks = async (query: string): Promise<Book[]> => {
    try {
      return await searchBooks(query)
    } catch (error) {
      console.error("Error searching books:", error)
      return []
    }
  }

  const exportBooks = () => {
    try {
      const csvContent = [
        ["Title", "Author", "Category", "Status", "Added Date"],
        ...books.map((book) => [
          book.title,
          book.author,
          book.category,
          book.status,
          book.addedAt.toDate().toLocaleDateString(),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `library-books-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting books:", error)
      throw error
    }
  }

  const refreshStats = async () => {
    try {
      const newStats = await getLibraryStats()
      setStats(newStats)
    } catch (error) {
      console.error("Error refreshing stats:", error)
      throw error
    }
  }

  return (
    <LibraryContext.Provider
      value={{
        books,
        members,
        stats,
        loading,
        firebaseReady,
        addBook: handleAddBook,
        updateBook: handleUpdateBook,
        deleteBook: handleDeleteBook,
        addMember: handleAddMember,
        updateMember: handleUpdateMember,
        deleteMember: handleDeleteMember,
        searchBooks: handleSearchBooks,
        exportBooks,
        refreshStats,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (context === undefined) {
    throw new Error("useLibrary must be used within a LibraryProvider")
  }
  return context
}
