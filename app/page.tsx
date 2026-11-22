import HeroSlider from "@/components/hero-slider";
import { FeaturedServices } from "@/app/components/home/featured-services";
import { ServiceCategories } from "@/app/components/home/service-categories";
import { WhyChooseUs } from "@/app/components/home/why-choose-us";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSlider />
      <FeaturedServices />
      <ServiceCategories />
      <WhyChooseUs />
    </main>
  );
}
