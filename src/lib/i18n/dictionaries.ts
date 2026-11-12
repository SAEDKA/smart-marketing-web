import { Locale } from "@/types/domain";

export interface Dictionary {
  meta: {
    appName: string;
    appTagline: string;
    direction: "ltr" | "rtl";
    languageLabel: string;
    simulatedBanner: string;
    liveModeBanner: string;
  };
  nav: {
    workspaceGroup: string;
    publishingGroup: string;
    intelligenceGroup: string;
    systemGroup: string;
    dashboard: string;
    onboarding: string;
    brandSettings: string;
    products: string;
    campaigns: string;
    contentStudio: string;
    posts: string;
    calendar: string;
    integrations: string;
    analytics: string;
    reports: string;
    notifications: string;
    accountSettings: string;
    designSystem: string;
    admin: string;
    logout: string;
    collapseSidebar: string;
    expandSidebar: string;
    switchRole: string;
    simulateExpiry: string;
    roleOwner: string;
    roleAdmin: string;
  };
  common: {
    save: string;
    saving: string;
    cancel: string;
    reset: string;
    back: string;
    next: string;
    finish: string;
    retry: string;
    loading: string;
    requiredField: string;
    unsavedChanges: string;
    savedSuccessfully: string;
    errorOccurred: string;
    confirmAction: string;
    close: string;
    searchPlaceholder: string;
    statusCompleted: string;
    statusScheduled: string;
    releaseBadge: string;
    externalDeps: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    companyNameLabel: string;
    companyNamePlaceholder: string;
    signInBtn: string;
    signingInBtn: string;
    createAccountBtn: string;
    creatingAccountBtn: string;
    forgotPasswordLink: string;
    noAccountText: string;
    haveAccountText: string;
    demoCredentialsHint: string;
    fillOwnerDemo: string;
    fillAdminDemo: string;
    showPassword: string;
    hidePassword: string;
    passwordRulesTitle: string;
    ruleMinLength: string;
    ruleUppercase: string;
    ruleNumber: string;
    ruleSpecial: string;
    verifyEmailTitle: string;
    verifyEmailSubtitle: string;
    verifyValidBtn: string;
    verifyExpiredBtn: string;
    verifySuccessTitle: string;
    verifySuccessDesc: string;
    verifyExpiredTitle: string;
    verifyExpiredDesc: string;
    resendVerificationBtn: string;
    resendSuccessMsg: string;
    forgotPasswordTitle: string;
    forgotPasswordSubtitle: string;
    sendResetLinkBtn: string;
    resetLinkSentTitle: string;
    resetLinkSentDesc: string;
    resetPasswordTitle: string;
    resetPasswordSubtitle: string;
    updatePasswordBtn: string;
    passwordUpdatedTitle: string;
    passwordUpdatedDesc: string;
    proceedToWorkspace: string;
    backToLogin: string;
    sessionExpiredTitle: string;
    sessionExpiredDesc: string;
    reauthenticateBtn: string;
    unauthorizedTitle: string;
    unauthorizedDesc: string;
    returnToDashboardBtn: string;
  };
  onboarding: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    companyName: string;
    industry: string;
    industryPlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    targetAudience: string;
    targetAudiencePlaceholder: string;
    countryRegion: string;
    countryRegionPlaceholder: string;
    preferredLanguage: string;
    communicationTone: string;
    brandInformation: string;
    brandInformationPlaceholder: string;
    simulateSaveErrorLabel: string;
    draftProtectedNotice: string;
    completeOnboardingBtn: string;
    onboardingSuccessMsg: string;
    tones: {
      PROFESSIONAL: string;
      FRIENDLY: string;
      LUXURY: string;
      BOLD: string;
      EDUCATIONAL: string;
    };
    languages: {
      en: string;
      tr: string;
      ar: string;
    };
  };
  brand: {
    title: string;
    subtitle: string;
    brandName: string;
    brandDescription: string;
    communicationTone: string;
    preferredLanguage: string;
    targetAudienceSummary: string;
    keyValueProposition: string;
    brandGuidelines: string;
    lastSynchronized: string;
    syncBadge: string;
    discardConfirm: string;
    reloadFromServer: string;
  };
  dashboard: {
    welcomePrefix: string;
    workspaceSubtitle: string;
    journeyTitle: string;
    journeySubtitle: string;
    r1CompletedTitle: string;
    r1CompletedSubtitle: string;
    openScreen: string;
    quickActionsTitle: string;
    companyReadinessTitle: string;
    brandToneLabel: string;
    contentLangLabel: string;
    industryLabel: string;
    regionLabel: string;
    roadmapTitle: string;
    roadmapSubtitle: string;
  };
  designSystem: {
    title: string;
    subtitle: string;
    colorsTitle: string;
    buttonsTitle: string;
    inputsTitle: string;
    statesTitle: string;
    badgesTitle: string;
    modalsTitle: string;
    openDemoModal: string;
    focusAccessibilityNote: string;
  };
  products: {
    title: string;
    subtitle: string;
    addProduct: string;
    editProduct: string;
    deleteProduct: string;
    productDetails: string;
    searchPlaceholder: string;
    filterAll: string;
    filterActive: string;
    filterDraft: string;
    filterArchived: string;
    categoryLabel: string;
    priceLabel: string;
    discountLabel: string;
    purchaseUrlLabel: string;
    statusLabel: string;
    nameLabel: string;
    descriptionLabel: string;
    mediaManagement: string;
    uploadAreaTitle: string;
    uploadAreaDesc: string;
    primaryBadge: string;
    setPrimary: string;
    moveUp: string;
    moveDown: string;
    removeMedia: string;
    noProductsFound: string;
    emptyStateDesc: string;
    simulateUploadError: string;
    fileTooLarge: string;
    invalidFileType: string;
    cardView: string;
    tableView: string;
    confirmDelete: string;
    productSaved: string;
    productDeleted: string;
    allCategories: string;
  };
  campaigns: {
    title: string;
    subtitle: string;
    createCampaign: string;
    createWizardTitle: string;
    createWizardSubtitle: string;
    editCampaign: string;
    campaignDetails: string;
    searchPlaceholder: string;
    filterAllObjectives: string;
    filterSales: string;
    filterEngagement: string;
    filterAwareness: string;
    filterAllStatus: string;
    filterDraft: string;
    filterActive: string;
    filterPaused: string;
    filterCompleted: string;
    nameLabel: string;
    objectiveLabel: string;
    statusLabel: string;
    targetProductsLabel: string;
    selectProductsDesc: string;
    targetAudienceLabel: string;
    platformsLabel: string;
    startDateLabel: string;
    endDateLabel: string;
    toneLabel: string;
    languageLabel: string;
    frequencyLabel: string;
    budgetNotesLabel: string;
    step1BasicInfo: string;
    step2ProductsPlatforms: string;
    step3ScheduleVoice: string;
    step4ReviewLaunch: string;
    dateValidationErr: string;
    productRequiredErr: string;
    platformRequiredErr: string;
    noCampaignsFound: string;
    emptyStateDesc: string;
    saveAsDraft: string;
    launchCampaign: string;
    pauseCampaign: string;
    resumeCampaign: string;
    deleteCampaign: string;
    confirmDelete: string;
    campaignSaved: string;
    campaignDeleted: string;
    launchInStudioBtn: string;
    dateRangeLabel: string;
    associatedProductsCount: string;
    editRestrictedNotice: string;
  };
  studio: {
    title: string;
    subtitle: string;
    campaignContext: string;
    productContext: string;
    platformSelect: string;
    languageSelect: string;
    toneSelect: string;
    customPromptLabel: string;
    generateBtn: string;
    generatingBtn: string;
    idleStateTitle: string;
    idleStateDesc: string;
    queuedState: string;
    processingState: string;
    variantsTitle: string;
    variantSelectedBadge: string;
    previewInstagram: string;
    previewFacebook: string;
    sendToEditorBtn: string;
    sendToApprovalBtn: string;
    simulateFailureLabel: string;
    generationFailedTitle: string;
    retryGenerationBtn: string;
    captionLabel: string;
    hashtagsLabel: string;
    ctaLabel: string;
    visualIdeaLabel: string;
    publishingTimeLabel: string;
  };
  posts: {
    title: string;
    subtitle: string;
    createPost: string;
    editPost: string;
    versionHistory: string;
    versionsTitle: string;
    currentVersionBadge: string;
    revertToVersion: string;
    revertConfirm: string;
    aiGeneratedTag: string;
    manualEditTag: string;
    approvalStatus: string;
    pendingReview: string;
    approved: string;
    rejected: string;
    draft: string;
    scheduled: string;
    published: string;
    approveAction: string;
    rejectAction: string;
    rejectionReasonLabel: string;
    rejectionReasonPlaceholder: string;
    readinessChecklist: string;
    readinessCaption: string;
    readinessHashtags: string;
    readinessCta: string;
    readinessMedia: string;
    notReadyNotice: string;
    approvedNotice: string;
    filterAll: string;
    searchPlaceholder: string;
    noPostsFound: string;
    emptyPostsDesc: string;
    postSaved: string;
    postApprovedMsg: string;
    postRejectedMsg: string;
  };
  integrations: {
    title: string;
    subtitle: string;
    connectInstagram: string;
    connectFacebook: string;
    reconnect: string;
    disconnect: string;
    disconnectConfirm: string;
    statusConnected: string;
    statusDisconnected: string;
    statusTokenExpired: string;
    followers: string;
    tokenExpiryNotice: string;
    tokenExpiredAlert: string;
    mvpLimitationTitle: string;
    mvpLimitationDesc: string;
    connecting: string;
    reconnecting: string;
    oauthModalTitle: string;
    oauthModalDesc: string;
    accountHandle: string;
    externalId: string;
    connectedSince: string;
    lastSynced: string;
    unsupportedNetworks: string;
  };
  calendar: {
    title: string;
    subtitle: string;
    schedulePostBtn: string;
    monthView: string;
    weekView: string;
    today: string;
    prev: string;
    next: string;
    timezoneNotice: string;
    scheduledPostsCount: string;
    publishedPostsCount: string;
    failedPostsCount: string;
    scheduleModalTitle: string;
    selectApprovedPost: string;
    selectDateTime: string;
    minScheduleNotice: string;
    confirmSchedule: string;
    cancelSchedule: string;
    cancelScheduleConfirm: string;
    postDetailTitle: string;
    publishingStatus: string;
    retryPublishing: string;
    viewOnSocial: string;
    failureReasonLabel: string;
    noApprovedPostsToSchedule: string;
    emptyDay: string;
    publishNow: string;
  };
  analytics: {
    title: string;
    subtitle: string;
    reachVsImpressionsTitle: string;
    reachVsImpressionsDesc: string;
    reachLabel: string;
    impressionsLabel: string;
    engagementRateLabel: string;
    likesLabel: string;
    commentsLabel: string;
    sharesLabel: string;
    savesLabel: string;
    linkClicksLabel: string;
    ctrLabel: string;
    performanceTrends: string;
    platformComparison: string;
    range7d: string;
    range14d: string;
    range30d: string;
    range90d: string;
    telemetrySyncNotice: string;
    refreshMetrics: string;
  };
  reports: {
    title: string;
    subtitle: string;
    swotTitle: string;
    swotSubtitle: string;
    strengths: string;
    weaknesses: string;
    opportunities: string;
    threats: string;
    recommendationsTitle: string;
    recommendationsSubtitle: string;
    highPriority: string;
    mediumPriority: string;
    lowPriority: string;
    expectedImpactLabel: string;
    actionItemLabel: string;
    numericalEvidenceLabel: string;
    insufficientDataTitle: string;
    insufficientDataDesc: string;
    insufficientToggle: string;
    sufficientToggle: string;
    regenerateReport: string;
    regenerating: string;
    applyToCampaign: string;
  };
  admin: {
    title: string;
    subtitle: string;
    accessRestrictedTitle: string;
    accessRestrictedDesc: string;
    totalTenants: string;
    activeTenants: string;
    queuedJobs: string;
    aiTokens: string;
    platformHealth: string;
    metaApi: string;
    aiWorker: string;
    dbLatency: string;
    tenantsTableTitle: string;
    tenantsTableSubtitle: string;
    tenantName: string;
    owner: string;
    plan: string;
    status: string;
    productsCount: string;
    campaignsCount: string;
    actions: string;
    suspendTenant: string;
    reactivateTenant: string;
    suspendConfirmTitle: string;
    suspendConfirmDesc: string;
    purgeQueue: string;
    purgeConfirmTitle: string;
    purgeConfirmDesc: string;
    flushCache: string;
    flushConfirmTitle: string;
    flushConfirmDesc: string;
  };
  notifications: {
    title: string;
    subtitle: string;
    markAllRead: string;
    filterAll: string;
    filterPublishing: string;
    filterAi: string;
    filterSecurity: string;
    filterSystem: string;
    noNotifications: string;
    emptyDesc: string;
    viewAction: string;
    delete: string;
  };
  settings: {
    title: string;
    subtitle: string;
    profileSection: string;
    securitySection: string;
    fullName: string;
    email: string;
    preferredLang: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    updateProfileBtn: string;
    changePasswordBtn: string;
    profileUpdated: string;
    passwordChanged: string;
  };
  validation: {
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    passwordWeak: string;
    passwordsMismatch: string;
    fullNameRequired: string;
    companyNameRequired: string;
    industryRequired: string;
    descriptionMin: string;
    targetAudienceRequired: string;
    countryRequired: string;
    brandInfoRequired: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    meta: {
      appName: "SMART MARKETING",
      appTagline: "AI-Powered Social Media Marketing Workspace",
      direction: "ltr",
      languageLabel: "English",
      simulatedBanner:
        "Development Mock API Adapter (/api/v1) — Simulated data only. No live database or social tokens connected.",
      liveModeBanner: "Connected to NestJS API (/api/v1)",
    },
    nav: {
      workspaceGroup: "Workspace & Brand",
      publishingGroup: "Campaigns & AI Studio",
      intelligenceGroup: "Analytics & Strategy",
      systemGroup: "Governance & Settings",
      dashboard: "Marketing Command",
      onboarding: "Company Onboarding",
      brandSettings: "Brand Identity",
      products: "Product Catalog",
      campaigns: "Campaigns",
      contentStudio: "AI Content Studio",
      posts: "Review & Approval",
      calendar: "Publishing Calendar",
      integrations: "Social Channels",
      analytics: "Performance Analytics",
      reports: "SWOT Intelligence",
      notifications: "Notifications",
      accountSettings: "Account Settings",
      designSystem: "Design System",
      admin: "System Administration",
      logout: "Sign Out",
      collapseSidebar: "Collapse Sidebar",
      expandSidebar: "Expand Sidebar",
      switchRole: "Active Role",
      simulateExpiry: "Test Session Expiry",
      roleOwner: "Company Owner",
      roleAdmin: "System Admin",
    },
    common: {
      save: "Save Changes",
      saving: "Saving to API...",
      cancel: "Cancel",
      reset: "Reset",
      back: "Previous",
      next: "Continue",
      finish: "Complete Setup",
      retry: "Retry Operation",
      loading: "Loading from /api/v1...",
      requiredField: "Required",
      unsavedChanges: "You have unsaved changes",
      savedSuccessfully: "Synchronized with backend API successfully.",
      errorOccurred: "Unable to complete request",
      confirmAction: "Confirm Action",
      close: "Close",
      searchPlaceholder: "Search workspace...",
      statusCompleted: "Implemented (R1)",
      statusScheduled: "Planned Release",
      releaseBadge: "Release",
      externalDeps: "Backend Prerequisite IDs",
    },
    auth: {
      loginTitle: "Welcome Back to Your Marketing Studio",
      loginSubtitle:
        "Sign in to manage your brand identity, AI campaigns, and social publishing.",
      registerTitle: "Register Your Company Workspace",
      registerSubtitle:
        "Set up an intelligent social media marketing workspace built for growing businesses.",
      emailLabel: "Work Email Address",
      emailPlaceholder: "founder@company.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      confirmPasswordLabel: "Confirm New Password",
      fullNameLabel: "Full Name",
      fullNamePlaceholder: "Sarah Jenkins",
      companyNameLabel: "Company Name",
      companyNamePlaceholder: "Lumiere Artisan Coffee",
      signInBtn: "Sign In to Workspace",
      signingInBtn: "Authenticating...",
      createAccountBtn: "Create Company Account",
      creatingAccountBtn: "Provisioning Workspace...",
      forgotPasswordLink: "Forgot password?",
      noAccountText: "New to Smart Marketing?",
      haveAccountText: "Already have a workspace?",
      demoCredentialsHint: "Instant Demo Workspace Access:",
      fillOwnerDemo: "Company Owner Demo",
      fillAdminDemo: "System Admin Demo",
      showPassword: "Show password",
      hidePassword: "Hide password",
      passwordRulesTitle: "Password Security Requirements:",
      ruleMinLength: "At least 8 characters",
      ruleUppercase: "At least 1 uppercase letter (A–Z)",
      ruleNumber: "At least 1 numeric digit (0–9)",
      ruleSpecial: "At least 1 special character (!@#$%)",
      verifyEmailTitle: "Email Verification",
      verifyEmailSubtitle:
        "Validating your verification token with the authentication service (/api/v1/auth/verify-email).",
      verifyValidBtn: "Simulate Valid Token",
      verifyExpiredBtn: "Simulate Expired Token",
      verifySuccessTitle: "Email Address Verified",
      verifySuccessDesc:
        "Your company email has been confirmed. You can now proceed to company onboarding.",
      verifyExpiredTitle: "Verification Link Expired",
      verifyExpiredDesc:
        "This verification token has expired or was already used. Request a fresh verification link below.",
      resendVerificationBtn: "Resend Verification Email",
      resendSuccessMsg:
        "A new verification link has been dispatched to your email address.",
      forgotPasswordTitle: "Account Password Recovery",
      forgotPasswordSubtitle:
        "Enter your registered work email and we will send a time-limited password reset token.",
      sendResetLinkBtn: "Send Recovery Link",
      resetLinkSentTitle: "Check Your Inbox",
      resetLinkSentDesc:
        "If an account matches that address, a password reset link has been sent.",
      resetPasswordTitle: "Set a New Password",
      resetPasswordSubtitle:
        "Create a strong password that satisfies the platform security policy.",
      updatePasswordBtn: "Update Password",
      passwordUpdatedTitle: "Password Updated Successfully",
      passwordUpdatedDesc:
        "Your credentials have been rotated. You may now sign in with your new password.",
      proceedToWorkspace: "Continue to Onboarding",
      backToLogin: "Back to Sign In",
      sessionExpiredTitle: "Your Session Has Expired",
      sessionExpiredDesc:
        "For your company's security, your authentication token has expired. Please sign in again to continue without losing saved work.",
      reauthenticateBtn: "Sign In Again",
      unauthorizedTitle: "Restricted Administration Area",
      unauthorizedDesc:
        "Your current account role (COMPANY_OWNER) does not have permission to access System Administration (WEB-03-06). Backend authorization (BE-01-06) enforces role isolation.",
      returnToDashboardBtn: "Return to Workspace Overview",
    },
    onboarding: {
      title: "Company Onboarding Wizard",
      subtitle:
        "Configure your company profile and brand voice so AI content generation matches your business identity.",
      step1Title: "1. Company Identity",
      step1Desc: "Core business name, industry vertical, and company overview.",
      step2Title: "2. Audience & Market",
      step2Desc: "Define who you serve and your primary geographic region.",
      step3Title: "3. Voice & Language",
      step3Desc: "Select preferred content language and brand communication tone.",
      step4Title: "4. Brand Story & Review",
      step4Desc: "Provide key brand context and confirm your workspace setup.",
      companyName: "Company Name",
      industry: "Business Industry",
      industryPlaceholder: "e.g., Specialty Coffee & Artisanal Bakery",
      description: "Company Description",
      descriptionPlaceholder:
        "Describe your products, mission, and what makes your business distinctive...",
      targetAudience: "Target Audience",
      targetAudiencePlaceholder:
        "e.g., Urban professionals aged 24–45 who value specialty organic coffee...",
      countryRegion: "Country or Geographic Region",
      countryRegionPlaceholder: "e.g., Turkey — Istanbul & Anatolia",
      preferredLanguage: "Preferred Content Language",
      communicationTone: "Brand Communication Tone",
      brandInformation: "Relevant Brand Information & Pillars",
      brandInformationPlaceholder:
        "Key brand values, phrases to emphasize, and customer promise...",
      simulateSaveErrorLabel:
        "Simulate transient API failure to verify safe draft recovery (WEB-01-06)",
      draftProtectedNotice:
        "Safe Recovery Active: Your form inputs are preserved locally in memory if a network or API error occurs during submission.",
      completeOnboardingBtn: "Save & Complete Onboarding",
      onboardingSuccessMsg:
        "Company onboarding saved to /api/v1/company/onboarding.",
      tones: {
        PROFESSIONAL: "Professional & Authoritative",
        FRIENDLY: "Warm, Friendly & Conversational",
        LUXURY: "Refined, Luxury & Exclusive",
        BOLD: "Bold, Energetic & Modern",
        EDUCATIONAL: "Educational & Insight-Driven",
      },
      languages: {
        en: "English (EN)",
        tr: "Turkish (TR)",
        ar: "Arabic (AR)",
      },
    },
    brand: {
      title: "Brand Configuration & Voice Settings",
      subtitle:
        "Synchronized with /api/v1/company/brand (WEB-01-07). Updates immediately guide AI campaign and post generation.",
      brandName: "Official Brand Name",
      brandDescription: "Brand Positioning Statement",
      communicationTone: "Default Communication Tone",
      preferredLanguage: "Default Content Generation Language",
      targetAudienceSummary: "Target Audience Profile",
      keyValueProposition: "Core Value Proposition",
      brandGuidelines: "Editorial & Visual Brand Guidelines",
      lastSynchronized: "Last synchronized with API:",
      syncBadge: "Backend Synchronized",
      discardConfirm: "Discard unsaved changes and restore server values?",
      reloadFromServer: "Reload from API",
    },
    dashboard: {
      welcomePrefix: "Intelligent Marketing Workspace",
      workspaceSubtitle:
        "Manage your brand foundation, product catalog, AI content studio, and social publishing workflow.",
      journeyTitle: "Core Marketing Workflow Journey",
      journeySubtitle:
        "Your guided end-to-end social media marketing lifecycle from onboarding to SWOT intelligence.",
      r1CompletedTitle: "Release R1 — Application Foundation & Onboarding (8/8 Stories Live)",
      r1CompletedSubtitle:
        "Inspect and test every R1 screen below, or switch languages (EN / TR / AR) and roles in the top bar.",
      openScreen: "Open Screen",
      quickActionsTitle: "Active Company & Brand Snapshot",
      companyReadinessTitle: "Brand Profile Synchronized",
      brandToneLabel: "Communication Tone",
      contentLangLabel: "Content Language",
      industryLabel: "Business Industry",
      regionLabel: "Geographic Region",
      roadmapTitle: "Staged Release Roadmap (R1 → R7)",
      roadmapSubtitle:
        "Structured implementation across 3 Epics and 22 Jira Frontend Stories.",
    },
    designSystem: {
      title: "Liquid Glass Responsive Design System (WEB-01-08)",
      subtitle:
        "Interactive specification of color tokens, translucent glass surfaces, accessible focus states, buttons, inputs, modals, skeletons, and status badges.",
      colorsTitle: "1. Semantic & Atmospheric Color Tokens",
      buttonsTitle: "2. Interactive Button States & Micro-Interactions",
      inputsTitle: "3. Form Controls, Validation & Accessible Focus States",
      statesTitle: "4. Skeletons, Empty States & Error Recovery",
      badgesTitle: "5. Semantic Status & Release Badges",
      modalsTitle: "6. Accessible Glass Dialogs & Overlays",
      openDemoModal: "Launch Interactive Glass Modal",
      focusAccessibilityNote:
        "Keyboard Navigation Ready: Press Tab across controls to verify high-contrast focus rings and prefers-reduced-motion compliance.",
    },
    products: {
      title: "Products & Media Workspace",
      subtitle:
        "Manage your product catalog, media assets, pricing, and campaign associations with authorized API isolation.",
      addProduct: "Add Product",
      editProduct: "Edit Product",
      deleteProduct: "Delete Product",
      productDetails: "Product Details",
      searchPlaceholder: "Search products by name or SKU...",
      filterAll: "All Statuses",
      filterActive: "Active",
      filterDraft: "Draft",
      filterArchived: "Archived",
      categoryLabel: "Category",
      priceLabel: "Price ($)",
      discountLabel: "Discount (%)",
      purchaseUrlLabel: "Purchase / Product URL",
      statusLabel: "Product Status",
      nameLabel: "Product Name",
      descriptionLabel: "Product Description",
      mediaManagement: "Media & Product Imagery (WEB-02-02)",
      uploadAreaTitle: "Drag & drop product images, or click to browse",
      uploadAreaDesc: "Supports PNG, JPG, WebP up to 5MB. Order determines publication carousel sequence.",
      primaryBadge: "Primary Cover",
      setPrimary: "Make Primary",
      moveUp: "Move Forward",
      moveDown: "Move Backward",
      removeMedia: "Remove Image",
      noProductsFound: "No products found",
      emptyStateDesc: "No items match your active search or status filters. Try clearing your filters or create a new product.",
      simulateUploadError: "Simulate upload rejection (file size / type failure test)",
      fileTooLarge: "File exceeds 5MB size limit enforced by BE-03-05.",
      invalidFileType: "Invalid file format. Only JPEG, PNG, and WebP are accepted.",
      cardView: "Card View",
      tableView: "Table View",
      confirmDelete: "Are you sure you want to delete this product? This action cannot be undone.",
      productSaved: "Product synchronized with backend API successfully.",
      productDeleted: "Product removed from workspace catalog.",
      allCategories: "All Categories",
    },
    campaigns: {
      title: "Marketing Campaigns Workspace",
      subtitle:
        "Orchestrate goal-driven campaigns across Instagram Professional and Facebook Pages with date validation and product alignment.",
      createCampaign: "Create New Campaign",
      createWizardTitle: "Campaign Creation Wizard (WEB-02-03)",
      createWizardSubtitle:
        "Guided step-by-step campaign setup with objective definitions, date logic, and product selection.",
      editCampaign: "Edit Campaign Details",
      campaignDetails: "Campaign Overview & Performance Context",
      searchPlaceholder: "Search campaigns by title, objective, or target audience...",
      filterAllObjectives: "All Objectives",
      filterSales: "Increase Sales",
      filterEngagement: "Increase Engagement",
      filterAwareness: "Brand Awareness",
      filterAllStatus: "All Statuses",
      filterDraft: "Draft",
      filterActive: "Active",
      filterPaused: "Paused",
      filterCompleted: "Completed",
      nameLabel: "Campaign Name",
      objectiveLabel: "Campaign Objective",
      statusLabel: "Campaign Status",
      targetProductsLabel: "Associated Products",
      selectProductsDesc: "Select products from your catalog to feature in AI-generated social posts.",
      targetAudienceLabel: "Target Audience Definition",
      platformsLabel: "Publishing Platforms (MVP Scope: Instagram & Facebook)",
      startDateLabel: "Start Date",
      endDateLabel: "End Date",
      toneLabel: "Communication Tone",
      languageLabel: "Content Language",
      frequencyLabel: "Planned Posting Frequency",
      budgetNotesLabel: "Budget / Strategic Notes",
      step1BasicInfo: "1. Core Objective & Scope",
      step2ProductsPlatforms: "2. Products & Platforms",
      step3ScheduleVoice: "3. Schedule & Voice",
      step4ReviewLaunch: "4. Review & Launch",
      dateValidationErr: "End date must be on or after the start date.",
      productRequiredErr: "Please select at least one product for this campaign.",
      platformRequiredErr: "Please select at least one target social platform.",
      noCampaignsFound: "No marketing campaigns found",
      emptyStateDesc:
        "No campaigns match your active search or filters. Create your first campaign to begin AI content generation.",
      saveAsDraft: "Save as Draft",
      launchCampaign: "Launch Campaign",
      pauseCampaign: "Pause Campaign",
      resumeCampaign: "Resume Campaign",
      deleteCampaign: "Delete Campaign",
      confirmDelete:
        "Are you sure you want to delete this campaign? All associated draft links will be unlinked.",
      campaignSaved: "Campaign synchronized with backend API successfully.",
      campaignDeleted: "Campaign removed from workspace.",
      launchInStudioBtn: "Open in AI Content Studio",
      dateRangeLabel: "Flight Duration",
      associatedProductsCount: "Linked Products",
      editRestrictedNotice:
        "Completed campaigns have locked parameters to preserve historical analytics integrity.",
    },
    studio: {
      title: "AI Content Studio",
      subtitle:
        "Generate multi-variant marketing copy, hashtags, CTAs, and visual ideas with asynchronous job states.",
      campaignContext: "Campaign Strategy Context",
      productContext: "Featured Product",
      platformSelect: "Target Publishing Platform",
      languageSelect: "Language",
      toneSelect: "Tone of Voice",
      customPromptLabel: "Creative Guidance / Keywords (Optional)",
      generateBtn: "Generate 3 AI Variations",
      generatingBtn: "Synthesizing AI Variations...",
      idleStateTitle: "Ready to Generate Campaign Content",
      idleStateDesc:
        "Select your campaign context and click Generate to produce high-converting social media copy.",
      queuedState: "Job Queued in AI Dispatcher...",
      processingState: "Neural Model Formulating Structured Variations...",
      variantsTitle: "Generated Content Variations",
      variantSelectedBadge: "Active Selected Variant",
      previewInstagram: "Live Instagram Preview",
      previewFacebook: "Live Facebook Page Preview",
      sendToEditorBtn: "Send to Post Editor",
      sendToApprovalBtn: "Submit for Human Approval",
      simulateFailureLabel: "Simulate AI API rate-limit / failure test (AI-02-06)",
      generationFailedTitle: "AI Generation Request Failed",
      retryGenerationBtn: "Retry AI Generation",
      captionLabel: "Post Caption",
      hashtagsLabel: "Strategic Hashtags",
      ctaLabel: "Call to Action (CTA)",
      visualIdeaLabel: "Visual Staging & Image Idea",
      publishingTimeLabel: "Recommended Publishing Time",
    },
    posts: {
      title: "Posts & Review Workspace",
      subtitle:
        "Edit post copy, inspect version history, and manage human approval checkpoints prior to scheduling.",
      createPost: "Draft New Post",
      editPost: "Edit Post Content",
      versionHistory: "Revision History",
      versionsTitle: "Content Revision Log",
      currentVersionBadge: "Current Live Version",
      revertToVersion: "Revert to this Revision",
      revertConfirm: "Revert current draft to revision #",
      aiGeneratedTag: "AI Synthesized",
      manualEditTag: "Manual Polish",
      approvalStatus: "Review & Approval Status",
      pendingReview: "Pending Human Review",
      approved: "Approved for Publishing",
      rejected: "Revision Requested",
      draft: "Working Draft",
      scheduled: "Scheduled on Calendar",
      published: "Live & Published",
      approveAction: "Approve Post",
      rejectAction: "Request Revisions / Reject",
      rejectionReasonLabel: "Rejection Reason Feedback",
      rejectionReasonPlaceholder: "Explain what requires revision before approval...",
      readinessChecklist: "Publishing Readiness Checklist",
      readinessCaption: "Caption character count verified",
      readinessHashtags: "Hashtags structured appropriately",
      readinessCta: "Explicit Call-to-Action included",
      readinessMedia: "High-resolution media file linked",
      notReadyNotice:
        "Incomplete posts cannot be approved. Please satisfy all readiness requirements.",
      approvedNotice:
        "Post approved. It is now eligible for calendar scheduling in Release R5.",
      filterAll: "All Posts",
      searchPlaceholder: "Search posts by title, caption, or campaign...",
      noPostsFound: "No marketing posts found",
      emptyPostsDesc:
        "No posts match your filters. Use the AI Content Studio to generate your first draft.",
      postSaved: "Post and new revision saved successfully.",
      postApprovedMsg: "Post has been explicitly approved for publishing.",
      postRejectedMsg: "Post rejected with revision feedback delivered.",
    },
    integrations: {
      title: "Social Account Connections",
      subtitle:
        "Connect your Meta business channels to enable automated publishing and track live engagement.",
      connectInstagram: "Connect Instagram Professional",
      connectFacebook: "Connect Facebook Page",
      reconnect: "Reconnect Access Token",
      disconnect: "Disconnect Account",
      disconnectConfirm:
        "Are you sure you want to disconnect this account? Automated scheduling for this channel will be halted.",
      statusConnected: "Connected & Active",
      statusDisconnected: "Disconnected",
      statusTokenExpired: "Token Expired — Reconnect Required",
      followers: "Audience / Followers",
      tokenExpiryNotice: "Meta token valid until",
      tokenExpiredAlert:
        "Access token has expired. Meta requires periodic re-authorization to publish automatically.",
      mvpLimitationTitle: "Supported Channels (MVP Scope)",
      mvpLimitationDesc:
        "Antigravity Smart Marketing platform currently supports Instagram Professional and Facebook Business Pages. Personal profiles, TikTok, X (Twitter), LinkedIn, and Pinterest are intentionally restricted in MVP scope.",
      connecting: "Initiating Meta OAuth...",
      reconnecting: "Refreshing Access Token...",
      oauthModalTitle: "Meta Business Login Redirect",
      oauthModalDesc:
        "Connecting securely via Meta OAuth 2.0 PKCE protocol. No access tokens or secrets are exposed in the client browser.",
      accountHandle: "Handle",
      externalId: "Meta Account ID",
      connectedSince: "Connected Date",
      lastSynced: "Last Synchronized",
      unsupportedNetworks:
        "Other networks (TikTok, X, LinkedIn) scheduled for future enterprise release.",
    },
    calendar: {
      title: "Publishing Calendar & Scheduling",
      subtitle:
        "Plan, review, and track automated multi-platform social media publications across your schedule.",
      schedulePostBtn: "Schedule Approved Post",
      monthView: "Month View",
      weekView: "Week View",
      today: "Today",
      prev: "Previous",
      next: "Next",
      timezoneNotice:
        "All scheduling timestamps are server-authoritative in Europe/Istanbul (UTC+03:00).",
      scheduledPostsCount: "Scheduled",
      publishedPostsCount: "Published",
      failedPostsCount: "Attention Required",
      scheduleModalTitle: "Schedule Publication Slot",
      selectApprovedPost: "Select Approved Post",
      selectDateTime: "Publishing Date & Time",
      minScheduleNotice:
        "Posts must be scheduled at least 5 minutes in the future.",
      confirmSchedule: "Confirm & Schedule",
      cancelSchedule: "Cancel Scheduled Slot",
      cancelScheduleConfirm:
        "Cancel scheduled publishing and return post to Approved draft?",
      postDetailTitle: "Publication Inspector",
      publishingStatus: "Publishing State",
      retryPublishing: "Retry Publishing Now",
      viewOnSocial: "View Live Post",
      failureReasonLabel: "Publishing Failure Diagnostic",
      noApprovedPostsToSchedule:
        "No approved posts available. Approve a post in Posts & Review first.",
      emptyDay: "No publications scheduled for this day.",
      publishNow: "Publish Immediately",
    },
    analytics: {
      title: "Performance Analytics",
      subtitle:
        "Real-time marketing metrics, audience reach, engagement velocity, and conversion telemetry.",
      reachVsImpressionsTitle: "Reach vs. Impressions Distinction",
      reachVsImpressionsDesc:
        "Reach reflects unique accounts that saw your content, whereas Impressions measures total times your content was displayed.",
      reachLabel: "Audience Reach",
      impressionsLabel: "Total Impressions",
      engagementRateLabel: "Avg. Engagement Rate",
      likesLabel: "Total Likes",
      commentsLabel: "Comments",
      sharesLabel: "Shares",
      savesLabel: "Saves & Bookmarks",
      linkClicksLabel: "Website Link Clicks",
      ctrLabel: "Click-Through Rate (CTR)",
      performanceTrends: "Audience & Impression Velocity Trends",
      platformComparison: "Platform Performance Distribution",
      range7d: "7 Days",
      range14d: "14 Days",
      range30d: "30 Days",
      range90d: "90 Days",
      telemetrySyncNotice: "Meta Telemetry Synchronized at",
      refreshMetrics: "Sync Latest Metrics",
    },
    reports: {
      title: "SWOT Intelligence & Strategy",
      subtitle:
        "Evidence-based strengths, weaknesses, opportunities, threats, and prioritized AI marketing directives.",
      swotTitle: "Evidence-Based SWOT Matrix",
      swotSubtitle:
        "Every strength, weakness, opportunity, and threat is substantiated by observed publication data.",
      strengths: "Strengths",
      weaknesses: "Weaknesses",
      opportunities: "Opportunities",
      threats: "Threats",
      recommendationsTitle: "Prioritized Strategic Directives",
      recommendationsSubtitle:
        "Actionable recommendations synthesized by the AI marketing engine with estimated conversion impact.",
      highPriority: "High Priority",
      mediumPriority: "Medium Priority",
      lowPriority: "Low Priority",
      expectedImpactLabel: "Expected Impact",
      actionItemLabel: "Recommended Action",
      numericalEvidenceLabel: "Observed Data Evidence",
      insufficientDataTitle: "Insufficient Historical Performance Data",
      insufficientDataDesc:
        "Evidence-based SWOT analysis requires at least 3 published posts with collected audience telemetry. Connect social accounts and publish campaigns to generate full intelligence.",
      insufficientToggle: "Simulate Insufficient Data (Cold Start)",
      sufficientToggle: "View Full Evidence Matrix",
      regenerateReport: "Synthesize Fresh Report",
      regenerating: "Synthesizing AI Matrix...",
      applyToCampaign: "Launch Campaign from Directive",
    },
    admin: {
      title: "System Administration & Infrastructure",
      subtitle:
        "Global multi-tenant oversight, publishing queue telemetry, and sensitive infrastructure operations.",
      accessRestrictedTitle: "System Administrator Access Required",
      accessRestrictedDesc:
        "This console is restricted to users with the SYSTEM_ADMIN role. You can switch your role in the top-right header switcher to test this screen.",
      totalTenants: "Registered Tenants",
      activeTenants: "Active Workspaces",
      queuedJobs: "Queued Publish Jobs",
      aiTokens: "AI Inference Tokens",
      platformHealth: "Infrastructure Health",
      metaApi: "Meta Graph API Status",
      aiWorker: "AI Inference Worker",
      dbLatency: "Database Cluster Latency",
      tenantsTableTitle: "Platform Tenants & Workspaces",
      tenantsTableSubtitle:
        "Manage business workspaces, review subscription tiers, and control operational status.",
      tenantName: "Tenant / Company",
      owner: "Account Owner",
      plan: "Plan Tier",
      status: "Tenant Status",
      productsCount: "Products",
      campaignsCount: "Campaigns",
      actions: "Administrative Actions",
      suspendTenant: "Suspend Tenant",
      reactivateTenant: "Reactivate Tenant",
      suspendConfirmTitle: "Confirm Tenant Suspension",
      suspendConfirmDesc:
        "Are you sure you want to suspend this workspace? All automated publishing and AI generation for this tenant will be locked immediately.",
      purgeQueue: "Purge Stalled Queues",
      purgeConfirmTitle: "Purge Publishing Queue",
      purgeConfirmDesc:
        "This will evict all currently pending background publish jobs across all tenants.",
      flushCache: "Flush AI Inference Cache",
      flushConfirmTitle: "Flush Neural Cache",
      flushConfirmDesc:
        "This will clear warm vector embeddings and cached prompt templates from the worker memory.",
    },
    notifications: {
      title: "Notification Center",
      subtitle:
        "Tenant-isolated alerts, automated publishing statuses, security events, and AI generation callbacks.",
      markAllRead: "Mark All as Read",
      filterAll: "All Alerts",
      filterPublishing: "Publishing",
      filterAi: "AI Content",
      filterSecurity: "Security",
      filterSystem: "System Updates",
      noNotifications: "No notifications found",
      emptyDesc: "You have zero unread alerts in this category.",
      viewAction: "View Details",
      delete: "Dismiss Alert",
    },
    settings: {
      title: "Account & Workspace Settings",
      subtitle:
        "Manage your administrator profile, security credentials, and platform localization preferences.",
      profileSection: "User Profile Information",
      securitySection: "Security & Password Management",
      fullName: "Full Name",
      email: "Work Email Address",
      preferredLang: "Interface Language Preference",
      currentPassword: "Current Password",
      newPassword: "New Secure Password",
      confirmNewPassword: "Confirm New Password",
      updateProfileBtn: "Update Profile",
      changePasswordBtn: "Change Password",
      profileUpdated: "Profile updated successfully.",
      passwordChanged: "Password updated successfully.",
    },
    validation: {
      emailRequired: "Email address is required.",
      emailInvalid: "Please enter a valid work email address.",
      passwordRequired: "Password is required.",
      passwordWeak:
        "Password must be at least 8 characters and include uppercase, number, and special character.",
      passwordsMismatch: "Password confirmation does not match.",
      fullNameRequired: "Full name is required.",
      companyNameRequired: "Company name is required.",
      industryRequired: "Business industry is required.",
      descriptionMin: "Please provide at least 20 characters describing your company.",
      targetAudienceRequired: "Target audience description is required.",
      countryRequired: "Country or geographic region is required.",
      brandInfoRequired: "Relevant brand information is required.",
    },
  },
  tr: {
    meta: {
      appName: "SMART MARKETING",
      appTagline: "Yapay Zeka Destekli Sosyal Medya Pazarlama Platformu",
      direction: "ltr",
      languageLabel: "Türkçe",
      simulatedBanner:
        "Geliştirme Mock API Adaptörü (/api/v1) — Yalnızca simülasyon verisi. Gerçek veritabanı veya sosyal medya jetonu bağlı değildir.",
      liveModeBanner: "NestJS API Bağlantısı Aktif (/api/v1)",
    },
    nav: {
      workspaceGroup: "Çalışma Alanı & Marka",
      publishingGroup: "Kampanya & YZ Stüdyosu",
      intelligenceGroup: "Analitik & Strateji",
      systemGroup: "Yönetim & Ayarlar",
      dashboard: "Pazarlama Merkezi",
      onboarding: "Şirket Kurulumu",
      brandSettings: "Marka Kimliği",
      products: "Ürün Kataloğu",
      campaigns: "Kampanyalar",
      contentStudio: "YZ İçerik Stüdyosu",
      posts: "İnceleme & Onay",
      calendar: "Yayın Takvimi",
      integrations: "Sosyal Kanallar",
      analytics: "Performans Analitiği",
      reports: "SWOT İstihbaratı",
      notifications: "Bildirim Merkezi",
      accountSettings: "Hesap Ayarları",
      designSystem: "Tasarım Sistemi",
      admin: "Sistem Yönetimi",
      logout: "Oturumu Kapat",
      collapseSidebar: "Menüyü Daralt",
      expandSidebar: "Menüyü Genişlet",
      switchRole: "Aktif Rol",
      simulateExpiry: "Oturum Süresi Testi",
      roleOwner: "Şirket Sahibi",
      roleAdmin: "Sistem Yöneticisi",
    },
    common: {
      save: "Değişiklikleri Kaydet",
      saving: "API'ye Kaydediliyor...",
      cancel: "İptal",
      reset: "Sıfırla",
      back: "Önceki Adım",
      next: "Devam Et",
      finish: "Kurulumu Tamamla",
      retry: "Yeniden Dene",
      loading: "/api/v1 üzerinden yükleniyor...",
      requiredField: "Zorunlu",
      unsavedChanges: "Kaydedilmemiş değişiklikleriniz var",
      savedSuccessfully: "Arka uç API ile başarıyla senkronize edildi.",
      errorOccurred: "İstek tamamlanamadı",
      confirmAction: "İşlemi Onayla",
      close: "Kapat",
      searchPlaceholder: "Çalışma alanında ara...",
      statusCompleted: "Tamamlandı (R1)",
      statusScheduled: "Planlanan Sürüm",
      releaseBadge: "Sürüm",
      externalDeps: "Arka Uç Bağımlılık Kodları",
    },
    auth: {
      loginTitle: "Pazarlama Stüdyonuza Hoş Geldiniz",
      loginSubtitle:
        "Marka kimliğinizi, yapay zeka kampanyalarınızı ve sosyal medya yayınlarınızı yönetmek için giriş yapın.",
      registerTitle: "Şirket Çalışma Alanınızı Oluşturun",
      registerSubtitle:
        "Büyüyen işletmeler için tasarlanmış akıllı sosyal medya pazarlama çalışma alanınızı kurun.",
      emailLabel: "Kurumsal E-posta Adresi",
      emailPlaceholder: "kurucu@sirket.com",
      passwordLabel: "Şifre",
      passwordPlaceholder: "Şifrenizi girin",
      confirmPasswordLabel: "Yeni Şifreyi Onayla",
      fullNameLabel: "Ad Soyad",
      fullNamePlaceholder: "Selin Yılmaz",
      companyNameLabel: "Şirket Adı",
      companyNamePlaceholder: "Anadolu Özel Kahve Kavurucusu",
      signInBtn: "Çalışma Alanına Giriş Yap",
      signingInBtn: "Doğrulanıyor...",
      createAccountBtn: "Şirket Hesabı Oluştur",
      creatingAccountBtn: "Çalışma Alanı Hazırlanıyor...",
      forgotPasswordLink: "Şifrenizi mi unuttunuz?",
      noAccountText: "Smart Marketing'de yeni misiniz?",
      haveAccountText: "Zaten bir hesabınız var mı?",
      demoCredentialsHint: "Hızlı Demo Çalışma Alanı Erişimi:",
      fillOwnerDemo: "Şirket Sahibi Demo",
      fillAdminDemo: "Sistem Yöneticisi Demo",
      showPassword: "Şifreyi göster",
      hidePassword: "Şifreyi gizle",
      passwordRulesTitle: "Şifre Güvenlik Gereksinimleri:",
      ruleMinLength: "En az 8 karakter uzunluğunda",
      ruleUppercase: "En az 1 büyük harf (A–Z)",
      ruleNumber: "En az 1 rakam (0–9)",
      ruleSpecial: "En az 1 özel karakter (!@#$%)",
      verifyEmailTitle: "E-posta Doğrulaması",
      verifyEmailSubtitle:
        "Doğrulama anahtarınız kimlik doğrulama servisi (/api/v1/auth/verify-email) ile kontrol ediliyor.",
      verifyValidBtn: "Geçerli Anahtarı Simüle Et",
      verifyExpiredBtn: "Süresi Dolmuş Anahtarı Simüle Et",
      verifySuccessTitle: "E-posta Adresi Doğrulandı",
      verifySuccessDesc:
        "Şirket e-posta adresiniz onaylandı. Şimdi şirket kurulum sihirbazına geçebilirsiniz.",
      verifyExpiredTitle: "Doğrulama Bağlantısının Süresi Doldu",
      verifyExpiredDesc:
        "Bu doğrulama bağlantısının süresi dolmuş veya daha önce kullanılmış. Aşağıdan yeni bir bağlantı isteyin.",
      resendVerificationBtn: "Doğrulama E-postasını Yeniden Gönder",
      resendSuccessMsg: "Yeni doğrulama bağlantısı e-posta adresinize gönderildi.",
      forgotPasswordTitle: "Şifre Kurtarma",
      forgotPasswordSubtitle:
        "Kayıtlı kurumsal e-posta adresinizi girin, size süreli şifre sıfırlama bağlantısı gönderelim.",
      sendResetLinkBtn: "Kurtarma Bağlantısı Gönder",
      resetLinkSentTitle: "Gelen Kutunuzu Kontrol Edin",
      resetLinkSentDesc:
        "Bu adresle eşleşen bir hesap varsa şifre sıfırlama bağlantısı gönderilmiştir.",
      resetPasswordTitle: "Yeni Şifre Belirleyin",
      resetPasswordSubtitle:
        "Platform güvenlik politikasını karşılayan güçlü bir şifre oluşturun.",
      updatePasswordBtn: "Şifreyi Güncelle",
      passwordUpdatedTitle: "Şifreniz Başarıyla Güncellendi",
      passwordUpdatedDesc:
        "Kimlik bilgileriniz yenilendi. Artık yeni şifrenizle giriş yapabilirsiniz.",
      proceedToWorkspace: "Kurulum Sihirbazına Geç",
      backToLogin: "Giriş Ekranına Dön",
      sessionExpiredTitle: "Oturum Süreniz Sona Erdi",
      sessionExpiredDesc:
        "Şirket güvenliğiniz için oturum anahtarınızın süresi doldu. Verilerinizi kaybetmeden devam etmek için lütfen tekrar giriş yapın.",
      reauthenticateBtn: "Yeniden Giriş Yap",
      unauthorizedTitle: "Kısıtlı Sistem Yönetimi Alanı",
      unauthorizedDesc:
        "Mevcut hesap rolünüz (COMPANY_OWNER) Sistem Yönetimi (WEB-03-06) ekranına erişim yetkisine sahip değildir. Arka uç yetkilendirmesi (BE-01-06) rol izolasyonunu zorunlu kılar.",
      returnToDashboardBtn: "Çalışma Alanı Özetine Dön",
    },
    onboarding: {
      title: "Şirket Kurulum Sihirbazı",
      subtitle:
        "Yapay zeka içerik üretiminin işletme kimliğinizle tam uyumlu olması için şirket profilinizi ve marka sesinizi yapılandırın.",
      step1Title: "1. Şirket Kimliği",
      step1Desc: "Temel işletme adı, faaliyet sektörü ve şirket özeti.",
      step2Title: "2. Hedef Kitle & Pazar",
      step2Desc: "Kime hizmet verdiğinizi ve ana coğrafi bölgenizi tanımlayın.",
      step3Title: "3. İletişim Tonu & Dil",
      step3Desc: "Tercih edilen içerik dilini ve marka iletişim tonunu seçin.",
      step4Title: "4. Marka Hikayesi & Onay",
      step4Desc: "Temel marka bilgilerini girin ve çalışma alanı kurulumunu tamamlayın.",
      companyName: "Şirket Adı",
      industry: "Faaliyet Sektörü",
      industryPlaceholder: "Örn: Nitelikli Kahve & Artizan Fırın",
      description: "Şirket Açıklaması",
      descriptionPlaceholder:
        "Ürünlerinizi, misyonunuzu ve işletmenizi farklı kılan özellikleri açıklayın...",
      targetAudience: "Hedef Kitle",
      targetAudiencePlaceholder:
        "Örn: Nitelikli organik kahveye değer veren 24–45 yaş arası şehirli profesyoneller...",
      countryRegion: "Ülke veya Coğrafi Bölge",
      countryRegionPlaceholder: "Örn: Türkiye — İstanbul & Anadolu",
      preferredLanguage: "Tercih Edilen İçerik Dili",
      communicationTone: "Marka İletişim Tonu",
      brandInformation: "İlgili Marka Bilgileri & İlkeler",
      brandInformationPlaceholder:
        "Temel marka değerleri, vurgulanacak ifadeler ve müşteri vaadi...",
      simulateSaveErrorLabel:
        "Güvenli taslak kurtarmayı doğrulamak için geçici API hatasını simüle et (WEB-01-06)",
      draftProtectedNotice:
        "Güvenli Kurtarma Aktif: Gönderim sırasında ağ veya API hatası oluşursa girdiğiniz veriler kaybolmaz.",
      completeOnboardingBtn: "Kaydet ve Kurulumu Tamamla",
      onboardingSuccessMsg:
        "Şirket kurulum bilgileri /api/v1/company/onboarding uç noktasına kaydedildi.",
      tones: {
        PROFESSIONAL: "Profesyonel & Güvenilir",
        FRIENDLY: "Sıcak, Samimi & Doğal",
        LUXURY: "Seçkin, Lüks & Prestijli",
        BOLD: "Cesur, Enerjik & Modern",
        EDUCATIONAL: "Eğitici & Bilgi Odaklı",
      },
      languages: {
        en: "İngilizce (EN)",
        tr: "Türkçe (TR)",
        ar: "Arapça (AR)",
      },
    },
    brand: {
      title: "Marka Yapılandırması & İletişim Tonu Ayarları",
      subtitle:
        "/api/v1/company/brand ile senkronize çalışır (WEB-01-07). Yapılan güncellemeler yapay zeka kampanya ve içerik üretimini doğrudan yönlendirir.",
      brandName: "Resmi Marka Adı",
      brandDescription: "Marka Konumlandırma Özeti",
      communicationTone: "Varsayılan İletişim Tonu",
      preferredLanguage: "Varsayılan İçerik Üretim Dili",
      targetAudienceSummary: "Hedef Kitle Özeti",
      keyValueProposition: "Temel Değer Önerisi",
      brandGuidelines: "Editoryal ve Görsel Marka İlkeleri",
      lastSynchronized: "Son API senkronizasyonu:",
      syncBadge: "Sunucu ile Senkronize",
      discardConfirm:
        "Kaydedilmemiş değişiklikler iptal edilip sunucu değerleri geri yüklensin mi?",
      reloadFromServer: "API'den Yeniden Yükle",
    },
    dashboard: {
      welcomePrefix: "Akıllı Pazarlama Çalışma Alanı",
      workspaceSubtitle:
        "Marka kimliğinizi, ürün kataloğunuzu, yapay zeka içerik stüdyonuzu ve sosyal medya yayın sürecinizi yönetin.",
      journeyTitle: "Temel Pazarlama İş Akışı Yolculuğu",
      journeySubtitle:
        "Şirket kurulumundan SWOT analizine kadar uçtan uca sosyal medya pazarlama yaşam döngünüz.",
      r1CompletedTitle: "Sürüm R1 — Uygulama Temeli & Kurulum (8/8 Hikaye Tamamlandı)",
      r1CompletedSubtitle:
        "Aşağıdaki tüm R1 ekranlarını inceleyip test edebilir veya üst çubuktan dil (EN / TR / AR) ve rol değiştirebilirsiniz.",
      openScreen: "Ekranı Aç",
      quickActionsTitle: "Aktif Şirket & Marka Özeti",
      companyReadinessTitle: "Marka Profili Senkronize",
      brandToneLabel: "İletişim Tonu",
      contentLangLabel: "İçerik Dili",
      industryLabel: "Faaliyet Sektörü",
      regionLabel: "Coğrafi Bölge",
      roadmapTitle: "Aşamalı Sürüm Yol Haritası (R1 → R7)",
      roadmapSubtitle:
        "3 Epik ve 22 Jira Ön Uç Hikayesi üzerinden yapılandırılmış uygulama planı.",
    },
    designSystem: {
      title: "Liquid Glass Duyarlı Tasarım Sistemi (WEB-01-08)",
      subtitle:
        "Renk jetonları, yarı saydam cam yüzeyler, erişilebilir odak durumları, düğmeler, form elemanları, pencereler ve durum rozetlerinin etkileşimli vitrini.",
      colorsTitle: "1. Semantik ve Atmosferik Renk Jetonları",
      buttonsTitle: "2. Etkileşimli Düğme Durumları ve Mikro Animasyonlar",
      inputsTitle: "3. Form Kontrolleri, Doğrulama ve Erişilebilir Odak",
      statesTitle: "4. İskelet Yükleyiciler, Boş Durumlar ve Hata Kurtarma",
      badgesTitle: "5. Semantik Durum ve Sürüm Rozetleri",
      modalsTitle: "6. Erişilebilir Liquid Glass Diyalog Pencereleri",
      openDemoModal: "Etkileşimli Cam Pencereyi Aç",
      focusAccessibilityNote:
        "Klavye Erişilebilirliği Hazır: Yüksek kontrastlı odak halkalarını ve hareket azaltma uyumluluğunu test etmek için Tab tuşunu kullanın.",
    },
    products: {
      title: "Ürünler & Medya Yönetimi",
      subtitle:
        "Ürün kataloğunuzu, medya varlıklarınızı, fiyatlandırmanızı ve kampanya bağlantılarınızı yetkili API izolasyonu ile yönetin.",
      addProduct: "Yeni Ürün Ekle",
      editProduct: "Ürünü Düzenle",
      deleteProduct: "Ürünü Sil",
      productDetails: "Ürün Detayları",
      searchPlaceholder: "Ürün adı veya kategoriye göre ara...",
      filterAll: "Tüm Durumlar",
      filterActive: "Aktif",
      filterDraft: "Taslak",
      filterArchived: "Arşivlenmiş",
      categoryLabel: "Kategori",
      priceLabel: "Fiyat ($)",
      discountLabel: "İndirim (%)",
      purchaseUrlLabel: "Satın Alma / Ürün Bağlantısı",
      statusLabel: "Ürün Durumu",
      nameLabel: "Ürün Adı",
      descriptionLabel: "Ürün Açıklaması",
      mediaManagement: "Medya ve Ürün Görselleri (WEB-02-02)",
      uploadAreaTitle: "Görselleri sürükleyip bırakın veya seçmek için tıklayın",
      uploadAreaDesc: "PNG, JPG, WebP desteklenir (Maks 5MB). Sıralama, sosyal medya kaydırmalı gönderi sırasını belirler.",
      primaryBadge: "Kapak Görseli",
      setPrimary: "Kapak Yap",
      moveUp: "Öne Taşı",
      moveDown: "Arkaya Taşı",
      removeMedia: "Görseli Kaldır",
      noProductsFound: "Ürün bulunamadı",
      emptyStateDesc: "Arama veya filtre kriterlerinize uyan ürün bulunamadı. Filtreleri temizleyebilir veya yeni ürün ekleyebilirsiniz.",
      simulateUploadError: "Yükleme reddi simülasyonu (Dosya boyutu / format hatası testi)",
      fileTooLarge: "Dosya boyutu BE-03-05 sözleşmesi ile belirlenen 5MB sınırını aşıyor.",
      invalidFileType: "Geçersiz dosya biçimi. Yalnızca JPEG, PNG ve WebP kabul edilir.",
      cardView: "Kart Görünümü",
      tableView: "Tablo Görünümü",
      confirmDelete: "Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
      productSaved: "Ürün arka uç API'si ile başarıyla senkronize edildi.",
      productDeleted: "Ürün katalogdan kaldırıldı.",
      allCategories: "Tüm Kategoriler",
    },
    campaigns: {
      title: "Pazarlama Kampanyaları",
      subtitle:
        "Tarih doğrulaması ve ürün eşleştirmesi ile Instagram Professional ve Facebook Sayfaları için hedef odaklı kampanyalar oluşturun.",
      createCampaign: "Yeni Kampanya Oluştur",
      createWizardTitle: "Kampanya Oluşturma Sihirbazı (WEB-02-03)",
      createWizardSubtitle:
        "Hedef tanımları, tarih kuralları ve ürün seçimi ile adım adım rehberli kampanya kurulumu.",
      editCampaign: "Kampanya Detaylarını Düzenle",
      campaignDetails: "Kampanya Özeti & Performans Bağlamı",
      searchPlaceholder: "Başlık, hedef veya kitleye göre ara...",
      filterAllObjectives: "Tüm Hedefler",
      filterSales: "Satışları Artırma",
      filterEngagement: "Etkileşimi Artırma",
      filterAwareness: "Marka Bilinirliği",
      filterAllStatus: "Tüm Durumlar",
      filterDraft: "Taslak",
      filterActive: "Aktif",
      filterPaused: "Duraklatıldı",
      filterCompleted: "Tamamlandı",
      nameLabel: "Kampanya Adı",
      objectiveLabel: "Kampanya Amacı / Hedefi",
      statusLabel: "Kampanya Durumu",
      targetProductsLabel: "İlişkili Ürünler",
      selectProductsDesc: "YZ tarafından üretilecek sosyal medya gönderilerinde öne çıkarılacak ürünleri seçin.",
      targetAudienceLabel: "Hedef Kitle Tanımı",
      platformsLabel: "Yayın Platformları (MVP: Instagram & Facebook)",
      startDateLabel: "Başlangıç Tarihi",
      endDateLabel: "Bitiş Tarihi",
      toneLabel: "İletişim Tonu",
      languageLabel: "İçerik Dili",
      frequencyLabel: "Planlanan Gönderi Sıklığı",
      budgetNotesLabel: "Bütçe / Stratejik Notlar",
      step1BasicInfo: "1. Temel Hedef & Kapsam",
      step2ProductsPlatforms: "2. Ürünler & Platformlar",
      step3ScheduleVoice: "3. Zamanlama & Ses Tonu",
      step4ReviewLaunch: "4. İnceleme & Başlatma",
      dateValidationErr: "Bitiş tarihi başlangıç tarihinden önce olamaz.",
      productRequiredErr: "Lütfen bu kampanya için en az bir ürün seçin.",
      platformRequiredErr: "Lütfen en az bir hedef sosyal platform seçin.",
      noCampaignsFound: "Pazarlama kampanyası bulunamadı",
      emptyStateDesc:
        "Arama veya filtre kriterlerinize uyan kampanya yok. YZ ile içerik üretimine başlamak için ilk kampanyanızı oluşturun.",
      saveAsDraft: "Taslak Olarak Kaydet",
      launchCampaign: "Kampanyayı Başlat",
      pauseCampaign: "Kampanyayı Duraklat",
      resumeCampaign: "Kampanyayı Sürdür",
      deleteCampaign: "Kampanyayı Sil",
      confirmDelete:
        "Bu kampanyayı silmek istediğinizden emin misiniz? İlişkili tüm taslaklar silinecektir.",
      campaignSaved: "Kampanya arka uç API'si ile başarıyla senkronize edildi.",
      campaignDeleted: "Kampanya sistemden kaldırıldı.",
      launchInStudioBtn: "YZ İçerik Stüdyosunda Aç",
      dateRangeLabel: "Yayın Süresi",
      associatedProductsCount: "Bağlı Ürünler",
      editRestrictedNotice:
        "Tamamlanmış kampanyalar, geçmiş analitik bütünlüğünü korumak için kilitlenmiştir.",
    },
    studio: {
      title: "YZ İçerik Stüdyosu",
      subtitle:
        "Eşzamansız iş durumları ile çoklu varyasyonlu pazarlama metinleri, etiketler ve görsel fikirler üretin.",
      campaignContext: "Kampanya Strateji Bağlamı",
      productContext: "Öne Çıkarılan Ürün",
      platformSelect: "Hedef Yayın Platformu",
      languageSelect: "İçerik Dili",
      toneSelect: "İletişim Tonu",
      customPromptLabel: "Yaratıcı Yönlendirme / Anahtar Kelimeler (İsteğe Bağlı)",
      generateBtn: "3 YZ Varyasyonu Üret",
      generatingBtn: "YZ Varyasyonları Sentezleniyor...",
      idleStateTitle: "Kampanya İçeriği Üretmeye Hazır",
      idleStateDesc:
        "Kampanya bağlamınızı seçin ve yüksek dönüşümlü sosyal medya metinleri üretmek için Üret'e tıklayın.",
      queuedState: "İşlem YZ Kuyruğuna Eklendi...",
      processingState: "Yapay Zeka Modeli Yapılandırılmış Varyasyonları Oluşturuyor...",
      variantsTitle: "Üretilen İçerik Varyasyonları",
      variantSelectedBadge: "Aktif Seçilen Varyasyon",
      previewInstagram: "Canlı Instagram Önizlemesi",
      previewFacebook: "Canlı Facebook Sayfası Önizlemesi",
      sendToEditorBtn: "Gönderi Düzenleyicisine Gönder",
      sendToApprovalBtn: "İnsan Onayına Gönder",
      simulateFailureLabel: "YZ API hız sınırı / hata testi simülasyonu (AI-02-06)",
      generationFailedTitle: "YZ İçerik Üretimi Başarısız Oldu",
      retryGenerationBtn: "Yeniden Dene",
      captionLabel: "Gönderi Metni",
      hashtagsLabel: "Stratejik Etiketler",
      ctaLabel: "Eyleme Çağrı (CTA)",
      visualIdeaLabel: "Görsel Kurgu & Fotoğraf Fikri",
      publishingTimeLabel: "Önerilen Yayın Saati",
    },
    posts: {
      title: "Gönderiler & Onay Masası",
      subtitle:
        "Gönderi metinlerini düzenleyin, sürüm geçmişini inceleyin ve yayınlama öncesi insan onay adımlarını yönetin.",
      createPost: "Yeni Gönderi Taslağı",
      editPost: "Gönderi İçeriğini Düzenle",
      versionHistory: "Sürüm Geçmişi",
      versionsTitle: "İçerik Revizyon Günlüğü",
      currentVersionBadge: "Mevcut Yayındaki Sürüm",
      revertToVersion: "Bu Sürüme Geri Dön",
      revertConfirm: "Mevcut taslak şu revizyona döndürülsün mü: #",
      aiGeneratedTag: "YZ Üretimi",
      manualEditTag: "Manuel Düzenleme",
      approvalStatus: "İnceleme & Onay Durumu",
      pendingReview: "İnsan Onayı Bekliyor",
      approved: "Yayınlanmak Üzere Onaylandı",
      rejected: "Revizyon İstendi",
      draft: "Çalışma Taslağı",
      scheduled: "Takvime Planlandı",
      published: "Canlı & Yayınlandı",
      approveAction: "Gönderiyi Onayla",
      rejectAction: "Revizyon İste / Reddet",
      rejectionReasonLabel: "Reddetme Gerekçesi",
      rejectionReasonPlaceholder: "Onay öncesi nelerin düzeltilmesi gerektiğini açıklayın...",
      readinessChecklist: "Yayınlanma Hazırlık Kontrol Listesi",
      readinessCaption: "Metin uzunluğu kontrol edildi",
      readinessHashtags: "Etiketler yapılandırıldı",
      readinessCta: "Belirgin Eyleme Çağrı (CTA) mevcut",
      readinessMedia: "Yüksek çözünürlüklü görsel bağlandı",
      notReadyNotice:
        "Eksik gönderiler onaylanamaz. Lütfen tüm hazırlık gereksinimlerini karşılayın.",
      approvedNotice:
        "Gönderi onaylandı. Artık R5 sürümünde takvime planlanmaya uygundur.",
      filterAll: "Tüm Gönderiler",
      searchPlaceholder: "Başlık, metin veya kampanyaya göre ara...",
      noPostsFound: "Pazarlama gönderisi bulunamadı",
      emptyPostsDesc:
        "Filtrelerinize uyan gönderi yok. İlk taslağınızı oluşturmak için YZ İçerik Stüdyosunu kullanın.",
      postSaved: "Gönderi ve yeni sürüm başarıyla kaydedildi.",
      postApprovedMsg: "Gönderi yayın için açıkça onaylandı.",
      postRejectedMsg: "Gönderi reddedildi ve revizyon geri bildirimi iletildi.",
    },
    integrations: {
      title: "Sosyal Medya Hesap Bağlantıları",
      subtitle:
        "Otomatik yayınlama ve canlı performans takibi için Meta kurumsal kanallarınızı bağlayın.",
      connectInstagram: "Instagram Profesyonel Bağla",
      connectFacebook: "Facebook Sayfası Bağla",
      reconnect: "Erişim Belirtecini Yenile",
      disconnect: "Hesap Bağlantısını Kes",
      disconnectConfirm:
        "Bu hesabın bağlantısını kesmek istediğinizden emin misiniz? Bu kanal için otomatik planlama durdurulacaktır.",
      statusConnected: "Bağlı ve Etkin",
      statusDisconnected: "Bağlantı Kesildi",
      statusTokenExpired: "Belirteç Süresi Doldu — Yeniden Bağlanma Gerekli",
      followers: "Takipçi / Kitle",
      tokenExpiryNotice: "Meta belirteci geçerlilik sonu:",
      tokenExpiredAlert:
        "Erişim belirtecinin süresi doldu. Meta otomatik yayınlama için periyodik yeniden yetkilendirme gerektirir.",
      mvpLimitationTitle: "Desteklenen Kanallar (MVP Kapsamı)",
      mvpLimitationDesc:
        "Antigravity Akıllı Pazarlama Platformu şu anda yalnızca Instagram Profesyonel hesaplarını ve Facebook İşletme Sayfalarını desteklemektedir. Kişisel profiller, TikTok, X (Twitter), LinkedIn ve Pinterest MVP kapsamında hariç tutulmuştur.",
      connecting: "Meta OAuth Başlatılıyor...",
      reconnecting: "Belirteç Yenileniyor...",
      oauthModalTitle: "Meta Business Giriş Yönlendirmesi",
      oauthModalDesc:
        "Meta OAuth 2.0 PKCE protokolüyle güvenli bağlantı kuruluyor. İstemci tarayıcısına hiçbir belirteç veya gizli anahtar açığa çıkarılmaz.",
      accountHandle: "Kullanıcı Adı",
      externalId: "Meta Hesap Kimliği",
      connectedSince: "Bağlantı Tarihi",
      lastSynced: "Son Eşitleme",
      unsupportedNetworks:
        "Diğer ağlar (TikTok, X, LinkedIn) gelecekteki kurumsal sürümler için planlanmıştır.",
    },
    calendar: {
      title: "Yayın Takvimi ve Planlama",
      subtitle:
        "Zaman çizelgeniz genelinde otomatik çok platformlu sosyal medya yayınlarını planlayın, inceleyin ve izleyin.",
      schedulePostBtn: "Onaylı Gönderiyi Planla",
      monthView: "Aylık Görünüm",
      weekView: "Haftalık Görünüm",
      today: "Bugün",
      prev: "Önceki",
      next: "Sonraki",
      timezoneNotice:
        "Tüm zaman damgaları sunucu yetkili Europe/Istanbul (UTC+03:00) saat dilimindedir.",
      scheduledPostsCount: "Planlanmış",
      publishedPostsCount: "Yayınlanmış",
      failedPostsCount: "İnceleme Gerekli",
      scheduleModalTitle: "Yayın Zaman Dilimi Planla",
      selectApprovedPost: "Onaylanmış Gönderi Seçin",
      selectDateTime: "Yayın Tarihi ve Saati",
      minScheduleNotice:
        "Gönderiler en az 5 dakika sonrasına planlanmalıdır.",
      confirmSchedule: "Onayla ve Planla",
      cancelSchedule: "Planı İptal Et",
      cancelScheduleConfirm:
        "Planlanmış yayını iptal edip gönderiyi Onaylı taslak durumuna geri almak istiyor musunuz?",
      postDetailTitle: "Yayın Ayrıntı İnceleyicisi",
      publishingStatus: "Yayın Durumu",
      retryPublishing: "Şimdi Yeniden Yayınlamayı Dene",
      viewOnSocial: "Canlı Gönderiyi Görüntüle",
      failureReasonLabel: "Yayın Hatası Tanısı",
      noApprovedPostsToSchedule:
        "Planlanacak onaylı gönderi yok. Önce Gönderiler ve Onay ekranında bir gönderiyi onaylayın.",
      emptyDay: "Bu gün için planlanmış gönderi bulunmamaktadır.",
      publishNow: "Hemen Yayınla",
    },
    analytics: {
      title: "Performans Analitiği",
      subtitle:
        "Gerçek zamanlı pazarlama metrikleri, kitle erişimi, etkileşim hızı ve dönüşüm telemetrisi.",
      reachVsImpressionsTitle: "Erişim ve Gösterim Ayrımı",
      reachVsImpressionsDesc:
        "Erişim içeriğinizi gören tekil hesapları temsil ederken, Gösterim içeriğinizin toplam görüntülenme sayısını ölçer.",
      reachLabel: "Kitle Erişimi",
      impressionsLabel: "Toplam Gösterim",
      engagementRateLabel: "Ort. Etkileşim Oranı",
      likesLabel: "Toplam Beğeni",
      commentsLabel: "Yorumlar",
      sharesLabel: "Paylaşımlar",
      savesLabel: "Kaydetmeler",
      linkClicksLabel: "Web Sitesi Tıklamaları",
      ctrLabel: "Tıklama Oranı (CTR)",
      performanceTrends: "Kitle ve Gösterim Eğilimleri",
      platformComparison: "Platform Performans Dağılımı",
      range7d: "7 Gün",
      range14d: "14 Gün",
      range30d: "30 Gün",
      range90d: "90 Gün",
      telemetrySyncNotice: "Meta Telemetrisi Eşitlendi:",
      refreshMetrics: "Metrikleri Güncelle",
    },
    reports: {
      title: "SWOT Zekası ve Strateji",
      subtitle:
        "Veriye dayalı güçlü ve zayıf yönler, fırsatlar, tehditler ve önceliklendirilmiş YZ pazarlama direktifleri.",
      swotTitle: "Kanıta Dayalı SWOT Matrisi",
      swotSubtitle:
        "Her güçlü yön, zayıflık, fırsat ve tehdit gözlemlenen yayın verileriyle somutlaştırılmıştır.",
      strengths: "Güçlü Yönler",
      weaknesses: "Zayıf Yönler",
      opportunities: "Fırsatlar",
      threats: "Tehditler",
      recommendationsTitle: "Önceliklendirilmiş Stratejik Direktifler",
      recommendationsSubtitle:
        "Tahmini dönüşüm etkisiyle YZ pazarlama motoru tarafından sentezlenen uygulanabilir öneriler.",
      highPriority: "Yüksek Öncelik",
      mediumPriority: "Orta Öncelik",
      lowPriority: "Düşük Öncelik",
      expectedImpactLabel: "Beklenen Etki",
      actionItemLabel: "Önerilen Eylem",
      numericalEvidenceLabel: "Gözlemlenen Veri Kanıtı",
      insufficientDataTitle: "Yetersiz Geçmiş Performans Verisi",
      insufficientDataDesc:
        "Kanıta dayalı SWOT analizi, kitle telemetrisi toplanmış en az 3 yayınlanmış gönderi gerektirir. Tam zeka raporu oluşturmak için sosyal hesapları bağlayıp kampanyaları yayınlayın.",
      insufficientToggle: "Yetersiz Veri Durumunu Simüle Et",
      sufficientToggle: "Tam Kanıt Matrisini Görüntüle",
      regenerateReport: "Yeni Rapor Sentezle",
      regenerating: "YZ Matrisi Sentezleniyor...",
      applyToCampaign: "Direktiften Kampanya Başlat",
    },
    admin: {
      title: "Sistem Yönetimi ve Altyapı",
      subtitle:
        "Genel çok kiracılı izleme, yayın kuyruğu telemetrisi ve hassas altyapı operasyonları.",
      accessRestrictedTitle: "Sistem Yöneticisi Erişimi Gerekli",
      accessRestrictedDesc:
        "Bu konsol yalnızca SYSTEM_ADMIN rolüne sahip kullanıcılarla sınırlıdır. Bu ekranı test etmek için üst başlıktaki demo rol değiştiriciyi kullanabilirsiniz.",
      totalTenants: "Kayıtlı Kiracılar",
      activeTenants: "Etkin Çalışma Alanları",
      queuedJobs: "Kuyruktaki Yayın İşleri",
      aiTokens: "YZ Çıkarım Jetonları",
      platformHealth: "Altyapı Sağlığı",
      metaApi: "Meta Graph API Durumu",
      aiWorker: "YZ Çıkarım Çalışanı",
      dbLatency: "Veritabanı Kümesi Gecikmesi",
      tenantsTableTitle: "Platform Kiracıları ve Çalışma Alanları",
      tenantsTableSubtitle:
        "İşletme çalışma alanlarını yönetin, abonelik katmanlarını inceleyin ve operasyonel durumu kontrol edin.",
      tenantName: "Kiracı / Şirket",
      owner: "Hesap Sahibi",
      plan: "Abonelik Katmanı",
      status: "Kiracı Durumu",
      productsCount: "Ürünler",
      campaignsCount: "Kampanyalar",
      actions: "Yönetim Eylemleri",
      suspendTenant: "Kiracıyı Askıya Al",
      reactivateTenant: "Kiracıyı Yeniden Etkinleştir",
      suspendConfirmTitle: "Kiracı Askıya Alma Onayı",
      suspendConfirmDesc:
        "Bu çalışma alanını askıya almak istediğinizden emin misiniz? Bu kiracı için tüm otomatik yayınlama ve YZ üretimi derhal kilitlenecektir.",
      purgeQueue: "Tıkalı Kuyrukları Temizle",
      purgeConfirmTitle: "Yayın Kuyruğunu Temizle",
      purgeConfirmDesc:
        "Bu işlem tüm kiracılardaki bekleyen arka plan yayın işlerini kuyruktan çıkaracaktır.",
      flushCache: "YZ Önbelleğini Boşalt",
      flushConfirmTitle: "Yapay Zeka Önbelleğini Temizle",
      flushConfirmDesc:
        "Bu işlem çalışan belleğindeki vektör gömmelerini ve önbelleğe alınmış şablonları temizleyecektir.",
    },
    notifications: {
      title: "Bildirim Merkezi",
      subtitle:
        "Kiracı yalıtımlı uyarılar, otomatik yayın durumları, güvenlik olayları ve YZ üretim bildirimleri.",
      markAllRead: "Tümünü Okundu İşaretle",
      filterAll: "Tüm Uyarılar",
      filterPublishing: "Yayınlama",
      filterAi: "YZ İçeriği",
      filterSecurity: "Güvenlik",
      filterSystem: "Sistem Güncellemeleri",
      noNotifications: "Bildirim bulunamadı",
      emptyDesc: "Bu kategoride okunmamış uyarınız bulunmamaktadır.",
      viewAction: "Ayrıntıları Görüntüle",
      delete: "Uyarıyı Kaldır",
    },
    settings: {
      title: "Hesap ve Çalışma Alanı Ayarları",
      subtitle:
        "Yönetici profilinizi, güvenlik kimlik bilgilerinizi ve platform yerelleştirme tercihlerinizi yönetin.",
      profileSection: "Kullanıcı Profil Bilgileri",
      securitySection: "Güvenlik ve Şifre Yönetimi",
      fullName: "Ad Soyad",
      email: "İş E-posta Adresi",
      preferredLang: "Arayüz Dili Tercihi",
      currentPassword: "Mevcut Şifre",
      newPassword: "Yeni Güvenli Şifre",
      confirmNewPassword: "Yeni Şifreyi Onayla",
      updateProfileBtn: "Profili Güncelle",
      changePasswordBtn: "Şifreyi Değiştir",
      profileUpdated: "Profil başarıyla güncellendi.",
      passwordChanged: "Şifre başarıyla güncellendi.",
    },
    validation: {
      emailRequired: "E-posta adresi zorunludur.",
      emailInvalid: "Lütfen geçerli bir kurumsal e-posta adresi girin.",
      passwordRequired: "Şifre zorunludur.",
      passwordWeak:
        "Şifre en az 8 karakter olmalı ve büyük harf, rakam ve özel karakter içermelidir.",
      passwordsMismatch: "Şifre onayı eşleşmiyor.",
      fullNameRequired: "Ad soyad alanı zorunludur.",
      companyNameRequired: "Şirket adı zorunludur.",
      industryRequired: "Faaliyet sektörü zorunludur.",
      descriptionMin: "Lütfen şirketinizi anlatan en az 20 karakterlik bir açıklama girin.",
      targetAudienceRequired: "Hedef kitle açıklaması zorunludur.",
      countryRequired: "Ülke veya coğrafi bölge zorunludur.",
      brandInfoRequired: "İlgili marka bilgileri zorunludur.",
    },
  },
  ar: {
    meta: {
      appName: "SMART MARKETING",
      appTagline: "منصة التسويق الذكي عبر وسائل التواصل الاجتماعي بالذكاء الاصطناعي",
      direction: "rtl",
      languageLabel: "العربية",
      simulatedBanner:
        "محول واجهة برمجة تطبيقات تجريبي (/api/v1) — بيانات محاكاة للتطوير فقط. لا يوجد اتصال مباشر بقاعدة بيانات أو رموز منصات حقيقية.",
      liveModeBanner: "متصل بواجهة NestJS الخلفية (/api/v1)",
    },
    nav: {
      workspaceGroup: "مساحة العمل والهوية",
      publishingGroup: "الحملات واستوديو الذكاء",
      intelligenceGroup: "التحليلات والاستراتيجية",
      systemGroup: "الإدارة والإعدادات",
      dashboard: "مركز القيادة التسويقي",
      onboarding: "إعداد الشركة",
      brandSettings: "هوية العلامة التجارية",
      products: "كتالوج المنتجات",
      campaigns: "الحملات التسويقية",
      contentStudio: "استوديو الذكاء الاصطناعي",
      posts: "المراجعة والاعتماد",
      calendar: "تقويم النشر",
      integrations: "القنوات الاجتماعية",
      analytics: "تحليلات الأداء",
      reports: "تقارير SWOT الذكية",
      notifications: "مركز الإشعارات",
      accountSettings: "إعدادات الحساب",
      designSystem: "نظام التصميم",
      admin: "إدارة النظام",
      logout: "تسجيل الخروج",
      collapseSidebar: "طي القائمة الجانبية",
      expandSidebar: "توسيع القائمة الجانبية",
      switchRole: "الدور النشط",
      simulateExpiry: "اختبار انتهاء الجلسة",
      roleOwner: "مالك الشركة",
      roleAdmin: "مدير النظام",
    },
    common: {
      save: "حفظ التغييرات",
      saving: "جارٍ الحفظ عبر API...",
      cancel: "إلغاء",
      reset: "إعادة تعيين",
      back: "السابق",
      next: "متابعة",
      finish: "إكمال الإعداد",
      retry: "إعادة المحاولة",
      loading: "جارٍ التحميل من /api/v1...",
      requiredField: "مطلوب",
      unsavedChanges: "لديك تغييرات غير محفوظة",
      savedSuccessfully: "تمت المزامنة مع الواجهة الخلفية بنجاح.",
      errorOccurred: "تعذر إتمام الطلب",
      confirmAction: "تأكيد الإجراء",
      close: "إغلاق",
      searchPlaceholder: "ابحث في مساحة العمل...",
      statusCompleted: "مكتمل (R1)",
      statusScheduled: "إصدار مجدول",
      releaseBadge: "الإصدار",
      externalDeps: "متطلبات الواجهة الخلفية",
    },
    auth: {
      loginTitle: "مرحباً بعودتك إلى استوديو التسويق الذكي",
      loginSubtitle:
        "سجّل الدخول لإدارة هوية علامتك التجارية وحملات الذكاء الاصطناعي وجدولة النشر.",
      registerTitle: "إنشاء مساحة عمل لشركتك",
      registerSubtitle:
        "ابدأ بإعداد مساحة عمل تسويقية ذكية مصممة خصيصاً للشركات الصغيرة والمتوسطة.",
      emailLabel: "البريد الإلكتروني للعمل",
      emailPlaceholder: "founder@company.com",
      passwordLabel: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      confirmPasswordLabel: "تأكيد كلمة المرور الجديدة",
      fullNameLabel: "الاسم الكامل",
      fullNamePlaceholder: "أحمد المنصور",
      companyNameLabel: "اسم الشركة",
      companyNamePlaceholder: "دار القهوة المختصة",
      signInBtn: "تسجيل الدخول إلى المنصة",
      signingInBtn: "جارٍ التحقق...",
      createAccountBtn: "إنشاء حساب الشركة",
      creatingAccountBtn: "جارٍ تهيئة مساحة العمل...",
      forgotPasswordLink: "نسيت كلمة المرور؟",
      noAccountText: "جديد في منصة التسويق الذكي؟",
      haveAccountText: "لديك حساب بالفعل؟",
      demoCredentialsHint: "وصول فوري لحسابات العرض التجريبية:",
      fillOwnerDemo: "حساب مالك شركة",
      fillAdminDemo: "حساب مدير النظام",
      showPassword: "إظهار كلمة المرور",
      hidePassword: "إخفاء كلمة المرور",
      passwordRulesTitle: "متطلبات أمان كلمة المرور:",
      ruleMinLength: "8 أحرف على الأقل",
      ruleUppercase: "حرف كبير واحد على الأقل (A–Z)",
      ruleNumber: "رقم واحد على الأقل (0–9)",
      ruleSpecial: "رمز خاص واحد على الأقل (!@#$%)",
      verifyEmailTitle: "تأكيد البريد الإلكتروني",
      verifyEmailSubtitle:
        "جارٍ التحقق من رمز التفعيل عبر خدمة المصادقة (/api/v1/auth/verify-email).",
      verifyValidBtn: "محاكاة رمز صالح",
      verifyExpiredBtn: "محاكاة رمز منتهي الصلاحية",
      verifySuccessTitle: "تم تأكيد البريد الإلكتروني بنجاح",
      verifySuccessDesc:
        "تم توثيق بريد شركتك الإلكتروني. يمكنك الآن الانتقال إلى معالج إعداد الشركة.",
      verifyExpiredTitle: "انتهت صلاحية رابط التفعيل",
      verifyExpiredDesc:
        "انتهت صلاحية رمز التفعيل هذا أو تم استخدامه مسبقاً. يمكنك طلب رابط جديد أدناه.",
      resendVerificationBtn: "إعادة إرسال بريد التفعيل",
      resendSuccessMsg: "تم إرسال رابط تفعيل جديد إلى بريدك الإلكتروني.",
      forgotPasswordTitle: "استعادة كلمة المرور",
      forgotPasswordSubtitle:
        "أدخل بريد العمل المسجل وسنرسل لك رابطاً زمنياً لإعادة تعيين كلمة المرور.",
      sendResetLinkBtn: "إرسال رابط الاستعادة",
      resetLinkSentTitle: "تحقق من بريدك الوارد",
      resetLinkSentDesc:
        "إذا كان هناك حساب مرتبط بهذا البريد، فقد تم إرسال رابط إعادة التعيين.",
      resetPasswordTitle: "تعيين كلمة مرور جديدة",
      resetPasswordSubtitle: "أنشئ كلمة مرور قوية تستوفي معايير أمان المنصة.",
      updatePasswordBtn: "تحديث كلمة المرور",
      passwordUpdatedTitle: "تم تحديث كلمة المرور بنجاح",
      passwordUpdatedDesc:
        "تم تحديث بيانات الاعتماد الخاصة بك. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.",
      proceedToWorkspace: "المتابعة إلى إعداد الشركة",
      backToLogin: "العودة لتسجيل الدخول",
      sessionExpiredTitle: "انتهت صلاحية الجلسة",
      sessionExpiredDesc:
        "حفاظاً على أمان شركتك، انتهت صلاحية رمز الجلسة. يرجى تسجيل الدخول مجدداً للمتابعة دون فقدان عملك المحفوظ.",
      reauthenticateBtn: "تسجيل الدخول مجدداً",
      unauthorizedTitle: "منطقة إدارة نظام مقيدة",
      unauthorizedDesc:
        "دور حسابك الحالي (COMPANY_OWNER) غير مخول للوصول إلى لوحة إدارة النظام (WEB-03-06). تطبق الواجهة الخلفية (BE-01-06) عزل الصلاحيات.",
      returnToDashboardBtn: "العودة إلى لوحة مساحة العمل",
    },
    onboarding: {
      title: "معالج إعداد الشركة",
      subtitle:
        "اضبط ملف شركتك ونبرة علامتك التجارية ليتوافق توليد المحتوى بالذكاء الاصطناعي مع هوية أعمالك.",
      step1Title: "1. هوية الشركة",
      step1Desc: "الاسم الرسمي للشركة، قطاع الأعمال، والوصف التعريفي.",
      step2Title: "2. الجمهور والسوق",
      step2Desc: "حدد شريحة العملاء المستهدفة والمنطقة الجغرافية.",
      step3Title: "3. النبرة واللغة",
      step3Desc: "اختر لغة المحتوى المفضلة ونبرة تواصل العلامة التجارية.",
      step4Title: "4. ركائز العلامة والمراجعة",
      step4Desc: "أضف معلومات العلامة التجارية الأساسية وأكمل إعداد مساحة العمل.",
      companyName: "اسم الشركة",
      industry: "قطاع الأعمال / الصناعة",
      industryPlaceholder: "مثال: القهوة المختصة والمخبوزات الحرفية",
      description: "وصف الشركة",
      descriptionPlaceholder:
        "اشرح منتجاتك، رسالتك، وما يميز شركتك في السوق...",
      targetAudience: "الجمهور المستهدف",
      targetAudiencePlaceholder:
        "مثال: المهنيون الشباب بين 24–45 عاماً المهتمون بالقهوة العضوية المختصة...",
      countryRegion: "الدولة أو المنطقة الجغرافية",
      countryRegionPlaceholder: "مثال: تركيا — إسطنبول والشرق الأوسط",
      preferredLanguage: "لغة المحتوى المفضلة",
      communicationTone: "نبرة تواصل العلامة التجارية",
      brandInformation: "معلومات وركائز العلامة التجارية",
      brandInformationPlaceholder:
        "القيم الأساسية للعلامة، العبارات المفضلة، والوعد المقدم للعميل...",
      simulateSaveErrorLabel:
        "محاكاة خطأ اتصال مؤقت للتحقق من حفظ المسودة تلقائياً وعدم ضياع المدخلات (WEB-01-06)",
      draftProtectedNotice:
        "حماية المسودة نشطة: يتم الاحتفاظ بمدخلاتك بأمان في حال حدوث خطأ في الشبكة أو الخادم أثناء الحفظ.",
      completeOnboardingBtn: "حفظ وإكمال الإعداد",
      onboardingSuccessMsg:
        "تم حفظ بيانات إعداد الشركة بنجاح في /api/v1/company/onboarding.",
      tones: {
        PROFESSIONAL: "احترافية وموثوقة",
        FRIENDLY: "ودودة وقريبة من الجمهور",
        LUXURY: "فاخرة وراقية",
        BOLD: "جريئة وحيوية وعصرية",
        EDUCATIONAL: "تثقيفية ومبنية على المعرفة",
      },
      languages: {
        en: "الإنجليزية (EN)",
        tr: "التركية (TR)",
        ar: "العربية (AR)",
      },
    },
    brand: {
      title: "إعدادات العلامة التجارية ونبرة التواصل",
      subtitle:
        "متزامن مع /api/v1/company/brand (WEB-01-07). توجه هذه الإعدادات توليد الحملات والمنشورات بالذكاء الاصطناعي.",
      brandName: "الاسم الرسمي للعلامة التجارية",
      brandDescription: "بيان تموضع العلامة التجارية",
      communicationTone: "نبرة التواصل الافتراضية",
      preferredLanguage: "اللغة الافتراضية لتوليد المحتوى",
      targetAudienceSummary: "ملخص الجمهور المستهدف",
      keyValueProposition: "القيمة التنافسية الأساسية",
      brandGuidelines: "إرشادات الهوية التحريرية والبصرية",
      lastSynchronized: "آخر مزامنة مع الخادم:",
      syncBadge: "متزامن مع الواجهة الخلفية",
      discardConfirm: "هل تريد تجاهل التعديلات غير المحفوظة واستعادة قيم الخادم؟",
      reloadFromServer: "إعادة التحميل من API",
    },
    dashboard: {
      welcomePrefix: "مساحة العمل التسويقية الذكية",
      workspaceSubtitle:
        "أدر هوية علامتك التجارية، كتالوج المنتجات، استوديو الذكاء الاصطناعي، وجدولة النشر.",
      journeyTitle: "مسار رحلة التسويق الذكي المتكاملة",
      journeySubtitle:
        "دورة العمل الكاملة من تسجيل الشركة وإعداد العلامة حتى تحليلات الأداء وتقارير SWOT.",
      r1CompletedTitle: "الإصدار R1 — تأسيس التطبيق والإعداد (8/8 قصص مكتملة)",
      r1CompletedSubtitle:
        "استعرض واختبر جميع شاشات R1 أدناه، أو بدّل اللغة (EN / TR / AR) والدور من الشريط العلوي.",
      openScreen: "فتح الشاشة",
      quickActionsTitle: "ملخص الشركة والعلامة التجارية النشطة",
      companyReadinessTitle: "ملف العلامة التجارية متزامن",
      brandToneLabel: "نبرة التواصل",
      contentLangLabel: "لغة المحتوى",
      industryLabel: "قطاع الأعمال",
      regionLabel: "المنطقة الجغرافية",
      roadmapTitle: "خارطة طريق الإصدارات المرحلية (R1 → R7)",
      roadmapSubtitle:
        "تنفيذ مرحلي منظم يشمل 3 ملاحم (Epics) و22 قصة مستخدم في Jira.",
    },
    designSystem: {
      title: "نظام التصميم المتجاوب Liquid Glass (WEB-01-08)",
      subtitle:
        "عرض تفاعلي لرموز الألوان، الأسطح الزجاجية، حالات التركيز، الأزرار، الحقول، النوافذ المنبثقة، والشارات.",
      colorsTitle: "1. رموز الألوان الأساسية والدلالية",
      buttonsTitle: "2. حالات الأزرار والتفاعلات الدقيقة",
      inputsTitle: "3. حقول الإدخال والتحقق وحالات التركيز للوصول",
      statesTitle: "4. هياكل التحميل والحالات الفارغة ومعالجة الأخطاء",
      badgesTitle: "5. شارات الحالة والإصدارات",
      modalsTitle: "6. النوافذ الزجاجية المنبثقة المتوافقة مع معايير الوصول",
      openDemoModal: "فتح نافذة Liquid Glass التفاعلية",
      focusAccessibilityNote:
        "دعم لوحة المفاتيح جاهز: اضغط Tab للتنقل بين العناصر والتحقق من وضوح حلقات التركيز ودعم تقليل الحركة.",
    },
    products: {
      title: "مساحة عمل المنتجات والوسائط",
      subtitle:
        "إدارة كتالوج المنتجات، الأصول المرئية، التسعير، وربطها بالحملات الإعلانية مع عزل صارم لبيانات الشركة.",
      addProduct: "إضافة منتج جديد",
      editProduct: "تعديل المنتج",
      deleteProduct: "حذف المنتج",
      productDetails: "تفاصيل المنتج",
      searchPlaceholder: "البحث باسم المنتج أو الفئة...",
      filterAll: "كافة الحالات",
      filterActive: "نشط",
      filterDraft: "مسودة",
      filterArchived: "مؤرشف",
      categoryLabel: "الفئة",
      priceLabel: "السعر ($)",
      discountLabel: "الخصم (%)",
      purchaseUrlLabel: "رابط الشراء / صفحة المنتج",
      statusLabel: "حالة المنتج",
      nameLabel: "اسم المنتج",
      descriptionLabel: "وصف المنتج",
      mediaManagement: "إدارة الوسائط والصور (WEB-02-02)",
      uploadAreaTitle: "اسحب وأفلت صور المنتج هنا، أو انقر للاختيار",
      uploadAreaDesc: "يدعم PNG, JPG, WebP بحجم أقصى 5 ميجابايت. يحدد الترتيب تسلسل العرض في منشورات إنستغرام وفيسبوك.",
      primaryBadge: "الصورة الرئيسية",
      setPrimary: "تعيين كرئيسية",
      moveUp: "تقديم للبداية",
      moveDown: "تأخير للنهاية",
      removeMedia: "حذف الصورة",
      noProductsFound: "لم يتم العثور على منتجات",
      emptyStateDesc: "لا توجد عناصر تطابق معايير البحث أو التصفية الحالية. يمكنك مسح التصفية أو إضافة منتج جديد.",
      simulateUploadError: "محاكاة رفض الرفع (اختبار فشل الحجم / التنسيق)",
      fileTooLarge: "يتجاوز حجم الملف الحد الأقصى المسموح به 5 ميجابايت وفق متطلبات BE-03-05.",
      invalidFileType: "تنسيق الملف غير مدعوم. يقبل النظام فقط JPEG, PNG, و WebP.",
      cardView: "عرض البطاقات",
      tableView: "عرض الجدول",
      confirmDelete: "هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.",
      productSaved: "تمت مزامنة المنتج مع الواجهة الخلفية بنجاح.",
      productDeleted: "تم حذف المنتج من كتالوج مساحة العمل.",
      allCategories: "كافة الفئات",
    },
    campaigns: {
      title: "مساحة عمل الحملات التسويقية",
      subtitle:
        "إدارة الحملات الموجهة نحو الأهداف على إنستغرام الاحترافي وصفحات فيسبوك مع التحقق من صحة التواريخ وربط المنتجات.",
      createCampaign: "إنشاء حملة جديدة",
      createWizardTitle: "معالج إنشاء الحملات (WEB-02-03)",
      createWizardSubtitle:
        "إعداد موجه خطوة بخطوة للحملة يشمل تحديد الأهداف، منطق التواريخ، واختيار المنتجات.",
      editCampaign: "تعديل تفاصيل الحملة",
      campaignDetails: "نظرة عامة على الحملة وسياق الأداء",
      searchPlaceholder: "البحث باسم الحملة، الهدف، أو الجمهور...",
      filterAllObjectives: "كافة الأهداف",
      filterSales: "زيادة المبيعات",
      filterEngagement: "رفع التفاعل",
      filterAwareness: "الوعي بالعلامة التجارية",
      filterAllStatus: "كافة الحالات",
      filterDraft: "مسودة",
      filterActive: "نشطة",
      filterPaused: "متوقفة مؤقتاً",
      filterCompleted: "مكتملة",
      nameLabel: "اسم الحملة",
      objectiveLabel: "هدف الحملة",
      statusLabel: "حالة الحملة",
      targetProductsLabel: "المنتجات المستهدفة",
      selectProductsDesc: "حدد المنتجات من الكتالوج لإبرازها في منشورات الذكاء الاصطناعي القادمة.",
      targetAudienceLabel: "تعريف الجمهور المستهدف",
      platformsLabel: "منصات النشر (نطاق MVP: إنستغرام وفيسبوك)",
      startDateLabel: "تاريخ البدء",
      endDateLabel: "تاريخ الانتهاء",
      toneLabel: "نبرة التواصل",
      languageLabel: "لغة المحتوى",
      frequencyLabel: "معدل النشر المخطط",
      budgetNotesLabel: "الميزانية / ملاحظات استراتيجية",
      step1BasicInfo: "1. الهدف الأساسي والنطاق",
      step2ProductsPlatforms: "2. المنتجات والمنصات",
      step3ScheduleVoice: "3. الجدولة ونبرة الصوت",
      step4ReviewLaunch: "4. المراجعة والإطلاق",
      dateValidationErr: "يجب أن يكون تاريخ الانتهاء في نفس يوم البدء أو بعده.",
      productRequiredErr: "يرجى اختيار منتج واحد على الأقل لهذه الحملة.",
      platformRequiredErr: "يرجى اختيار منصة تواصل اجتماعي واحدة على الأقل.",
      noCampaignsFound: "لم يتم العثور على حملات تسويقية",
      emptyStateDesc:
        "لا توجد حملات تطابق البحث أو التصفية الحالية. ابدأ بإنشاء حملتك الأولى لتوليد المحتوى بالذكاء الاصطناعي.",
      saveAsDraft: "حفظ كمسودة",
      launchCampaign: "إطلاق الحملة",
      pauseCampaign: "إيقاف مؤقت",
      resumeCampaign: "استئناف الحملة",
      deleteCampaign: "حذف الحملة",
      confirmDelete:
        "هل أنت متأكد من رغبتك في حذف هذه الحملة؟ سيتم فك ارتباط المسودات المرتبطة بها.",
      campaignSaved: "تمت مزامنة الحملة مع الواجهة الخلفية بنجاح.",
      campaignDeleted: "تم حذف الحملة من مساحة العمل.",
      launchInStudioBtn: "فتح في استوديو الذكاء الاصطناعي",
      dateRangeLabel: "فترة الحملة",
      associatedProductsCount: "المنتجات المرتبطة",
      editRestrictedNotice:
        "الحملات المكتملة مقفلة المعايير للحفاظ على مصداقية بيانات التحليلات التاريخية.",
    },
    studio: {
      title: "استوديو توليد المحتوى بالذكاء الاصطناعي",
      subtitle:
        "توليد نصوص تسويقية متعددة البدائل والوسوم ونداء العمل والأفكار البصرية مع حالات معالجة غير متزامنة.",
      campaignContext: "سياق الحملة التسويقية",
      productContext: "المنتج المستهدف",
      platformSelect: "منصة النشر المستهدفة",
      languageSelect: "لغة المحتوى",
      toneSelect: "نبرة الصوت والخطاب",
      customPromptLabel: "توجيه إبداعي / كلمات مفتاحية (اختياري)",
      generateBtn: "توليد 3 بدائل بالذكاء الاصطناعي",
      generatingBtn: "جاري صياغة البدائل الإبداعية...",
      idleStateTitle: "جاهز لتوليد محتوى الحملة",
      idleStateDesc:
        "اختر سياق الحملة والمنتج وانقر على توليد لإنشاء نصوص تسويقية ذات معدل تحويل مرتفع.",
      queuedState: "تم إدراج المهمة في قائمة انتظار معالج الذكاء الاصطناعي...",
      processingState: "النموذج اللغوي يقوم بصياغة البدائل المنظمة...",
      variantsTitle: "بدائل المحتوى المولدة",
      variantSelectedBadge: "البديل النشط المختار",
      previewInstagram: "معاينة حية لمنشور إنستغرام",
      previewFacebook: "معاينة حية لمنشور صفحة فيسبوك",
      sendToEditorBtn: "إرسال إلى محرر المنشورات",
      sendToApprovalBtn: "تقديم للاعتماد البشري",
      simulateFailureLabel: "محاكاة حد استهلاك API / خطأ التوليد (AI-02-06)",
      generationFailedTitle: "فشل طلب التوليد بالذكاء الاصطناعي",
      retryGenerationBtn: "إعادة محاولة التوليد",
      captionLabel: "نص المنشور",
      hashtagsLabel: "الوسوم الاستراتيجية",
      ctaLabel: "نداء اتخاذ إجراء (CTA)",
      visualIdeaLabel: "فكرة التكوين والتصوير البصري",
      publishingTimeLabel: "وقت النشر المقترح",
    },
    posts: {
      title: "المنشورات ومنظومة المراجعة والاعتماد",
      subtitle:
        "تعديل نصوص المنشورات، مراجعة سجل الإصدارات، وإدارة بوابات الموافقة البشرية الصارمة قبل الجدولة.",
      createPost: "صياغة منشور جديد",
      editPost: "تعديل محتوى المنشور",
      versionHistory: "سجل التعديلات والإصدارات",
      versionsTitle: "سجل مراجعات المحتوى",
      currentVersionBadge: "الإصدار المعتمد الحالي",
      revertToVersion: "الرجوع إلى هذا الإصدار",
      revertConfirm: "هل تريد استرجاع المسودة الحالية إلى المراجعة رقم #",
      aiGeneratedTag: "توليد ذكاء اصطناعي",
      manualEditTag: "تعديل يدوي",
      approvalStatus: "حالة المراجعة والاعتماد",
      pendingReview: "بانتظار المراجعة البشرية",
      approved: "معتمد للنشر",
      rejected: "طُلب تعديله",
      draft: "مسودة عمل",
      scheduled: "مجدول في التقويم",
      published: "منشور ومباشر",
      approveAction: "اعتماد المنشور",
      rejectAction: "طلب تعديل / رفض",
      rejectionReasonLabel: "سبب الرفض وملاحظات التعديل",
      rejectionReasonPlaceholder: "اشرح التعديلات المطلوبة قبل الموافقة على النشر...",
      readinessChecklist: "قائمة التحقق من جاهزية النشر",
      readinessCaption: "عدد حروف النص متوافق",
      readinessHashtags: "الوسوم منسقة بالشكل المطلوب",
      readinessCta: "نداء اتخاذ إجراء (CTA) متوفر وواضح",
      readinessMedia: "صورة عالية الدقة مرتبطة بالمنشور",
      notReadyNotice:
        "لا يمكن اعتماد المنشورات غير المكتملة. يرجى استيفاء كافة شروط الجاهزية.",
      approvedNotice:
        "تم اعتماد المنشور بنجاح. أصبح الآن مؤهلاً للجدولة في تقويم النشر ضمن الإصدار R5.",
      filterAll: "كافة المنشورات",
      searchPlaceholder: "البحث في المنشورات بالعنوان أو النص أو الحملة...",
      noPostsFound: "لم يتم العثور على منشورات تسويقية",
      emptyPostsDesc:
        "لا توجد منشورات تطابق معايير التصفية. استخدم استوديو الذكاء الاصطناعي لإنشاء أول مسودة.",
      postSaved: "تم حفظ المنشور والإصدار الجديد بنجاح.",
      postApprovedMsg: "تم اعتماد المنشور بشكل صريح للنشر.",
      postRejectedMsg: "تم رفض المنشور وإرسال ملاحظات التعديل.",
    },
    integrations: {
      title: "ربط حسابات التواصل الاجتماعي",
      subtitle:
        "قم بربط قنوات ميتا التجارية لتمكين النشر التلقائي ومتابعة بيانات التفاعل المباشرة.",
      connectInstagram: "ربط حساب إنستغرام الاحترافي",
      connectFacebook: "ربط صفحة فيسبوك",
      reconnect: "تجديد رمز الوصول",
      disconnect: "إلغاء ربط الحساب",
      disconnectConfirm:
        "هل أنت متأكد من رغبتك في إلغاء ربط هذا الحساب؟ ستتوقف الجدولة التلقائية الخاصة بهذه القناة.",
      statusConnected: "متصل ونشط",
      statusDisconnected: "غير متصل",
      statusTokenExpired: "انتهت صلاحية الرمز — يلزم إعادة الاتصال",
      followers: "المتابعون / الجمهور",
      tokenExpiryNotice: "صلاحية رمز ميتا تنتهي في:",
      tokenExpiredAlert:
        "انتهت صلاحية رمز الوصول. تتطلب منصة ميتا إعادة تفويض دورية لمواصلة النشر التلقائي.",
      mvpLimitationTitle: "القنوات المدعومة (نطاق النسخة الأولى MVP)",
      mvpLimitationDesc:
        "تدعم منصة التسويق الذكي حالياً حسابات إنستغرام الاحترافية وصفحات فيسبوك التجارية فقط. الملفات الشخصية وتيك توك وX ولينكد إن وبنتريست غير مشمولة في هذه المرحلة عمداً.",
      connecting: "جارٍ بدء تفويض ميتا OAuth...",
      reconnecting: "جارٍ تجديد رمز الوصول...",
      oauthModalTitle: "إعادة التوجيه لتسجيل دخول ميتا للأعمال",
      oauthModalDesc:
        "يتم الربط بشكل آمن عبر بروتوكول OAuth 2.0 PKCE. لا يتم كشف أي رموز وصول سرية لمتصفح العميل نهائياً.",
      accountHandle: "المعرّف",
      externalId: "معرّف ميتا الخارجي",
      connectedSince: "تاريخ الربط",
      lastSynced: "آخر مزامنة",
      unsupportedNetworks:
        "الشبكات الأخرى (تيك توك، X، لينكد إن) مجدولة للإصدارات المؤسسية المستقبلية.",
    },
    calendar: {
      title: "تقويم النشر والجدولة",
      subtitle:
        "تخطيط ومراجعة وتتبع المنشورات المجدولة آلياً عبر منصات التواصل الاجتماعي المختلفة.",
      schedulePostBtn: "جدولة منشور معتمد",
      monthView: "عرض شهري",
      weekView: "عرض أسبوعي",
      today: "اليوم",
      prev: "السابق",
      next: "التالي",
      timezoneNotice:
        "تعتمد جميع المواعيد على التوقيت الموثوق للخادم: أوروبا/إسطنبول (UTC+03:00).",
      scheduledPostsCount: "مجدولة",
      publishedPostsCount: "منشورة",
      failedPostsCount: "تتطلب اهتماماً",
      scheduleModalTitle: "جدولة موعد النشر",
      selectApprovedPost: "اختر منشوراً معتمداً",
      selectDateTime: "تاريخ ووقت النشر",
      minScheduleNotice:
        "يجب جدولة المنشورات بعد 5 دقائق على الأقل من الوقت الحالي.",
      confirmSchedule: "تأكيد والجدولة",
      cancelSchedule: "إلغاء الموعد المجدول",
      cancelScheduleConfirm:
        "هل تريد إلغاء الجدولة وإعادة المنشور إلى حالة مسودة معتمدة؟",
      postDetailTitle: "فاحص تفاصيل المنشور",
      publishingStatus: "حالة النشر",
      retryPublishing: "إعادة محاولة النشر الآن",
      viewOnSocial: "مشاهدة المنشور المباشر",
      failureReasonLabel: "تشخيص سبب فشل النشر",
      noApprovedPostsToSchedule:
        "لا توجد منشورات معتمدة متاحة للجدولة. يرجى اعتماد منشور من شاشة المنشورات والموافقة أولاً.",
      emptyDay: "لا توجد منشورات مجدولة في هذا اليوم.",
      publishNow: "نشر فوري الآن",
    },
    analytics: {
      title: "تحليلات الأداء التسويقي",
      subtitle:
        "مؤشرات الأداء اللحظية، وصول الجمهور، سرعة التفاعل وبيانات التحويل الرقمي.",
      reachVsImpressionsTitle: "الفرق الجوهري بين الوصول ومرات الظهور",
      reachVsImpressionsDesc:
        "يمثل الوصول (Reach) عدد الحسابات الفريدة التي شاهدت محتواك، بينما يمثل الظهور (Impressions) إجمالي عدد مرات عرض المحتوى على الشاشات.",
      reachLabel: "وصول الجمهور الفريد",
      impressionsLabel: "إجمالي مرات الظهور",
      engagementRateLabel: "متوسط معدل التفاعل",
      likesLabel: "الإعجابات",
      commentsLabel: "التعليقات",
      sharesLabel: "المشاركات",
      savesLabel: "الحفظ والمفضلة",
      linkClicksLabel: "نقرات الروابط الخارجية",
      ctrLabel: "نسبة النقر إلى الظهور (CTR)",
      performanceTrends: "منحنيات تطور الوصول والتفاعل عبر الزمن",
      platformComparison: "مقارنة الأداء حسب المنصة الاجتماعية",
      range7d: "7 أيام",
      range14d: "14 يوماً",
      range30d: "30 يوماً",
      range90d: "90 يوماً",
      telemetrySyncNotice: "تمت مزامنة قياسات ميتا في:",
      refreshMetrics: "مزامنة أحدث المقاييس",
    },
    reports: {
      title: "ذكاء تقارير SWOT والتوصيات",
      subtitle:
        "نقاط القوة والضعف والفرص والتهديدات المستندة إلى الأدلة الرقمية وتوجيهات الذكاء الاصطناعي ذات الأولوية.",
      swotTitle: "مصفوفة SWOT المستندة إلى الأدلة الإحصائية",
      swotSubtitle:
        "كل عنصر في المصفوفة مدعوم بأدلة عددية حقيقية مستخلصة من أداء المنشورات الفعلية.",
      strengths: "نقاط القوة",
      weaknesses: "نقاط الضعف",
      opportunities: "الفرص",
      threats: "التهديدات",
      recommendationsTitle: "التوجيهات التسويقية ذات الأولوية",
      recommendationsSubtitle:
        "توصيات تنفيذية مباشرة مصاغة بواسطة محرك التسويق الذكي مع تقدير الأثر الإيجابي المتوقع.",
      highPriority: "أولوية قصوى",
      mediumPriority: "أولوية متوسطة",
      lowPriority: "أولوية منخفضة",
      expectedImpactLabel: "الأثر المتوقع",
      actionItemLabel: "الإجراء المقترح",
      numericalEvidenceLabel: "الدليل الإحصائي المرصود",
      insufficientDataTitle: "بيانات أداء تاريخية غير كافية",
      insufficientDataDesc:
        "يتطلب تحليل SWOT الدقيق المستند إلى الأدلة نشر 3 منشورات على الأقل مع اكتمال جمع بيانات التفاعل. يرجى ربط الحسابات ونشر الحملات للحصول على التقرير الكامل.",
      insufficientToggle: "محاكاة حالة البيانات غير الكافية",
      sufficientToggle: "عرض مصفوفة الأدلة الكاملة",
      regenerateReport: "توليد تقرير ذكاء جديد",
      regenerating: "جارٍ تحليل البيانات وصياغة التقرير...",
      applyToCampaign: "بدء حملة تسويقية بناءً على التوصية",
    },
    admin: {
      title: "إدارة النظام والبنية التحتية",
      subtitle:
        "إشراف مركزي متعدد المستأجرين، مراقبة طوابير النشر، والعمليات الحساسة للبنية التحتية.",
      accessRestrictedTitle: "يتطلب صلاحية مدير النظام (System Admin)",
      accessRestrictedDesc:
        "هذه اللوحة مخصصة فقط للمستخدمين برتبة SYSTEM_ADMIN. يمكنك تبديل الرتبة من الشريط العلوي لتجربة هذه الشاشة.",
      totalTenants: "إجمالي المستأجرين",
      activeTenants: "المساحات النشطة",
      queuedJobs: "مهام النشر المجدولة",
      aiTokens: "رموز استدلال الذكاء الاصطناعي",
      platformHealth: "صحة البنية التحتية",
      metaApi: "حالة واجهة ميتا (Meta Graph API)",
      aiWorker: "معالج الذكاء الاصطناعي",
      dbLatency: "زمن استجابة قاعدة البيانات",
      tenantsTableTitle: "حسابات الشركات والمستأجرين",
      tenantsTableSubtitle:
        "إدارة مساحات عمل الشركات، مراجعة باقات الاشتراك، والتحكم في الحالة التشغيلية.",
      tenantName: "الشركة / المستأجر",
      owner: "مالك الحساب",
      plan: "باقة الاشتراك",
      status: "حالة الحساب",
      productsCount: "المنتجات",
      campaignsCount: "الحملات",
      actions: "الإجراءات الإدارية",
      suspendTenant: "تعليق حساب الشركة",
      reactivateTenant: "إعادة تفعيل الحساب",
      suspendConfirmTitle: "تأكيد تعليق حساب الشركة",
      suspendConfirmDesc:
        "هل أنت متأكد من رغبتك في تعليق هذه الشركة؟ سيتم إيقاف النشر التلقائي وتوليد المحتوى فوراً.",
      purgeQueue: "تفريغ طوابير النشر العالقة",
      purgeConfirmTitle: "تفريغ طابور النشر",
      purgeConfirmDesc:
        "سيؤدي هذا الإجراء إلى إزالة كافة مهام النشر الخلفية المعلقة عبر جميع الشركات.",
      flushCache: "تفريغ ذاكرة التخزين المؤقت للذكاء الاصطناعي",
      flushConfirmTitle: "تفريغ ذاكرة الذكاء الاصطناعي",
      flushConfirmDesc:
        "سيؤدي هذا إلى تفريغ التضمينات والنماذج المخزنة مؤقتاً في ذاكرة المعالج.",
    },
    notifications: {
      title: "مركز الإشعارات والتنبيهات",
      subtitle:
        "تنبيهات معزولة لكل شركة، حالات النشر التلقائي، الأحداث الأمنية وتحديثات الذكاء الاصطناعي.",
      markAllRead: "تحديد الكل كمقروء",
      filterAll: "كافة التنبيهات",
      filterPublishing: "النشر",
      filterAi: "الذكاء الاصطناعي",
      filterSecurity: "الأمان",
      filterSystem: "تحديثات النظام",
      noNotifications: "لا توجد إشعارات",
      emptyDesc: "ليس لديك أي تنبيهات غير مقروءة في هذا القسم.",
      viewAction: "عرض التفاصيل",
      delete: "حذف التنبيه",
    },
    settings: {
      title: "إعدادات الحساب ومساحة العمل",
      subtitle:
        "إدارة ملفك الشخصي، بيانات تسجيل الدخول والأمان، وتفضيلات لغة المنصة.",
      profileSection: "بيانات الملف الشخصي",
      securitySection: "الأمان وكلمة المرور",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني للعمل",
      preferredLang: "لغة واجهة المنصة المفضلة",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      confirmNewPassword: "تأكيد كلمة المرور الجديدة",
      updateProfileBtn: "حفظ بيانات الملف الشخصي",
      changePasswordBtn: "تحديث كلمة المرور",
      profileUpdated: "تم تحديث الملف الشخصي بنجاح.",
      passwordChanged: "تم تغيير كلمة المرور بنجاح.",
    },
    validation: {
      emailRequired: "البريد الإلكتروني مطلوب.",
      emailInvalid: "يرجى إدخال بريد إلكتروني صحيح للعمل.",
      passwordRequired: "كلمة المرور مطلوبة.",
      passwordWeak:
        "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتشمل حرفاً كبيراً ورقماً ورمزاً خاصاً.",
      passwordsMismatch: "تأكيد كلمة المرور غير متطابق.",
      fullNameRequired: "الاسم الكامل مطلوب.",
      companyNameRequired: "اسم الشركة مطلوب.",
      industryRequired: "قطاع الأعمال مطلوب.",
      descriptionMin: "يرجى كتابة وصف للشركة لا يقل عن 20 حرفاً.",
      targetAudienceRequired: "وصف الجمهور المستهدف مطلوب.",
      countryRequired: "الدولة أو المنطقة الجغرافية مطلوبة.",
      brandInfoRequired: "معلومات العلامة التجارية الأساسية مطلوبة.",
    },
  },
};
