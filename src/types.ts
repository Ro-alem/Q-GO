export interface Product {
  id: string;
  name: string;
  nameRu: string;
  nameKz: string;
  price: number;
  weight: number; // in grams
  barcode: string;
  rfid: string;
  image: string;
  category: 'dairy' | 'bakery' | 'meat' | 'drinks' | 'snacks' | 'produce' | 'fitness';
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  filters: {
    vegan: boolean;
    halal: boolean;
    organic: boolean;
    glutenFree: boolean;
    sugarFree: boolean;
    eco: boolean;
  };
  description: string;
  descriptionRu: string;
  descriptionKz: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  scannedVia: 'barcode' | 'rfid' | 'weight' | 'camera';
  securityVerified: boolean;
  weightVerified: boolean;
  isFavorite?: boolean;
}

export interface StoreSection {
  id: string;
  name: string;
  nameRu: string;
  nameKz: string;
  x: number; // coordinate percentage 0-100
  y: number; // coordinate percentage 0-100
  color: string;
  category: Product['category'];
}

export interface SecurityEvent {
  id: string;
  type: 'weight_mismatch' | 'object_unverified' | 'age_restriction' | 'manual_override';
  message: string;
  messageRu: string;
  messageKz?: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  resolved: boolean;
}

export interface UserStats {
  savedPlastic: number; // grams
  ecoPoints: number;
  carbonEmissionSaved: number; // grams of CO2
}

export interface AppLanguages {
  en: Record<string, string>;
  ru: Record<string, string>;
  kk: Record<string, string>;
}
