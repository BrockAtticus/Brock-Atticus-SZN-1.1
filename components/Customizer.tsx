import React from 'react';
import { X, Settings, Eye, Grid, Type, Palette, Image as ImageIcon, Monitor, Bold } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AccentColor, FontFamily, BackgroundMode } from '../types';

export const Customizer: React.FC = () => {
  const { isMenuOpen, toggleMenu, settings, updateSetting } = useTheme();

  const colors: { id: AccentColor; hex: string }[] = [
    { id: 'red', hex: '#dc2626' },
    { id: 'green', hex: '#16a34a' },
    { id: 'orange', hex: '#ea580c' },
    { id: 'purple', hex: '#9333ea' },
    { id: 'yellow', hex: '#eab308' },
    { id: 'white', hex: '#ffffff' },
  ];

  const fonts: { id: FontFamily; label: string }[] = [
    { id: 'mono', label: 'Mono' },
    { id: 'sans', label: 'Sans' },
    { id: 'serif', label: 'Serif' },
    { id: 'display', label: 'Impact' },
  ];

  const bgModes: { id: BackgroundMode; label: string }[] = [
    { id: 'prairie', label: 'Prairie' },
    { id: 'rustbelt', label: 'Rust Belt' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'grunge', label: 'Grunge' },
    { id: 'studio', label: 'Studio' },
    { id: 'concrete', label: 'Stone' },
    { id: 'void', label: 'Void' },
    { id: 'clean', label: 'Clean' },
  ];

  return (
    <>
      {!isMenuOpen && (
        <button 
          onClick={toggleMenu}
          className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-black text-white p-3 hover:bg-[#ff0000] transition-colors z-50 uppercase text-xs tracking-widest writing-vertical-rl flex items-center gap-2"
          style={{ writingMode: 'vertical-rl' }}
        >
          <Settings className="w-3 h-3 mb-2" /> CONTROL_PANEL
        </button>
      )}

      <div 
        className={`fixed inset-y-0 right-0 w-80 bg-[#0a0a0a] text-[#f2f2f2] shadow-2xl transform transition-transform duration-300 ease-in-out z-50 border-l border-zinc-800 flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black tracking-tighter flex items-center gap-2">
              BROCK_SYS v1.0
            </h2>
            <button onClick={toggleMenu} className="hover:text-[#ff0000] transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-10">
            {/* Color Section */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold flex items-center gap-2">
                <Palette className="w-3 h-3" /> System Accent
              </label>
              <div className="grid grid-cols-7 gap-1">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateSetting('accentColor', c.id)}
                    className={`aspect-square border border-zinc-800 transition-all ${settings.accentColor === c.id ? 'border-white scale-110 z-10' : 'hover:border-zinc-500'}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Typography Section */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold flex items-center gap-2">
                <Type className="w-3 h-3" /> Typography
              </label>
              <div className="grid grid-cols-2 gap-1">
                {fonts.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => updateSetting('fontFamily', f.id)}
                    className={`border border-zinc-800 py-2 text-[10px] uppercase hover:bg-zinc-900 transition-all ${settings.fontFamily === f.id ? 'bg-white text-black font-black' : ''}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1 mt-2">
                {(['light', 'normal', 'bold'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => updateSetting('fontWeight', w)}
                    className={`flex-1 border border-zinc-800 py-1 text-[9px] uppercase hover:bg-zinc-900 transition-all ${settings.fontWeight === w ? 'bg-zinc-200 text-black' : ''}`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Environment Section */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold flex items-center gap-2">
                <ImageIcon className="w-3 h-3" /> Background Env
              </label>
              <div className="grid grid-cols-2 gap-1">
                {bgModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => updateSetting('backgroundMode', mode.id)}
                    className={`border border-zinc-800 py-2 text-[10px] uppercase hover:bg-zinc-900 transition-all ${settings.backgroundMode === mode.id ? 'bg-white text-black font-black' : ''}`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Logic Section */}
            <div className="space-y-4 pt-6 border-t border-zinc-800">
              <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold flex items-center gap-2">
                <Monitor className="w-3 h-3" /> Hardware Display
              </label>
              
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-zinc-400">Invert Matrix</span>
                <button 
                  onClick={() => updateSetting('invertColors', !settings.invertColors)}
                  className={`w-10 h-5 border border-zinc-700 transition-colors ${settings.invertColors ? 'bg-white' : 'bg-transparent'}`}
                >
                  <div className={`w-4 h-full bg-zinc-500 transition-transform ${settings.invertColors ? 'translate-x-5 bg-black' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-zinc-400">Debug Grid</span>
                <button 
                  onClick={() => updateSetting('showGrid', !settings.showGrid)}
                  className={`w-10 h-5 border border-zinc-700 transition-colors ${settings.showGrid ? 'bg-white' : 'bg-transparent'}`}
                >
                  <div className={`w-4 h-full bg-zinc-500 transition-transform ${settings.showGrid ? 'translate-x-5 bg-black' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800 text-[9px] text-zinc-600 uppercase text-center tracking-[0.4em] font-mono">
          STATUS: OPERATIONAL // SYNC: 100%
        </div>
      </div>

      {isMenuOpen && (
        <div 
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
        />
      )}
    </>
  );
};