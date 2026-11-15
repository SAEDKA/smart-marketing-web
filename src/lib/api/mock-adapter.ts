import {
  AdminAuditLog,
  AdminComplaintTicket,
  AdminSystemHealth,
  AdminTenant,
  AdminTrafficAnalytics,
  ChangePasswordRequest,
  NotificationItem,
  UpdateAccountProfileRequest,
  AuthUser,
  AiGenerationRequest,
  ApiErrorShape,
  ApiResponse,
  AuthSession,
  BrandSettings,
  Campaign,
  CompanyProfile,
  CreateCampaignRequest,
  CreatePostRequest,
  CreateProductRequest,
  ForgotPasswordRequest,
  GeneratedAiVariant,
  LoginRequest,
  Post,
  PostVersion,
  Product,
  ProductMedia,
  AnalyticsMetricSummary,
  AnalyticsTrendPoint,
  PlatformMetricBreakdown,
  RegisterRequest,
  ResendVerificationRequest,
  ResetPasswordRequest,
  SchedulePostRequest,
  SocialAccount,
  SocialPlatform,
  SwotReport,
  UpdatePostRequest,
  VerifyEmailRequest,
} from "@/types/domain";

const MOCK_LATENCY_MS = 20;

function delay(ms: number = MOCK_LATENCY_MS): Promise<void> {
  if (process.env.NODE_ENV === "test") {
    return Promise.resolve();
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function wrapMockResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    meta: {
      timestamp: new Date().toISOString(),
      mode: "mock",
    },
  };
}

let mockCompanyProfile: CompanyProfile = {
  id: "cmp_lumiere_01",
  companyName: "Lumiere Artisan Roasters",
  industry: "Specialty Coffee & Artisanal Bakery",
  description:
    "Single-origin specialty coffee roastery and artisanal sourdough bakery serving urban coffee enthusiasts across Istanbul and online.",
  targetAudience:
    "Urban professionals, creatives, and specialty coffee lovers aged 24–45 who appreciate ethically sourced beans and craft baking.",
  countryRegion: "Turkey — Istanbul & MENA",
  preferredLanguage: "en",
  communicationTone: "LUXURY",
  brandInformation:
    "Highlight small-batch roasting, direct-trade farms, warm hospitality, and sensory tasting notes. Never use aggressive discount slang.",
  onboardingCompleted: true,
  updatedAt: "2026-11-11T10:30:00.000Z",
};

let mockBrandSettings: BrandSettings = {
  companyId: "cmp_lumiere_01",
  brandName: "Lumiere Artisan Roasters",
  brandDescription:
    "Craft-roasted single-origin coffee and slow-fermented artisanal pastries designed for mindful daily rituals.",
  communicationTone: "LUXURY",
  preferredLanguage: "en",
  targetAudienceSummary:
    "Design-conscious urban professionals and coffee connoisseurs seeking authentic sensory experiences.",
  keyValueProposition:
    "100% traceable micro-lot Arabica beans roasted fresh every week in Istanbul.",
  brandGuidelines:
    "Use refined, evocative language. Pair product storytelling with brewing rituals. Avoid all-caps promotional spam.",
  updatedAt: "2026-11-11T10:30:00.000Z",
};

let mockProducts: Product[] = [
  {
    id: "prd_yirgacheffe_01",
    companyId: "cmp_lumiere_01",
    name: "Ethiopia Yirgacheffe G1 Washed",
    description:
      "Delicate floral notes of jasmine, bergamot citrus, and candied peach. Ethically sourced from smallholder micro-lot farmers in southern Ethiopia.",
    category: "Specialty Coffee",
    price: 24.5,
    currency: "USD",
    discountPercent: 10,
    purchaseUrl: "https://lumierecoffee.com/shop/ethiopia-g1",
    status: "ACTIVE",
    media: [
      {
        id: "med_yirga_01",
        url: "/images/products/coffee-beans.jpg",
        fileName: "yirgacheffe-front-bag.webp",
        fileSize: 1845000,
        mimeType: "image/webp",
        isPrimary: true,
        orderIndex: 0,
      },
      {
        id: "med_yirga_02",
        url: "/images/products/coffee-cup.jpg",
        fileName: "pour-over-ritual.jpg",
        fileSize: 2410000,
        mimeType: "image/jpeg",
        isPrimary: false,
        orderIndex: 1,
      },
      {
        id: "med_yirga_03",
        url: "/images/products/roasting.jpg",
        fileName: "roasting-profile-notes.png",
        fileSize: 1120000,
        mimeType: "image/png",
        isPrimary: false,
        orderIndex: 2,
      },
    ],
    createdAt: "2026-10-15T08:00:00.000Z",
    updatedAt: "2026-11-01T12:00:00.000Z",
  },
  {
    id: "prd_sourdough_02",
    companyId: "cmp_lumiere_01",
    name: "Artisanal Heritage Sourdough Loaf",
    description:
      "Crafted with 36-hour slow cold fermentation and stone-ground organic heritage rye flour. Crisp golden crust with tender, airy crumb.",
    category: "Artisanal Bakery",
    price: 8.5,
    currency: "USD",
    discountPercent: 0,
    purchaseUrl: "https://lumierecoffee.com/shop/heritage-sourdough",
    status: "ACTIVE",
    media: [
      {
        id: "med_sour_01",
        url: "/images/products/sourdough-loaf.jpg",
        fileName: "sourdough-cut-crumb.webp",
        fileSize: 1620000,
        mimeType: "image/webp",
        isPrimary: true,
        orderIndex: 0,
      },
      {
        id: "med_sour_02",
        url: "/images/products/bakery-display.jpg",
        fileName: "fresh-from-hearth-oven.jpg",
        fileSize: 2200000,
        mimeType: "image/jpeg",
        isPrimary: false,
        orderIndex: 1,
      },
    ],
    createdAt: "2026-10-20T09:30:00.000Z",
    updatedAt: "2026-11-05T14:20:00.000Z",
  },
  {
    id: "prd_coldbrew_03",
    companyId: "cmp_lumiere_01",
    name: "Signature Cold Brew Elixir 500ml",
    description:
      "Steeped for 20 hours with filtered glacier water. Low acidity, rich dark cacao and toasted hazelnut finish in glass amber apothecary bottles.",
    category: "Ready-to-Drink",
    price: 16.0,
    currency: "USD",
    discountPercent: 15,
    purchaseUrl: "https://lumierecoffee.com/shop/cold-brew-concentrate",
    status: "DRAFT",
    media: [
      {
        id: "med_cb_01",
        url: "/images/products/cold-brew.jpg",
        fileName: "amber-bottle-cold-brew.png",
        fileSize: 1980000,
        mimeType: "image/png",
        isPrimary: true,
        orderIndex: 0,
      },
    ],
    createdAt: "2026-11-02T11:15:00.000Z",
    updatedAt: "2026-11-08T16:00:00.000Z",
  },
  {
    id: "prd_guatemala_04",
    companyId: "cmp_lumiere_01",
    name: "Guatemala Antigua Los Volcanes",
    description:
      "Shade-grown in volcanic mineral soils. Notes of dark chocolate mousse, brown sugar, and sweet red apple crisp.",
    category: "Specialty Coffee",
    price: 26.0,
    currency: "USD",
    purchaseUrl: "https://lumierecoffee.com/shop/guatemala-antigua",
    status: "ACTIVE",
    media: [
      {
        id: "med_guat_01",
        url: "/images/products/guatemala.jpg",
        fileName: "guatemala-whole-bean.webp",
        fileSize: 1450000,
        mimeType: "image/webp",
        isPrimary: true,
        orderIndex: 0,
      },
      {
        id: "med_guat_02",
        url: "/images/products/cupping.jpg",
        fileName: "sensory-cupping-spoon.jpg",
        fileSize: 2100000,
        mimeType: "image/jpeg",
        isPrimary: false,
        orderIndex: 1,
      },
    ],
    createdAt: "2026-10-25T14:00:00.000Z",
    updatedAt: "2026-11-09T10:00:00.000Z",
  },
  {
    id: "prd_brioche_05",
    companyId: "cmp_lumiere_01",
    name: "Cardamom & Almond Brioche Bun",
    description:
      "Nordic-style enriched dough with crushed cardamom seeds and toasted flaked almonds. Past seasonal special.",
    category: "Artisanal Bakery",
    price: 6.0,
    currency: "USD",
    purchaseUrl: "",
    status: "ARCHIVED",
    media: [
      {
        id: "med_brioche_01",
        url: "/images/products/brioche.jpg",
        fileName: "cardamom-brioche.jpg",
        fileSize: 1200000,
        mimeType: "image/jpeg",
        isPrimary: true,
        orderIndex: 0,
      },
    ],
    createdAt: "2026-09-10T08:00:00.000Z",
    updatedAt: "2026-10-01T12:00:00.000Z",
  },
];

let mockCampaigns: Campaign[] = [
  {
    id: "cmp_winter_drop_01",
    companyId: "cmp_lumiere_01",
    name: "Winter Solstice Micro-Lot Drop",
    objective: "INCREASE_ENGAGEMENT",
    status: "ACTIVE",
    productIds: ["prd_yirgacheffe_01", "prd_guatemala_04"],
    targetAudience:
      "Specialty coffee connoisseurs and mindful ritualists aged 24–40 across Istanbul and urban centers.",
    platforms: ["INSTAGRAM", "FACEBOOK"],
    startDate: "2026-11-15",
    endDate: "2026-12-05",
    contentLanguage: "en",
    communicationTone: "LUXURY",
    publishingFrequency: "3 posts/week",
    budgetNotes: "Organic launch + $250 promotional boost on Instagram carousel highlights.",
    createdAt: "2026-11-01T10:00:00.000Z",
    updatedAt: "2026-11-10T14:30:00.000Z",
  },
  {
    id: "cmp_bakery_launch_02",
    companyId: "cmp_lumiere_01",
    name: "Artisanal Weekend Hearth Loaf Launch",
    objective: "INCREASE_SALES",
    status: "ACTIVE",
    productIds: ["prd_sourdough_02"],
    targetAudience:
      "Local neighborhood foodies, organic sourdough lovers, and weekend brunch planners.",
    platforms: ["INSTAGRAM"],
    startDate: "2026-11-20",
    endDate: "2026-11-28",
    contentLanguage: "en",
    communicationTone: "FRIENDLY",
    publishingFrequency: "Daily stories + 2 reels",
    budgetNotes: "In-store pickup CTA campaign.",
    createdAt: "2026-11-04T12:00:00.000Z",
    updatedAt: "2026-11-09T09:15:00.000Z",
  },
  {
    id: "cmp_coldbrew_pilot_03",
    companyId: "cmp_lumiere_01",
    name: "Cold Brew Elixir Summer Teaser",
    objective: "INCREASE_AWARENESS",
    status: "DRAFT",
    productIds: ["prd_coldbrew_03"],
    targetAudience:
      "Design studio workers, creatives, and iced beverage enthusiasts seeking low acidity.",
    platforms: ["INSTAGRAM", "FACEBOOK"],
    startDate: "2026-12-01",
    endDate: "2026-12-15",
    contentLanguage: "en",
    communicationTone: "BOLD",
    publishingFrequency: "2 posts/week",
    budgetNotes: "Focus on aesthetic amber apothecary bottle presentation.",
    createdAt: "2026-11-08T15:00:00.000Z",
    updatedAt: "2026-11-08T15:00:00.000Z",
  },
  {
    id: "cmp_autumn_harvest_04",
    companyId: "cmp_lumiere_01",
    name: "Autumn Harvest Roaster Retrospective",
    objective: "INCREASE_AWARENESS",
    status: "COMPLETED",
    productIds: ["prd_yirgacheffe_01"],
    targetAudience: "Coffee club subscribers and ethical trade supporters.",
    platforms: ["INSTAGRAM"],
    startDate: "2026-10-01",
    endDate: "2026-10-25",
    contentLanguage: "en",
    communicationTone: "EDUCATIONAL",
    publishingFrequency: "1 post/week",
    budgetNotes: "Completed seasonal review campaign.",
    createdAt: "2026-09-25T08:00:00.000Z",
    updatedAt: "2026-10-26T18:00:00.000Z",
  },
];

