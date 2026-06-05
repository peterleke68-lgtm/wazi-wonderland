export type RoleId = "super_admin" | "content_manager" | "product_manager" | "order_manager"

export interface Role {
  id: RoleId
  name: string
  description: string
}

export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  shipping_address: ShippingAddress | null
  created_at: string
}

export interface Staff {
  id: string
  role_id: RoleId
  status: "active" | "suspended"
  created_at: string
  profile?: Profile
}

export interface ShippingAddress {
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  price: number
  sale_price: number | null
  wig_type: "Human Hair" | "Lace Front" | "Closure" | "Frontal" | "Colored" | "Custom"
  hair_length: string // e.g. "18 inches"
  hair_color: string // e.g. "Natural Black"
  stock_quantity: number
  is_available: boolean
  is_featured: boolean
  specifications: ProductSpecifications | null
  video_url: string | null
  created_at: string
  category?: Category
  images?: ProductImage[]
  variants?: ProductVariant[]
}

export interface ProductSpecifications {
  cap_size?: string // Small, Medium, Large
  density?: string // 150%, 180%, 200%
  lace_material?: string // HD Lace, Swiss Lace
  [key: string]: any
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  sort_order: number
}

export interface ProductVariant {
  id: string
  product_id: string
  cap_size: "Small" | "Medium" | "Large" | null
  hair_density: "150%" | "180%" | "200%" | null
  price_modifier: number // amount added/subtracted
  stock_quantity: number
}

export interface Order {
  id: string
  profile_id: string | null
  customer_email: string
  customer_name: string
  shipping_address: ShippingAddress
  subtotal: number
  discount_amount: number
  total: number
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled"
  payment_method: "simulated" | "stripe" | "paypal"
  payment_status: "pending" | "paid" | "failed"
  tracking_number: string | null
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  variant_id: string | null
  quantity: number
  price: number
  product?: Product
  variant?: ProductVariant
}

export interface Wishlist {
  id: string
  profile_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
}

export interface Tag {
  id: string
  name: string
}

export interface BlogPost {
  id: string
  author_id: string | null
  category_id: string | null
  title: string
  slug: string
  content: string
  featured_image_url: string | null
  status: "draft" | "published" | "archived"
  published_at: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
  created_at: string
  author?: Profile
  category?: BlogCategory
  tags?: Tag[]
}

export interface CmsPage {
  id: string
  title: string
  slug: string
  is_published: boolean
  seo_title: string | null
  seo_description: string | null
  created_at: string
  sections?: CmsSection[]
}

export type CmsSectionType =
  | "hero"
  | "banner"
  | "rich_text"
  | "product_grid"
  | "testimonials"
  | "video"
  | "gallery"
  | "faq"
  | "newsletter"
  | "cta"
  | "custom_html"

export interface CmsSection {
  id: string
  page_id: string
  type: CmsSectionType
  content: any // JSON containing title, text, image, action button link etc.
  sort_order: number
  is_visible: boolean
}

export interface Testimonial {
  id: string
  author: string
  role_or_title: string | null
  rating: number
  text: string
  image_url: string | null
  is_approved: boolean
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  sort_order: number
}

export interface NewsletterSubscriber {
  id: string
  email: string
  status: "subscribed" | "unsubscribed"
  subscribed_at: string
}

export interface Setting {
  key: string
  value: any
}
