"use client"

import type { Timestamp } from "firebase/firestore"

export interface Book {
  id: string
  title: string
  author: string
  category: string
  status: "available" | "checked-out"
  imageUrl?: string
  addedAt: Timestamp
  updatedAt: Timestamp
}

export interface Member {
  id: string
  name: string
  email: string
  joinedAt: Timestamp
  booksCheckedOut: number
  isActive: boolean
}

export interface LibraryStats {
  totalBooks: number
  availableBooks: number
  checkedOutBooks: number
  totalMembers: number
}

// Mock data for demo mode
const mockBooks = [
  {
    id: "1",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "Fiction",
    status: "available" as const,
    addedAt: { toDate: () => new Date("2024-01-15") } as Timestamp,
    updatedAt: { toDate: () => new Date("2024-01-15") } as Timestamp,
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    status: "checked-out" as const,
    addedAt: { toDate: () => new Date("2024-01-10") } as Timestamp,
    updatedAt: { toDate: () => new Date("2024-01-10") } as Timestamp,
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    category: "Dystopian",
    status: "available" as const,
    addedAt: { toDate: () => new Date("2024-01-12") } as Timestamp,
    updatedAt: { toDate: () => new Date("2024-01-12") } as Timestamp,
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Romance",
    status: "available" as const,
    addedAt: { toDate: () => new Date("2024-01-08") } as Timestamp,
    updatedAt: { toDate: () => new Date("2024-01-08") } as Timestamp,
  },
  {
    id: "5",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    status: "available" as const,
    addedAt: { toDate: () => new Date("2024-01-05") } as Timestamp,
    updatedAt: { toDate: () => new Date("2024-01-05") } as Timestamp,
  },
]

const mockMembers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    joinedAt: { toDate: () => new Date("2024-01-01") } as Timestamp,
    booksCheckedOut: 1,
    isActive: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    joinedAt: { toDate: () => new Date("2024-01-05") } as Timestamp,
    booksCheckedOut: 0,
    isActive: true,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    joinedAt: { toDate: () => new Date("2024-01-03") } as Timestamp,
    booksCheckedOut: 0,
    isActive: true,
  },
]

// Helper function to check if Firebase is available
const getFirebaseServices = async () => {
  try {
    const { isFirebaseConfigured, db } = await import("@/lib/firebase")
    return { isFirebaseConfigured, db }
  } catch (error) {
    console.error("Error importing Firebase services:", error)
    return { isFirebaseConfigured: false, db: null }
  }
}

// Books Collection Operations
export const getAllBooks = async (): Promise<Book[]> => {
  const { isFirebaseConfigured, db } = await getFirebaseServices()

  if (!isFirebaseConfigured || !db) {
    return mockBooks
  }

  try {
    const { collection, query, orderBy, getDocs } = await import("firebase/firestore")
    const booksCollection = collection(db, "books")
    const q = query(booksCollection, orderBy("addedAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Book,
    )
  } catch (error) {
    console.error("Error fetching books from Firestore, using mock data:", error)
    return mockBooks
  }
}

export const getRecentBooks = async (limitCount = 5): Promise<Book[]> => {
  const { isFirebaseConfigured, db } = await getFirebaseServices()

  if (!isFirebaseConfigured || !db) {
    return mockBooks.slice(0, limitCount)
  }

  try {
    const { collection, query, orderBy, limit, getDocs } = await import("firebase/firestore")
    const booksCollection = collection(db, "books")
    const q = query(booksCollection, orderBy("addedAt", "desc"), limit(limitCount))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Book,
    )
  } catch (error) {
    console.error("Error fetching recent books from Firestore, using mock data:", error)
    return mockBooks.slice(0, limitCount)
  }
}

