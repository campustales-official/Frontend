import LandingNavbar from "../components/layout/LandingNavbar";
import LandingFooter from "../components/layout/LandingFooter";
import LandingHero from "../components/landing/LandingHero";
import ProblemSection from "../components/landing/ProblemSection";
import SolutionSection from "../components/landing/SolutionSection";
import HowItWorks from "../components/landing/HowItWorks";
import ShowcaseSection from "../components/landing/ShowcaseSection";
import TrackingSection from "../components/landing/TrackingSection";
import DiscoverSection from "../components/landing/DiscoverSection";
import CollegesSection from "../components/landing/CollegesSection";
import CTASection from "../components/landing/CTASection";
import { useEffect } from "react";

export default function LandingPage() {
  // Smooth scroll to hash anchors
  useEffect(() => {
    const handleLinkClick = (e) => {
      const target = e.target.closest("a");
      if (target && target.hash && target.origin === window.location.origin) {
        const element = document.querySelector(target.hash);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <LandingNavbar />
      <main>
        <LandingHero />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <ShowcaseSection />
        <TrackingSection />
        <DiscoverSection />
        <CollegesSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
