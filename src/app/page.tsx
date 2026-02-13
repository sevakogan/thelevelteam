import Header from "@/components/ui/Header";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PlatformsBar from "@/components/sections/PlatformsBar";
import PortfolioSection from "@/components/sections/PortfolioSection";
import ProcessSection from "@/components/sections/ProcessSection";
import MidCTA from "@/components/sections/MidCTA";
import AboutSection from "@/components/sections/AboutSection";
import SocialProofSection from "@/components/sections/SocialProofSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";
import { getCompanies } from "@/lib/companies";

export default async function Home() {
  const companies = await getCompanies();

  return (
    <main className="bg-brand-dark min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <PlatformsBar />
      <PortfolioSection companies={companies} />
      <ProcessSection />
      <MidCTA />
      <AboutSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
    </main>
  );
}
