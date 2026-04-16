import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const chalisaLines = [
  { type: 'doha', text: 'श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।', transliteration: 'Shri Guru Charan Saroj Raj, Nij Manu Mukuru Sudhari.' },
  { type: 'doha', text: 'बरनऊँ रघुबर बिमल जसु, जो दायकु फल चारि॥', transliteration: 'Barnau Raghubar Bimal Jasu, Jo Dayaku Phal Chari.' },
  { type: 'doha', text: 'बुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार।', transliteration: 'Buddhiheen Tanu Janike, Sumirau Pavan Kumar.' },
  { type: 'doha', text: 'बल बुद्धि बिद्या देहु मोहिं, हरहु कलेस बिकार॥', transliteration: 'Bal Buddhi Vidya Dehu Mohi, Harahu Kalesh Bikaar.' },
  { type: 'chaupai', text: 'जय हनुमान ज्ञान गुन सागर। जय कपीस तिहुँ लोक उजागर॥', transliteration: 'Jai Hanuman Gyan Gun Sagar. Jai Kapis Tihun Lok Ujagar.' },
  { type: 'chaupai', text: 'राम दूत अतुलित बल धामा। अंजनि-पुत्र पवनसुत नामा॥', transliteration: 'Ram Doot Atulit Bal Dhama. Anjani Putra Pavansut Nama.' },
  { type: 'chaupai', text: 'महाबीर बिक्रम बजरंगी। कुमति निवार सुमति के संगी॥', transliteration: 'Mahaveer Bikram Bajrangi. Kumati Nivar Sumati Ke Sangi.' },
  { type: 'chaupai', text: 'कंचन बरन बिराज सुबेसा। कानन कुण्डल कुंचित केसा॥', transliteration: 'Kanchan Baran Biraj Subesa. Kanan Kundal Kunchit Kesa.' },
  { type: 'chaupai', text: 'हाथ बज्र और ध्वजा बिराजै। काँधे मूँज जनेऊ साजै॥', transliteration: 'Hath Bajra Aur Dhwaja Birajai. Kandhe Moonj Janeu Sajai.' },
  { type: 'chaupai', text: 'शंकर सुवन केसरीनन्दन। तेज प्रताप महा जग बन्दन॥', transliteration: 'Shankar Suvan Kesari Nandan. Tej Pratap Maha Jag Bandan.' },
  { type: 'chaupai', text: 'विद्यावान गुनी अति चातुर। राम काज करिबे को आतुर॥', transliteration: 'Vidyavan Guni Ati Chatur. Ram Kaj Karibe Ko Aatur.' },
  { type: 'chaupai', text: 'प्रभु चरित्र सुनिबे को रसिया। राम लखन सीता मन बसिया॥', transliteration: 'Prabhu Charitra Sunibe Ko Rasiya. Ram Lakhan Sita Man Basiya.' },
  { type: 'chaupai', text: 'सूक्ष्म रूप धरि सियहिं दिखावा। बिकट रूप धरि लंक जरावा॥', transliteration: 'Sukshma Roop Dhari Siyahi Dikhawa. Bikat Roop Dhari Lanka Jarawa.' },
  { type: 'chaupai', text: 'भीम रूप धरि असुर संहारे। रामचंद्र के काज सँवारे॥', transliteration: 'Bheem Roop Dhari Asur Sanhare. Ramchandra Ke Kaj Sanware.' },
  { type: 'chaupai', text: 'लाय सजीवन लखन जियाये। श्रीरघुबीर हरषि उर लाये॥', transliteration: 'Lay Sajivan Lakhan Jiyaye. Shri Raghubir Harashi Ur Laye.' },
  { type: 'chaupai', text: 'रघुपति कीन्हीं बहुत बड़ाई। तुम मम प्रिय भरतहि सम भाई॥', transliteration: 'Raghupati Kinhi Bahut Badai. Tum Mam Priya Bharatahi Sam Bhai.' },
  { type: 'chaupai', text: 'सहस बदन तुम्हरो जस गावैं। अस कहि श्रीपति कण्ठ लगावैं॥', transliteration: 'Sahas Badan Tumharo Jas Gawen. As Kahi Shripati Kanth Lagawen.' },
  { type: 'chaupai', text: 'सनकादिक ब्रह्मादि मुनीसा। नारद शारद सहित अहीसा॥', transliteration: 'Sanakadik Brahmadi Munisa. Narad Sharad Sahit Ahisa.' },
  { type: 'chaupai', text: 'जम कुबेर दिगपाल जहाँ ते। कबि कोबिद कहि सके कहाँ ते॥', transliteration: 'Yam Kuber Digpal Jahan Te. Kabi Kobid Kahi Sake Kahan Te.' },
  { type: 'chaupai', text: 'तुम उपकार सुग्रीवहिं कीन्हा। राम मिलाय राज पद दीन्हा॥', transliteration: 'Tum Upkar Sugrivahin Kinha. Ram Milay Raj Pad Dinha.' },
  { type: 'chaupai', text: 'तुम्हरो मन्त्र बिभीषन माना। लंकेश्वर भये सब जग जाना॥', transliteration: 'Tumhro Mantra Vibhishan Mana. Lankeshwar Bhaye Sab Jag Jana.' },
  { type: 'chaupai', text: 'जुग सहस्र जोजन पर भानू। लील्यो ताहि मधुर फल जानू॥', transliteration: 'Yug Sahastra Yojan Par Bhanu. Lilyo Tahi Madhur Phal Janu.' },
  { type: 'chaupai', text: 'प्रभु मुद्रिका मेलि मुख माहीं। जलधि लाँघि गये अचरज नाहीं॥', transliteration: 'Prabhu Mudrika Meli Mukh Mahi. Jaladhi Langhi Gaye Acharaj Nahi.' },
  { type: 'chaupai', text: 'दुर्गम काज जगत के जेते। सुगम अनुग्रह तुम्हरे तेते॥', transliteration: 'Durgam Kaj Jagat Ke Jete. Sugam Anugrah Tumhre Tete.' },
  { type: 'chaupai', text: 'राम दुआरे तुम रखवारे। होत न आज्ञा बिनु पैसारे॥', transliteration: 'Ram Duware Tum Rakhware. Hot Na Aagya Binu Paisare.' },
  { type: 'chaupai', text: 'सब सुख लहै तुम्हारी शरना। तुम रक्षक काहू को डरना॥', transliteration: 'Sab Sukh Lahai Tumhari Sharna. Tum Rakshak Kahu Ko Darna.' },
  { type: 'chaupai', text: 'आपन तेज सम्हारो आपै। तीनों लोक हाँक ते काँपै॥', transliteration: 'Aapan Tej Samharo Aapai. Teenon Lok Hank Te Kanpai.' },
  { type: 'chaupai', text: 'भूत पिशाच निकट नहिं आवै। महाबीर जब नाम सुनावै॥', transliteration: 'Bhoot Pishach Nikat Nahi Aawai. Mahavir Jab Naam Sunawai.' },
  { type: 'chaupai', text: 'नासै रोग हरे सब पीरा। जपत निरंतर हनुमत बीरा॥', transliteration: 'Nase Rog Hare Sab Peera. Japat Nirantar Hanumat Beera.' },
  { type: 'chaupai', text: 'संकट तें हनुमान छुड़ावै। मन क्रम बचन ध्यान जो लावै॥', transliteration: 'Sankat Te Hanuman Chhudawai. Man Kram Bachan Dhyan Jo Lawai.' },
  { type: 'chaupai', text: 'सब पर राम तपस्वी राजा। तिन के काज सकल तुम साजा॥', transliteration: 'Sab Par Ram Tapasvi Raja. Tin Ke Kaj Sakal Tum Saja.' },
  { type: 'chaupai', text: 'और मनोरथ जो कोई लावै। सोइ अमित जीवन फल पावै॥', transliteration: 'Aur Manorath Jo Koi Lawai. Soi Amit Jivan Phal Pawai.' },
  { type: 'chaupai', text: 'चारों जुग परताप तुम्हारा। है परसिद्ध जगत उजियारा॥', transliteration: 'Charon Yug Partap Tumhara. Hai Parsiddh Jagat Ujiyara.' },
  { type: 'chaupai', text: 'साधु सन्त के तुम रखवारे। असुर निकंदन राम दुलारे॥', transliteration: 'Sadhu Sant Ke Tum Rakhware. Asur Nikandan Ram Dulare.' },
  { type: 'chaupai', text: 'अष्ट सिद्धि नौ निधि के दाता। अस बर दीन जानकी माता॥', transliteration: 'Ashta Siddhi Nau Nidhi Ke Data. As Bar Din Janaki Mata.' },
  { type: 'chaupai', text: 'राम रसायन तुम्हरे पासा। सदा रहो रघुपति के दासा॥', transliteration: 'Ram Rasayan Tumhre Pasa. Sada Raho Raghupati Ke Dasa.' },
  { type: 'chaupai', text: 'तुम्हरे भजन राम को पावै। जनम जनम के दुख बिसरावै॥', transliteration: 'Tumhre Bhajan Ram Ko Pawai. Janam Janam Ke Dukh Bisrawai.' },
  { type: 'chaupai', text: 'अन्त काल रघुबर पुर जाई। जहाँ जन्म हरि-भक्त कहाई॥', transliteration: 'Ant Kaal Raghubar Pur Jai. Jahan Janm Hari Bhakt Kahai.' },
  { type: 'chaupai', text: 'और देवता चित्त न धरई। हनुमत सेइ सर्ब सुख करई॥', transliteration: 'Aur Devta Chitt Na Dharai. Hanumat Sei Sarb Sukh Karai.' },
  { type: 'chaupai', text: 'संकट कटै मिटै सब पीरा। जो सुमिरै हनुमत बलबीरा॥', transliteration: 'Sankat Katai Mitai Sab Peera. Jo Sumirai Hanumat Balbeera.' },
  { type: 'chaupai', text: 'जय जय जय हनुमान गोसाईं। कृपा करहु गुरुदेव की नाईं॥', transliteration: 'Jai Jai Jai Hanuman Gosain. Kripa Karahu Gurudev Ki Nai.' },
  { type: 'chaupai', text: 'जो सत बार पाठ कर कोई। छूटहि बँदि महा सुख होई॥', transliteration: 'Jo Sat Baar Path Kar Koi. Chhutahi Bandi Maha Sukh Hoi.' },
  { type: 'chaupai', text: 'जो यह पढ़ै हनुमान चालीसा। होय सिद्धि साखी गौरीसा॥', transliteration: 'Jo Yah Padhai Hanuman Chalisa. Hoy Siddhi Sakhi Gaurisa.' },
  { type: 'doha', text: 'तुलसीदास सदा हरि चेरा। कीजै नाथ हृदय महँ डेरा॥', transliteration: 'Tulsidas Sada Hari Chera. Kijai Nath Hriday Mah Dera.' },
  { type: 'doha', text: 'पवनतनय संकट हरन, मंगल मूरति रूप। राम लखन सीता सहित, हृदय बसहु सुर भूप॥', transliteration: 'Pavantanay Sankat Haran, Mangal Murti Roop. Ram Lakhan Sita Sahit, Hriday Basahu Sur Bhoop.' },
];

const HanumanChalisa = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-12 max-w-lg mx-auto"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-sm font-mono text-muted-foreground tracking-widest uppercase flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Hanuman Chalisa
          <BookOpen className="w-4 h-4 text-primary" />
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-primary/5 transition-colors"
        >
          <div>
            <h3 className="text-lg font-display font-bold text-foreground">🙏 श्री हनुमान चालीसा</h3>
            <p className="text-xs text-muted-foreground font-mono mt-1">Tap karke padhein — 40 chaupaiyan + dohe</p>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-4 max-h-[60vh] overflow-y-auto">
                {chalisaLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`text-center ${line.type === 'doha' ? 'py-2 border-y border-border/30' : ''}`}
                  >
                    <p className="text-sm md:text-base font-serif text-foreground leading-relaxed">
                      {line.text}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono mt-1">
                      {line.transliteration}
                    </p>
                  </motion.div>
                ))}
                <p className="text-[10px] text-center text-muted-foreground font-mono pt-2">
                  || इति श्री हनुमान चालीसा सम्पूर्ण ||
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default HanumanChalisa;
