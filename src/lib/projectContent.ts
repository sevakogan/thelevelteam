import type { ProjectDetail } from "@/lib/types";

export const projectContent: Record<string, ProjectDetail> = {
  crownvault: {
    slug: "crownvault",
    headline: "The Invite-Only Watch Marketplace",
    longDescription:
      "CrownVault is an exclusive, invite-only marketplace built for serious watch dealers. The platform connects verified members to trade authenticated luxury timepieces in a trusted, private environment. Every dealer is vetted, every piece is verified, and every transaction is secure.\n\nThe marketplace features real-time inventory management, advanced search and filtering, and a streamlined inquiry system that connects buyers with sellers instantly. The platform handles everything from listing creation to deal negotiation, with a focus on security and authenticity that luxury watch dealers demand.",
    features: [
      {
        title: "Dealer Verification",
        description: "Multi-step verification process ensures only legitimate, established dealers join the network.",
        icon: "shield",
      },
      {
        title: "Real-Time Inventory",
        description: "Live marketplace with instant updates on availability, pricing, and watch condition status.",
        icon: "refresh",
      },
      {
        title: "Secure Authentication",
        description: "Email-based magic link authentication with Supabase, keeping accounts secure without password fatigue.",
        icon: "lock",
      },
      {
        title: "Advanced Search & Filters",
        description: "Filter by brand, model, condition, price range, and location to find exactly what you need.",
        icon: "search",
      },
      {
        title: "Inquiry System",
        description: "Direct dealer-to-dealer communication with structured inquiry forms for serious buyers.",
        icon: "message",
      },
      {
        title: "Responsive Design",
        description: "Fully responsive across desktop and mobile, with a premium dark-themed interface.",
        icon: "device",
      },
    ],
    screenshots: [
      { src: "/screenshots/crownvault/hero.png", alt: "CrownVault landing page", caption: "Landing page with dealer sign-up" },
      { src: "/screenshots/crownvault/marketplace.png", alt: "Watch marketplace", caption: "Live marketplace with watch listings" },
      { src: "/screenshots/crownvault/mobile.png", alt: "Mobile view", caption: "Responsive mobile experience" },
    ],
    outcomes: [
      "Private marketplace with invite-only access control",
      "Real-time inventory synced with Supabase",
      "Sub-second page loads with Next.js SSR",
      "Premium brand identity with custom animations",
    ],
    usesGHL: false,
    clientIndustry: "Luxury Watches",
  },

  revenuflow: {
    slug: "revenuflow",
    headline: "AI-Powered Revenue for Short-Term Rentals",
    longDescription:
      "RevenuFlow is an AI-powered revenue management platform designed for short-term rental operators. It combines dynamic pricing algorithms with market analytics and demand forecasting to help property managers maximize every night's revenue.\n\nThe platform features a comprehensive dashboard for tracking performance, a booking management system, and automated pricing recommendations based on local market conditions, seasonal trends, and competitor analysis. Built to scale from single-property owners to portfolio managers handling hundreds of units.",
    features: [
      {
        title: "Dynamic Pricing Engine",
        description: "AI-driven pricing that adjusts nightly rates based on demand, seasonality, and local events.",
        icon: "chart",
      },
      {
        title: "Market Analytics",
        description: "Real-time competitor analysis and market trend data for informed pricing decisions.",
        icon: "analytics",
      },
      {
        title: "Demand Forecasting",
        description: "Predictive models that forecast occupancy and revenue weeks in advance.",
        icon: "trending",
      },
      {
        title: "Booking Management",
        description: "Centralized dashboard for managing reservations, availability, and guest communication.",
        icon: "calendar",
      },
      {
        title: "Performance Reports",
        description: "Automated weekly and monthly reports tracking revenue, occupancy, and pricing metrics.",
        icon: "document",
      },
      {
        title: "Multi-Property Support",
        description: "Manage pricing across your entire portfolio from a single, unified dashboard.",
        icon: "grid",
      },
    ],
    screenshots: [
      { src: "/screenshots/revenuflow/hero.png", alt: "RevenuFlow landing page", caption: "Marketing landing page" },
      { src: "/screenshots/revenuflow/features.png", alt: "Feature showcase", caption: "AI-powered features overview" },
      { src: "/screenshots/revenuflow/pricing.png", alt: "Pricing plans", caption: "Flexible pricing tiers" },
    ],
    outcomes: [
      "Complete marketing site with lead capture",
      "Authenticated dashboard with role-based access",
      "GoHighLevel integration for booking and CRM",
      "Full test suite with Vitest and Playwright",
    ],
    usesGHL: true,
    ghlDetails:
      "RevenuFlow integrates with GoHighLevel for calendar-based booking, automated lead capture, and client onboarding pipelines. The GHL integration handles appointment scheduling, email sequences, and CRM management for property owners signing up for the platform.",
    clientIndustry: "Short-Term Rentals & Hospitality",
  },

  "wecare-drive": {
    slug: "wecare-drive",
    headline: "HIPAA-Compliant Medical Supply Delivery Platform",
    longDescription:
      "WeCare Drive is a fully HIPAA-compliant logistics platform purpose-built for medical supply delivery operations. The system manages the entire delivery lifecycle — from scheduling and dispatch to real-time status tracking, expense reporting, and automated document archival — all while enforcing strict healthcare data privacy standards.\n\nThe platform features 15-minute auto-expiring sessions, end-to-end encryption, comprehensive audit logging of every data access and modification, and role-based access controls across four user tiers. Drivers manage deliveries and expenses from a mobile-friendly interface, case managers coordinate and reassign routes in real time, and administrators oversee operations with a built-in AI assistant, Google Drive auto-sync, vacation management, and XLSX/CSV reporting. Every interaction with patient data is logged, encrypted, and access-controlled to meet HIPAA Technical Safeguard requirements.",
    features: [
      {
        title: "HIPAA Compliance Suite",
        description: "End-to-end encryption (TLS in transit, AES at rest), 15-minute session timeouts, full audit logging of all PHI access, and a live compliance dashboard.",
        icon: "shield",
      },
      {
        title: "Role-Based Access Control",
        description: "Four-tier RBAC system — drivers, case managers, admins, and pending users — with field-level data isolation and row-level ownership enforcement.",
        icon: "lock",
      },
      {
        title: "AI Assistant (Mia)",
        description: "Built-in AI chat powered by GPT-4o-mini with role-scoped data access, natural language queries for deliveries, expenses, and performance stats.",
        icon: "message",
      },
      {
        title: "Delivery Status Workflow",
        description: "Full lifecycle tracking from pending through loaded, started, delivered, and complete — with field-level activity logs recording every change.",
        icon: "refresh",
      },
      {
        title: "Secure File Management",
        description: "AWS S3 storage with server-side encryption, presigned URLs, file type validation, and automatic Google Drive sync for completed deliveries.",
        icon: "document",
      },
      {
        title: "Real-Time Dashboard & Reports",
        description: "Interactive calendar with 4-week lookahead, daily/weekly/monthly stats, vacation tracking, and one-click XLSX/CSV exports.",
        icon: "analytics",
      },
    ],
    screenshots: [
      { src: "/screenshots/wecare-drive/hero.png", alt: "Admin dashboard with delivery stats and calendar", caption: "Admin dashboard with delivery stats" },
      { src: "/screenshots/wecare-drive/dashboard.png", alt: "Delivery reports and driver management", caption: "Delivery reports and driver management" },
      { src: "/screenshots/wecare-drive/files.png", alt: "Customer files and document management", caption: "Customer files and document management" },
      { src: "/screenshots/wecare-drive/settings.png", alt: "Settings and vacation management", caption: "Settings and HIPAA compliance dashboard" },
      { src: "/screenshots/wecare-drive/mobile.png", alt: "Mobile dashboard view", caption: "Mobile-friendly driver interface" },
    ],
    outcomes: [
      "Full HIPAA Technical Safeguard compliance with audit logging and encryption",
      "Four-role access system with field-level data isolation",
      "AI-powered assistant with role-scoped, read-only data queries",
      "Google Drive auto-sync and XLSX/CSV export for document archival",
    ],
    usesGHL: false,
    clientIndustry: "Healthcare & Medical Supply",
  },

  geniustestboost: {
    slug: "geniustestboost",
    headline: "Expert SAT & ACT Tutoring Platform",
    longDescription:
      "GeniusTestBoost is an online tutoring platform connecting students with expert tutors for SAT, ACT, and GRE standardized test preparation. The platform provides diagnostic testing, personalized study plans, and live tutoring sessions.\n\nStudents get a dedicated dashboard to track their progress, view assignments, and communicate with tutors. Teachers manage their courses, create assignments, and monitor student performance. Admins oversee the entire platform with tools for user management, course creation, and performance analytics.",
    features: [
      {
        title: "Diagnostic Testing",
        description: "Initial assessments identify strengths and weaknesses to create targeted study plans.",
        icon: "clipboard",
      },
      {
        title: "Custom Study Plans",
        description: "AI-assisted study plans tailored to each student's target score and timeline.",
        icon: "book",
      },
      {
        title: "Live Sessions",
        description: "1-on-1 tutoring sessions with screen sharing, whiteboard tools, and session recording.",
        icon: "video",
      },
      {
        title: "Score Tracking",
        description: "Visual progress tracking with practice test scores, improvement trends, and goal milestones.",
        icon: "trending",
      },
      {
        title: "Assignment System",
        description: "Teachers assign practice problems and tests with automated grading and feedback.",
        icon: "document",
      },
      {
        title: "Messaging",
        description: "Built-in messaging system for student-tutor communication between sessions.",
        icon: "message",
      },
    ],
    screenshots: [
      { src: "/screenshots/geniustestboost/hero.png", alt: "GeniusTestBoost landing", caption: "Platform landing page" },
      { src: "/screenshots/geniustestboost/dashboard.png", alt: "Student dashboard", caption: "Student learning dashboard" },
      { src: "/screenshots/geniustestboost/mobile.png", alt: "Mobile view", caption: "Mobile-responsive design" },
    ],
    outcomes: [
      "Three-role system: students, teachers, and admins",
      "Session-based authentication with bcrypt",
      "Course and assignment management system",
      "Built-in messaging for student-tutor communication",
    ],
    usesGHL: false,
    clientIndustry: "Education & Test Prep",
  },

  karbonagency: {
    slug: "karbonagency",
    headline: "The Sim Racing Ad Agency",
    longDescription:
      "Karbon Agency is a specialized digital marketing agency focused exclusively on the sim racing industry. We build hyper-targeted Meta and Instagram ad campaigns that fill seats at racing simulator venues, F1 experience centers, drift arcades, and motorsport entertainment businesses.\n\nThe agency website showcases real campaign results with verifiable metrics, a streamlined booking system for strategy calls, and comprehensive service pages targeting 16 different sim racing business categories. Every element is designed to convert visitors into booked calls.",
    features: [
      {
        title: "Meta & Instagram Ads",
        description: "Custom ad campaigns built specifically for the sim racing industry with proven creative templates.",
        icon: "target",
      },
      {
        title: "Real Campaign Metrics",
        description: "Showcases actual results: $5.03 cost per booking, 7.7M+ impressions, 20,600+ bookings generated.",
        icon: "chart",
      },
      {
        title: "Industry Segmentation",
        description: "Targeting 16 different sim racing business types from F1 experiences to drift simulation arcades.",
        icon: "grid",
      },
      {
        title: "Booking System",
        description: "Integrated calendar for scheduling free strategy calls with automatic confirmations.",
        icon: "calendar",
      },
      {
        title: "Lead Generation",
        description: "Multi-step contact forms and lead capture with CRM pipeline automation.",
        icon: "funnel",
      },
      {
        title: "SEO Content",
        description: "Long-form content sections targeting industry-specific keywords for organic search visibility.",
        icon: "search",
      },
    ],
    screenshots: [
      { src: "/screenshots/karbonagency/hero.png", alt: "Karbon Agency landing", caption: "Agency landing page" },
      { src: "/screenshots/karbonagency/results.png", alt: "Campaign results", caption: "Real campaign performance data" },
      { src: "/screenshots/karbonagency/mobile.png", alt: "Mobile view", caption: "Mobile-optimized experience" },
    ],
    outcomes: [
      "$5.03 average cost per booking across campaigns",
      "7.7M+ ad impressions delivered",
      "GoHighLevel CRM and booking integration",
      "SEO-optimized content targeting 16 business categories",
    ],
    usesGHL: true,
    ghlDetails:
      "Karbon Agency runs on GoHighLevel for appointment scheduling, CRM pipeline management, and automated follow-up sequences. The GHL integration powers the booking calendar, manages lead nurturing workflows, and tracks conversion from initial contact to signed client.",
    clientIndustry: "Sim Racing & Motorsport",
  },

  alamedahospice: {
    slug: "alamedahospice",
    headline: "Compassionate Hospice Care, Online",
    longDescription:
      "Alameda Care Hospice is a marketing website designed to connect families with compassionate end-of-life care services. The site features scroll-triggered GSAP animations, a streamlined contact form with CRM integration, and content that communicates trust and professionalism.\n\nBuilt with Next.js and GSAP for cinematic scroll experiences, the site balances emotional sensitivity with modern web design. Every section animates into view as the visitor scrolls, creating an engaging yet respectful experience that drives contact form submissions.",
    features: [
      {
        title: "GSAP Scroll Animations",
        description: "Cinematic scroll-triggered animations that guide visitors through the site with smooth, purposeful motion.",
        icon: "refresh",
      },
      {
        title: "Contact Form & CRM",
        description: "Streamlined contact form integrated with CRM for immediate lead capture and follow-up workflows.",
        icon: "message",
      },
      {
        title: "Responsive Design",
        description: "Fully responsive across all devices with a calming, professional aesthetic.",
        icon: "device",
      },
      {
        title: "SEO Optimized",
        description: "Structured content and metadata optimized for local hospice care search visibility.",
        icon: "search",
      },
    ],
    screenshots: [
      { src: "/screenshots/alamedahospice/hero.png", alt: "Alameda Hospice landing page", caption: "Landing page with scroll animations" },
      { src: "/screenshots/alamedahospice/services.png", alt: "Services section", caption: "Hospice care services overview" },
      { src: "/screenshots/alamedahospice/mobile.png", alt: "Mobile view", caption: "Mobile-responsive design" },
    ],
    outcomes: [
      "Cinematic GSAP scroll animations throughout",
      "CRM-integrated contact form for lead capture",
      "Accessible, WCAG-conscious design",
      "Fast static generation with Next.js",
    ],
    usesGHL: false,
    clientIndustry: "Healthcare & Hospice",
  },

  kashflow: {
    slug: "kashflow",
    headline: "Invoicing & Payments Made Simple",
    longDescription:
      "KashFlow is a B2B invoicing, quoting, and payment platform that helps businesses create professional invoices, track payments, and manage clients — all from a single dashboard. With Stripe integration for seamless payment processing and PDF generation for polished documents, KashFlow streamlines the entire billing workflow.\n\nThe platform supports creating and sending invoices, generating quotes that convert to invoices, tracking payment status, and managing a client database. Image compression keeps uploads fast, and the clean UI makes financial management accessible to non-technical users.",
    features: [
      {
        title: "Invoice & Quote Builder",
        description: "Create professional invoices and quotes with line items, taxes, discounts, and custom branding.",
        icon: "document",
      },
      {
        title: "Stripe Payments",
        description: "Accept payments directly through invoices with Stripe integration for cards and bank transfers.",
        icon: "card",
      },
      {
        title: "PDF Generation",
        description: "One-click PDF export of invoices and quotes with professional formatting.",
        icon: "download",
      },
      {
        title: "Client Management",
        description: "Maintain a client database with contact info, payment history, and outstanding balances.",
        icon: "users",
      },
      {
        title: "Payment Tracking",
        description: "Real-time status tracking for all invoices — draft, sent, viewed, paid, and overdue.",
        icon: "trending",
      },
      {
        title: "Image Compression",
        description: "Automatic image optimization for logos and attachments to keep everything fast.",
        icon: "image",
      },
    ],
    screenshots: [
      { src: "/screenshots/kashflow/hero.png", alt: "KashFlow dashboard", caption: "Invoice management dashboard" },
      { src: "/screenshots/kashflow/invoice.png", alt: "Invoice builder", caption: "Professional invoice builder" },
      { src: "/screenshots/kashflow/mobile.png", alt: "Mobile view", caption: "Mobile-friendly interface" },
    ],
    outcomes: [
      "End-to-end invoicing with Stripe payment processing",
      "Professional PDF generation for invoices and quotes",
      "Client management with payment history tracking",
      "Image compression for fast, optimized uploads",
    ],
    usesGHL: false,
    clientIndustry: "Business & Finance",
  },

  "s4m-leaderboard": {
    slug: "s4m-leaderboard",
    headline: "Real-Time Racing Leaderboards",
    longDescription:
      "S4M Leaderboard is a multi-event racing platform built for Sims 4 Motorsports that powers real-time leaderboards, event management, and racer engagement. Event organizers create races, racers check in via QR codes, and results update live on a public leaderboard.\n\nThe platform features an admin dashboard for managing events and racers, AI-powered event descriptions generated by Claude, Twilio SMS notifications for race updates, and Excel export for post-event reporting. Built to handle the energy and pace of live racing events.",
    features: [
      {
        title: "Live Leaderboard",
        description: "Real-time race results displayed on a public leaderboard with automatic ranking and timing.",
        icon: "chart",
      },
      {
        title: "QR Code Check-In",
        description: "Racers scan QR codes to check into events — fast, contactless, and error-free.",
        icon: "qr",
      },
      {
        title: "AI Event Descriptions",
        description: "Claude AI generates engaging event descriptions and race recaps automatically.",
        icon: "message",
      },
      {
        title: "SMS Notifications",
        description: "Twilio-powered SMS alerts for race updates, results, and upcoming event reminders.",
        icon: "notification",
      },
      {
        title: "Admin Dashboard",
        description: "Full event management with racer registration, heat scheduling, and result entry.",
        icon: "grid",
      },
      {
        title: "Excel Export",
        description: "One-click export of race results and standings for post-event reporting and analysis.",
        icon: "download",
      },
    ],
    screenshots: [
      { src: "/screenshots/s4m-leaderboard/hero.png", alt: "S4M Leaderboard", caption: "Live race leaderboard" },
      { src: "/screenshots/s4m-leaderboard/dashboard.png", alt: "Admin dashboard", caption: "Event management dashboard" },
      { src: "/screenshots/s4m-leaderboard/mobile.png", alt: "Mobile view", caption: "Mobile race results" },
    ],
    outcomes: [
      "Real-time leaderboard with live race results",
      "QR code check-in system for event day",
      "AI-generated event descriptions via Claude",
      "SMS notifications and Excel reporting",
    ],
    usesGHL: false,
    clientIndustry: "Sim Racing & Events",
  },

  sim4hire: {
    slug: "sim4hire",
    headline: "We Bring the Race to You",
    longDescription:
      "Sim4Hire is the marketing site for a Miami-based racing simulator rental and event company. The site showcases a fleet of full-motion racing simulators available for corporate events, birthday parties, brand activations, and private gatherings.\n\nBuilt with Astro for blazing-fast static performance, the site features a fleet gallery, service packages, event testimonials, and a contact form powered by Twilio and Resend for instant notifications. The site connects to S4M Leaderboard for live race results during events.",
    features: [
      {
        title: "Fleet Showcase",
        description: "Gallery of full-motion racing simulators with specs, photos, and availability details.",
        icon: "grid",
      },
      {
        title: "Event Packages",
        description: "Service tiers for corporate events, private parties, brand activations, and tournaments.",
        icon: "calendar",
      },
      {
        title: "Contact & Booking",
        description: "Contact form with Twilio SMS and Resend email notifications for instant lead capture.",
        icon: "message",
      },
      {
        title: "Testimonials",
        description: "Client testimonials and event photos showcasing real activations and satisfied customers.",
        icon: "star",
      },
      {
        title: "Live Race Integration",
        description: "Connects to S4M Leaderboard for real-time race results during simulator events.",
        icon: "trending",
      },
      {
        title: "Blazing Fast",
        description: "Built with Astro for zero-JavaScript static pages that load instantly on any device.",
        icon: "lightning",
      },
    ],
    screenshots: [
      { src: "/screenshots/sim4hire/hero.png", alt: "SimsForHire hero with video background", caption: "Hero section with event video background" },
      { src: "/screenshots/sim4hire/fleet.png", alt: "Simulator gallery and specs", caption: "Rig specs and media gallery" },
      { src: "/screenshots/sim4hire/mobile.png", alt: "Mobile view", caption: "Mobile-responsive design" },
    ],
    outcomes: [
      "Static Astro site with near-instant load times",
      "Twilio + Resend for multi-channel lead notifications",
      "Live leaderboard integration with S4M platform",
      "Responsive design optimized for event bookings",
    ],
    usesGHL: false,
    clientIndustry: "Entertainment & Events",
  },

  greystone: {
    slug: "greystone",
    headline: "Event Management, Synchronized",
    longDescription:
      "Greystone is an event management and calendar platform that keeps teams, clients, and vendors on the same page. It syncs with Google Calendar, sends email campaigns through Resend, and triggers SMS reminders via Twilio — all from a single dashboard.\n\nThe platform features NextAuth-powered authentication with Google OAuth, a drag-and-drop event scheduler, attendee management with RSVP tracking, and automated notification workflows. Organizers manage events end-to-end while attendees get a frictionless sign-up and reminder experience.",
    features: [
      {
        title: "Google Calendar Sync",
        description: "Two-way sync with Google Calendar so events stay current across every device and team member.",
        icon: "calendar",
      },
      {
        title: "Email Campaigns",
        description: "Send event invites, reminders, and follow-ups through Resend with customizable templates.",
        icon: "message",
      },
      {
        title: "SMS Notifications",
        description: "Twilio-powered SMS reminders ensure attendees never miss an event, even without email.",
        icon: "notification",
      },
      {
        title: "Google OAuth",
        description: "Secure NextAuth authentication with Google sign-in for fast, passwordless onboarding.",
        icon: "lock",
      },
      {
        title: "Attendee Management",
        description: "Track RSVPs, manage waitlists, and segment attendees for targeted communications.",
        icon: "users",
      },
      {
        title: "Event Dashboard",
        description: "Centralized view of all upcoming and past events with analytics on attendance and engagement.",
        icon: "analytics",
      },
    ],
    screenshots: [
      { src: "/screenshots/greystone/hero.png", alt: "Greystone dashboard", caption: "Event management dashboard" },
      { src: "/screenshots/greystone/calendar.png", alt: "Calendar view", caption: "Calendar with Google sync" },
      { src: "/screenshots/greystone/mobile.png", alt: "Mobile view", caption: "Mobile-responsive design" },
    ],
    outcomes: [
      "Two-way Google Calendar synchronization",
      "Multi-channel notifications via email and SMS",
      "NextAuth with Google OAuth authentication",
      "Attendee RSVP tracking and waitlist management",
    ],
    usesGHL: false,
    clientIndustry: "Events & Scheduling",
  },

  karbonbotai: {
    slug: "karbonbotai",
    headline: "AI Chatbots That Close Deals",
    longDescription:
      "KarbonBot AI is a platform for building and deploying AI-powered chatbots across Telegram and web. Powered by Claude, each bot is trained on the client's business data to handle inquiries, qualify leads, and guide prospects through the sales funnel — 24/7.\n\nThe platform includes a bot builder with custom personality settings, Telegram SDK integration for instant deployment, Stripe billing for subscription management, and a conversation analytics dashboard. Businesses get an AI sales rep that never sleeps, while customers get instant, accurate answers.",
    features: [
      {
        title: "Claude AI Engine",
        description: "Conversations powered by Claude with custom system prompts trained on your business knowledge.",
        icon: "message",
      },
      {
        title: "Telegram Integration",
        description: "Deploy bots directly to Telegram with full SDK integration — live in minutes, not weeks.",
        icon: "device",
      },
      {
        title: "Stripe Subscriptions",
        description: "Built-in billing with Stripe for tiered subscription plans and usage-based pricing.",
        icon: "card",
      },
      {
        title: "Bot Builder",
        description: "No-code bot configuration with custom personalities, response rules, and knowledge bases.",
        icon: "grid",
      },
      {
        title: "Conversation Analytics",
        description: "Track message volume, response quality, lead qualification rates, and customer satisfaction.",
        icon: "analytics",
      },
      {
        title: "Multi-Bot Management",
        description: "Manage multiple bots for different brands or use cases from a single dashboard.",
        icon: "layers",
      },
    ],
    screenshots: [
      { src: "/screenshots/karbonbotai/hero.png", alt: "KarbonBot AI landing", caption: "AI chatbot platform landing" },
      { src: "/screenshots/karbonbotai/dashboard.png", alt: "Bot management dashboard", caption: "Bot management dashboard" },
      { src: "/screenshots/karbonbotai/mobile.png", alt: "Mobile view", caption: "Mobile-responsive design" },
    ],
    outcomes: [
      "Claude-powered AI chatbots with custom training",
      "Instant Telegram deployment via SDK",
      "Stripe subscription billing and management",
      "Conversation analytics and lead qualification",
    ],
    usesGHL: false,
    clientIndustry: "AI & Automation",
  },

  kleanhq: {
    slug: "kleanhq",
    headline: "Cleaning Operations, Streamlined",
    longDescription:
      "KleanHQ is a cleaning service management platform that handles everything from booking to payment. Cleaners manage their schedules, clients book services online, and business owners track revenue and team performance — all in real time.\n\nThe platform features Stripe payment processing for deposits and final payments, Resend email notifications for booking confirmations and reminders, real-time job status updates via Supabase subscriptions, and a clean admin dashboard for managing teams, schedules, and client history.",
    features: [
      {
        title: "Online Booking",
        description: "Clients book cleaning services online with date/time selection, service type, and instant confirmation.",
        icon: "calendar",
      },
      {
        title: "Stripe Payments",
        description: "Secure payment processing for deposits, full payments, and recurring service subscriptions.",
        icon: "card",
      },
      {
        title: "Real-Time Updates",
        description: "Live job status tracking powered by Supabase real-time subscriptions — clients see progress instantly.",
        icon: "refresh",
      },
      {
        title: "Email Notifications",
        description: "Automated booking confirmations, reminders, and receipts via Resend email integration.",
        icon: "message",
      },
      {
        title: "Team Management",
        description: "Assign cleaners to jobs, manage availability, and track individual performance metrics.",
        icon: "users",
      },
      {
        title: "Admin Dashboard",
        description: "Business owner dashboard with revenue tracking, team performance, and client management.",
        icon: "analytics",
      },
    ],
    screenshots: [
      { src: "/screenshots/kleanhq/hero.png", alt: "KleanHQ landing", caption: "Service booking landing page" },
      { src: "/screenshots/kleanhq/dashboard.png", alt: "Admin dashboard", caption: "Business management dashboard" },
      { src: "/screenshots/kleanhq/mobile.png", alt: "Mobile view", caption: "Mobile-responsive design" },
    ],
    outcomes: [
      "End-to-end booking with Stripe payment processing",
      "Real-time job tracking via Supabase subscriptions",
      "Automated email notifications through Resend",
      "Team scheduling and performance management",
    ],
    usesGHL: false,
    clientIndustry: "Home Services & Cleaning",
  },

  levelcrm: {
    slug: "levelcrm",
    headline: "The CRM Built for Closers",
    longDescription:
      "LevelCRM is a full-featured customer relationship management system designed for sales teams that move fast. It features pipeline management with drag-and-drop deal stages, contact and company tracking, activity logging, and advanced filtering — all wrapped in a polished dark-mode UI built with shadcn/ui.\n\nThe platform supports multiple pipelines, customizable deal stages, bulk actions, and a contact timeline that shows every interaction in one place. Built with Next.js 16 and Supabase for instant data access and real-time collaboration.",
    features: [
      {
        title: "Pipeline Management",
        description: "Visual deal pipelines with drag-and-drop stages, win/loss tracking, and revenue forecasting.",
        icon: "funnel",
      },
      {
        title: "Contact Database",
        description: "Comprehensive contact and company records with custom fields, tags, and relationship mapping.",
        icon: "users",
      },
      {
        title: "Activity Timeline",
        description: "Chronological view of every call, email, meeting, and note for each contact and deal.",
        icon: "calendar",
      },
      {
        title: "Advanced Filtering",
        description: "Powerful filters across all entities — search by stage, value, date, tag, owner, and custom fields.",
        icon: "search",
      },
      {
        title: "Dark Mode UI",
        description: "Premium dark-themed interface built with shadcn/ui and Radix primitives for a modern experience.",
        icon: "device",
      },
      {
        title: "Real-Time Sync",
        description: "Supabase-powered real-time data so team members see updates the moment they happen.",
        icon: "refresh",
      },
    ],
    screenshots: [
      { src: "/screenshots/levelcrm/hero.png", alt: "LevelCRM dashboard", caption: "CRM pipeline dashboard" },
      { src: "/screenshots/levelcrm/pipeline.png", alt: "Deal pipeline", caption: "Visual deal pipeline management" },
      { src: "/screenshots/levelcrm/mobile.png", alt: "Mobile view", caption: "Mobile-responsive design" },
    ],
    outcomes: [
      "Visual pipeline management with drag-and-drop",
      "Comprehensive contact and company database",
      "Real-time data sync via Supabase",
      "Polished dark-mode UI with shadcn/ui components",
    ],
    usesGHL: false,
    clientIndustry: "Sales & CRM",
  },

  mailpulse: {
    slug: "mailpulse",
    headline: "Know When They Open, Click, and Engage",
    longDescription:
      "MailPulse is an email tracking and analytics platform that gives senders real-time visibility into how recipients interact with their emails. Track opens, link clicks, device info, and engagement patterns — all from a clean, intuitive dashboard.\n\nThe platform features pixel-based open tracking, link click analytics with UTM support, engagement scoring, and Stripe-powered subscription billing for tiered plans. Built for sales teams, marketers, and anyone who needs to know if their emails are actually being read.",
    features: [
      {
        title: "Open Tracking",
        description: "Pixel-based email open detection with timestamp, device, and location data.",
        icon: "search",
      },
      {
        title: "Click Analytics",
        description: "Track which links get clicked, how many times, and by whom — with UTM parameter support.",
        icon: "chart",
      },
      {
        title: "Engagement Scoring",
        description: "Automated scoring that ranks contacts by engagement level to prioritize follow-ups.",
        icon: "trending",
      },
      {
        title: "Stripe Billing",
        description: "Subscription management with tiered plans, usage tracking, and automated invoicing.",
        icon: "card",
      },
      {
        title: "Real-Time Alerts",
        description: "Instant notifications when high-priority emails are opened or links are clicked.",
        icon: "notification",
      },
      {
        title: "Dashboard Analytics",
        description: "Visual reports on send volume, open rates, click-through rates, and engagement trends.",
        icon: "analytics",
      },
    ],
    screenshots: [
      { src: "/screenshots/mailpulse/hero.png", alt: "MailPulse landing", caption: "Email tracking platform" },
      { src: "/screenshots/mailpulse/dashboard.png", alt: "Analytics dashboard", caption: "Email engagement analytics" },
      { src: "/screenshots/mailpulse/mobile.png", alt: "Mobile view", caption: "Mobile-responsive design" },
    ],
    outcomes: [
      "Real-time email open and click tracking",
      "Engagement scoring for lead prioritization",
      "Stripe subscription billing with tiered plans",
      "Visual analytics dashboard for email performance",
    ],
    usesGHL: false,
    clientIndustry: "Email Marketing & Sales",
  },

  "s4h-admin": {
    slug: "s4h-admin",
    headline: "Event Operations, Automated",
    longDescription:
      "S4H Events Admin is the back-office operations portal for SimsForHire, handling everything from event scheduling and client invoicing to contract generation and AI-powered task automation. It's the command center that keeps the rental business running smoothly.\n\nThe platform features Claude AI for generating event proposals and descriptions, Stripe for invoicing and payment collection, PDF generation for contracts and receipts, and a calendar-based event management system. Staff manage bookings, track equipment availability, and handle client communications from a single dashboard.",
    features: [
      {
        title: "AI Event Proposals",
        description: "Claude AI generates professional event proposals, descriptions, and follow-up emails in seconds.",
        icon: "message",
      },
      {
        title: "Stripe Invoicing",
        description: "Create and send invoices, track payments, and manage deposits directly through Stripe.",
        icon: "card",
      },
      {
        title: "PDF Contracts",
        description: "Auto-generate branded contracts, proposals, and receipts as downloadable PDFs.",
        icon: "document",
      },
      {
        title: "Event Calendar",
        description: "Visual calendar for scheduling events, tracking equipment availability, and avoiding conflicts.",
        icon: "calendar",
      },
      {
        title: "Client Management",
        description: "CRM-lite client database with contact info, event history, and payment records.",
        icon: "users",
      },
      {
        title: "Equipment Tracking",
        description: "Track simulator availability, maintenance schedules, and transport logistics per event.",
        icon: "grid",
      },
    ],
    screenshots: [
      { src: "/screenshots/s4h-admin/hero.png", alt: "S4H Events Admin", caption: "Event administration portal" },
      { src: "/screenshots/s4h-admin/calendar.png", alt: "Event calendar", caption: "Event scheduling calendar" },
      { src: "/screenshots/s4h-admin/mobile.png", alt: "Mobile view", caption: "Mobile-responsive design" },
    ],
    outcomes: [
      "AI-generated event proposals via Claude",
      "Stripe invoicing with payment tracking",
      "Automated PDF contract generation",
      "Calendar-based event and equipment management",
    ],
    usesGHL: false,
    clientIndustry: "Entertainment & Events",
  },

  "horsepower-for-heroes": {
    slug: "horsepower-for-heroes",
    headline: "Racing Simulators for Those Who Served",
    longDescription:
      "Horsepower for Heroes is a charity initiative by ShiftSociety 306 that connects military veterans with motorsport experiences through racing simulator events. The platform manages donor campaigns, veteran registrations, event coordination, and certificate generation.\n\nBuilt with heartfelt design and Framer Motion animations, the site tells the story of the program while making it easy to donate, volunteer, or register. React-PDF generates personalized participation certificates, and Resend handles thank-you emails to donors and event confirmations to participants.",
    features: [
      {
        title: "Donor Campaigns",
        description: "Fundraising pages with progress bars, donor recognition, and secure payment processing.",
        icon: "heart",
      },
      {
        title: "Veteran Registration",
        description: "Streamlined sign-up for veterans to register for upcoming simulator events and experiences.",
        icon: "users",
      },
      {
        title: "PDF Certificates",
        description: "Personalized participation certificates generated with React-PDF for every veteran attendee.",
        icon: "document",
      },
      {
        title: "Email Campaigns",
        description: "Automated thank-you emails to donors and confirmation emails to participants via Resend.",
        icon: "message",
      },
      {
        title: "Event Coordination",
        description: "Admin tools for scheduling events, managing volunteer crews, and tracking equipment logistics.",
        icon: "calendar",
      },
      {
        title: "Animated Storytelling",
        description: "Framer Motion animations bring the program's mission to life with smooth, engaging scroll experiences.",
        icon: "refresh",
      },
    ],
    screenshots: [
      { src: "/screenshots/horsepower-for-heroes/hero.png", alt: "Horsepower for Heroes landing", caption: "Charity program landing page" },
      { src: "/screenshots/horsepower-for-heroes/events.png", alt: "Events page", caption: "Upcoming veteran events" },
      { src: "/screenshots/horsepower-for-heroes/mobile.png", alt: "Mobile view", caption: "Mobile-responsive design" },
    ],
    outcomes: [
      "Veteran event registration and management",
      "Personalized PDF certificate generation",
      "Donor tracking with automated thank-you emails",
      "Animated storytelling with Framer Motion",
    ],
    usesGHL: false,
    clientIndustry: "Charity & Motorsport",
  },

  ttmc: {
    slug: "ttmc",
    headline: "The Members-Only Motorsport Club",
    longDescription:
      "TTMC is a members-only motorsport club platform where enthusiasts join, connect, and compete. The platform handles Stripe subscriptions for membership tiers, event registration with capacity management, and a social feed for club activity — all built as a blazing-fast React SPA.\n\nPowered by Vite and TanStack Query for instant data fetching, the app features a rich component library built on shadcn/ui and Radix primitives. Members manage their profiles, browse upcoming events, register for track days, and interact with other club members through the activity feed.",
    features: [
      {
        title: "Stripe Memberships",
        description: "Tiered subscription plans with Stripe — free, premium, and VIP levels with different perks.",
        icon: "card",
      },
      {
        title: "Event Registration",
        description: "Browse and register for track days, meetups, and club events with real-time capacity tracking.",
        icon: "calendar",
      },
      {
        title: "Member Profiles",
        description: "Customizable profiles with car details, racing stats, event history, and achievement badges.",
        icon: "users",
      },
      {
        title: "Activity Feed",
        description: "Club-wide social feed for event recaps, member achievements, and community updates.",
        icon: "message",
      },
      {
        title: "shadcn/ui Components",
        description: "Rich UI built on shadcn/ui and Radix primitives for a polished, accessible experience.",
        icon: "device",
      },
      {
        title: "Instant Performance",
        description: "Vite-powered SPA with TanStack Query for sub-second page transitions and data fetching.",
        icon: "lightning",
      },
    ],
    screenshots: [
      { src: "/screenshots/ttmc/hero.png", alt: "TTMC landing", caption: "Motorsport club landing page" },
      { src: "/screenshots/ttmc/dashboard.png", alt: "Member dashboard", caption: "Member dashboard and events" },
      { src: "/screenshots/ttmc/mobile.png", alt: "Mobile view", caption: "Mobile-responsive design" },
    ],
    outcomes: [
      "Stripe-powered membership subscriptions",
      "Event registration with capacity management",
      "Social activity feed for club engagement",
      "Blazing-fast SPA with Vite and TanStack Query",
    ],
    usesGHL: false,
    clientIndustry: "Motorsport & Community",
  },

  mylittlegeniusacademy: {
    slug: "mylittlegeniusacademy",
    headline: "Where Young Minds Discover Brilliance",
    longDescription:
      "My Little Genius Academy is an educational platform designed for young learners, featuring interactive course catalogs, engaging GSAP scroll animations, and a welcoming design that appeals to both parents and children. Built with Astro for maximum performance.\n\nThe site showcases programs, faculty, testimonials, and enrollment information with playful animations and image carousels powered by Swiper. Every page loads instantly thanks to Astro's zero-JavaScript-by-default architecture, ensuring a smooth experience on any device.",
    features: [
      {
        title: "GSAP Animations",
        description: "Playful scroll-triggered animations that make exploring programs fun and engaging for families.",
        icon: "refresh",
      },
      {
        title: "Course Catalog",
        description: "Interactive program listings with age groups, schedules, and curriculum details.",
        icon: "book",
      },
      {
        title: "Image Carousels",
        description: "Swiper-powered galleries showcasing classrooms, activities, and student achievements.",
        icon: "image",
      },
      {
        title: "Enrollment Info",
        description: "Clear enrollment process with forms, requirements, and tuition information for parents.",
        icon: "clipboard",
      },
      {
        title: "Faculty Profiles",
        description: "Teacher bios with qualifications, specialties, and a welcoming personal touch.",
        icon: "users",
      },
      {
        title: "Blazing Fast",
        description: "Astro static site with zero client-side JavaScript by default — instant loads on any device.",
        icon: "lightning",
      },
    ],
    screenshots: [
      { src: "/screenshots/mylittlegeniusacademy/hero.png", alt: "Academy landing", caption: "Academy landing page" },
      { src: "/screenshots/mylittlegeniusacademy/programs.png", alt: "Programs page", caption: "Course catalog and programs" },
      { src: "/screenshots/mylittlegeniusacademy/mobile.png", alt: "Mobile view", caption: "Mobile-responsive design" },
    ],
    outcomes: [
      "Interactive GSAP scroll animations throughout",
      "Comprehensive course catalog with enrollment info",
      "Astro static site with near-instant load times",
      "Image galleries powered by Swiper carousel",
    ],
    usesGHL: false,
    clientIndustry: "Education & Childcare",
  },

  widgets: {
    slug: "widgets",
    headline: "Plug-and-Play UI Components",
    longDescription:
      "Widget System is a Turborepo-powered monorepo that provides embeddable, plug-and-play UI widgets for any website. Each widget is a self-contained package with its own build, styles, and versioning — managed centrally with Changesets for automated releases.\n\nThe monorepo includes shared packages for common utilities and design tokens, an examples directory for integration demos, and a widget development environment for building and testing new components in isolation. Designed for teams that need to ship consistent UI across multiple properties.",
    features: [
      {
        title: "Turborepo Monorepo",
        description: "Centralized workspace with parallel builds, shared caching, and dependency management.",
        icon: "grid",
      },
      {
        title: "Versioned Releases",
        description: "Changesets-powered versioning with automated changelogs and npm publishing workflows.",
        icon: "document",
      },
      {
        title: "Shared Packages",
        description: "Common utilities, design tokens, and TypeScript types shared across all widgets.",
        icon: "layers",
      },
      {
        title: "Dev Environment",
        description: "Isolated widget development with hot reload, visual testing, and integration demos.",
        icon: "device",
      },
      {
        title: "Embeddable Widgets",
        description: "Self-contained components that drop into any website with a single script tag or npm install.",
        icon: "target",
      },
      {
        title: "TypeScript Native",
        description: "Full TypeScript coverage with strict types, auto-generated declarations, and IDE support.",
        icon: "lock",
      },
    ],
    screenshots: [
      { src: "/screenshots/widgets/hero.png", alt: "Widget System", caption: "Widget development environment" },
      { src: "/screenshots/widgets/components.png", alt: "Widget gallery", caption: "Available widget components" },
      { src: "/screenshots/widgets/mobile.png", alt: "Mobile view", caption: "Responsive widget demos" },
    ],
    outcomes: [
      "Turborepo monorepo with parallel builds",
      "Automated versioning and releases via Changesets",
      "Shared design tokens and utility packages",
      "Embeddable widgets with zero-config integration",
    ],
    usesGHL: false,
    clientIndustry: "Developer Tools & Infrastructure",
  },

  linkflow: {
    slug: "linkflow",
    headline: "SEO on Autopilot",
    longDescription:
      "LinkFlow is an automated SEO content syndication and backlink distribution engine delivered as a SaaS product. It replaces traditional $1,500–3,000/month SEO agency retainers with an automated system starting at $99/month. Clients onboard once — company info, media, platform credentials — and the system handles everything.\n\nThe platform generates unique SEO-optimized articles with natural backlinks on a scheduled cadence, distributing them across 50+ free and paid platforms with zero ongoing client involvement. A Voice DNA system captures each client's brand voice from multiple sources (website, recordings, social media) and applies it to every piece of content. Three distinct interfaces — public landing, client portal, and admin panel — serve different user roles from a single codebase.",
    features: [
      {
        title: "AI Content Engine",
        description: "xAI Grok generates unique articles, then a voice alignment pass makes each piece sound authentically like the client's brand.",
        icon: "message",
      },
      {
        title: "50+ Platform Distribution",
        description: "Automated content syndication across Reddit, LinkedIn, guest post sites, and paid platforms with natural backlink placement.",
        icon: "grid",
      },
      {
        title: "Voice DNA Profiling",
        description: "Multi-source voice capture from website scraping, voice recordings, and social media to create an authentic brand voice model.",
        icon: "target",
      },
      {
        title: "Client Review Workflow",
        description: "Google Docs-style inline comments, approval/rejection, revision requests, and a 24-hour auto-approve window.",
        icon: "document",
      },
      {
        title: "Stripe Subscriptions",
        description: "Four pricing tiers from $99 to $599/month with coupon support and automated billing via Stripe webhooks.",
        icon: "card",
      },
      {
        title: "Admin Command Center",
        description: "Revenue dashboard, client health monitoring, global content queue, bulk operations, and emergency stops.",
        icon: "analytics",
      },
    ],
    screenshots: [
      { src: "/screenshots/linkflow/hero.png", alt: "LinkFlow landing page", caption: "SaaS landing page with pricing" },
      { src: "/screenshots/linkflow/dashboard.png", alt: "Client dashboard", caption: "Client content dashboard" },
      { src: "/screenshots/linkflow/mobile.png", alt: "Mobile view", caption: "Mobile-responsive design" },
    ],
    outcomes: [
      "AI-powered content generation with brand voice alignment",
      "Automated distribution across 50+ SEO platforms",
      "Three-interface SaaS: landing, client portal, admin panel",
      "Stripe billing with four subscription tiers",
    ],
    usesGHL: false,
    clientIndustry: "SEO & Content Marketing",
  },

  autoapply: {
    slug: "autoapply",
    headline: "Your Job Search, Automated",
    longDescription:
      "AutoApply is an automated job application platform that helps job seekers generate tailored resumes, write cover letters, and track applications across multiple job boards. It takes the tedious, repetitive work out of job hunting so candidates can focus on preparation and interviews.\n\nThe platform features a resume builder that adapts content to each job description, an application tracker with status updates and follow-up reminders, and a dashboard that surfaces analytics on application volume, response rates, and pipeline health.",
    features: [
      {
        title: "Resume Builder",
        description: "Generate tailored resumes that adapt skills and experience highlights to each job description.",
        icon: "document",
      },
      {
        title: "Cover Letter Generator",
        description: "AI-assisted cover letters that match the tone and requirements of each position.",
        icon: "message",
      },
      {
        title: "Application Tracker",
        description: "Track every application with status updates, follow-up reminders, and company notes.",
        icon: "clipboard",
      },
      {
        title: "Job Board Integration",
        description: "Pull listings from multiple job boards into a unified search and application workflow.",
        icon: "search",
      },
      {
        title: "Analytics Dashboard",
        description: "Visualize application volume, response rates, and pipeline progression over time.",
        icon: "analytics",
      },
      {
        title: "Follow-Up Reminders",
        description: "Automated reminders to follow up with companies at the optimal time after applying.",
        icon: "calendar",
      },
    ],
    screenshots: [
      { src: "/screenshots/autoapply/hero.png", alt: "AutoApply landing", caption: "Job application platform" },
      { src: "/screenshots/autoapply/dashboard.png", alt: "Application tracker", caption: "Application tracking dashboard" },
      { src: "/screenshots/autoapply/mobile.png", alt: "Mobile view", caption: "Mobile-responsive design" },
    ],
    outcomes: [
      "Tailored resume generation per job description",
      "Application tracking with follow-up reminders",
      "Analytics on application volume and response rates",
      "Unified job board search and management",
    ],
    usesGHL: false,
    clientIndustry: "Career & Recruitment",
  },
};
