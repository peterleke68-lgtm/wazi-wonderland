import { MetadataRoute } from "next"
import { getProducts, getBlogPosts } from "@/lib/services"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://waziwonderland.com"

  // Base storefront routes
  const routes = [
    "",
    "/about",
    "/contact",
    "/shop",
    "/blog",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }))

  // Dynamic products sitemap entries
  let productEntries: MetadataRoute.Sitemap = []
  try {
    const products = await getProducts()
    productEntries = products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product.created_at || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  } catch (e) {
    console.error("Failed to generate dynamic product entries for sitemap:", e)
  }

  // Dynamic blog post sitemap entries
  let blogEntries: MetadataRoute.Sitemap = []
  try {
    const posts = await getBlogPosts()
    blogEntries = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.published_at || post.created_at || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  } catch (e) {
    console.error("Failed to generate dynamic blog entries for sitemap:", e)
  }

  return [...routes, ...productEntries, ...blogEntries]
}
