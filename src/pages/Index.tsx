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
import DateTimeStrip from '@/components/DateTimeStrip';
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

        {/* Live Date / Day / Time / Festival strip */}
        <DateTimeStrip />

        {/* Tabbed sections — landscape (horizontal) liquid-glass tabs */}
        <section className="max-w-6xl mx-auto px-4 mb-16">
          <Tabs defaultValue="jap" className="w-full">
            {/* Horizontal liquid-glass tab bar */}
            <div className="flex justify-center mb-8">
              <div className="liquid-glass rounded-full p-2 shadow-2xl max-w-full overflow-x-auto">
                <TabsList className="flex h-auto bg-transparent p-0 gap-1">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <TabsTrigger
                      key={id}
                      value={id}
                      className="liquid-tab flex-row items-center gap-2 px-4 md:px-5 py-2.5 rounded-full text-sm md:text-base font-display whitespace-nowrap
                        text-muted-foreground hover:text-foreground bg-transparent border-0
                        data-[state=active]:shadow-none"
                    >
                      <Icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                      <span>{label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {/* Tab content */}
            <div className="min-h-[400px]">
              <TabsContent value="jap" className="focus-visible:outline-none mt-0 animate-fade-in">
                <NaamJapCounter />
              </TabsContent>
              <TabsContent value="panchang" className="focus-visible:outline-none mt-0 animate-fade-in">
                <HinduPanchang />
              </TabsContent>
              <TabsContent value="mantra" className="focus-visible:outline-none mt-0 animate-fade-in">
                <MantraOfTheDay />
              </TabsContent>
              <TabsContent value="gita" className="focus-visible:outline-none mt-0 animate-fade-in">
                <DailyGitaShlok />
              </TabsContent>
              <TabsContent value="chalisa" className="focus-visible:outline-none mt-0 animate-fade-in">
                <HanumanChalisa />
              </TabsContent>
              <TabsContent value="clock" className="focus-visible:outline-none mt-0 animate-fade-in">
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
