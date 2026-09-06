/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import WiraApp from './wira/App';
import FinanceApp from './finance/App';
import CreditApp from './credit/App';
import IncotermsApp from './incoterms/App';
import CuratedApp from './curated/App';
import KalenderApp from './kalender/App';
import SyariahApp from './syariah/App';
import ProductApp from './product/App';
import MatriksApp from './matriks/App';
import TaxApp from "./tax/App";
import ValuationApp from "./valuation/App";
import InvestmentApp from "./investment/App";
import ZakatApp from './zakat/App';
import WaterApp from './water/App';
import TasksApp from "./tasks/App";
import PomodoroApp from "./pomodoro/App";
import { Briefcase, CreditCard, Wallet, LayoutDashboard, Globe, Moon, Sun, Navigation, Grid, CalendarDays, TrendingUp, Package, Scale, MoreHorizontal, Star, User, Timer, CheckSquare, Settings, Calculator, Building, Landmark, Coins, Droplet } from 'lucide-react';
import { useLanguage, Language } from './finance/hooks/useLanguage';

export default function App() {
  const [activeApp, setActiveApp] = useState<'hub' | 'wira' | 'finance' | 'credit' | 'incoterms' | 'curated' | 'kalender' | 'syariah' | 'product' | 'matriks' | 'pomodoro' | 'tasks' | 'tax' | 'valuation' | 'investment' | 'zakat' | 'water'>('hub');
  
  type ProfileModeType = 'personal' | 'business' | 'work' | 'insight' | 'outlook';

  // Profile Mode
  const [profileMode, setProfileMode] = useState<ProfileModeType>(() => {
    return (localStorage.getItem('appProfileMode') as ProfileModeType) || 'personal';
  });

  // Sub Profile Mode
  const [subProfileMode, setSubProfileMode] = useState<string>(() => {
    return localStorage.getItem('appSubProfileMode') || 'all';
  });

  const subCategories: Record<ProfileModeType, { id: string, labelKey: keyof typeof texts.en, apps: string[] }[]> = {
    personal: [
      { id: 'all', labelKey: 'all', apps: ['wira', 'finance', 'credit', 'curated', 'kalender', 'pomodoro', 'tasks', 'syariah', 'tax', 'valuation', 'investment', 'zakat', 'water'] },
      { id: 'finance', labelKey: 'subFinance', apps: ['finance', 'credit', 'syariah', 'tax', 'valuation', 'investment', 'zakat'] },
      { id: 'lifestyle', labelKey: 'subLifestyle', apps: ['wira', 'curated', 'kalender', 'pomodoro', 'tasks', 'water'] }
    ],
    business: [
      { id: 'all', labelKey: 'all', apps: ['wira', 'finance', 'incoterms', 'curated', 'kalender', 'tasks', 'product', 'matriks'] },
      { id: 'operations', labelKey: 'subOperations', apps: ['wira', 'curated', 'kalender', 'pomodoro', 'tasks', 'water'] },
      { id: 'commerce', labelKey: 'subCommerce', apps: ['finance', 'incoterms', 'product', 'matriks'] }
    ],
    work: [
      { id: 'all', labelKey: 'all', apps: ['wira', 'curated', 'kalender', 'pomodoro', 'tasks', 'product', 'matriks', 'water'] },
      { id: 'planning', labelKey: 'subPlanning', apps: ['wira', 'curated', 'kalender', 'pomodoro', 'tasks', 'water'] },
      { id: 'strategy', labelKey: 'subStrategy', apps: ['product', 'matriks'] }
    ],
    insight: [
      { id: 'all', labelKey: 'all', apps: ['finance', 'credit', 'syariah', 'tax', 'valuation', 'investment', 'matriks', 'zakat'] },
      { id: 'market', labelKey: 'subMarket', apps: ['finance', 'syariah'] },
      { id: 'analysis', labelKey: 'subAnalysis', apps: ['credit', 'matriks'] }
    ],
    outlook: [
      { id: 'all', labelKey: 'all', apps: ['wira', 'incoterms', 'curated', 'kalender', 'tasks', 'product'] },
      { id: 'future', labelKey: 'subFuture', apps: ['wira', 'kalender'] },
      { id: 'resources', labelKey: 'subResources', apps: ['incoterms', 'curated', 'product'] }
    ]
  };
  
  // Theme management at root level
  const [theme, setTheme] = useState<'Dark' | 'Light'>(() => {
    return (localStorage.getItem('appTheme') as 'Dark' | 'Light') || 'Light';
  });

  const lang = useLanguage();

  useEffect(() => {
    if (theme === 'Dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'Dark' ? 'Light' : 'Dark';
    setTheme(newTheme);
    localStorage.setItem('appTheme', newTheme);
  };

  const cycleLanguage = () => {
    const langs: Language[] = ['id', 'en', 'ms', 'zh'];
    const currentIndex = langs.indexOf(lang);
    const nextLang = langs[(currentIndex + 1) % langs.length];
    localStorage.setItem('appLanguage', nextLang);
    window.dispatchEvent(new Event('languageChange'));
  };

  const texts = {
    id: { 
      title: "Pusat Perintah UnifiedOS", 
      subtitle: "Pilih ruang kerja untuk diluncurkan",
      wira: "Kehidupan & Produktivitas",
      wiraDesc: "Kelola catatan, tugas, kebiasaan, proyek, dan tujuan harian (Wirapreneur).",
      finance: "Keuangan & Kekayaan",
      financeDesc: "Lacak kekayaan bersih, aset, investasi, dan tujuan keuangan jangka panjang.",
      credit: "Kredit & Utang",
      creditDesc: "Kelola saldo kartu kredit, tanggal jatuh tempo, cicilan, dan rencana pelunasan utang.",
      incoterms: "Panduan Incoterms®",
      incotermsDesc: "Cari istilah dan definisi aturan perdagangan internasional Incoterms 2020.",
      curated: "Kurasi Link",
      curatedDesc: "Kumpulan link kurasi untuk aset, alat, dan referensi desain.",
      kalender: "Kalender Global",
      kalenderDesc: "Kalender dengan hari libur nasional untuk berbagai negara.",
      syariah: "Syariah Saham",
      syariahDesc: "Pantau indeks saham syariah dan harga logam mulia secara real-time.",
      product: "Katalog Produk",
      productDesc: "Manajemen portofolio produk, fitur, dan log rilis.",
      matriks: "Matriks Keputusan",
      matriksDesc: "Alat bantu analisis untuk pengambilan keputusan objektif.",
      commandCenter: "Pusat Perintah",
      lightMode: "Mode Terang",
      darkMode: "Mode Gelap",
      more: "Lainnya",
      favorites: "Favorit",
      profile: "Profil",
      settings: "Pengaturan",
      personalMode: "Pribadi",
      businessMode: "Bisnis",
      workMode: "Kerja",
      insightMode: "Insight",
      outlookMode: "Outlook",
      all: "Semua",
      subFinance: "Keuangan",
      subLifestyle: "Gaya Hidup",
      subOperations: "Operasional",
      subCommerce: "Komersial",
      subPlanning: "Perencanaan",
      subStrategy: "Strategi",
      subMarket: "Pasar",
      subAnalysis: "Analisis",
      subFuture: "Masa Depan",
      subResources: "Sumber Daya"
    },
    en: { 
      title: "UnifiedOS Command Center", 
      subtitle: "Select a workspace to launch",
      wira: "Life & Productivity",
      wiraDesc: "Manage notes, tasks, habits, projects, and daily goals (Wirapreneur).",
      finance: "Finance & Wealth",
      financeDesc: "Track net worth, assets, investments, and long-term financial goals.",
      credit: "Credit & Debt",
      creditDesc: "Manage credit card balances, due dates, EMIs, and debt payoff plans.",
      incoterms: "Incoterms® Guide",
      incotermsDesc: "Search terms and definitions for Incoterms 2020 international trade rules.",
      curated: "Curated Links",
      curatedDesc: "Curated collection of links for design assets, tools, and references.",
      kalender: "Global Calendar",
      kalenderDesc: "Calendar featuring national holidays for multiple countries.",
      syariah: "Sharia Stocks",
      syariahDesc: "Monitor sharia stock indices and precious metal prices in real-time.",
      product: "Product Catalog",
      productDesc: "Manage product portfolios, features, and release logs.",
      matriks: "Decision Matrix",
      matriksDesc: "Analytical tool for objective decision making.",
      commandCenter: "Command Center",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      more: "More",
      favorites: "Favorites",
      profile: "Profile",
      settings: "Settings",
      personalMode: "Personal",
      businessMode: "Business",
      workMode: "Work",
      insightMode: "Insight",
      outlookMode: "Outlook",
      all: "All",
      subFinance: "Finance",
      subLifestyle: "Lifestyle",
      subOperations: "Operations",
      subCommerce: "Commerce",
      subPlanning: "Planning",
      subStrategy: "Strategy",
      subMarket: "Market",
      subAnalysis: "Analysis",
      subFuture: "Future",
      subResources: "Resources"
    },
    ms: { 
      title: "Pusat Perintah UnifiedOS", 
      subtitle: "Pilih ruang kerja untuk dilancarkan",
      wira: "Kehidupan & Produktiviti",
      wiraDesc: "Urus nota, tugas, tabiat, projek, dan matlamat harian (Wirapreneur).",
      finance: "Kewangan & Kekayaan",
      financeDesc: "Jejaki nilai bersih, aset, pelaburan, dan matlamat kewangan jangka panjang.",
      credit: "Kredit & Hutang",
      creditDesc: "Urus baki kad kredit, tarikh akhir, EMI, dan pelan penyelesaian hutang.",
      incoterms: "Panduan Incoterms®",
      incotermsDesc: "Cari istilah dan definisi peraturan perdagangan antarabangsa Incoterms 2020.",
      curated: "Pautan Kurasi",
      curatedDesc: "Koleksi pautan kurasi untuk aset, alat dan rujukan reka bentuk.",
      kalender: "Kalendar Global",
      kalenderDesc: "Kalendar dengan cuti umum kebangsaan untuk pelbagai negara.",
      syariah: "Saham Syariah",
      syariahDesc: "Pantau indeks saham syariah dan harga logam berharga masa nyata.",
      product: "Katalog Produk",
      productDesc: "Pengurusan portfolio produk, ciri, dan log pelepasan.",
      matriks: "Matriks Keputusan",
      matriksDesc: "Alat analisis untuk pembuatan keputusan yang objektif.",
      commandCenter: "Pusat Perintah",
      lightMode: "Mod Cerah",
      darkMode: "Mod Gelap",
      more: "Lainnya",
      favorites: "Kegemaran",
      profile: "Profil",
      settings: "Tetapan",
      personalMode: "Peribadi",
      businessMode: "Perniagaan",
      workMode: "Kerja",
      insightMode: "Insight",
      outlookMode: "Outlook",
      all: "Semua",
      subFinance: "Kewangan",
      subLifestyle: "Gaya Hidup",
      subOperations: "Operasi",
      subCommerce: "Komersial",
      subPlanning: "Perancangan",
      subStrategy: "Strategi",
      subMarket: "Pasaran",
      subAnalysis: "Analisis",
      subFuture: "Masa Depan",
      subResources: "Sumber"
    },
    zh: { 
      title: "UnifiedOS 命令中心", 
      subtitle: "选择要启动的工作区",
      wira: "生活与生产力",
      wiraDesc: "管理笔记、任务、习惯、项目和日常目标 (Wirapreneur)。",
      finance: "财务与财富",
      financeDesc: "跟踪净值、资产、投资和长期财务目标。",
      credit: "信用与债务",
      creditDesc: "管理信用卡余额、到期日、EMI和债务偿还计划。",
      incoterms: "国际贸易术语指南",
      incotermsDesc: "搜索 Incoterms 2020 国际贸易规则的术语和定义。",
      curated: "精选链接",
      curatedDesc: "精选的设计资产、工具和参考链接集合。",
      kalender: "全球日历",
      kalenderDesc: "包含多个国家/地区公共假期的日历。",
      syariah: "伊斯兰教法股票",
      syariahDesc: "实时监控伊斯兰教法股票指数和贵金属价格。",
      product: "产品目录",
      productDesc: "管理产品组合、功能和发布日志。",
      matriks: "决策矩阵",
      matriksDesc: "用于客观决策的分析工具。",
      commandCenter: "命令中心",
      lightMode: "亮色模式",
      darkMode: "暗色模式",
      more: "更多",
      favorites: "收藏夹",
      profile: "个人资料",
      settings: "设置",
      personalMode: "个人",
      businessMode: "商业",
      workMode: "工作",
      insightMode: "洞察",
      outlookMode: "展望",
      all: "全部",
      subFinance: "财务",
      subLifestyle: "生活方式",
      subOperations: "运营",
      subCommerce: "商业",
      subPlanning: "规划",
      subStrategy: "战略",
      subMarket: "市场",
      subAnalysis: "分析",
      subFuture: "未来",
      subResources: "资源"
    }
  };

  const handleProfileModeChange = (mode: ProfileModeType) => {
    setProfileMode(mode);
    setSubProfileMode('all');
    localStorage.setItem('appProfileMode', mode);
    localStorage.setItem('appSubProfileMode', 'all');
  };

  const handleSubProfileModeChange = (subMode: string) => {
    setSubProfileMode(subMode);
    localStorage.setItem('appSubProfileMode', subMode);
  };

  if (activeApp === 'wira') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <WiraApp />
      </div>
    </div>
  );
  if (activeApp === 'finance') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <FinanceApp />
      </div>
    </div>
  );
  if (activeApp === 'credit') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <CreditApp />
      </div>
    </div>
  );
  
  if (activeApp === 'incoterms') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <IncotermsApp />
      </div>
    </div>
  );

  if (activeApp === 'curated') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <CuratedApp />
      </div>
    </div>
  );

  if (activeApp === 'kalender') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <KalenderApp />
      </div>
    </div>
  );

  if (activeApp === 'syariah') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <SyariahApp />
      </div>
    </div>
  );

  if (activeApp === 'tax') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <TaxApp />
      </div>
    </div>
  );

  if (activeApp === 'valuation') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <ValuationApp />
      </div>
    </div>
  );

    if (activeApp === 'investment') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <InvestmentApp />
      </div>
    </div>
  );

    if (activeApp === 'zakat') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <ZakatApp />
      </div>
    </div>
  );

  if (activeApp === 'water') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <WaterApp />
      </div>
    </div>
  );
  if (activeApp === 'product') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <ProductApp />
      </div>
    </div>
  );

  if (activeApp === 'matriks') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <MatriksApp />
      </div>
    </div>
  );

  if (activeApp === 'pomodoro') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <PomodoroApp />
      </div>
    </div>
  );

  if (activeApp === 'tasks') return (
    <div className="h-screen w-screen flex flex-col relative bg-slate-50 font-sans text-slate-900">
      <button onClick={() => setActiveApp('hub')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-indigo-700 transition-colors">
        <LayoutDashboard size={16} /> {texts[lang].commandCenter}
      </button>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <TasksApp />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 font-sans p-8 relative">
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <button onClick={cycleLanguage} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-100 transition-colors">
          <Globe size={14} />
          {lang.toUpperCase()}
        </button>
        <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-100 transition-colors">
          {theme === 'Dark' ? <Sun size={14} /> : <Moon size={14} />}
          {theme === 'Dark' ? texts[lang].lightMode : texts[lang].darkMode}
        </button>
      </div>

      <div className="text-center mb-8 mt-4">
        <h1 className="text-4xl font-bold tracking-tight">{texts[lang].title}</h1>
        <p className="text-sm font-medium text-slate-500 mt-2 mb-8">{texts[lang].subtitle}</p>
        
        {/* Profile Mode Toggle */}
        <div className="inline-flex bg-slate-200/50 p-1 rounded-full border border-slate-200">
          <button 
            onClick={() => handleProfileModeChange('personal')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${profileMode === 'personal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {texts[lang].personalMode}
          </button>
          <button 
            onClick={() => handleProfileModeChange('business')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${profileMode === 'business' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {texts[lang].businessMode}
          </button>
          <button 
            onClick={() => handleProfileModeChange('work')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${profileMode === 'work' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {texts[lang].workMode}
          </button>
          <button 
            onClick={() => handleProfileModeChange('insight')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${profileMode === 'insight' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {texts[lang].insightMode}
          </button>
          <button 
            onClick={() => handleProfileModeChange('outlook')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${profileMode === 'outlook' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {texts[lang].outlookMode}
          </button>
        </div>

        {/* Sub Profile Mode Toggle */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {subCategories[profileMode].map(sub => (
            <button
              key={sub.id}
              onClick={() => handleSubProfileModeChange(sub.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${subProfileMode === sub.id ? 'bg-slate-800 text-white border-slate-800' : 'bg-transparent text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-100'}`}
            >
              {texts[lang][sub.labelKey as keyof typeof texts.en]}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 max-w-7xl w-full">
        {[
          { id: 'wira', icon: Briefcase, title: texts[lang].wira, desc: texts[lang].wiraDesc, modes: ['personal', 'business', 'work', 'outlook'] },
          { id: 'finance', icon: Wallet, title: texts[lang].finance, desc: texts[lang].financeDesc, modes: ['personal', 'business', 'insight'] },
          { id: 'credit', icon: CreditCard, title: texts[lang].credit, desc: texts[lang].creditDesc, modes: ['personal', 'insight'] },
          { id: 'incoterms', icon: Navigation, title: texts[lang].incoterms, desc: texts[lang].incotermsDesc, modes: ['business', 'outlook'] },
          { id: 'curated', icon: Grid, title: texts[lang].curated, desc: texts[lang].curatedDesc, modes: ['personal', 'business', 'work', 'outlook'] },
          { id: 'kalender', icon: CalendarDays, title: texts[lang].kalender, desc: texts[lang].kalenderDesc, modes: ['personal', 'business', 'work', 'outlook'] },
          { id: 'syariah', icon: TrendingUp, title: texts[lang].syariah, desc: texts[lang].syariahDesc, modes: ['personal', 'insight'] },
          { id: "tax", icon: Calculator, title: "Kalkulator Pajak", desc: "Pajak & Ketentuan", modes: ["personal", "insight"] },
          { id: "valuation", icon: Building, title: "Valuasi MAPPI", desc: "Penilaian Properti", modes: ["personal", "insight"] },
          { id: "investment", icon: Landmark, title: "Alat Investasi", desc: "Instrumen Syariah", modes: ["personal", "insight"] },
          { id: "zakat", icon: Coins, title: "Kalkulator Zakat", desc: "Zakat Fitrah & Maal", modes: ["personal", "insight"] },
          { id: "water", icon: Droplet, title: "Water Tracker", desc: "Track daily hydration", modes: ["personal", "work"] },
          { id: 'product', icon: Package, title: texts[lang].product, desc: texts[lang].productDesc, modes: ['business', 'work', 'outlook'] },
          { id: "tasks", icon: CheckSquare, title: "Task Manager", desc: "Manage your daily tasks and to-dos.", modes: ["personal", "business", "work", "outlook"] },
          { id: "pomodoro", icon: Timer, title: "Pomodoro Timer", desc: "Focus and productivity timer.", modes: ["personal", "work"] },
          { id: 'matriks', icon: Scale, title: texts[lang].matriks, desc: texts[lang].matriksDesc, modes: ['business', 'work', 'insight'] }
        ].filter(app => {
          if (!app.modes.includes(profileMode)) return false;
          const currentSubCategories = subCategories[profileMode];
          const activeSubCategory = currentSubCategories.find(c => c.id === subProfileMode) || currentSubCategories[0];
          return activeSubCategory.apps.includes(app.id);
        }).map((app) => (
          <button 
            key={app.id}
            onClick={() => setActiveApp(app.id as any)}
            className="group flex flex-col text-left p-6 bg-white rounded-[24px] border border-slate-200/80 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
              <app.icon size={24} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">{app.title}</h2>
            <p className="text-sm text-slate-500 leading-relaxed">{app.desc}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mt-12 space-x-4 max-w-[500px] w-full">
        <button 
            className="flex-1 py-3 rounded-3xl shadow-sm bg-white/90 backdrop-blur border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={texts[lang].more}
            onClick={() => alert('Segera hadir')}
        >
            <MoreHorizontal size={24} />
        </button>
        <button 
            className="flex-1 py-3 rounded-3xl shadow-sm bg-white/90 backdrop-blur border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={texts[lang].favorites}
            onClick={() => alert('Segera hadir')}
        >
            <Star size={24} />
        </button>
        <button 
            onClick={() => alert('Segera hadir')}
            className="flex-1 py-3 rounded-3xl shadow-sm bg-white/90 backdrop-blur border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={texts[lang].profile}
        >
            <User size={24} />
        </button>
        <button 
            onClick={() => alert('Segera hadir')}
            className="flex-1 py-3 rounded-3xl shadow-sm bg-white/90 backdrop-blur border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={texts[lang].settings}
        >
            <Settings size={24} />
        </button>
      </div>
    </div>
  );
}
