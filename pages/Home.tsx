import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const Home: React.FC = () => {
  const { settings } = useTheme();

  const getBgImage = () => {
    switch(settings.backgroundMode) {
      case 'prairie': return 'https://images.unsplash.com/photo-1500382017468-9049fee74a62?q=80&w=2000&auto=format&fit=crop';
      case 'rustbelt': return 'https://images.unsplash.com/photo-1517520267751-3580510526e0?q=80&w=2000&auto=format&fit=crop';
      case 'industrial': return 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2000&auto=format&fit=crop';
      case 'grunge': return 'https://picsum.photos/seed/grunge99/1920/1080?grayscale';
      case 'studio': return 'https://picsum.photos/seed/studio/1920/1080?grayscale&blur=2';
      case 'concrete': return 'https://picsum.photos/seed/wall/1920/1080?grayscale';
      case 'void': return 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop';
      default: return '';
    }
  };

  return (
    <div 
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      
      {/* Background Layer */}
      <div className={`absolute inset-0 z-0 transition-all duration-1000 ${settings.backgroundMode === 'clean' ? 'bg-transparent' : ''}`}>
        {settings.backgroundMode !== 'clean' && (
          <img 
            src={getBgImage()} 
            alt="Environment"
            className={`w-full h-full object-cover transition-all duration-700 ${settings.invertColors ? 'invert' : ''} contrast-150 brightness-[0.4]`}
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center mix-blend-difference text-white">
        <h1 className="text-[18vw] leading-none font-bold tracking-tighter opacity-95 select-none hover:tracking-[-0.05em] hover:text-[#ff0000] transition-all duration-700 cursor-default">
          SZN 1
        </h1>
        <p className="uppercase tracking-normal text-2xl md:text-4xl mt-4 font-bold opacity-90 hover:text-[#ff0000] transition-colors duration-500 cursor-default">
          BrockAtticus
        </p>
      </div>

      {/* Bottom Left Label */}
      <div className="absolute bottom-12 left-12 text-white/60 text-sm uppercase tracking-[0.3em] hover:text-[#ff0000] transition-colors cursor-default">
        EST_2028
      </div>

      {/* Bottom Right Label - Coordinates */}
      <div className="absolute bottom-12 right-12 text-white/60 text-sm uppercase tracking-[0.3em] hover:text-[#ff0000] transition-colors cursor-default">
        LOC: 34.0522° N, 118.2437° W
      </div>
    </div>
  );
};