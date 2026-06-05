"use client"

import React, { useEffect, useState } from "react"
import { useCmsBuilder } from "@/lib/context/CmsBuilderContext"
import CmsSectionRenderer from "@/components/cms/CmsSectionRenderer"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Plus, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react"
import { getProducts, getCategories } from "@/lib/services"
import { Product, Category } from "@/types"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { useCart } from "@/lib/context/CartContext"
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mockData"

export default function HomePage() {
  const { sections, loadSections, isEditing } = useCmsBuilder()
  const [loading, setLoading] = useState(true)
  const [carouselProducts, setCarouselProducts] = useState<Product[]>([])
  const [dbCategories, setDbCategories] = useState<Category[]>([])

  useEffect(() => {
    async function init() {
      await loadSections("home")
      try {
        const fetchedProducts = await getProducts()
        const featured = fetchedProducts.filter(p => p.is_featured)
        const carouselData = featured.length >= 4 ? featured.slice(0, 4) : fetchedProducts.slice(0, 4)
        setCarouselProducts(carouselData.length > 0 ? carouselData : MOCK_PRODUCTS.slice(0, 4))

        const fetchedCategories = await getCategories()
        setDbCategories(fetchedCategories.length > 0 ? fetchedCategories : MOCK_CATEGORIES)
      } catch (err) {
        console.error("Error loading home page components:", err)
        setCarouselProducts(MOCK_PRODUCTS.slice(0, 4))
        setDbCategories(MOCK_CATEGORIES)
      }
      setLoading(false)
    }
    init()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8 p-4 max-w-7xl mx-auto py-12">
        <Skeleton className="h-[60vh] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-[30vh] w-full" />
      </div>
    )
  }

  const visibleSections = sections.filter(s => s.is_visible || isEditing)

  return (
    <div className="relative min-h-screen bg-black">
      
      {visibleSections.map((section, index) => (
        <React.Fragment key={section.id}>
          <CmsSectionRenderer
            section={section}
            index={index}
          />
          {/* About Us Excerpt Section inserted after Hero (index 0) */}
          {index === 0 && (
            <AboutUsExcerpt />
          )}
          {/* Product Carousel Section inserted after Banner (index 1) */}
          {index === 1 && (
            <ProductCarousel products={carouselProducts} categories={dbCategories} />
          )}
        </React.Fragment>
      ))}

      {/* Quick edit helper banner when in CMS mode and page is empty */}
      {isEditing && sections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-400 space-y-4">
          <p className="font-serif text-lg">No sections present on this page yet.</p>
          <Button variant="luxury" size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Section Block
          </Button>
        </div>
      )}
      
      {/* Brand highlight section - static premium section */}
      <section className="bg-black py-20 border-t-2 border-neutral-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-wider text-gradient-gold">
            THE WAZI STANDARD
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base leading-relaxed text-neutral-400">
            Every Wazi wig is individually hand-knotted, featuring ultra-thin invisible HD Swiss lace that mimics a natural scalp. We source only 100% human virgin cuticle-aligned hair, ensuring long-lasting durability, natural shine, and tangle-free flow.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-6 max-w-4xl mx-auto">
            <div className="border-2 border-neutral-900 bg-neutral-950/40 p-6 rounded-none">
              <h3 className="font-serif text-brand-gold font-bold text-lg mb-2">100% Virgin Hair</h3>
              <p className="text-xs text-neutral-500">Unprocessed, cuticle-aligned strands sourced for maximum longevity and styling versatility.</p>
            </div>
            <div className="border-2 border-neutral-900 bg-neutral-950/40 p-6 rounded-none">
              <h3 className="font-serif text-brand-gold font-bold text-lg mb-2">Invisible Melt</h3>
              <p className="text-xs text-neutral-500">HD Swiss lace bases that melt completely into any skin tone without harsh lines.</p>
            </div>
            <div className="border-2 border-neutral-900 bg-neutral-950/40 p-6 rounded-none">
              <h3 className="font-serif text-brand-gold font-bold text-lg mb-2">Couture Coloring</h3>
              <p className="text-xs text-neutral-500">Masterfully custom-colored balayages, highlights, and shadow roots by expert colorists.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

function AboutUsExcerpt() {
  return (
    <section className="bg-black py-24 border-b-2 border-neutral-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Excerpt */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold tracking-widest text-brand-gold uppercase block">
              The Couture Experience
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-extrabold tracking-wide text-white leading-tight">
              Flawless Craftsmanship. <br />
              <span className="text-gradient-gold">Undetectable Melt.</span>
            </h2>
            <div className="h-[3px] w-24 bg-brand-pink" />
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed max-w-xl">
              Born from a passion for flawless craftsmanship, Wazi Wonderland creates high-end hair systems for the discerning individual. Every Wazi wig is individually hand-knotted, featuring ultra-thin invisible HD Swiss lace that mimics a natural scalp. We source only 100% human virgin cuticle-aligned hair, ensuring long-lasting durability, natural shine, and styling versatility.
            </p>
            <p className="italic text-brand-pink font-serif text-lg md:text-xl border-l-2 border-brand-gold pl-4 my-4">
              &ldquo;We believe your hair is your crown, and every piece we create is treated as a work of fine art.&rdquo;
            </p>
            <div className="pt-2">
              <Link href="/about">
                <Button variant="luxury" size="lg">
                  Discover Our Story
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Fashion Image with Bold Border and Drop Shadow */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative border-2 border-brand-gold shadow-[8px_8px_0px_0px_rgba(224,62,107,1)] transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(224,62,107,1)] bg-neutral-900 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&auto=format&fit=crop&q=80"
                alt="Wazi Luxury Craft"
                className="w-full max-w-[400px] h-[450px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCarousel({ products, categories }: { products: Product[], categories: Category[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { addToCart } = useCart()

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % products.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  if (products.length === 0) return null

  const activeProduct = products[activeIndex]
  const hasSale = activeProduct.sale_price !== null
  const productImg = activeProduct.images?.[0]?.image_url || "https://images.unsplash.com/photo-1595959183075-c1d09e57ad44?w=600"

  return (
    <section className="bg-neutral-950 py-24 border-b-2 border-neutral-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-pink uppercase block">
            Couture Carousel
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-extrabold text-gradient-gold tracking-wide">
            Curated Masterpieces
          </h2>
          <div className="section-divider mt-4" />
        </div>

        {/* Carousel Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Image Column (Left) */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <button
              onClick={handlePrev}
              className="absolute left-2 z-20 p-3 bg-black/80 border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black cursor-pointer shadow-[3px_3px_0px_0px_rgba(224,62,107,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200"
              aria-label="Previous Product"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="relative border-2 border-brand-gold shadow-[8px_8px_0px_0px_rgba(224,62,107,1)] bg-black overflow-hidden aspect-[3/4] w-full max-w-[380px]">
              <img
                src={productImg}
                alt={activeProduct.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <button
              onClick={handleNext}
              className="absolute right-2 z-20 p-3 bg-black/80 border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black cursor-pointer shadow-[3px_3px_0px_0px_rgba(224,62,107,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200"
              aria-label="Next Product"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Details Column (Right) */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-semibold tracking-wider text-brand-gold border border-brand-gold/30 px-3 py-1 uppercase block w-fit">
              {activeProduct.wig_type || "Premium Wig"}
            </span>
            
            <h3 className="font-serif text-2xl md:text-4xl font-bold text-white tracking-wide">
              {activeProduct.name}
            </h3>

            {/* Price Row */}
            <div className="flex items-center gap-3">
              {hasSale ? (
                <>
                  <span className="text-brand-pink font-bold text-2xl">
                    {formatPrice(activeProduct.sale_price!)}
                  </span>
                  <span className="text-neutral-500 line-through text-lg">
                    {formatPrice(activeProduct.price)}
                  </span>
                </>
              ) : (
                <span className="text-brand-pink font-bold text-2xl">
                  {formatPrice(activeProduct.price)}
                </span>
              )}
            </div>

            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              {activeProduct.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-300 border-t border-b border-neutral-900 py-4">
              <div>
                <span className="text-neutral-500 uppercase block">Length</span>
                <span className="font-semibold text-white">{activeProduct.hair_length}</span>
              </div>
              <div>
                <span className="text-neutral-500 uppercase block">Color</span>
                <span className="font-semibold text-white">{activeProduct.hair_color}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Button
                variant="luxury"
                size="lg"
                onClick={() => addToCart(activeProduct, 1, "Medium", "180%")}
                className="w-full sm:w-auto"
              >
                <ShoppingBag className="mr-1.5 h-4 w-4" />
                Add to Bag
              </Button>
              <Link href={`/product/${activeProduct.slug}`} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-brand-pink/50 text-brand-pink hover:bg-brand-pink/10"
                >
                  View Product Details
                </Button>
              </Link>
            </div>
            
            {/* Dots navigation indicator */}
            <div className="flex items-center gap-2 pt-4">
              {products.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 transition-all duration-300 ${
                    idx === activeIndex ? "w-8 bg-brand-pink" : "w-2 bg-neutral-800"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Categories display */}
        <div className="border-t border-neutral-900 pt-16 space-y-8">
          <h3 className="font-serif text-lg font-bold tracking-wider text-white uppercase text-center md:text-left">
            Explore All Collections
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative h-40 overflow-hidden border-2 border-neutral-900 bg-neutral-950 transition-all duration-300 hover:border-brand-pink hover:shadow-[4px_4px_0px_0px_rgba(212,175,55,1)]"
              >
                {/* Image overlay bg */}
                <div className="absolute inset-0 bg-neutral-950 opacity-40 group-hover:opacity-20 transition-opacity duration-300 z-10" />
                {cat.image_url && (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-3 z-20">
                  <span className="font-serif text-sm md:text-base font-bold text-white tracking-widest uppercase transition-colors duration-300 group-hover:text-brand-pink">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Shop Collection &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
