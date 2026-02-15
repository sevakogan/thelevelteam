import { createStep, createCampaign } from "./types";
import type { Campaign } from "./types";

const welcomeDrip: Campaign = {
  id: crypto.randomUUID(),
  name: "Welcome Drip",
  channel: "both",
  steps: [],
  smsSteps: [
    createStep("Hey There! 👋", "Immediate", "Hey! Thanks for checking us out — we're stoked you reached out. Someone from our team will hit you up within 24hrs. Reply STOP to opt out."),
    createStep("Quick Question 💡", "Day 2", "Hey! Quick q — what's the ONE thing holding your project back right now? We love solving tricky problems 🧩"),
    createStep("Real Results 🚀", "Day 5", "Fun fact: we helped a client 3x their user signups in 60 days. Wanna see how? Check it out 👉 thelevelteam.com"),
    createStep("Let's Chat ☕", "Day 10", "No pitch, just a 15-min chat to see if we're a good fit. Sound cool? Reply YES and we'll set it up!"),
    createStep("Still Here 🤙", "Day 20", "No pressure at all! Just wanted you to know we're here whenever you're ready. Reply anytime or swing by thelevelteam.com ✌️"),
  ],
  emailSteps: [
    createStep("Welcome! 🎉", "Immediate", "Hey there! We're so glad you reached out. Our team is already buzzing about your project — expect a personal reply within 24 hours. In the meantime, grab a coffee and check out some of our latest work!"),
    createStep("What We're All About 🛠️", "Day 1", "We build things people actually love using — from sleek web apps to full SaaS platforms. Here's a peek behind the curtain at how we bring ideas to life (spoiler: it involves a lot of coffee and zero boring meetings)."),
    createStep("See It In Action 🎯", "Day 3", "Nothing speaks louder than results. Check out how we helped real clients launch faster, grow bigger, and stress less. Real projects, real outcomes — no fluff."),
    createStep("Don't Take Our Word For It 💬", "Day 7", "Our clients say it better than we ever could. Here's what they're saying about working with us — the good, the great, and the 'why didn't we do this sooner.'"),
    createStep("Let's Make It Happen 🤝", "Day 14", "Ready to turn your idea into something real? Let's hop on a quick no-pressure call. Worst case, you walk away with some free advice. Best case? We build something amazing together."),
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
