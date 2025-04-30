import { Header } from '@/components/Header';
import { CategoriesSection } from '@/components/landing-page/CategoriesSection';
import { HeroSection } from '@/components/landing-page/HeroSection';
import { PlacesSection } from '@/components/landing-page/PlacesSection';
import { verify } from '@/utils/verify';

export default async function Page() {
  const { data: userData } = await verify.loggedUser();

  return (
    <div className="relative flex h-full flex-col lg:max-h-screen">
      <Header userData={userData} />

      <HeroSection />

      <div className="flex flex-col gap-36">
        <CategoriesSection />

        <PlacesSection />
      </div>

      {/* TODO: Create post card */}
      {/* TODO: Footer */}
    </div>
  );
}
