import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/layout/Navbar";

export default function LandingPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}
