import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "Synthwave Vibes",
    artist: "Neon AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/synth/200/200"
  },
  {
    id: 2,
    title: "Cyberpunk Pulse",
    artist: "Glitch Master",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/cyber/200/200"
  },
  {
    id: 3,
    title: "Neon Dreams",
    artist: "Retro Future",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon/200/200"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSkipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleSkipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    handleSkipForward();
  };

  return (
    <div className="w-full max-w-[400px] bg-dark/90 p-6 glitch-border flex flex-col gap-4 font-pixel">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 overflow-hidden flex-shrink-0 border border-magenta shadow-[0_0_10px_#ff00ff]">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className={`w-full h-full object-cover transition-transform duration-1000 ${isPlaying ? 'scale-110 grayscale-0' : 'scale-100 grayscale'}`}
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-magenta/20">
              <Music className="text-cyan animate-bounce" size={24} />
            </div>
          )}
        </div>
        
        <div className="flex-grow overflow-hidden">
          <h3 className="text-magenta font-bold truncate magenta-text text-xl">{currentTrack.title}</h3>
          <p className="text-cyan text-sm truncate uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-dark border border-magenta/30 overflow-hidden">
        <div 
          className="h-full bg-magenta transition-all duration-300 shadow-[0_0_15px_#ff00ff]" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-2">
        <button 
          onClick={handleSkipBack}
          className="text-cyan hover:text-magenta transition-colors"
        >
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-14 h-14 bg-magenta flex items-center justify-center text-dark hover:bg-cyan transition-colors glitch-border"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        
        <button 
          onClick={handleSkipForward}
          className="text-cyan hover:text-magenta transition-colors"
        >
          <SkipForward size={24} />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2 text-cyan/40 text-xs">
        <Volume2 size={14} />
        <div className="flex-grow h-1 bg-dark border border-cyan/10 overflow-hidden">
          <div className="w-2/3 h-full bg-cyan/40" />
        </div>
      </div>
    </div>
  );
};
