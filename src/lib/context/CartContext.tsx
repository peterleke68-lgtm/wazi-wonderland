"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Product, ProductVariant } from "@/types"
import { useToast } from "@/components/ui/use-toast"

export interface CartItem {
  id: string
  product: Product
  variant: ProductVariant | null
  quantity: number
  selectedCapSize: string | null
  selectedDensity: string | null
  priceAtAddition: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, quantity: number, capSize: string | null, density: string | null) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  cartSubtotal: number
  cartTotal: number
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { toast } = useToast()

  // Load cart on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("wazi_cart")
      if (storedCart) {
        setCart(JSON.parse(storedCart))
      }
    } catch (e) {
      console.error("Error reading cart from localStorage", e)
    }
    setIsLoaded(true)
  }, [])

  // Save cart when it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("wazi_cart", JSON.stringify(cart))
    }
  }, [cart, isLoaded])

  const addToCart = (
    product: Product,
    quantity: number,
    capSize: string | null,
    density: string | null
  ) => {
    setCart((prevCart) => {
      // Find if item already exists with matching variants
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedCapSize === capSize &&
          item.selectedDensity === density
      )

      // Calculate variant price modifier
      let price = product.sale_price || product.price
      let selectedVariant: ProductVariant | null = null

      if (product.variants && (capSize || density)) {
        const matchingVariant = product.variants.find(
          (v) =>
            (!capSize || v.cap_size === capSize) &&
            (!density || v.hair_density === density)
        )
        if (matchingVariant) {
          selectedVariant = matchingVariant
          price += Number(matchingVariant.price_modifier || 0)
        }
      }

      const updatedCart = [...prevCart]

      if (existingItemIndex > -1) {
        updatedCart[existingItemIndex].quantity += quantity
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${capSize || "default"}-${density || "default"}-${Date.now()}`,
          product,
          variant: selectedVariant,
          quantity,
          selectedCapSize: capSize,
          selectedDensity: density,
          priceAtAddition: price,
        }
        updatedCart.push(newItem)
      }

      toast({
        title: "Added to Bag",
        description: `${product.name} has been added to your shopping bag.`,
        variant: "gold",
      })

      return updatedCart
    })
  }

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === cartItemId)
      const updatedCart = prevCart.filter((i) => i.id !== cartItemId)

      if (item) {
        toast({
          title: "Removed from Bag",
          description: `${item.product.name} has been removed.`,
        })
      }

      return updatedCart
    })
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartSubtotal = cart.reduce((total, item) => total + item.priceAtAddition * item.quantity, 0)
  const cartTotal = cartSubtotal // expandable with tax/shipping later
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
