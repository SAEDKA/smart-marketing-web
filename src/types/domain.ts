export type Locale = "en" | "tr" | "ar";

export type UserRole = "COMPANY_OWNER" | "SYSTEM_ADMIN";

export type CommunicationTone =
  | "PROFESSIONAL"
  | "FRIENDLY"
  | "LUXURY"
  | "BOLD"
  | "EDUCATIONAL";

export type ContentLanguage = "en" | "tr" | "ar";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  emailVerified: boolean;
  onboardingCompleted: boolean;
  companyId: string;
  createdAt: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken?: string;
  expiresAt: string;
  isSimulated: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  companyName: string;
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface CompanyProfile {
  id: string;
  companyName: string;
  industry: string;
  description: string;
  targetAudience: string;
  countryRegion: string;
  preferredLanguage: ContentLanguage;
  communicationTone: CommunicationTone;
  brandInformation: string;
  onboardingCompleted: boolean;
  updatedAt: string;
}

export interface BrandSettings {
  companyId: string;
  brandName: string;
  brandDescription: string;
  communicationTone: CommunicationTone;
  preferredLanguage: ContentLanguage;
  targetAudienceSummary: string;
  keyValueProposition: string;
  brandGuidelines: string;
  updatedAt: string;
}

export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export interface ProductMedia {
  id: string;
  url: string;
  fileName: string;
  fileSize: number; // in bytes
  mimeType: string;
  isPrimary: boolean;
  orderIndex: number;
}

