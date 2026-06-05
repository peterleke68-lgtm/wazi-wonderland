-- SQL Seeding Script for Wazi Wonderland (Luxury Wig E-commerce)
-- Copy and paste this script directly into the Supabase SQL Editor (https://supabase.com -> Project -> SQL Editor)

-- 1. categories Seeding
INSERT INTO public.categories (id, name, slug, description, image_url) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Lace Front Wigs', 'lace-front-wigs', 'Premium lace front wigs crafted for natural hairlines and effortless styling.', 'https://images.unsplash.com/photo-1595959183075-c1d09e57ad44?w=800&auto=format&fit=crop&q=80'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Full Lace Wigs', 'full-lace-wigs', '100% hand-tied full lace wigs offering maximum parting versatility and comfort.', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'HD Closure Wigs', 'hd-closure-wigs', 'Glueless high-definition closure wigs for quick, flawless installations.', 'https://images.unsplash.com/photo-1605497746444-ac9dbd39f69c?w=800&auto=format&fit=crop&q=80'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Custom Colored Wigs', 'custom-colored-wigs', 'Artisan-colored luxury hair ranging from soft balayages to vibrant highlights.', 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- 2. products Seeding
INSERT INTO public.products (id, category_id, name, slug, description, price, sale_price, wig_type, hair_length, hair_color, stock_quantity, is_available, is_featured, specifications, video_url) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Wazi Golden Goddess Lace Front Wig', 'wazi-golden-goddess-lace-front-wig', 'Exquisite 100% human virgin hair with pre-plucked hairline and invisible HD Swiss lace. Designed with our signature warm honey blonde balayage, the Golden Goddess wig offers unmatched radiance and natural movement.', 1200.00, 1050.00, 'Lace Front', '24 inches', 'Honey Blonde Balayage', 12, true, true, '{"cap_size": "Medium", "density": "180%", "lace_material": "HD Swiss Lace", "hair_type": "Peruvian Virgin Human Hair", "texture": "Silky Body Wave"}', 'https://www.w3schools.com/html/mov_bbb.mp4'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Silk Cascade Full Lace Wig', 'silk-cascade-full-lace-wig', 'Unrivaled versatility is yours with the Silk Cascade Full Lace Wig. Hand-tied strands on a full Swiss lace base allow you to part your hair in any direction, wear high ponytails, and create stunning up-dos with ease.', 1550.00, NULL, 'Human Hair', '26 inches', 'Natural Black (1B)', 8, true, true, '{"cap_size": "Medium", "density": "150%", "lace_material": "HD French Lace", "hair_type": "Raw Indian Temple Hair", "texture": "Straight"}', NULL),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Royalty Kinky Curly HD Closure Wig', 'royalty-kinky-curly-hd-closure-wig', 'Embrace divine, voluminous curls. The Royalty Kinky Curly features a glueless 5x5 HD lace closure, pre-bleached knots, and elastic bands for an ultra-secure fit and instant glamour without the need for adhesive.', 850.00, 799.00, 'Closure', '20 inches', 'Espresso Brown', 15, true, false, '{"cap_size": "Medium", "density": "200%", "lace_material": "Invisible HD Lace", "hair_type": "Brazilian Virgin Hair", "texture": "Kinky Curly"}', NULL),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Blushing Rose Quartz Custom Wig', 'blushing-rose-quartz-custom-wig', 'Turn heads with this masterfully dyed pastel rose gold masterpiece. Melted roots shift into soft pink and copper tones. Crafted on a 13x6 lace frontal wig base with ultra-premium European hair.', 1400.00, NULL, 'Colored', '22 inches', 'Rose Gold Balayage', 5, true, true, '{"cap_size": "Medium", "density": "180%", "lace_material": "HD Swiss Lace", "hair_type": "European Remy Human Hair", "texture": "Soft Waves"}', NULL)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  sale_price = EXCLUDED.sale_price,
  wig_type = EXCLUDED.wig_type,
  hair_length = EXCLUDED.hair_length,
  hair_color = EXCLUDED.hair_color,
  stock_quantity = EXCLUDED.stock_quantity,
  is_available = EXCLUDED.is_available,
  is_featured = EXCLUDED.is_featured,
  specifications = EXCLUDED.specifications,
  video_url = EXCLUDED.video_url;

-- 3. product_images Seeding
INSERT INTO public.product_images (id, product_id, image_url, sort_order) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'https://images.unsplash.com/photo-1605497746444-ac9dbd39f69c?w=800&auto=format&fit=crop&q=80', 0),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'https://images.unsplash.com/photo-1595959183075-c1d09e57ad44?w=800&auto=format&fit=crop&q=80', 1),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80', 2),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80', 0),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'https://images.unsplash.com/photo-1605497746444-ac9dbd39f69c?w=800&auto=format&fit=crop&q=80', 1),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a36', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&auto=format&fit=crop&q=80', 0),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a37', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'https://images.unsplash.com/photo-1595959183075-c1d09e57ad44?w=800&auto=format&fit=crop&q=80', 0)
ON CONFLICT (id) DO UPDATE SET
  product_id = EXCLUDED.product_id,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- 4. product_variants Seeding
