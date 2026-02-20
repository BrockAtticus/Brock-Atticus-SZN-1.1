export interface ApparelItem {
  id: string;
  name: string;
  price: number;
  type: 'HOODIE' | 'TSHIRT' | 'JACKET' | 'PANT';
  imageUrl: string;
  soldOut?: boolean;
}

export type AccentColor = 'red' | 'green' | 'orange' | 'purple' | 'yellow' | 'white';
export type FontFamily = 'mono' | 'sans' | 'serif' | 'display';
export type BackgroundMode = 'grunge' | 'studio' | 'concrete' | 'void' | 'clean' | 'prairie' | 'industrial' | 'rustbelt';

export interface User {
  email: string;
  name?: string;
  isLoggedIn: boolean;
}

export interface ThemeSettings {
  invertColors: boolean;
  showGrid: boolean;
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  accentColor: AccentColor;
  fontFamily: FontFamily;
  backgroundMode: BackgroundMode;
  fontWeight: 'light' | 'normal' | 'bold';
}

export enum GeneratorState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}