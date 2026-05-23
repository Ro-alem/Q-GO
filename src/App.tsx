/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, 
  Map, 
  Sparkles, 
  SlidersHorizontal, 
  CreditCard, 
  Smartphone, 
  BarChart3, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Layers, 
  Check, 
  Trash2, 
  Plus, 
  Minus, 
  Search, 
  Clock, 
  Zap, 
  Heart, 
  User, 
  FileText, 
  Leaf, 
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Globe,
  Award,
  ChevronRight,
  HelpCircle,
  Accessibility
} from 'lucide-react';
import { INITIAL_PRODUCTS, MAP_SECTIONS, INITIAL_SECURITY_ALERTS, LOCALIZATION } from './data';
import { Product, CartItem, SecurityEvent, StoreSection } from './types';

export default function App() {
  // Current language and view mode
  const [lang, setLang] = useState<'en' | 'ru' | 'kk'>('ru');
  const t = LOCALIZATION[lang];

  // Application Tabs (Simulating the Q-GO hardware cart, the customer phone, or the store boss dashboard)
  const [activeTab, setActiveTab] = useState<'cart_interface' | 'mobile_companion' | 'admin_panel'>('cart_interface');

  // Products and Cart items
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Scaffold default shopping cart to let users play instantly
    return [
      {
        id: 'cart-1',
        product: INITIAL_PRODUCTS[0], // Organic Farm Milk
        quantity: 1,
        scannedVia: 'camera',
        securityVerified: true,
        weightVerified: true,
        isFavorite: false
      },
      {
        id: 'cart-2',
        product: INITIAL_PRODUCTS[3], // Fresh Organic Blueberries
        quantity: 2,
        scannedVia: 'rfid',
        securityVerified: true,
        weightVerified: true,
        isFavorite: true
      }
    ];
  });

  // Search and Advanced Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    vegan: false,
    halal: false,
    organic: false,
    glutenFree: false,
    sugarFree: false,
    eco: false,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // AI & Search features
  const [searchAiAnalysis, setSearchAiAnalysis] = useState('');
  const [loadingAiSearch, setLoadingAiSearch] = useState(false);
  const [recipeAiOutput, setRecipeAiOutput] = useState('');
  const [loadingRecipe, setLoadingRecipe] = useState(false);

  // Security Alert States
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(INITIAL_SECURITY_ALERTS);
  const [weightOffsetTest, setWeightOffsetTest] = useState(false); // To let user simulate putting unauthorized weight

  // Store Map Navigation
  const [navigationTarget, setNavigationTarget] = useState<StoreSection | null>(MAP_SECTIONS[0]); // Default to dairy
  const [voiceDirections, setVoiceDirections] = useState<string>('');
  const [navigationSteps, setNavigationSteps] = useState<string[]>([]);

  // Inclusive Settings
  const [inclusiveMode, setInclusiveMode] = useState(false);
  const [textToSpeechActive, setTextToSpeechActive] = useState(false);
  const [highContrast, setHighContrast] = useState(true);

  // Check out and PayPad systems
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'kpi' | 'apple' | 'google' | 'card' | 'egov'>('kpi');
  const [checkoutStep, setCheckoutStep] = useState<'input' | 'processing' | 'receipt'>('input');
  const [paidReceipt, setPaidReceipt] = useState<{
    id: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    total: number;
    ecoPointsBonus: number;
    carbonSaved: number;
    timestamp: string;
  } | null>(null);

  // User simulated interaction statistics
  const [loyaltyPoints, setLoyaltyPoints] = useState(2450);
  const [savedPlastic, setSavedPlastic] = useState(1400); // in grams
  const [savedCarbon, setSavedCarbon] = useState(3800); // in grams

  // Live clock simulation
  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger automated map navigation directions when navigation target changes
  useEffect(() => {
    if (navigationTarget) {
      if (lang === 'ru') {
        setVoiceDirections(`Маршрут построен до отдела: "${navigationTarget.nameRu}". Двигайтесь вперед 10 метров, затем поверните направо у стеллажа здорового питания.`);
        setNavigationSteps([
          'Начало маршрута у входа в супермаркет',
          'Прямо 10 метров мимо кофе-поинта',
          `Поворот к сектору "${navigationTarget.nameRu}"`,
          'Световой индикатор на ручке тележки мигает зеленым цветом'
        ]);
      } else if (lang === 'kk') {
        setVoiceDirections(`"${navigationTarget.nameKz}" бөліміне жол көрсетілді. Алға 10 метр жүріп, ПП сөресінің қасынан оңға бұрылыңыз.`);
        setNavigationSteps([
          'Дүкен кіреберісінен қозғалыс басталды',
          'Кофе-поинт тұсынан 10 метр түзу жүріңіз',
          `"${navigationTarget.nameKz}" бағытына бұрылыңыз`,
          'Арба тұтқасындағы жарық индикаторы жасыл түспен жыпылықтайды'
        ]);
      } else {
        setVoiceDirections(`Shortest path optimized to Aisle "${navigationTarget.name}". Walk forward 10 meters, pass the fitness shelf, then look at shelf indicators.`);
        setNavigationSteps([
          'Starting from Smart Entree gate',
          'Advance 10 meters past coffee shop',
          `Turn right towards "${navigationTarget.name}"`,
          'LED Guidance stripe blinking green'
        ]);
      }
    }
  }, [navigationTarget, lang]);

  // Synchronize dynamic AI recommendation swap checks
  const getHealthySwapOption = () => {
    const hasSweets = cart.some(item => item.product.category === 'snacks');
    if (hasSweets) {
      return {
        original: 'Sugar Treats / Cookies',
        replacement: products.find(p => p.id === 'prod-berries') || products[3],
        reasonRu: 'Вместо печенья с сахаром попробуйте свежую голубику с антиоксидантами 🌿',
        reasonKz: 'Қантты печенье орнына антиоксиданттары бар балғын көкжидекті таңдаңыз 🌿',
        reasonEn: 'Swap sugary bakery with organic wild blueberries rich in antioxidants 🌿'
      };
    }
    // Default recommendation if no sweets
    return {
      original: 'Standard Diet',
      replacement: products.find(p => p.id === 'prod-protein') || products[7],
      reasonRu: 'Попробуйте сывороточный протеин для баланса белков 💪',
      reasonKz: 'Ақуыз деңгейін арттыру үшін премиум спорттық протеинді көріңіз 💪',
      reasonEn: 'Boost your daily proteins with Halal premium isolates WHEY shake 💪'
    };
  };

  const healthySwap = getHealthySwapOption();

  // Handle Search Input & Trigger Gemini search recommendations
  const triggerSearchAi = async (q: string) => {
    if (!q.trim()) return;
    setLoadingAiSearch(true);
    setSearchAiAnalysis('');
    try {
      const response = await fetch('/api/gemini/search-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, language: lang })
      });
      const data = await response.json();
      setSearchAiAnalysis(data.result);
    } catch (err) {
      console.error(err);
      setSearchAiAnalysis('⚡ Q-GO AI: Connection issue. Our store indicators suggest ' + q + ' is located in Section 2, Shelf 3.');
    } finally {
      setLoadingAiSearch(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerSearchAi(searchQuery);
    }
  };

  // Trigger core AI Recipe recommendation based on what is in the basket
  const generateCartRecipe = async () => {
    setLoadingRecipe(true);
    setRecipeAiOutput('');
    try {
      const itemNames = cart.map(item => item.product.name);
      const response = await fetch('/api/gemini/recipe-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemNames, language: lang })
      });
      const data = await response.json();
      setRecipeAiOutput(data.result);
    } catch (err) {
      console.error(err);
      setRecipeAiOutput('### 🧑‍🍳 Q-GO Homemade Salad\n* Unable to access Gemini. Simply mix avocado slices with whole wheat toast chunks and pre-workout protein shake. Tasty and fast!');
    } finally {
      setLoadingRecipe(false);
    }
  };

  // Add Item to Smart Cart simulation (automatically handles Sensor Fusion barcode scanner / weight)
  const addProductToCart = (prod: Product, method: 'barcode' | 'rfid' | 'weight' | 'camera' = 'barcode') => {
    // Check if the item is already in the cart
    const existingIndex = cart.findIndex(item => item.product.id === prod.id);
    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}`,
        product: prod,
        quantity: 1,
        scannedVia: method,
        securityVerified: true,
        weightVerified: true,
        isFavorite: false
      };
      setCart([...cart, newItem]);
    }

    // Speak or announce if inclusive TTS mode is on
    if (inclusiveMode || textToSpeechActive) {
      speakText(lang === 'ru' ? `Добавлено: ${prod.nameRu}` : lang === 'kk' ? `Қосылды: ${prod.nameKz}` : `Added to cart: ${prod.name}`);
    }

    // Auto-navigate user to section of high probability
    const matchedSection = MAP_SECTIONS.find(sec => sec.category === prod.category);
    if (matchedSection) {
      setNavigationTarget(matchedSection);
    }
  };

  // Increment / Decrement quantity
  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      });
    });
  };

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          return { ...item, isFavorite: !item.isFavorite };
        }
        return item;
      });
    });
  };

  // Remove Item
  const removeItemFromCart = (id: string) => {
    const item = cart.find(c => c.id === id);
    if (item && (inclusiveMode || textToSpeechActive)) {
      speakText(lang === 'ru' ? `Удалено: ${item.product.nameRu}` : lang === 'kk' ? `Өшірілді: ${item.product.nameKz}` : `Removed: ${item.product.name}`);
    }
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Calculate pricing
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discount = subtotal > 5000 ? Math.round(subtotal * 0.1) : 0; // 10% auto bonus VIP
  const total = subtotal - discount;

  // Simple browser Speech Synthesis or mock simulation
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any currently queued/playing audio first to prevent queue clutter
      window.speechSynthesis.cancel();
      if (!text) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ru' ? 'ru-RU' : lang === 'kk' ? 'kk-KZ' : 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      console.log(`TTS Simulation: "${text}"`);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Simulate Barcode Scanner interaction by picking a product
  const simulateSensorFusion = (prodId: string, sensor: 'barcode' | 'rfid' | 'weight' | 'camera') => {
    const p = products.find(p => p.id === prodId);
    if (p) {
      addProductToCart(p, sensor);
    }
  };

  // Trigger custom weight mismatch security violation
  const triggerWeightMismatchSimulation = () => {
    setWeightOffsetTest(true);
    const customAlert: SecurityEvent = {
      id: `sec-evt-${Date.now()}`,
      type: 'weight_mismatch',
      message: 'CRITICAL WEIGHT DISCREPANCY: Weight Sensor plate registered +1,240g without barcode recognition. Verify manual packing or illicit content placement.',
      messageRu: 'ВНИМАНИЕ: Избыточный вес на платформе (+1240г) без считывания кода. Пожалуйста, извлеките неопознанный предмет из корзины.',
      messageKz: 'НАЗАР АУДАРЫҢЫЗ: Платформадағы артық салмақ (+1240г). Белгісіз затты себеттен шығарып көріңіз.',
      severity: 'high',
      timestamp: new Date().toLocaleTimeString().substring(0, 8),
      resolved: false
    };
    setSecurityEvents([customAlert, ...securityEvents]);
  };

  const resolveSecurityAlert = (id: string) => {
    setSecurityEvents(prev => prev.map(evt => evt.id === id ? { ...evt, resolved: true } : evt));
    if (id.startsWith('sec-evt-')) {
      setWeightOffsetTest(false);
    }
  };

  // Execute payment terminal steps
  const executePayment = () => {
    setCheckoutStep('processing');
    setTimeout(() => {
      const pts = Math.round(total / 100);
      const plastic = cart.reduce((acc, item) => acc + (item.product.filters.eco ? 15 : 5) * item.quantity, 0);
      const co2 = cart.reduce((acc, item) => acc + (item.product.filters.eco ? 120 : 40) * item.quantity, 0);

      setLoyaltyPoints(p => p + pts);
      setSavedPlastic(p => p + plastic);
      setSavedCarbon(p => p + co2);

      setPaidReceipt({
        id: `QGO-${Math.floor(Math.random() * 900000 + 100000)}`,
        items: [...cart],
        subtotal,
        discount,
        total,
        ecoPointsBonus: pts * 2,
        carbonSaved: co2,
        timestamp: new Date().toLocaleString()
      });
      setCart([]); // Clear shopping cart
      setCheckoutStep('receipt');
    }, 2000);
  };

  // Filter products based on active sidebar parameters
  const filteredProducts = products.filter(prod => {
    // Live text search
    const matchesSearch = 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.nameRu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.barcode.includes(searchQuery);

    // Sidebar Category Filter
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;

    // Smart checkboxes (Vegan, halal, etc.)
    const matchesVegan = !activeFilters.vegan || prod.filters.vegan;
    const matchesHalal = !activeFilters.halal || prod.filters.halal;
    const matchesOrganic = !activeFilters.organic || prod.filters.organic;
    const matchesGluten = !activeFilters.glutenFree || prod.filters.glutenFree;
    const matchesSugar = !activeFilters.sugarFree || prod.filters.sugarFree;
    const matchesEco = !activeFilters.eco || prod.filters.eco;

    return matchesSearch && matchesCategory && matchesVegan && matchesOrganic && matchesGluten && matchesSugar && matchesEco;
  });

  return (
    <div className={`min-h-screen bg-gray-100 flex items-center justify-center p-0 md:p-4 font-sans select-none antialiased ${inclusiveMode ? 'text-lg' : 'text-sm'}`}>
      <div id="qgo-app-frame" className="w-[1240px] min-h-[820px] bg-white text-black border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden relative">
        
        {/* TOP COGNITIVE BANNER SYSTEM */}
        {securityEvents.some(e => !e.resolved && e.severity === 'high') && (
          <div className="bg-red-600 text-white px-6 py-2 border-b-4 border-black flex items-center justify-between text-xs font-black uppercase tracking-widest animate-pulse z-40">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              {lang === 'ru' ? 'ВНИМАНИЕ: СРАБОТАЛА СИСТЕМА ДАТЧИКОВ ВЕСА! СБАЛАНСИРУЙТЕ КОРЗИНУ' : 'SECURITY ALERT: CART LOAD OUT OF SYNC. REMOVE ILLECIT WEIGHT'}
            </span>
            <button 
              onClick={() => {
                const activeHigh = securityEvents.find(e => !e.resolved && e.severity === 'high');
                if (activeHigh) resolveSecurityAlert(activeHigh.id);
              }}
              className="bg-black text-white px-3 py-1 text-[10px] font-bold border border-white hover:bg-[#00FF00] hover:text-black transition-colors"
            >
              {lang === 'ru' ? 'СБРОСИТЬ СИГНАЛ' : 'OVERRIDE SAFETY SCANNER'}
            </button>
          </div>
        )}

        {/* ECO SYSTEM ALERT / GREEN STATUS ROW */}
        <div className="bg-[#00FF00] text-black px-6 py-1.5 border-b-2 border-black flex items-center justify-between text-[11px] font-black uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-black" />
            <span>Q-GO Smart Eco-Active Node: #{savedPlastic}g plastic saved & -{savedCarbon}g CO₂ tracked today!</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="opacity-70">⚡ 1.2KW Smart Cart Battery: 94%</span>
            <span className="bg-black text-[#00FF00] px-2 py-0.5 rounded-sm">VIP LOYALTY TIER ★</span>
          </div>
        </div>

        {/* HEADER BRAND NAVIGATION & CONTROLS */}
        <header className="h-22 border-b-2 border-black flex items-center justify-between px-6 bg-white z-10 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-black text-[#00FF00] px-4 py-1.5 text-3xl font-black italic tracking-tighter shadow-[3px_3px_0px_rgba(0,0,0,0.25)] select-none">
              Q-GO
            </div>
            <div className="h-8 w-[2px] bg-black/10 mx-1"></div>
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest opacity-40">SMART RETAIL PLATFORM</div>
              <div className="text-xs font-black text-slate-900 tracking-tight">KAZAKHSTAN v5.4 AUTO-COGNITIVE</div>
            </div>
          </div>

          {/* FLUID INTERACTIVE BARCODE/SEARCH ASSISTANCE */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#00FF00] animate-ping"></span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                placeholder={t.searchPlaceholder} 
                className="w-full bg-gray-100 border-2 border-black px-10 py-3 text-xs font-extrabold tracking-wider uppercase focus:ring-0 focus:bg-white focus:border-[#00FF00] outline-none transition-all"
              />
              <button 
                onClick={() => triggerSearchAi(searchQuery)}
                disabled={loadingAiSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-1.5 hover:bg-[#00FF00] hover:text-black transition-colors"
                title="Ask AI Intelligence"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* LANGUAGE SWITCHER */}
          <div className="flex items-center gap-1 border-2 border-black p-1 bg-gray-50">
            {(['en', 'ru', 'kk'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 text-[11px] font-black uppercase transition-all ${lang === l ? 'bg-black text-[#00FF00]' : 'text-black hover:bg-black/10'}`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* DYNAMIC METRIC & VIP DETAILS */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-[9px] font-bold opacity-40 uppercase tracking-tight">{t.greeting}</div>
              <div className="text-sm font-black text-black">ALEXANDER K. <span className="text-xs text-green-600">VIP</span></div>
            </div>
            <div className="w-11 h-11 bg-black text-[#00FF00] rounded-none border-2 border-black font-black flex items-center justify-center text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              AK
            </div>
          </div>
        </header>

        {/* SUBHEADER: SIMULATION MODE SELECTOR */}
        <div className="bg-white border-b-2 border-black grid grid-cols-3 text-xs font-black uppercase">
          <button 
            onClick={() => setActiveTab('cart_interface')}
            className={`py-4 text-center border-r-2 border-black flex items-center justify-center gap-2 transition-all ${activeTab === 'cart_interface' ? 'bg-black text-[#00FF00]' : 'hover:bg-gray-100 text-black'}`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>🛒 Smart Cart Kiosk ({cart.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('mobile_companion')}
            className={`py-4 text-center border-r-2 border-black flex items-center justify-center gap-2 transition-all ${activeTab === 'mobile_companion' ? 'bg-black text-[#00FF00]' : 'hover:bg-gray-100 text-black'}`}
          >
            <Smartphone className="w-4 h-4" />
            <span>📱 Companion Mobile App</span>
          </button>
          <button 
            onClick={() => setActiveTab('admin_panel')}
            className={`py-4 text-center flex items-center justify-center gap-2 transition-all ${activeTab === 'admin_panel' ? 'bg-black text-[#00FF00]' : 'hover:bg-gray-100 text-black'}`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>📊 Retailer Dashboard & Heatmap</span>
          </button>
        </div>

        {/* WORKSPACE AREA */}
        <main className="flex-1 flex overflow-hidden">
          
          {/* TAB 1: CORE SMART-CART INTERACTIVE PLATFORM */}
          {activeTab === 'cart_interface' && (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full">
              
              {/* LEFT COLUMN: ACTIVE PRODUCTS CATALOGUE & SCAN SIMULATION */}
              <section className="flex-1 border-r-2 border-black flex flex-col bg-gray-50 overflow-y-auto">
                
                {/* ADVANCED SECTORS BAR */}
                <div className="p-4 bg-white border-b-2 border-black flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-black" />
                    <span className="font-extrabold text-xs uppercase tracking-widest text-slate-800">Shop shelves</span>
                  </div>
                  
                  {/* Category badgess */}
                  <div className="flex flex-wrap gap-1">
                    {['all', 'dairy', 'bakery', 'meat', 'produce', 'fitness', 'drinks', 'snacks'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2 py-0.5 text-[10px] font-black uppercase border border-black ${selectedCategory === cat ? 'bg-black text-[#00FF00]' : 'bg-white text-black hover:bg-gray-100'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ADVANCED PRECISE HEALTH FILTERS */}
                <div className="px-4 py-3 bg-white border-b-2 border-black flex flex-wrap gap-4 items-center justify-between">
                  <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-700">{t.specialFilters}:</span>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(activeFilters).map(filterKey => {
                      const typedKey = filterKey as keyof typeof activeFilters;
                      return (
                        <label key={filterKey} className="flex items-center gap-1.5 cursor-pointer select-none">
                          <input 
                            type="checkbox"
                            checked={activeFilters[typedKey]}
                            onChange={() => setActiveFilters(prev => ({ ...prev, [typedKey]: !prev[typedKey] }))}
                            className="accent-black w-4.5 h-4.5 border-2 border-black bg-white focus:ring-0 checked:bg-black"
                          />
                          <span className="text-[10px] uppercase font-black tracking-tight">{filterKey}</span>
                        </label>
                      );
                    })}
                    <button 
                      onClick={() => setActiveFilters({ vegan: false, halal: false, organic: false, glutenFree: false, sugarFree: false, eco: false })}
                      className="text-[10px] font-black underline text-red-600 uppercase tracking-tighter ml-auto"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>

                {/* SENSOR SIMULATION CONTROL PANEL */}
                <div className="p-4 bg-yellow-50 border-b-2 border-black text-black">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black tracking-wide uppercase flex items-center gap-1">
                      <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
                      💻 HARDWARE COMPONENT SIMULATOR (TAP ITEMS BELOW TO DROP THEM DIRECTLY INTO THE BASKET)
                    </span>
                    <button 
                      onClick={triggerWeightMismatchSimulation}
                      className="bg-red-700 text-white border-2 border-black px-2 py-0.5 text-[9px] font-black uppercase hover:bg-red-800 transition-colors"
                    >
                      Simulate Weight Theft/Error alert
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-800 uppercase leading-snug">
                     No manual typing is needed on Q-GO smart carts. The integrated **Sensor Fusion** merges 4 sources: **Barcode Laser**, **RFID wireless chip**, **Under-cart Scale**, and **overhead AI Cameras**.
                  </p>
                </div>

                {/* SCAN ALERTS OR AI SEARCH ASSISTANT BOX */}
                {searchAiAnalysis && (
                  <div className="mx-4 mt-4 p-4 bg-black text-white border-2 border-[#00FF00] relative">
                    <button 
                      onClick={() => setSearchAiAnalysis('')} 
                      className="absolute top-2 right-2 text-red-400 font-bold text-xs"
                    >
                      ✕
                    </button>
                    <div className="flex items-center gap-2 mb-1.5 text-xs font-black text-[#00FF00]">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>COGNITIVE SHOPPING COPILOT ASSISTANCE</span>
                    </div>
                    <p className="text-xs tracking-wide leading-relaxed font-semibold opacity-90 italic">
                      {searchAiAnalysis}
                    </p>
                  </div>
                )}

                {/* GRID OF STORE ARTICLES */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map(prod => {
                    return (
                      <div 
                        key={prod.id} 
                        className="bg-white border-2 border-black p-4 flex flex-col justify-between group h-full relative hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        {/* Tags */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                          {prod.filters.organic && (
                            <span className="bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter">ORGANIC</span>
                          )}
                          {prod.filters.vegan && (
                            <span className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter">VEGAN</span>
                          )}
                          {prod.filters.halal && (
                            <span className="bg-orange-600 text-white text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter">HALAL</span>
                          )}
                        </div>

                        <div className="absolute top-2 right-2 flex gap-1 z-10">
                          <span className="bg-black text-[#00FF00] text-[9px] font-black p-1 leading-none">{prod.price} ₸</span>
                        </div>

                        <div className="mt-4 flex gap-3 h-full items-start">
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            className="w-20 h-20 object-cover border border-black/20 flex-shrink-0" 
                          />
                          <div className="flex-1">
                            <h4 className="text-xs font-black uppercase text-slate-800 tracking-tight line-clamp-2">
                              {lang === 'ru' ? prod.nameRu : lang === 'kk' ? prod.nameKz : prod.name}
                            </h4>
                            <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 lowercase italic leading-tight">
                              {lang === 'ru' ? prod.descriptionRu : lang === 'kk' ? prod.descriptionKz : prod.description}
                            </p>
                            <div className="text-[9px] font-extrabold text-slate-400 mt-2 tracking-widest uppercase">
                              Barcode: {prod.barcode} | {prod.weight}g
                            </div>
                          </div>
                        </div>

                        {/* Nutrition Information Bar */}
                        <div className="mt-3 py-1 bg-gray-50 border-t border-b border-black/5 grid grid-cols-4 text-center text-[9px] font-bold text-slate-700">
                          <div>🔥 {prod.calories} kcal</div>
                          <div>🥩 P: {prod.proteins}g</div>
                          <div>🥑 F: {prod.fats}g</div>
                          <div>🌾 C: {prod.carbs}g</div>
                        </div>

                        {/* Trigger Simulation Controls */}
                        <div className="mt-3 grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => addProductToCart(prod, 'barcode')}
                            className="bg-black text-white hover:bg-[#00FF00] hover:text-black font-black text-[9px] py-1.5 uppercase transition-all tracking-wider text-center flex items-center justify-center gap-1"
                          >
                            <Zap className="w-3 h-3" /> Laserscan
                          </button>
                          <button
                            onClick={() => addProductToCart(prod, 'camera')}
                            className="bg-white text-black hover:bg-[#00FF00] font-black text-[9px] py-1.5 border border-black uppercase transition-all tracking-wider text-center flex items-center justify-center gap-1"
                          >
                            📸 AI Vision Check
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {filteredProducts.length === 0 && (
                    <div className="col-span-2 text-center py-12">
                      <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <h5 className="text-sm font-black uppercase text-slate-700">No items matched search and filters</h5>
                      <p className="text-xs text-slate-500 mt-1 uppercase">Try loosening the smart checkboxes or looking up categories.</p>
                    </div>
                  )}
                </div>

                {/* BOTTOM CHOP SPECIAL RECS */}
                <div className="mt-auto p-4 bg-white border-t-2 border-black flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black uppercase tracking-tight italic flex items-center gap-1.5 text-black">
                      <Sparkles className="w-5 h-5 text-green-600 animate-spin" />
                      Q-GO AI Smart Chef Assistant Suggestions
                    </h3>
                    <button 
                      onClick={generateCartRecipe}
                      disabled={loadingRecipe}
                      className="bg-black text-[#00FF00] hover:bg-[#00FF00] hover:text-black border-2 border-black font-black text-xs px-3 py-1.5 uppercase tracking-widest transition-all"
                    >
                      {loadingRecipe ? 'Synthesizing...' : '🍳 Build Instant Recipe From Cart Items'}
                    </button>
                  </div>

                  {recipeAiOutput ? (
                    <div className="p-4 bg-stone-900 text-stone-100 border-l-4 border-[#00FF00] rounded-none text-xs font-mono space-y-2 max-h-48 overflow-y-auto">
                      <div className="flex justify-between items-center text-[#00FF00] font-black text-xs uppercase border-b border-stone-800 pb-1.5 mb-2">
                        <span>⚡ Generated AI Recipe</span>
                        <button onClick={() => setRecipeAiOutput('')} className="text-stone-400 hover:text-white">Close X</button>
                      </div>
                      <div className="prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: recipeAiOutput.replace(/\n/g, '<br/>') }}></div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-600 uppercase tracking-tight">
                      * Fill your basket with organic sourdough bread, premium angus ribeye steak, or farm milk, then query the AI chef to suggest tailored instructions and calorie plans.
                    </p>
                  )}
                </div>
              </section>

              {/* CENTER COLUMN: DIGITAL SHOPPING BASKET */}
              <aside className="w-full md:w-[380px] border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col bg-white">
                
                {/* CART HEADER */}
                <div className="p-4 bg-white border-b-2 border-black">
                  <div className="flex justify-between items-end mb-2">
                    <h2 className="text-3xl font-black tracking-tighter uppercase">{t.cartCaption}</h2>
                    <span className="text-xs font-black bg-[#00FF00] text-black border border-black px-2 py-0.5">
                      {cart.reduce((s, i) => s + i.quantity, 0)} ITEMS
                    </span>
                  </div>
                  <div className="h-1 bg-black w-full"></div>
                </div>

                {/* LIST OF CART ENTRIES */}
                <div className="flex-1 overflow-y-auto divide-y-2 divide-black/10 p-4 space-y-4">
                  {cart.map((item) => {
                    return (
                      <div key={item.id} className="pt-3 pb-1 flex gap-3 group relative">
                        {/* Favorite button */}
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-2 right-2 text-rose-500 hover:scale-110 transition-transform"
                          title="Favorite product"
                        >
                          <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-rose-500' : 'text-slate-300'}`} />
                        </button>

                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-14 h-14 object-cover border border-black/15 flex-shrink-0"
                        />

                        <div className="flex-1">
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-1">
                            <span>{item.product.category.toUpperCase()}</span>
                            <span>•</span>
                            <span className="text-green-600 font-black">VIA {item.scannedVia.toUpperCase()}</span>
                          </div>

                          <h5 className="text-xs font-black uppercase text-slate-900 leading-tight">
                            {lang === 'ru' ? item.product.nameRu : lang === 'kk' ? item.product.nameKz : item.product.name}
                          </h5>

                          <div className="text-[11px] font-bold text-slate-600 mt-0.5">
                            {item.product.price} ₸ / {item.product.weight}g
                          </div>

                          {/* Controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 bg-gray-50 border border-black p-0.5">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 hover:bg-black/10 flex items-center justify-center font-bold text-xs"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-black">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 hover:bg-black/10 flex items-center justify-center font-bold text-xs"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-black">
                                {item.product.price * item.quantity} ₸
                              </span>
                              <button 
                                onClick={() => removeItemFromCart(item.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {cart.length === 0 && (
                    <div className="py-20 text-center uppercase space-y-3">
                      <div className="w-16 h-16 bg-dashed border-2 border-black rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <ShoppingCart className="w-8 h-8 text-black" />
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-700">Your Smart Cart is Empty</h4>
                      <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                        Simulate scanning foods by using the &quot;Laserscan&quot; or &quot;AI Vision&quot; triggers under each product.
                      </p>
                    </div>
                  )}
                </div>

                {/* SMART ALTERNATIVES AND DIET SWAP TIPS COUPLING */}
                <div className="p-4 bg-slate-50 border-t-2 border-black text-black">
                  <div className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-[#00FF00]" />
                    <span>{t.alternativeTitle}</span>
                  </div>
                  <div className="border border-black p-3 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-rose-600 uppercase">Detection Alert</span>
                      <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 uppercase tracking-tighter">SUGGESTED</span>
                    </div>
                    <div className="text-xs font-black uppercase tracking-tight">{healthySwap.replacement.name}</div>
                    <p className="text-[10px] text-slate-600 lowercase leading-snug">
                      {lang === 'ru' ? healthySwap.reasonRu : lang === 'kk' ? healthySwap.reasonKz : healthySwap.reasonEn}
                    </p>
                    <button 
                      onClick={() => addProductToCart(healthySwap.replacement, 'camera')}
                      className="w-full bg-[#00FF00] text-black border border-black font-black text-[9px] py-1 uppercase hover:opacity-95 transition-opacity"
                    >
                      + Quick Add Alternative (+{healthySwap.replacement.price} ₸)
                    </button>
                  </div>
                </div>

                {/* BASKET FOOTER PRICE DISPLAY */}
                <div className="p-4 bg-black text-white space-y-3">
                  <div className="space-y-1.5 text-xs text-white/75 font-semibold">
                    <div className="flex justify-between items-center">
                      <span className="uppercase tracking-widest text-[10px]">Active Subtotal</span>
                      <span className="font-bold">{subtotal} ₸</span>
                    </div>
                    <div className="flex justify-between items-center text-[#00FF00]">
                      <span className="uppercase tracking-widest text-[10px]">Autopay VIP Discount (10%)</span>
                      <span className="font-bold">-{discount} ₸</span>
                    </div>
                    <div className="h-px bg-white/20 my-1"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#00FF00]">{t.totalText}</span>
                      <span className="text-2xl font-black italic tracking-tighter text-white">{total} ₸</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (cart.length > 0) {
                        setCheckoutStep('input');
                        setIsCheckoutOpen(true);
                      } else {
                        alert(lang === 'ru' ? 'Добавьте хотя бы один товар в корзину!' : 'Add items first before payment simulation!');
                      }
                    }}
                    className={`w-full py-4 text-center font-black text-xs tracking-widest uppercase transition-all ${cart.length > 0 ? 'bg-[#00FF00] text-black hover:opacity-90 cursor-pointer' : 'bg-gray-700 text-stone-400 cursor-not-allowed'}`}
                  >
                    {t.quickPay.toUpperCase()} →
                  </button>
                </div>
              </aside>

              {/* RIGHT COLUMN: STORE INDOOR RADAR & NAVIGATION */}
              <aside className="w-full md:w-64 flex flex-col bg-white">
                
                <div className="p-4 border-b border-black/5 bg-slate-50">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 flex items-center gap-1.5">
                    <Map className="w-4 h-4 text-black" />
                    <span>{t.navigationTitle}</span>
                  </h3>
                </div>

                {/* FLOOR MAP GRAPHIC SVG WITH LED COORDINATES */}
                <div className="p-4 bg-white border-b-2 border-black flex flex-col items-center justify-center">
                  <div className="w-full aspect-square bg-[#fff] border-2 border-black relative overflow-hidden shadow-[inset_2px_2px_10px_rgba(0,0,0,0.06)] bg-grid-pattern">
                    
                    {/* Store Borders & Shelves */}
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      {/* Grid background */}
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      
                      {/* Store Borders */}
                      <rect x="5" y="5" width="95%" height="95%" fill="none" stroke="black" strokeWidth="2" strokeDasharray="4,4" />

                      {/* Cash free PayPad Exit area */}
                      <rect x="42%" y="90%" width="16%" height="8%" fill="rgba(0,255,0,0.1)" stroke="black" strokeWidth="1" />
                      <text x="50%" y="96%" textAnchor="middle" fontSize="6" fontWeight="bold" fill="black">PAYPAD OUT</text>
                      
                      {/* Draw optimized path from Entrance (y:95, x:50) to the targeted shelf coordinates */}
                      {navigationTarget && (
                        <path 
                          d={`M 110, 190 L 110, 140 L ${navigationTarget.x * 2.2}, ${navigationTarget.y * 2.2}`} 
                          fill="none" 
                          stroke="black" 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      )}
                      {navigationTarget && (
                        <path 
                          d={`M 110, 190 L 110, 140 L ${navigationTarget.x * 2.2}, ${navigationTarget.y * 2.2}`} 
                          fill="none" 
                          stroke="#00FF00" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          strokeDasharray="4,2"
                          className="animate-pulse"
                        />
                      )}
                    </svg>

                    {/* Entrance Marker */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black text-white text-[7px] font-black px-1 border border-black z-15">
                      YOU (CART v4)
                    </div>

                    {/* Targeted Department Overlay dots */}
                    {MAP_SECTIONS.map((sec) => {
                      const isActive = navigationTarget?.id === sec.id;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => setNavigationTarget(sec)}
                          style={{ left: `${sec.x}%`, top: `${sec.y}%` }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 transition-transform ${isActive ? 'scale-110' : 'hover:scale-105'}`}
                        >
                          <div className={`w-3.5 h-3.5 rotate-45 border flex items-center justify-center transition-colors ${isActive ? 'bg-black border-[#00FF00]' : 'bg-white border-black hover:bg-black hover:text-white'}`}>
                            <div className={`w-1.5 h-1.5 ${isActive ? 'bg-[#00FF00]' : 'bg-black'}`}></div>
                          </div>
                          
                          {/* Tooltip on hover */}
                          <span className="absolute left-1/2 -translate-x-1/2 bottom-4 bg-black text-white font-black text-[7px] px-1 whitespace-nowrap shadow-sm opacity-10 sm:group-hover:opacity-100 transition-opacity uppercase border border-black">
                            {lang === 'ru' ? sec.nameRu : lang === 'kk' ? sec.nameKz : sec.name}
                          </span>
                        </button>
                      );
                    })}

                    {/* LIVE ANIMATED RADAR GLOW */}
                    {navigationTarget && (
                      <div 
                        style={{ left: `${navigationTarget.x}%`, top: `${navigationTarget.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-black/40 bg-[#00FF00]/10 pointer-events-none animate-ping"
                      />
                    )}
                  </div>

                  <div className="w-full mt-2 bg-black text-white p-2.5 text-center">
                    <div className="text-[9px] font-black uppercase text-[#00FF00]">ACTIVE AISLE SELECTION</div>
                    <div className="text-[11px] font-black uppercase mt-0.5 tracking-tight">
                      {navigationTarget ? (lang === 'ru' ? navigationTarget.nameRu : lang === 'kk' ? navigationTarget.nameKz : navigationTarget.name) : 'Supermarket Entrance'}
                    </div>
                  </div>
                </div>

                {/* REAL TIME STEP BY STEP DIRECTIONS */}
                <div className="p-4 bg-gray-50 border-b-2 border-black flex-1 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold uppercase text-slate-700">NAVIGATIONAL STEPS:</span>
                    <button 
                      onClick={() => {
                        if (window.speechSynthesis && window.speechSynthesis.speaking) {
                          stopSpeaking();
                        } else {
                          speakText(voiceDirections);
                        }
                      }} 
                      className="text-slate-800 hover:text-black flex items-center gap-1.5 text-[10px] uppercase font-black"
                      title="Play/Stop Voice Direction Assistance"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-black" />
                      <span>Listen Guide</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-800 lowercase bg-white border border-black/20 p-2 italic leading-relaxed mb-3">
                    &quot;{voiceDirections}&quot;
                  </p>
                  <ul className="space-y-1.5 text-[10px] font-semibold text-slate-800 uppercase">
                    {navigationSteps.map((step, idx) => (
                      <li key={idx} className="flex gap-1.5 items-start">
                        <span className="text-[#00FF00] font-black">✔</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* INCLUSIVE & ACCESSIBILITY HELPER TOGGLE BAR */}
                <div className="p-4 bg-slate-900 text-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-teal-400 flex items-center gap-1">
                      <Accessibility className="w-4 h-4" /> INCLUSIVE PANEL
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={inclusiveMode}
                        onChange={() => setInclusiveMode(!inclusiveMode)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00FF00]"></div>
                    </label>
                  </div>
                  <p className="text-[9px] text-slate-300 uppercase leading-snug">
                    Maximizes text size, activates speech synthesis, and activates simplified controls for elderly or vision disabled shoppers.
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button 
                      onClick={() => {
                        const nextVal = !textToSpeechActive;
                        setTextToSpeechActive(nextVal);
                        if (nextVal) {
                          speakText(lang === 'ru' ? 'Речевой ассистент Кью-Гоу запущен.' : 'Q-GO voice guide launched successfully.');
                        } else {
                          stopSpeaking();
                        }
                      }}
                      className={`py-1.5 px-2 border text-[9px] font-black uppercase text-center transition-all ${textToSpeechActive ? 'bg-[#00FF00] text-black border-black' : 'border-stone-700 text-stone-300 hover:bg-stone-800'}`}
                    >
                      {textToSpeechActive ? '🔊 Speech Active' : '🔇 Mute voice'}
                    </button>
                    <button 
                      onClick={() => setHighContrast(!highContrast)} 
                      className={`py-1.5 px-2 border text-[9px] font-black uppercase text-center transition-all ${highContrast ? 'bg-[#00FF00] text-black border-black' : 'border-stone-700 text-stone-300 hover:bg-stone-800'}`}
                    >
                      ★ Contrast On
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* TAB 2: MOBILE COMPANION APP SINCRONIZATION CONTAINER */}
          {activeTab === 'mobile_companion' && (
            <div className="flex-1 p-6 bg-slate-100 flex flex-col items-center justify-center overflow-y-auto">
              <div className="w-[380px] bg-white border-4 border-black p-6 rounded-[24px] shadow-[6px_6px_0px_rgba(0,0,0,1)] relative">
                
                {/* Speaker grill on top */}
                <div className="w-24 h-4 bg-black/10 rounded-full mx-auto mb-4 flex items-center justify-center gap-1">
                  <div className="w-2 h-2 bg-black/60 rounded-full"></div>
                  <div className="w-12 h-1 bg-black/40 rounded-full"></div>
                </div>

                <div className="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
                  <div>
                    <span className="text-[9px] font-black bg-black text-[#00FF00] px-1.5 py-0.5 uppercase">SYNCED</span>
                    <h3 className="font-extrabold text-sm text-slate-900 mt-1 uppercase">Q-GO MOBILE CLIENT</h3>
                  </div>
                  <Smartphone className="w-8 h-8 text-black" />
                </div>

                {/* Loyalty Tier */}
                <div className="bg-[#00FF00] p-4 border-2 border-black text-black mb-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#000]">VIP Customer Level</div>
                  <div className="text-2xl font-black italic tracking-tighter">{loyaltyPoints} PTS</div>
                  <p className="text-[9px] uppercase font-bold text-slate-800 mt-1">
                    Redemption multiplier actively adjusted to 2.5x today!
                  </p>
                </div>

                {/* Green Eco Savings tracking */}
                <div className="border border-black bg-stone-50 p-4 space-y-3 mb-4">
                  <h4 className="text-xs font-black uppercase text-stone-800 flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>GREEN ECO-SYSTEM TRACKING</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-white border border-slate-300 p-2">
                      <div className="text-[9px] font-bold text-slate-400 uppercase">PLASTIC PREVENTED</div>
                      <div className="text-sm font-black text-slate-900 mt-1">+{savedPlastic}g</div>
                    </div>
                    <div className="bg-white border border-slate-300 p-2">
                      <div className="text-[9px] font-bold text-slate-400 uppercase">CO₂ OFFSETS RECOUPED</div>
                      <div className="text-sm font-black text-slate-900 mt-1">-{savedCarbon}g</div>
                    </div>
                  </div>
                  <p className="text-[8px] text-slate-500 uppercase leading-snug text-center">
                    By shopping via automated Q-GO PayPad and checking out with paper-free QR digital receipts: you have saved the equivalent of 12 plastic bottles!
                  </p>
                </div>

                {/* User Wishlist & historical lists */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wide text-slate-700">Wishlist & Saved Foods</h4>
                  <div className="space-y-1 bg-white max-h-40 overflow-y-auto">
                    {INITIAL_PRODUCTS.slice(0, 4).map(prod => (
                      <div key={prod.id} className="flex justify-between items-center text-xs p-2.5 border border-black/10">
                        <span className="font-extrabold text-slate-800 text-[11px] uppercase truncate max-w-xs">{prod.name}</span>
                        <button 
                          onClick={() => addProductToCart(prod, 'barcode')}
                          className="bg-black text-[#00FF00] px-2 py-0.5 text-[9px] font-black uppercase hover:opacity-90 transition-opacity"
                        >
                          + Quick Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated notifications */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-none">
                  <div className="font-bold uppercase tracking-wider text-[9px]">Push notification: Almaty Store</div>
                  <p className="text-[10px] uppercase mt-1">Your family account synced with smart-cart #09. Milk is half off in Section 1!</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADMIN PANEL / HEATMAP ANALYTICS */}
          {activeTab === 'admin_panel' && (
            <div className="flex-1 p-6 bg-[#fafafa] flex flex-col overflow-y-auto gap-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-black pb-4 gap-4">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight">{t.adminTitle}</h2>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Store Manager intelligence center & live client flow diagnostics.</p>
                </div>
                <div className="bg-[#00FF00] text-black text-xs font-black px-4 py-2 border-2 border-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  AUTO-SENSING NETWORK: STABLE
                </div>
              </div>

              {/* STATS TILES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border-2 border-black p-4">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Active Store Trafffic</div>
                  <div className="text-3xl font-black tracking-tight mt-1 text-black">1,820 <span className="text-xs text-emerald-500">▲ 4%</span></div>
                  <p className="text-[9px] uppercase font-bold text-slate-500 mt-2">Shoppers active in past hour</p>
                </div>
                <div className="bg-white border-2 border-black p-4">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Average Cart Checkout Value</div>
                  <div className="text-3xl font-black tracking-tight mt-1 text-black">8,450 ₸</div>
                  <p className="text-[9px] uppercase font-bold text-slate-500 mt-2">AI-recommendation coupon lift +14%</p>
                </div>
                <div className="bg-white border-2 border-black p-4">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Peak Hour Rush Index</div>
                  <div className="text-3xl font-black tracking-tight mt-1 text-amber-500">HIGH</div>
                  <p className="text-[9px] uppercase font-bold text-slate-500 mt-2">Estimated checkout congestion: 0 min (Smart Cart active)</p>
                </div>
                <div className="bg-white border-2 border-black p-4">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Sensor Fraud Prevention Blocked</div>
                  <div className="text-3xl font-black tracking-tight mt-1 text-emerald-700">99.8%</div>
                  <p className="text-[9px] uppercase font-bold text-slate-500 mt-2">Zero wait queues. Anti-theft verification ok</p>
                </div>
              </div>

              {/* HEATMAP & GRAPH PLOT CODES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Visual heat Map of store section interest */}
                <div className="bg-white border-2 border-black p-6">
                  <h3 className="text-sm font-black uppercase text-black mb-4 tracking-wider">Live Customer Heatmap & Interest Matrix</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-xs uppercase font-extrabold text-stone-700 mb-1">Interactive Sections:</div>
                      
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-[11px] font-black uppercase">
                            <span>Fresh Produce (Fruits)</span>
                            <span className="text-red-500 font-extrabold">95% HOT</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 border border-black mt-1">
                            <div className="bg-red-500 h-full" style={{ width: '95%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] font-black uppercase">
                            <span>Organic Alternatives & Fitness</span>
                            <span className="text-orange-500 font-extrabold">82% BUSY</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 border border-black mt-1">
                            <div className="bg-orange-500 h-full" style={{ width: '82%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] font-black uppercase">
                            <span>Dairy Pasteurized</span>
                            <span className="text-amber-500 font-extrabold">64% MODERATE</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 border border-black mt-1">
                            <div className="bg-amber-500 h-full" style={{ width: '64%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] font-black uppercase">
                            <span>Artisan Bakery Sourdough</span>
                            <span className="text-blue-500 font-extrabold">30% COLD</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 border border-black mt-1">
                            <div className="bg-blue-500 h-full" style={{ width: '30%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-stone-50 border border-slate-300 p-4 flex flex-col justify-between text-xs">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase">AI RECOGNITION REPORT</span>
                        <div className="text-xs font-black uppercase text-slate-800 tracking-tight mt-1">Camera Object Verification</div>
                        <p className="text-[10px] text-slate-600 uppercase leading-snug mt-2">
                          Store overhead cameras are merging depth maps with weight arrays to track active products correctly, reducing shrinkage by 94%!
                        </p>
                      </div>
                      <div className="pt-3 border-t border-black/10 text-right">
                        <span className="text-[11px] font-extrabold text-blue-800">CCTV AGENT STATUS: ACTIVE</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECURITY LOG LIST */}
                <div className="bg-white border-2 border-black p-6 flex flex-col">
                  <h3 className="text-sm font-black uppercase text-black mb-4 tracking-wider flex items-center justify-between">
                    <span>SECURITY MONITORING & SENSOR STATE</span>
                    <span className="text-[9px] bg-red-100 text-red-800 font-black px-2 py-0.5">2 ALERTS EXTREME</span>
                  </h3>

                  <div className="flex-1 space-y-3 max-h-56 overflow-y-auto">
                    {securityEvents.map(evt => (
                      <div key={evt.id} className={`p-3 border-2 ${evt.resolved ? 'border-dashed border-stone-200 bg-stone-50 opacity-60' : 'border-red-500 bg-red-50'} flex flex-col gap-2 text-xs`}>
                        <div className="flex justify-between items-center font-black">
                          <span className={`uppercase font-black text-[9px] ${evt.severity === 'high' ? 'text-red-600' : 'text-amber-600'}`}>
                            {evt.type.toUpperCase()} • Severity: {evt.severity.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-400">{evt.timestamp}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed uppercase text-slate-900 font-semibold">
                          {lang === 'ru' ? evt.messageRu : evt.message}
                        </p>
                        {!evt.resolved ? (
                          <div className="flex justify-end gap-2 mt-1">
                            <button 
                              onClick={() => resolveSecurityAlert(evt.id)}
                              className="bg-black text-[#00FF00] px-3 py-1 font-black text-[9px] uppercase border hover:opacity-90 transition-opacity"
                            >
                              Authorize & Resolve Mismatch
                            </button>
                          </div>
                        ) : (
                          <div className="text-right text-[10px] font-bold text-slate-500 uppercase italic">
                            ✓ Alert Resolved & Cleared
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* BOTTOM GLOBAL TELEMETRY FOOTER */}
        <footer className="h-16 bg-white border-t-2 border-black px-6 flex items-center justify-between text-xs font-black uppercase tracking-wider z-20">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#00FF00] rounded-none border border-black animate-pulse"></span>
              <span className="text-[10px]">WEIGHT SCALE: VERIFIED ({cart.reduce((s, i) => s + (i.product.weight * i.quantity), 0)}g total load)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#00FF00] rounded-none border border-black"></span>
              <span className="text-[10px]">RFID SHIELDING: ACTIVE (915MHz)</span>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex">
              <span className="w-3 h-3 bg-black rounded-none"></span>
              <span className="text-[10px]">MANUAL OVERRIDE: OFF</span>
            </div>
          </div>
          <div>
            <span className="text-black bg-[#00FF00] px-3 py-1 text-xs italic tracking-tighter">
              LIVE AST TIME: {currentTime}
            </span>
          </div>
        </footer>

        {/* THE CHECKOUT MODAL WINDOW / PAYPAD TERMINAL */}
        {isCheckoutOpen && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black p-6 w-full max-w-lg shadow-[8px_8px_0px_rgba(0,0,0,1)] relative">
              <button 
                onClick={() => setIsCheckoutOpen(false)} 
                className="absolute top-4 right-4 text-black hover:text-red-600 font-black text-lg p-2"
                title="Cancel Checkout"
              >
                ✕
              </button>

              {checkoutStep === 'input' && (
                <div className="space-y-4">
                  <div className="text-center border-b-2 border-black pb-4">
                    <div className="bg-black text-[#00FF00] px-4 py-1 text-2xl font-black italic tracking-tighter inline-block mb-2">Q-GO PAYPAD</div>
                    <h3 className="text-lg font-black uppercase">Instant Cash-Free checkout console</h3>
                    <p className="text-xs text-slate-500 uppercase mt-1 leading-snug">
                      Your items will be registered under Almaty store node. Zero cashier interaction requested.
                    </p>
                  </div>

                  {/* Payment Methods selector */}
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-slate-700">Select Instant Gateway Provider:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setPaymentMethod('kpi')}
                        className={`p-3 border-2 flex items-center justify-between text-xs font-black uppercase transition-all ${paymentMethod === 'kpi' ? 'border-amber-500 bg-amber-50 text-black' : 'border-black hover:bg-gray-50'}`}
                      >
                        <span>Kaspi Pay (Gold QR)</span>
                        <span className="text-[10px] text-amber-500">★ POPULAR</span>
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 border-2 flex items-center justify-between text-xs font-black uppercase transition-all ${paymentMethod === 'card' ? 'border-[#00FF00] bg-emerald-50 text-black' : 'border-black hover:bg-gray-50'}`}
                      >
                        <span>CREDIT DIRECT CARD</span>
                        <span>VISA/MC</span>
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('apple')}
                        className={`p-3 border-2 flex items-center justify-between text-xs font-black uppercase transition-all ${paymentMethod === 'apple' ? 'border-black bg-stone-50 text-black' : 'border-black hover:bg-gray-50'}`}
                      >
                        <span>Apple Pay</span>
                        <span>🍏</span>
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('egov')}
                        className={`p-3 border-2 flex items-center justify-between text-xs font-black uppercase transition-all ${paymentMethod === 'egov' ? 'border-blue-500 bg-blue-50 text-black' : 'border-black hover:bg-gray-50'}`}
                      >
                        <span>eGov Biometric (QR ID)</span>
                        <span className="text-[10px] text-blue-500">SECURE</span>
                      </button>
                    </div>
                  </div>

                  {/* Pricing summary */}
                  <div className="bg-stone-50 border border-black/20 p-4 space-y-1.5 text-xs text-slate-800">
                    <div className="flex justify-between">
                      <span className="uppercase">Cart subtotal</span>
                      <span className="font-bold">{subtotal} ₸</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span className="uppercase">Exclusive Loyalty Discount (10%)</span>
                      <span className="font-bold">-{discount} ₸</span>
                    </div>
                    <div className="h-px bg-slate-200 my-1"></div>
                    <div className="flex justify-between text-sm font-black text-black">
                      <span className="uppercase tracking-tight text-slate-900">Total charge amount</span>
                      <span className="italic">{total} ₸</span>
                    </div>
                  </div>

                  <button 
                    onClick={executePayment}
                    className="w-full bg-[#00FF00] text-black border-2 border-black font-black py-4 text-center text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
                  >
                    Simulate Payment Validation (Total: {total} ₸)
                  </button>
                </div>
              )}

              {checkoutStep === 'processing' && (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 border-4 border-black border-t-[#00FF00] rounded-full mx-auto animate-spin"></div>
                  <h3 className="text-lg font-black uppercase tracking-widest">VALIDATING SENSOR BALANCE...</h3>
                  <p className="text-xs text-slate-500 uppercase max-w-xs mx-auto leading-relaxed">
                     Q-GO is double checking cart weight load with vision telemetry to confirm no unverified inventory changes. Please do not move items.
                  </p>
                </div>
              )}

              {checkoutStep === 'receipt' && paidReceipt && (
                <div className="space-y-4">
                  <div className="text-center border-b-2 border-black pb-4 text-emerald-800">
                    <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                    <h3 className="text-lg font-black uppercase tracking-tight">TRANSACTION APPROVED!</h3>
                    <p className="text-xs text-slate-500 uppercase">Automated PayPad Session Completed Successfully.</p>
                  </div>

                  {/* Ticket design scroll paper receipt */}
                  <div className="border border-stone-300 bg-stone-50 p-4 text-xs font-mono space-y-2 max-h-60 overflow-y-auto shadow-inner text-slate-800">
                    <div className="text-center font-black pb-2 border-b border-dashed border-stone-300">
                      <div>Q-GO KAZAKHSTAN ECO-RETAIL</div>
                      <div className="text-[10px] mt-0.5">ALMATY CENTRAL STAGE NODE</div>
                      <div className="text-[9px] font-normal text-slate-400">ID: {paidReceipt.id}</div>
                    </div>

                    <div className="space-y-1.5 p-1">
                      {paidReceipt.items.map(item => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.quantity}x {lang === 'ru' ? item.product.nameRu.substring(0, 18) : item.product.name.substring(0, 18)}</span>
                          <span>{item.product.price * item.quantity} ₸</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-dashed border-stone-300 pt-2 space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span>SUBTOTAL:</span>
                        <span>{paidReceipt.subtotal} ₸</span>
                      </div>
                      <div className="flex justify-between text-emerald-700">
                        <span>VIP DISCOUNT:</span>
                        <span>-{paidReceipt.discount} ₸</span>
                      </div>
                      <div className="flex justify-between font-black text-black text-sm">
                        <span>TOTAL PAID:</span>
                        <span>{paidReceipt.total} ₸</span>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-stone-300 pt-2 text-[10px] text-emerald-800 font-bold space-y-0.5">
                      <div>★ DUPLEX ECO-BONUS CREDIT:</div>
                      <div>• GREEN ECO-POINTS ACCRUED: +{paidReceipt.ecoPointsBonus} PTS</div>
                      <div>• CO₂ OFFSETS RECOUPED: -{paidReceipt.carbonSaved}g CO₂</div>
                      <div>• SAVED TIMBER: Digital Receipt only</div>
                    </div>

                    <div className="text-center text-[9px] text-slate-400 pt-2">
                      {paidReceipt.timestamp}<br/>
                      THANK YOU FOR REVOLUTIONIZING COMMERCE!
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setPaidReceipt(null);
                    }}
                    className="w-full bg-black text-[#00FF00] border-2 border-black font-black py-3 text-center text-xs tracking-widest uppercase hover:opacity-90 transition-all"
                  >
                    CONTINUE SHOPPING & SHIFT ARBONE
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

