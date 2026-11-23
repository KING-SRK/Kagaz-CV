import HeroSection from "../components/home/HeroSection";
import QuickSearchSection from "@/components/home/QuickSearchSection";
import HowItWorks from "@/components/home/HowItWorks";
import ServicesSection from "../components/home/ServicesSection";
export default function Page() {
  return (
    <main>
      <HeroSection />
      <QuickSearchSection />
      <ServicesSection />
      <HowItWorks />
    </main>
  );
}
