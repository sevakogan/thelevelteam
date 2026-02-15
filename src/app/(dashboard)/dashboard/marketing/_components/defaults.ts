import { createStep, createCampaign } from "./types";
import type { Campaign } from "./types";

const welcomeDrip: Campaign = {
  id: crypto.randomUUID(),
  name: "Welcome Drip",
  channel: "both",
  steps: [],
  smsSteps: [
    createStep("Welcome SMS", "Immediate", "Thanks for reaching out! We'll be in touch within 24hrs. Reply STOP to opt out."),
    createStep("Challenge Question", "Day 2", "What's your biggest challenge right now? We'd love to help."),
    createStep("Social Proof", "Day 5", "We've helped clients increase efficiency by 40%. Check out our work."),
    createStep("Call-to-Action", "Day 10", "Let's schedule a quick 15-min call. Reply YES to connect."),
    createStep("Final Check-in", "Day 20", "We're here whenever you're ready. Visit our site or reply to chat."),
  ],
  emailSteps: [
    createStep("Welcome Email", "Immediate", "Thanks for reaching out! A team member will follow up within 24 hours."),
    createStep("Our Services", "Day 1", "Here's what we do best — custom web apps, SaaS, and digital experiences."),
    createStep("Case Study", "Day 3", "See what we've built — real examples and results from our portfolio."),
    createStep("Client Results", "Day 7", "What our clients are saying — real, measurable improvements."),
    createStep("Final Offer", "Day 14", "Ready to get started? Let's hop on a quick call — no pressure."),
  ],
};

export const DEFAULT_CAMPAIGNS: readonly Campaign[] = [
  welcomeDrip,
  createCampaign("Re-engagement", "email", [
    createStep("Miss You", "Day 30", "It's been a while! We'd love to reconnect and hear about your project."),
    createStep("What's New", "Day 37", "Check out what we've been building recently — some exciting new work."),
    createStep("Last Chance", "Day 45", "Last check-in for now. We're here whenever you're ready to talk."),
  ]),
];