let mockPosts: Post[] = [
  {
    id: "pst_yirga_drop_01",
    companyId: "cmp_lumiere_01",
    campaignId: "cmp_winter_drop_01",
    campaignName: "Winter Solstice Micro-Lot Drop",
    productId: "prd_yirgacheffe_01",
    productName: "Ethiopia Yirgacheffe G1 Washed",
    platform: "INSTAGRAM",
    status: "PENDING_REVIEW",
    mediaUrl: "/images/products/coffee-beans.jpg",
    currentVersion: {
      id: "ver_02",
      versionNumber: 2,
      source: "MANUAL_EDIT",
      title: "Morning Rituals: Rare Ethiopian Micro-Lots",
      caption:
        "Elevate your dawn ritual. Single-origin notes of fresh jasmine, bergamot citrus, and candied peach sourced directly from smallholder plots in southern Ethiopia. Roasted fresh weekly in Istanbul.",
      hashtags: [
        "#SpecialtyCoffee",
        "#LumiereRoasters",
        "#EthiopiaYirgacheffe",
        "#ThirdWaveCoffee",
        "#ArtisanRoastery",
      ],
      callToAction: "Order your freshly roasted 250g bag via the link in our bio.",
      visualIdea:
        "Close-up high-angle overhead shot of slow pour-over dripping into handcrafted ceramic vessel with steam wisps.",
      authorName: "Sarah Jenkins",
      createdAt: "2026-11-10T11:30:00.000Z",
    },
    versions: [
      {
        id: "ver_01",
        versionNumber: 1,
        source: "AI_GENERATED",
        title: "Ethiopia Yirgacheffe G1 Harvest",
        caption:
          "Experience the floral elegance of Ethiopia Yirgacheffe G1. Savor crisp bergamot and jasmine aromatics fresh from our roastery.",
        hashtags: [
          "#CoffeeLovers",
          "#SpecialtyCoffee",
          "#Yirgacheffe",
          "#FreshRoast",
        ],
        callToAction: "Tap the link in bio to shop the limited drop.",
        visualIdea: "Product packaging centered on rustic wooden cutting board.",
        authorName: "AI Content Engine (v1)",
        createdAt: "2026-11-10T10:00:00.000Z",
      },
      {
        id: "ver_02",
        versionNumber: 2,
        source: "MANUAL_EDIT",
        title: "Morning Rituals: Rare Ethiopian Micro-Lots",
        caption:
          "Elevate your dawn ritual. Single-origin notes of fresh jasmine, bergamot citrus, and candied peach sourced directly from smallholder plots in southern Ethiopia. Roasted fresh weekly in Istanbul.",
        hashtags: [
          "#SpecialtyCoffee",
          "#LumiereRoasters",
          "#EthiopiaYirgacheffe",
          "#ThirdWaveCoffee",
          "#ArtisanRoastery",
        ],
        callToAction: "Order your freshly roasted 250g bag via the link in our bio.",
        visualIdea:
          "Close-up high-angle overhead shot of slow pour-over dripping into handcrafted ceramic vessel with steam wisps.",
        authorName: "Sarah Jenkins",
        createdAt: "2026-11-10T11:30:00.000Z",
      },
    ],
    createdAt: "2026-11-10T10:00:00.000Z",
    updatedAt: "2026-11-10T11:30:00.000Z",
  },
  {
    id: "pst_sourdough_bake_02",
    companyId: "cmp_lumiere_01",
    campaignId: "cmp_bakery_launch_02",
    campaignName: "Artisanal Weekend Hearth Loaf Launch",
    productId: "prd_sourdough_02",
    productName: "Artisanal Heritage Sourdough Loaf",
    platform: "FACEBOOK",
    status: "APPROVED",
    mediaUrl: "/images/products/sourdough-loaf.jpg",
    currentVersion: {
      id: "ver_03",
      versionNumber: 1,
      source: "AI_GENERATED",
      title: "Weekend Hearth Sourdough Special",
      caption:
        "Slow-fermented for 36 hours with stone-ground heritage organic rye. Crisp blistered golden crust and an open, tender crumb crafted fresh for your weekend table.",
      hashtags: [
        "#ArtisanalBakery",
        "#SourdoughLoaf",
        "#SlowFermentation",
        "#LumiereBakery",
      ],
      callToAction:
        "Reserve your fresh loaf online or visit our bakery counter this Saturday morning from 8:00 AM.",
      visualIdea:
        "Cross-section of golden crust loaf resting on flour-dusted marble counter.",
      authorName: "AI Content Engine",
      createdAt: "2026-11-09T14:00:00.000Z",
    },
    versions: [
      {
        id: "ver_03",
        versionNumber: 1,
        source: "AI_GENERATED",
        title: "Weekend Hearth Sourdough Special",
        caption:
          "Slow-fermented for 36 hours with stone-ground heritage organic rye. Crisp blistered golden crust and an open, tender crumb crafted fresh for your weekend table.",
        hashtags: [
          "#ArtisanalBakery",
          "#SourdoughLoaf",
          "#SlowFermentation",
          "#LumiereBakery",
        ],
        callToAction:
          "Reserve your fresh loaf online or visit our bakery counter this Saturday morning from 8:00 AM.",
        visualIdea:
          "Cross-section of golden crust loaf resting on flour-dusted marble counter.",
        authorName: "AI Content Engine",
        createdAt: "2026-11-09T14:00:00.000Z",
      },
    ],
    createdAt: "2026-11-09T14:00:00.000Z",
    updatedAt: "2026-11-09T14:00:00.000Z",
  },
  {
    id: "pst_coldbrew_elixir_03",
    companyId: "cmp_lumiere_01",
    campaignId: "cmp_coldbrew_pilot_03",
    campaignName: "Cold Brew Elixir Summer Teaser",
    productId: "prd_coldbrew_03",
    productName: "Signature Cold Brew Elixir 500ml",
    platform: "INSTAGRAM",
    status: "DRAFT",
    mediaUrl: "/images/products/cold-brew.jpg",
    currentVersion: {
      id: "ver_04",
      versionNumber: 1,
      source: "AI_GENERATED",
      title: "Cold Brew Clarity",
      caption:
        "20 hours of cold immersion extraction. Velvety notes of cacao nibs and toasted hazelnut without harsh acidity.",
      hashtags: [
        "#ColdBrew",
        "#ColdBrewElixir",
        "#SpecialtyCoffee",
        "#SummerSips",
      ],
      callToAction: "Sign up for pre-order notifications on our website.",
      visualIdea:
        "Amber glass apothecary bottle on raw stone with condensation droplets.",
      authorName: "AI Content Engine",
      createdAt: "2026-11-08T16:00:00.000Z",
    },
    versions: [
      {
        id: "ver_04",
        versionNumber: 1,
        source: "AI_GENERATED",
        title: "Cold Brew Clarity",
        caption:
          "20 hours of cold immersion extraction. Velvety notes of cacao nibs and toasted hazelnut without harsh acidity.",
        hashtags: [
          "#ColdBrew",
          "#ColdBrewElixir",
          "#SpecialtyCoffee",
          "#SummerSips",
        ],
        callToAction: "Sign up for pre-order notifications on our website.",
        visualIdea:
          "Amber glass apothecary bottle on raw stone with condensation droplets.",
        authorName: "AI Content Engine",
        createdAt: "2026-11-08T16:00:00.000Z",
      },
    ],
    createdAt: "2026-11-08T16:00:00.000Z",
    updatedAt: "2026-11-08T16:00:00.000Z",
  },
  {
    id: "pst_guatemala_rejected_04",
    companyId: "cmp_lumiere_01",
    campaignId: "cmp_winter_drop_01",
    campaignName: "Winter Solstice Micro-Lot Drop",
    productId: "prd_guatemala_04",
    productName: "Guatemala Antigua Los Volcanes",
    platform: "INSTAGRAM",
    status: "REJECTED",
    rejectionReason:
      "Please highlight the volcanic altitude and make the first sentence more evocative.",
    mediaUrl: "/images/products/guatemala.jpg",
    currentVersion: {
      id: "ver_05",
      versionNumber: 1,
      source: "AI_GENERATED",
      title: "Guatemala Antigua Beans",
      caption:
        "Grown on volcanic slopes. Taste dark chocolate mousse and red apple notes.",
      hashtags: ["#GuatemalaCoffee", "#CoffeeBeans"],
      callToAction: "Order now.",
      visualIdea: "Coffee bag on table.",
      authorName: "AI Content Engine",
      createdAt: "2026-11-07T09:00:00.000Z",
    },
    versions: [
      {
        id: "ver_05",
        versionNumber: 1,
        source: "AI_GENERATED",
        title: "Guatemala Antigua Beans",
        caption:
          "Grown on volcanic slopes. Taste dark chocolate mousse and red apple notes.",
        hashtags: ["#GuatemalaCoffee", "#CoffeeBeans"],
        callToAction: "Order now.",
        visualIdea: "Coffee bag on table.",
        authorName: "AI Content Engine",
        createdAt: "2026-11-07T09:00:00.000Z",
      },
    ],
    createdAt: "2026-11-07T09:00:00.000Z",
    updatedAt: "2026-11-07T12:00:00.000Z",
  },
  {
    id: "pst_scheduled_solstice_05",
    companyId: "cmp_lumiere_01",
    campaignId: "cmp_winter_drop_01",
    campaignName: "Winter Solstice Micro-Lot Drop",
    productId: "prd_yirgacheffe_01",
    productName: "Ethiopia Yirgacheffe G1 Washed",
    platform: "INSTAGRAM",
    status: "SCHEDULED",
    scheduledAt: "2026-11-13T10:00:00.000Z",
    mediaUrl: "/images/products/coffee-beans.jpg",
    currentVersion: {
      id: "ver_06",
      versionNumber: 1,
      source: "AI_GENERATED",
      title: "Tomorrow Morning: Seasonal Roast Drop",
      caption:
        "Only 50 bags reserved for this batch. Crisp notes of bergamot, honeysuckle, and candied peach direct from Yirgacheffe highlands.",
      hashtags: ["#SpecialtyCoffee", "#BatchDrop", "#Yirgacheffe"],
      callToAction: "Turn on post notifications so you don't miss the 10 AM drop.",
      visualIdea: "Ceramic cup steaming beside roasted bean burlap sack.",
      authorName: "Sarah Jenkins",
      createdAt: "2026-11-11T09:00:00.000Z",
    },
    versions: [
      {
        id: "ver_06",
        versionNumber: 1,
        source: "AI_GENERATED",
        title: "Tomorrow Morning: Seasonal Roast Drop",
        caption:
          "Only 50 bags reserved for this batch. Crisp notes of bergamot, honeysuckle, and candied peach direct from Yirgacheffe highlands.",
        hashtags: ["#SpecialtyCoffee", "#BatchDrop", "#Yirgacheffe"],
        callToAction:
          "Turn on post notifications so you don't miss the 10 AM drop.",
        visualIdea: "Ceramic cup steaming beside roasted bean burlap sack.",
        authorName: "Sarah Jenkins",
        createdAt: "2026-11-11T09:00:00.000Z",
      },
    ],
    createdAt: "2026-11-11T09:00:00.000Z",
    updatedAt: "2026-11-11T09:30:00.000Z",
  },
  {
    id: "pst_published_ethiopia_06",
    companyId: "cmp_lumiere_01",
    campaignId: "cmp_winter_drop_01",
    campaignName: "Winter Solstice Micro-Lot Drop",
    productId: "prd_yirgacheffe_01",
    productName: "Ethiopia Yirgacheffe G1 Washed",
    platform: "INSTAGRAM",
    status: "PUBLISHED",
    publishedAt: "2026-11-09T08:30:00.000Z",
    externalPostUrl: "https://instagram.com/p/DBk948L11",
    mediaUrl: "/images/products/coffee-beans.jpg",
    currentVersion: {
      id: "ver_07",
      versionNumber: 1,
      source: "MANUAL_EDIT",
      title: "Live: Roastery Morning Edition",
      caption:
        "The scent of fresh morning roast fills the atelier. Drop by Karaköy or order online for worldwide delivery.",
      hashtags: ["#ArtisanCoffee", "#LumiereAtelier", "#IstanbulCoffee"],
      callToAction: "Order via link in bio.",
      visualIdea: "Storefront espresso bar with golden morning light.",
      authorName: "Sarah Jenkins",
      createdAt: "2026-11-09T08:00:00.000Z",
    },
    versions: [
      {
        id: "ver_07",
        versionNumber: 1,
        source: "MANUAL_EDIT",
        title: "Live: Roastery Morning Edition",
        caption:
          "The scent of fresh morning roast fills the atelier. Drop by Karaköy or order online for worldwide delivery.",
        hashtags: ["#ArtisanCoffee", "#LumiereAtelier", "#IstanbulCoffee"],
        callToAction: "Order via link in bio.",
        visualIdea: "Storefront espresso bar with golden morning light.",
        authorName: "Sarah Jenkins",
        createdAt: "2026-11-09T08:00:00.000Z",
      },
    ],
    createdAt: "2026-11-09T08:00:00.000Z",
    updatedAt: "2026-11-09T08:30:00.000Z",
  },
  {
    id: "pst_failed_facebook_07",
    companyId: "cmp_lumiere_01",
    campaignId: "cmp_bakery_launch_02",
    campaignName: "Artisanal Weekend Hearth Loaf Launch",
    productId: "prd_sourdough_02",
    productName: "Artisanal Heritage Sourdough Loaf",
    platform: "FACEBOOK",
    status: "FAILED",
    scheduledAt: "2026-11-10T14:00:00.000Z",
    publishingError:
      "Meta Graph API Error (Code 190): Page access token expired. Reconnect Facebook Page in Integrations to restore automated publishing.",
    mediaUrl: "/images/products/sourdough-loaf.jpg",
    currentVersion: {
      id: "ver_08",
      versionNumber: 1,
      source: "AI_GENERATED",
      title: "Weekend Loaves Fresh from Oven",
      caption:
        "Heritage rye and slow natural fermentation. Reserved loaves available now for pick up this weekend.",
      hashtags: ["#ArtisanBakery", "#SourdoughLoaf", "#FreshBake"],
      callToAction: "Comment below or message us to reserve your weekend loaf.",
      visualIdea: "Rustic sourdough loaf on wooden peel coming out of hearth.",
      authorName: "AI Content Engine",
      createdAt: "2026-11-10T12:00:00.000Z",
    },
    versions: [
      {
        id: "ver_08",
        versionNumber: 1,
        source: "AI_GENERATED",
        title: "Weekend Loaves Fresh from Oven",
        caption:
          "Heritage rye and slow natural fermentation. Reserved loaves available now for pick up this weekend.",
        hashtags: ["#ArtisanBakery", "#SourdoughLoaf", "#FreshBake"],
        callToAction:
          "Comment below or message us to reserve your weekend loaf.",
        visualIdea:
          "Rustic sourdough loaf on wooden peel coming out of hearth.",
        authorName: "AI Content Engine",
        createdAt: "2026-11-10T12:00:00.000Z",
      },
    ],
    createdAt: "2026-11-10T12:00:00.000Z",
    updatedAt: "2026-11-10T14:01:00.000Z",
  },
];

