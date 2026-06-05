"use client"

import React, { use, useEffect, useState } from "react"
import { getBlogPostBySlug, getBlogPosts } from "@/lib/services"
import { BlogPost } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function BlogDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>
}) {
  const params = use(paramsPromise)
  const { toast } = useToast()
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState<BlogPost[]>([])

  useEffect(() => {
    async function loadData() {
      const data = await getBlogPostBySlug(params.slug)
      if (data) {
        setPost(data)
        
        // Load related
        const allPosts = await getBlogPosts()
        setRelated(allPosts.filter((p) => p.id !== data.id).slice(0, 2))
      }
      setLoading(false)
    }
    loadData()
  }, [params.slug])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied",
      description: "Article link has been copied to your clipboard.",
      variant: "gold",
    })
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 space-y-8">
        <Skeleton className="h-96 w-full rounded-xl" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 text-center">
        <p className="font-serif text-lg text-neutral-400">Article not found.</p>
        <Link href="/blog">
          <Button variant="luxury">Back to Journal</Button>
        </Link>
      </div>
    )
  }

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recent Update"

  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white uppercase tracking-widest mb-8 transition-colors duration-300">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Journal</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {post.category && (
              <Badge variant="luxury" className="text-[10px] uppercase tracking-wider font-semibold">
                {post.category.name}
              </Badge>
            )}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-brand-gold cursor-pointer transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share Article</span>
            </button>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-[10px] text-neutral-500 uppercase tracking-widest border-b border-neutral-900 pb-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-brand-gold" />
              <span>{formattedDate}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand-gold" />
              <span>5 Min Read</span>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-brand-gold" />
              <span>Wazi Hair Director</span>
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="relative aspect-video overflow-hidden rounded-xl border border-neutral-900 bg-neutral-900 mt-8 mb-10">
            <img src={post.featured_image_url} alt={post.title} className="h-full w-full object-cover" />
          </div>
        )}

        {/* Content Body (Render Simple Markdown parsing) */}
        <div className="prose prose-invert max-w-none text-sm md:text-base text-neutral-300 leading-relaxed space-y-6 font-light">
          {post.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={index} className="font-serif text-lg md:text-xl font-bold text-white pt-4">
                  {paragraph.replace("### ", "")}
                </h3>
              )
            }
            if (paragraph.startsWith("- ")) {
              return (
                <ul key={index} className="list-disc pl-6 space-y-2 text-neutral-400 text-xs md:text-sm">
                  {paragraph.split("\n").map((li, idx) => (
                    <li key={idx}>{li.replace("- ", "")}</li>
                  ))}
                </ul>
              )
            }
            return <p key={index}>{paragraph}</p>
          })}
        </div>

        {/* Related Articles Divider */}
        {related.length > 0 && (
          <div className="pt-16 mt-16 border-t border-neutral-900 space-y-8">
            <h3 className="font-serif text-lg font-bold tracking-wide text-gradient-gold">RECOMMENDED READING</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((rel) => (
                <div key={rel.id} className="border border-neutral-900 bg-neutral-950/40 p-5 rounded-lg flex gap-4 items-center">
                  <div className="h-16 w-16 shrink-0 rounded overflow-hidden bg-neutral-900">
                    <img src={rel.featured_image_url || ""} alt={rel.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <Link href={`/blog/${rel.slug}`} className="hover:text-brand-gold transition-colors duration-300">
                      <h4 className="text-xs font-semibold text-white truncate">{rel.title}</h4>
                    </Link>
                    <span className="text-[9px] text-neutral-500 block uppercase tracking-widest">Read Article</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
