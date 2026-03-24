import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Music, Gamepad2, Zap, Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative selection:bg-magenta selection:text-dark">
      {/* Glitch Overlays */}
      <div className="scanline" />
      <div className="noise-overlay" />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-8 z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Zap className="text-cyan animate-pulse" size={32} />
          <h1 className="text-4xl md:text-7xl font-display font-bold tracking-tighter cyan-text">
            SYSTEM <span className="magenta-text">FAILURE</span>
          </h1>
          <Zap className="text-magenta animate-pulse" size={32} />
        </div>
        <p className="text-magenta font-pixel text-lg tracking-[0.5em] uppercase animate-pulse">
          SNAKE_PROTOCOL_V2.6 // UNSTABLE_BUILD
        </p>
      </motion.header>

      {/* Main Content Grid */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
        
        {/* Left Column: Info/Stats */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex lg:col-span-3 flex-col gap-6"
        >
          <div className="p-6 bg-dark/80 glitch-border flex flex-col gap-4">
            <div className="flex items-center gap-2 text-cyan font-pixel text-xl">
              <Terminal size={18} />
              <span>[DATA_STREAM]</span>
            </div>
            <div className="space-y-4 font-pixel">
              <div className="flex justify-between items-end">
                <span className="text-sm text-magenta">MAX_SCORE</span>
                <span className="text-2xl text-cyan">2450.00</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm text-magenta">ITERATION</span>
                <span className="text-2xl text-cyan">04</span>
              </div>
              <div className="w-full h-2 bg-dark border border-cyan/30">
                <div className="w-1/3 h-full bg-cyan shadow-[0_0_15px_#00ffff]" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-dark/80 glitch-border flex flex-col gap-4">
            <div className="flex items-center gap-2 text-magenta font-pixel text-xl">
              <Music size={18} />
              <span>[AUDIO_LOG]</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-magenta animate-ping" />
                <span className="text-sm text-cyan font-pixel uppercase">NEURAL_SYNTH_ACTIVE</span>
              </div>
              <p className="text-xs text-magenta/80 font-pixel leading-relaxed">
                DECRYPTING_AUDIO_PACKETS... 
                STATUS: NOMINAL
                RHYTHM_SYNC: 98.4%
              </p>
            </div>
          </div>
        </motion.div>

        {/* Center Column: Game */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 flex justify-center"
        >
          <SnakeGame />
        </motion.div>

        {/* Right Column: Music Player */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-3 flex flex-col items-center lg:items-end gap-6"
        >
          <MusicPlayer />
          
          <div className="hidden lg:block p-6 bg-dark/80 glitch-border w-full">
            <h4 className="text-sm text-cyan font-pixel mb-4 uppercase tracking-widest">[COMMAND_LIST]</h4>
            <ul className="space-y-3 text-xs font-pixel text-magenta">
              <li className="flex justify-between border-b border-cyan/10 pb-1">
                <span>AXIS_Y</span>
                <span className="text-cyan">UP / DOWN</span>
              </li>
              <li className="flex justify-between border-b border-cyan/10 pb-1">
                <span>AXIS_X</span>
                <span className="text-cyan">LEFT / RIGHT</span>
              </li>
              <li className="flex justify-between border-b border-cyan/10 pb-1">
                <span>INTERRUPT</span>
                <span className="text-cyan">SPACEBAR</span>
              </li>
              <li className="flex justify-between border-b border-cyan/10 pb-1">
                <span>REBOOT</span>
                <span className="text-cyan">ENTER</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-cyan/40 font-pixel text-sm tracking-widest uppercase z-10">
        &copy; 2026 // GLITCH_ART_PROTOCOL // POWERED_BY_AI_STUDIO
      </footer>
    </div>
  );
}