export const addBook = async (bookData: Omit<Book, "id" | "addedAt" | "updatedAt">): Promise<string> => {
  const { isFirebaseConfigured, db } = await getFirebaseServices()

  if (!isFirebaseConfigured || !db) {
    // Mock add for demo
    const newBook = {
      ...bookData,
      id: Date.now().toString(),
      addedAt: { toDate: () => new Date() } as Timestamp,
      updatedAt: { toDate: () => new Date() } as Timestamp,
    }
    mockBooks.unshift(newBook)
    return newBook.id
  }

  try {
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")
    const booksCollection = collection(db, "books")
    const now = serverTimestamp()
    const docRef = await addDoc(booksCollection, {
      ...bookData,
      addedAt: now,
      updatedAt: now,
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding book to Firestore:", error)
    throw new Error("Failed to add book. Please check your connection and try again.")
  }
}

export const updateBook = async (bookId: string, bookData: Partial<Omit<Book, "id" | "addedAt">>): Promise<void> => {
  const { isFirebaseConfigured, db } = await getFirebaseServices()

  if (!isFirebaseConfigured || !db) {
    // Mock update for demo
    const bookIndex = mockBooks.findIndex((book) => book.id === bookId)
    if (bookIndex !== -1) {
      mockBooks[bookIndex] = { ...mockBooks[bookIndex], ...bookData }
    }
    return
  }

  try {
    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")
    const bookRef = doc(db, "books", bookId)
    await updateDoc(bookRef, {
      ...bookData,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating book in Firestore:", error)
    throw new Error("Failed to update book. Please try again.")
  }
}

export const deleteBook = async (bookId: string): Promise<void> => {
  const { isFirebaseConfigured, db } = await getFirebaseServices()

  if (!isFirebaseConfigured || !db) {
    // Mock delete for demo
    const bookIndex = mockBooks.findIndex((book) => book.id === bookId)
    if (bookIndex !== -1) {
      mockBooks.splice(bookIndex, 1)
    }
    return
  }

  try {
    const { doc, deleteDoc } = await import("firebase/firestore")
    const bookRef = doc(db, "books", bookId)
    await deleteDoc(bookRef)
  } catch (error) {
    console.error("Error deleting book from Firestore:", error)
    throw new Error("Failed to delete book. Please try again.")
  }
}

export const searchBooks = async (searchTerm: string): Promise<Book[]> => {
  const { isFirebaseConfigured } = await getFirebaseServices()

  if (!isFirebaseConfigured) {
    return mockBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  try {
    // Firestore doesn't support full-text search, so we'll get all books and filter client-side
    const allBooks = await getAllBooks()
    return allBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  } catch (error) {
    console.error("Error searching books in Firestore:", error)
    return mockBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }
}

export const getBooksByCategory = async (category: string): Promise<Book[]> => {
  const { isFirebaseConfigured, db } = await getFirebaseServices()

  if (!isFirebaseConfigured || !db) {
    return mockBooks.filter((book) => book.category === category)
  }

  try {
    const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")
    const booksCollection = collection(db, "books")
    const q = query(booksCollection, where("category", "==", category), orderBy("addedAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Book,
    )
  } catch (error) {
    console.error("Error fetching books by category from Firestore:", error)
    return mockBooks.filter((book) => book.category === category)
  }
}

export const getBooksByStatus = async (status: "available" | "checked-out"): Promise<Book[]> => {
  const { isFirebaseConfigured, db } = await getFirebaseServices()

  if (!isFirebaseConfigured || !db) {
    return mockBooks.filter((book) => book.status === status)
  }

  try {
    const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")
    const booksCollection = collection(db, "books")
    const q = query(booksCollection, where("status", "==", status), orderBy("addedAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Book,
    )
  } catch (error) {
    console.error("Error fetching books by status from Firestore:", error)
    return mockBooks.filter((book) => book.status === status)
  }
}

// Members Collection Operations
export const getAllMembers = async (): Promise<Member[]> => {
  const { isFirebaseConfigured, db } = await getFirebaseServices()

  if (!isFirebaseConfigured || !db) {
    return mockMembers
  }

  try {
    const { collection, query, orderBy, getDocs } = await import("firebase/firestore")
    const membersCollection = collection(db, "members")
    const q = query(membersCollection, orderBy("joinedAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Member,
    )
  } catch (error) {
    console.error("Error fetching members from Firestore:", error)
    return mockMembers
  }
}

export const addMember = async (memberData: Omit<Member, "id" | "joinedAt">): Promise<string> => {
  const { isFirebaseConfigured, db } = await getFirebaseServices()

  if (!isFirebaseConfigured || !db) {
    // Mock add for demo
    const newMember = {
      ...memberData,
      id: Date.now().toString(),
      joinedAt: { toDate: () => new Date() } as Timestamp,
    }
    mockMembers.unshift(newMember)
    return newMember.id
  }

  try {
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")
    const membersCollection = collection(db, "members")
    const docRef = await addDoc(membersCollection, {
      ...memberData,
      joinedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding member to Firestore:", error)
    throw new Error("Failed to add member. Please try again.")
  }
}

export const updateMember = async (
  memberId: string,
  memberData: Partial<Omit<Member, "id" | "joinedAt">>,
): Promise<void> => {
  const { isFirebaseConfigured, db } = await getFirebaseServices()

  if (!isFirebaseConfigured || !db) {
    // Mock update for demo
    const memberIndex = mockMembers.findIndex((member) => member.id === memberId)
    if (memberIndex !== -1) {
      mockMembers[memberIndex] = { ...mockMembers[memberIndex], ...memberData }
    }
    return
  }

  try {
    const { doc, updateDoc } = await import("firebase/firestore")
    const memberRef = doc(db, "members", memberId)
    await updateDoc(memberRef, memberData)
  } catch (error) {
    console.error("Error updating member in Firestore:", error)
    throw new Error("Failed to update member. Please try again.")
  }
}

export const deleteMember = async (memberId: string): Promise<void> => {
  const { isFirebaseConfigured, db } = await getFirebaseServices()

  if (!isFirebaseConfigured || !db) {
    // Mock delete for demo
    const memberIndex = mockMembers.findIndex((member) => member.id === memberId)
    if (memberIndex !== -1) {
      mockMembers.splice(memberIndex, 1)
    }
    return
  }

  try {
    const { doc, deleteDoc } = await import("firebase/firestore")
    const memberRef = doc(db, "members", memberId)
    await deleteDoc(memberRef)
  } catch (error) {
    console.error("Error deleting member from Firestore:", error)
    throw new Error("Failed to delete member. Please try again.")
  }
}

// Real-time listeners with error handling
export const subscribeToBooks = (callback: (books: Book[]) => void) => {
  const setupSubscription = async () => {
    const { isFirebaseConfigured, db } = await getFirebaseServices()

    if (!isFirebaseConfigured || !db) {
      callback(mockBooks)
      return () => {}
    }

    try {
      const { collection, query, orderBy, onSnapshot } = await import("firebase/firestore")
      const booksCollection = collection(db, "books")
      const q = query(booksCollection, orderBy("addedAt", "desc"))
      return onSnapshot(
        q,
        (querySnapshot) => {
          const books = querySnapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              }) as Book,
          )
          callback(books)
        },
        (error) => {
          console.error("Error in books subscription:", error)
          callback(mockBooks)
        },
      )
    } catch (error) {
      console.error("Error setting up books subscription:", error)
      callback(mockBooks)
      return () => {}
    }
  }

  setupSubscription()
  return () => {}
}

export const subscribeToMembers = (callback: (members: Member[]) => void) => {
  const setupSubscription = async () => {
    const { isFirebaseConfigured, db } = await getFirebaseServices()

    if (!isFirebaseConfigured || !db) {
      callback(mockMembers)
      return () => {}
    }

    try {
      const { collection, query, orderBy, onSnapshot } = await import("firebase/firestore")
      const membersCollection = collection(db, "members")
      const q = query(membersCollection, orderBy("joinedAt", "desc"))
      return onSnapshot(
        q,
        (querySnapshot) => {
          const members = querySnapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              }) as Member,
          )
          callback(members)
        },
        (error) => {
          console.error("Error in members subscription:", error)
          callback(mockMembers)
        },
      )
    } catch (error) {
      console.error("Error setting up members subscription:", error)
      callback(mockMembers)
      return () => {}
    }
  }

  setupSubscription()
  return () => {}
}

// Statistics
export const getLibraryStats = async (): Promise<LibraryStats> => {
  try {
    const [allBooks, allMembers] = await Promise.all([getAllBooks(), getAllMembers()])

    const availableBooks = allBooks.filter((book) => book.status === "available").length
    const checkedOutBooks = allBooks.filter((book) => book.status === "checked-out").length

    return {
      totalBooks: allBooks.length,
      availableBooks,
      checkedOutBooks,
      totalMembers: allMembers.length,
    }
  } catch (error) {
    console.error("Error fetching library stats:", error)
    return {
      totalBooks: mockBooks.length,
      availableBooks: mockBooks.filter((book) => book.status === "available").length,
      checkedOutBooks: mockBooks.filter((book) => book.status === "checked-out").length,
      totalMembers: mockMembers.length,
    }
  }
}

// Book operations object for compatibility
export const bookOperations = {
  getAll: getAllBooks,
  getRecent: getRecentBooks,
  create: async (book: Omit<Book, "id" | "addedAt" | "updatedAt">) => {
    const id = await addBook(book)
    return { ...book, id, addedAt: { toDate: () => new Date() }, updatedAt: { toDate: () => new Date() } } as Book
  },
  search: searchBooks,
  getByCategory: getBooksByCategory,
  getByStatus: getBooksByStatus,
  getStats: async () => {
    const stats = await getLibraryStats()
    return {
      total: stats.totalBooks,
      available: stats.availableBooks,
      checkedOut: stats.checkedOutBooks,
    }
  },
}

// Member operations object for compatibility
export const memberOperations = {
  getAll: getAllMembers,
  getCount: async () => {
    const members = await getAllMembers()
    return members.length
  },
}
