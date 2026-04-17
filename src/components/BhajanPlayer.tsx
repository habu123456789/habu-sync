import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface Bhajan {
  title: string;
  artist: string;
  emoji: string;
  src: string;
}

// Public-domain / freely streamable devotional audio (Internet Archive).
const bhajans: Bhajan[] = [
  {
    title: 'Hare Krishna Maha Mantra',
    artist: 'Traditional',
    emoji: '🦚',
    src: 'https://archive.org/download/HareKrishnaMahaMantra_201805/Hare%20Krishna%20Maha%20Mantra.mp3',
  },
  {
    title: 'Hanuman Chalisa',
    artist: 'Traditional',
    emoji: '🐒',
    src: 'https://archive.org/download/HanumanChalisa_201806/Hanuman%20Chalisa.mp3',
  },
  {
    title: 'Om Namah Shivaya',
    artist: 'Traditional',
    emoji: '🔱',
    src: 'https://archive.org/download/OmNamahShivayaChanting/Om%20Namah%20Shivaya.mp3',
  },
  {
    title: 'Gayatri Mantra',
    artist: 'Traditional',
    emoji: '🕉️',
    src: 'https://archive.org/download/GayatriMantra108Times/Gayatri%20Mantra.mp3',
  },
  {
    title: 'Shri Ram Jai Ram',
    artist: 'Traditional',
    emoji: '🏹',
    src: 'https://archive.org/download/ShriRamJaiRamJaiJaiRam/Shri%20Ram%20Jai%20Ram.mp3',
  },
];

const formatTime = (s: number) => {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const BhajanPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  const current = bhajans[index];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(0);
    setDuration(0);
    setError(false);
    if (playing) {
      setLoading(true);
      audio.play().catch(() => {
        setError(true);
        setPlaying(false);
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        setLoading(true);
        setError(false);
        await audio.play();
        setPlaying(true);
      } catch {
        setError(true);
        setPlaying(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const next = () => setIndex((i) => (i + 1) % bhajans.length);
  const prev = () => setIndex((i) => (i - 1 + bhajans.length) % bhajans.length);

  const onSeek = (val: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const t = (val[0] / 100) * duration;
    audio.currentTime = t;
    setProgress(val[0]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12 max-w-lg mx-auto"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-sm font-mono text-muted-foreground tracking-widest uppercase flex items-center gap-2">
          <Music className="w-4 h-4 text-primary" />
          Bhajan & Kirtan
          <Music className="w-4 h-4 text-primary" />
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        {/* Now playing */}
        <div className="flex items-center gap-4">
          <motion.div
            animate={playing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ repeat: playing ? Infinity : 0, duration: 6, ease: 'linear' }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-3xl shrink-0 border border-primary/20"
          >
            {current.emoji}
          </motion.div>
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <h4 className="text-base font-display font-bold text-foreground truncate">
                  {current.title}
                </h4>
                <p className="text-xs text-muted-foreground truncate">{current.artist}</p>
              </motion.div>
            </AnimatePresence>
            {error && (
              <p className="text-[11px] text-destructive mt-1 font-mono">
                Track load nahi hua — agla try karo
              </p>
            )}
          </div>
        </div>

        {/* Seek */}
        <div className="space-y-1">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={onSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>{formatTime((progress / 100) * duration)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setMuted((m) => !m)}
              className="rounded-full h-9 w-9"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Slider
              value={[muted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={(v) => {
                setMuted(false);
                setVolume(v[0] / 100);
              }}
              className="w-20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={prev}
              className="rounded-full h-10 w-10"
              aria-label="Previous"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              onClick={togglePlay}
              className="rounded-full h-12 w-12 bg-gradient-to-br from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/30"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : playing ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={next}
              className="rounded-full h-10 w-10"
              aria-label="Next"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          <div className="w-[88px]" />
        </div>

        {/* Playlist */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-2">
            Playlist
          </p>
          <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
            {bhajans.map((b, i) => (
              <button
                key={b.title}
                onClick={() => {
                  if (i === index) {
                    togglePlay();
                  } else {
                    setIndex(i);
                    setPlaying(true);
                  }
                }}
                className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                  i === index
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-primary/5 border border-transparent'
                }`}
              >
                <span className="text-lg">{b.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-display font-semibold truncate ${
                      i === index ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {b.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{b.artist}</p>
                </div>
                {i === index && playing && (
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-0.5 bg-primary animate-pulse h-full" />
                    <span className="w-0.5 bg-primary animate-pulse h-2/3" style={{ animationDelay: '0.2s' }} />
                    <span className="w-0.5 bg-primary animate-pulse h-1/2" style={{ animationDelay: '0.4s' }} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-center text-muted-foreground font-mono">
          🎶 Bhakti se sune — Radhe Radhe
        </p>
      </div>

      <audio
        ref={audioRef}
        src={current.src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setDuration((e.target as HTMLAudioElement).duration);
          setLoading(false);
        }}
        onTimeUpdate={(e) => {
          const a = e.target as HTMLAudioElement;
          if (a.duration) setProgress((a.currentTime / a.duration) * 100);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={next}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
          setPlaying(false);
        }}
      />
    </motion.div>
  );
};

export default BhajanPlayer;
