import { CosmicBackground } from '@/components/CosmicBackground';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/sections/Hero';
import { ValueBridge } from '@/components/sections/ValueBridge';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Features } from '@/components/sections/Features';
import { DashboardPreview } from '@/components/sections/DashboardPreview';
import { Safety } from '@/components/sections/Safety';
import { Audiences } from '@/components/sections/Audiences';
import { Integrations } from '@/components/sections/Integrations';
import { Pricing } from '@/components/sections/Pricing';
import { Credits } from '@/components/sections/Credits';
import { AntiReview } from '@/components/sections/AntiReview';
import { Faq } from '@/components/sections/Faq';
import { FinalCta } from '@/components/sections/FinalCta';
import { Footer } from '@/components/sections/Footer';

export function MarketingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <CosmicBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <ValueBridge />
        <HowItWorks />
        <Features />
        <DashboardPreview />
        <Safety />
        <Audiences />
        <Integrations />
        <Pricing />
        <Credits />
        <AntiReview />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
