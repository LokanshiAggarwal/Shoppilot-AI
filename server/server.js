const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");

const Order = require("./models/Order");

const app = express();

const PORT = process.env.PORT || 5000;

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(cors());
app.use(express.json());

// =========================================================
// MONGODB CONNECTION
// =========================================================

connectDB();

// =========================================================
// HOME
// =========================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ShopPilot AI backend is running 🚀",
  });
});


// =========================================================
// CREATE ORDER
// =========================================================

app.post("/api/orders", async (req, res) => {
  try {
    const {
      customer,
      shippingAddress,
      items,
      subtotal,
      totalAmount,
    } = req.body;

    // Basic validation
    if (
      !customer ||
      !shippingAddress ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Customer, shipping address and items are required.",
      });
    }

    const order = new Order({
      customer,
      shippingAddress,
      items,
      subtotal,
      totalAmount,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully 🎉",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Order creation failed:", error);

    res.status(500).json({
      success: false,
      message: "Failed to place order.",
      error: error.message,
    });
  }
});

// =========================================================
// START SERVER
// =========================================================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// =========================================================
// HEALTH CHECK
// =========================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "ShopPilot AI API",
  });
});

// =========================================================
// PRODUCT DATABASE
// Temporary local product database
// =========================================================

const products = [

  // =======================================================
  // LAPTOPS
  // =======================================================

  {
    id: 1,
    name: "AeroBook Pro",
    category: "Laptop",
    type: "laptop",
    price: 64999,
    rating: 4.7,

    description:
      "Powerful laptop for coding, development, students and everyday work.",

    keywords: [
      "laptop",
      "coding",
      "programming",
      "developer",
      "development",
      "student",
      "college",
      "work",
      "productivity",
      "battery",
    ],

    features: [
      "coding",
      "programming",
      "developer",
      "student",
      "college",
      "productivity",
      "battery",
    ],
  },

  {
    id: 2,
    name: "NovaBook X",
    category: "Laptop",
    type: "laptop",
    price: 72999,
    rating: 4.6,

    description:
      "Premium laptop with strong performance, sleek design and long battery life.",

    keywords: [
      "laptop",
      "coding",
      "programming",
      "developer",
      "premium",
      "work",
      "battery",
      "performance",
      "design",
    ],

    features: [
      "coding",
      "programming",
      "developer",
      "premium",
      "battery",
      "performance",
      "design",
    ],
  },

  {
    id: 3,
    name: "PixelCore Air",
    category: "Laptop",
    type: "laptop",
    price: 58999,
    rating: 4.5,

    description:
      "Lightweight and affordable laptop suitable for students, developers and everyday productivity.",

    keywords: [
      "laptop",
      "coding",
      "programming",
      "student",
      "college",
      "lightweight",
      "budget",
      "affordable",
      "work",
      "productivity",
    ],

    features: [
      "coding",
      "programming",
      "student",
      "college",
      "lightweight",
      "budget",
      "affordable",
      "productivity",
    ],
  },

  {
    id: 4,
    name: "Titan Gaming 15",
    category: "Gaming Laptop",
    type: "gaming-laptop",
    price: 84999,
    rating: 4.8,

    description:
      "High-performance gaming laptop designed for gaming, graphics and demanding applications.",

    keywords: [
      "gaming",
      "gamer",
      "games",
      "gaming laptop",
      "graphics",
      "gpu",
      "performance",
      "laptop",
      "heavy",
    ],

    features: [
      "gaming",
      "gamer",
      "graphics",
      "gpu",
      "performance",
      "heavy",
    ],
  },

  {
    id: 5,
    name: "UltraCore Pro",
    category: "Laptop",
    type: "laptop",
    price: 99999,
    rating: 4.9,

    description:
      "High-end laptop for professional development, creative work, editing and heavy workloads.",

    keywords: [
      "laptop",
      "coding",
      "programming",
      "developer",
      "professional",
      "editing",
      "video editing",
      "design",
      "performance",
      "premium",
      "heavy",
    ],

    features: [
      "coding",
      "programming",
      "developer",
      "professional",
      "editing",
      "video editing",
      "design",
      "performance",
      "premium",
      "heavy",
    ],
  },

  // =======================================================
  // PHONES
  // =======================================================

  {
    id: 6,
    name: "NovaPhone 15",
    category: "Phone",
    type: "phone",
    price: 27999,
    rating: 4.6,

    description:
      "Balanced smartphone with an excellent display, capable camera and reliable everyday performance.",

    keywords: [
      "phone",
      "mobile",
      "smartphone",
      "iphone",
      "android",
      "camera",
      "display",
      "performance",
      "everyday",
    ],

    features: [
      "camera",
      "display",
      "performance",
      "everyday",
    ],
  },

  {
    id: 7,
    name: "PixelMax Pro",
    category: "Phone",
    type: "phone",
    price: 32999,
    rating: 4.8,

    description:
      "Premium smartphone with excellent camera quality, photography features and fast performance.",

    keywords: [
      "phone",
      "mobile",
      "smartphone",
      "android",
      "camera",
      "photography",
      "photo",
      "premium",
      "performance",
    ],

    features: [
      "camera",
      "photography",
      "photo",
      "premium",
      "performance",
    ],
  },

  {
    id: 8,
    name: "SpeedOne 5G",
    category: "Phone",
    type: "phone",
    price: 21999,
    rating: 4.5,

    description:
      "Affordable 5G smartphone with smooth performance and long battery life.",

    keywords: [
      "phone",
      "mobile",
      "smartphone",
      "5g",
      "battery",
      "long battery",
      "budget",
      "cheap",
      "affordable",
      "performance",
    ],

    features: [
      "5g",
      "battery",
      "long battery",
      "budget",
      "cheap",
      "affordable",
      "performance",
    ],
  },

  // =======================================================
  // HEADPHONES
  // =======================================================

  {
    id: 9,
    name: "SonicPods Pro",
    category: "Headphones",
    type: "headphones",
    price: 7999,
    rating: 4.7,

    description:
      "Wireless headphones with immersive sound, active noise cancellation and comfortable fit.",

    keywords: [
      "headphone",
      "headphones",
      "earphone",
      "earphones",
      "earbuds",
      "audio",
      "music",
      "wireless",
      "noise cancellation",
      "anc",
      "sound",
      "comfort",
    ],

    features: [
      "music",
      "audio",
      "wireless",
      "noise cancellation",
      "anc",
      "sound",
      "comfort",
    ],
  },

  {
    id: 10,
    name: "BassWave X",
    category: "Headphones",
    type: "headphones",
    price: 4999,
    rating: 4.5,

    description:
      "Affordable wireless headphones with powerful bass and long battery life.",

    keywords: [
      "headphone",
      "headphones",
      "earphone",
      "earphones",
      "earbuds",
      "audio",
      "music",
      "bass",
      "wireless",
      "budget",
      "cheap",
      "affordable",
      "battery",
    ],

    features: [
      "music",
      "audio",
      "bass",
      "wireless",
      "budget",
      "cheap",
      "affordable",
      "battery",
    ],
  },

  {
    id: 11,
    name: "StudioSound Max",
    category: "Headphones",
    type: "headphones",
    price: 11999,
    rating: 4.9,

    description:
      "Premium headphones designed for detailed audio, music production and entertainment.",

    keywords: [
      "headphone",
      "headphones",
      "audio",
      "music",
      "studio",
      "premium",
      "sound",
      "production",
      "music production",
      "entertainment",
    ],

    features: [
      "music",
      "audio",
      "studio",
      "premium",
      "sound",
      "production",
      "music production",
      "entertainment",
    ],
  },
];

