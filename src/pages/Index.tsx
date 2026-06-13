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

        {/* Tabbed sections — sidebar on md+, horizontal on mobile */}
        <section className="max-w-6xl mx-auto px-4 mb-16">
          <Tabs defaultValue="jap" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
              {/* Tab list — vertical glass sidebar on md+ */}
              <div className="md:sticky md:top-20 md:self-start">
                <div className="glass rounded-2xl p-2 border border-white/20 shadow-xl">
                  <TabsList className="flex md:flex-col h-auto w-full bg-transparent p-0 gap-1 overflow-x-auto md:overflow-visible">
                    {tabs.map(({ id, label, icon: Icon }) => (
                      <TabsTrigger
                        key={id}
                        value={id}
                        className="w-full justify-start gap-3 px-4 py-3 rounded-xl text-sm md:text-base font-display whitespace-nowrap
                          text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all
                          data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80
                          data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30"
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
                <TabsContent value="jap" className="focus-visible:outline-none mt-0">
                  <NaamJapCounter />
                </TabsContent>
                <TabsContent value="panchang" className="focus-visible:outline-none mt-0">
                  <HinduPanchang />
                </TabsContent>
                <TabsContent value="mantra" className="focus-visible:outline-none mt-0">
                  <MantraOfTheDay />
                </TabsContent>
                <TabsContent value="gita" className="focus-visible:outline-none mt-0">
                  <DailyGitaShlok />
                </TabsContent>
                <TabsContent value="chalisa" className="focus-visible:outline-none mt-0">
                  <HanumanChalisa />
                </TabsContent>
                <TabsContent value="clock" className="focus-visible:outline-none mt-0">
                  <HinglishClock />
                </TabsContent>
              </div>
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
