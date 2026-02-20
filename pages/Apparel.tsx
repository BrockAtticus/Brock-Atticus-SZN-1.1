import React from 'react';
import { ApparelItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Heart } from 'lucide-react';

const ITEMS: ApparelItem[] = [
  { id: '1', name: 'POST_PUNK_JACKET', price: 1200, type: 'JACKET', imageUrl: 'https://picsum.photos/seed/apparel1/600/800' },
  { id: '2', name: 'STIPPLE_HOODIE', price: 450, type: 'HOODIE', imageUrl: 'https://picsum.photos/seed/apparel2/600/800' },
  { id: '3', name: 'VOID_TEE', price: 280, type: 'TSHIRT', imageUrl: 'https://picsum.photos/seed/apparel3/600/800' },
  { id: '4', name: 'WAXED_CARGO', price: 890, type: 'PANT', imageUrl: 'https://picsum.photos/seed/apparel4/600/800' },
  { id: '5', name: 'SZN_BOMBER', price: 1100, type: 'JACKET', imageUrl: 'https://picsum.photos/seed/apparel5/600/800', soldOut: true },
  { id: '6', name: 'DISTRESSED_FLNL', price: 350, type: 'TSHIRT', imageUrl: 'https://picsum.photos/seed/apparel6/600/800' },
  { id: '7', name: 'CORE_LEATHER', price: 2500, type: 'JACKET', imageUrl: 'https://picsum.photos/seed/apparel7/600/800' },
  { id: '8', name: 'THERMAL_KNIT', price: 600, type: 'HOODIE', imageUrl: 'https://picsum.photos/seed/apparel8/600/800' },
  { id: '9', name: 'MOTO_PANT', price: 900, type: 'PANT', imageUrl: 'https://picsum.photos/seed/apparel9/600/800' },
  { id: '10', name: 'UTILITY_VEST', price: 500, type: 'JACKET', imageUrl: 'https://picsum.photos/seed/apparel10/600/800' },
  { id: '11', name: 'DUSK_HOODIE', price: 400, type: 'HOODIE', imageUrl: 'https://picsum.photos/seed/apparel11/600/800' },
  { id: '12', name: 'RAW_TSHIRT', price: 200, type: 'TSHIRT', imageUrl: 'https://picsum.photos/seed/apparel12/600/800' },
  { id: '13', name: 'GRAVEYARD_DENIM', price: 800, type: 'PANT', imageUrl: 'https://picsum.photos/seed/apparel13/600/800' },
  { id: '14', name: 'BONE_JACKET', price: 1400, type: 'JACKET', imageUrl: 'https://picsum.photos/seed/apparel14/600/800' },
  { id: '15', name: 'ONYX_HOODIE', price: 450, type: 'HOODIE', imageUrl: 'https://picsum.photos/seed/apparel15/600/800' },
  { id: '16', name: 'CEMENT_TEE', price: 180, type: 'TSHIRT', imageUrl: 'https://picsum.photos/seed/apparel16/600/800' },
];

export const Apparel: React.FC = () => {
  const { settings, favorites, toggleFavorite } = useTheme();

  const isFavorite = (id: string) => favorites.some(f => f.id === id);

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
    <div className={`relative min-h-screen transition-colors duration-500 ${settings.invertColors ? 'bg-black text-white' : 'bg-[#f0f0f0] text-black'}`}>
      
      {/* Background Layer */}
      <div className={`fixed inset-0 z-0 transition-all duration-1000 ${settings.backgroundMode === 'clean' ? 'bg-transparent' : ''}`}>
        {settings.backgroundMode !== 'clean' && (
          <img 
            src={getBgImage()} 
            alt="Environment"
            className={`w-full h-full object-cover transition-all duration-700 ${settings.invertColors ? 'invert' : ''} contrast-150 brightness-[0.25] grayscale`}
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 pt-16 pb-12 px-1">
        
        {/* Centered Small Header */}
        <div className="flex flex-col items-center justify-center py-10 md:py-14">
          <h2 
            className="text-xl md:text-2xl font-bold tracking-normal hover:text-[#ff0000] transition-colors cursor-default text-center text-white mix-blend-difference"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            SZN 1 Automne/Hiver
          </h2>
          <span className="text-[7px] uppercase tracking-[0.6em] font-mono opacity-40 text-white mix-blend-difference mt-2">EST_2028_SZN_1</span>
        </div>

        {/* Ultra Dense Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1 ${settings.showGrid ? 'ring-1 ring-current' : ''}`}>
          {ITEMS.map((item) => (
            <div key={item.id} className="group relative border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden flex flex-col interactive-section transition-all duration-300 hover:border-[#ff0000]/50">
              
              <div className="relative aspect-[3/4.5] overflow-hidden bg-zinc-900">
                <img 
                  src={`${item.imageUrl}?grayscale&contrast=150`} 
                  alt={item.name}
                  className={`w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-105 filter grayscale ${settings.highContrast ? 'contrast-[2] brightness-125' : 'contrast-125'}`}
                  loading="lazy"
                />
                
                <button 
                  onClick={(e) => { e.preventDefault(); toggleFavorite(item); }}
                  className="absolute top-2 right-2 z-20 p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  <Heart className={`w-5 h-5 transition-all ${isFavorite(item.id) ? 'fill-[#ff0000] text-[#ff0000] scale-125' : 'text-white hover:text-[#ff0000] hover:scale-110'}`} />
                </button>

                {item.soldOut && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                    <span className="text-white text-[9px] font-black uppercase tracking-[0.3em] border border-white px-2 py-1 rotate-12">OUT_OF_STOCK</span>
                  </div>
                )}

                {/* Hover Label Overlay */}
                <div className="absolute inset-0 bg-[#ff0000]/0 group-hover:bg-[#ff0000]/5 transition-all duration-300 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100">
                  <button className="bg-white text-black text-[10px] font-bold uppercase py-2 tracking-widest hover:bg-[#ff0000] hover:text-white transition-colors">
                    VIEW_DETAILS
                  </button>
                </div>
              </div>

              <div className="p-2 border-t border-white/10 flex flex-col gap-1 group-hover:border-[#ff0000]/30 transition-colors text-white">
                <div className="flex justify-between items-start gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-tighter leading-none truncate group-hover:text-[#ff0000] transition-colors">{item.name}</h3>
                  <span className="text-[9px] font-bold opacity-70">${item.price}</span>
                </div>
                <p className="text-[8px] uppercase tracking-widest opacity-40 font-mono">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 px-4 border-t border-white/10 pt-10 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-40 text-white">
          <div className="text-[9px] uppercase tracking-widest leading-loose hover:opacity-100 hover:text-[#ff0000] transition-all cursor-default">
            BROCKATTICUS CORP © 2025<br/>ALL RIGHTS RESERVED.<br/>MANUFACTURED IN VOID.
          </div>
          <div className="text-[9px] uppercase tracking-widest leading-loose text-center hover:opacity-100 hover:text-[#ff0000] transition-all cursor-default">
            NO RETURNS.<br/>NO EXCHANGES.<br/>NO REGRETS.
          </div>
          <div className="text-[9px] uppercase tracking-widest leading-loose text-right hover:opacity-100 hover:text-[#ff0000] transition-all cursor-default">
            STATUS: ALPHA_01<br/>AUTH: SYNCED<br/>ENCRYPTED_DESIGN
          </div>
        </div>
      </div>
    </div>
  );
};