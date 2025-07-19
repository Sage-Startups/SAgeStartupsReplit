import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { DashboardPreview } from "@/components/dashboard-preview";
import { BotDemo } from "@/components/bot-demo";
import { AllBots } from "@/components/all-bots";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <DashboardPreview />
      <BotDemo />
      <AllBots />
      <CTA />
      <Footer />
    </div>
  );
}
