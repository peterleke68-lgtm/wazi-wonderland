"use client"

import React, { use, useEffect, useState } from "react"
import { getProductBySlug, getFeaturedProducts } from "@/lib/services"
import { Product, ProductVariant } from "@/types"
import { useCart } from "@/lib/context/CartContext"
import { useWishlist } from "@/lib/context/WishlistContext"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Heart, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function ProductDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>
}) {
  const params = use(paramsPromise)
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  // Selection states
  const [activeImage, setActiveImage] = useState<string>("")
  const [selectedCapSize, setSelectedCapSize] = useState<"Small" | "Medium" | "Large">("Medium")
  const [selectedDensity, setSelectedDensity] = useState<"150%" | "180%" | "200%">("180%")
  const [quantity, setQuantity] = useState<number>(1)

  useEffect(() => {
    async function loadData() {
      const prod = await getProductBySlug(params.slug)
      if (prod) {
        setProduct(prod)
        if (prod.images && prod.images.length > 0) {
          setActiveImage(prod.images[0].image_url)
        }
        
        // Load related
        const allFeatured = await getFeaturedProducts()
        setRelatedProducts(allFeatured.filter((p) => p.id !== prod.id).slice(0, 4))
      }
      setLoading(false)
    }
    loadData()
  }, [params.slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="h-[500px] w-full rounded-xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 text-center">
        <p className="font-serif text-lg text-neutral-400">Product not found.</p>
        <Link href="/shop">
          <Button variant="luxury">Back to Boutique</Button>
        </Link>
      </div>
    )
  }

  // Calculate pricing modifier based on selections
  let basePrice = product.sale_price || product.price
  let activeVariant: ProductVariant | null = null

  if (product.variants) {
    const matching = product.variants.find(
      (v) => v.cap_size === selectedCapSize && v.hair_density === selectedDensity
    )
    if (matching) {
      activeVariant = matching
      basePrice += Number(matching.price_modifier || 0)
    }
  }

  const wishlisted = isInWishlist(product.id)

  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white uppercase tracking-widest mb-8 transition-colors duration-300">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Boutique</span>
        </Link>

        {/* Core details grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Images Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950/40">
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.image_url)}
                    className={`h-20 w-16 shrink-0 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                      activeImage === img.image_url ? "border-brand-gold ring-1 ring-brand-gold/15" : "border-neutral-900 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img.image_url} alt="Thumbnail" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Video Showcase Player */}
            {product.video_url && (
              <div className="pt-4 border-t border-neutral-900">
                <h3 className="font-serif text-xs font-semibold tracking-wider text-neutral-400 uppercase mb-3">Video Walkthrough</h3>
                <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-900 bg-neutral-900">
                  <video controls className="h-full w-full object-cover" src={product.video_url} />
                </div>
              </div>
            )}
          </div>

          {/* Description & Configurations */}
          <div className="space-y-6 md:space-y-8">
            
            <div className="space-y-3">
              <Badge variant="luxury" className="text-[10px] tracking-wider uppercase font-semibold">
                {product.wig_type}
              </Badge>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4 pt-1">
                <span className="text-2xl font-serif text-brand-gold font-bold">
                  {formatPrice(basePrice)}
                </span>
                {product.sale_price !== null && (
                  <span className="text-neutral-500 line-through text-sm">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            <Separator className="bg-neutral-900" />

            {/* Description */}
            <p className="text-neutral-400 text-sm leading-relaxed font-light">
              {product.description}
            </p>

            {/* Customizers */}
            <div className="space-y-6">
              
              {/* Cap Size customizer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs tracking-wider uppercase font-semibold text-neutral-400">
                  <span>Cap Size</span>
                  <span className="text-neutral-500 font-normal">Medium (Standard)</span>
                </div>
                <div className="flex gap-3">
                  {(["Small", "Medium", "Large"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedCapSize(size)}
                      className={`flex-1 py-2.5 rounded text-xs uppercase tracking-widest font-semibold border transition-all cursor-pointer ${
                        selectedCapSize === size
                          ? "bg-brand-gold border-brand-gold text-black"
                          : "border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Density customizer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs tracking-wider uppercase font-semibold text-neutral-400">
                  <span>Hair Density</span>
                  <span className="text-neutral-500 font-normal">Higher density is fuller</span>
                </div>
                <div className="flex gap-3">
                  {(["150%", "180%", "200%"] as const).map((density) => (
                    <button
                      key={density}
                      onClick={() => setSelectedDensity(density)}
                      className={`flex-1 py-2.5 rounded text-xs uppercase tracking-widest font-semibold border transition-all cursor-pointer ${
                        selectedDensity === density
                          ? "bg-brand-gold border-brand-gold text-black"
                          : "border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantities & Add-to-bag */}
              <div className="pt-4 flex gap-4">
                <div className="flex items-center border border-neutral-800 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-neutral-400 hover:text-white font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-neutral-400 hover:text-white font-bold"
                  >
                    +
                  </button>
                </div>
                
                <Button
                  onClick={() => addToCart(product, quantity, selectedCapSize, selectedDensity)}
                  className="flex-1"
                  variant="luxury"
                  size="lg"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Shopping Bag
                </Button>

                <Button
                  onClick={() => toggleWishlist(product)}
                  variant="outline"
                  size="lg"
                  className={`border-neutral-800 hover:bg-neutral-900 ${
                    wishlisted ? "text-brand-gold border-brand-gold/30 bg-brand-gold/5" : "text-neutral-400"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${wishlisted ? "fill-current" : ""}`} />
                </Button>
              </div>

            </div>

            {/* Quality Seals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-900 text-neutral-400 text-xs font-light leading-relaxed">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <span>100% Guaranteed Authenticity</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <span>Complimentary FedEx Ground Shipping</span>
              </div>
              <div className="flex items-start gap-2.5">
                <RotateCcw className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <span>Hassle-Free 14 Day Returns</span>
              </div>
            </div>

            {/* Specifications Details */}
            {product.specifications && (
              <div className="pt-6 border-t border-neutral-900 space-y-4">
                <h3 className="font-serif text-sm font-semibold tracking-wider text-white uppercase">Couture Specifications</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="border-b border-neutral-900 pb-2">
                      <span className="text-neutral-500 block capitalize">{key.replace("_", " ")}</span>
                      <span className="text-neutral-300 font-medium">{val as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}
