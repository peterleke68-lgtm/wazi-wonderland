-- Init Schema for Wazi Wonderland (Luxury Wig Ecommerce)

-- 1. Roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

-- Seed basic roles
INSERT INTO public.roles (id, name, description) VALUES
('super_admin', 'Super Admin', 'Full system access and staff management'),
('content_manager', 'Content Manager', 'Manage pages, sections, blog posts, and settings'),
('product_manager', 'Product Manager', 'Manage categories, products, stock, and variants'),
('order_manager', 'Order Manager', 'Track and fulfill customer orders')
ON CONFLICT (id) DO NOTHING;

-- 2. Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Staff table
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id TEXT NOT NULL REFERENCES public.roles(id),
    status TEXT NOT NULL CHECK (status IN ('active', 'suspended')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT
);

-- 5. Products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    sale_price NUMERIC(10, 2),
    wig_type TEXT NOT NULL CHECK (wig_type IN ('Human Hair', 'Lace Front', 'Closure', 'Frontal', 'Colored', 'Custom')),
    hair_length TEXT NOT NULL,
    hair_color TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    specifications JSONB,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Product Images table
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- 7. Product Variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    cap_size TEXT CHECK (cap_size IN ('Small', 'Medium', 'Large')),
    hair_density TEXT CHECK (hair_density IN ('150%', '180%', '200%')),
    price_modifier NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    stock_quantity INTEGER NOT NULL DEFAULT 0
);

-- 8. Orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('simulated', 'stripe', 'paypal')),
    payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
    tracking_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Order Items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL
);

-- 10. Wishlists table
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(profile_id, product_id)
);

-- 11. Blog Categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

-- 12. Tags table
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

-- 13. Blog Posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 14. Blog Posts Tags join table
CREATE TABLE IF NOT EXISTS public.blog_posts_tags (
    post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- 15. CMS Pages table
CREATE TABLE IF NOT EXISTS public.cms_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 16. CMS Sections table
CREATE TABLE IF NOT EXISTS public.cms_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    content JSONB NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE
);

-- 17. Testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL,
    role_or_title TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    image_url TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE
);

-- 18. FAQs table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- 19. Newsletter Subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('subscribed', 'unsubscribed')) DEFAULT 'subscribed',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 20. Settings table
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);


-- ==================== RLS & SECURITY SETUP ====================

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Helper check function for staff roles
CREATE OR REPLACE FUNCTION public.is_staff(user_id UUID, required_roles TEXT[])
RETURNS BOOLEAN SECURITY DEFINER AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role_id INTO user_role FROM public.staff WHERE id = user_id AND status = 'active';
    RETURN user_role = ANY(required_roles) OR user_role = 'super_admin';
END;
$$ LANGUAGE plpgsql;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are readable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. Staff Policies
CREATE POLICY "Super Admins can view/modify all staff" ON public.staff
    FOR ALL USING (public.is_staff(auth.uid(), ARRAY['super_admin']));

CREATE POLICY "Staff members can view own staff details" ON public.staff
    FOR SELECT USING (auth.uid() = id);

-- 3. Products/Categories public read, staff write
CREATE POLICY "Products are readable by everyone" ON public.products
    FOR SELECT USING (is_available = true OR public.is_staff(auth.uid(), ARRAY['product_manager']));

CREATE POLICY "Staff can manage products" ON public.products
    FOR ALL USING (public.is_staff(auth.uid(), ARRAY['product_manager']));

CREATE POLICY "Categories are readable by everyone" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Staff can manage categories" ON public.categories
    FOR ALL USING (public.is_staff(auth.uid(), ARRAY['product_manager']));

-- 4. Product Images/Variants public read, staff write
CREATE POLICY "Images are readable by everyone" ON public.product_images
    FOR SELECT USING (true);

CREATE POLICY "Staff can manage product images" ON public.product_images
    FOR ALL USING (public.is_staff(auth.uid(), ARRAY['product_manager']));

CREATE POLICY "Variants are readable by everyone" ON public.product_variants
    FOR SELECT USING (true);

CREATE POLICY "Staff can manage product variants" ON public.product_variants
    FOR ALL USING (public.is_staff(auth.uid(), ARRAY['product_manager']));

-- 5. Orders Policies
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = profile_id OR customer_email = auth.jwt()->>'email');

CREATE POLICY "Users can insert their own orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can view/update all orders" ON public.orders
    FOR ALL USING (public.is_staff(auth.uid(), ARRAY['order_manager']));

-- 6. Order Items Policies
CREATE POLICY "Users can view their own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_items.order_id 
              AND (profile_id = auth.uid() OR customer_email = auth.jwt()->>'email')
        )
    );

CREATE POLICY "Users can insert order items" ON public.order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can manage order items" ON public.order_items
    FOR ALL USING (public.is_staff(auth.uid(), ARRAY['order_manager']));

-- 7. Wishlist Policies
CREATE POLICY "Users can manage their own wishlist" ON public.wishlists
    FOR ALL USING (auth.uid() = profile_id);

-- 8. Blog Policies
CREATE POLICY "Blog posts are readable by everyone" ON public.blog_posts
    FOR SELECT USING (status = 'published' OR public.is_staff(auth.uid(), ARRAY['content_manager']));

CREATE POLICY "Staff can manage blog posts" ON public.blog_posts
    FOR ALL USING (public.is_staff(auth.uid(), ARRAY['content_manager']));

CREATE POLICY "Blog categories/tags readable by everyone" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Staff can manage blog categories" ON public.blog_categories FOR ALL USING (public.is_staff(auth.uid(), ARRAY['content_manager']));

CREATE POLICY "Tags readable by everyone" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Staff can manage tags" ON public.tags FOR ALL USING (public.is_staff(auth.uid(), ARRAY['content_manager']));

CREATE POLICY "Post tags readable by everyone" ON public.blog_posts_tags FOR SELECT USING (true);
CREATE POLICY "Staff can manage post tags" ON public.blog_posts_tags FOR ALL USING (public.is_staff(auth.uid(), ARRAY['content_manager']));

-- 9. CMS Policies
CREATE POLICY "CMS is readable by everyone" ON public.cms_pages FOR SELECT USING (is_published = true);
CREATE POLICY "Staff can manage CMS pages" ON public.cms_pages FOR ALL USING (public.is_staff(auth.uid(), ARRAY['content_manager']));

CREATE POLICY "CMS sections readable by everyone" ON public.cms_sections FOR SELECT USING (is_visible = true);
CREATE POLICY "Staff can manage CMS sections" ON public.cms_sections FOR ALL USING (public.is_staff(auth.uid(), ARRAY['content_manager']));

-- 10. FAQs & Testimonials
CREATE POLICY "FAQs readable by everyone" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Staff can manage FAQs" ON public.faqs FOR ALL USING (public.is_staff(auth.uid(), ARRAY['content_manager']));

CREATE POLICY "Approved testimonials readable by everyone" ON public.testimonials FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can manage testimonials" ON public.testimonials FOR ALL USING (public.is_staff(auth.uid(), ARRAY['content_manager']));

-- 11. Newsletter
CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can view/manage subscribers" ON public.newsletter_subscribers FOR ALL USING (public.is_staff(auth.uid(), ARRAY['content_manager']));

-- 12. Settings
CREATE POLICY "Settings are readable by everyone" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Staff can manage settings" ON public.settings FOR ALL USING (public.is_staff(auth.uid(), ARRAY['content_manager']));


-- ==================== PROFILE AUTO-CREATION TRIGGER ====================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NEW.phone
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
