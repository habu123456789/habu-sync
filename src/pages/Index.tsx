import { useState, useRef, useEffect } from 'react';
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

  const [active, setActive] = useState('jap');
  const tabBarRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Auto-scroll active pill into view (mobile horizontal scroll)
  useEffect(() => {
    const el = tabBarRef.current?.querySelector<HTMLElement>(`[data-tab-id="${active}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [active]);

  // Swipe gesture on content panel to switch tabs
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    // Only horizontal swipes, ignore vertical scrolls
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;
    const idx = tabs.findIndex((t) => t.id === active);
    if (dx < 0 && idx < tabs.length - 1) setActive(tabs[idx + 1].id);
    if (dx > 0 && idx > 0) setActive(tabs[idx - 1].id);
  };

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

        {/* Tabbed sections — minimalist card tabs */}
        <section className="max-w-6xl mx-auto px-4 mb-16 relative">
          <Tabs value={active} onValueChange={setActive} className="w-full">
            {/* Desktop: grid of labelled cards. Mobile: horizontal snap-scroll pills */}
            <div className="mb-8">
              {/* Mobile scrollable pills */}
              <div
                ref={tabBarRef}
                className="md:hidden -mx-4 px-4 overflow-x-auto scrollbar-none snap-x snap-mandatory touch-pan-x overscroll-x-contain"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <TabsList className="inline-flex h-auto bg-transparent p-0 gap-2 flex-nowrap">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <TabsTrigger
                      key={id}
                      value={id}
                      data-tab-id={id}
                      className="liquid-tab snap-center inline-flex flex-row items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap
                        border border-border bg-card text-foreground/70 hover:text-foreground
                        data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-foreground"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Desktop grid of cards */}
              <TabsList className="hidden md:grid grid-cols-6 h-auto bg-transparent p-0 gap-3 w-full">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <TabsTrigger
                    key={id}
                    value={id}
                    data-tab-id={id}
                    className="liquid-tab flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-2xl text-sm font-medium
                      border border-border bg-card text-foreground/70 hover:text-foreground transition-all
                      data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-foreground"
                  >
                    <Icon className="w-6 h-6 shrink-0" />
                    <span>{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Swipe hint for mobile */}
            <p className="md:hidden text-center text-xs text-muted-foreground mb-3 select-none">
              ← swipe karke tabs change karo →
            </p>

            {/* Tab content — swipeable on touch */}
            <div
              className="rounded-3xl border border-border bg-card p-6 md:p-10 min-h-[400px] touch-pan-y transition-all"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
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