INSERT INTO public.product_variants (id, product_id, cap_size, hair_density, price_modifier, stock_quantity) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Small', '150%', -50.00, 3),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Medium', '180%', 0.00, 5),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a43', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Large', '200%', 100.00, 4),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Small', '150%', -50.00, 2),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a45', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Medium', '180%', 120.00, 4),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a46', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Large', '200%', 220.00, 2),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a47', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'Medium', '180%', 0.00, 10),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a48', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'Medium', '200%', 80.00, 5),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a49', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'Small', '180%', 0.00, 2),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a50', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'Medium', '180%', 0.00, 3)
ON CONFLICT (id) DO UPDATE SET
  product_id = EXCLUDED.product_id,
  cap_size = EXCLUDED.cap_size,
  hair_density = EXCLUDED.hair_density,
  price_modifier = EXCLUDED.price_modifier,
  stock_quantity = EXCLUDED.stock_quantity;

-- 5. blog_categories Seeding
INSERT INTO public.blog_categories (id, name, slug) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', 'Care & Maintenance', 'care-maintenance'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', 'Buying Guide', 'buying-guide')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug;

-- 6. blog_posts Seeding
INSERT INTO public.blog_posts (id, author_id, category_id, title, slug, content, featured_image_url, status, published_at, seo_title, seo_description, seo_keywords) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a61', NULL, 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', 'How to Properly Wash and Maintain Your Luxury HD Lace Wig', 'how-to-properly-wash-and-maintain-your-luxury-hd-lace-wig', 'Investing in a premium human hair wig from Wazi Wonderland is an investment in your beauty and confidence. To ensure your HD lace wig retains its brilliant luster, silky texture, and natural parting versatility, follow this detailed expert maintenance guide.

### Step 1: Pre-Wash Detangling
Before applying any water, gently detangle the hair using a wide-tooth comb or a signature loop brush. Start from the ends and gradually work your way up to the roots to prevent shedding and knotting.

### Step 2: The Right Wash Routine
Fill a basin with lukewarm water and dissolve a sulfate-free, moisture-rich shampoo. Dip the wig gently without scrubbing. Massage the shampoo smoothly in a downward direction, following the grain of the hair. Rinse thoroughly with lukewarm water.

### Step 3: Conditioning Treatment
Apply a high-quality salon-grade conditioner from the mid-lengths to the ends. Avoid applying conditioner directly to the lace cap or the knots, as this can loosen the hand-tied knots and cause shedding. Leave on for 5-10 minutes, then rinse.

### Step 4: Drying and Styling
Pat the wig gently with a microfiber towel to remove excess moisture. Do not wring or twist. Place it on a wig stand and allow it to air-dry. If using heat tools, always apply a professional heat protectant spray first and keep temperatures under 350°F (180°C).', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80', 'published', NOW(), 'How to Wash & Maintain HD Lace Wigs | Wazi Guide', 'Learn how to wash, condition, dry, and style your premium HD lace front human hair wig to maximize its lifespan and keep it looking flawless.', 'wig care, wash human hair wig, HD lace maintenance, Wazi hair, luxury wigs'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a62', NULL, 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', 'The Ultimate Guide to Choosing the Perfect Wig Density & Length', 'the-ultimate-guide-to-choosing-the-perfect-wig-density-and-length', 'Choosing the right wig density and length can dramatically change your overall look. Whether you are aiming for a chic daily style or red-carpet glamour, here''s everything you need to know.

### Understanding Wig Density
Wig density refers to how thick or thin the hair is.
- **150% Density (Medium):** Offers a very natural, lightweight feel. Ideal for shorter lengths or if you prefer a subtle, everyday look.
- **180% Density (Heavy):** The perfect balance. Full and voluminous, great for lengths 20" to 26".
- **200%+ Density (Extra Heavy):** Maximum volume, luxurious and dramatic. Best suited for long wigs or bouncy curls.

