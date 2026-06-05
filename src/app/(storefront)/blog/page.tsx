"use client"

import React, { useEffect, useState } from "react"
import { getBlogPosts } from "@/lib/services"
import { BlogPost } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, User, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const data = await getBlogPosts()
      setPosts(data)
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide text-gradient-gold">
            THE WAZI JOURNAL
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm uppercase tracking-widest leading-relaxed">
            Hair care tutorials, buying guides, and styling inspiration from couture stylists.
          </p>
          <div className="section-divider mt-4" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-950/20 border border-neutral-900 rounded-xl">
            <p className="text-neutral-400 font-serif">No articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {posts.map((post) => {
              const formattedDate = post.published_at
                ? new Date(post.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recent Update"

              return (
                <article key={post.id} className="group bg-neutral-950/40 border border-neutral-900 rounded-xl overflow-hidden flex flex-col justify-between hover:border-brand-gold/25 transition-all duration-300">
                  
                  {/* Article Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-neutral-900 img-zoom shrink-0">
                    <Link href={`/blog/${post.slug}`}>
                      <img
                        src={post.featured_image_url || "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600"}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    {post.category && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge variant="luxury" className="text-[9px] uppercase tracking-wider">
                          {post.category.name}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Body & Texts */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      
                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-neutral-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-brand-gold" />
                          <span>{formattedDate}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-brand-gold" />
                          <span>5 Min Read</span>
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${post.slug}`} className="block group-hover:text-brand-gold transition-colors duration-300">
                        <h2 className="font-serif text-lg md:text-xl font-bold leading-snug">
                          {post.title}
                        </h2>
                      </Link>

                      {/* Snippet */}
                      <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-light line-clamp-3">
                        {post.content.replace(/#{1,6}\s/g, "").replace(/\*\*|__/g, "").substring(0, 160)}...
                      </p>

                    </div>

                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-xs text-brand-gold hover:text-white uppercase tracking-widest font-semibold transition-colors duration-300 self-start">
                      <span>Read Article</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                  </div>

                </article>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
