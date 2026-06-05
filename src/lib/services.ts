import { createClient } from "./supabase/client"
import { Product, Category, BlogPost, Testimonial, FAQ, CmsSection, Order } from "@/types"

// ---------------- PRODUCTS & CATEGORIES ----------------

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
  
  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }
  return data || []
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*), product_images(*), product_variants(*)")
    .eq("is_available", true)
  
  if (error) {
    console.error("Error fetching products:", error)
    return []
  }
  return data as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*), product_images(*), product_variants(*)")
    .eq("slug", slug)
    .single()
  
  if (error) {
    console.error(`Error fetching product by slug ${slug}:`, error)
    return null
  }
  return data as Product
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*), product_images(*), product_variants(*)")
    .eq("is_available", true)
    .eq("is_featured", true)
  
  if (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
  return data as Product[]
}

// ---------------- BLOG ----------------

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, blog_categories(*), profiles(*)")
    .eq("status", "published")
  
  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
  return data as unknown as BlogPost[]
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, blog_categories(*), profiles(*)")
    .eq("slug", slug)
    .single()
  
  if (error) {
    console.error(`Error fetching blog post by slug ${slug}:`, error)
    return null
  }
  return data as unknown as BlogPost
}

// ---------------- TESTIMONIALS & FAQS ----------------

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_approved", true)
  
  if (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
  return data || []
}

export async function getFAQs(): Promise<FAQ[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true })
  
  if (error) {
    console.error("Error fetching FAQs:", error)
    return []
  }
  return data || []
}

// ---------------- CMS SYSTEM ----------------

export async function getCmsPageSections(pageSlug: string): Promise<CmsSection[]> {
  const supabase = createClient()
  
  const { data: page, error: pageError } = await supabase
    .from("cms_pages")
    .select("id")
    .eq("slug", pageSlug)
    .single()

  if (pageError || !page) {
    console.error(`Page lookup failed for slug: ${pageSlug}`, pageError)
    return []
  }

  const { data: sections, error: secError } = await supabase
    .from("cms_sections")
    .select("*")
    .eq("page_id", page.id)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })

  if (secError) {
    console.error(`Error fetching CMS sections for page ${pageSlug}:`, secError)
    return []
  }

  return sections || []
}

export async function saveCmsSection(sectionId: string, pageSlug: string, content: any): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from("cms_sections")
    .update({ content })
    .eq("id", sectionId)
  
  if (error) {
    console.error(`Failed to save CMS section ${sectionId}:`, error)
    return false
  }
  return true
}

export async function saveCmsSections(pageSlug: string, sections: CmsSection[]): Promise<boolean> {
  const supabase = createClient()
  try {
    for (const sec of sections) {
      const { error } = await supabase
        .from("cms_sections")
        .update({ content: sec.content, sort_order: sec.sort_order, is_visible: sec.is_visible })
        .eq("id", sec.id)
      if (error) throw error
    }
    return true
  } catch (e) {
    console.error(`Failed to save CMS sections in bulk for page ${pageSlug}:`, e)
    return false
  }
}

// ---------------- ORDERS ----------------

export async function createOrder(orderData: Omit<Order, "id" | "created_at">): Promise<Order> {
  const supabase = createClient()
  
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([{
      profile_id: orderData.profile_id,
      customer_email: orderData.customer_email,
      customer_name: orderData.customer_name,
      shipping_address: orderData.shipping_address,
      subtotal: orderData.subtotal,
      discount_amount: orderData.discount_amount,
      total: orderData.total,
      status: orderData.status,
      payment_method: orderData.payment_method,
      payment_status: orderData.payment_status,
      tracking_number: orderData.tracking_number
    }])
    .select()
    .single()

  if (orderError || !order) {
    throw new Error(`Failed to create order record: ${orderError?.message || "Unknown error"}`)
  }

  if (orderData.order_items && orderData.order_items.length > 0) {
    const itemsToInsert = orderData.order_items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsToInsert)

    if (itemsError) {
      console.error(`Failed to insert order items for order ${order.id}:`, itemsError)
    }
  }

  return order as Order
}

export async function getOrders(emailOrProfileId?: string): Promise<Order[]> {
  const supabase = createClient()
  let query = supabase.from("orders").select("*, order_items(*, product:products(*), variant:product_variants(*))")
  
  if (emailOrProfileId) {
    if (emailOrProfileId.includes("@")) {
      query = query.eq("customer_email", emailOrProfileId)
    } else {
      query = query.eq("profile_id", emailOrProfileId)
    }
  }
  
  const { data, error } = await query.order("created_at", { ascending: false })
  
  if (error) {
    console.error("Error fetching order records:", error)
    return []
  }
  return data as Order[]
}
