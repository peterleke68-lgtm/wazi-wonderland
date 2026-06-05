"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useCmsBuilder } from "@/lib/context/CmsBuilderContext"
import { getFeaturedProducts } from "@/lib/services"
import { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { ArrowUp, ArrowDown, Eye, ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/lib/context/CartContext"
import { useWishlist } from "@/lib/context/WishlistContext"

interface CmsProductGridProps {
  id: string
  content: {
    title: string
    subtitle: string
  }
  index: number
}

export default function CmsProductGrid({ id, content, index }: CmsProductGridProps) {
  const {
    isEditing,
    activeSectionId,
    setActiveSectionId,
    updateSectionContent,
    reorderSections,
    toggleSectionVisibility,
    sections
  } = useCmsBuilder()

  const [products, setProducts] = useState<Product[]>([])
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    async function fetchProducts() {
      const data = await getFeaturedProducts()
      setProducts(data)
    }
    fetchProducts()
  }, [])

  const handleTextChange = (field: string, value: string) => {
    updateSectionContent(id, { [field]: value })
  }

  const isSelected = activeSectionId === id

  return (
    <div
      onClick={(e) => {
        if (isEditing) {
          e.stopPropagation()
          setActiveSectionId(id)
        }
      }}
      className={`relative py-16 md:py-24 bg-neutral-950 transition-all duration-300 ${
        isEditing
          ? `cursor-pointer border-2 m-2 ${
              isSelected ? "border-brand-gold ring-2 ring-brand-gold/20" : "border-dashed border-neutral-700 hover:border-neutral-500"
            }`
          : ""
      }`}
    >
      {/* Editor Controls */}
      {isEditing && (
        <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 bg-black/85 border border-neutral-800 p-1.5">
          <span className="text-[10px] text-brand-gold font-bold px-2 uppercase tracking-wider">
            Product Grid Section
          </span>
          <button
            disabled={index === 0}
            onClick={(e) => {
              e.stopPropagation()
              reorderSections(index, index - 1)
            }}
            className="p-1 hover:bg-neutral-800 rounded disabled:opacity-30 text-neutral-400"
            title="Move Up"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            disabled={index === sections.length - 1}
            onClick={(e) => {
              e.stopPropagation()
              reorderSections(index, index + 1)
            }}
            className="p-1 hover:bg-neutral-800 rounded disabled:opacity-30 text-neutral-400"
            title="Move Down"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleSectionVisibility(id)
            }}
            className="p-1 hover:bg-neutral-800 rounded text-neutral-400"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          {isEditing ? (
            <div className="space-y-2 max-w-xl mx-auto">
              <input
                type="text"
                value={content.title}
                onChange={(e) => handleTextChange("title", e.target.value)}
                className="w-full text-center bg-neutral-900 border border-neutral-800 rounded px-3 py-1 font-serif text-xl font-bold text-white focus:outline-none"
              />
              <input
                type="text"
                value={content.subtitle}
                onChange={(e) => handleTextChange("subtitle", e.target.value)}
                className="w-full text-center bg-neutral-900 border border-neutral-800 rounded px-3 py-1 text-xs text-neutral-400 focus:outline-none"
              />
            </div>
          ) : (
            <>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-gradient-gold tracking-wide">
                {content.title}
              </h2>
              <p className="text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
                {content.subtitle}
              </p>
              <div className="section-divider mt-4" />
            </>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => {
            const hasSale = product.sale_price !== null
            const mainImg = product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1595959183075-c1d09e57ad44?w=400"
            const wishlisted = isInWishlist(product.id)

            return (
              <div key={product.id} className="group flex flex-col justify-between bg-black/40 border-2 border-neutral-900 rounded-none overflow-hidden transition-all duration-300 hover:border-brand-gold hover:shadow-[5px_5px_0px_0px_rgba(224,62,107,1)]">
                
                {/* Image & Badges */}
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

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`p-2.5 border-2 bg-black/85 hover:bg-brand-gold hover:text-black transition-all duration-300 cursor-pointer ${
                        wishlisted ? "border-brand-gold text-brand-gold" : "border-neutral-800 text-neutral-400"
                      }`}
                      title={wishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                    >
                      <Heart className={`h-4.5 w-4.5 ${wishlisted ? "fill-current" : ""}`} />
                    </button>
                    <button
                      onClick={() => addToCart(product, 1, "Medium", "180%")}
                      className="p-2.5 border-2 border-neutral-800 bg-black/85 text-neutral-400 hover:text-black hover:bg-brand-gold hover:border-brand-gold transition-all duration-300 cursor-pointer"
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
                    <p className="text-xs text-neutral-400 font-light flex items-center justify-between">
                      <span>{product.hair_length} | {product.hair_color}</span>
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

      </div>
    </div>
  )
}
