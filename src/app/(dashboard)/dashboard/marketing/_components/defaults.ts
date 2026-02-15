import { createStep, createCampaign } from "./types";
import type { Campaign } from "./types";

export const DEFAULT_CAMPAIGNS: readonly Campaign[] = [
  createCampaign("Welcome Drip", "both", [
    createStep("Welcome Message", "Immediate", "Thanks for reaching out! We'll be in touch within 24hrs."),
    createStep("Our Services", "Day 1", "Here's what we do best — custom web apps, SaaS, and digital experiences."),
    createStep("Social Proof", "Day 3", "We've helped clients increase efficiency by 40%. Check out our work."),
    createStep("Case Study", "Day 5", "See what we've built — real examples and results from our portfolio."),
    createStep("Final Offer", "Day 14", "Ready to get started? Let's hop on a quick call — no pressure."),
  ]),
  createCampaign("Re-engagement", "email", [
    createStep("Miss You", "Day 30", "It's been a while! We'd love to reconnect and hear about your project."),
    createStep("What's New", "Day 37", "Check out what we've been building recently — some exciting new work."),
    createStep("Last Chance", "Day 45", "Last check-in for now. We're here whenever you're ready to talk."),
  ]),
];
