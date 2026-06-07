import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HinglishClock from '@/components/HinglishClock';
import NaamJapCounter from '@/components/NaamJapCounter';
import DailyGitaShlok from '@/components/DailyGitaShlok';
import MantraOfTheDay from '@/components/MantraOfTheDay';
import HanumanChalisa from '@/components/HanumanChalisa';
import HinduPanchang from '@/components/HinduPanchang';
import SiteStats from '@/components/SiteStats';
import TapJapOverlay from '@/components/TapJapOverlay';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      <section className="max-w-4xl mx-auto px-4">
        <HinduPanchang />
      </section>

      <section className="max-w-4xl mx-auto px-4">
        <MantraOfTheDay />
      </section>

      <section className="max-w-4xl mx-auto px-4">
        <DailyGitaShlok />
      </section>

      <section className="max-w-4xl mx-auto px-4">
        <NaamJapCounter />
      </section>

      <section className="max-w-4xl mx-auto px-4">
        <HanumanChalisa />
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-10">
        <HinglishClock />
      </section>

      <SiteStats />

      <Footer />
      <TapJapOverlay />
    </div>
  );
};

export default Index;
