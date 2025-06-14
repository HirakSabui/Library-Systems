"use client"

import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

const getStorageService = async () => {
  const { storage } = await import("@/lib/firebase")
  return storage
}

export const uploadBookImage = async (file: File, bookId: string): Promise<string> => {
  try {
    const storage = await getStorageService()
    const imageRef = ref(storage, `books/${bookId}/${file.name}`)
    const snapshot = await uploadBytes(imageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

export const deleteBookImage = async (imageUrl: string): Promise<void> => {
  try {
    const storage = await getStorageService()
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}

export const uploadMemberAvatar = async (file: File, memberId: string): Promise<string> => {
  try {
    const storage = await getStorageService()
    const imageRef = ref(storage, `members/${memberId}/${file.name}`)
    const snapshot = await uploadBytes(imageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error("Error uploading member avatar:", error)
    throw error
  }
}
