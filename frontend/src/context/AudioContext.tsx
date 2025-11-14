import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface AudioContextValue {
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (value: boolean) => void;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

const STORAGE_KEY = 'banana-beast:isMuted';
const AUDIO_PATH = '/audio/bg-music.mp3';
const DEFAULT_VOLUME = 0.35;

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockHandlerRef = useRef<(() => void) | null>(null);

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  });

  const removeUnlockHandlers = useCallback(() => {
    const handler = unlockHandlerRef.current;
    if (!handler) return;
    document.removeEventListener('pointerdown', handler);
    document.removeEventListener('keydown', handler);
    unlockHandlerRef.current = null;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio(AUDIO_PATH);
    audio.loop = true;
    audio.volume = DEFAULT_VOLUME;
    audio.muted = isMuted;
    audioRef.current = audio;

    return () => {
      removeUnlockHandlers();
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [removeUnlockHandlers]);

  const attemptPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isMuted) return;

    audio.play().catch(() => {
      removeUnlockHandlers();
      const unlock = () => {
        const current = audioRef.current;
        if (!current) return;
        current.play()
          .then(() => {
            removeUnlockHandlers();
          })
          .catch(() => {
            // swallow errors, retry on next interaction
          });
      };
      unlockHandlerRef.current = unlock;
      document.addEventListener('pointerdown', unlock);
      document.addEventListener('keydown', unlock);
    });
  }, [isMuted, removeUnlockHandlers]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = isMuted;

    localStorage.setItem(STORAGE_KEY, isMuted ? 'true' : 'false');

    removeUnlockHandlers();

    if (isMuted) {
      audio.pause();
      return;
    }

    attemptPlay();
  }, [attemptPlay, isMuted, removeUnlockHandlers]);

  const value = useMemo(
    () => ({
      isMuted,
      toggleMute: () => setIsMuted((prev) => !prev),
      setMuted: (value: boolean) => setIsMuted(value),
    }),
    [isMuted],
  );

  return (
    <AudioContext.Provider value={value}>
      {children}
      <audio src={AUDIO_PATH} preload="auto" className="hidden" />
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextValue => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