### Selecting Your Perfect Length
Wig lengths are measured from the crown to the tips.
- **Short (12"-16"):** Elegant bobs and lobs. Low maintenance and very chic.
- **Medium (18"-22"):** Versatile shoulder to bust length. Great for body waves.
- **Long (24"+):** Waist-grazing mermaid lengths. Ultimate luxury.', 'https://images.unsplash.com/photo-1605497746444-ac9dbd39f69c?w=800&auto=format&fit=crop&q=80', 'published', NOW(), 'Wig Length & Density Guide | Wazi Wonderland', 'Struggling to choose between 150%, 180%, or 200% density? Read our guide to find the perfect hair length and volume for your face shape.', 'wig density guide, wig length chart, luxury wigs, human hair thickness')
ON CONFLICT (id) DO UPDATE SET
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  content = EXCLUDED.content,
  featured_image_url = EXCLUDED.featured_image_url,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords;

-- 7. testimonials Seeding
INSERT INTO public.testimonials (id, author, role_or_title, rating, text, image_url, is_approved) VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a71', 'Alexandra Vance', 'Fashion Influencer', 5, 'The quality of Wazi Wonderland''s HD lace is unmatched. The hairline looks so natural, people literally think it is growing from my scalp! Worth every single dollar.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', true),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a72', 'Gabrielle Union', 'Loyal Customer', 5, 'The Golden Goddess wig changed my confidence. The hair is super soft, doesn''t tangle, and the honey blonde balayage is absolutely gorgeous.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', true),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a73', 'Seraphina Knight', 'Celebrity Stylist', 5, 'As a stylist, I''ve worked with hundreds of wig brands, but Wazi''s hand-tied full lace bases are in a class of their own. Perfect parting, natural thickness, and premium density.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', true)
ON CONFLICT (id) DO UPDATE SET
  author = EXCLUDED.author,
  role_or_title = EXCLUDED.role_or_title,
  rating = EXCLUDED.rating,
  text = EXCLUDED.text,
  image_url = EXCLUDED.image_url,
  is_approved = EXCLUDED.is_approved;

-- 8. faqs Seeding
INSERT INTO public.faqs (id, question, answer, category, sort_order) VALUES
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a81', 'What makes HD Lace different from standard Swiss Lace?', 'HD (High Definition) Lace is the thinnest, softest, and most undetectable lace material available. It melts seamlessly into any skin tone, giving the illusion of a natural scalp. Standard lace is slightly thicker and may require makeup tinting.', 'Lace & Materials', 1),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a82', 'Can I dye, curl, or straighten my Wazi Wonderland wig?', 'Yes! All Wazi Wonderland wigs are made from 100% human virgin hair, meaning they can be colored, bleached, curled, and straightened just like your natural hair. We recommend professional styling to maintain the integrity of the hair.', 'Styling & Care', 2),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a83', 'How long do Wazi wigs typically last?', 'With proper care and maintenance, our human hair wigs can last 1 to 2+ years. Worn daily, you can expect a lifespan of 12+ months. Using sulfate-free products and avoiding excessive heat will maximize their lifespan.', 'Durability', 3)
ON CONFLICT (id) DO UPDATE SET
  question = EXCLUDED.question,
  answer = EXCLUDED.answer,
  category = EXCLUDED.category,
  sort_order = EXCLUDED.sort_order;

-- 9. cms_pages Seeding
INSERT INTO public.cms_pages (id, title, slug, is_published, seo_title, seo_description) VALUES
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a91', 'Home', 'home', true, 'Wazi Wonderland | Luxury Wigs & Hair Products', 'Discover Wazi Wonderland, the premier destination for high-end human hair wigs, HD lace closures, frontals, and custom-colored luxury hair systems.'),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a92', 'About Us', 'about', true, 'Our Story | Wazi Wonderland', 'Learn about the craftsmanship, dedication, and beauty behind Wazi Wonderland''s premium custom wig designs.')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  is_published = EXCLUDED.is_published,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description;

-- 10. cms_sections Seeding
INSERT INTO public.cms_sections (id, page_id, type, content, sort_order, is_visible) VALUES
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', '30eebc99-9c0b-4ef8-bb6d-6bb9bd380a91', 'hero', '{"title": "Step Into A World of Pure Luxury", "subtitle": "Unrivaled Elegance. Flawless Melt. Premium Wigs.", "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4", "fallbackImage": "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1600&auto=format&fit=crop&q=80", "ctaText": "Shop the Collection", "ctaLink": "/shop", "height": "full"}', 1, true),
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', '30eebc99-9c0b-4ef8-bb6d-6bb9bd380a91', 'banner', '{"title": "Limited Edition Summer Collection", "description": "Get 15% off our signature HD Lace Front Wigs with code WAZISUMMER at checkout.", "imageUrl": "https://images.unsplash.com/photo-1605497746444-ac9dbd39f69c?w=1200&auto=format&fit=crop&q=80", "ctaText": "Explore Collection", "ctaLink": "/shop?filter=lace-front-wigs", "position": "left"}', 2, true),
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380b03', '30eebc99-9c0b-4ef8-bb6d-6bb9bd380a91', 'faq', '{"title": "Frequently Asked Questions", "subtitle": "Everything you need to know about our luxury hair products."}', 3, true)
ON CONFLICT (id) DO UPDATE SET
  page_id = EXCLUDED.page_id,
  type = EXCLUDED.type,
  content = EXCLUDED.content,
  sort_order = EXCLUDED.sort_order,
  is_visible = EXCLUDED.is_visible;
