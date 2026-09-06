import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Folder,
  MoreHorizontal,
  Plus,
  Check,
  Search,
  Bell,
  LayoutGrid,
  ChevronLeft,
  List,
  Grid,
  TrendingUp,
  Calculator,
  Save,
  Briefcase,
  Users,
  Scale,
  Activity,
  Coins
} from "lucide-react";
import { cn } from "../wira/lib/utils";
import { useAuth } from '../syariah/lib/AuthContext';
import { useSaveCalculation } from '../syariah/lib/useSaveCalculation';

interface TickTickLayoutProps {
  onBack?: () => void;
}

export default function App({ onBack }: TickTickLayoutProps = {}) {
  const [selectedTool, setSelectedTool] = useState<any | null>(null);
  const [activeView, setActiveView] = useState<"all" | "maal" | "fitrah" | "penghasilan">("all");
  const [layoutMode, setLayoutMode] = useState<"list" | "grid">("grid");

  // Auth and Save context
  const { user } = useAuth();
  const { save: saveMaal, status: statusMaal } = useSaveCalculation('zakat_maal');
  const { save: savePenghasilan, status: statusPenghasilan } = useSaveCalculation('zakat_penghasilan');
  const { save: saveFitrah, status: statusFitrah } = useSaveCalculation('zakat_fitrah');

  const [goldPrice, setGoldPrice] = useState<number>(1450000); // 1.45jt / gr
  const nisabGold85 = 85 * goldPrice; // Nisab Maal/Penghasilan (85 gram emas)

  // Zakat Maal States
  const [cash, setCash] = useState<number>(0);
  const [goldWeight, setGoldWeight] = useState<number>(0);
  
  // Zakat Penghasilan States
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [otherIncome, setOtherIncome] = useState<number>(0);

  // Zakat Fitrah States
  const [familyMembers, setFamilyMembers] = useState<number>(1);
  const [ricePricePerKg, setRicePricePerKg] = useState<number>(15000);

  // Tools mock data
  const tools = [
    {
      id: "penghasilan",
      title: "Zakat Penghasilan",
      category: "penghasilan",
      group: "Zakat Utama",
      icon: Briefcase,
      description: "Hitung kewajiban zakat profesi/penghasilan bulanan Anda.",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      id: "maal",
      title: "Zakat Maal",
      category: "maal",
      group: "Zakat Utama",
      icon: Scale,
      description: "Kalkulasi kewajiban zakat harta simpanan (uang, tabungan, dan emas).",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50"
    },
    {
      id: "fitrah",
      title: "Zakat Fitrah",
      category: "fitrah",
      group: "Zakat Tambahan",
      icon: Users,
      description: "Hitung besaran beras/makanan pokok atau uang zakat fitrah per jiwa.",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    }
  ];

  const filteredTools = activeView === "all" ? tools : tools.filter(t => t.category === activeView);

  // Calculations
  // Maal
  const goldValue = goldWeight * goldPrice;
  const totalAssets = cash + goldValue;
  const isMaalEligible = totalAssets >= nisabGold85;
  const zakatMaal = isMaalEligible ? totalAssets * 0.025 : 0;

  // Penghasilan
  const totalMonthlyIncome = monthlyIncome + otherIncome;
  const totalYearlyIncome = totalMonthlyIncome * 12;
  const isPenghasilanEligible = totalYearlyIncome >= nisabGold85;
  const zakatPenghasilanBulanan = isPenghasilanEligible ? totalMonthlyIncome * 0.025 : 0;
  const zakatPenghasilanTahunan = isPenghasilanEligible ? totalYearlyIncome * 0.025 : 0;

  // Fitrah
  const zakatWeightPerPerson = 2.5;
  const totalWeightFitrah = familyMembers * zakatWeightPerPerson;
  const totalCashFitrah = totalWeightFitrah * ricePricePerKg;

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex h-full w-full bg-white text-slate-800 overflow-hidden font-sans relative">
      {/* Pane 1: Narrow Sidebar */}
      <div className="hidden md:flex w-[240px] shrink-0 bg-[#F9F9F9] border-r border-slate-200 flex-col transition-all">
        {onBack && (
          <div
            onClick={onBack}
            className="h-10 flex items-center px-4 cursor-pointer hover:bg-slate-200/50 transition-colors text-slate-500 border-b border-slate-200"
          >
            <ChevronLeft size={16} className="mr-1" />
            <span className="text-[13px] font-medium">Back to Hub</span>
          </div>
        )}

        {/* Profile / Header */}
        <div className="h-14 flex items-center justify-between px-4 mb-2 shrink-0">
          <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-emerald-600 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-sm">
              Z
            </div>
            <span className="ml-2 font-semibold text-sm">Kalkulator Zakat</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors">
              <Search size={16} />
            </button>
            <button className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors">
              <Bell size={16} />
            </button>
          </div>
        </div>

        {/* Nav Items */}
        <div className="px-3 space-y-0.5 flex-1 overflow-y-auto scrollbar-hide pb-6">
          <NavItem
            icon={LayoutGrid}
            label="Semua Alat"
            count={tools.length}
            active={activeView === "all"}
            onClick={() => setActiveView("all")}
          />
          
          <div className="mt-6 mb-2 px-2 text-xs font-semibold text-slate-400 flex items-center justify-between group cursor-pointer">
            KATEGORI
            <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <NavItem
            icon={Briefcase}
            label="Penghasilan"
            color="text-blue-500"
            count={tools.filter(t => t.category === "penghasilan").length}
            active={activeView === "penghasilan"}
            onClick={() => setActiveView("penghasilan")}
          />
          <NavItem
            icon={Scale}
            label="Maal (Harta)"
            color="text-emerald-500"
            count={tools.filter(t => t.category === "maal").length}
            active={activeView === "maal"}
            onClick={() => setActiveView("maal")}
          />
          <NavItem
            icon={Users}
            label="Fitrah"
            color="text-orange-500"
            count={tools.filter(t => t.category === "fitrah").length}
            active={activeView === "fitrah"}
            onClick={() => setActiveView("fitrah")}
          />
        </div>
      </div>

      {/* Pane 2: Tools List */}
      <div className={cn(
        "flex flex-col bg-white border-r border-slate-200 transition-all",
        selectedTool ? "hidden lg:flex lg:w-[320px]" : "w-full md:flex-1 lg:w-[320px] shrink-0"
      )}>
        <div className="h-14 flex items-center justify-between px-4 md:px-6 shrink-0 border-b border-transparent">
          <div className="flex items-center gap-2 md:hidden">
            {onBack && (
              <button onClick={onBack} className="p-1 -ml-1 text-slate-500 hover:bg-slate-100 rounded-md">
                <ChevronLeft size={20} />
              </button>
            )}
            <h2 className="text-lg font-bold capitalize">{activeView} Zakat</h2>
          </div>
          <h2 className="hidden md:block text-xl font-bold capitalize">{activeView} Alat Zakat</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLayoutMode("list")}
              className={cn("p-1.5 rounded-md transition-colors", layoutMode === "list" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600")}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setLayoutMode("grid")}
              className={cn("p-1.5 rounded-md transition-colors", layoutMode === "grid" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600")}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-20 md:pb-6">
          {["Zakat Utama", "Zakat Tambahan"].map(group => {
            const groupTools = filteredTools.filter(t => t.group === group);
            if (groupTools.length === 0) return null;

            return (
              <div key={group} className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-slate-800">{group}</h3>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{groupTools.length}</span>
                </div>
                <div className={cn(
                  "grid gap-3",
                  layoutMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1" : "grid-cols-1"
                )}>
                  {groupTools.map(tool => (
                    <div
                      key={tool.id}
                      onClick={() => setSelectedTool(tool)}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md",
                        selectedTool?.id === tool.id ? "border-emerald-500 ring-1 ring-emerald-500/20 bg-emerald-50/10" : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={cn("p-2.5 rounded-lg", tool.bgColor, tool.color)}>
                          <tool.icon size={20} />
                        </div>
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-1">{tool.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pane 3: Tool Detail */}
      <AnimatePresence>
        {selectedTool && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-10 flex flex-col bg-white lg:static lg:flex-1 border-l border-slate-200"
          >
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100 shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedTool(null)}
                  className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Folder size={14} />
                  <span className="capitalize">{selectedTool.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 px-3 py-1 bg-slate-100 rounded-full">
                Harga Emas: {formatIDR(goldPrice)}/g
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className={cn("p-3 rounded-xl", selectedTool.bgColor, selectedTool.color)}>
                    <selectedTool.icon size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedTool.title}</h2>
                    <p className="text-slate-500 text-sm mt-1">{selectedTool.description}</p>
                  </div>
                </div>

                {/* --- CALCULATOR VIEWS --- */}
                
                {selectedTool.id === "penghasilan" && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-blue-50/30">
                      <h3 className="font-bold text-blue-800 mb-6">Penghasilan Bulanan</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Gaji Pokok & Tunjangan (Bulan)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                            <input
                              type="number"
                              value={monthlyIncome || ''}
                              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium text-slate-800"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Penghasilan Lain / Bonus (Bulan)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                            <input
                              type="number"
                              value={otherIncome || ''}
                              onChange={(e) => setOtherIncome(Number(e.target.value))}
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium text-slate-800"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-500">Total Penghasilan (Per Bulan)</span>
                        <span className="font-semibold text-slate-800">{formatIDR(totalMonthlyIncome)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-500">Total Penghasilan (Per Tahun)</span>
                        <span className="font-semibold text-slate-800">{formatIDR(totalYearlyIncome)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-500">Nisab (85 gram emas)</span>
                        <span className="font-semibold text-slate-800">{formatIDR(nisabGold85)}</span>
                      </div>
                      <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center">
                        <div>
                          <span className="block text-blue-600 font-semibold mb-1">Status Zakat</span>
                          <span className="text-xs text-blue-500">{isPenghasilanEligible ? "Wajib Zakat" : "Belum Wajib Zakat (Di bawah nisab)"}</span>
                        </div>
                      </div>

                      {isPenghasilanEligible && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">Zakat Bulanan (2.5%)</span>
                            <span className="text-xl font-bold text-slate-800">{formatIDR(zakatPenghasilanBulanan)}</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">Zakat Tahunan (2.5%)</span>
                            <span className="text-xl font-bold text-slate-800">{formatIDR(zakatPenghasilanTahunan)}</span>
                          </div>
                        </div>
                      )}

                      {user && isPenghasilanEligible && (
                        <button
                          onClick={() => savePenghasilan(`Zakat Penghasilan — ${formatIDR(zakatPenghasilanBulanan)}/bln`, { monthlyIncome, otherIncome }, { zakatPenghasilanBulanan, zakatPenghasilanTahunan })}
                          disabled={statusPenghasilan !== 'idle'}
                          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                          {statusPenghasilan === 'idle' && <><Save className="w-4 h-4" /> Simpan Hasil</>}
                          {statusPenghasilan === 'saving' && 'Menyimpan...'}
                          {statusPenghasilan === 'saved' && <><Check className="w-4 h-4" /> Tersimpan</>}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {selectedTool.id === "maal" && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-emerald-50/30">
                      <h3 className="font-bold text-emerald-800 mb-6">Harta Simpanan (Maal)</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Uang Tunai & Tabungan</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                            <input
                              type="number"
                              value={cash || ''}
                              onChange={(e) => setCash(Number(e.target.value))}
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none font-medium text-slate-800"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Emas Simpanan (Gram)</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={goldWeight || ''}
                              onChange={(e) => setGoldWeight(Number(e.target.value))}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none font-medium text-slate-800"
                              placeholder="0"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">gr</span>
                          </div>
                          <span className="text-xs text-slate-400 mt-1 block">Nilai emas: {formatIDR(goldValue)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-500">Total Harta Keseluruhan</span>
                        <span className="font-semibold text-slate-800">{formatIDR(totalAssets)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-500">Nisab (85 gram emas)</span>
                        <span className="font-semibold text-slate-800">{formatIDR(nisabGold85)}</span>
                      </div>
                      
                      <div className="mt-6 p-5 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between items-center">
                        <div>
                          <span className="block text-emerald-700 font-semibold mb-1">Status Zakat</span>
                          <span className="text-xs text-emerald-600">{isMaalEligible ? "Wajib Zakat" : "Belum Wajib Zakat (Di bawah nisab)"}</span>
                        </div>
                      </div>

                      {isMaalEligible && (
                        <div className="bg-emerald-600 text-white p-5 rounded-xl flex justify-between items-center mt-4">
                          <span className="font-semibold">Zakat Maal (2.5%)</span>
                          <span className="text-2xl font-bold">{formatIDR(zakatMaal)}</span>
                        </div>
                      )}

                      {user && isMaalEligible && (
                        <button
                          onClick={() => saveMaal(`Zakat Maal — ${formatIDR(zakatMaal)}`, { cash, goldWeight }, { zakatMaal })}
                          disabled={statusMaal !== 'idle'}
                          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                          {statusMaal === 'idle' && <><Save className="w-4 h-4" /> Simpan Hasil</>}
                          {statusMaal === 'saving' && 'Menyimpan...'}
                          {statusMaal === 'saved' && <><Check className="w-4 h-4" /> Tersimpan</>}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {selectedTool.id === "fitrah" && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-orange-50/30">
                      <h3 className="font-bold text-orange-800 mb-6">Tanggungan Fitrah</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Jumlah Jiwa (Orang)</label>
                          <input
                            type="number"
                            value={familyMembers || ''}
                            onChange={(e) => setFamilyMembers(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none font-medium text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Harga Beras / Pokok (Per Kg)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                            <input
                              type="number"
                              value={ricePricePerKg || ''}
                              onChange={(e) => setRicePricePerKg(Number(e.target.value))}
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none font-medium text-slate-800"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-500">Ketentuan Berat (2.5 Kg / Jiwa)</span>
                        <span className="font-semibold text-slate-800">{totalWeightFitrah} Kg</span>
                      </div>
                      <div className="mt-6 p-5 bg-orange-50 rounded-xl border border-orange-100 flex justify-between items-center">
                        <div>
                          <span className="block text-orange-700 font-semibold mb-1">Zakat Fitrah Dibayar</span>
                          <span className="text-xs text-orange-600">Total Uang</span>
                        </div>
                        <span className="text-2xl font-bold text-orange-700">{formatIDR(totalCashFitrah)}</span>
                      </div>

                      {user && familyMembers > 0 && (
                        <button
                          onClick={() => saveFitrah(`Zakat Fitrah — ${formatIDR(totalCashFitrah)}`, { familyMembers, ricePricePerKg }, { totalWeightFitrah, totalCashFitrah })}
                          disabled={statusFitrah !== 'idle'}
                          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                          {statusFitrah === 'idle' && <><Save className="w-4 h-4" /> Simpan Hasil</>}
                          {statusFitrah === 'saving' && 'Menyimpan...'}
                          {statusFitrah === 'saved' && <><Check className="w-4 h-4" /> Tersimpan</>}
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon: Icon, label, count, active, color, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors group",
        active
          ? "bg-emerald-50/50 text-emerald-600 font-medium"
          : "hover:bg-slate-100 border border-transparent",
      )}
    >
      <Icon
        size={16}
        className={cn(
          "mr-3",
          color ||
            (active
              ? "text-emerald-600"
              : "text-slate-500 group-hover:text-slate-700 transition-colors"),
        )}
      />
      <span
        className={cn(
          "flex-1 text-[13px]",
          active ? "font-semibold" : "text-slate-700",
        )}
      >
        {label}
      </span>
      {count !== undefined && (
        <span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full transition-colors",
            active
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-600",
          )}
        >
          {count}
        </span>
      )}
    </div>
  );
}
