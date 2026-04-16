import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HinglishClock from '@/components/HinglishClock';
import NaamJapCounter from '@/components/NaamJapCounter';
import DailyGitaShlok from '@/components/DailyGitaShlok';
import DailyAarti from '@/components/DailyAarti';
import MantraOfTheDay from '@/components/MantraOfTheDay';
import FestivalCalendar from '@/components/FestivalCalendar';
import HanumanChalisa from '@/components/HanumanChalisa';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

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

      <section className="max-w-4xl mx-auto px-4">
        <DailyAarti />
      </section>

      <section className="max-w-4xl mx-auto px-4">
        <FestivalCalendar />
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20">
        <HinglishClock />
      </section>

      <Footer />
    </div>
  );
};

export default Index;
