"use client"

import React from "react"
import { useWishlist } from "@/lib/context/WishlistContext"
import { useCart } from "@/lib/context/CartContext"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-gradient-gold">
            YOUR WISHLIST
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm uppercase tracking-widest leading-relaxed">
            Your curated collection of luxury wigs and premium hair systems.
          </p>
          <div className="section-divider mt-4" />
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-24 bg-neutral-950/20 border border-dashed border-neutral-900 rounded-xl space-y-6 max-w-xl mx-auto">
            <Heart className="h-16 w-16 text-neutral-600 mx-auto" />
            <p className="text-neutral-400 font-serif text-lg">Your wishlist is currently empty.</p>
            <Link href="/shop">
              <Button variant="luxury">Explore Boutique</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {wishlist.map((product) => {
              const hasSale = product.sale_price !== null
              const mainImg = product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1595959183075-c1d09e57ad44?w=400"

              return (
                <div key={product.id} className="group flex flex-col justify-between bg-black/40 border border-neutral-900 rounded-xl overflow-hidden transition-all duration-300 hover:border-brand-gold/25 hover:shadow-[0_0_15px_rgba(212,175,55,0.08)]">
                  
                  {/* Image & Hover Action Overlay */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 img-zoom">
                    <Link href={`/product/${product.slug}`}>
                      <img
                        src={mainImg}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    {/* Remove Action */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 p-2.5 rounded-full border border-neutral-800 bg-black/80 text-neutral-400 hover:text-red-400 transition-all duration-300 cursor-pointer z-10"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="absolute top-3 left-3 z-10">
                      <Badge variant="luxury" className="text-[9px] py-0.5 tracking-wider uppercase">
                        {product.wig_type}
                      </Badge>
                    </div>

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                      <Button
                        onClick={() => {
                          addToCart(product, 1, "Medium", "180%")
                          removeFromWishlist(product.id)
                        }}
                        variant="gold"
                        size="sm"
                        className="text-xs uppercase tracking-widest font-semibold"
                      >
                        <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                        Move to Bag
                      </Button>
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
  )
}
