import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navigation } from './components/Navigation';
import { Customizer } from './components/Customizer';
import { Home } from './pages/Home';
import { Apparel } from './pages/Apparel';
import { Agent } from './pages/Agent';
import { SketchLab } from './pages/SketchLab';

const AppContent: React.FC = () => {
  const { settings } = useTheme();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const fontSizeClass = {
    small: 'text-xs',
    medium: 'text-base',
    large: 'text-xl'
  }[settings.fontSize];

  const fontFamily = {
    mono: '"Courier Prime", monospace',
    sans: '"Oswald", sans-serif',
    serif: '"Playfair Display", serif',
    display: '"Oswald", sans-serif', 
  }[settings.fontFamily];

  const fontWeight = {
    light: '300',
    normal: '400',
    bold: '900'
  }[settings.fontWeight];

  const accentColor = {
    red: '#ff0000', // Changed to pure bright red
    green: '#16a34a',
    orange: '#ea580c',
    purple: '#9333ea',
    yellow: '#eab308',
    white: '#ffffff',
  }[settings.accentColor];

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${fontSizeClass} ${settings.invertColors ? 'bg-black invert' : 'bg-[#f2f2f2]'}`}
      style={{ 
        fontFamily: isHomePage ? '"Times New Roman", Times, serif' : fontFamily, 
        fontWeight: isHomePage ? 'bold' : fontWeight,
      } as React.CSSProperties}
    >
      <style>{`
        :root {
          --theme-accent: ${accentColor};
          --theme-weight: ${fontWeight};
          --bright-red: #ff0000;
        }
        
        /* Global Typography Rules */
        h1, h2, h3, h4, h5, h6, p, span, a, li, button, input, textarea, label, div {
          color: white !important;
          mix-blend-mode: difference;
          transition: color 0.2s ease-in-out;
        }

        h1:hover, h2:hover, h3:hover, h4:hover, h5:hover, h6:hover, p:hover, span:hover, a:hover, li:hover, button:hover, input:hover, textarea:hover, label:hover {
          color: var(--bright-red) !important;
        }

        /* Global Interaction Highlights */
        a, button, input, select, textarea {
          transition: all 0.2s ease-in-out;
        }

        a:hover, button:hover, a:hover *, button:hover * {
          color: var(--bright-red) !important;
        }

        a:active, button:active {
          background-color: var(--bright-red) !important;
          color: white !important;
        }

        input:focus, textarea:focus {
          border-color: var(--bright-red) !important;
          outline: none;
        }

        /* Section Highlights */
        .interactive-section:hover {
          outline: 1px solid var(--bright-red);
          background-color: rgba(255, 0, 0, 0.02);
        }

        ${settings.fontFamily === 'display' ? 'h1, h2, h3 { font-weight: 900 !important; text-transform: uppercase !important; letter-spacing: -0.05em !important; }' : ''}
        
        .text-red-600 { color: var(--bright-red) !important; }
        .bg-red-600 { background-color: var(--bright-red) !important; }
        .border-red-600 { border-color: var(--bright-red) !important; }
        .decoration-red-600 { text-decoration-color: var(--bright-red) !important; }
        
        .hover\\:text-red-600:hover { color: var(--bright-red) !important; }
        .hover\\:bg-red-600:hover { background-color: var(--bright-red) !important; }
        .hover\\:border-red-600:hover { border-color: var(--bright-red) !important; }
        .focus\\:border-red-600:focus { border-color: var(--bright-red) !important; }
      `}</style>

      <div className="noise-overlay" />
      <Navigation />
      <Customizer />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apparel" element={<Apparel />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/sketch-lab" element={<SketchLab />} />
        </Routes>
      </main>

      {/* Global footer is hidden on Home to let page-specific EST_2028 labels shine */}
      {!isHomePage && (
        <footer className="fixed bottom-0 left-0 w-full p-2 flex justify-between items-center z-30 pointer-events-none mix-blend-difference text-white text-[8px] uppercase tracking-[0.5em] font-mono">
          <span>EST_2025_PROJECT</span>
          <span>BROCKATTICUS_SZN_1_READY</span>
        </footer>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;