let mockSocialAccounts: SocialAccount[] = [
  {
    id: "soc_instagram_01",
    companyId: "cmp_lumiere_01",
    platform: "INSTAGRAM",
    accountName: "Lumière Artisan Roastery",
    accountHandle: "@lumiere_roasters",
    externalId: "ig_act_991823441",
    avatarUrl: "/images/brand/instagram-avatar.jpg",
    status: "CONNECTED",
    followerCount: 14850,
    tokenExpiresAt: "2027-01-15T00:00:00.000Z",
    connectedAt: "2026-10-01T10:00:00.000Z",
    lastSyncedAt: "2026-11-11T08:00:00.000Z",
  },
  {
    id: "soc_facebook_02",
    companyId: "cmp_lumiere_01",
    platform: "FACEBOOK",
    accountName: "Lumière Roastery & Bakery Official",
    accountHandle: "@lumiereroasteryistanbul",
    externalId: "fb_page_88192301",
    avatarUrl: "/images/brand/facebook-avatar.jpg",
    status: "TOKEN_EXPIRED",
    followerCount: 8920,
    tokenExpiresAt: "2026-11-09T00:00:00.000Z",
    connectedAt: "2026-09-15T12:00:00.000Z",
    lastSyncedAt: "2026-11-09T23:59:00.000Z",
  },
];

let mockAnalyticsSummary: AnalyticsMetricSummary = {
  reach: 18420,
  impressions: 42910,
  engagementRate: 4.82,
  likes: 3840,
  comments: 612,
  shares: 384,
  saves: 920,
  linkClicks: 1420,
  clickThroughRate: 3.31,
  reachChangePercent: 14.2,
  impressionsChangePercent: 18.6,
  engagementChangePercent: 0.65,
  clicksChangePercent: 8.4,
  measuredPeriod: "Last 30 Days (Oct 12 – Nov 11, 2026)",
  lastSynchronizedAt: "2026-11-11T09:15:00.000Z",
};

let mockAnalyticsTrends: AnalyticsTrendPoint[] = [
  { date: "2026-11-01", label: "Nov 01", reach: 1200, impressions: 2800, engagement: 140 },
  { date: "2026-11-02", label: "Nov 02", reach: 1450, impressions: 3200, engagement: 168 },
  { date: "2026-11-03", label: "Nov 03", reach: 1300, impressions: 3050, engagement: 155 },
  { date: "2026-11-04", label: "Nov 04", reach: 2100, impressions: 4900, engagement: 260 }, // Spike on Wednesday
  { date: "2026-11-05", label: "Nov 05", reach: 1600, impressions: 3800, engagement: 195 },
  { date: "2026-11-06", label: "Nov 06", reach: 1800, impressions: 4100, engagement: 220 },
  { date: "2026-11-07", label: "Nov 07", reach: 2400, impressions: 5600, engagement: 310 }, // Weekend drop
  { date: "2026-11-08", label: "Nov 08", reach: 2250, impressions: 5200, engagement: 280 },
  { date: "2026-11-09", label: "Nov 09", reach: 1750, impressions: 3950, engagement: 205 },
  { date: "2026-11-10", label: "Nov 10", reach: 1900, impressions: 4400, engagement: 235 },
  { date: "2026-11-11", label: "Nov 11", reach: 2670, impressions: 5910, engagement: 345 },
];

let mockPlatformBreakdowns: PlatformMetricBreakdown[] = [
  {
    platform: "INSTAGRAM",
    reach: 12400,
    impressions: 29800,
    engagementRate: 5.4,
    shares: 260,
  },
  {
    platform: "FACEBOOK",
    reach: 6020,
    impressions: 13110,
    engagementRate: 3.6,
    shares: 124,
  },
];

let mockSwotReport: SwotReport = {
  companyId: "cmp_lumiere_01",
  generatedAt: "2026-11-11T08:00:00.000Z",
  hasSufficientData: true,
  publishedPostsCount: 12,
  items: [
    {
      id: "swot_s1",
      category: "STRENGTH",
      title: "High Save Rate on Brewing Craft Guides",
      description: "Audience actively bookmarks step-by-step pour-over and immersion recipes for later reference.",
      numericalEvidence: "Saves account for 24% of all interactions, 3.2x above specialty food benchmark.",
      impactScore: "HIGH",
    },
    {
      id: "swot_s2",
      category: "STRENGTH",
      title: "Peak Morning Engagement Window Identified",
      description: "Mid-week morning releases produce immediate comment velocity and higher algorithmic feed elevation.",
      numericalEvidence: "Wednesday morning posts (08:00-09:30 AM) generate +48% more comments than evening posts.",
      impactScore: "HIGH",
    },
    {
      id: "swot_w1",
      category: "WEAKNESS",
      title: "Facebook Link Click Conversion Decay",
      description: "Facebook audience rarely clicks external shop links in post text compared to Instagram bio referrals.",
      numericalEvidence: "Link click-through rate on Facebook is 1.8%, compared to 4.2% on Instagram bio links.",
      impactScore: "MEDIUM",
    },
    {
      id: "swot_w2",
      category: "WEAKNESS",
      title: "Token Expiry Publishing Interruption",
      description: "OAuth token lapse on Facebook caused automated schedule disruption during peak weekend sales.",
      numericalEvidence: "2 scheduled weekend posts failed dispatch; estimated 3,400 missed impressions.",
      impactScore: "HIGH",
    },
    {
      id: "swot_o1",
      category: "OPPORTUNITY",
      title: "Terroir & Farmer Storytelling Expansion",
      description: "Origin-focused micro-lot features resonate strongly with conscious consumers willing to pay premium prices.",
      numericalEvidence: "Posts mentioning origin terroir and farmers had 62% higher share volume.",
      impactScore: "HIGH",
    },
    {
      id: "swot_o2",
      category: "OPPORTUNITY",
      title: "Vertical Video Format Staging (Reels)",
      description: "Transitioning product photography into motion pour extraction videos expands non-follower discovery.",
      numericalEvidence: "Video posts generate 2.1x more organic reach than static images on Instagram.",
      impactScore: "HIGH",
    },
    {
      id: "swot_t1",
      category: "THREAT",
      title: "Specialty Roaster Market Crowding",
      description: "Competitor ad density in specialty beverage segment is escalating customer acquisition costs.",
      numericalEvidence: "Local competitor ad impressions up 22% in Istanbul metropolitan region.",
      impactScore: "MEDIUM",
    },
    {
      id: "swot_t2",
      category: "THREAT",
      title: "Meta Organic Reach Decay",
      description: "Platform algorithms increasingly deprioritize organic static posts without rapid initial interaction.",
      numericalEvidence: "Static feed impressions down 4.1% platform-wide quarter-over-quarter.",
      impactScore: "MEDIUM",
    },
  ],
  recommendations: [
    {
      id: "rec_01",
      priority: "HIGH",
      title: "Shift 50% of Creative Assets to 4:5 Vertical Video Formats",
      rationale: "Data demonstrates 2.1x reach multiplier on motion extraction content versus static images.",
      actionItem: "Film short 8-12 second slow-motion extraction reels for all upcoming single-origin drops.",
      expectedImpact: "+35% Organic Reach & Higher Save Velocity",
      linkedCampaignObjective: "INCREASE_ENGAGEMENT",
    },
    {
      id: "rec_02",
      priority: "HIGH",
      title: "Schedule Roastery Drops Exclusively on Wednesday Mornings",
      rationale: "Highest comment velocity occurs between 08:00 AM and 09:30 AM on Wednesdays.",
      actionItem: "Set automated calendar publishing slot to Wednesdays 08:30 AM Europe/Istanbul.",
      expectedImpact: "+48% First-Hour Comments and Algorithm Boost",
      linkedCampaignObjective: "INCREASE_SALES",
    },
    {
      id: "rec_03",
      priority: "MEDIUM",
      title: "Refresh Facebook Token and Re-align Post Formats",
      rationale: "Facebook token is expired and text link CTR is lagging behind Instagram.",
      actionItem: "Reconnect Facebook Page in Integrations and replace direct URLs with native photo carousels.",
      expectedImpact: "Restore automated publishing stability and recover Facebook CTR",
      linkedCampaignObjective: "INCREASE_ENGAGEMENT",
    },
    {
      id: "rec_04",
      priority: "LOW",
      title: "Launch Bi-Weekly Producer Spotlight Series",
      rationale: "Terroir transparency and direct-trade stories show 62% higher viral share velocity.",
      actionItem: "Use AI Studio with Educational tone to generate 2 spotlight posts per month for featured lots.",
      expectedImpact: "+20% Brand Trust and Ethical Sourcing Mentions",
      linkedCampaignObjective: "INCREASE_AWARENESS",
    },
  ],
};

let mockAdminTenants: AdminTenant[] = [
  {
    id: "cmp_lumiere_01",
    companyName: "Lumière Artisan Roastery",
    ownerName: "Sarah Jenkins",
    ownerEmail: "owner@company.com",
    plan: "PROFESSIONAL",
    status: "ACTIVE",
    productCount: 4,
    campaignCount: 4,
    createdAt: "2026-10-01T08:00:00.000Z",
  },
  {
    id: "cmp_bosphorus_02",
    companyName: "Bosphorus Coffee Lab",
    ownerName: "Caner Yılmaz",
    ownerEmail: "caner@bosphoruscoffee.com",
    plan: "ENTERPRISE",
    status: "ACTIVE",
    productCount: 12,
    campaignCount: 8,
    createdAt: "2026-09-15T10:00:00.000Z",
  },
  {
    id: "cmp_karakoy_03",
    companyName: "Karaköy Artisan Bakery Co",
    ownerName: "Mert Demir",
    ownerEmail: "mert@karakoybake.com",
    plan: "STARTER",
    status: "ACTIVE",
    productCount: 6,
    campaignCount: 2,
    createdAt: "2026-10-20T14:30:00.000Z",
  },
  {
    id: "cmp_spices_04",
    companyName: "Anatolian Botanicals & Spices",
    ownerName: "Zeynep Kaya",
    ownerEmail: "zeynep@anatolianspice.com",
    plan: "PROFESSIONAL",
    status: "SUSPENDED",
    productCount: 8,
    campaignCount: 1,
    createdAt: "2026-08-10T11:00:00.000Z",
  },
];

