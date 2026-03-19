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
};
