import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, RefreshCw } from 'lucide-react';

interface Shlok {
  chapter: number;
  verse: number;
  sanskrit: string;
  translation: string;
}

// Collection of important Bhagavad Gita shlokas
const gitaShlokas: Shlok[] = [
  { chapter: 2, verse: 47, sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥", translation: "Tumhara adhikaar sirf karm karne mein hai, uske phal mein kabhi nahi. Karm ke phal ka kaaran mat bano, aur karm na karne mein bhi asakti mat rakho." },
  { chapter: 2, verse: 14, sanskrit: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः। आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥", translation: "He Arjun! Sukh-dukh, sardi-garmi jaise anubhav aate-jaate rehte hain. Ye sab anitya hain, inhe sehen karna seekho." },
  { chapter: 2, verse: 20, sanskrit: "न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः। अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे॥", translation: "Aatma na kabhi janmti hai, na marti hai. Ye ajamna, nitya, shaashvat hai. Shareer ke naash hone par bhi aatma ka naash nahi hota." },
  { chapter: 2, verse: 22, sanskrit: "वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि। तथा शरीराणि विहाय जीर्णान्यन्यानि संयाति नवानि देही॥", translation: "Jaise insaan purane kapde utaarkar naye pehen leta hai, waise hi aatma purane shareer ko chhodkar naya shareer dhaaran karti hai." },
  { chapter: 2, verse: 62, sanskrit: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते। सङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते॥", translation: "Vishyon ke baare mein sochne se unse lagaav hota hai, lagaav se kaamna paida hoti hai, aur kaamna poori na hone par krodh utpann hota hai." },
  { chapter: 3, verse: 21, sanskrit: "यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः। स यत्प्रमाणं कुरुते लोकस्तदनुवर्तते॥", translation: "Shreshth purush jo-jo aacharan karta hai, doosre log bhi wahi karte hain. Wo jo pramaad (standard) sthapit karta hai, duniya usi ka anusaran karti hai." },
  { chapter: 3, verse: 27, sanskrit: "प्रकृतेः क्रियमाणानि गुणैः कर्माणि सर्वशः। अहङ्कारविमूढात्मा कर्ताहमिति मन्यते॥", translation: "Prakriti ke gunon dwara saare karm kiye jaate hain, lekin ahankaar se mohit vyakti sochta hai ki main hi karta hoon." },
  { chapter: 4, verse: 7, sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥", translation: "Jab jab dharma ka naash hota hai aur adharma badhta hai, tab tab main khud ko prakat karta hoon." },
  { chapter: 4, verse: 8, sanskrit: "परित्राणाय साधूनां विनाशाय च दुष्कृताम्। धर्मसंस्थापनार्थाय सम्भवामि युगे युगे॥", translation: "Sajjano ki raksha ke liye, dushton ke vinaash ke liye, aur dharma ki sthapna ke liye main yug-yug mein avataar leta hoon." },
  { chapter: 4, verse: 38, sanskrit: "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते। तत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति॥", translation: "Is sansar mein gyaan ke samaan pavitra kuch bhi nahi hai. Yog mein siddh hone par insaan samay aane par apne aap mein ise prapt karta hai." },
  { chapter: 5, verse: 22, sanskrit: "ये हि संस्पर्शजा भोगा दुःखयोनय एव ते। आद्यन्तवन्तः कौन्तेय न तेषु रमते बुधः॥", translation: "Jo bhog indriyon ke sparsh se paida hote hain, wo dukh ke kaaran hain. Unka aarambh aur ant hota hai, isliye buddhimaan purush unme anand nahi lete." },
  { chapter: 6, verse: 5, sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥", translation: "Apne aap ko khud hi upar uthao, apne aap ko giraao mat. Kyunki insaan khud hi apna mitra hai aur khud hi apna shatru." },
  { chapter: 6, verse: 34, sanskrit: "चञ्चलं हि मनः कृष्ण प्रमाथि बलवद्दृढम्। तस्याहं निग्रहं मन्ये वायोरिव सुदुष्करम्॥", translation: "He Krishna! Ye mann bahut chanchal, uddam, balwaan aur dridh hai. Ise rokna mujhe hawa ko rokne jitna mushkil lagta hai." },
  { chapter: 6, verse: 35, sanskrit: "असंशयं महाबाहो मनो दुर्निग्रहं चलम्। अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते॥", translation: "Nishchay hi mann ko rokna bahut kathin hai, lekin abhyaas aur vairaagya se ise vash mein kiya ja sakta hai." },
  { chapter: 9, verse: 22, sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते। तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥", translation: "Jo log ananya bhav se mera chintan karte hue meri upasna karte hain, un nitya yukta bhakton ka yog-kshema main swayam vahaan karta hoon." },
  { chapter: 9, verse: 27, sanskrit: "यत्करोषि यदश्नासि यज्जुहोषि ददासि यत्। यत्तपस्यसि कौन्तेय तत्कुरुष्व मदर्पणम्॥", translation: "Jo bhi tum karo, jo bhi khaao, jo bhi havan karo, jo bhi daan do, jo bhi tap karo — sab mujhe arpan karo." },
  { chapter: 11, verse: 32, sanskrit: "कालोऽस्मि लोकक्षयकृत्प्रवृद्धो लोकान्समाहर्तुमिह प्रवृत्तः।", translation: "Main kaal hoon, sansar ka vinaash karne waala. Main yaahan sab logon ko samhaar karne aaya hoon." },
  { chapter: 12, verse: 13, sanskrit: "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च। निर्ममो निरहङ्कारः समदुःखसुखः क्षमी॥", translation: "Jo kisi se dwesh nahi rakhta, sabka mitra aur dayalu hai, mamta aur ahankar se mukt hai, sukh-dukh mein sam rehta hai aur kshamasheel hai — wo mujhe priy hai." },
  { chapter: 15, verse: 15, sanskrit: "सर्वस्य चाहं हृदि सन्निविष्टो मत्तः स्मृतिर्ज्ञानमपोहनं च।", translation: "Main sabke hriday mein sthit hoon. Mujhse hi smriti, gyaan aur unka lop hota hai." },
  { chapter: 18, verse: 66, sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥", translation: "Sab dharmon ko chhodkar sirf meri sharan mein aao. Main tumhe sab paapon se mukt karunga, chinta mat karo." },
  { chapter: 18, verse: 78, sanskrit: "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः। तत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम॥", translation: "Jahaan Yogeshwar Krishna hain aur jahaan Dhanurdhari Arjun hain, wahaan shri, vijay, vibhuti aur nishchit neeti hai — yahi mera mat hai." },
  { chapter: 2, verse: 3, sanskrit: "क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते। क्षुद्रं हृदयदौर्बल्यं त्यक्त्वोत्तिष्ठ परन्तप॥", translation: "He Arjun! Kamzori mat dikhao, ye tumhe shobha nahi deta. Dil ki kamzori chhodo aur khade ho jao, he Parantap!" },
  { chapter: 2, verse: 38, sanskrit: "सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ। ततो युद्धाय युज्यस्व नैवं पापमवाप्स्यसि॥", translation: "Sukh-dukh, laabh-haani, jeet-haar ko samaan samajh kar yudh ke liye tayyar ho jao. Aise karne se tumhe paap nahi lagega." },
  { chapter: 3, verse: 35, sanskrit: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्। स्वधर्मे निधनं श्रेयः परधर्मो भयावहः॥", translation: "Apna dharm agar adhura bhi ho toh doosre ke dharm se achha hai. Apne dharm mein marna bhi shreshtth hai, doosre ka dharm bhayaanak hai." },
  { chapter: 7, verse: 7, sanskrit: "मत्तः परतरं नान्यत्किञ्चिदस्ति धनञ्जय। मयि सर्वमिदं प्रोतं सूत्रे मणिगणा इव॥", translation: "He Arjun! Mujhse badhkar kuch bhi nahi hai. Jaise motiyon ko dhage mein piroya jaata hai, waise hi yeh sab kuch mujh mein piroya hua hai." },
  { chapter: 7, verse: 19, sanskrit: "बहूनां जन्मनामन्ते ज्ञानवान्मां प्रपद्यते। वासुदेवः सर्वमिति स महात्मा सुदुर्लभः॥", translation: "Bahut janam ke baad gyaanvaan mujhe prapt hota hai — 'Vasudev hi sab kuch hai' aise samajhne waala mahatma bahut durlabh hai." },
  { chapter: 10, verse: 20, sanskrit: "अहमात्मा गुडाकेश सर्वभूताशयस्थितः। अहमादिश्च मध्यं च भूतानामन्त एव च॥", translation: "He Arjun! Main sabhi praniyon ke hriday mein sthit aatma hoon. Main hi sabka aadi, madhya aur ant hoon." },
  { chapter: 13, verse: 28, sanskrit: "समं सर्वेषु भूतेषु तिष्ठन्तं परमेश्वरम्। विनश्यत्स्वविनश्यन्तं यः पश्यति स पश्यति॥", translation: "Jo sabhi praniyon mein samaan roop se sthit Parameshwar ko dekhta hai — jo nashwar mein anashwar ko dekhta hai — wohi sach mein dekhta hai." },
  { chapter: 14, verse: 26, sanskrit: "मां च योऽव्यभिचारेण भक्तियोगेन सेवते। स गुणान्समतीत्यैतान्ब्रह्मभूयाय कल्पते॥", translation: "Jo nishchhal bhakti yog se meri seva karta hai, wo teenon gunon se paar hokar Brahm ko prapt hone yogya ho jaata hai." },
  { chapter: 16, verse: 21, sanskrit: "त्रिविधं नरकस्येदं द्वारं नाशनमात्मनः। कामः क्रोधस्तथा लोभस्तस्मादेतत्त्रयं त्यजेत्॥", translation: "Kaam, krodh aur lobh — ye teen narak ke dwaar hain jo aatma ka naash karte hain. Isliye in teenon ko tyaag dena chahiye." },
  { chapter: 17, verse: 3, sanskrit: "सत्त्वानुरूपा सर्वस्य श्रद्धा भवति भारत। श्रद्धामयोऽयं पुरुषो यो यच्छ्रद्धः स एव सः॥", translation: "Sabki shraddha unke swabhav ke anusaar hoti hai. Manushya shraddhamay hai — jis cheez mein jiski shraddha hai, wahi wo hai." },
];

function getDailyShlokas(): Shlok[] {
  // Use the day of year as seed to get 3 consistent shlokas per day
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  const result: Shlok[] = [];
  const total = gitaShlokas.length;
  for (let i = 0; i < 3; i++) {
    const idx = (dayOfYear * 3 + i) % total;
    result.push(gitaShlokas[idx]);
  }
  return result;
}

const DailyGitaShlok = () => {
  const [shlokas] = useState<Shlok[]>(getDailyShlokas);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-12 max-w-lg mx-auto"
    >
      <div className="text-center mb-4">
        <h2 className="text-lg font-display font-bold text-foreground flex items-center justify-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Aaj Ke Gita Shlok
          <BookOpen className="w-5 h-5 text-primary" />
        </h2>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Roz 3 naye shlok Shrimad Bhagavad Gita se 🙏
        </p>
      </div>

      {/* Shlok dots */}
      <div className="flex justify-center gap-2 mb-4">
        {shlokas.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to shlok ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === activeIndex ? 'bg-primary scale-125' : 'bg-border hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
          className="glass rounded-2xl p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-primary font-semibold">
              Adhyay {shlokas[activeIndex].chapter}, Shlok {shlokas[activeIndex].verse}
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {activeIndex + 1}/3
            </span>
          </div>

          <p className="text-base leading-relaxed text-foreground font-serif text-center">
            {shlokas[activeIndex].sanskrit}
          </p>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <p className="text-sm text-muted-foreground leading-relaxed">
            {shlokas[activeIndex].translation}
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default DailyGitaShlok;