let mockAdminHealth: AdminSystemHealth = {
  totalTenants: 48,
  activeTenants: 46,
  queuedPublishJobs: 14,
  aiTokensConsumed: 184500,
  metaApiStatus: "OPERATIONAL",
  aiWorkerStatus: "OPERATIONAL",
  dbLatencyMs: 18,
};

let mockAdminTraffic: AdminTrafficAnalytics = {
  totalVisitors30d: 128450,
  visitorsGrowthPercent: 24.8,
  totalPageViews30d: 412900,
  activeLiveVisitors: 342,
  avgSessionDuration: "14m 20s",
  signupConversionRate: 6.4,
  dailyTraffic: [
    { date: "Nov 05", visitors: 3820, pageViews: 11900, signups: 14 },
    { date: "Nov 06", visitors: 4150, pageViews: 13200, signups: 19 },
    { date: "Nov 07", visitors: 4490, pageViews: 14800, signups: 22 },
    { date: "Nov 08", visitors: 4210, pageViews: 13900, signups: 18 },
    { date: "Nov 09", visitors: 4860, pageViews: 16400, signups: 27 },
    { date: "Nov 10", visitors: 5120, pageViews: 17900, signups: 31 },
    { date: "Nov 11", visitors: 5640, pageViews: 19800, signups: 38 },
  ],
  featureUsage: [
    {
      featureKey: "ai_studio",
      featureName: "AI Content Studio & Variants",
      usagePercent: 42,
      sessionsCount: 54120,
    },
    {
      featureKey: "publishing_calendar",
      featureName: "Publishing Calendar & Meta Sync",
      usagePercent: 26,
      sessionsCount: 33490,
    },
    {
      featureKey: "products_campaigns",
      featureName: "Product Catalog & Campaigns",
      usagePercent: 19,
      sessionsCount: 24410,
    },
    {
      featureKey: "swot_analytics",
      featureName: "SWOT Reports & Performance Analytics",
      usagePercent: 13,
      sessionsCount: 16690,
    },
  ],
  topRegions: [
    { country: "Turkey (TR)", visitors: 48810, sharePercent: 38 },
    { country: "Saudi Arabia & UAE (MENA)", visitors: 37250, sharePercent: 29 },
    { country: "European Union (EU)", visitors: 26970, sharePercent: 21 },
    { country: "United Kingdom & US", visitors: 15420, sharePercent: 12 },
  ],
};

let mockAdminComplaints: AdminComplaintTicket[] = [
  {
    id: "tkt_1042",
    companyName: "Bosphorus Silk & Atelier",
    ownerName: "Leyla Demir",
    ownerEmail: "leyla@bosphorussilk.com",
    category: "SOCIAL_INTEGRATION",
    priority: "HIGH",
    status: "OPEN",
    subject: "Instagram Business token renewal prompt appears twice",
    message:
      "When reconnecting our Instagram Professional account, the OAuth confirmation completed but the status badge took 10 minutes to refresh. Please verify our page webhook.",
    createdAt: "2026-11-11T11:20:00.000Z",
    updatedAt: "2026-11-11T11:20:00.000Z",
  },
  {
    id: "tkt_1041",
    companyName: "Nomad Ceramic Studio",
    ownerName: "Omar Al-Farsi",
    ownerEmail: "omar@nomadceramics.io",
    category: "BILLING",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    subject: "Request to upgrade from Starter to Enterprise plan",
    message:
      "We are launching 4 new regional campaigns next week and need higher monthly AI generation limits and multi-page Facebook support.",
    adminReply:
      "Hello Omar, we have enabled your temporary quota boost while your Enterprise invoice is finalized.",
    createdAt: "2026-11-10T15:40:00.000Z",
    updatedAt: "2026-11-11T09:10:00.000Z",
  },
  {
    id: "tkt_1039",
    companyName: "Lumiere Artisan Roasters",
    ownerName: "Sarah Jenkins",
    ownerEmail: "sarah@lumierecoffee.com",
    category: "AI_QUALITY",
    priority: "LOW",
    status: "RESOLVED",
    subject: "Arabic dialect tone preference for specialty coffee posts",
    message:
      "Can we save Modern Standard Arabic as our default brand voice for seasonal launches?",
    adminReply:
      "Resolved: Your brand profile now locks Modern Standard Arabic (ar) with Luxury tone across all new campaigns.",
    createdAt: "2026-11-08T10:05:00.000Z",
    updatedAt: "2026-11-08T14:30:00.000Z",
  },
];

let mockAdminAuditLogs: AdminAuditLog[] = [
  {
    id: "log_01",
    actor: "Kemal Arslan (System Admin)",
    action: "Flushed AI Neural Embeddings Cache (142 entries cleared)",
    target: "AI Synthesis Cluster",
    timestamp: "2026-11-11T10:45:00.000Z",
    severity: "INFO",
  },
  {
    id: "log_02",
    actor: "Kemal Arslan (System Admin)",
    action: "Suspended tenant account due to overdue invoice",
    target: "Anatolian Botanicals & Spices (cmp_spices_04)",
    timestamp: "2026-11-10T16:12:00.000Z",
    severity: "WARNING",
  },
  {
    id: "log_03",
    actor: "Automated System Watchdog",
    action: "Verified Meta Graph API webhook SSL handshake (18ms latency)",
    target: "Meta Graph Dispatcher",
    timestamp: "2026-11-10T08:00:00.000Z",
    severity: "INFO",
  },
];

let mockNotifications: NotificationItem[] = [
  {
    id: "notif_01",
    companyId: "cmp_lumiere_01",
    category: "PUBLISHING",
    title: "Publication Scheduled",
    message: "Winter Solstice micro-lot drop post scheduled for Nov 13, 10:00 AM Europe/Istanbul.",
    isRead: false,
    actionUrl: "/calendar",
    createdAt: "2026-11-11T09:30:00.000Z",
  },
  {
    id: "notif_02",
    companyId: "cmp_lumiere_01",
    category: "SECURITY",
    title: "Facebook Page Token Expired",
    message: "Re-authorize your Facebook Page in Integrations to resume automated posting.",
    isRead: false,
    actionUrl: "/integrations",
    createdAt: "2026-11-10T14:01:00.000Z",
  },
  {
    id: "notif_03",
    companyId: "cmp_lumiere_01",
    category: "AI_STUDIO",
    title: "AI Generation Job Completed",
    message: "3 multi-variant marketing captions synthesized successfully for Guatemala Antigua.",
    isRead: true,
    actionUrl: "/content-studio",
    createdAt: "2026-11-09T16:20:00.000Z",
  },
  {
    id: "notif_04",
    companyId: "cmp_lumiere_01",
    category: "SYSTEM",
    title: "Weekly Telemetry Report Ready",
    message: "Your weekly SWOT and performance telemetry report is now available for review.",
    isRead: true,
    actionUrl: "/reports",
    createdAt: "2026-11-08T08:00:00.000Z",
  },
];

let mockUserProfile: AuthUser = {
  id: "usr_owner_01",
  email: "owner@company.com",
  fullName: "Sarah Jenkins",
  role: "COMPANY_OWNER",
  emailVerified: true,
  onboardingCompleted: true,
  companyId: "cmp_lumiere_01",
  createdAt: "2026-10-01T08:00:00.000Z",
};