// =========================================================
// NORMALIZE QUERY
// =========================================================

function normalizeQuery(query) {
  return query
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/₹/g, "")
    .replace(/\brs\.?\b/g, "")
    .replace(/\binr\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// =========================================================
// EXTRACT BUDGET
//
// Supports:
//
// under 70000
// under 70k
// under ₹70,000
// below 30k
// upto 50000
// up to 50 thousand
// max 70000
// within 30000
// =========================================================

function extractBudget(query) {
  const normalized = normalizeQuery(query);

  const match = normalized.match(
    /(?:under|below|less than|within|max|maximum|upto|up to)\s*(\d+(?:\.\d+)?)\s*(k|thousand)?/
  );

  if (!match) {
    return null;
  }

  let amount = Number(match[1]);

  if (
    match[2] === "k" ||
    match[2] === "thousand"
  ) {
    amount = amount * 1000;
  }

  return amount;
}

// =========================================================
// DETECT PRODUCT TYPE
//
// IMPORTANT:
// We use word boundaries so:
//
// "headphones" ≠ "phone"
//
// This is the bug from the previous version.
// =========================================================

function detectProductType(query) {
  const q = normalizeQuery(query);

  // -------------------------------------------------------
  // HEADPHONES
  // Check this before phone.
  // -------------------------------------------------------

  if (
    /\bheadphone(s)?\b/.test(q) ||
    /\bearphone(s)?\b/.test(q) ||
    /\bearbuds?\b/.test(q) ||
    /\bairpods?\b/.test(q) ||
    /\baudio\b/.test(q) ||
    /\banc\b/.test(q) ||
    q.includes("noise cancellation") ||
    /\bmusic\b/.test(q)
  ) {
    return "headphones";
  }

  // -------------------------------------------------------
  // GAMING LAPTOP
  // -------------------------------------------------------

  if (
    q.includes("gaming laptop") ||
    /\bgaming\b/.test(q) ||
    /\bgamer\b/.test(q) ||
    /\bgaming\b/.test(q)
  ) {
    return "gaming-laptop";
  }

  // -------------------------------------------------------
  // NORMAL LAPTOP
  // -------------------------------------------------------

  if (
    /\blaptop(s)?\b/.test(q) ||
    /\bmacbook\b/.test(q) ||
    /\bnotebook(s)?\b/.test(q) ||
    /\bcoding\b/.test(q) ||
    /\bprogramming\b/.test(q) ||
    /\bdeveloper\b/.test(q) ||
    /\bdevelopment\b/.test(q)
  ) {
    return "laptop";
  }

  // -------------------------------------------------------
  // PHONE
  //
  // Notice \bphone\b.
  // This prevents "headphones" from matching.
  // -------------------------------------------------------

  if (
    /\bphone(s)?\b/.test(q) ||
    /\bmobile(s)?\b/.test(q) ||
    /\bsmartphone(s)?\b/.test(q) ||
    /\biphone(s)?\b/.test(q) ||
    /\bandroid\b/.test(q)
  ) {
    return "phone";
  }

  return null;
}

// =========================================================
// DETECT USER INTENT
// =========================================================

function detectIntent(query) {
  const q = normalizeQuery(query);

  return {
    // General
    wantsBest:
      /\bbest\b/.test(q) ||
      /\btop\b/.test(q) ||
      /\brecommended\b/.test(q),

    wantsBudget:
      /\bcheap\b/.test(q) ||
      /\bbudget\b/.test(q) ||
      /\baffordable\b/.test(q) ||
      /\bvalue\b/.test(q),

    wantsPremium:
      /\bpremium\b/.test(q) ||
      /\bhigh end\b/.test(q) ||
      /\bprofessional\b/.test(q),

    // Laptop
    wantsGaming:
      /\bgaming\b/.test(q) ||
      /\bgamer\b/.test(q) ||
      /\bgames\b/.test(q),

    wantsCoding:
      /\bcoding\b/.test(q) ||
      /\bprogramming\b/.test(q) ||
      /\bdeveloper\b/.test(q) ||
      /\bdevelopment\b/.test(q),

    wantsEditing:
      /\bediting\b/.test(q) ||
      /\bvideo editing\b/.test(q),

    wantsDesign:
      /\bdesign\b/.test(q) ||
      /\bdesigner\b/.test(q),

    // Phone
    wantsCamera:
      /\bcamera\b/.test(q) ||
      /\bphotography\b/.test(q) ||
      /\bphoto\b/.test(q),

    wantsDisplay:
      /\bdisplay\b/.test(q) ||
      /\bscreen\b/.test(q),

    wants5G:
      /\b5g\b/.test(q),

    // General
    wantsBattery:
      /\bbattery\b/.test(q) ||
      q.includes("long battery"),

    // Headphones
    wantsMusic:
      /\bmusic\b/.test(q) ||
      /\baudio\b/.test(q) ||
      /\bsound\b/.test(q),

    wantsANC:
      /\banc\b/.test(q) ||
      q.includes("noise cancellation"),

    wantsBass:
      /\bbass\b/.test(q),

    wantsWireless:
      /\bwireless\b/.test(q),

    wantsComfort:
      /\bcomfortable\b/.test(q) ||
      /\bcomfort\b/.test(q),

    wantsStudio:
      /\bstudio\b/.test(q) ||
      /\bproduction\b/.test(q),

    // Student
    wantsStudent:
      /\bstudent\b/.test(q) ||
      /\bcollege\b/.test(q) ||
      /\bschool\b/.test(q),
  };
}

// =========================================================
// GET PRODUCT TYPE MATCH
// =========================================================

function productMatchesType(product, productType) {
  if (!productType) {
    return true;
  }

  // A normal laptop search can include gaming laptops
  // because a gaming laptop is also a laptop.
  if (productType === "laptop") {
    return (
      product.type === "laptop" ||
      product.type === "gaming-laptop"
    );
  }

  return product.type === productType;
}

// =========================================================
// CALCULATE MATCH SCORE
// =========================================================

function calculateMatch(product, query, budget, intent) {
  const q = normalizeQuery(query);

  let score = 45;

  // =======================================================
  // KEYWORD MATCHING
  // =======================================================

  product.keywords.forEach((keyword) => {
    const keywordLower = keyword.toLowerCase();

    if (
      q.includes(keywordLower)
    ) {
      score += 5;
    }
  });

  // =======================================================
  // GAMING
  // =======================================================

  if (intent.wantsGaming) {
    if (product.features.includes("gaming")) {
      score += 30;
    }

    if (product.features.includes("performance")) {
      score += 10;
    }

    if (product.features.includes("gpu")) {
      score += 10;
    }
  }

  // =======================================================
  // CODING
  // =======================================================

  if (intent.wantsCoding) {
    if (product.features.includes("coding")) {
      score += 25;
    }

    if (product.features.includes("programming")) {
      score += 15;
    }

    if (product.features.includes("developer")) {
      score += 10;
    }

    if (product.features.includes("performance")) {
      score += 8;
    }
  }

  // =======================================================
  // VIDEO EDITING
  // =======================================================

  if (intent.wantsEditing) {
    if (product.features.includes("editing")) {
      score += 25;
    }

    if (product.features.includes("video editing")) {
      score += 20;
    }

    if (product.features.includes("performance")) {
      score += 10;
    }
  }

  // =======================================================
  // DESIGN
  // =======================================================

  if (intent.wantsDesign) {
    if (product.features.includes("design")) {
      score += 20;
    }

    if (product.features.includes("performance")) {
      score += 10;
    }
  }

  // =======================================================
  // CAMERA
  // =======================================================

  if (intent.wantsCamera) {
    if (product.features.includes("camera")) {
      score += 30;
    }

    if (product.features.includes("photography")) {
      score += 20;
    }

    if (product.features.includes("photo")) {
      score += 10;
    }
  }

  // =======================================================
  // DISPLAY
  // =======================================================

  if (intent.wantsDisplay) {
    if (product.features.includes("display")) {
      score += 25;
    }
  }

  // =======================================================
  // 5G
  // =======================================================

  if (intent.wants5G) {
    if (product.features.includes("5g")) {
      score += 25;
    }
  }

  // =======================================================
  // BATTERY
  // =======================================================

  if (intent.wantsBattery) {
    if (product.features.includes("battery")) {
      score += 25;
    }

    if (product.features.includes("long battery")) {
      score += 20;
    }
  }

  // =======================================================
  // MUSIC
  // =======================================================

  if (intent.wantsMusic) {
    if (product.features.includes("music")) {
      score += 25;
    }

    if (product.features.includes("audio")) {
      score += 15;
    }

    if (product.features.includes("sound")) {
      score += 10;
    }
  }

  // =======================================================
  // ANC
  // =======================================================

  if (intent.wantsANC) {
    if (product.features.includes("noise cancellation")) {
      score += 35;
    }

    if (product.features.includes("anc")) {
      score += 20;
    }
  }

  // =======================================================
  // BASS
  // =======================================================

  if (intent.wantsBass) {
    if (product.features.includes("bass")) {
      score += 30;
    }
  }

  // =======================================================
  // WIRELESS
  // =======================================================

  if (intent.wantsWireless) {
    if (product.features.includes("wireless")) {
      score += 20;
    }
  }

  // =======================================================
  // COMFORT
  // =======================================================

  if (intent.wantsComfort) {
    if (product.features.includes("comfort")) {
      score += 20;
    }
  }

  // =======================================================
  // STUDIO
  // =======================================================

  if (intent.wantsStudio) {
    if (product.features.includes("studio")) {
      score += 25;
    }

    if (product.features.includes("production")) {
      score += 20;
    }
  }

  // =======================================================
  // STUDENT
  // =======================================================

  if (intent.wantsStudent) {
    if (product.features.includes("student")) {
      score += 20;
    }

    if (product.features.includes("college")) {
      score += 10;
    }

    if (product.features.includes("budget")) {
      score += 10;
    }

    if (product.features.includes("affordable")) {
      score += 10;
    }
  }

  // =======================================================
  // PREMIUM
  // =======================================================

  if (intent.wantsPremium) {
    if (product.features.includes("premium")) {
      score += 30;
    }

    if (product.rating >= 4.8) {
      score += 10;
    }
  }

  // =======================================================
  // BUDGET / CHEAP
  // =======================================================

  if (intent.wantsBudget) {
    if (product.features.includes("budget")) {
      score += 25;
    }

    if (product.features.includes("cheap")) {
      score += 20;
    }

    if (product.features.includes("affordable")) {
      score += 20;
    }
  }

  // =======================================================
  // USER'S SPECIFIC BUDGET
  // =======================================================

  if (budget) {
    if (product.price <= budget) {

      // Strong bonus for being within budget
      score += 25;

      // Products that use a reasonable portion of
      // the budget get a small additional bonus.
      const budgetUsage = product.price / budget;

      if (budgetUsage >= 0.70) {
        score += 5;
      }

    } else {

      // Product is above user's budget
      const percentageOver =
        (product.price - budget) / budget;

      if (percentageOver <= 0.10) {
        score -= 10;
      } else if (percentageOver <= 0.25) {
        score -= 25;
      } else {
        score -= 45;
      }
    }
  }

  // =======================================================
  // BEST
  // =======================================================

  if (intent.wantsBest) {
    score += product.rating * 6;
  }

  // =======================================================
  // GENERAL RATING
  // =======================================================

  score += product.rating * 3;

  // =======================================================
  // FINAL SCORE
  // =======================================================

  return Math.max(
    35,
    Math.min(99, Math.round(score))
  );
}

// =========================================================
// GENERATE RECOMMENDATION REASON
// =========================================================

function generateReason(product, intent, budget) {
  const reasons = [];

  // Laptop reasons
  if (
    intent.wantsGaming &&
    product.features.includes("gaming")
  ) {
    reasons.push("gaming performance");
  }

  if (
    intent.wantsCoding &&
    product.features.includes("coding")
  ) {
    reasons.push("coding and development");
  }

  if (
    intent.wantsEditing &&
    product.features.includes("editing")
  ) {
    reasons.push("video editing");
  }

  if (
    intent.wantsDesign &&
    product.features.includes("design")
  ) {
    reasons.push("design work");
  }

  // Phone reasons
  if (
    intent.wantsCamera &&
    product.features.includes("camera")
  ) {
    reasons.push("camera performance");
  }

  if (
    intent.wantsDisplay &&
    product.features.includes("display")
  ) {
    reasons.push("display quality");
  }

  if (
    intent.wants5G &&
    product.features.includes("5g")
  ) {
    reasons.push("5G connectivity");
  }

  // Battery
  if (
    intent.wantsBattery &&
    product.features.includes("battery")
  ) {
    reasons.push("battery life");
  }

  // Headphones
  if (
    intent.wantsMusic &&
    product.features.includes("music")
  ) {
    reasons.push("music and audio");
  }

  if (
    intent.wantsANC &&
    product.features.includes("noise cancellation")
  ) {
    reasons.push("noise cancellation");
  }

  if (
    intent.wantsBass &&
    product.features.includes("bass")
  ) {
    reasons.push("powerful bass");
  }

  if (
    intent.wantsWireless &&
    product.features.includes("wireless")
  ) {
    reasons.push("wireless connectivity");
  }

  if (
    intent.wantsComfort &&
    product.features.includes("comfort")
  ) {
    reasons.push("comfortable fit");
  }

  if (
    intent.wantsStudio &&
    product.features.includes("studio")
  ) {
    reasons.push("studio-quality audio");
  }

  // Student
  if (
    intent.wantsStudent &&
    product.features.includes("student")
  ) {
    reasons.push("student-friendly use");
  }

  // Premium
  if (
    intent.wantsPremium &&
    product.features.includes("premium")
  ) {
    reasons.push("premium features");
  }

  // Budget
  if (
    intent.wantsBudget &&
    (
      product.features.includes("budget") ||
      product.features.includes("affordable")
    )
  ) {
    reasons.push("good value for money");
  }

  // User budget
  if (
    budget &&
    product.price <= budget
  ) {
    reasons.push("fits your budget");
  }

  // Rating
  if (product.rating >= 4.8) {
    reasons.push("excellent rating");
  }

  // If no specific reason
  if (reasons.length === 0) {
    return product.description;
  }

  return `Recommended for ${reasons.slice(0, 3).join(", ")}.`;
}

// =========================================================
// SHOPPILOT AI SEARCH
// =========================================================

app.post("/api/search", (req, res) => {
  try {

    const { query } = req.body;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (
      !query ||
      typeof query !== "string" ||
      !query.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a search query.",
      });
    }

    const cleanQuery = query.trim();

    // =====================================================
    // UNDERSTAND USER QUERY
    // =====================================================

    const productType =
      detectProductType(cleanQuery);

    const budget =
      extractBudget(cleanQuery);

    const intent =
      detectIntent(cleanQuery);

    // =====================================================
    // DEBUG LOG
    // This helps us see what ShopPilot understood.
    // =====================================================

    console.log("\n========================================");
    console.log("ShopPilot Search");
    console.log("========================================");
    console.log("Query:", cleanQuery);
    console.log("Detected Type:", productType);
    console.log("Budget:", budget);
    console.log("Intent:", intent);
    console.log("========================================\n");

    // =====================================================
    // START WITH ALL PRODUCTS
    // =====================================================

    let results = [...products];

    // =====================================================
    // FILTER BY PRODUCT TYPE
    // =====================================================

    if (productType) {
      results = results.filter(
        (product) =>
          productMatchesType(
            product,
            productType
          )
      );
    }

    // =====================================================
    // BUDGET FILTER
    //
    // If products exist within budget,
    // only use those products.
    //
    // If no product exists within budget,
    // keep the products so ShopPilot can show
    // alternatives slightly above the budget.
    // =====================================================

    if (budget) {

      const withinBudget =
        results.filter(
          (product) =>
            product.price <= budget
        );

      if (withinBudget.length > 0) {
        results = withinBudget;
      }
    }

    // =====================================================
    // CALCULATE MATCH SCORE
    // =====================================================

    results = results.map((product) => {

      const match =
        calculateMatch(
          product,
          cleanQuery,
          budget,
          intent
        );

      const recommendationReason =
        generateReason(
          product,
          intent,
          budget
        );

      return {
        ...product,
        match,
        recommendationReason,
      };
    });

    // =====================================================
    // SORT RESULTS
    //
    // 1. Match score
    // 2. Rating
    // 3. Lower price
    // =====================================================

    results.sort((a, b) => {

      if (b.match !== a.match) {
        return b.match - a.match;
      }

      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }

      return a.price - b.price;
    });

    // =====================================================
    // RETURN TOP 3
    // =====================================================

    results = results.slice(0, 3);

    // =====================================================
    // RESPONSE
    // =====================================================

    res.json({
      success: true,

      query: cleanQuery,

      detectedCategory: productType,

      budget: budget,

      understanding: {
        category: productType,
        budget: budget,
        intent: intent,
      },

      products: results,
    });

  } catch (error) {

    console.error(
      "ShopPilot Search Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while generating recommendations.",
    });
  }
});

// =========================================================
// 404 HANDLER
// =========================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// =========================================================
// START SERVER
// =========================================================

app.listen(PORT, () => {
  console.log(
    `ShopPilot AI server running on http://localhost:${PORT}`
  );
});