"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Heart, User, Menu, X, Search, Edit3, Check } from "lucide-react"
import { useCart } from "@/lib/context/CartContext"
import { useWishlist } from "@/lib/context/WishlistContext"
import { useCmsBuilder } from "@/lib/context/CmsBuilderContext"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"

export default function Header() {
  const pathname = usePathname()
  const { cart, removeFromCart, updateQuantity, cartSubtotal, cartCount } = useCart()
  const { wishlist } = useWishlist()
  const { isEditing, setIsEditing, saveAllChanges, discardAllChanges } = useCmsBuilder()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b-2 border-brand-gold bg-black/95 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center p-2 text-neutral-400 hover:text-white focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Elegant Serif Logo */}
          <div className="flex-1 text-center lg:text-left lg:flex-initial">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-wider text-gradient-gold transition-opacity duration-300 hover:opacity-95">
                WAZI WONDERLAND
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-2 text-sm font-medium tracking-widest uppercase transition-colors duration-300 ${
                  isActive(link.href)
                    ? "text-brand-gold"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 h-[1px] w-full bg-brand-gold" />
                )}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* CMS Editor Toggle Helper */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className={`hidden sm:inline-flex border-brand-gold/30 hover:border-brand-gold text-xs ${
                isEditing ? "bg-brand-gold text-black font-semibold" : "text-brand-gold"
              }`}
            >
              <Edit3 className="mr-1.5 h-3.5 w-3.5" />
              {isEditing ? "CMS: Editing" : "CMS Edit Mode"}
            </Button>

            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-neutral-400 hover:text-white p-1.5 cursor-pointer"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative text-neutral-400 hover:text-white p-1.5"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {mounted && wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-pink text-[9px] font-bold text-black">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Sheet Trigger */}
            {!mounted ? (
              <button
                className="relative text-neutral-400 hover:text-white p-1.5 cursor-pointer"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
              </button>
            ) : (
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="relative text-neutral-400 hover:text-white p-1.5 cursor-pointer"
                    aria-label="Cart"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold text-[9px] font-bold text-black animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent className="flex flex-col bg-black text-white border-l border-brand-gold/20 h-full w-full sm:max-w-md">
                  <SheetHeader className="pb-4 border-b border-neutral-800">
                    <SheetTitle className="text-xl font-serif text-gradient-gold flex items-center justify-between">
                      Your Shopping Bag ({cartCount})
                    </SheetTitle>
                  </SheetHeader>

                  {cart.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center space-y-4">
                      <ShoppingBag className="h-16 w-16 text-neutral-600" />
                      <p className="text-neutral-400 font-medium font-serif text-lg">Your bag is empty</p>
                      <SheetClose asChild>
                        <Button variant="luxury" className="mt-2">
                          Start Shopping
                        </Button>
                      </SheetClose>
                    </div>
                  ) : (
                    <>
                      <ScrollArea className="flex-1 py-4">
                        <div className="space-y-4">
                          {cart.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 rounded-lg bg-neutral-900/40 border border-neutral-800/60">
                              <div className="h-20 w-16 shrink-0 overflow-hidden rounded bg-neutral-800">
                                <img
                                  src={item.product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1595959183075-c1d09e57ad44?w=150"}
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex flex-1 flex-col justify-between">
                                <div>
                                  <h4 className="text-sm font-medium line-clamp-1">{item.product.name}</h4>
                                  <p className="text-xs text-neutral-400 mt-0.5">
                                    {item.selectedCapSize && `Cap: ${item.selectedCapSize}`}
                                    {item.selectedCapSize && item.selectedDensity && " | "}
                                    {item.selectedDensity && `Density: ${item.selectedDensity}`}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center border border-neutral-800 rounded">
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="px-2 py-0.5 text-neutral-400 hover:text-white"
                                    >
                                      -
                                    </button>
                                    <span className="px-2 text-xs">{item.quantity}</span>
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="px-2 py-0.5 text-neutral-400 hover:text-white"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <span className="text-sm font-semibold text-brand-gold">
                                    {formatPrice(item.priceAtAddition * item.quantity)}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-neutral-500 hover:text-red-400 self-start p-1"
                                aria-label="Remove item"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="border-t border-neutral-800 pt-4 pb-6 space-y-4">
                        <div className="flex items-center justify-between text-base">
                          <span className="text-neutral-400 font-serif">Subtotal</span>
                          <span className="font-semibold text-gradient-gold text-lg">{formatPrice(cartSubtotal)}</span>
                        </div>
                        <p className="text-xs text-neutral-400">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <SheetClose asChild>
                          <Link href="/checkout" className="block w-full">
                            <Button className="w-full" variant="luxury">
                              Proceed to Checkout
                            </Button>
                          </Link>
                        </SheetClose>
                      </div>
                    </>
                  )}
                </SheetContent>
              </Sheet>
            )}

            {/* User Account / Profile */}
            <Link
              href="/account"
              className="text-neutral-400 hover:text-white p-1.5"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Floating CMS Controls Panel (Only visible when CMS isEditing = true) */}
      {isEditing && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-black/95 border-2 border-brand-gold p-4 shadow-[0_0_30px_rgba(224,62,107,0.45)] backdrop-blur-md animate-fade-in-up">
          <div className="text-xs text-neutral-300 font-serif border-r border-neutral-800 pr-3 mr-1">
            <span className="text-brand-gold font-bold block">CMS builder active</span>
            Click elements to edit inline
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={async () => {
              // Get current page slug
              const slug = pathname === "/" ? "home" : pathname.replace("/", "")
              await discardAllChanges(slug || "home")
            }}
            className="text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800"
          >
            Discard
          </Button>
          <Button
            size="sm"
            variant="gold"
            onClick={async () => {
              const slug = pathname === "/" ? "home" : pathname.replace("/", "")
              await saveAllChanges(slug || "home")
            }}
            className="text-xs font-semibold"
          >
            <Check className="mr-1 h-3.5 w-3.5" />
            Publish
          </Button>
        </div>
      )}

      {/* Mobile Nav Sidebar */}
      {mounted && (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="bg-black text-white border-r border-brand-gold/25 w-[280px]">
            <SheetHeader className="pb-6 border-b border-neutral-900">
              <SheetTitle className="text-lg font-serif text-gradient-gold">
                WAZI WONDERLAND
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-6 pt-8">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-base font-medium uppercase tracking-wider ${
                      isActive(link.href) ? "text-brand-gold" : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
              <Separator className="bg-neutral-900 my-2" />
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10 text-xs w-full"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                  {isEditing ? "Disable CMS Mode" : "Enable CMS Mode"}
                </Button>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      )}

      {/* Inline Search Bar */}
      {searchOpen && (
        <div className="w-full bg-neutral-950 border-b-2 border-brand-gold py-4 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
          <div className="mx-auto max-w-3xl flex items-center gap-2">
            <input
              type="text"
              placeholder="Search our luxury wigs, lengths, textures..."
              className="flex-1 bg-transparent border-0 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-0 text-sm"
              autoFocus
            />
            <Button size="sm" variant="gold" className="text-xs">
              Search
            </Button>
            <button onClick={() => setSearchOpen(false)} className="text-neutral-400 hover:text-white p-2">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
