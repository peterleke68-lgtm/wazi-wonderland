"use client"

import React from "react"
import { CartProvider } from "@/lib/context/CartContext"
import { WishlistProvider } from "@/lib/context/WishlistContext"
import { CmsBuilderProvider } from "@/lib/context/CmsBuilderContext"
import { AuthProvider } from "@/lib/context/AuthContext"
import { Toaster } from "@/components/ui/toaster"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CmsBuilderProvider>
        <CartProvider>
          <WishlistProvider>
            {children}
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </CmsBuilderProvider>
    </AuthProvider>
  )
}
