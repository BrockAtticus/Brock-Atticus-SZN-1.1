import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ThemeSettings, User, ApparelItem } from '../types';

interface ThemeContextType {
  settings: ThemeSettings;
  updateSetting: <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  favorites: ApparelItem[];
  toggleFavorite: (item: ApparelItem) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

const defaultSettings: ThemeSettings = {
  invertColors: false,
  showGrid: false,
  fontSize: 'medium',
  highContrast: true,
  accentColor: 'red',
  fontFamily: 'mono',
  backgroundMode: 'grunge',
  fontWeight: 'normal',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<ApparelItem[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Persistence for favorites
  useEffect(() => {
    const saved = localStorage.getItem('ba_favorites');
    if (saved) setFavorites(JSON.parse(saved));
    const savedUser = localStorage.getItem('ba_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('ba_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (user) localStorage.setItem('ba_user', JSON.stringify(user));
    else localStorage.removeItem('ba_user');
  }, [user]);

  const updateSetting = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const toggleFavorite = (item: ApparelItem) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === item.id);
      if (exists) return prev.filter(f => f.id !== item.id);
      return [...prev, item];
    });
  };

  return (
    <ThemeContext.Provider value={{ 
      settings, updateSetting, isMenuOpen, toggleMenu, 
      favorites, toggleFavorite, user, setUser 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
