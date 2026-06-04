export interface MockReview {
  id: number;
  userName: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  vendor: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  image: string; // tailwind bg class placeholder
  images: string[]; // multiple product images (gradient classes for placeholders)
  videoUrl?: string;
  highlights: string[];
  details: Record<string, string>;
  brandDescription?: string;
  mockReviews: MockReview[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Madhubani Painting - Tree of Life",
    price: 1299,
    originalPrice: 1799,
    description: "A beautiful hand-painted Madhubani artwork depicting the sacred Tree of Life, created by skilled artisans from the Mithila region of Bihar. Each piece is unique and painted using natural dyes on handmade paper.",
    category: "Mithila Art",
    vendor: "Mithila Artisans",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    image: "https://images.unsplash.com/photo-1579783900862-c7f8fb00d3d4?q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1579783900862-c7f8fb00d3d4?q=80&w=800",
      "https://images.unsplash.com/photo-1579783902614-13e1559eaeb7?q=80&w=800"
    ],
    highlights: [
      "Authentic hand-painted Madhubani artwork by skilled Mithila artisans",
      "Painted on handmade Nepali lokta paper using natural vegetable dyes",
      "Depicts the sacred Tree of Life — a symbol of fertility and prosperity",
      "Size: 22 x 30 inches — perfect for living room or office wall",
      "Comes with a certificate of authenticity and artisan details",
      "Each painting is unique — slight variations add to its charm",
    ],
    details: {
      "Material": "Handmade Lokta Paper",
      "Paint Type": "Natural Vegetable Dyes & Ink",
      "Art Form": "Madhubani / Mithila Painting",
      "Size": "22 x 30 inches (56 x 76 cm)",
      "Frame": "Unframed (rolled in protective tube)",
      "Origin": "Madhubani, Bihar, India",
      "Weight": "150 grams",
      "Care": "Keep away from direct sunlight and moisture",
    },
    brandDescription: "Mithila Artisans is a cooperative of 50+ women artists from the Madhubani district of Bihar. Each artwork preserves centuries-old Mithila painting traditions while providing sustainable livelihoods to rural artisans. Our paintings are featured in national galleries and international exhibitions.",
    mockReviews: [
      { id: 1, userName: "Priya Sharma", rating: 5, title: "Absolutely stunning artwork!", body: "The level of detail in this painting is incredible. The natural dyes give it such a warm, earthy feel. I framed it and put it in my living room — gets compliments from every guest. Truly a masterpiece!", date: "2025-12-15", verified: true, helpful: 23 },
      { id: 2, userName: "Rajesh Kumar", rating: 5, title: "Perfect gift for art lovers", body: "Bought this as a wedding gift. The recipient was overjoyed! The packaging was excellent — the painting arrived in a sturdy tube, completely undamaged. The certificate of authenticity is a nice touch.", date: "2025-11-28", verified: true, helpful: 15 },
      { id: 3, userName: "Anita Devi", rating: 4, title: "Beautiful but smaller than expected", body: "The artwork is genuinely beautiful and clearly hand-painted. My only minor gripe is it felt slightly smaller than I imagined from the photos. Still, the quality is outstanding for the price. Would buy again.", date: "2025-10-20", verified: true, helpful: 8 },
      { id: 4, userName: "Amit Verma", rating: 5, title: "Supporting Bihar artisans", body: "Love that this directly supports artisan women from Bihar. The painting is gorgeous — you can see the hours of work that went into every detail. The Tree of Life motif is deeply meaningful.", date: "2025-09-12", verified: false, helpful: 12 },
    ],
  },
  {
    id: 2,
    name: "Bhagalpuri Silk Saree",
    price: 3499,
    originalPrice: 4999,
    description: "Genuine Bhagalpuri Tussar silk saree with traditional motifs woven by master weavers of Bhagalpur. Known for its rich texture and natural sheen, this saree is perfect for festivals and weddings.",
    category: "Handlooms",
    vendor: "Bhagalpur Weaves",
    rating: 4.9,
    reviews: 89,
    inStock: true,
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800"
    ],
    highlights: [
      "100% Pure Bhagalpuri Tussar Silk — handwoven by master weavers",
      "Traditional Bihari motifs with intricate zari border work",
      "Natural golden sheen characteristic of Tussar silk",
      "Saree Length: 6.3 meters with unstitched blouse piece (0.8m)",
      "Ideal for weddings, pujas, festivals, and special occasions",
      "GI-tagged product — authentic Bhagalpuri origin guaranteed",
    ],
    details: {
      "Fabric": "Pure Tussar Silk (Kosa Silk)",
      "Weave": "Handloom",
      "Border": "Golden Zari with traditional motifs",
      "Length": "6.3 meters (with 0.8m blouse piece)",
      "Width": "45 inches",
      "Wash Care": "Dry clean only",
      "Occasion": "Wedding, Festival, Party, Ceremony",
      "Origin": "Bhagalpur, Bihar, India",
      "Certification": "GI Tagged",
    },
    brandDescription: "Bhagalpur Weaves brings you authentic handloom silk directly from the master weavers of Bhagalpur — the 'Silk City' of India. Each saree takes 3-7 days to handweave on traditional pit looms, ensuring the highest quality and preserving Bihar's 400-year-old weaving heritage.",
    mockReviews: [
      { id: 1, userName: "Meena Kumari", rating: 5, title: "The most beautiful saree I own!", body: "This saree is absolutely exquisite. The silk quality is unmatched — you can immediately feel the difference from machine-made fabrics. The golden sheen catches light beautifully. Wore it to my sister's wedding and received so many compliments!", date: "2026-01-20", verified: true, helpful: 31 },
      { id: 2, userName: "Sunita Jha", rating: 5, title: "Authentic Bhagalpuri quality", body: "As someone from Bihar, I can vouch for the authenticity. This is genuine Bhagalpuri silk — the texture, the weight, the zari work — all authentic. Amazing that we can now order this online!", date: "2025-12-05", verified: true, helpful: 22 },
      { id: 3, userName: "Kavita Singh", rating: 4, title: "Gorgeous but needs careful handling", body: "The saree is truly beautiful. Just remember it's pure silk — handle with care and dry clean only. The color was slightly different from the photos (more golden in person), but actually even more beautiful!", date: "2025-11-15", verified: true, helpful: 10 },
      { id: 4, userName: "Rekha Mishra", rating: 5, title: "Worth every rupee!", body: "I was hesitant to buy silk online, but this exceeded my expectations. The packaging was beautiful — came in a nice box. The blouse piece matches perfectly. Already ordered another one for my mother!", date: "2025-10-08", verified: true, helpful: 18 },
      { id: 5, userName: "Deepa Rani", rating: 5, title: "Festival ready!", body: "Bought for Chhath Puja and it was perfect. The drape is amazing and the silk is so comfortable. The zari border adds just the right amount of bling. Highly recommended!", date: "2025-09-22", verified: false, helpful: 7 },
    ],
  },
  {
    id: 3,
    name: "Silao Khaja (1 kg)",
    price: 350,
    description: "Famous crispy sweet delicacy from Silao, Nalanda. Made with refined flour, sugar, and ghee using a traditional recipe passed down through generations. A must-try Bihar specialty.",
    category: "Sweets",
    vendor: "Silao Sweets",
    rating: 4.6,
    reviews: 234,
    inStock: true,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800"
    ],
    highlights: [
      "Authentic Silao Khaja — made by traditional halwais of Nalanda",
      "Crispy layered pastry soaked in sugar syrup with pure desi ghee",
      "Net weight: 1 kg — vacuum-sealed box for freshness",
      "No artificial preservatives or colors — all natural ingredients",
      "Shelf life: 30 days from date of manufacturing",
      "Perfect for festivals, gifting, or anytime sweet cravings",
    ],
    details: {
      "Weight": "1 kg (Net)",
      "Ingredients": "Refined Flour, Sugar, Pure Ghee, Cardamom",
      "Shelf Life": "30 days",
      "Storage": "Store in cool, dry place",
      "Packaging": "Vacuum-sealed box",
      "Diet Type": "Vegetarian",
      "Allergens": "Contains Gluten, Dairy",
      "Origin": "Silao, Nalanda, Bihar",
    },
    brandDescription: "Silao Sweets has been crafting authentic Khaja for over 60 years. Our recipe comes straight from the legendary halwais of Silao — a small town in Nalanda famous for this crispy delicacy. We ship fresh vacuum-sealed Khaja across India, bringing the taste of Bihar to your doorstep.",
    mockReviews: [
      { id: 1, userName: "Rahul Sinha", rating: 5, title: "Taste of home!", body: "Being a Bihari settled in Bangalore, this brought tears to my eyes. Tastes exactly like the Khaja I ate growing up. Crispy, sweet, and melt-in-mouth. The vacuum packaging kept it perfectly fresh.", date: "2026-02-10", verified: true, helpful: 45 },
      { id: 2, userName: "Pooja Gupta", rating: 4, title: "Good but a few pieces were broken", body: "The taste is authentic and delicious. However, despite the vacuum seal, about 3-4 pieces were crumbled during shipping. Still tastes amazing though — would buy again with better packaging.", date: "2025-12-20", verified: true, helpful: 12 },
      { id: 3, userName: "Vikram Jha", rating: 5, title: "Best Khaja available online", body: "I've tried ordering from multiple sellers — this is by far the best. Perfectly crispy layers, right amount of sweetness, and generous ghee. Ordered 3 boxes — one for me and two as gifts!", date: "2025-11-30", verified: true, helpful: 19 },
    ],
  },
  {
    id: 4,
    name: "Sikki Grass Basket",
    price: 450,
    originalPrice: 599,
    description: "Handwoven basket made from Sikki grass by tribal women artisans. This eco-friendly craft reflects the rich heritage of Bihar and makes for a beautiful home decor piece.",
    category: "Handicrafts",
    vendor: "EcoCrafts Bihar",
    rating: 4.5,
    reviews: 67,
    inStock: true,
    image: "bg-green-100 dark:bg-green-900/30",
    images: [
      "bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-800/30",
      "bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30",
      "bg-gradient-to-br from-lime-100 to-green-200 dark:from-lime-900/30 dark:to-green-800/30",
      "bg-gradient-to-br from-green-200 to-lime-100 dark:from-green-800/30 dark:to-lime-900/30",
    ],
    highlights: [
      "100% handwoven from natural Sikki (golden grass) by tribal artisans",
      "Eco-friendly and biodegradable — no plastic or synthetic materials",
      "Perfect for storing fruits, trinkets, or as a decorative piece",
      "Dimensions: 10 inches diameter x 6 inches height",
      "Vibrant colors from natural and food-grade dyes",
      "Each basket is unique — handmade with love",
    ],
    details: {
      "Material": "Sikki Grass (Golden Grass)",
      "Technique": "Hand Coiling & Weaving",
      "Dimensions": "10\" diameter x 6\" height",
      "Weight": "200 grams",
      "Color": "Natural Golden with Colored Accents",
      "Use": "Decorative, Fruit Basket, Storage",
      "Origin": "Muzaffarpur, Bihar, India",
      "Certification": "Women Self Help Group Product",
    },
    brandDescription: "EcoCrafts Bihar works directly with women's self-help groups across rural Bihar. Our Sikki grass products are crafted by tribal women artisans, preserving endangered craft traditions while providing fair wages. Each product directly empowers rural women and their families.",
    mockReviews: [
      { id: 1, userName: "Nandini Roy", rating: 5, title: "Beautiful craftsmanship!", body: "This basket is a work of art. The weaving is incredibly tight and even. Using it as a fruit basket on my dining table — it looks amazing! Love supporting tribal artisans.", date: "2025-12-01", verified: true, helpful: 9 },
      { id: 2, userName: "Sanjay Kumar", rating: 4, title: "Nice product, good for gifting", body: "Bought as a gift for my mother-in-law. She loved it! The golden color of the grass is beautiful. Slightly smaller than expected but still looks great.", date: "2025-10-15", verified: true, helpful: 5 },
    ],
  },
  {
    id: 5,
    name: "Bihar Spice Box (Set of 6)",
    price: 599,
    originalPrice: 799,
    description: "A curated collection of six premium spices sourced directly from Bihar farms: Sattu masala, mustard oil seasoning, panch phoron, red chilli, turmeric, and coriander powder.",
    category: "Spices",
    vendor: "Bihar Spice Co.",
    rating: 4.7,
    reviews: 156,
    inStock: true,
    image: "bg-red-100 dark:bg-red-900/30",
    images: [
      "bg-gradient-to-br from-red-100 to-orange-200 dark:from-red-900/30 dark:to-orange-800/30",
      "bg-gradient-to-br from-orange-100 to-red-200 dark:from-orange-900/30 dark:to-red-800/30",
      "bg-gradient-to-br from-yellow-100 to-red-200 dark:from-yellow-900/30 dark:to-red-800/30",
      "bg-gradient-to-br from-red-200 to-amber-100 dark:from-red-800/30 dark:to-amber-900/30",
      "bg-gradient-to-br from-amber-100 to-red-200 dark:from-amber-900/30 dark:to-red-800/30",
    ],
    highlights: [
      "Set of 6 premium spices sourced from Bihar's organic farms",
      "Includes: Sattu Masala, Mustard Oil Seasoning, Panch Phoron, Red Chilli, Turmeric, Coriander",
      "100% natural — no added colors, preservatives, or fillers",
      "Stone-ground and sun-dried for maximum flavor and aroma",
      "Each spice in a resealable pouch — total weight: 600g",
      "Perfect for authentic Bihari cuisine — Litti Chokha, Dal Puri & more",
    ],
    details: {
      "Contents": "6 Individual Spice Pouches",
      "Total Weight": "600 grams (100g each)",
      "Processing": "Stone-ground, Sun-dried",
      "Shelf Life": "12 months",
      "Storage": "Store in cool, dry place away from sunlight",
      "Diet Type": "Vegan",
      "Certification": "FSSAI Licensed",
      "Origin": "Various districts, Bihar, India",
    },
    brandDescription: "Bihar Spice Co. sources directly from smallholder farmers across Bihar, ensuring fair prices for farmers and the freshest spices for you. Our spices are stone-ground using traditional methods to preserve essential oils and flavors that machine processing destroys.",
    mockReviews: [
      { id: 1, userName: "Geeta Devi", rating: 5, title: "Best spice set ever!", body: "The aroma when I opened these packets — incredible! Made Litti Chokha and it tasted exactly like my grandmother's recipe. The Sattu masala is the real deal. Every Bihar household needs this!", date: "2026-01-08", verified: true, helpful: 28 },
      { id: 2, userName: "Manish Chandra", rating: 5, title: "Authentic Bihar flavors", body: "Bought this for my wife who is from Bihar. She was thrilled! The Panch Phoron is perfectly blended and the turmeric is so vibrant. These spices are way above supermarket quality.", date: "2025-11-20", verified: true, helpful: 14 },
      { id: 3, userName: "Priti Saran", rating: 4, title: "Great quality, wish there was more", body: "All 6 spices are top notch. My only wish is the packets were larger — 100g goes fast! Already ordered a second set. The red chilli has a nice heat without being overwhelming.", date: "2025-10-30", verified: true, helpful: 9 },
    ],
  },
  {
    id: 6,
    name: "Wooden Carved Elephant",
    price: 899,
    description: "Intricately hand-carved wooden elephant figurine, a traditional craft from Bihar. Made from sustainable Sheesham wood with fine detailing, perfect as a gifting item.",
    category: "Handicrafts",
    vendor: "Patna Crafts Hub",
    rating: 4.4,
    reviews: 42,
    inStock: true,
    image: "https://images.unsplash.com/photo-1582200234149-14a9ec0444ff?q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1582200234149-14a9ec0444ff?q=80&w=800"
    ],
    highlights: [
      "Hand-carved from sustainable Sheesham (Indian Rosewood)",
      "Height: 8 inches — intricate detailing on trunk and tusks",
      "Each piece carved by master craftsmen of Patna",
      "Polished with natural beeswax for a smooth finish",
      "Symbol of prosperity and wisdom — perfect for home or office",
      "Ideal gift for weddings, housewarmings, and festivals",
    ],
    details: {
      "Material": "Sheesham Wood (Indian Rosewood)",
      "Dimensions": "8\" H x 6\" L x 3\" W",
      "Weight": "450 grams",
      "Finish": "Natural Beeswax Polish",
      "Craft Technique": "Hand Carving",
      "Care": "Wipe with dry cloth, avoid water exposure",
      "Origin": "Patna, Bihar, India",
    },
    brandDescription: "Patna Crafts Hub is a social enterprise dedicated to reviving Bihar's dying woodcraft traditions. We work with 3rd and 4th generation craftsmen, helping them find modern markets for their ancestral skills. Every purchase helps keep these ancient crafts alive.",
    mockReviews: [
      { id: 1, userName: "Arun Prasad", rating: 5, title: "Exceptional craftsmanship", body: "The attention to detail is remarkable. Every wrinkle on the elephant's skin, the curve of the trunk — all hand-carved. It sits proudly on my office desk. Worth much more than the price!", date: "2025-12-10", verified: true, helpful: 11 },
      { id: 2, userName: "Neha Srivastava", rating: 4, title: "Lovely piece, minor imperfection", body: "Beautiful elephant figurine with great detail. There's a tiny rough patch on the base, but since it's handmade, I consider it character. The beeswax finish gives it a lovely sheen.", date: "2025-09-18", verified: true, helpful: 4 },
    ],
  },
  {
    id: 7,
    name: "Litti Chokha Ready Mix",
    price: 199,
    description: "Authentic Litti Chokha ready-to-cook mix. Just add water, shape, and bake! Experience the iconic taste of Bihar at home with this convenient pack. Serves 4.",
    category: "Spices",
    vendor: "Bihari Kitchen",
    rating: 4.3,
    reviews: 312,
    inStock: true,
    image: "https://images.unsplash.com/photo-1604152006599-47dc062f8546?q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1604152006599-47dc062f8546?q=80&w=800"
    ],
    highlights: [
      "Instant Litti Chokha mix — ready in 30 minutes!",
      "Contains: Sattu filling mix + dough mix + Chokha masala",
      "Just add water, shape into balls, and bake or air-fry",
      "Serves 4 people generously",
      "No MSG, no artificial flavors — authentic Bihari recipe",
      "Step-by-step recipe instructions included inside",
    ],
    details: {
      "Contents": "Sattu Mix, Dough Mix, Chokha Masala (3 sachets)",
      "Net Weight": "400 grams",
      "Servings": "4",
      "Preparation Time": "30 minutes",
      "Diet Type": "Vegetarian, Vegan-friendly",
      "Shelf Life": "6 months",
      "Certification": "FSSAI Licensed",
      "Origin": "Patna, Bihar, India",
    },
    brandDescription: "Bihari Kitchen brings the authentic flavors of Bihar to kitchens across India. Our ready-to-cook mixes are developed by experienced Bihari home cooks, ensuring every bite tastes just like home. No shortcuts on taste — ever!",
    mockReviews: [
      { id: 1, userName: "Shubham Kumar", rating: 5, title: "Bihar in a box!", body: "As a Bihari living in Delhi, this is a lifesaver! The Sattu filling is perfectly spiced and the Litti turned out crispy and delicious. My NRI friends couldn't believe it was from a mix!", date: "2026-02-22", verified: true, helpful: 35 },
      { id: 2, userName: "Reshma Ali", rating: 4, title: "Good taste, instructions could be better", body: "The taste is really close to authentic Litti Chokha. I air-fried instead of baking and they came out great. The instructions were a bit vague on water quantity — took some trial and error.", date: "2025-12-15", verified: true, helpful: 8 },
      { id: 3, userName: "Deepak Ranjan", rating: 3, title: "Decent but not quite homemade", body: "It's a convenient product and tastes good, but doesn't fully capture the smoky flavor of coal-baked Litti you get in Bihar. For city folks who can't make it from scratch, it's a solid option.", date: "2025-11-01", verified: true, helpful: 15 },
    ],
  },
  {
    id: 8,
    name: "Tilkut - Gaya Special (500g)",
    price: 250,
    description: "Traditional Tilkut from Gaya, made from sesame seeds and jaggery. A winter delicacy of Bihar, this crunchy sweet is packed with nutrition and authentic flavors.",
    category: "Sweets",
    vendor: "Gaya Sweet House",
    rating: 4.7,
    reviews: 198,
    inStock: true,
    image: "https://images.unsplash.com/photo-1605697950947-66a9ba86fa9f?q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1605697950947-66a9ba86fa9f?q=80&w=800"
    ],
    highlights: [
      "Authentic Tilkut from Gaya — the #1 Tilkut destination in India",
      "Made with premium sesame seeds (til), jaggery (gur), and sugar",
      "Crunchy texture with a perfectly balanced sweet-nutty flavor",
      "Net weight: 500g in airtight container",
      "Rich in calcium, iron, and healthy fats — a nutritious snack",
      "Traditional Makar Sankranti special — now available year-round",
    ],
    details: {
      "Weight": "500 grams",
      "Ingredients": "Sesame Seeds, Jaggery, Sugar, Cardamom",
      "Shelf Life": "60 days",
      "Storage": "Store in cool, dry, airtight container",
      "Diet Type": "Vegetarian",
      "Allergens": "Contains Sesame",
      "Packaging": "Food-grade airtight container",
      "Origin": "Gaya, Bihar, India",
    },
    brandDescription: "Gaya Sweet House has been the go-to name for authentic Tilkut in Gaya for 45+ years. Our Tilkut is made fresh every week using a century-old family recipe. We were among the first to make Gaya's famous Tilkut available online.",
    mockReviews: [
      { id: 1, userName: "Ravi Shankar", rating: 5, title: "Just like buying from Gaya station!", body: "If you've ever bought Tilkut from Gaya railway station, you know the benchmark. This tastes EXACTLY like that! Crunchy, sesame-rich, and perfectly sweet. Reminds me of every winter in Bihar.", date: "2026-01-02", verified: true, helpful: 22 },
      { id: 2, userName: "Swati Kumari", rating: 5, title: "My kids love it!", body: "Finally found authentic Tilkut online! My kids absolutely love it. It's also much healthier than processed sweets — full of calcium from sesame. Already on my 3rd order!", date: "2025-11-10", verified: true, helpful: 16 },
      { id: 3, userName: "Keshav Das", rating: 4, title: "Good quality, could be crunchier", body: "The taste is spot on but I prefer my Tilkut slightly crunchier. This one is on the softer side. Still very good and way better than any Tilkut I've found locally in Mumbai.", date: "2025-10-05", verified: true, helpful: 6 },
    ],
  },
  {
    id: 9,
    name: "Mithila Makhana (1 kg)",
    price: 699,
    originalPrice: 899,
    description: "Premium quality fox nuts (Makhana) sourced directly from Mithila region farms. Rich in protein and antioxidants, perfect for healthy snacking, gravies, and kheer.",
    category: "Spices",
    vendor: "Mithila Organics",
    rating: 4.8,
    reviews: 276,
    inStock: true,
    image: "https://images.unsplash.com/photo-1621236162295-88514197eefb?q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1621236162295-88514197eefb?q=80&w=800"
    ],
    highlights: [
      "Premium grade Makhana (fox nuts) — handpicked and roasted",
      "Farm-fresh from Mithila region — India's #1 Makhana belt",
      "Large size kernels — puffed and crunchy, no broken pieces",
      "Weight: 1 kg in resealable food-grade packaging",
      "High in protein, low in fat — perfect for weight-conscious snackers",
      "Versatile: use for roasting, curries, kheer, or trail mixes",
    ],
    details: {
      "Weight": "1 kg",
      "Grade": "Premium (Large kernels)",
      "Processing": "Handpicked, Roasted",
      "Shelf Life": "12 months",
      "Storage": "Store in cool, dry place in airtight container",
      "Diet Type": "Vegetarian, Gluten-Free",
      "Protein": "9.7g per 100g",
      "Certification": "FSSAI Licensed",
      "Origin": "Darbhanga/Madhubani, Bihar, India",
    },
    brandDescription: "Mithila Organics works directly with smallholder farmers in the Makhana-growing regions of Darbhanga and Madhubani. Our farm-to-fork supply chain ensures you get the freshest, most flavorful Makhana while farmers get fair prices for their crop.",
    mockReviews: [
      { id: 1, userName: "Ananya Sharma", rating: 5, title: "Best Makhana I've ever had!", body: "The size of these kernels is impressive — much bigger than what you get at local stores. Perfectly roasted and crunchy. I roast them with ghee and rock salt for the ultimate healthy snack!", date: "2026-02-15", verified: true, helpful: 29 },
      { id: 2, userName: "Rohit Mishra", rating: 5, title: "Premium quality, worth the price", body: "Yes it's slightly pricier than market Makhana, but the quality difference is night and day. Almost zero broken pieces, uniform size, and incredibly fresh. Using it for my Navratri fasting meals.", date: "2025-12-28", verified: true, helpful: 17 },
      { id: 3, userName: "Pallavi Jha", rating: 4, title: "Good product, packaging could improve", body: "The Makhana itself is top quality — fresh and crunchy. But the packaging is a simple plastic bag. Would be nicer in a resealable standup pouch or tin for easy storage. Product: 5/5, Packaging: 3/5.", date: "2025-11-12", verified: true, helpful: 11 },
    ],
  },
  {
    id: 10,
    name: "Madhubani Wall Hanging",
    price: 1599,
    originalPrice: 2199,
    description: "Large Madhubani art wall hanging featuring fish and lotus motifs — symbols of prosperity in Maithili culture. Painted on cloth canvas with natural dyes.",
    category: "Mithila Art",
    vendor: "Mithila Artisans",
    rating: 4.9,
    reviews: 58,
    inStock: true,
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800"
    ],
    highlights: [
      "Large Madhubani art wall hanging on pure cotton canvas",
      "Features traditional fish & lotus motifs — symbols of prosperity",
      "Painted with natural dyes by Mithila women artists",
      "Size: 36 x 24 inches — makes a stunning statement piece",
      "Hand-embroidered border for a rich, textured finish",
      "Ready to hang — comes with wooden dowel and hanging cord",
    ],
    details: {
      "Material": "Pure Cotton Canvas",
      "Paint Type": "Natural Vegetable Dyes",
      "Art Form": "Madhubani / Mithila Painting",
      "Size": "36 x 24 inches (91 x 61 cm)",
      "Mounting": "Wooden dowel with hanging cord (ready to hang)",
      "Border": "Hand-embroidered",
      "Weight": "350 grams",
      "Origin": "Madhubani, Bihar, India",
    },
    brandDescription: "Mithila Artisans is a cooperative of 50+ women artists from the Madhubani district of Bihar. Each artwork preserves centuries-old Mithila painting traditions while providing sustainable livelihoods to rural artisans.",
    mockReviews: [
      { id: 1, userName: "Aarti Kashyap", rating: 5, title: "Show-stopping wall art!", body: "This wall hanging completely transformed my living room! The fish and lotus motifs are so vibrant and the hand-embroidered border adds amazing texture. My interior designer friend was jealous!", date: "2026-01-18", verified: true, helpful: 14 },
      { id: 2, userName: "Vivek Thakur", rating: 5, title: "Museum-quality artwork", body: "I've seen similar pieces in galleries for 5x the price. The quality of painting and the natural dyes give it an authentic, timeless look. Incredibly well-packaged too — arrived perfect.", date: "2025-11-25", verified: true, helpful: 10 },
    ],
  },
  {
    id: 11,
    name: "Katarni Rice (5 kg)",
    price: 550,
    description: "Aromatic Katarni rice, a GI-tagged variety from Bhagalpur. Known for its incredible fragrance and soft texture, this premium rice is a staple in Bihari households.",
    category: "Spices",
    vendor: "Bihar Grains",
    rating: 4.6,
    reviews: 143,
    inStock: true,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800"
    ],
    highlights: [
      "Genuine GI-tagged Katarni Rice from Bhagalpur, Bihar",
      "Incredibly aromatic — fills the kitchen with fragrance while cooking",
      "Medium-grain, soft texture — perfect for plain rice and pulao",
      "Net weight: 5 kg in moisture-proof packaging",
      "Naturally aged for 6 months for best flavor and texture",
      "Pesticide-free — grown using traditional farming methods",
    ],
    details: {
      "Weight": "5 kg",
      "Grain Type": "Medium, Aromatic",
      "Aging": "6 months (naturally aged)",
      "Cooking Ratio": "1:2 (rice:water)",
      "Shelf Life": "12 months",
      "Storage": "Store in cool, dry, airtight container",
      "Certification": "GI Tagged, Pesticide-free",
      "Origin": "Bhagalpur, Bihar, India",
    },
    brandDescription: "Bihar Grains brings you the finest indigenous rice varieties from Bihar's fertile plains. Our Katarni rice is sourced directly from traditional farmers in Bhagalpur who have been cultivating this aromatic variety for generations.",
    mockReviews: [
      { id: 1, userName: "Pankaj Sinha", rating: 5, title: "The aroma alone is worth it!", body: "When you cook this rice, the entire house smells amazing. The texture is soft and fluffy — much better than regular Basmati for everyday meals. This is the rice we grew up eating in Bihar!", date: "2026-02-05", verified: true, helpful: 20 },
      { id: 2, userName: "Madhuri Kumari", rating: 4, title: "Good rice, fair price", body: "Quality is good and the aroma is distinctive. However, I found a few small stones in my 5kg bag — needs better cleaning. The taste once cooked is excellent though.", date: "2025-11-18", verified: true, helpful: 7 },
    ],
  },
  {
    id: 12,
    name: "Bluetooth Speaker",
    price: 1499,
    originalPrice: 2499,
    description: "Portable Bluetooth speaker with 10-hour battery life, IPX5 water resistance, and deep bass. Sold by a local electronics vendor in Patna with warranty support.",
    category: "Electronics",
    vendor: "Patna Electronics",
    rating: 4.2,
    reviews: 89,
    inStock: true,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800"
    ],
    highlights: [
      "10W output with deep bass — fills a room with clear sound",
      "10-hour battery life — perfect for outdoor adventures",
      "IPX5 water resistance — splashproof for pool parties",
      "Bluetooth 5.3 — stable connection up to 15 meters",
      "Compact & portable — weighs only 350g with carabiner clip",
      "Built-in mic for hands-free calls & voice assistant support",
    ],
    details: {
      "Output Power": "10W",
      "Battery": "2000mAh, 10-hour playtime",
      "Bluetooth": "5.3",
      "Water Resistance": "IPX5",
      "Driver": "52mm full-range",
      "Dimensions": "8 x 8 x 10 cm",
      "Weight": "350 grams",
      "Charging": "USB-C, 2-hour full charge",
      "Warranty": "1 Year (Local)",
      "Origin": "Assembled in India",
    },
    brandDescription: "Patna Electronics has been serving Bihar's electronics needs for over 15 years. We offer genuine products with local warranty support and service centers in Patna. All products are personally tested before shipping.",
    mockReviews: [
      { id: 1, userName: "Arjun Mehta", rating: 5, title: "Incredible value for money!", body: "At ₹1499 after discount, this speaker punches way above its weight. The bass is surprisingly powerful for its size. Took it to a picnic and it lasted the whole day. USB-C charging is a bonus!", date: "2026-01-25", verified: true, helpful: 18 },
      { id: 2, userName: "Nikhil Das", rating: 4, title: "Good speaker, average mic", body: "Sound quality for music is really impressive — clear highs and decent bass. The bluetooth connection is stable. My only complaint is the mic quality for calls — it's usable but not great.", date: "2025-12-08", verified: true, helpful: 9 },
      { id: 3, userName: "Pooja Kumari", rating: 4, title: "Nice build quality", body: "Feels solid in hand, the rubber coating gives it a premium feel. Sound is loud and clear. Water resistance works — I accidentally splashed water on it and it was fine. Good product!", date: "2025-10-22", verified: true, helpful: 5 },
    ],
  },
];

export const categories = [
  { name: "Mithila Art", icon: "🎨", color: "bg-red-50 dark:bg-red-950/30" },
  { name: "Handlooms", icon: "🥻", color: "bg-orange-50 dark:bg-orange-950/30" },
  { name: "Spices", icon: "🌿", color: "bg-green-50 dark:bg-green-950/30" },
  { name: "Sweets", icon: "🍬", color: "bg-yellow-50 dark:bg-yellow-950/30" },
  { name: "Handicrafts", icon: "🏺", color: "bg-amber-50 dark:bg-amber-950/30" },
  { name: "Electronics", icon: "📱", color: "bg-blue-50 dark:bg-blue-950/30" },
];
