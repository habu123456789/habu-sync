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
import SEO from '@/components/SEO';

const Index = () => {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Radhe Radhe — Naam Jap Counter',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Web',
      description: 'Naam Jap counter with daily Gita shlokas, Hindu Panchang, Mantra of the Day, and Hanuman Chalisa.',
      url: 'https://sevasadan.lovable.app/',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Radhe Radhe',
      url: 'https://sevasadan.lovable.app/',
    },
  ];
  return (
    <div className="min-h-screen">
      <SEO
        title="Radhe Radhe 🙏 — Naam Jap Counter, Gita Shlok & Panchang"
        description="Bhagwan ka naam jap karo, daily Gita shlokas padho, aaj ka Hindu Panchang dekho aur Hanuman Chalisa ka paath karo."
        path="/"
        jsonLd={jsonLd}
      />
      <Navbar />
      <main>
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
      </main>

      <Footer />
      <TapJapOverlay />
    </div>
  );
};

export default Index;
