import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface Aarti {
  title: string;
  deity: string;
  lines: string[];
}

const aartiByDay: Record<number, Aarti> = {
  0: {
    title: 'Om Jai Surya Bhagwan',
    deity: 'Surya Dev (Ravivaar)',
    lines: [
      'Om Jai Surya Bhagwan, Sab Jagat Ke Swami.',
      'Tum Bin Jagat Andhera, Tum Chandra Chakhwami.',
      'Sheetla Kiran Tumhari, Jalti Rakhte Jyoti.',
      'Tum Bin Jalte Jeevan, Man Mein Na Hai Moti.',
      'Arun Ratha Par Baithkar, Jag Mein Prakash Failao.',
      'Bhakton Ke Tum Kasht Harao, Sukh Sampatti Barsao.',
      'Rog Shok Sab Door Karo, Kripa Drishti Dikhao.',
      'Dinakar Deva Daya Nidhi, Hriday Mein Jyot Jalao.',
      'Om Jai Surya Bhagwan...'
    ],
  },
  1: {
    title: 'Om Jai Shiv Omkara',
    deity: 'Bhagwan Shiv (Somvaar)',
    lines: [
      'Om Jai Shiv Omkara, Bhaje Shiv Omkara.',
      'Brahma Vishnu Sadashiv, Ardhaangee Dhara.',
      'Ekanan Chaturanan Panchanan Raje,',
      'Hansaanan Garudaasan Vrishabhan Saaje.',
      'Do Bhuj Char Chaturbhuj Dashbhuj Ati Sohe,',
      'Teeno Roop Nirakhat Tribhuvan Jan Mohe.',
      'Akshamala Vanamala Mundamala Dhaari,',
      'Tripurari Kansari Kar Mala Dhaari.',
      'Shvetambar Pitambar Baghambar Ange,',
      'Sanakadik Brahmadik Bhootadik Sange.',
      'Kar Mein Madhya Kamandal Chakra Trishuldhari,',
      'Jagkarta Jagharta Jagpalan Kari.',
      'Om Jai Shiv Omkara...'
    ],
  },
  2: {
    title: 'Aarti Shri Hanuman Ji Ki',
    deity: 'Hanuman Ji (Mangalvaar)',
    lines: [
      'Aarti Keeje Hanuman Lala Ki,',
      'Dusht Dalan Raghunath Kala Ki.',
      'Jake Bal Se Girivir Kaanpe,',
      'Rog Dosh Jake Nikat Na Jhaanke.',
      'Anjani Putra Maha Baldaai,',
      'Santan Ke Prabhu Sada Sahaai.',
      'De Bir Raghunath Pathaye, Lanka Jaari Siya Sudhi Laaye.',
      'Lanka So Kot Samudra Si Khaai, Jaat Pavan Sut Baar Na Laai.',
      'Lanka Jaari Asur Sanhaare, Siya Ramji Ke Kaaj Sanvaare.',
      'Lakshman Moorchhit Pade Sakaare, Aani Sanjivan Pran Ubaare.',
      'Paith Pataal Tori Jamkaare, Ahiravan Ki Bhuja Ukhaare.',
      'Aarti Keeje Hanuman Lala Ki...'
    ],
  },
  3: {
    title: 'Om Jai Jagdish Hare',
    deity: 'Bhagwan Vishnu (Budhvaar)',
    lines: [
      'Om Jai Jagdish Hare, Swami Jai Jagdish Hare.',
      'Bhakt Jano Ke Sankat, Daas Jano Ke Sankat,',
      'Kshan Mein Door Kare.',
      'Jo Dhyave Phal Pave, Dukh Vinase Man Ka,',
      'Swami Dukh Vinase Man Ka.',
      'Sukh Sampati Ghar Aave, Kasht Mite Tan Ka.',
      'Mata Pita Tum Mere, Sharan Gahun Kis Ki,',
      'Swami Sharan Gahun Kis Ki.',
      'Tum Bin Aur Na Dooja, Aas Karun Jis Ki.',
      'Tum Puran Parmatma, Tum Antaryami,',
      'Parabrahma Parmeshwar, Tum Sabke Swami.',
      'Om Jai Jagdish Hare...'
    ],
  },
  4: {
    title: 'Aarti Shri Brihaspati Dev Ki',
    deity: 'Brihaspati Dev (Guruvaar)',
    lines: [
      'Jai Brihaspati Deva, Om Jai Brihaspati Deva.',
      'Chheen Chheen Bhog Lagaaun, Kadli Phal Meva.',
      'Tum Purnaa Paramaatma, Tum Antaryaami,',
      'Jagat Pita Jagdishwar, Tum Sabke Swami.',
      'Charaachar Jagat Tumne, Sakal Rachaya,',
      'Jeevan Aur Jyoti Tumhi Se Paaya.',
      'Dheenan Ke Tum Rakshak, Kripa Sindhu Deva,',
      'Vidya Buddhi Daan Karo, Haro Sakal Bhay Bheva.',
      'Jo Jan Shraddha Se Dhyaave, So Manorath Paave.',
      'Jai Brihaspati Deva...'
    ],
  },
  5: {
    title: 'Aarti Shri Santoshi Mata Ki',
    deity: 'Santoshi Mata (Shukravaar)',
    lines: [
      'Jai Santoshi Mata, Maiya Jai Santoshi Mata.',
      'Apne Sewak Jan Ki, Sukh Sampatti Data.',
      'Sundar Cheer Suhawan, Pehne Mridul Gaata,',
      'Hiron Ka Haar Galun Mein, Shobha Barsaata.',
      'Kanak Saman Kanti, Chhavi Ati Bhali,',
      'Amrit Barsat Nainan, Mataa Kripali.',
      'Shukravaar Priya Maanat, Gud Chana Bhaata,',
      'Bhakt Janon Ke Dukh Harati, Sukh Sampatti Daata.',
      'Mandir Jagmag Jyoti, Bhakti Ras Dhaara,',
      'Santoshi Maa Kripa Karo, Rakho Laaj Hamaara.',
      'Jai Santoshi Mata...'
    ],
  },
  6: {
    title: 'Aarti Shani Dev Ki',
    deity: 'Shani Dev (Shanivaar)',
    lines: [
      'Jai Jai Shri Shanidev Bhaktan Hitkaari,',
      'Suri Nar Muni Jan Sevat Sab Nar Naari.',
      'Jai Jai Shri Shanidev Bhaktan Hitkaari.',
      'Kaat Kasht Sab Dushman Ki, Jo Sharanaagatkaari,',
      'Vipda Se Raksha Karo, Sukhkarta Bhagwaan.',
      'Neelambar Dharana Karke, Mand Gati Se Aao,',
      'Nyay Ke Data Shani Deva, Sab Par Daya Dikhao.',
      'Tel Deep Arpan Karke, Bhakt Tumhein Manaaye,',
      'Paap Haro Aur Mangal Karo, Shubh Phal Sabko Paaye.',
      'Jai Jai Shri Shanidev Bhaktan Hitkaari...'
    ],
  },
};

const DailyAarti = () => {
  const today = new Date().getDay();
  const aarti = aartiByDay[today];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-sm font-mono text-muted-foreground tracking-widest uppercase flex items-center gap-2">
          <Flame className="w-4 h-4 text-accent-foreground" />
          Aaj Ki Aarti
          <Flame className="w-4 h-4 text-accent-foreground" />
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="glass rounded-2xl p-6 md:p-8 text-center max-w-2xl mx-auto">
        <h3 className="text-xl md:text-2xl font-display font-bold text-primary mb-1">
          {aarti.title}
        </h3>
        <p className="text-xs text-muted-foreground font-mono mb-5">
          🙏 {aarti.deity}
        </p>

        <div className="space-y-2">
          {aarti.lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.12 }}
              className="text-sm md:text-base text-foreground/90 font-body leading-relaxed"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <p className="text-xs text-muted-foreground font-mono mt-6">
          || Aarti roz badlegi din ke hisaab se ||
        </p>
      </div>
    </motion.div>
  );
};

export default DailyAarti;
