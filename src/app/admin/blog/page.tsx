"use client"

import React, { useEffect, useState } from "react"
import { getBlogPosts } from "@/lib/services"
import { BlogPost } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit2, Check, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Modal and Form states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  
  const [formValues, setFormValues] = useState({
    title: "",
    slug: "",
    content: "",
    featuredImage: "",
    status: "draft" as "draft" | "published" | "archived",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  })

  const loadPosts = async () => {
    setLoading(true)
    const data = await getBlogPosts()
    setPosts(data)
    setLoading(false)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleOpenAddModal = () => {
    setEditingPost(null)
    setFormValues({
      title: "",
      slug: "",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800",
      status: "draft",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (post: BlogPost) => {
    setEditingPost(post)
    setFormValues({
      title: post.title,
      slug: post.slug,
      content: post.content,
      featuredImage: post.featured_image_url || "",
      status: post.status,
      seoTitle: post.seo_title || "",
      seoDescription: post.seo_description || "",
      seoKeywords: post.seo_keywords || "",
    })
    setIsModalOpen(true)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newPostData: BlogPost = {
      id: editingPost?.id || `post-${Math.random().toString(36).substr(2, 9)}`,
      author_id: editingPost?.author_id || "auth-1",
      category_id: editingPost?.category_id || "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51",
      title: formValues.title,
      slug: formValues.slug || formValues.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      content: formValues.content,
      featured_image_url: formValues.featuredImage,
      status: formValues.status,
      published_at: formValues.status === "published" ? new Date().toISOString() : (editingPost?.published_at || null),
      seo_title: formValues.seoTitle || formValues.title,
      seo_description: formValues.seoDescription,
      seo_keywords: formValues.seoKeywords,
      created_at: editingPost?.created_at || new Date().toISOString()
    }

    if (editingPost) {
      setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? newPostData : p)))
      toast({ title: "Article Saved", description: `${formValues.title} has been successfully modified.`, variant: "gold" })
    } else {
      setPosts((prev) => [newPostData, ...prev])
      toast({ title: "Article Created", description: `${formValues.title} was added to drafts.`, variant: "gold" })
    }

    setIsModalOpen(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gradient-gold">JOURNAL EDITOR</h1>
          <p className="text-neutral-400 text-xs mt-1 uppercase tracking-widest leading-relaxed">
            Write blogs, create styling guides, and improve search relevance with SEO metadata.
          </p>
        </div>
        <Button variant="luxury" size="sm" onClick={handleOpenAddModal}>
          <Plus className="mr-1.5 h-4 w-4" />
          Write Article
        </Button>
      </div>

      {/* Blog list */}
      <div className="border border-neutral-900 bg-black/30 rounded-xl p-6">
        {loading ? (
          <div className="text-center py-12 text-neutral-500 text-xs">Loading published articles...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-xs">No articles. Write one now!</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="flex gap-4 p-4 items-center bg-neutral-950/40 border border-neutral-900 rounded-lg justify-between">
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-16 rounded overflow-hidden bg-neutral-900 shrink-0">
                    <img src={post.featured_image_url || ""} alt={post.title} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-white">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-neutral-500 uppercase tracking-widest">
                      <span>Status: <span className={post.status === "published" ? "text-brand-gold font-bold" : "text-neutral-400"}>{post.status}</span></span>
                      <span>Published: {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Draft"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditModal(post)}
                    className="p-2 text-neutral-400 hover:text-brand-gold hover:bg-neutral-900 rounded cursor-pointer transition-colors text-xs uppercase tracking-wider font-semibold border border-neutral-800"
                  >
                    <Edit2 className="h-3.5 w-3.5 inline mr-1" />
                    Edit
                  </button>
                  {post.status === "published" && (
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="text-neutral-400 border-neutral-800 text-[10px] uppercase tracking-wider h-8">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Preview
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-black text-white border border-brand-gold/25 w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif text-gradient-gold">
              {editingPost ? `Edit ${editingPost.title}` : "Compose New Article"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-1.5">
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                required
                value={formValues.title}
                onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                placeholder="The Secret to Melting HD Lace Wigs Seamlessly"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug (URL path)</Label>
                <Input
                  id="slug"
                  value={formValues.slug}
                  onChange={(e) => setFormValues({ ...formValues, slug: e.target.value })}
                  placeholder="the-secret-to-melting-hd-lace"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Publish State</Label>
                <select
                  id="status"
                  value={formValues.status}
                  onChange={(e) => setFormValues({ ...formValues, status: e.target.value as any })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-brand-gold cursor-pointer h-10"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="img">Featured Image URL</Label>
              <Input
                id="img"
                value={formValues.featuredImage}
                onChange={(e) => setFormValues({ ...formValues, featuredImage: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="body">Content Body (Markdown Supported)</Label>
              <Textarea
                id="body"
                required
                value={formValues.content}
                onChange={(e) => setFormValues({ ...formValues, content: e.target.value })}
                placeholder="Write your article markdown content here..."
                className="h-40"
              />
            </div>

            <Separator />
            <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider">SEO Settings</span>

            <div className="space-y-1.5">
              <Label htmlFor="seotitle">Meta Title</Label>
              <Input
                id="seotitle"
                value={formValues.seoTitle}
                onChange={(e) => setFormValues({ ...formValues, seoTitle: e.target.value })}
                placeholder="Luxury HD Lace Wigs Guide | Wazi Journal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="seodesc">Meta Description</Label>
                <Textarea
                  id="seodesc"
                  value={formValues.seoDescription}
                  onChange={(e) => setFormValues({ ...formValues, seoDescription: e.target.value })}
                  placeholder="Short summary for Google search relevance..."
                  className="h-16"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seokeys">Keywords</Label>
                <Textarea
                  id="seokeys"
                  value={formValues.seoKeywords}
                  onChange={(e) => setFormValues({ ...formValues, seoKeywords: e.target.value })}
                  placeholder="lace wigs, HD melt, hair care, Wazi boutique"
                  className="h-16"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" className="border-neutral-800" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="luxury">
                <Check className="mr-1 h-3.5 w-3.5" />
                Save Post
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}

const Separator = () => <div className="h-[1px] w-full bg-neutral-900 my-2" />
