import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Heart, User as UserIcon, Mail, Phone, X, LogIn, UserPlus, Radio as RadioIcon } from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { settings, favorites, user, setUser, toggleFavorite } = useTheme();
  const [showContact, setShowContact] = useState(false);
  const [showFavs, setShowFavs] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) => `
    uppercase tracking-normal text-xs md:text-sm transition-all duration-300 hover:text-[#ff0000] whitespace-nowrap font-bold
    ${isActive(path) ? 'underline decoration-2 underline-offset-4 decoration-[#ff0000]' : 'font-bold'}
  `;

  const linkStyle = { fontFamily: '"Times New Roman", Times, serif' };

  const btnClass = "p-2 hover:text-[#ff0000] transition-colors relative flex items-center justify-center";

  // Auth form states
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ email, isLoggedIn: true, name: email.split('@')[0] });
    setShowAuth(false);
    setEmail('');
    setPass('');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 mix-blend-difference text-white px-4 md:px-8 py-4 flex justify-between items-center ${settings.showGrid ? 'border-b border-white/20' : ''}`}>
        <Link 
          to="/" 
          className="text-xs md:text-sm font-bold tracking-normal hover:text-[#ff0000] transition-all duration-500 mr-4 uppercase"
          style={linkStyle}
        >
          BROCKATTICUS
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/apparel" className={linkClass('/apparel')} style={linkStyle}>Apparel</Link>
          <Link to="/agent" className={linkClass('/agent')} style={linkStyle}>
            <span className="flex items-center gap-1"><RadioIcon className="w-3 h-3" strokeWidth={3} /> Agent</span>
          </Link>
          <Link to="/sketch-lab" className={linkClass('/sketch-lab')} style={linkStyle}>Sketch Lab</Link>
          
          <div className="relative">
            <button 
              onClick={() => { setShowContact(!showContact); setShowFavs(false); setShowAuth(false); }} 
              className={linkClass('') + " cursor-pointer"}
              style={linkStyle}
            >
              Contact
            </button>
            
            {showContact && (
              <div className="absolute top-full right-0 mt-4 bg-black border border-white/20 p-6 min-w-[240px] shadow-2xl animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#ff0000]" />
                    <div>
                      <p className="text-[10px] opacity-50 uppercase tracking-widest mb-1">Direct</p>
                      <a href="mailto:brksullivan@gmail.com" className="text-xs font-bold hover:underline hover:text-[#ff0000]">brksullivan@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#ff0000]" />
                    <div>
                      <p className="text-[10px] opacity-50 uppercase tracking-widest mb-1">Mobile</p>
                      <p className="text-xs font-bold font-mono tracking-tighter">--- --- ----</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center md:gap-2 border-l border-white/20 pl-4 md:pl-8">
            <button onClick={() => { setShowFavs(!showFavs); setShowContact(false); setShowAuth(false); }} className={btnClass}>
              <Heart 
                className={`w-4 h-4 md:w-5 md:h-5 ${favorites.length > 0 ? 'fill-[#ff0000] text-[#ff0000]' : ''}`} 
                strokeWidth={3}
              />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#ff0000] text-[8px] font-black w-3 h-3 flex items-center justify-center rounded-full">
                  {favorites.length}
                </span>
              )}
            </button>

            <button onClick={() => { setShowAuth(true); setShowFavs(false); setShowContact(false); }} className={btnClass}>
              <UserIcon 
                className={`w-4 h-4 md:w-5 md:h-5 ${user?.isLoggedIn ? 'text-[#ff0000]' : ''}`} 
                strokeWidth={3}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Favorites Sidebar/Dropdown Overlay */}
      {showFavs && (
        <div className="fixed top-16 right-4 z-[60] w-72 bg-black border border-white/20 text-white shadow-2xl max-h-[70vh] flex flex-col animate-in fade-in slide-in-from-right-4">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-[10px] font-black tracking-widest uppercase">Saved_Items</h3>
            <button onClick={() => setShowFavs(false)} className="hover:text-[#ff0000]"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {favorites.length === 0 ? (
              <p className="text-[10px] uppercase opacity-40 text-center py-8">Empty Collection</p>
            ) : (
              favorites.map(item => (
                <div key={item.id} className="flex gap-3 group">
                  <img src={`${item.imageUrl}?grayscale`} className="w-12 h-16 object-cover grayscale" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold truncate uppercase">{item.name}</p>
                    <p className="text-[9px] opacity-50">${item.price}</p>
                  </div>
                  <button onClick={() => toggleFavorite(item)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3 hover:text-[#ff0000]" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowAuth(false)} />
          <div className="relative bg-white text-black w-full max-w-sm border border-black p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowAuth(false)} className="absolute top-4 right-4 hover:text-[#ff0000]"><X className="w-5 h-5" /></button>
            
            {user?.isLoggedIn ? (
              <div className="text-center py-8">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Authenticated_User</p>
                <h2 className="text-xl font-black uppercase mb-6">{user.name}</h2>
                <button 
                  onClick={() => { setUser(null); setShowAuth(false); }} 
                  className="w-full border border-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#ff0000] hover:text-white hover:border-[#ff0000] transition-all"
                >
                  Terminate_Session
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-4 mb-8 border-b border-black/10">
                  <button 
                    onClick={() => setAuthMode('signup')}
                    className={`pb-2 text-[10px] uppercase tracking-widest font-black transition-colors ${authMode === 'signup' ? 'border-b-2 border-black' : 'opacity-40 hover:opacity-100 hover:text-[#ff0000]'}`}
                  >
                    Create_Account
                  </button>
                  <button 
                    onClick={() => setAuthMode('login')}
                    className={`pb-2 text-[10px] uppercase tracking-widest font-black transition-colors ${authMode === 'login' ? 'border-b-2 border-black' : 'opacity-40 hover:opacity-100 hover:text-[#ff0000]'}`}
                  >
                    Sign_In
                  </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-widest block mb-1">Identity_Key (Email)</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="USER@SYSTEM.VOID"
                      className="w-full border border-black p-3 text-xs uppercase font-mono focus:border-[#ff0000] focus:bg-zinc-50 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-widest block mb-1">Access_Code (Password)</label>
                    <input 
                      type="password" 
                      required
                      value={pass}
                      onChange={e => setPass(e.target.value)}
                      placeholder="********"
                      className="w-full border border-black p-3 text-xs font-mono outline-none focus:border-[#ff0000] focus:bg-zinc-50" 
                    />
                  </div>
                  <button className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-[#ff0000] transition-colors flex items-center justify-center gap-2">
                    {authMode === 'signup' ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                    {authMode === 'signup' ? 'Initiate_Registration' : 'Verify_Credentials'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};