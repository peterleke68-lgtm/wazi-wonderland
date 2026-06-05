const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL is not defined in environment.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const CATEGORIES = [
  {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    name: "Lace Front Wigs",
    slug: "lace-front-wigs",
    description: "Premium lace front wigs crafted for natural hairlines and effortless styling.",
    image_url: "https://images.unsplash.com/photo-1595959183075-c1d09e57ad44?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
    name: "Full Lace Wigs",
    slug: "full-lace-wigs",
    description: "100% hand-tied full lace wigs offering maximum parting versatility and comfort.",
    image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
    name: "HD Closure Wigs",
    slug: "hd-closure-wigs",
    description: "Glueless high-definition closure wigs for quick, flawless installations.",
    image_url: "https://images.unsplash.com/photo-1605497746444-ac9dbd39f69c?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14",
    name: "Custom Colored Wigs",
    slug: "custom-colored-wigs",
    description: "Artisan-colored luxury hair ranging from soft balayages to vibrant highlights.",
    image_url: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&auto=format&fit=crop&q=80"
  }
];

const PRODUCTS = [
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21",
    category_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    name: "Wazi Golden Goddess Lace Front Wig",
    slug: "wazi-golden-goddess-lace-front-wig",
    description: "Exquisite 100% human virgin hair with pre-plucked hairline and invisible HD Swiss lace. Designed with our signature warm honey blonde balayage, the Golden Goddess wig offers unmatched radiance and natural movement.",
    price: 1200,
    sale_price: 1050,
    wig_type: "Lace Front",
    hair_length: "24 inches",
    hair_color: "Honey Blonde Balayage",
    stock_quantity: 12,
    is_available: true,
    is_featured: true,
    specifications: {
      cap_size: "Medium",
      density: "180%",
      lace_material: "HD Swiss Lace",
      hair_type: "Peruvian Virgin Human Hair",
      texture: "Silky Body Wave"
    },
    video_url: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
    category_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
    name: "Silk Cascade Full Lace Wig",
    slug: "silk-cascade-full-lace-wig",
    description: "Unrivaled versatility is yours with the Silk Cascade Full Lace Wig. Hand-tied strands on a full Swiss lace base allow you to part your hair in any direction, wear high ponytails, and create stunning up-dos with ease.",
    price: 1550,
    sale_price: null,
    wig_type: "Human Hair",
    hair_length: "26 inches",
    hair_color: "Natural Black (1B)",
    stock_quantity: 8,
    is_available: true,
    is_featured: true,
    specifications: {
      cap_size: "Medium",
      density: "150%",
      lace_material: "HD French Lace",
      hair_type: "Raw Indian Temple Hair",
      texture: "Straight"
    },
    video_url: null
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23",
    category_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
    name: "Royalty Kinky Curly HD Closure Wig",
    slug: "royalty-kinky-curly-hd-closure-wig",
    description: "Embrace divine, voluminous curls. The Royalty Kinky Curly features a glueless 5x5 HD lace closure, pre-bleached knots, and elastic bands for an ultra-secure fit and instant glamour without the need for adhesive.",
    price: 850,
    sale_price: 799,
    wig_type: "Closure",
    hair_length: "20 inches",
    hair_color: "Espresso Brown",
    stock_quantity: 15,
    is_available: true,
    is_featured: false,
    specifications: {
      cap_size: "Medium",
      density: "200%",
      lace_material: "Invisible HD Lace",
      hair_type: "Brazilian Virgin Hair",
      texture: "Kinky Curly"
    },
    video_url: null
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24",
    category_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14",
    name: "Blushing Rose Quartz Custom Wig",
    slug: "blushing-rose-quartz-custom-wig",
    description: "Turn heads with this masterfully dyed pastel rose gold masterpiece. Melted roots shift into soft pink and copper tones. Crafted on a 13x6 lace frontal wig base with ultra-premium European hair.",
    price: 1400,
    sale_price: null,
    wig_type: "Colored",
    hair_length: "22 inches",
    hair_color: "Rose Gold Balayage",
    stock_quantity: 5,
    is_available: true,
    is_featured: true,
    specifications: {
      cap_size: "Medium",
      density: "180%",
      lace_material: "HD Swiss Lace",
      hair_type: "European Remy Human Hair",
      texture: "Soft Waves"
    },
    video_url: null
  }
];

