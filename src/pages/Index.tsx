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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Sparkles, BookOpen, Hand, Flame, Clock } from 'lucide-react';

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
  ];

  const tabs = [
    { id: 'jap', label: 'नाम जप', icon: Hand },
    { id: 'panchang', label: 'पञ्चाङ्ग', icon: Calendar },
    { id: 'mantra', label: 'मन्त्र', icon: Sparkles },
    { id: 'gita', label: 'गीता श्लोक', icon: BookOpen },
    { id: 'chalisa', label: 'चालीसा', icon: Flame },
    { id: 'clock', label: 'घड़ी', icon: Clock },
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

        <section className="max-w-5xl mx-auto px-4 mt-10 mb-16">
          <Tabs defaultValue="jap" className="w-full">
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <TabsList className="inline-flex h-auto p-1.5 bg-card/60 backdrop-blur border border-border/60 rounded-2xl gap-1 shadow-lg">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <TabsTrigger
                    key={id}
                    value={id}
                    className="flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-sm md:text-base font-display data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    <span>{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="mt-8">
              <TabsContent value="jap" className="focus-visible:outline-none">
                <NaamJapCounter />
              </TabsContent>
              <TabsContent value="panchang" className="focus-visible:outline-none">
                <HinduPanchang />
              </TabsContent>
              <TabsContent value="mantra" className="focus-visible:outline-none">
                <MantraOfTheDay />
              </TabsContent>
              <TabsContent value="gita" className="focus-visible:outline-none">
                <DailyGitaShlok />
              </TabsContent>
              <TabsContent value="chalisa" className="focus-visible:outline-none">
                <HanumanChalisa />
              </TabsContent>
              <TabsContent value="clock" className="focus-visible:outline-none">
                <HinglishClock />
              </TabsContent>
            </div>
          </Tabs>
        </section>

        <SiteStats />
      </main>

      <Footer />
      <TapJapOverlay />
    </div>
  );
};

export default Index;
