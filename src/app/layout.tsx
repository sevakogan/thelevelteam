import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TheLevelTeam | Boutique Digital Agency",
  description:
    "Boutique digital agency serving businesses across the United States. Paid advertising, website development, cold calling, social media, SEO, and customer service.",
  metadataBase: new URL("https://thelevelteam.com"),
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "TheLevelTeam",
    description: "Boutique digital agency — advertising, development, and growth strategy for businesses across the US.",
    url: "https://thelevelteam.com",
    siteName: "TheLevelTeam",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheLevelTeam",
    description: "Boutique digital agency — advertising, development, and growth strategy for businesses across the US.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-brand-dark`}
      >
        {children}
      </body>
    </html>
  );
}
