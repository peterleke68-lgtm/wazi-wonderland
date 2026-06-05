"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Product } from "@/types"
import { useToast } from "@/components/ui/use-toast"

interface WishlistContextType {
  wishlist: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: Product) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { toast } = useToast()

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("wazi_wishlist")
      if (stored) {
        setWishlist(JSON.parse(stored))
      }
    } catch (e) {
      console.error("Error reading wishlist from localStorage", e)
    }
    setIsLoaded(true)
  }, [])

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("wazi_wishlist", JSON.stringify(wishlist))
    }
  }, [wishlist, isLoaded])

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been saved to your wishlist.`,
        variant: "gold",
      })
      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => {
      const product = prev.find((p) => p.id === productId)
      const updated = prev.filter((p) => p.id !== productId)
      if (product) {
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} has been removed.`,
        })
      }
      return updated
    })
  }

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId)
  }

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
