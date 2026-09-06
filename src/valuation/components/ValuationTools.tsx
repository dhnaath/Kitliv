import React, { useState } from 'react';
import { Building, TrendingUp, ChevronRight, Briefcase, Save, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { useSaveCalculation } from '../lib/useSaveCalculation';

export default function ValuationTools({ activeTab }: { activeTab: string }) {
  const { user } = useAuth();
  const { save: savePropertiIncome, status: statusPropertiIncome } = useSaveCalculation('valuasi_properti_income');
  const { save: savePropertiCost, status: statusPropertiCost } = useSaveCalculation('valuasi_properti_cost');
  const { save: saveBusinessIncome, status: statusBusinessIncome } = useSaveCalculation('valuasi_bisnis_income');
  const { save: saveBusinessMarket, status: statusBusinessMarket } = useSaveCalculation('valuasi_bisnis_market');

  

  // Property State - Income Approach
  const [grossIncome, setGrossIncome] = useState<number>(500000000);
  const [vacancyRate, setVacancyRate] = useState<number>(5);
  const [operatingExpenses, setOperatingExpenses] = useState<number>(100000000);
  const [capRate, setCapRate] = useState<number>(8);

  // Property State - Cost Approach
  const [landArea, setLandArea] = useState<number>(200);
  const [landValue, setLandValue] = useState<number>(15000000);
  const [buildingArea, setBuildingArea] = useState<number>(150);
  const [buildingCost, setBuildingCost] = useState<number>(8000000);
  const [depreciation, setDepreciation] = useState<number>(20);

  // Business State - Income Approach
  const [freeCashFlow, setFreeCashFlow] = useState<number>(1000000000);
  const [discountRate, setDiscountRate] = useState<number>(12);
  const [growthRate, setGrowthRate] = useState<number>(4);

  // Business State - Market Approach
  const [netIncome, setNetIncome] = useState<number>(5000000000);
  const [peRatio, setPeRatio] = useState<number>(15);
  const [equityValue, setEquityValue] = useState<number>(20000000000);
  const [pbvRatio, setPbvRatio] = useState<number>(2.5);

  // Property Calculation (Direct Capitalization)
  const effectiveGrossIncome = grossIncome - (grossIncome * (vacancyRate / 100));
  const netOperatingIncome = effectiveGrossIncome - operatingExpenses;
  const propertyValue = capRate > 0 ? (netOperatingIncome / (capRate / 100)) : 0;

  // Property Calculation (Cost Approach)
  const totalLandValue = landArea * landValue;
  const newBuildingCost = buildingArea * buildingCost;
  const totalDepreciation = newBuildingCost * (depreciation / 100);
  const netBuildingValue = newBuildingCost - totalDepreciation;
  const propertyCostValue = totalLandValue + netBuildingValue;

  // Business Calculation (Gordon Growth Model)
  const businessValue = (discountRate > growthRate) 
    ? (freeCashFlow * (1 + (growthRate / 100))) / ((discountRate - growthRate) / 100) 
    : 0;

  // Business Calculation (Multiples)
  const valueFromPE = netIncome * peRatio;
  const valueFromPBV = equityValue * pbvRatio;

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      
        </button>
      </div>

      {activeTab === 'property' && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-5 h-5 text-slate-800" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Standar Penilaian Indonesia (SPI)</span>
                </div>
                <h2 className="text-3xl font-semibold text-slate-800">Pendekatan Pendapatan</h2>
              </div>
              <div className="text-sm font-medium opacity-60 text-right">
                Metode Kapitalisasi Langsung<br />(Direct Capitalization)
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                    Potensi Pendapatan Kotor (PGI)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">Rp</span>
                    <input
                      type="number"
                      min="0"
                      value={grossIncome || ''}
                      onChange={(e) => setGrossIncome(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200/30 px-12 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                      Tingkat Kekosongan
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={vacancyRate || ''}
                        onChange={(e) => setVacancyRate(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200/30 pl-4 pr-8 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                      Beban Operasional (OPEX)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">Rp</span>
                      <input
                        type="number"
                        min="0"
                        value={operatingExpenses || ''}
                        onChange={(e) => setOperatingExpenses(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200/30 px-12 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                    Tingkat Kapitalisasi (Cap Rate)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={capRate || ''}
                      onChange={(e) => setCapRate(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200/30 pl-4 pr-8 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">%</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 text-white p-8 flex flex-col justify-center relative overflow-hidden">
                <Building className="absolute -bottom-8 -right-8 w-48 h-48 opacity-5 text-white pointer-events-none" />
                <div className="relative z-10 space-y-6">
                  
                  <div className="space-y-2 text-sm opacity-80 pb-4 border-b border-white/10">
                    <div className="flex justify-between">
                      <span>Pendapatan Kotor Efektif (EGI)</span>
                      <span>{formatIDR(effectiveGrossIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pendapatan Operasional Bersih (NOI)</span>
                      <span>{formatIDR(netOperatingIncome)}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 block mb-2">Indikasi Nilai Properti</span>
                    <div className="text-3xl sm:text-4xl font-semibold mb-2 text-white">
                      {formatIDR(propertyValue)}
                    </div>
                    <span className="text-xs font-medium opacity-60 block">
                      NOI ÷ Cap Rate
                    </span>
                    
                    {user && propertyValue > 0 && (
                      <button
                        onClick={() => savePropertiIncome(`Valuasi Properti (Income) — ${formatIDR(propertyValue)}`, { grossIncome, vacancyRate, operatingExpenses, capRate }, { effectiveGrossIncome, netOperatingIncome, propertyValue })}
                        disabled={statusPropertiIncome !== 'idle'}
                        className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-colors disabled:opacity-50 border border-white/20"
                      >
                        {statusPropertiIncome === 'idle' && <><Save className="w-4 h-4" /> Simpan Hasil</>}
                        {statusPropertiIncome === 'saving' && 'Menyimpan...'}
                        {statusPropertiIncome === 'saved' && <><Check className="w-4 h-4" /> Tersimpan</>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-5 h-5 text-slate-800" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Standar Penilaian Indonesia (SPI)</span>
                </div>
                <h2 className="text-3xl font-semibold text-slate-800">Pendekatan Biaya</h2>
              </div>
              <div className="text-sm font-medium opacity-60 text-right">
                Metode Biaya Pengganti Baru<br />(Depreciated Replacement Cost)
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                
                {/* Land Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                      Luas Tanah (m²)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={landArea || ''}
                      onChange={(e) => setLandArea(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200/30 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                      Nilai Tanah / m²
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">Rp</span>
                      <input
                        type="number"
                        min="0"
                        value={landValue || ''}
                        onChange={(e) => setLandValue(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200/30 px-12 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Building Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                      Luas Bangunan (m²)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={buildingArea || ''}
                      onChange={(e) => setBuildingArea(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200/30 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                      Biaya Baru / m²
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">Rp</span>
                      <input
                        type="number"
                        min="0"
                        value={buildingCost || ''}
                        onChange={(e) => setBuildingCost(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200/30 px-12 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                    Penyusutan Fisik & Fungsi (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={depreciation || ''}
                      onChange={(e) => setDepreciation(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200/30 pl-4 pr-8 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">%</span>
                  </div>
                </div>

              </div>

              <div className="bg-slate-800 text-white p-8 flex flex-col justify-center relative overflow-hidden">
                <Building className="absolute -bottom-8 -right-8 w-48 h-48 opacity-5 text-white pointer-events-none" />
                <div className="relative z-10 space-y-6">
                  
                  <div className="space-y-2 text-sm opacity-80 pb-4 border-b border-white/10">
                    <div className="flex justify-between">
                      <span>Total Nilai Tanah</span>
                      <span>{formatIDR(totalLandValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya Pengganti Baru (RCN)</span>
                      <span>{formatIDR(newBuildingCost)}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Penyusutan</span>
                      <span>- {formatIDR(totalDepreciation)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10 font-bold">
                      <span>Nilai Bangunan Bersih</span>
                      <span>{formatIDR(netBuildingValue)}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 block mb-2">Indikasi Nilai Properti</span>
                    <div className="text-3xl sm:text-4xl font-semibold mb-2 text-white">
                      {formatIDR(propertyCostValue)}
                    </div>
                    <span className="text-xs font-medium opacity-60 block">
                      Nilai Tanah + Nilai Bangunan
                    </span>
                    
                    {user && propertyCostValue > 0 && (
                      <button
                        onClick={() => savePropertiCost(`Valuasi Properti (Biaya) — ${formatIDR(propertyCostValue)}`, { landArea, landValue, buildingArea, buildingCost, depreciation }, { totalLandValue, newBuildingCost, totalDepreciation, netBuildingValue, propertyCostValue })}
                        disabled={statusPropertiCost !== 'idle'}
                        className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-colors disabled:opacity-50 border border-white/20"
                      >
                        {statusPropertiCost === 'idle' && <><Save className="w-4 h-4" /> Simpan Hasil</>}
                        {statusPropertiCost === 'saving' && 'Menyimpan...'}
                        {statusPropertiCost === 'saved' && <><Check className="w-4 h-4" /> Tersimpan</>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'business' && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-slate-800" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Penilaian Bisnis</span>
                </div>
                <h2 className="text-3xl font-semibold text-slate-800">Pendekatan Pendapatan</h2>
              </div>
              <div className="text-sm font-medium opacity-60 text-right">
                Discounted Cash Flow (DCF)<br />Gordon Growth Model
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                    Arus Kas Bebas (FCFF/FCFE)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">Rp</span>
                    <input
                      type="number"
                      min="0"
                      value={freeCashFlow || ''}
                      onChange={(e) => setFreeCashFlow(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200/30 px-12 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                      Discount Rate (WACC/Ke)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discountRate || ''}
                        onChange={(e) => setDiscountRate(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200/30 pl-4 pr-8 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                      Pertumbuhan (Growth Rate)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={growthRate || ''}
                        onChange={(e) => setGrowthRate(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200/30 pl-4 pr-8 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 text-white p-8 flex flex-col justify-center relative overflow-hidden">
                <TrendingUp className="absolute -bottom-8 -right-8 w-48 h-48 opacity-5 text-white pointer-events-none" />
                <div className="relative z-10 space-y-6">
                  
                  {discountRate <= growthRate ? (
                    <div className="text-white bg-white/10 p-4 border-l border-white/20">
                      <p className="text-sm">Discount rate harus lebih besar dari tingkat pertumbuhan (Growth Rate).</p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 block mb-2">Indikasi Nilai Bisnis</span>
                      <div className="text-3xl sm:text-4xl font-semibold mb-2 text-white">
                        {formatIDR(businessValue)}
                      </div>
                      <span className="text-xs font-medium opacity-60 block">
                        FCF × (1 + g) ÷ (r - g)
                      </span>
                      
                      {user && businessValue > 0 && (
                        <button
                          onClick={() => saveBusinessIncome(`Valuasi Bisnis (DCF) — ${formatIDR(businessValue)}`, { freeCashFlow, discountRate, growthRate }, { businessValue })}
                          disabled={statusBusinessIncome !== 'idle'}
                          className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-colors disabled:opacity-50 border border-white/20"
                        >
                          {statusBusinessIncome === 'idle' && <><Save className="w-4 h-4" /> Simpan Hasil</>}
                          {statusBusinessIncome === 'saving' && 'Menyimpan...'}
                          {statusBusinessIncome === 'saved' && <><Check className="w-4 h-4" /> Tersimpan</>}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-slate-800" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Penilaian Bisnis</span>
                </div>
                <h2 className="text-3xl font-semibold text-slate-800">Pendekatan Pasar</h2>
              </div>
              <div className="text-sm font-medium opacity-60 text-right">
                Market Multiples<br />(P/E & PBV)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* P/E Ratio Multiple */}
              <div className="border border-slate-200 p-6 flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-bold border-b border-slate-100 pb-2 mb-4">Price to Earnings (P/E)</h3>
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                    Laba Bersih (Net Income)
                  </label>
                  <div className="relative mb-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">Rp</span>
                    <input
                      type="number"
                      min="0"
                      value={netIncome || ''}
                      onChange={(e) => setNetIncome(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200/30 px-12 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                    />
                  </div>
                  
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                    P/E Ratio Pembanding (x)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={peRatio || ''}
                    onChange={(e) => setPeRatio(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200/30 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                  />
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 block mb-1">Indikasi Nilai Ekuitas</span>
                  <div className="text-2xl font-bold text-slate-800">
                    {formatIDR(valueFromPE)}
                  </div>
                </div>
              </div>

              {/* PBV Ratio Multiple */}
              <div className="border border-slate-200 p-6 flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-bold border-b border-slate-100 pb-2 mb-4">Price to Book Value (PBV)</h3>
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                    Nilai Buku Ekuitas
                  </label>
                  <div className="relative mb-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold opacity-50">Rp</span>
                    <input
                      type="number"
                      min="0"
                      value={equityValue || ''}
                      onChange={(e) => setEquityValue(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200/30 px-12 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                    />
                  </div>
                  
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-800 mb-3">
                    PBV Ratio Pembanding (x)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={pbvRatio || ''}
                    onChange={(e) => setPbvRatio(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200/30 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-0 focus:bg-white focus:border-slate-200 transition-colors"
                  />
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 block mb-1">Indikasi Nilai Ekuitas</span>
                  <div className="text-2xl font-bold text-slate-800">
                    {formatIDR(valueFromPBV)}
                  </div>
                </div>
              </div>

            </div>
            
            {user && (valueFromPE > 0 || valueFromPBV > 0) && (
              <div className="mt-6 border-t border-slate-100 pt-6 flex justify-end">
                <button
                  onClick={() => saveBusinessMarket(`Valuasi Bisnis (Pasar) — PE: ${formatIDR(valueFromPE)} / PBV: ${formatIDR(valueFromPBV)}`, { netIncome, peRatio, equityValue, pbvRatio }, { valueFromPE, valueFromPBV })}
                  disabled={statusBusinessMarket !== 'idle'}
                  className="w-full md:w-auto flex items-center justify-center gap-2 py-3 px-6 bg-slate-800 text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-colors disabled:opacity-50"
                >
                  {statusBusinessMarket === 'idle' && <><Save className="w-4 h-4" /> Simpan Hasil</>}
                  {statusBusinessMarket === 'saving' && 'Menyimpan...'}
                  {statusBusinessMarket === 'saved' && <><Check className="w-4 h-4" /> Tersimpan</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
