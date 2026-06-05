"use client"

import React, { useEffect, useState } from "react"
import { getProducts, getCategories } from "@/lib/services"
import { Product, Category } from "@/types"
import { useCart } from "@/lib/context/CartContext"
import { useWishlist } from "@/lib/context/WishlistContext"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, ShoppingCart, SlidersHorizontal, Search, X } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function ShopPage() {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  // Filters State
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedWigType, setSelectedWigType] = useState<string | null>(null)
  const [selectedLength, setSelectedLength] = useState<string | null>(null)
  const [maxPrice, setMaxPrice] = useState<number>(2000)
  const [sortBy, setSortBy] = useState<string>("featured")

  useEffect(() => {
    async function loadData() {
      const prods = await getProducts()
      const cats = await getCategories()
      setProducts(prods)
      setCategories(cats)
      setLoading(false)
    }
    loadData()
  }, [])

  // Filter options
  const wigTypes = ["Human Hair", "Lace Front", "Closure", "Frontal", "Colored", "Custom"]
  const lengths = ["18 inches", "20 inches", "22 inches", "24 inches", "26 inches"]

  // Filtering logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory
      ? product.category_id === selectedCategory || (product.category && product.category.slug === selectedCategory)
      : true

    const matchesWigType = selectedWigType
      ? product.wig_type === selectedWigType
      : true

    const matchesLength = selectedLength
      ? product.hair_length === selectedLength
      : true

    const price = product.sale_price || product.price
    const matchesPrice = price <= maxPrice

    return matchesSearch && matchesCategory && matchesWigType && matchesLength && matchesPrice
  })

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPrice = a.sale_price || a.price
    const bPrice = b.sale_price || b.price
    if (sortBy === "price-asc") return aPrice - bPrice
    if (sortBy === "price-desc") return bPrice - aPrice
    if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    return a.is_featured ? -1 : 1 // Featured first
  })

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setSelectedWigType(null)
    setSelectedLength(null)
    setMaxPrice(2000)
    setSortBy("featured")
  }

  const FiltersContent = () => (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="space-y-3">
        <h3 className="font-serif text-sm font-semibold tracking-wider text-white uppercase">Collections</h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`block text-xs uppercase tracking-widest text-left transition-colors cursor-pointer ${
              selectedCategory === null ? "text-brand-gold font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            All Collections
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`block text-xs uppercase tracking-widest text-left transition-colors cursor-pointer ${
                selectedCategory === cat.id ? "text-brand-gold font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Wig Type Filter */}
      <div className="space-y-3">
        <h3 className="font-serif text-sm font-semibold tracking-wider text-white uppercase">Wig Type</h3>
        <div className="flex flex-wrap gap-2">
          {wigTypes.map((type) => {
            const active = selectedWigType === type
            return (
              <button
                key={type}
                onClick={() => setSelectedWigType(active ? null : type)}
                className={`px-3 py-1.5 rounded text-[10px] uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                  active
                    ? "bg-brand-gold border-brand-gold text-black"
                    : "border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                }`}
              >
                {type}
              </button>
            )
          })}
        </div>
      </div>

      {/* Length Filter */}
      <div className="space-y-3">
        <h3 className="font-serif text-sm font-semibold tracking-wider text-white uppercase">Hair Length</h3>
        <div className="flex flex-wrap gap-2">
          {lengths.map((len) => {
            const active = selectedLength === len
            return (
              <button
                key={len}
                onClick={() => setSelectedLength(active ? null : len)}
                className={`px-3 py-1.5 rounded text-[10px] uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                  active
                    ? "bg-brand-gold border-brand-gold text-black"
                    : "border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                }`}
              >
                {len}
              </button>
            )
          })}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-sm font-semibold tracking-wider text-white uppercase">Max Price</h3>
          <span className="text-xs text-brand-gold font-semibold">{formatPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min="500"
          max="2000"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-brand-gold bg-neutral-900 h-1.5 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex items-center justify-between text-[10px] text-neutral-500">
          <span>$500</span>
          <span>$2,000</span>
        </div>
      </div>

      {/* Reset */}
      <Button
        variant="outline"
        size="sm"
        onClick={resetFilters}
        className="w-full border-neutral-800 hover:bg-neutral-900 text-xs tracking-wider"
      >
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Intro */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wide text-gradient-gold">
            THE WAZI BOUTIQUE
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
            Discover luxury hand-crafted human hair wigs designed with flawless invisible HD lace for royalty.
          </p>
          <div className="section-divider mt-4" />
        </div>

        {/* Toolbar (Search, Filter drawer button, Sort selector) */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-neutral-950/60 border border-neutral-900 p-4 rounded-xl mb-8">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by name, description, length..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900/40 border border-neutral-800 rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filters Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex lg:hidden items-center gap-2 px-4 py-2 border border-neutral-800 hover:border-neutral-700 bg-neutral-900/30 hover:bg-neutral-900/60 rounded text-sm cursor-pointer transition-colors duration-300">
                  <SlidersHorizontal className="h-4 w-4 text-brand-gold" />
                  <span>Filters</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-black text-white border-r border-brand-gold/25 w-[300px]">
                <SheetHeader className="pb-6 border-b border-neutral-900 mb-6">
                  <SheetTitle className="text-lg font-serif text-gradient-gold">
                    Filter boutique
                  </SheetTitle>
                </SheetHeader>
                <FiltersContent />
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 hidden sm:inline">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-900/50 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-gold cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Additions</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block space-y-8 bg-neutral-950/40 border border-neutral-900 p-6 rounded-xl h-fit">
            <FiltersContent />
          </aside>

          {/* Products Column */}
          <div className="lg:col-span-3 space-y-6">
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-neutral-950/20 border border-dashed border-neutral-900 rounded-xl space-y-4">
                <p className="text-neutral-400 font-serif text-lg">No products match your filters.</p>
                <Button variant="luxury" size="sm" onClick={resetFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {sortedProducts.map((product) => {
                  const hasSale = product.sale_price !== null
                  const mainImg = product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1595959183075-c1d09e57ad44?w=400"
                  const wishlisted = isInWishlist(product.id)

                  return (
                    <div key={product.id} className="group flex flex-col justify-between bg-black/40 border border-neutral-900 rounded-xl overflow-hidden transition-all duration-300 hover:border-brand-gold/25 hover:shadow-[0_0_15px_rgba(212,175,55,0.08)]">
                      
                      {/* Image & Action Overlay */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 img-zoom">
                        <Link href={`/product/${product.slug}`}>
                          <img
                            src={mainImg}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </Link>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                          <Badge variant="luxury" className="text-[9px] py-0.5 tracking-wider uppercase">
                            {product.wig_type}
                          </Badge>
                          {hasSale && (
                            <Badge variant="destructive" className="text-[9px] py-0.5 tracking-wider uppercase font-semibold">
                              Sale
                            </Badge>
                          )}
                        </div>

                        {/* Actions Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
                          <button
                            onClick={() => toggleWishlist(product)}
                            className={`p-2.5 rounded-full border bg-black/80 hover:bg-brand-gold hover:text-black transition-all duration-300 cursor-pointer ${
                              wishlisted ? "border-brand-gold text-brand-gold" : "border-neutral-800 text-neutral-400"
                            }`}
                            title={wishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                          >
                            <Heart className={`h-4.5 w-4.5 ${wishlisted ? "fill-current" : ""}`} />
                          </button>
                          <button
                            onClick={() => addToCart(product, 1, "Medium", "180%")}
                            className="p-2.5 rounded-full border border-neutral-800 bg-black/80 text-neutral-400 hover:text-black hover:bg-brand-gold hover:border-brand-gold transition-all duration-300 cursor-pointer"
                            title="Add to Bag"
                          >
                            <ShoppingCart className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <Link href={`/product/${product.slug}`} className="hover:text-brand-gold transition-colors duration-300">
                            <h3 className="font-serif text-base font-semibold line-clamp-1 text-white">{product.name}</h3>
                          </Link>
                          <p className="text-xs text-neutral-400 font-light">
                            {product.hair_length} | {product.hair_color}
                          </p>
                        </div>
                        <div className="flex items-baseline justify-between pt-1">
                          <div className="flex items-center gap-2">
                            {hasSale ? (
                              <>
                                <span className="text-brand-gold font-semibold text-base">
                                  {formatPrice(product.sale_price!)}
                                </span>
                                <span className="text-neutral-500 line-through text-xs">
                                  {formatPrice(product.price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-brand-gold font-semibold text-base">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  )
                })}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}