export async function mockRequestHandler<T>(
  method: string,
  endpoint: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  await delay();

  // AUTH: POST /auth/login (BE-01-03)
  if (method === "POST" && endpoint === "/auth/login") {
    const payload = body as LoginRequest;
    if (!payload.email || !payload.email.includes("@")) {
      const err: ApiErrorShape = {
        code: "VALIDATION_ERROR",
        message: "Invalid email format rejected by API contract.",
        fieldErrors: [{ field: "email", message: "Valid work email required" }],
        status: 400,
      };
      throw err;
    }
    if (!payload.password || payload.password.length < 8) {
      const err: ApiErrorShape = {
        code: "UNAUTHORIZED",
        message: "Invalid email or password. Please verify your credentials.",
        status: 401,
      };
      throw err;
    }
    if (payload.email.toLowerCase() === "locked@company.com") {
      const err: ApiErrorShape = {
        code: "FORBIDDEN",
        message: "This account has been locked by System Administration.",
        status: 403,
      };
      throw err;
    }

    const isAdmin = payload.email.toLowerCase().includes("admin");
    const session: AuthSession = {
      user: {
        id: isAdmin ? "usr_admin_01" : "usr_owner_01",
        email: payload.email,
        fullName: isAdmin ? "Kemal Arslan (System Admin)" : "Sarah Jenkins",
        role: isAdmin ? "SYSTEM_ADMIN" : "COMPANY_OWNER",
        emailVerified: true,
        onboardingCompleted: mockCompanyProfile.onboardingCompleted,
        // Platform admin has no company; only client accounts do.
        companyId: isAdmin ? undefined : mockCompanyProfile.id,
        createdAt: "2026-10-01T09:00:00.000Z",
      },
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
      isSimulated: true,
    };
    return wrapMockResponse(session as unknown as T);
  }

  // AUTH: POST /auth/register (BE-01-03)
  if (method === "POST" && endpoint === "/auth/register") {
    const payload = body as RegisterRequest;
    if (payload.email.toLowerCase() === "existing@company.com") {
      const err: ApiErrorShape = {
        code: "VALIDATION_ERROR",
        message: "A company workspace with this email address is already registered.",
        fieldErrors: [
          { field: "email", message: "Email address is already in use." },
        ],
        status: 409,
      };
      throw err;
    }
    mockCompanyProfile = {
      ...mockCompanyProfile,
      companyName: payload.companyName || mockCompanyProfile.companyName,
      onboardingCompleted: false,
      updatedAt: new Date().toISOString(),
    };
    mockBrandSettings = {
      ...mockBrandSettings,
      brandName: payload.companyName || mockBrandSettings.brandName,
      updatedAt: new Date().toISOString(),
    };

    const session: AuthSession = {
      user: {
        id: "usr_owner_new",
        email: payload.email,
        fullName: payload.fullName,
        role: "COMPANY_OWNER",
        emailVerified: false,
        onboardingCompleted: false,
        companyId: mockCompanyProfile.id,
        createdAt: new Date().toISOString(),
      },
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
      isSimulated: true,
    };
    return wrapMockResponse(session as unknown as T);
  }

  // AUTH: POST /auth/verify-email (BE-01-02)
  if (method === "POST" && endpoint === "/auth/verify-email") {
    const payload = body as VerifyEmailRequest;
    if (!payload.token || payload.token === "expired_token") {
      const err: ApiErrorShape = {
        code: "TOKEN_EXPIRED",
        message: "Verification link has expired or is no longer valid.",
        status: 410,
      };
      throw err;
    }
    return wrapMockResponse({
      verified: true,
      verifiedAt: new Date().toISOString(),
    } as unknown as T);
  }

  // AUTH: POST /auth/resend-verification (BE-01-02)
  if (method === "POST" && endpoint === "/auth/resend-verification") {
    const payload = body as ResendVerificationRequest;
    return wrapMockResponse({
      sent: true,
      email: payload.email,
      dispatchedAt: new Date().toISOString(),
    } as unknown as T);
  }

  // AUTH: POST /auth/forgot-password (BE-01-05)
  if (method === "POST" && endpoint === "/auth/forgot-password") {
    const payload = body as ForgotPasswordRequest;
    return wrapMockResponse({
      sent: true,
      email: payload.email,
      dispatchedAt: new Date().toISOString(),
    } as unknown as T);
  }

  // AUTH: POST /auth/reset-password (BE-01-05)
  if (method === "POST" && endpoint === "/auth/reset-password") {
    const payload = body as ResetPasswordRequest;
    if (!payload.token || payload.token === "expired_token") {
      const err: ApiErrorShape = {
        code: "TOKEN_EXPIRED",
        message: "Password reset token has expired.",
        status: 410,
      };
      throw err;
    }
    return wrapMockResponse({
      updated: true,
      updatedAt: new Date().toISOString(),
    } as unknown as T);
  }

  // COMPANY: GET /company/profile (BE-02-01, BE-02-02)
  if (method === "GET" && endpoint === "/company/profile") {
    return wrapMockResponse({ ...mockCompanyProfile } as unknown as T);
  }

  // COMPANY: PUT /company/onboarding (BE-02-01, BE-02-02, BE-02-03, BE-02-04)
  if (method === "PUT" && endpoint === "/company/onboarding") {
    const payload = body as Partial<CompanyProfile> & {
      simulateFailure?: boolean;
    };
    if (payload.simulateFailure) {
      const err: ApiErrorShape = {
        code: "SERVER_ERROR",
        message:
          "Simulated transient backend save error (HTTP 503). Your form inputs remain safely preserved for immediate retry.",
        status: 503,
      };
      throw err;
    }

    mockCompanyProfile = {
      ...mockCompanyProfile,
      companyName: payload.companyName ?? mockCompanyProfile.companyName,
      industry: payload.industry ?? mockCompanyProfile.industry,
      description: payload.description ?? mockCompanyProfile.description,
      targetAudience: payload.targetAudience ?? mockCompanyProfile.targetAudience,
      countryRegion: payload.countryRegion ?? mockCompanyProfile.countryRegion,
      preferredLanguage:
        payload.preferredLanguage ?? mockCompanyProfile.preferredLanguage,
      communicationTone:
        payload.communicationTone ?? mockCompanyProfile.communicationTone,
      brandInformation:
        payload.brandInformation ?? mockCompanyProfile.brandInformation,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    // Keep brand settings synchronized with onboarding configuration
    mockBrandSettings = {
      ...mockBrandSettings,
      brandName: mockCompanyProfile.companyName,
      brandDescription: mockCompanyProfile.description,
      communicationTone: mockCompanyProfile.communicationTone,
      preferredLanguage: mockCompanyProfile.preferredLanguage,
      targetAudienceSummary: mockCompanyProfile.targetAudience,
      brandGuidelines: mockCompanyProfile.brandInformation,
      updatedAt: mockCompanyProfile.updatedAt,
    };

    return wrapMockResponse({ ...mockCompanyProfile } as unknown as T);
  }

  // BRAND: GET /company/brand (BE-02-03, BE-02-04)
  if (method === "GET" && endpoint === "/company/brand") {
    return wrapMockResponse({ ...mockBrandSettings } as unknown as T);
  }

  // BRAND: PUT /company/brand (BE-02-03, BE-02-04)
  if (method === "PUT" && endpoint === "/company/brand") {
    const payload = body as Partial<BrandSettings>;
    mockBrandSettings = {
      ...mockBrandSettings,
      brandName: payload.brandName ?? mockBrandSettings.brandName,
      brandDescription:
        payload.brandDescription ?? mockBrandSettings.brandDescription,
      communicationTone:
        payload.communicationTone ?? mockBrandSettings.communicationTone,
      preferredLanguage:
        payload.preferredLanguage ?? mockBrandSettings.preferredLanguage,
      targetAudienceSummary:
        payload.targetAudienceSummary ?? mockBrandSettings.targetAudienceSummary,
      keyValueProposition:
        payload.keyValueProposition ?? mockBrandSettings.keyValueProposition,
      brandGuidelines:
        payload.brandGuidelines ?? mockBrandSettings.brandGuidelines,
      updatedAt: new Date().toISOString(),
    };

    mockCompanyProfile = {
      ...mockCompanyProfile,
      companyName: mockBrandSettings.brandName,
      communicationTone: mockBrandSettings.communicationTone,
      preferredLanguage: mockBrandSettings.preferredLanguage,
      targetAudience: mockBrandSettings.targetAudienceSummary,
      brandInformation: mockBrandSettings.brandGuidelines,
      updatedAt: mockBrandSettings.updatedAt,
    };

    return wrapMockResponse({ ...mockBrandSettings } as unknown as T);
  }

  const [path, queryString] = endpoint.split("?");
  const queryParams = new URLSearchParams(queryString || "");

  // PRODUCTS: GET /products (BE-03-01, BE-03-07)
  if (method === "GET" && path === "/products") {
    let filtered = [...mockProducts];
    const search = queryParams.get("search")?.toLowerCase().trim();
    const status = queryParams.get("status");
    const category = queryParams.get("category");

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search)
      );
    }
    if (status && status !== "ALL") {
      filtered = filtered.filter((p) => p.status === status);
    }
    if (category && category !== "ALL") {
      filtered = filtered.filter((p) => p.category === category);
    }

    return wrapMockResponse(filtered as unknown as T);
  }

  // PRODUCTS: GET /products/:id (BE-03-02)
  if (method === "GET" && path.startsWith("/products/") && !path.includes("/media")) {
    const id = path.replace("/products/", "");
    const prod = mockProducts.find((p) => p.id === id);
    if (!prod) {
      const err: ApiErrorShape = {
        code: "NOT_FOUND",
        message: `Product with ID ${id} not found in current company workspace.`,
        status: 404,
      };
      throw err;
    }
    return wrapMockResponse(prod as unknown as T);
  }

  // PRODUCTS: POST /products (BE-03-03)
  if (method === "POST" && path === "/products") {
    const payload = body as CreateProductRequest;
    if (!payload.name || payload.name.trim().length === 0) {
      const err: ApiErrorShape = {
        code: "VALIDATION_ERROR",
        message: "Product name is required by backend validation contract.",
        fieldErrors: [{ field: "name", message: "Product name is required" }],
        status: 400,
      };
      throw err;
    }
    if (payload.price === undefined || payload.price < 0) {
      const err: ApiErrorShape = {
        code: "VALIDATION_ERROR",
        message: "Product price must be a non-negative number.",
        fieldErrors: [{ field: "price", message: "Valid price required" }],
        status: 400,
      };
      throw err;
    }

    const newProduct: Product = {
      id: `prd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      companyId: "cmp_lumiere_01",
      name: payload.name.trim(),
      description: payload.description || "",
      category: payload.category || "General",
      price: Number(payload.price),
      currency: payload.currency || "USD",
      discountPercent: payload.discountPercent || 0,
      purchaseUrl: payload.purchaseUrl || "",
      status: payload.status || "DRAFT",
      media: payload.media || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockProducts = [newProduct, ...mockProducts];
    return wrapMockResponse(newProduct as unknown as T);
  }

  // PRODUCTS: PUT /products/:id (BE-03-04)
  if (method === "PUT" && path.startsWith("/products/") && !path.includes("/media")) {
    const id = path.replace("/products/", "");
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      const err: ApiErrorShape = {
        code: "NOT_FOUND",
        message: `Product with ID ${id} not found.`,
        status: 404,
      };
      throw err;
    }

    const payload = body as Partial<CreateProductRequest>;
    const updated: Product = {
      ...mockProducts[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    mockProducts[index] = updated;
    return wrapMockResponse(updated as unknown as T);
  }

  // PRODUCTS: DELETE /products/:id (BE-03-04)
  if (method === "DELETE" && path.startsWith("/products/") && !path.includes("/media")) {
    const id = path.replace("/products/", "");
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      const err: ApiErrorShape = {
        code: "NOT_FOUND",
        message: `Product with ID ${id} not found.`,
        status: 404,
      };
      throw err;
    }
    const deleted = mockProducts[index];
    mockProducts = mockProducts.filter((p) => p.id !== id);
    return wrapMockResponse(deleted as unknown as T);
  }

  // PRODUCTS: POST /products/:id/media (BE-03-05)
  if (method === "POST" && path.includes("/media") && !path.includes("/reorder")) {
    const parts = path.split("/");
    const productId = parts[2];
    const prod = mockProducts.find((p) => p.id === productId);
    if (!prod) {
      const notFound: ApiErrorShape = { code: "NOT_FOUND", message: "Product not found", status: 404 };
      throw notFound;
    }

    const payload = body as {
      fileName: string;
      fileSize: number;
      mimeType: string;
      simulateFailure?: boolean;
    };

    if (payload.simulateFailure) {
      const err: ApiErrorShape = {
        code: "SERVER_ERROR",
        message: "Media storage service returned 500 (Simulated failure test for BE-03-05).",
        status: 500,
      };
      throw err;
    }

    if (payload.fileSize > 5 * 1024 * 1024) {
      const err: ApiErrorShape = {
        code: "VALIDATION_ERROR",
        message: "File exceeds 5MB size limit enforced by BE-03-05.",
        status: 400,
      };
      throw err;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(payload.mimeType)) {
      const err: ApiErrorShape = {
        code: "VALIDATION_ERROR",
        message: "Invalid file format. Only JPEG, PNG, and WebP are accepted.",
        status: 400,
      };
      throw err;
    }

    const newMedia: ProductMedia = {
      id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      url: `/images/products/${payload.fileName}`,
      fileName: payload.fileName,
      fileSize: payload.fileSize,
      mimeType: payload.mimeType,
      isPrimary: prod.media.length === 0,
      orderIndex: prod.media.length,
    };

    prod.media.push(newMedia);
    prod.updatedAt = new Date().toISOString();
    return wrapMockResponse(newMedia as unknown as T);
  }

  // PRODUCTS: PUT /products/:id/media/reorder (BE-03-06)
  if (method === "PUT" && path.includes("/media/reorder")) {
    const parts = path.split("/");
    const productId = parts[2];
    const prod = mockProducts.find((p) => p.id === productId);
    if (!prod) {
      const notFound: ApiErrorShape = { code: "NOT_FOUND", message: "Product not found", status: 404 };
      throw notFound;
    }

    const payload = body as { mediaIds: string[]; primaryMediaId?: string };
    const reordered: ProductMedia[] = [];

    payload.mediaIds.forEach((mediaId, idx) => {
      const existing = prod.media.find((m) => m.id === mediaId);
      if (existing) {
        reordered.push({
          ...existing,
          orderIndex: idx,
          isPrimary: payload.primaryMediaId ? mediaId === payload.primaryMediaId : idx === 0,
        });
      }
    });

    prod.media = reordered;
    prod.updatedAt = new Date().toISOString();
    return wrapMockResponse(prod as unknown as T);
  }

  // CAMPAIGNS: GET /campaigns (BE-04-01, BE-04-07)
  if (method === "GET" && path === "/campaigns") {
    let filtered = [...mockCampaigns];
    const search = queryParams.get("search")?.toLowerCase().trim();
    const status = queryParams.get("status");
    const objective = queryParams.get("objective");
    const platform = queryParams.get("platform");

    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.targetAudience.toLowerCase().includes(search) ||
          c.objective.toLowerCase().includes(search)
      );
    }
    if (status && status !== "ALL") {
      filtered = filtered.filter((c) => c.status === status);
    }
    if (objective && objective !== "ALL") {
      filtered = filtered.filter((c) => c.objective === objective);
    }
    if (platform && platform !== "ALL") {
      filtered = filtered.filter((c) =>
        c.platforms.includes(platform as SocialPlatform)
      );
    }

    return wrapMockResponse(filtered as unknown as T);
  }

  // CAMPAIGNS: GET /campaigns/:id (BE-04-03)
  if (method === "GET" && path.startsWith("/campaigns/")) {
    const id = path.replace("/campaigns/", "");
    const campaign = mockCampaigns.find((c) => c.id === id);
    if (!campaign) {
      const err: ApiErrorShape = {
        code: "NOT_FOUND",
        message: `Campaign with ID ${id} not found in workspace.`,
        status: 404,
      };
      throw err;
    }
    return wrapMockResponse(campaign as unknown as T);
  }

  // CAMPAIGNS: POST /campaigns (BE-04-01) - Creation Wizard
  if (method === "POST" && path === "/campaigns") {
    const payload = body as CreateCampaignRequest;
    if (!payload.name || payload.name.trim().length === 0) {
      const err: ApiErrorShape = {
        code: "VALIDATION_ERROR",
        message: "Campaign name is required by backend validation contract.",
        fieldErrors: [{ field: "name", message: "Campaign name is required" }],
        status: 400,
      };
      throw err;
    }

    if (!payload.productIds || payload.productIds.length === 0) {
      const err: ApiErrorShape = {
        code: "VALIDATION_ERROR",
        message: "At least one target product must be associated with the campaign.",
        fieldErrors: [{ field: "productIds", message: "Products required" }],
        status: 400,
      };
      throw err;
    }

    if (!payload.platforms || payload.platforms.length === 0) {
      const err: ApiErrorShape = {
        code: "VALIDATION_ERROR",
        message: "At least one target social platform (Instagram or Facebook) is required.",
        fieldErrors: [{ field: "platforms", message: "Platforms required" }],
        status: 400,
      };
      throw err;
    }

    // Date validation: End date >= Start date
    if (payload.startDate && payload.endDate) {
      const start = new Date(payload.startDate).getTime();
      const end = new Date(payload.endDate).getTime();
      if (end < start) {
        const err: ApiErrorShape = {
          code: "VALIDATION_ERROR",
          message: "Campaign end date must be on or after the start date (BE-04-01).",
          fieldErrors: [{ field: "endDate", message: "End date must be >= start date" }],
          status: 400,
        };
        throw err;
      }
    }

    const newCampaign: Campaign = {
      id: `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      companyId: "cmp_lumiere_01",
      name: payload.name.trim(),
      objective: payload.objective || "INCREASE_AWARENESS",
      status: payload.status || "DRAFT",
      productIds: payload.productIds,
      targetAudience: payload.targetAudience || "",
      platforms: payload.platforms,
      startDate: payload.startDate || new Date().toISOString().split("T")[0],
      endDate: payload.endDate || new Date(Date.now() + 86400000 * 14).toISOString().split("T")[0],
      contentLanguage: payload.contentLanguage || "en",
      communicationTone: payload.communicationTone || "LUXURY",
      publishingFrequency: payload.publishingFrequency || "3 posts/week",
      budgetNotes: payload.budgetNotes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockCampaigns = [newCampaign, ...mockCampaigns];
    return wrapMockResponse(newCampaign as unknown as T);
  }

  // CAMPAIGNS: PUT /campaigns/:id (BE-04-03, BE-04-06) - Status-Aware Editing
  if (method === "PUT" && path.startsWith("/campaigns/")) {
    const id = path.replace("/campaigns/", "");
    const index = mockCampaigns.findIndex((c) => c.id === id);
    if (index === -1) {
      const err: ApiErrorShape = {
        code: "NOT_FOUND",
        message: `Campaign with ID ${id} not found.`,
        status: 404,
      };
      throw err;
    }

    const existing = mockCampaigns[index];
    const payload = body as Partial<CreateCampaignRequest>;

    // Status-based restrictions (BE-04-06): Completed campaigns cannot alter dates or products
    if (existing.status === "COMPLETED") {
      if (
        (payload.startDate && payload.startDate !== existing.startDate) ||
        (payload.endDate && payload.endDate !== existing.endDate) ||
        (payload.productIds && payload.productIds.join() !== existing.productIds.join())
      ) {
        const err: ApiErrorShape = {
          code: "VALIDATION_ERROR",
          message:
            "Completed campaigns have locked date ranges and product parameters to preserve historical metrics integrity.",
          status: 400,
        };
        throw err;
      }
    }

    // Date validation
    const nextStart = payload.startDate || existing.startDate;
    const nextEnd = payload.endDate || existing.endDate;
    if (new Date(nextEnd).getTime() < new Date(nextStart).getTime()) {
      const err: ApiErrorShape = {
        code: "VALIDATION_ERROR",
        message: "Campaign end date must be on or after the start date.",
        status: 400,
      };
      throw err;
    }

    const updated: Campaign = {
      ...existing,
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    mockCampaigns[index] = updated;
    return wrapMockResponse(updated as unknown as T);
  }

  // CAMPAIGNS: DELETE /campaigns/:id (BE-04-06)
  if (method === "DELETE" && path.startsWith("/campaigns/")) {
    const id = path.replace("/campaigns/", "");
    const index = mockCampaigns.findIndex((c) => c.id === id);
    if (index === -1) {
      const err: ApiErrorShape = {
        code: "NOT_FOUND",
        message: `Campaign with ID ${id} not found.`,
        status: 404,
      };
      throw err;
    }
    const deleted = mockCampaigns[index];
    mockCampaigns = mockCampaigns.filter((c) => c.id !== id);
    return wrapMockResponse(deleted as unknown as T);
  }

  // AI STUDIO: POST /ai/generate (BE-05-02, AI-02-03, AI-02-04, AI-02-06)
  if (method === "POST" && path === "/ai/generate") {
    const payload = body as AiGenerationRequest;
    if (payload.simulateFailure) {
      const err: ApiErrorShape = {
        code: "SERVER_ERROR",
        message:
          "AI Generation Worker timeout (Simulated 504 / rate-limit failure test for AI-02-06).",
        status: 504,
      };
      throw err;
    }

    const prod = mockProducts.find((p) => p.id === payload.productId);

    // No product selected: build the variants from the user's own
    // description instead of silently reusing a catalog product.
    const subject =
      payload.customPrompt?.trim().slice(0, 120) || "our latest offer";

    const promptVariants: GeneratedAiVariant[] = [
      {
        id: `var_${Date.now()}_1`,
        variantIndex: 1,
        title: `Introducing: ${subject}`,
        caption: `${subject} — made with care and ready for you.\n\nMessage us today to learn more or place your order.`,
        hashtags: [
          "#SmallBusiness",
          "#LocalBusiness",
          "#ShopLocal",
          "#MadeWithCare",
        ],
        callToAction: "Send us a message to order or ask anything.",
        visualIdea:
          "A bright, clean photo of the offer in its real setting, natural light, with the key benefit as a bold text overlay.",
        recommendedPublishingTime: "Wednesday 08:30 AM (Peak morning engagement)",
        tone: payload.tone,
      },
      {
        id: `var_${Date.now()}_2`,
        variantIndex: 2,
        title: `Why you'll love it: ${subject}`,
        caption: `Quality you can feel, from a team that cares about every detail. ${subject} is waiting for you.\n\nTap the link in our bio or visit us today.`,
        hashtags: [
          "#QualityFirst",
          "#SupportLocal",
          "#SmallBusinessLove",
          "#DailyFinds",
        ],
        callToAction: "Visit us or tap the link in bio to get yours.",
        visualIdea:
          "Close-up detail shot showing texture and quality, warm tones, shallow depth of field.",
        recommendedPublishingTime: "Saturday 10:15 AM (Weekend shopping window)",
        tone: payload.tone,
      },
      {
        id: `var_${Date.now()}_3`,
        variantIndex: 3,
        title: `Don't miss out: ${subject}`,
        caption: `Good things don't wait — and neither should you. ${subject}, available now for a limited time.\n\nTag someone who needs to see this!`,
        hashtags: [
          "#LimitedOffer",
          "#DontMissOut",
          "#LocalDeals",
          "#TreatYourself",
        ],
        callToAction: "Tag a friend and message us to reserve yours.",
        visualIdea:
          "Eye-catching flat-lay of the offer with props that tell its story, strong contrast for the feed.",
        recommendedPublishingTime: "Thursday 17:00 PM (Evening leisure browsing)",
        tone: payload.tone,
      },
    ];

    const variants: GeneratedAiVariant[] = prod
      ? [
          {
            id: `var_${Date.now()}_1`,
        variantIndex: 1,
        title: `Sensory Elegance: ${prod.name}`,
        caption: `Crafted for those who savor the quiet ritual. Discover ${prod.name} — featuring direct-origin craftsmanship and refined tasting notes of jasmine, bergamot, and sweet citrus.\n\nRoasted fresh in micro-lots each week in Istanbul for peak aromatic vitality.`,
        hashtags: [
          "#SpecialtyCoffee",
          "#ArtisanRoastery",
          "#LumiereRoasters",
          "#MindfulRituals",
          "#SingleOrigin",
        ],
        callToAction:
          "Experience the winter release via the direct link in our bio.",
        visualIdea:
          "Macro slow-motion pour-over extraction with morning sunlight illuminating steam in a minimalist ceramic cup.",
        recommendedPublishingTime: "Wednesday 08:30 AM (Peak morning engagement)",
        tone: payload.tone,
      },
      {
        id: `var_${Date.now()}_2`,
        variantIndex: 2,
        title: `From Farm to Cup: ${prod.name}`,
        caption: `Every cup tells a story of ethical stewardship. With ${prod.name}, we partner directly with independent micro-lot growers to bring you pure, unadulterated terroir.\n\nElevate your everyday coffee experience with craft roasted beans.`,
        hashtags: [
          "#EthicalCoffee",
          "#ThirdWaveCoffee",
          "#DirectTrade",
          "#CoffeeLovers",
          "#LumiereArtisan",
        ],
        callToAction:
          "Shop fresh beans online today — complimentary express delivery on orders over $40.",
        visualIdea:
          "Split frame: Raw green Arabica beans in cupped hands juxtaposed with beautifully packaged dark roast bag.",
        recommendedPublishingTime: "Saturday 10:15 AM (Weekend shopping window)",
        tone: payload.tone,
      },
      {
        id: `var_${Date.now()}_3`,
        variantIndex: 3,
        title: `Flavor Unveiled: ${prod.name}`,
        caption: `Ready to redefine your flavor palate? Notes of crisp bergamot and candied peach unfold with every sip of our ${prod.name}.\n\nBrew guides and sensory pairing notes included with every purchase.`,
        hashtags: [
          "#CoffeeTasting",
          "#HomeBarista",
          "#BrewRitual",
          "#LumiereExperience",
        ],
        callToAction:
          "Click through to reserve your 250g bag before this batch sells out.",
        visualIdea:
          "Flat-lay composition of whole roasted beans, hand grinder, brew scales, and steaming carafe.",
        recommendedPublishingTime: "Thursday 17:00 PM (Evening leisure browsing)",
        tone: payload.tone,
      },
        ]
      : promptVariants;

    // Attached photos lead the creative: note them in the art direction.
    if (payload.mediaNames && payload.mediaNames.length > 0) {
      const label =
        payload.mediaNames.length > 1
          ? `your ${payload.mediaNames.length} uploaded photos`
          : `your uploaded photo (${payload.mediaNames[0]})`;
      variants.forEach((variant) => {
        variant.visualIdea = `${variant.visualIdea} The creative leads with ${label}.`;
      });
    }

    return wrapMockResponse(variants as unknown as T);
  }

  // POSTS: GET /posts (BE-05-03, BE-05-05)
  if (method === "GET" && path === "/posts") {
    let filtered = [...mockPosts];
    const search = queryParams.get("search")?.toLowerCase().trim();
    const status = queryParams.get("status");
    const platform = queryParams.get("platform");
    const campaignId = queryParams.get("campaignId");

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.currentVersion.title.toLowerCase().includes(search) ||
          p.currentVersion.caption.toLowerCase().includes(search) ||
          p.campaignName.toLowerCase().includes(search)
      );
    }
    if (status && status !== "ALL") {
      filtered = filtered.filter((p) => p.status === status);
    }
    if (platform && platform !== "ALL") {
      filtered = filtered.filter((p) => p.platform === platform);
    }
    if (campaignId && campaignId !== "ALL") {
      filtered = filtered.filter((p) => p.campaignId === campaignId);
    }

    return wrapMockResponse(filtered as unknown as T);
  }

  // POSTS: GET /posts/:id (BE-05-03)
  if (
    method === "GET" &&
    path.startsWith("/posts/") &&
    !path.includes("/approve") &&
    !path.includes("/reject") &&
    !path.includes("/revert")
  ) {
    const id = path.replace("/posts/", "");
    const post = mockPosts.find((p) => p.id === id);
    if (!post) {
      const err: ApiErrorShape = {
        code: "NOT_FOUND",
        message: `Post with ID ${id} not found in workspace.`,
        status: 404,
      };
      throw err;
    }
    return wrapMockResponse(post as unknown as T);
  }

  // POSTS: POST /posts (BE-05-03)
  if (method === "POST" && path === "/posts") {
    const payload = body as CreatePostRequest;
    const camp =
      mockCampaigns.find((c) => c.id === payload.campaignId) || mockCampaigns[0];
    const prod = mockProducts.find((p) => p.id === payload.productId);

    const initialVersion: PostVersion = {
      id: `ver_${Date.now()}_1`,
      versionNumber: 1,
      source: payload.source || "AI_GENERATED",
      title: payload.title || "Untitled Post",
      caption: payload.caption || "",
      hashtags: payload.hashtags || [],
      callToAction: payload.callToAction || "",
      visualIdea: payload.visualIdea || "",
      authorName:
        payload.source === "MANUAL_EDIT"
          ? "Sarah Jenkins"
          : "AI Content Engine (v1)",
      createdAt: new Date().toISOString(),
    };

    const newPost: Post = {
      id: `pst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      companyId: "cmp_lumiere_01",
      campaignId: payload.campaignId,
      campaignName: camp.name,
      productId: payload.productId,
      productName: prod?.name,
      platform: payload.platform || "INSTAGRAM",
      status: payload.status || "DRAFT",
      mediaUrl:
        payload.mediaUrl ||
        prod?.media[0]?.url ||
        "/images/products/coffee-beans.jpg",
      currentVersion: initialVersion,
      versions: [initialVersion],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockPosts = [newPost, ...mockPosts];
    return wrapMockResponse(newPost as unknown as T);
  }

  // POSTS: PUT /posts/:id (BE-05-03, BE-05-07) - Version History Creation
  if (
    method === "PUT" &&
    path.startsWith("/posts/") &&
    !path.includes("/approve") &&
    !path.includes("/reject") &&
    !path.includes("/revert")
  ) {
    const id = path.replace("/posts/", "");
    const index = mockPosts.findIndex((p) => p.id === id);
    if (index === -1) {
      const err: ApiErrorShape = {
        code: "NOT_FOUND",
        message: `Post ${id} not found`,
        status: 404,
      };
      throw err;
    }

    const existing = mockPosts[index];
    const payload = body as UpdatePostRequest;

    const newVersionNumber = existing.versions.length + 1;
    const newVersion: PostVersion = {
      id: `ver_${Date.now()}_${newVersionNumber}`,
      versionNumber: newVersionNumber,
      source: "MANUAL_EDIT",
      title: payload.title ?? existing.currentVersion.title,
      caption: payload.caption ?? existing.currentVersion.caption,
      hashtags: payload.hashtags ?? existing.currentVersion.hashtags,
      callToAction: payload.callToAction ?? existing.currentVersion.callToAction,
      visualIdea: payload.visualIdea ?? existing.currentVersion.visualIdea,
      authorName: "Sarah Jenkins (Owner)",
      createdAt: new Date().toISOString(),
    };

    const updatedPost: Post = {
      ...existing,
      status:
        payload.status ??
        (existing.status === "APPROVED" ? "PENDING_REVIEW" : existing.status),
      currentVersion: newVersion,
      versions: [...existing.versions, newVersion],
      rejectionReason: payload.rejectionReason ?? existing.rejectionReason,
      scheduledAt: payload.scheduledAt ?? existing.scheduledAt,
      updatedAt: new Date().toISOString(),
    };

    mockPosts[index] = updatedPost;
    return wrapMockResponse(updatedPost as unknown as T);
  }

  // POSTS: POST /posts/:id/approve (BE-05-05, BE-05-06) - Explicit Human Approval
  if (method === "POST" && path.includes("/approve")) {
    const parts = path.split("/");
    const id = parts[2];
    const index = mockPosts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw {
        code: "NOT_FOUND",
        message: `Post ${id} not found`,
        status: 404,
      } as ApiErrorShape;
    }

    const post = mockPosts[index];
    if (
      !post.currentVersion.caption ||
      post.currentVersion.caption.trim().length < 10
    ) {
      const err: ApiErrorShape = {
        code: "VALIDATION_ERROR",
        message:
          "Cannot approve incomplete post. Minimum 10 characters caption required.",
        status: 400,
      };
      throw err;
    }
    if (
      !post.currentVersion.callToAction ||
      post.currentVersion.callToAction.trim().length === 0
    ) {
      const err: ApiErrorShape = {
        code: "VALIDATION_ERROR",
        message: "Cannot approve post without a clear Call-to-Action (CTA).",
        status: 400,
      };
      throw err;
    }

    const approved: Post = {
      ...post,
      status: "APPROVED",
      rejectionReason: undefined,
      updatedAt: new Date().toISOString(),
    };
    mockPosts[index] = approved;
    return wrapMockResponse(approved as unknown as T);
  }

  // POSTS: POST /posts/:id/reject (BE-05-05, BE-05-06) - Explicit Rejection
  if (method === "POST" && path.includes("/reject")) {
    const parts = path.split("/");
    const id = parts[2];
    const index = mockPosts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw {
        code: "NOT_FOUND",
        message: `Post ${id} not found`,
        status: 404,
      } as ApiErrorShape;
    }

    const payload = body as { reason: string };
    const rejected: Post = {
      ...mockPosts[index],
      status: "REJECTED",
      rejectionReason: payload.reason || "Revision requested by reviewer.",
      updatedAt: new Date().toISOString(),
    };
    mockPosts[index] = rejected;
    return wrapMockResponse(rejected as unknown as T);
  }

  // POSTS: POST /posts/:id/revert (BE-05-07) - Revert to Version
  if (method === "POST" && path.includes("/revert")) {
    const parts = path.split("/");
    const id = parts[2];
    const index = mockPosts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw {
        code: "NOT_FOUND",
        message: `Post ${id} not found`,
        status: 404,
      } as ApiErrorShape;
    }

    const payload = body as { versionNumber: number };
    const post = mockPosts[index];
    const targetVer = post.versions.find(
      (v) => v.versionNumber === payload.versionNumber
    );
    if (!targetVer) {
      throw {
        code: "NOT_FOUND",
        message: `Version ${payload.versionNumber} not found`,
        status: 404,
      } as ApiErrorShape;
    }

    const reverted: Post = {
      ...post,
      currentVersion: targetVer,
      updatedAt: new Date().toISOString(),
    };
    mockPosts[index] = reverted;
    return wrapMockResponse(reverted as unknown as T);
  }

  // POSTS: DELETE /posts/:id
  if (method === "DELETE" && path.startsWith("/posts/")) {
    const id = path.replace("/posts/", "");
    const index = mockPosts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw {
        code: "NOT_FOUND",
        message: `Post ${id} not found`,
        status: 404,
      } as ApiErrorShape;
    }
    const deleted = mockPosts[index];
    mockPosts = mockPosts.filter((p) => p.id !== id);
    return wrapMockResponse(deleted as unknown as T);
  }

  // SOCIAL INTEGRATIONS: GET /social/accounts (WEB-03-01)
  if (method === "GET" && path === "/social/accounts") {
    return wrapMockResponse(mockSocialAccounts as unknown as T);
  }

  // SOCIAL INTEGRATIONS: POST /social/connect (WEB-03-01)
  if (method === "POST" && path === "/social/connect") {
    const payload = body as { platform: SocialPlatform };
    const existingIndex = mockSocialAccounts.findIndex(
      (a) => a.platform === payload.platform
    );
    let account: SocialAccount;
    if (existingIndex >= 0) {
      account = {
        ...mockSocialAccounts[existingIndex],
        status: "CONNECTED",
        tokenExpiresAt: new Date(Date.now() + 60 * 86400000).toISOString(),
        lastSyncedAt: new Date().toISOString(),
      };
      mockSocialAccounts[existingIndex] = account;
    } else {
      account = {
        id: `soc_${payload.platform.toLowerCase()}_${Date.now()}`,
        companyId: "cmp_lumiere_01",
        platform: payload.platform,
        accountName:
          payload.platform === "INSTAGRAM"
            ? "Lumière Artisan Roastery"
            : "Lumière Official Page",
        accountHandle:
          payload.platform === "INSTAGRAM"
            ? "@lumiere_roasters"
            : "@lumierecoffee",
        externalId: `${payload.platform.toLowerCase()}_${Math.floor(
          100000 + Math.random() * 900000
        )}`,
        status: "CONNECTED",
        followerCount: payload.platform === "INSTAGRAM" ? 14850 : 8920,
        tokenExpiresAt: new Date(Date.now() + 60 * 86400000).toISOString(),
        connectedAt: new Date().toISOString(),
        lastSyncedAt: new Date().toISOString(),
      };
      mockSocialAccounts.push(account);
    }
    return wrapMockResponse({
      redirectUrl: `https://meta.com/oauth/dialog?client_id=mock_app_id&scope=instagram_basic,pages_show_list`,
      account,
    } as unknown as T);
  }

  // SOCIAL INTEGRATIONS: POST /social/accounts/:id/reconnect (WEB-03-01)
  if (method === "POST" && path.startsWith("/social/accounts/") && path.endsWith("/reconnect")) {
    const id = path.split("/")[3];
    const index = mockSocialAccounts.findIndex((a) => a.id === id);
    if (index === -1) {
      throw {
        code: "NOT_FOUND",
        message: `Social account ${id} not found`,
        status: 404,
      } as ApiErrorShape;
    }
    const updated: SocialAccount = {
      ...mockSocialAccounts[index],
      status: "CONNECTED",
      tokenExpiresAt: new Date(Date.now() + 60 * 86400000).toISOString(),
      lastSyncedAt: new Date().toISOString(),
    };
    mockSocialAccounts[index] = updated;
    return wrapMockResponse(updated as unknown as T);
  }

  // SOCIAL INTEGRATIONS: POST /social/accounts/:id/disconnect (WEB-03-01)
  if (method === "POST" && path.startsWith("/social/accounts/") && path.endsWith("/disconnect")) {
    const id = path.split("/")[3];
    const index = mockSocialAccounts.findIndex((a) => a.id === id);
    if (index === -1) {
      throw {
        code: "NOT_FOUND",
        message: `Social account ${id} not found`,
        status: 404,
      } as ApiErrorShape;
    }
    mockSocialAccounts[index] = {
      ...mockSocialAccounts[index],
      status: "DISCONNECTED",
      lastSyncedAt: new Date().toISOString(),
    };
    return wrapMockResponse({ success: true, accountId: id } as unknown as T);
  }

  // PUBLISHING CALENDAR: GET /publishing/calendar (WEB-03-02)
  if (method === "GET" && path === "/publishing/calendar") {
    // Return posts that are scheduled, published, or failed (or all workspace posts)
    return wrapMockResponse(mockPosts as unknown as T);
  }

  // PUBLISHING CALENDAR: POST /publishing/schedule (WEB-03-02)
  if (method === "POST" && path === "/publishing/schedule") {
    const payload = body as SchedulePostRequest;
    if (!payload.postId) {
      throw {
        code: "VALIDATION_ERROR",
        message: "postId is required to schedule publication.",
        status: 400,
      } as ApiErrorShape;
    }
    if (!payload.scheduledAt) {
      throw {
        code: "VALIDATION_ERROR",
        message: "scheduledAt date is required.",
        status: 400,
      } as ApiErrorShape;
    }

    const postIndex = mockPosts.findIndex((p) => p.id === payload.postId);
    if (postIndex === -1) {
      throw {
        code: "NOT_FOUND",
        message: `Post ${payload.postId} not found`,
        status: 404,
      } as ApiErrorShape;
    }

    const targetPost = mockPosts[postIndex];
    if (targetPost.status !== "APPROVED" && targetPost.status !== "SCHEDULED") {
      throw {
        code: "VALIDATION_ERROR",
        message: "Only posts in APPROVED or SCHEDULED status can be scheduled.",
        status: 400,
      } as ApiErrorShape;
    }

    const updated: Post = {
      ...targetPost,
      status: "SCHEDULED",
      scheduledAt: payload.scheduledAt,
      publishingError: undefined,
      updatedAt: new Date().toISOString(),
    };
    mockPosts[postIndex] = updated;
    return wrapMockResponse(updated as unknown as T);
  }

  // PUBLISHING: POST /publishing/posts/:id/cancel-schedule (WEB-03-02)
  if (method === "POST" && path.includes("/cancel-schedule")) {
    const id = path.split("/")[3];
    const index = mockPosts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw {
        code: "NOT_FOUND",
        message: `Post ${id} not found`,
        status: 404,
      } as ApiErrorShape;
    }
    const updated: Post = {
      ...mockPosts[index],
      status: "APPROVED",
      scheduledAt: undefined,
      updatedAt: new Date().toISOString(),
    };
    mockPosts[index] = updated;
    return wrapMockResponse(updated as unknown as T);
  }

  // PUBLISHING: POST /publishing/posts/:id/retry (WEB-03-03)
  if (method === "POST" && path.includes("/retry")) {
    const id = path.split("/")[3];
    const index = mockPosts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw {
        code: "NOT_FOUND",
        message: `Post ${id} not found`,
        status: 404,
      } as ApiErrorShape;
    }

    const target = mockPosts[index];
    // Check account status
    const account = mockSocialAccounts.find((a) => a.platform === target.platform);
    if (account && account.status === "TOKEN_EXPIRED") {
      throw {
        code: "VALIDATION_ERROR",
        message: `Cannot publish to ${target.platform}: Account access token has expired. Please reconnect in Integrations.`,
        status: 400,
      } as ApiErrorShape;
    }

    const updated: Post = {
      ...target,
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
      externalPostUrl: `https://${target.platform.toLowerCase()}.com/p/retried_${Date.now()}`,
      publishingError: undefined,
      updatedAt: new Date().toISOString(),
    };
    mockPosts[index] = updated;
    return wrapMockResponse(updated as unknown as T);
  }

  // PUBLISHING: POST /publishing/posts/:id/publish-now (WEB-03-03)
  if (method === "POST" && path.includes("/publish-now")) {
    const id = path.split("/")[3];
    const index = mockPosts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw {
        code: "NOT_FOUND",
        message: `Post ${id} not found`,
        status: 404,
      } as ApiErrorShape;
    }

    const updated: Post = {
      ...mockPosts[index],
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
      externalPostUrl: `https://${mockPosts[index].platform.toLowerCase()}.com/p/live_${Date.now()}`,
      publishingError: undefined,
      updatedAt: new Date().toISOString(),
    };
    mockPosts[index] = updated;
    return wrapMockResponse(updated as unknown as T);
  }

  // ANALYTICS: GET /analytics/summary (WEB-03-04)
  if (method === "GET" && path === "/analytics/summary") {
    const range = queryParams.get("range") || "30d";
    let multiplier = range === "7d" ? 0.35 : range === "14d" ? 0.6 : range === "90d" ? 2.8 : 1.0;
    const summary: AnalyticsMetricSummary = {
      ...mockAnalyticsSummary,
      reach: Math.round(mockAnalyticsSummary.reach * multiplier),
      impressions: Math.round(mockAnalyticsSummary.impressions * multiplier),
      likes: Math.round(mockAnalyticsSummary.likes * multiplier),
      comments: Math.round(mockAnalyticsSummary.comments * multiplier),
      shares: Math.round(mockAnalyticsSummary.shares * multiplier),
      saves: Math.round(mockAnalyticsSummary.saves * multiplier),
      linkClicks: Math.round(mockAnalyticsSummary.linkClicks * multiplier),
      measuredPeriod:
        range === "7d"
          ? "Last 7 Days (Nov 04 – Nov 11, 2026)"
          : range === "14d"
          ? "Last 14 Days (Oct 28 – Nov 11, 2026)"
          : range === "90d"
          ? "Last 90 Days (Aug 13 – Nov 11, 2026)"
          : "Last 30 Days (Oct 12 – Nov 11, 2026)",
    };
    return wrapMockResponse(summary as unknown as T);
  }

  // ANALYTICS: GET /analytics/trends (WEB-03-04)
  if (method === "GET" && path === "/analytics/trends") {
    const range = queryParams.get("range") || "30d";
    const sliceCount = range === "7d" ? 7 : range === "14d" ? 14 : mockAnalyticsTrends.length;
    const trends = mockAnalyticsTrends.slice(-sliceCount);
    return wrapMockResponse(trends as unknown as T);
  }

  // ANALYTICS: GET /analytics/platforms (WEB-03-04)
  if (method === "GET" && path === "/analytics/platforms") {
    return wrapMockResponse(mockPlatformBreakdowns as unknown as T);
  }

  // REPORTS: GET /reports/swot (WEB-03-05)
  if (method === "GET" && path === "/reports/swot") {
    const isInsufficient = queryParams.get("insufficient") === "true";
    if (isInsufficient) {
      const emptyReport: SwotReport = {
        companyId: "cmp_lumiere_01",
        generatedAt: new Date().toISOString(),
        hasSufficientData: false,
        publishedPostsCount: 1,
        items: [],
        recommendations: [],
      };
      return wrapMockResponse(emptyReport as unknown as T);
    }
    return wrapMockResponse(mockSwotReport as unknown as T);
  }

  // REPORTS: POST /reports/swot/regenerate (WEB-03-05)
  if (method === "POST" && path === "/reports/swot/regenerate") {
    mockSwotReport = {
      ...mockSwotReport,
      generatedAt: new Date().toISOString(),
    };
    return wrapMockResponse(mockSwotReport as unknown as T);
  }

  // ADMIN: GET /admin/health (WEB-03-06)
  if (method === "GET" && path === "/admin/health") {
    return wrapMockResponse(mockAdminHealth as unknown as T);
  }

  // ADMIN: GET /admin/tenants (WEB-03-06)
  if (method === "GET" && path === "/admin/tenants") {
    return wrapMockResponse(mockAdminTenants as unknown as T);
  }

  // ADMIN: POST /admin/tenants/:id/suspend (WEB-03-06)
  if (method === "POST" && path.includes("/admin/tenants/") && path.endsWith("/suspend")) {
    const id = path.split("/")[3];
    const index = mockAdminTenants.findIndex((t) => t.id === id);
    if (index === -1) {
      throw {
        code: "NOT_FOUND",
        message: `Tenant ${id} not found`,
        status: 404,
      } as ApiErrorShape;
    }
    const updated: AdminTenant = {
      ...mockAdminTenants[index],
      status: "SUSPENDED",
    };
    mockAdminTenants[index] = updated;
    return wrapMockResponse(updated as unknown as T);
  }

  // ADMIN: POST /admin/tenants/:id/reactivate (WEB-03-06)
  if (method === "POST" && path.includes("/admin/tenants/") && path.endsWith("/reactivate")) {
    const id = path.split("/")[3];
    const index = mockAdminTenants.findIndex((t) => t.id === id);
    if (index === -1) {
      throw {
        code: "NOT_FOUND",
        message: `Tenant ${id} not found`,
        status: 404,
      } as ApiErrorShape;
    }
    const updated: AdminTenant = {
      ...mockAdminTenants[index],
      status: "ACTIVE",
    };
    mockAdminTenants[index] = updated;
    return wrapMockResponse(updated as unknown as T);
  }

  // ADMIN: POST /admin/system/purge-queue (WEB-03-06)
  if (method === "POST" && path === "/admin/system/purge-queue") {
    const purged = mockAdminHealth.queuedPublishJobs;
    mockAdminHealth = {
      ...mockAdminHealth,
      queuedPublishJobs: 0,
    };
    return wrapMockResponse({ purgedCount: purged } as unknown as T);
  }

  // ADMIN: POST /admin/system/flush-cache (WEB-03-06)
  if (method === "POST" && path === "/admin/system/flush-cache") {
    mockAdminAuditLogs = [
      {
        id: `log_${Date.now()}`,
        actor: "System Admin",
        action: "Flushed AI Neural Cache (142 entries evicted)",
        target: "AI Synthesis Cluster",
        timestamp: new Date().toISOString(),
        severity: "INFO",
      },
      ...mockAdminAuditLogs,
    ];
    return wrapMockResponse({ evictedEntries: 142 } as unknown as T);
  }

  // ADMIN: GET /admin/traffic
  if (method === "GET" && path === "/admin/traffic") {
    return wrapMockResponse(mockAdminTraffic as unknown as T);
  }

  // ADMIN: GET /admin/complaints
  if (method === "GET" && path === "/admin/complaints") {
    return wrapMockResponse(mockAdminComplaints as unknown as T);
  }

  // ADMIN: POST /admin/complaints (Customer submits complaint / support ticket)
  if (method === "POST" && path === "/admin/complaints") {
    const payload = body as {
      companyName: string;
      ownerName: string;
      ownerEmail: string;
      category: AdminComplaintTicket["category"];
      priority?: AdminComplaintTicket["priority"];
      subject: string;
      message: string;
    };
    const created: AdminComplaintTicket = {
      id: `tkt_${Math.floor(1043 + Math.random() * 900)}`,
      companyName: payload.companyName || "Lumiere Artisan Roasters",
      ownerName: payload.ownerName || "Sarah Jenkins",
      ownerEmail: payload.ownerEmail || "sarah@lumierecoffee.com",
      category: payload.category || "TECHNICAL",
      priority: payload.priority || "MEDIUM",
      status: "OPEN",
      subject: payload.subject,
      message: payload.message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockAdminComplaints = [created, ...mockAdminComplaints];
    return wrapMockResponse(created as unknown as T);
  }

  // ADMIN: POST /admin/complaints/:id/reply
  if (
    method === "POST" &&
    path.startsWith("/admin/complaints/") &&
    path.endsWith("/reply")
  ) {
    const id = path.split("/")[3];
    const index = mockAdminComplaints.findIndex((c) => c.id === id);
    if (index === -1) {
      throw {
        code: "NOT_FOUND",
        message: `Complaint ticket ${id} not found`,
        status: 404,
      } as ApiErrorShape;
    }
    const payload = body as {
      status: AdminComplaintTicket["status"];
      adminReply?: string;
    };
    const updated: AdminComplaintTicket = {
      ...mockAdminComplaints[index],
      status: payload.status,
      adminReply:
        payload.adminReply !== undefined
          ? payload.adminReply
          : mockAdminComplaints[index].adminReply,
      updatedAt: new Date().toISOString(),
    };
    mockAdminComplaints[index] = updated;
    mockAdminAuditLogs = [
      {
        id: `log_${Date.now()}`,
        actor: "System Admin",
        action: `Updated complaint ${id} status to ${payload.status}`,
        target: updated.companyName,
        timestamp: new Date().toISOString(),
        severity: "INFO",
      },
      ...mockAdminAuditLogs,
    ];
    return wrapMockResponse(updated as unknown as T);
  }

  // ADMIN: GET /admin/logs
  if (method === "GET" && path === "/admin/logs") {
    return wrapMockResponse(mockAdminAuditLogs as unknown as T);
  }

  // ADMIN: POST /admin/system/broadcast
  if (method === "POST" && path === "/admin/system/broadcast") {
    const payload = body as { title: string; message: string };
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      companyId: "cmp_lumiere_01",
      category: "SYSTEM",
      title: payload.title,
      message: payload.message,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    mockNotifications = [newNotif, ...mockNotifications];
    mockAdminAuditLogs = [
      {
        id: `log_${Date.now()}`,
        actor: "System Admin",
        action: `Broadcasted announcement: "${payload.title}"`,
        target: `All Active Companies (${mockAdminHealth.activeTenants})`,
        timestamp: new Date().toISOString(),
        severity: "INFO",
      },
      ...mockAdminAuditLogs,
    ];
    return wrapMockResponse({
      deliveredTenants: mockAdminHealth.activeTenants,
    } as unknown as T);
  }

  // NOTIFICATIONS: GET /notifications (WEB-03-07)
  if (method === "GET" && path === "/notifications") {
    return wrapMockResponse(mockNotifications as unknown as T);
  }

  // NOTIFICATIONS: POST /notifications/:id/read (WEB-03-07)
  if (method === "POST" && path.startsWith("/notifications/") && path.endsWith("/read")) {
    const id = path.split("/")[2];
    const index = mockNotifications.findIndex((n) => n.id === id);
    if (index === -1) {
      throw {
        code: "NOT_FOUND",
        message: `Notification ${id} not found`,
        status: 404,
      } as ApiErrorShape;
    }
    mockNotifications[index] = {
      ...mockNotifications[index],
      isRead: true,
    };
    return wrapMockResponse(mockNotifications[index] as unknown as T);
  }

  // NOTIFICATIONS: POST /notifications/read-all (WEB-03-07)
  if (method === "POST" && path === "/notifications/read-all") {
    const count = mockNotifications.filter((n) => !n.isRead).length;
    mockNotifications = mockNotifications.map((n) => ({ ...n, isRead: true }));
    return wrapMockResponse({ updatedCount: count } as unknown as T);
  }

  // NOTIFICATIONS: DELETE /notifications/:id (WEB-03-07)
  if (method === "DELETE" && path.startsWith("/notifications/")) {
    const id = path.replace("/notifications/", "");
    mockNotifications = mockNotifications.filter((n) => n.id !== id);
    return wrapMockResponse({ success: true, id } as unknown as T);
  }

  // ACCOUNT: GET /account/profile (WEB-03-07)
  if (method === "GET" && path === "/account/profile") {
    return wrapMockResponse(mockUserProfile as unknown as T);
  }

  // ACCOUNT: PUT /account/profile (WEB-03-07)
  if (method === "PUT" && path === "/account/profile") {
    const payload = body as UpdateAccountProfileRequest;
    if (!payload.fullName || payload.fullName.trim().length < 2) {
      throw {
        code: "VALIDATION_ERROR",
        message: "Full name must be at least 2 characters.",
        status: 400,
      } as ApiErrorShape;
    }
    mockUserProfile = {
      ...mockUserProfile,
      fullName: payload.fullName.trim(),
    };
    return wrapMockResponse(mockUserProfile as unknown as T);
  }

  // ACCOUNT: POST /account/change-password (WEB-03-07)
  if (method === "POST" && path === "/account/change-password") {
    const payload = body as ChangePasswordRequest;
    if (!payload.currentPassword) {
      throw {
        code: "VALIDATION_ERROR",
        message: "Current password is required.",
        status: 400,
      } as ApiErrorShape;
    }
    if (!payload.newPassword || payload.newPassword.length < 8) {
      throw {
        code: "VALIDATION_ERROR",
        message: "New password must be at least 8 characters.",
        status: 400,
      } as ApiErrorShape;
    }
    return wrapMockResponse({
      success: true,
      message: "Password changed successfully.",
    } as unknown as T);
  }

  const notFound: ApiErrorShape = {
    code: "NOT_FOUND",
    message: `No API handler registered for ${method} ${endpoint}`,
    status: 404,
  };
  throw notFound;
}