export interface Product {
  id: string;
  companyId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  discountPercent?: number;
  purchaseUrl?: string;
  status: ProductStatus;
  media: ProductMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  category: string;
  price: number;
  currency?: string;
  discountPercent?: number;
  purchaseUrl?: string;
  status?: ProductStatus;
  media?: ProductMedia[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductFilterParams {
  search?: string;
  status?: ProductStatus | "ALL";
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export type CampaignObjective =
  | "INCREASE_SALES"
  | "INCREASE_ENGAGEMENT"
  | "INCREASE_AWARENESS";

export type SocialPlatform = "INSTAGRAM" | "FACEBOOK";

export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";

export interface Campaign {
  id: string;
  companyId: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  productIds: string[];
  targetAudience: string;
  platforms: SocialPlatform[];
  startDate: string;
  endDate: string;
  contentLanguage: ContentLanguage;
  communicationTone: CommunicationTone;
  publishingFrequency: string;
  budgetNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignRequest {
  name: string;
  objective: CampaignObjective;
  productIds: string[];
  targetAudience: string;
  platforms: SocialPlatform[];
  startDate: string;
  endDate: string;
  contentLanguage: ContentLanguage;
  communicationTone: CommunicationTone;
  publishingFrequency?: string;
  budgetNotes?: string;
  status?: CampaignStatus;
}

export interface UpdateCampaignRequest extends Partial<CreateCampaignRequest> {
  id: string;
}

export interface CampaignFilterParams {
  search?: string;
  status?: CampaignStatus | "ALL";
  objective?: CampaignObjective | "ALL";
  platform?: SocialPlatform | "ALL";
}

export type PostStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "SCHEDULED"
  | "PUBLISHING"
  | "PUBLISHED"
  | "FAILED";

export interface PostVersion {
  id: string;
  versionNumber: number;
  source: "AI_GENERATED" | "MANUAL_EDIT";
  caption: string;
  title: string;
  hashtags: string[];
  callToAction: string;
  visualIdea?: string;
  createdAt: string;
  authorName: string;
}

export interface GeneratedAiVariant {
  id: string;
  variantIndex: number;
  title: string;
  caption: string;
  hashtags: string[];
  callToAction: string;
  visualIdea: string;
  recommendedPublishingTime: string;
  tone: CommunicationTone;
}

export interface AiGenerationRequest {
  campaignId: string;
  productId: string;
  platform: SocialPlatform;
  contentLanguage: ContentLanguage;
  tone: CommunicationTone;
  customPrompt?: string;
  simulateFailure?: boolean;
}

export interface Post {
  id: string;
  companyId: string;
  campaignId: string;
  campaignName: string;
  productId?: string;
  productName?: string;
  platform: SocialPlatform;
  status: PostStatus;
  currentVersion: PostVersion;
  versions: PostVersion[];
  rejectionReason?: string;
  scheduledAt?: string;
  publishedAt?: string;
  externalPostUrl?: string;
  publishingError?: string;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type SocialAccountStatus =
  | "CONNECTED"
  | "DISCONNECTED"
  | "TOKEN_EXPIRED"
  | "ERROR";

export interface SocialAccount {
  id: string;
  companyId: string;
  platform: SocialPlatform;
  accountName: string;
  accountHandle: string;
  externalId: string;
  avatarUrl?: string;
  status: SocialAccountStatus;
  followerCount?: number;
  tokenExpiresAt?: string;
  connectedAt?: string;
  lastSyncedAt?: string;
}

export interface SchedulePostRequest {
  postId: string;
  scheduledAt: string;
}

export type AnalyticsDateRange = "7d" | "14d" | "30d" | "90d";

export interface AnalyticsMetricSummary {
  reach: number;
  impressions: number;
  engagementRate: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  linkClicks: number;
  clickThroughRate: number;
  reachChangePercent: number;
  impressionsChangePercent: number;
  engagementChangePercent: number;
  clicksChangePercent: number;
  measuredPeriod: string;
  lastSynchronizedAt: string;
}

export interface AnalyticsTrendPoint {
  date: string;
  label: string;
  reach: number;
  impressions: number;
  engagement: number;
}

export interface PlatformMetricBreakdown {
  platform: SocialPlatform;
  reach: number;
  impressions: number;
  engagementRate: number;
  shares: number;
}

export type SwotCategory = "STRENGTH" | "WEAKNESS" | "OPPORTUNITY" | "THREAT";

export interface SwotItem {
  id: string;
  category: SwotCategory;
  title: string;
  description: string;
  numericalEvidence: string;
  impactScore: "HIGH" | "MEDIUM" | "LOW";
}

export interface MarketingRecommendation {
  id: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  rationale: string;
  actionItem: string;
  expectedImpact: string;
  linkedCampaignObjective?: CampaignObjective;
}

export interface SwotReport {
  companyId: string;
  generatedAt: string;
  hasSufficientData: boolean;
  publishedPostsCount: number;
  items: SwotItem[];
  recommendations: MarketingRecommendation[];
}

export interface AdminTenant {
  id: string;
  companyName: string;
  ownerName: string;
  ownerEmail: string;
  plan: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  status: "ACTIVE" | "SUSPENDED";
  productCount: number;
  campaignCount: number;
  createdAt: string;
}

export interface AdminSystemHealth {
  totalTenants: number;
  activeTenants: number;
  queuedPublishJobs: number;
  aiTokensConsumed: number;
  metaApiStatus: "OPERATIONAL" | "DEGRADED" | "DOWN";
  aiWorkerStatus: "OPERATIONAL" | "BUSY" | "DOWN";
  dbLatencyMs: number;
}

export interface AdminTrafficAnalytics {
  totalVisitors30d: number;
  visitorsGrowthPercent: number;
  totalPageViews30d: number;
  activeLiveVisitors: number;
  avgSessionDuration: string;
  signupConversionRate: number;
  dailyTraffic: {
    date: string;
    visitors: number;
    pageViews: number;
    signups: number;
  }[];
  featureUsage: {
    featureKey: string;
    featureName: string;
    usagePercent: number;
    sessionsCount: number;
  }[];
  topRegions: {
    country: string;
    visitors: number;
    sharePercent: number;
  }[];
}

export type ComplaintStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
export type ComplaintPriority = "HIGH" | "MEDIUM" | "LOW";

export interface AdminComplaintTicket {
  id: string;
  companyName: string;
  ownerName: string;
  ownerEmail: string;
  category: "SOCIAL_INTEGRATION" | "BILLING" | "AI_QUALITY" | "TECHNICAL";
  priority: ComplaintPriority;
  status: ComplaintStatus;
  subject: string;
  message: string;
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
}

export type NotificationCategory =
  | "PUBLISHING"
  | "AI_STUDIO"
  | "SECURITY"
  | "SYSTEM";

export interface NotificationItem {
  id: string;
  companyId: string;
  category: NotificationCategory;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface UpdateAccountProfileRequest {
  fullName: string;
  preferredLanguage?: ContentLanguage;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreatePostRequest {
  campaignId: string;
  productId?: string;
  platform: SocialPlatform;
  title: string;
  caption: string;
  hashtags: string[];
  callToAction: string;
  visualIdea?: string;
  mediaUrl?: string;
  source?: "AI_GENERATED" | "MANUAL_EDIT";
  status?: PostStatus;
}

export interface UpdatePostRequest {
  title?: string;
  caption?: string;
  hashtags?: string[];
  callToAction?: string;
  visualIdea?: string;
  status?: PostStatus;
  rejectionReason?: string;
  scheduledAt?: string;
}

export interface PostFilterParams {
  search?: string;
  status?: PostStatus | "ALL";
  platform?: SocialPlatform | "ALL";
  campaignId?: string;
}

export interface ApiValidationError {
  field: string;
  message: string;
}

export interface ApiErrorShape {
  code:
    | "VALIDATION_ERROR"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "SESSION_EXPIRED"
    | "TOKEN_EXPIRED"
    | "NETWORK_ERROR"
    | "SERVER_ERROR"
    | "NOT_FOUND";
  message: string;
  fieldErrors?: ApiValidationError[];
  status: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    mode: "mock" | "live";
  };
}

export interface JiraStoryStatus {
  id: string;
  release: "R1" | "R2" | "R3" | "R4" | "R5" | "R6" | "R7";
  epic: "WEB-01" | "WEB-02" | "WEB-03";
  titleKey: string;
  route: string;
  frontendStatus: "COMPLETED" | "SCHEDULED";
  externalDependencies: string[];
}
