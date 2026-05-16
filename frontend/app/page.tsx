import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Trusted } from "@/components/landing/trusted";
import { Features } from "@/components/landing/features";
import { Workflow } from "@/components/landing/workflow";
import { AnalyticsPreview } from "@/components/landing/analytics-preview";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-bg overflow-x-hidden">
      <Navbar />
      <Hero />
      <Trusted />
      <Features />
      <Workflow />
      <AnalyticsPreview />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
