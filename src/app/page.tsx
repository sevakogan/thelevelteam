import Header from "@/components/ui/Header";
import HeroSection from "@/components/sections/HeroSection";
import ServicesMarketing from "@/components/sections/ServicesMarketing";
import ServicesTech from "@/components/sections/ServicesTech";
import PlatformsBar from "@/components/sections/PlatformsBar";
import PortfolioSection from "@/components/sections/PortfolioSection";
import ProcessSection from "@/components/sections/ProcessSection";
import SocialProofSection from "@/components/sections/SocialProofSection";
import AboutSection from "@/components/sections/AboutSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";
import FloatingCTA from "@/components/ui/FloatingCTA";
import GamesModal from "@/components/ui/GamesModal";
import { getCompanies } from "@/lib/companies";

export default async function Home() {
  const companies = await getCompanies();

  return (
    <main className="snap-container bg-brand-dark">
      <Header />
      <section className="snap-section" id="hero">
        <HeroSection />
      </section>
      <section className="snap-section" id="services-marketing">
        <ServicesMarketing />
      </section>
      <section className="snap-section" id="services-tech">
        <ServicesTech />
      </section>
      <section className="snap-section" id="platforms">
        <PlatformsBar />
      </section>
      <section className="snap-section" id="portfolio">
        <PortfolioSection companies={companies} />
      </section>
      <section className="snap-section" id="process">
        <ProcessSection />
      </section>
      <section className="snap-section" id="results">
        <SocialProofSection />
      </section>
      <section className="snap-section" id="about">
        <AboutSection />
      </section>
      <section className="snap-section" id="contact">
        <CTASection />
      </section>
      <footer className="snap-section" id="footer">
        <Footer />
      </footer>
      <FloatingCTA />
      <GamesModal />
    </main>
  );
}
