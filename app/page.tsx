import { Header } from '@/components/Header';
import { HeroSection } from '@/components/landing-page/HeroSection';
import { verify } from '@/utils/verify';

export default async function Page() {
  const { data: userData } = await verify.loggedUser();

  return (
    <div className="relative flex h-full flex-col lg:max-h-screen">
      <Header userData={userData} />
      <HeroSection />

      {/* TODO: top 4 Categories section */}
      {/* TODO: top 3 Places section */}
      {/* TODO: Create post card */}
      {/* TODO: Footer */}
    </div>
  );
}