const PRODUCT_IMAGES = [
  { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21", image_url: "https://images.unsplash.com/photo-1605497746444-ac9dbd39f69c?w=800&auto=format&fit=crop&q=80", sort_order: 0 },
  { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21", image_url: "https://images.unsplash.com/photo-1595959183075-c1d09e57ad44?w=800&auto=format&fit=crop&q=80", sort_order: 1 },
  { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21", image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80", sort_order: 2 },
  { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a34", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22", image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80", sort_order: 0 },
  { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22", image_url: "https://images.unsplash.com/photo-1605497746444-ac9dbd39f69c?w=800&auto=format&fit=crop&q=80", sort_order: 1 },
  { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a36", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23", image_url: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&auto=format&fit=crop&q=80", sort_order: 0 },
  { id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a37", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24", image_url: "https://images.unsplash.com/photo-1595959183075-c1d09e57ad44?w=800&auto=format&fit=crop&q=80", sort_order: 0 }
];

const PRODUCT_VARIANTS = [
  { id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a41", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21", cap_size: "Small", hair_density: "150%", price_modifier: -50, stock_quantity: 3 },
  { id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a42", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21", cap_size: "Medium", hair_density: "180%", price_modifier: 0, stock_quantity: 5 },
  { id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a43", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21", cap_size: "Large", hair_density: "200%", price_modifier: 100, stock_quantity: 4 },
  { id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22", cap_size: "Small", hair_density: "150%", price_modifier: -50, stock_quantity: 2 },
  { id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a45", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22", cap_size: "Medium", hair_density: "180%", price_modifier: 120, stock_quantity: 4 },
  { id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a46", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22", cap_size: "Large", hair_density: "200%", price_modifier: 220, stock_quantity: 2 },
  { id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a47", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23", cap_size: "Medium", hair_density: "180%", price_modifier: 0, stock_quantity: 10 },
  { id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a48", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23", cap_size: "Medium", hair_density: "200%", price_modifier: 80, stock_quantity: 5 },
  { id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a49", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24", cap_size: "Small", hair_density: "180%", price_modifier: 0, stock_quantity: 2 },
  { id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a50", product_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24", cap_size: "Medium", hair_density: "180%", price_modifier: 0, stock_quantity: 3 }
];

const BLOG_CATEGORIES = [
  { id: "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51", name: "Care & Maintenance", slug: "care-maintenance" },
  { id: "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a52", name: "Buying Guide", slug: "buying-guide" }
];

const BLOG_POSTS = [
  {
    id: "f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a61",
    author_id: null,
    category_id: "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51",
    title: "How to Properly Wash and Maintain Your Luxury HD Lace Wig",
    slug: "how-to-properly-wash-and-maintain-your-luxury-hd-lace-wig",
    content: `Investing in a premium human hair wig from Wazi Wonderland is an investment in your beauty and confidence. To ensure your HD lace wig retains its brilliant luster, silky texture, and natural parting versatility, follow this detailed expert maintenance guide.

### Step 1: Pre-Wash Detangling
Before applying any water, gently detangle the hair using a wide-tooth comb or a signature loop brush. Start from the ends and gradually work your way up to the roots to prevent shedding and knotting.

### Step 2: The Right Wash Routine
Fill a basin with lukewarm water and dissolve a sulfate-free, moisture-rich shampoo. Dip the wig gently without scrubbing. Massage the shampoo smoothly in a downward direction, following the grain of the hair. Rinse thoroughly with lukewarm water.

### Step 3: Conditioning Treatment
Apply a high-quality salon-grade conditioner from the mid-lengths to the ends. Avoid applying conditioner directly to the lace cap or the knots, as this can loosen the hand-tied knots and cause shedding. Leave on for 5-10 minutes, then rinse.

### Step 4: Drying and Styling
Pat the wig gently with a microfiber towel to remove excess moisture. Do not wring or twist. Place it on a wig stand and allow it to air-dry. If using heat tools, always apply a professional heat protectant spray first and keep temperatures under 350°F (180°C).`,
    featured_image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80",
    status: "published",
    published_at: new Date().toISOString(),
    seo_title: "How to Wash & Maintain HD Lace Wigs | Wazi Guide",
    seo_description: "Learn how to wash, condition, dry, and style your premium HD lace front human hair wig to maximize its lifespan and keep it looking flawless.",
    seo_keywords: "wig care, wash human hair wig, HD lace maintenance, Wazi hair, luxury wigs"
  },
  {
    id: "f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a62",
    author_id: null,
    category_id: "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a52",
    title: "The Ultimate Guide to Choosing the Perfect Wig Density & Length",
    slug: "the-ultimate-guide-to-choosing-the-perfect-wig-density-and-length",
    content: `Choosing the right wig density and length can dramatically change your overall look. Whether you are aiming for a chic daily style or red-carpet glamour, here's everything you need to know.

### Understanding Wig Density
Wig density refers to how thick or thin the hair is.
- **150% Density (Medium):** Offers a very natural, lightweight feel. Ideal for shorter lengths or if you prefer a subtle, everyday look.
- **180% Density (Heavy):** The perfect balance. Full and voluminous, great for lengths 20" to 26".
- **200%+ Density (Extra Heavy):** Maximum volume, luxurious and dramatic. Best suited for long wigs or bouncy curls.

### Selecting Your Perfect Length
Wig lengths are measured from the crown to the tips.
- **Short (12"-16"):** Elegant bobs and lobs. Low maintenance and very chic.
- **Medium (18"-22"):** Versatile shoulder to bust length. Great for body waves.
- **Long (24"+):** Waist-grazing mermaid lengths. Ultimate luxury.`,
    featured_image_url: "https://images.unsplash.com/photo-1605497746444-ac9dbd39f69c?w=800&auto=format&fit=crop&q=80",
    status: "published",
    published_at: new Date().toISOString(),
    seo_title: "Wig Length & Density Guide | Wazi Wonderland",
    seo_description: "Struggling to choose between 150%, 180%, or 200% density? Read our guide to find the perfect hair length and volume for your face shape.",
    seo_keywords: "wig density guide, wig length chart, luxury wigs, human hair thickness"
  }
];

const TESTIMONIALS = [
  {
    id: "10eebc99-9c0b-4ef8-bb6d-6bb9bd380a71",
    author: "Alexandra Vance",
    role_or_title: "Fashion Influencer",
    rating: 5,
    text: "The quality of Wazi Wonderland's HD lace is unmatched. The hairline looks so natural, people literally think it is growing from my scalp! Worth every single dollar.",
    image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    is_approved: true
  },
  {
    id: "10eebc99-9c0b-4ef8-bb6d-6bb9bd380a72",
    author: "Gabrielle Union",
    role_or_title: "Loyal Customer",
    rating: 5,
    text: "The Golden Goddess wig changed my confidence. The hair is super soft, doesn't tangle, and the honey blonde balayage is absolutely gorgeous.",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    is_approved: true
  },
  {
    id: "10eebc99-9c0b-4ef8-bb6d-6bb9bd380a73",
    author: "Seraphina Knight",
    role_or_title: "Celebrity Stylist",
    rating: 5,
    text: "As a stylist, I've worked with hundreds of wig brands, but Wazi's hand-tied full lace bases are in a class of their own. Perfect parting, natural thickness, and premium density.",
    image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    is_approved: true
  }
];

const FAQS = [
  {
    id: "20eebc99-9c0b-4ef8-bb6d-6bb9bd380a81",
    question: "What makes HD Lace different from standard Swiss Lace?",
    answer: "HD (High Definition) Lace is the thinnest, softest, and most undetectable lace material available. It melts seamlessly into any skin tone, giving the illusion of a natural scalp. Standard lace is slightly thicker and may require makeup tinting.",
    category: "Lace & Materials",
    sort_order: 1
  },
  {
    id: "20eebc99-9c0b-4ef8-bb6d-6bb9bd380a82",
    question: "Can I dye, curl, or straighten my Wazi Wonderland wig?",
    answer: "Yes! All Wazi Wonderland wigs are made from 100% human virgin hair, meaning they can be colored, bleached, curled, and straightened just like your natural hair. We recommend professional styling to maintain the integrity of the hair.",
    category: "Styling & Care",
    sort_order: 2
  },
  {
    id: "20eebc99-9c0b-4ef8-bb6d-6bb9bd380a83",
    question: "How long do Wazi wigs typically last?",
    answer: "With proper care and maintenance, our human hair wigs can last 1 to 2+ years. Worn daily, you can expect a lifespan of 12+ months. Using sulfate-free products and avoiding excessive heat will maximize their lifespan.",
    category: "Durability",
    sort_order: 3
  }
];

const CMS_PAGES = [
  {
    id: "30eebc99-9c0b-4ef8-bb6d-6bb9bd380a91",
    title: "Home",
    slug: "home",
    is_published: true,
    seo_title: "Wazi Wonderland | Luxury Wigs & Hair Products",
    seo_description: "Discover Wazi Wonderland, the premier destination for high-end human hair wigs, HD lace closures, frontals, and custom-colored luxury hair systems."
  },
  {
    id: "30eebc99-9c0b-4ef8-bb6d-6bb9bd380a92",
    title: "About Us",
    slug: "about",
    is_published: true,
    seo_title: "Our Story | Wazi Wonderland",
    seo_description: "Learn about the craftsmanship, dedication, and beauty behind Wazi Wonderland's premium custom wig designs."
  }
];

const CMS_SECTIONS = [
  {
    id: "sec-home-hero", // Note: kept text ID as this is a specific UI component key used in storefront configs, but let's change to UUID if it fails. Actually init schema allows text or uuid. In init schema it is: cms_sections (id UUID PRIMARY KEY) - Ah! It is UUID as well! Let's change to UUID!
    id: "40eebc99-9c0b-4ef8-bb6d-6bb9bd380b01",
    page_id: "30eebc99-9c0b-4ef8-bb6d-6bb9bd380a91",
    type: "hero",
    content: {
      title: "Step Into A World of Pure Luxury",
      subtitle: "Unrivaled Elegance. Flawless Melt. Premium Wigs.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      fallbackImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1600&auto=format&fit=crop&q=80",
      ctaText: "Shop the Collection",
      ctaLink: "/shop",
      height: "full"
    },
    sort_order: 1,
    is_visible: true
  },
  {
    id: "40eebc99-9c0b-4ef8-bb6d-6bb9bd380b02",
    page_id: "30eebc99-9c0b-4ef8-bb6d-6bb9bd380a91",
    type: "banner",
    content: {
      title: "Limited Edition Summer Collection",
      description: "Get 15% off our signature HD Lace Front Wigs with code WAZISUMMER at checkout.",
      imageUrl: "https://images.unsplash.com/photo-1605497746444-ac9dbd39f69c?w=1200&auto=format&fit=crop&q=80",
      ctaText: "Explore Collection",
      ctaLink: "/shop?filter=lace-front-wigs",
      position: "left"
    },
    sort_order: 2,
    is_visible: true
  },
  {
    id: "40eebc99-9c0b-4ef8-bb6d-6bb9bd380b03",
    page_id: "30eebc99-9c0b-4ef8-bb6d-6bb9bd380a91",
    type: "faq",
    content: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about our luxury hair products."
    },
    sort_order: 3,
    is_visible: true
  }
];

async function seedTable(tableName, data, matchKey = 'id') {
  console.log(`Seeding table "${tableName}" with ${data.length} records...`);
  
  const keys = data.map(item => item[matchKey]);
  await supabase.from(tableName).delete().in(matchKey, keys);

  const { error } = await supabase.from(tableName).insert(data);
  if (error) {
    throw new Error(`Failed to seed "${tableName}": ${error.message}`);
  }
  console.log(`Table "${tableName}" seeded successfully.`);
}

async function runSeeder() {
  try {
    console.log("Starting Supabase database seeding operations...");

    // 1. Categories
    await seedTable('categories', CATEGORIES);

    // 2. Products
    await seedTable('products', PRODUCTS);

    // 3. Product Images
    await seedTable('product_images', PRODUCT_IMAGES);

    // 4. Product Variants
    await seedTable('product_variants', PRODUCT_VARIANTS);

    // 5. Blog Categories
    await seedTable('blog_categories', BLOG_CATEGORIES);

    // 6. Blog Posts
    await seedTable('blog_posts', BLOG_POSTS);

    // 7. Testimonials
    await seedTable('testimonials', TESTIMONIALS);

    // 8. FAQs
    await seedTable('faqs', FAQS);

    // 9. CMS Pages
    await seedTable('cms_pages', CMS_PAGES);

    // 10. CMS Sections
    await seedTable('cms_sections', CMS_SECTIONS);

    console.log("Database seeding completed successfully!");
  } catch (err) {
    console.error("Critical Seeding Error:", err.message);
    process.exit(1);
  }
}

runSeeder();
