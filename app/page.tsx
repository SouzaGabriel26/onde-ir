import { Header } from '@/components/Header';
import { CategoriesSection } from '@/components/landing-page/CategoriesSection';
import { HeroSection } from '@/components/landing-page/HeroSection';
import { verify } from '@/utils/verify';

export default async function Page() {
  const { data: userData } = await verify.loggedUser();

  return (
    <div className="relative flex h-full flex-col gap-12 lg:max-h-screen">
      <Header userData={userData} />
      <HeroSection />
      <CategoriesSection />

      {/* TODO: top 3 Places section */}
      {/* TODO: Create post card */}
      {/* TODO: Footer */}
    </div>
  );
}
