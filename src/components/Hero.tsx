import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-4">
      {/* Floating liquid blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-glow-primary/10 liquid-drop animate-float blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-glow-accent/8 liquid-drop animate-float blur-3xl" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-glow-primary/5 liquid-drop blur-[100px]" style={{ animationDelay: '-5s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center max-w-3xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full glass text-sm font-mono text-muted-foreground"
        >
          ✦ stories · poetry · feelings ✦
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-6">
          <span className="text-gradient-primary glow-text">Habu</span>
          <span className="text-foreground"> Says</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Alfaaz jo dil se nikalte hain, kahaniyaan jo rooh ko chhoo jaati hain.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex justify-center"
        >
          <div className="w-px h-16 bg-gradient-to-b from-primary/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
