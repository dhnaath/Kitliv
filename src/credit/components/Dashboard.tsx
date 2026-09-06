// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Search, CreditCard, Activity, AlertTriangle, TrendingUp, ArrowUp, ArrowDown, ArrowUpDown, Settings2, ChevronUp, PieChart, Percent, GripVertical, Trash2, Undo2, Redo2, Save, Flag } from 'lucide-react';
import { useFloating, offset, flip, shift, autoUpdate, FloatingPortal, useDismiss, useInteractions } from '@floating-ui/react';
import { dummyCreditData } from '../data';
import { DateInlineInput } from './DateInlineInput';
import { CreditData, SortConfig, SortKey, DueDateConfig, PenaltyConfig, MinPaymentConfig, InstallmentConfig, EnrichedCreditData } from '../types';
import {
  formatRupiah, formatPercent, formatDateID, getColumnMinMax, calculateCellColor,
  computeNextDueDate, computeAccruedPenalty, daysBetween, toISO, periodLabel,
  calculateDayStatus, calculateFullPayoff, calculateMinPayment
} from '../utils';

type RowConfig = { due: DueDateConfig; penalty: PenaltyConfig; minPay: MinPaymentConfig; installment?: InstallmentConfig };


const Popover = ({ isOpen, onClose, children, trigger }: { isOpen: boolean, onClose: () => void, children: React.ReactNode, trigger: React.ReactNode }) => {
  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: (open) => { if (!open) onClose(); },
    placement: 'bottom-end',
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift({ padding: 8 })],
  });

  return (
    <>
      {React.isValidElement(trigger) ? React.cloneElement(trigger as React.ReactElement, { ref: refs.setReference }) : trigger}
      {isOpen && (
        <FloatingPortal>
          <div 
            className="fixed inset-0 z-[40]" 
            onMouseDown={(e) => { e.stopPropagation(); onClose(); }}
            onTouchStart={(e) => { e.stopPropagation(); onClose(); }}
          />
          <div 
            ref={refs.setFloating} 
            style={{ ...floatingStyles, zIndex: 50 }} 
            className="bg-white border-2 border-[#004f71] rounded-xl shadow-2xl p-4 w-[280px] text-left text-slate-800"
          >
            {children}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

const CONFIG_STORAGE_KEY = 'credit-dashboard:row-configs:v1';

const defaultConfigs = (): Record<string, RowConfig> =>
  Object.fromEntries(dummyCreditData.map((d) => [d.id, { due: { ...d.dueDateConfig }, penalty: { ...d.penaltyConfig }, minPay: { enabled: false, mode: 'percentage', percentage: 10, nominal: 50000 }, installment: { totalAmount: null, tenorMonths: null } }]));

const loadStoredConfigs = (): Record<string, RowConfig> => {
  const fallback = defaultConfigs();
  try {
    const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Record<string, RowConfig>;
    // Merge stored configs on top of defaults so new/removed rows stay consistent.
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
};

const CurrencyInput = ({
  value,
  onChange,
  className = '',
  placeholder = '-',
  isTotal = false,
  disabled = false,
}: {
  value: number | null;
  onChange: (val: number | null) => void;
  className?: string;
  placeholder?: string;
  isTotal?: boolean;
  disabled?: boolean;
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [local, setLocal] = React.useState(value === null || value === undefined ? '-' : formatRupiah(value));

  React.useEffect(() => {
    if (!isFocused) {
      setLocal(value === null || value === undefined ? '-' : formatRupiah(value));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocal(val); // Keep exactly what the user types

    let raw = val.replace(/[^\d-]/g, '');
    
    if (raw === '' || raw === '-' || raw === '0-' || raw === '-0') {
      onChange(null);
      return;
    }
    
    // Fix multiple dashes or dash at the end
    const isNegative = raw.includes('-');
    raw = raw.replace(/-/g, '');
    if (isNegative) raw = '-' + raw;

    const num = Number(raw);
    if (!isNaN(num)) {
      onChange(num);
    } else {
      onChange(null);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (value === null || value === undefined) {
      setLocal('-');
    } else {
      setLocal(value.toString()); // Show raw number for easier editing
    }
    // Select all text on focus for quick replacing
    setTimeout(() => e.target.select(), 0);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setLocal(value === null || value === undefined ? '-' : formatRupiah(value));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleEnterNavigation(e);
  };

  let colorClasses = 'bg-white text-slate-900';
  if (value === null || value === undefined) {
    colorClasses = 'text-[#004f71] placeholder:text-[#004f71] bg-transparent font-bold';
  } else if (value === 0) {
    colorClasses = 'bg-white text-slate-900';
  } else if (value < 0) {
    if (isTotal) {
      colorClasses = 'bg-red-600 text-white font-bold placeholder:text-red-200';
    } else {
      colorClasses = 'bg-white text-red-600 font-bold';
    }
  } else if (value > 0) {
    if (isTotal) {
      colorClasses = 'bg-red-600 text-white font-bold placeholder:text-red-200';
    } else {
      colorClasses = 'bg-white text-slate-900';
    }
  }

  return (
    <input
      type="text"
      value={local}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full h-full p-2 text-center focus:bg-indigo-50 focus:outline-none focus:text-slate-900 transition-colors ${colorClasses} ${className}`}
    />
  );
};


const handleEnterNavigation = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const currentInput = e.currentTarget as HTMLElement;
    const currentTd = currentInput.closest('td');
    const currentTr = currentInput.closest('tr');
    
    if (currentTd && currentTr) {
      const tds = Array.from(currentTr.children);
      const colIndex = tds.indexOf(currentTd);
      
      const nextTr = currentTr.nextElementSibling;
      if (nextTr) {
        const nextTd = nextTr.children[colIndex];
        if (nextTd) {
          const nextInput = nextTd.querySelector('input, select, button') as HTMLElement;
          if (nextInput) {
            nextInput.focus();
            if (nextInput instanceof HTMLInputElement) {
              nextInput.select();
            }
          }
        }
      }
    }
  }
};

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [historyState, setHistoryState] = useState(() => {
    const saved = localStorage.getItem('credit_data');
    if (saved) {
      try {
        return { history: [JSON.parse(saved)], index: 0 };
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
    return {
      history: [dummyCreditData],
      index: 0
    };
  });
  
  const data = historyState.history[historyState.index];

  const [isSaved, setIsSaved] = useState(false);
  // Auto-save whenever data changes
  React.useEffect(() => {
    localStorage.setItem('credit_data', JSON.stringify(data));
  }, [data]);

  const handleSave = () => {
    localStorage.setItem('credit_data', JSON.stringify(data));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClearAll = () => {
    setRowToDelete('ALL');
  };

  const setData = (action: React.SetStateAction<CreditData[]>) => {
    setHistoryState(prev => {
      const currentData = prev.history[prev.index];
      const nextData = typeof action === 'function' ? action(currentData) : action;
      
      let currentHistory = prev.history.slice(0, prev.index + 1);
      if (currentHistory.length > 31) {
        currentHistory = currentHistory.slice(currentHistory.length - 31);
      }
      
      const newHistory = [...currentHistory, nextData];
      return {
        history: newHistory,
        index: newHistory.length - 1
      };
    });
  };

  const handleUndo = () => {
    setHistoryState(prev => ({
      ...prev,
      index: Math.max(0, prev.index - 1)
    }));
  };

  const handleRedo = () => {
    setHistoryState(prev => ({
      ...prev,
      index: Math.min(prev.history.length - 1, prev.index + 1)
    }));
  };

  const canUndo = historyState.index > 0;
  const canRedo = historyState.index < historyState.history.length - 1;
  const [actionState, setActionState] = useState<Record<string, 'drag' | 'delete' | 'flag'>>({});
  const [draggedRowId, setDraggedRowId] = useState<string | null>(null);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);

  const handleNoClick = (rowId: string) => {
    setActionState(prev => {
      const current = prev[rowId];
      if (!current) return { ...prev, [rowId]: 'drag' };
      if (current === 'drag') return { ...prev, [rowId]: 'delete' };
      if (current === 'delete') return { ...prev, [rowId]: 'flag' };
      const next = { ...prev };
      delete next[rowId];
      return next;
    });
  };

  const handleDeleteRow = (rowId: string) => {
    if (rowId === 'ALL') {
      setData(() => {
        return Array.from({ length: 10 }).map((_, i) => ({
          id: `empty-${Date.now()}-${i}`,
          issuer: '',
          name: '',
          creditLimit: null,
          minimum: null,
          outstanding: null,
          installment: null,
          usageGap: null,
          margin: null,
          usageRatio: 0,
          dueDateConfig: { mode: 'monthly_fixed', startDate: new Date().toISOString().split('T')[0], dayOfMonth: 25 },
          penaltyConfig: { enabled: false, rate: 0, period: 'monthly' }
        }));
      });
    } else {
      setData(prev => prev.filter(r => r.id !== rowId));
    }
    setActionState(prev => {
      const next = { ...prev };
      delete next[rowId];
      return next;
    });
  };
  
  const updateDataRow = (id, field, value) => {
    setData(prev => prev.map(row => {
      if (row.id === id) {
        const newRow = { ...row, [field]: value };
        
        // Auto-calculate dynamic fields if one of the dependencies changes
        if (['creditLimit', 'usageGap', 'outstanding', 'installment'].includes(field)) {
          // Auto-calc margin and ratio when any of these balance fields change
          const cl = newRow.creditLimit ?? 0;
          const out = newRow.outstanding ?? 0;
          const inst = newRow.installment ?? 0;
          const gap = newRow.usageGap ?? 0;
          
          const isEmpty = newRow.creditLimit === null && newRow.usageGap === null && newRow.outstanding === null && newRow.installment === null;
          const totalUsage = out + inst + gap;
          
          newRow.margin = isEmpty ? null : (cl + totalUsage);
          newRow.usageRatio = cl > 0 ? (Math.abs(totalUsage) / cl) : 0;
        }
        
        return newRow;
      }
      return row;
    }));
  };
  
  const addNewRow = () => {
    const newId = `new-${Date.now()}`;
    setData(prev => [...prev, {
      id: newId,
      issuer: '',
      name: '',
      creditLimit: null,
      minimum: null,
      outstanding: null,
      installment: null,
      usageGap: null,
      margin: null,
      usageRatio: 0,
      dueDateConfig: { mode: 'monthly_fixed', startDate: toISO(new Date()), dayOfMonth: 25 },
      penaltyConfig: { enabled: false, rate: 0.02, period: 'monthly' }
    }]);
    setConfigs(prev => ({ ...prev, [newId]: { due: { mode: 'monthly_fixed', startDate: toISO(new Date()), dayOfMonth: 25 }, penalty: { enabled: false, rate: 0.02, period: 'monthly' }, minPay: { enabled: false, mode: 'percentage', percentage: 10, nominal: 50000 } } }));
  };

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [refDateStr, setRefDateStr] = useState<string>(toISO(new Date()));
  const [openDueId, setOpenDueId] = useState<string | null>(null);
  const [openPenaltyId, setOpenPenaltyId] = useState<string | null>(null);
  const [openMinPaymentId, setOpenMinPaymentId] = useState<string | null>(null);
  const [openInstallmentId, setOpenInstallmentId] = useState<string | null>(null);

  const [configs, setConfigs] = useState<Record<string, RowConfig>>(loadStoredConfigs);

  // Persist row-level due-date/penalty configuration so it survives a page refresh.
  React.useEffect(() => {
    try {
      window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configs));
    } catch {
      // Ignore storage errors (e.g. private browsing / quota exceeded).
    }
  }, [configs]);

  const refDate = useMemo(() => { const d = new Date(refDateStr + 'T00:00:00'); return isNaN(d.getTime()) ? new Date() : d; }, [refDateStr]);

  const updateRowConfig = (id: string, patch: Partial<RowConfig>) => {
    setConfigs((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const applyToAll = (id: string) => {
    const source = configs[id];
    if (!source) return;
    setConfigs((prev) => {
      const next: Record<string, RowConfig> = {};
      Object.keys(prev).forEach((key) => {
        next[key] = { due: { ...source.due }, penalty: { ...source.penalty }, minPay: { ...source.minPay } };
      });
      return next;
    });
  };

  // Attach computed due-date / penalty fields to every row, based on the current reference date.
  const enriched: EnrichedCreditData[] = useMemo(() => {
    return data.map((row) => {
      const cfg = configs[row.id] ?? { due: row.dueDateConfig, penalty: row.penaltyConfig };
      const minPayConfig = cfg.minPay ?? { enabled: false, mode: 'percentage', percentage: 10, nominal: 50000 };
      const installmentConfig = cfg.installment ?? { totalAmount: null, tenorMonths: null };
      const gap = row.usageGap ?? 0;
      const baseAmount = Math.abs(gap);
      const nextDueDate = computeNextDueDate(cfg.due, refDate);
      const daysUntilDue = daysBetween(refDate, nextDueDate);
      const { periodsElapsed, accrued } = computeAccruedPenalty(cfg.penalty, cfg.due.startDate, refDate, baseAmount);
      const isEmpty = row.creditLimit === null && row.outstanding === null && row.installment === null && row.usageGap === null;
      const computedMinPay = calculateMinPayment(minPayConfig, row.outstanding || 0);
      const computedInstallment = (installmentConfig.totalAmount !== null && installmentConfig.tenorMonths !== null && installmentConfig.tenorMonths > 0) 
        ? Math.round(installmentConfig.totalAmount / installmentConfig.tenorMonths) 
        : row.installment;
      const finalMinimum = minPayConfig.enabled ? (isEmpty ? null : computedMinPay) : row.minimum;
      const finalPenalty = row.manualPenalty !== undefined && row.manualPenalty !== null ? row.manualPenalty : (isEmpty ? null : accrued);
      const calcTotal = calculateFullPayoff(row.outstanding, computedInstallment, gap, finalPenalty);
      const finalTotal = row.manualTotalOutstanding !== undefined && row.manualTotalOutstanding !== null ? row.manualTotalOutstanding : (isEmpty ? null : calcTotal);
      return {
        ...row,
        dueDateConfig: cfg.due,
        penaltyConfig: cfg.penalty,
        minPaymentConfig: minPayConfig,
        installmentConfig: installmentConfig,
        installment: isEmpty ? null : computedInstallment,
        minimum: finalMinimum,
        nextDueDate: isEmpty ? null : nextDueDate,
        daysUntilDue: isEmpty ? null : daysUntilDue,
        periodsElapsed: isEmpty ? null : periodsElapsed,
        accruedPenalty: finalPenalty,
        totalOutstanding: finalTotal,
      };
    });
  }, [data, configs, refDate]);

  const filteredData = useMemo(() => {
    return enriched.filter(
      (item) =>
        item.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [enriched, searchTerm]);

  const sortedData = useMemo(() => {
    const items = [...filteredData];
    if (sortConfig.key !== null) {
      const key = sortConfig.key as SortKey;
      items.sort((a, b) => {
        const aValue: any = key === 'nextDueDate' ? (a.nextDueDate as Date).getTime() : (a as any)[key] ?? 0;
        const bValue: any = key === 'nextDueDate' ? (b.nextDueDate as Date).getTime() : (b as any)[key] ?? 0;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [filteredData, sortConfig]);

  const requestSort = (key: SortKey | 'no') => {
    if (key === 'no') return;
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey | 'no') => {
    if (key === 'no') return null;
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-3 h-3 ml-1 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 text-white" /> : <ArrowDown className="w-3 h-3 ml-1 text-white" />;
  };

  const usageGapRange = useMemo(() => getColumnMinMax<any, any>(filteredData, 'usageGap'), [filteredData]);
  const marginRange = useMemo(() => getColumnMinMax<any, any>(filteredData, 'margin'), [filteredData]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => ({
        creditLimit: acc.creditLimit + (item.creditLimit ?? 0),
        minimum: acc.minimum + (item.minimum ?? 0),
        outstanding: acc.outstanding + (item.outstanding ?? 0),
        installment: acc.installment + (item.installment ?? 0),
        usageGap: acc.usageGap + (item.usageGap ?? 0),
        margin: acc.margin + (item.margin ?? 0),
        accruedPenalty: acc.accruedPenalty + item.accruedPenalty,
        totalOutstanding: acc.totalOutstanding + item.totalOutstanding,
      }),
      { creditLimit: 0, minimum: 0, outstanding: 0, installment: 0, usageGap: 0, margin: 0, accruedPenalty: 0, totalOutstanding: 0 }
    );
  }, [filteredData]);

  const totalUsage = totals.usageGap + totals.outstanding + totals.installment;
  const totalUsageRatio = totals.creditLimit > 0 ? (Math.abs(totalUsage) / totals.creditLimit) : 0;

  const columns: { key: SortKey | 'no'; label: string; right?: boolean; widthClass?: string }[] = [
    { key: 'no', label: 'No.', widthClass: 'w-[40px] min-w-[40px] max-w-[40px]' },
    { key: 'issuer', label: 'Issuer' },
    { key: 'name', label: 'Account Name' },
    { key: 'creditLimit', label: 'Credit Limit', right: true, widthClass: 'w-[110px] min-w-[110px] max-w-[110px]' },
    { key: 'margin', label: 'Margin Limit', right: true, widthClass: 'w-[110px] min-w-[110px] max-w-[110px]' },
    { key: 'outstanding', label: 'Current Due', right: true, widthClass: 'w-[110px] min-w-[110px] max-w-[110px]' },
    { key: 'installment', label: 'Unbilled Installment', right: true, widthClass: 'w-[110px] min-w-[110px] max-w-[110px]' },
    { key: 'usageGap', label: 'Revolving Usage', right: true, widthClass: 'w-[110px] min-w-[110px] max-w-[110px]' },
    { key: 'minimum', label: 'Min. Payment', right: true, widthClass: 'w-[110px] min-w-[110px] max-w-[110px]' },
    { key: 'nextDueDate', label: 'Due Date', right: true },
    { key: 'daysUntilDue', label: 'Days Status', right: true },
    { key: 'accruedPenalty', label: 'Late Charges', right: true, widthClass: 'w-[110px] min-w-[110px] max-w-[110px]' },
    { key: 'totalOutstanding', label: 'Full\nPayoff', right: true, widthClass: 'w-[110px] min-w-[110px] max-w-[110px]' },
  ];

  const modeLabel = (m: DueDateConfig['mode']) => {
    if (m === 'monthly_fixed') return 'Tanggal tetap tiap bulan';
    if (m === 'weekly') return 'Setiap minggu (7 hari)';
    return 'Setiap N hari (custom)';
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Nav */}
      

      {/* Mobile ref-date row */}
      <div className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border-b border-slate-200 text-xs text-slate-500 shrink-0">
        <span className="font-medium">Hitung per tanggal:</span>
        <input
          type="date"
          value={refDateStr}
          onChange={(e) => setRefDateStr(e.target.value)}
          className="border border-slate-200 rounded-md px-2 py-1 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
        />
        <span className="text-slate-400">Geser ke depan untuk lihat proyeksi bunga/denda.</span>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 flex flex-col gap-6 overflow-hidden max-w-[1400px] mx-auto w-full">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 shrink-0">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Total Limit</p>
              <h2 className="text-lg font-bold text-slate-900">{formatRupiah(totals.creditLimit)}</h2>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg"><CreditCard className="w-5 h-5" /></div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Total Current</p>
              <h2 className="text-lg font-bold text-slate-900">{formatRupiah(totals.outstanding)}</h2>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg"><Activity className="w-5 h-5" /></div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Late Fees</p>
              <h2 className="text-lg font-bold text-amber-600">{formatRupiah(totals.accruedPenalty)}</h2>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Total Payoff</p>
              <h2 className="text-lg font-bold text-red-600">{formatRupiah(totals.totalOutstanding)}</h2>
            </div>
            <div className="p-2.5 bg-red-50 text-red-600 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Margin Limit</p>
              <h2 className="text-lg font-bold text-slate-900">{formatRupiah(totals.margin)}</h2>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><PieChart className="w-5 h-5" /></div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Utilization Ratio</p>
              <h2 className={`text-lg font-bold ${totalUsageRatio < 0 ? 'text-red-600' : 'text-slate-900'}`}>{formatPercent(totalUsageRatio)}</h2>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg"><Percent className="w-5 h-5" /></div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer ${isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
            title="Save to local storage"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'Saved!' : 'Save'}</span>
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-red-600 text-white hover:bg-red-700 shadow-sm cursor-pointer"
            title="Clear all data"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              canUndo
                ? 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm cursor-pointer'
                : 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
            <span>Undo</span>
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              canRedo
                ? 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm cursor-pointer'
                : 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
            <span>Redo</span>
          </button>
        </div>

        {/* Table Wrapper */}
        <div className="flex-initial bg-white shadow-sm flex flex-col overflow-hidden rounded-xl border-4 border-[#004f71] min-h-0">
          <div className="flex-auto overflow-auto bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-xs text-center border-separate border-spacing-0">
              <thead className="sticky top-0 bg-white text-[#003366] z-20">
                <tr>
                  <th rowSpan={2} className="p-3 font-bold border-b-4 border-r-4 border-[#004f71] bg-white w-[40px] min-w-[40px] max-w-[40px]">
                    <div className="flex items-center justify-center bg-white whitespace-pre-wrap leading-tight">No.</div>
                  </th>
                  <th colSpan={4} className="p-3 font-bold border-b-4 border-r-4 border-[#004f71] bg-white">Account Overview</th>
                  <th colSpan={4} className="p-3 font-bold border-b-4 border-r-4 border-[#004f71] bg-white">Current Balance</th>
                  
                  <th colSpan={4} className="p-3 font-bold border-b-4 border-[#004f71] bg-white">Settlement Status</th>
                  
                </tr>
                <tr>
                  {columns.slice(1).map((col, idx) => {
                    const i = idx + 1;
                    const borderClass = i === 12 ? '' : (i === 0 || i === 4 || i === 8 ? 'border-r-4 border-[#004f71]' : 'border-r-2 border-[#004f71]');
                    return (
                      <th
                        key={col.key}
                        onClick={() => col.key !== 'no' && requestSort(col.key)}
                        className={`p-3 font-bold ${col.key !== 'no' ? 'cursor-pointer' : ''} group select-none border-b-4 border-[#004f71] ${borderClass} bg-white ${col.widthClass || ''}`}
                      >
                        <div className="flex items-center justify-center bg-white whitespace-pre-wrap leading-tight">
                          {col.label}
                          {col.key !== 'no' && getSortIcon(col.key)}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white text-black font-semibold [&>*:last-child>td]:border-b-0">
                {sortedData.map((row, index) => {
                  const getCellContent = (val) => val === null ? '-' : formatRupiah(val);
                  const dueSoon = row.daysUntilDue <= 7;
                  const hasCredit = (row.outstanding !== null ? row.outstanding : row.usageGap) > 0;
                  
                  return (
                    <React.Fragment key={row.id}>
                      <tr 
                        className={`transition-colors group/row ${draggedRowId === row.id ? 'opacity-50' : ''} ${row.isHighlighted ? 'bg-[#004f71] !text-white [&_td]:!text-white [&_input]:!text-white [&_input]:!bg-transparent [&_input]:placeholder:!text-white/70 hover:!bg-[#003366] [&_span]:!text-white' : 'hover:bg-slate-50'}`}
                        draggable={actionState[row.id] === 'drag'}
                        onDragStart={(e) => {
                          setDraggedRowId(row.id);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedRowId && draggedRowId !== row.id) {
                            setData(prevData => {
                              const newData = [...prevData];
                              const dragIndex = newData.findIndex(r => r.id === draggedRowId);
                              const dropIndex = newData.findIndex(r => r.id === row.id);
                              if (dragIndex !== -1 && dropIndex !== -1) {
                                const [draggedItem] = newData.splice(dragIndex, 1);
                                newData.splice(dropIndex, 0, draggedItem);
                              }
                              return newData;
                            });
                            setSortConfig({ key: 'no', direction: 'asc' });
                          }
                          setDraggedRowId(null);
                          setActionState({});
                        }}
                        onDragEnd={() => setDraggedRowId(null)}
                      >
                        <td 
                          className="p-2 border-b-2 border-r-4 border-[#004f71] text-center font-bold text-slate-500 cursor-pointer select-none relative group/no"
                          onClick={() => handleNoClick(row.id)}
                          title="Click to toggle drag/delete options"
                        >
                          {actionState[row.id] === 'drag' && (
                            <div className="flex items-center justify-center text-blue-500" title="Drag to reorder">
                              <GripVertical className="w-4 h-4 cursor-grab active:cursor-grabbing" />
                            </div>
                          )}
                          {actionState[row.id] === 'delete' && (
                            <div 
                              className="flex items-center justify-center text-red-500 hover:text-red-700 transition-colors"
                              title="Delete row"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRowToDelete(row.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </div>
                          )}
                          {actionState[row.id] === 'flag' && (
                            <div 
                              className={`flex items-center justify-center transition-colors ${row.isHighlighted ? 'text-white hover:text-slate-200' : 'text-blue-500 hover:text-blue-700'}`}
                              title="Toggle highlight"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateDataRow(row.id, 'isHighlighted', !row.isHighlighted);
                                setActionState(prev => {
                                  const next = { ...prev };
                                  delete next[row.id];
                                  return next;
                                });
                              }}
                            >
                              <Flag className={`w-4 h-4 ${row.isHighlighted ? 'fill-current' : ''}`} />
                            </div>
                          )}
                          {!actionState[row.id] && (
                            <span className={`transition-colors ${row.isHighlighted ? 'text-white' : 'hover:text-indigo-600'}`}>{index + 1}</span>
                          )}
                        </td>
                        <td className="p-0 h-px border-b-2 border-r-2 border-[#004f71]">
                          <input type="text" placeholder="-" value={row.issuer} onChange={(e) => updateDataRow(row.id, 'issuer', e.target.value)} onKeyDown={handleEnterNavigation} className="w-full h-full p-2 bg-transparent text-center focus:bg-indigo-50 focus:outline-none placeholder:text-[#004f71] placeholder:font-bold text-slate-900 font-semibold" />
                        </td>
                        <td className="p-0 h-px border-b-2 border-r-2 border-[#004f71]">
                          <input type="text" placeholder="-" value={row.name} onChange={(e) => updateDataRow(row.id, 'name', e.target.value)} onKeyDown={handleEnterNavigation} className="w-full h-full p-2 bg-transparent text-center focus:bg-indigo-50 focus:outline-none placeholder:text-[#004f71] placeholder:font-bold text-slate-900 font-semibold" />
                        </td>
                        <td className="p-0 h-px border-b-2 border-r-2 border-[#004f71]">
                          <CurrencyInput value={row.creditLimit} onChange={(v) => updateDataRow(row.id, 'creditLimit', v)} />
                        </td>
                        <td className="p-2 border-b-2 border-r-4 border-[#004f71] text-center font-medium">
                          {row.margin === null ? <span className={`block text-center font-bold ${row.isHighlighted ? 'text-white' : 'text-[#004f71]'}`}>-</span> : formatRupiah(row.margin)}
                        </td>
                        
                        <td className="p-0 h-px border-b-2 border-r-2 border-[#004f71]">
                           <CurrencyInput value={row.outstanding} onChange={(v) => updateDataRow(row.id, 'outstanding', v)} />
                        </td>
                        <td className="p-0 h-px border-b-2 border-r-2 border-[#004f71] relative">
  <div className="flex w-full h-full relative items-center group/inst">
    <CurrencyInput value={row.installment} onChange={(v) => updateDataRow(row.id, 'installment', v)} disabled={row.installmentConfig?.totalAmount != null && row.installmentConfig?.tenorMonths != null && row.installmentConfig.tenorMonths > 0} />
    <Popover 
      isOpen={openInstallmentId === row.id} 
      onClose={() => setOpenInstallmentId(null)}
      trigger={
        <button 
          onClick={() => setOpenInstallmentId(openInstallmentId === row.id ? null : row.id)}
          className="absolute right-2 opacity-0 group-hover/inst:opacity-100 p-1 bg-white hover:bg-slate-50 rounded text-slate-400 hover:text-slate-700 transition-all shadow-sm border border-slate-200 z-10"
        >
          <Settings2 className="w-3 h-3" />
        </button>
      }
    >
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#003366]">Kalkulator Cicilan</p>
        
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-500">Total Cicilan (Rp)</label>
          <input
            type="number"
            min="0"
            step="1000"
            value={row.installmentConfig?.totalAmount ?? ''}
            onChange={(e) => {
              const val = e.target.value ? parseFloat(e.target.value) : null;
              updateRowConfig(row.id, { installment: { ...(row.installmentConfig ?? { totalAmount: null, tenorMonths: null }), totalAmount: val } })
            }}
            className="border border-[#004f71] rounded-md px-2 py-1.5 text-xs bg-white text-slate-800"
            placeholder="Contoh: 1200000"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-500">Tenor (Bulan/Kali)</label>
          <input
            type="number"
            min="1"
            step="1"
            value={row.installmentConfig?.tenorMonths ?? ''}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value) : null;
              updateRowConfig(row.id, { installment: { ...(row.installmentConfig ?? { totalAmount: null, tenorMonths: null }), tenorMonths: val } })
            }}
            className="border border-[#004f71] rounded-md px-2 py-1.5 text-xs bg-white text-slate-800"
            placeholder="Contoh: 12"
          />
        </div>
        
        <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] font-medium text-slate-500">Hasil per bulan:</span>
          <span className="text-sm font-bold text-[#004f71]">
            {(row.installmentConfig?.totalAmount && row.installmentConfig?.tenorMonths) 
              ? formatRupiah(Math.round(row.installmentConfig.totalAmount / row.installmentConfig.tenorMonths))
              : '-'}
          </span>
        </div>
      </div>
    </Popover>
  </div>
</td>
                        <td className="p-0 h-px border-b-2 border-r-2 border-[#004f71]">
                          <CurrencyInput value={row.usageGap} onChange={(v) => updateDataRow(row.id, 'usageGap', v)} />
                        </td>
                        <td className="p-0 h-px border-b-2 border-r-4 border-[#004f71] relative">
  <div className="flex w-full h-full relative items-center group/minpay">
    <CurrencyInput value={row.minimum} onChange={(v) => updateDataRow(row.id, 'minimum', v)} disabled={row.minPaymentConfig?.enabled} />
    <Popover 
      isOpen={openMinPaymentId === row.id} 
      onClose={() => setOpenMinPaymentId(null)}
      trigger={
        <button 
          onClick={() => setOpenMinPaymentId(openMinPaymentId === row.id ? null : row.id)}
          className="absolute right-2 opacity-0 group-hover/minpay:opacity-100 p-1 bg-white hover:bg-slate-50 rounded text-slate-400 hover:text-slate-700 transition-all shadow-sm border border-slate-200 z-10"
        >
          <Settings2 className="w-3 h-3" />
        </button>
      }
    >
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#003366]">Min. Payment Settings</p>
        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={row.minPaymentConfig?.enabled || false}
            onChange={(e) => updateRowConfig(row.id, { minPay: { ...row.minPaymentConfig!, enabled: e.target.checked } })}
            className="w-4 h-4 accent-[#004f71]"
          />
          Aktifkan Perhitungan Otomatis
        </label>
        {row.minPaymentConfig?.enabled && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500">Mode</label>
              <select
                value={row.minPaymentConfig.mode}
                onChange={(e) => updateRowConfig(row.id, { minPay: { ...row.minPaymentConfig!, mode: e.target.value as any } })}
                className="border border-[#004f71] rounded-md px-2 py-1.5 text-xs bg-white text-slate-800"
              >
                <option value="percentage">% dari Current Due</option>
                <option value="nominal">Nominal Tetap</option>
                <option value="greater_of">Mana yang lebih besar</option>
              </select>
            </div>
            
            {(row.minPaymentConfig.mode === 'percentage' || row.minPaymentConfig.mode === 'greater_of') && (
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500">Persentase (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={row.minPaymentConfig.percentage}
                  onChange={(e) => updateRowConfig(row.id, { minPay: { ...row.minPaymentConfig!, percentage: parseFloat(e.target.value) || 0 } })}
                  className="border border-[#004f71] rounded-md px-2 py-1.5 text-xs bg-white text-slate-800"
                />
              </div>
            )}

            {(row.minPaymentConfig.mode === 'nominal' || row.minPaymentConfig.mode === 'greater_of') && (
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-500">Nominal (Rp)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={row.minPaymentConfig.nominal}
                  onChange={(e) => updateRowConfig(row.id, { minPay: { ...row.minPaymentConfig!, nominal: parseFloat(e.target.value) || 0 } })}
                  className="border border-[#004f71] rounded-md px-2 py-1.5 text-xs bg-white text-slate-800"
                />
              </div>
            )}
          </>
        )}
      </div>
    </Popover>
  </div>
</td>
                        


                        <td className="p-0 h-px border-b-2 border-r-2 border-[#004f71] relative">
  <div className="flex w-full h-full relative items-center group/duedate">
    <DateInlineInput 
      date={row.nextDueDate}
      highlight={hasCredit}
      onChange={(isoStr) => {
        const d = new Date(isoStr);
        updateRowConfig(row.id, { 
          due: { 
            ...row.dueDateConfig, 
            startDate: isoStr, 
            dayOfMonth: d.getDate() 
          } 
        });
      }}
    />
    <Popover 
      isOpen={openDueId === row.id} 
      onClose={() => setOpenDueId(null)}
      trigger={
        <button 
          onClick={() => setOpenDueId(openDueId === row.id ? null : row.id)}
          className="absolute right-2 opacity-0 group-hover/duedate:opacity-100 p-1 bg-white hover:bg-slate-50 rounded text-slate-400 hover:text-slate-700 transition-all shadow-sm border border-slate-200 z-10"
        >
          <Settings2 className="w-3 h-3" />
        </button>
      }
    >
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#003366]">Due Date Settings</p>
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-slate-500">Mode</label>
        <select
          value={row.dueDateConfig.mode}
          onChange={(e) => updateRowConfig(row.id, { due: { ...row.dueDateConfig, mode: e.target.value as any } })}
          className="border border-[#004f71] rounded-md px-2 py-1.5 text-xs bg-white text-slate-800"
        >
          <option value="monthly_fixed">Tanggal tetap tiap bulan</option>
          <option value="interval_days">Setiap N hari (custom)</option>
          <option value="weekly">Setiap minggu (7 hari)</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-slate-500">Tanggal acuan</label>
        <input
          type="date"
          value={row.dueDateConfig.startDate}
          onChange={(e) => updateRowConfig(row.id, { due: { ...row.dueDateConfig, startDate: e.target.value } })}
          className="border border-[#004f71] rounded-md px-2 py-1.5 text-xs bg-white text-slate-800"
        />
      </div>
      {row.dueDateConfig.mode === 'monthly_fixed' && (
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-500">Tanggal</label>
          <input
            type="number" min={1} max={31}
            value={row.dueDateConfig.dayOfMonth ?? 25}
            onChange={(e) => {
              const raw = Number(e.target.value);
              if (!Number.isFinite(raw)) return;
              updateRowConfig(row.id, { due: { ...row.dueDateConfig, dayOfMonth: Math.min(31, Math.max(1, Math.round(raw))) } });
            }}
            className="border border-[#004f71] rounded-md px-2 py-1.5 text-xs bg-white text-slate-800"
          />
        </div>
      )}
      {row.dueDateConfig.mode === 'interval_days' && (
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-500">Interval (Hari)</label>
          <input
            type="number" min={1}
            value={row.dueDateConfig.intervalDays ?? 30}
            onChange={(e) => {
              const raw = Number(e.target.value);
              if (!Number.isFinite(raw)) return;
              updateRowConfig(row.id, { due: { ...row.dueDateConfig, intervalDays: Math.max(1, Math.round(raw)) } });
            }}
            className="border border-[#004f71] rounded-md px-2 py-1.5 text-xs bg-white text-slate-800"
          />
        </div>
      )}
    </div>
  </Popover>
  </div>
</td>
<td className="p-2 border-b-2 border-r-2 border-[#004f71]">
  <div className="flex items-center justify-center gap-1">
    {hasCredit ? (
      <span className={`px-2 py-0.5 rounded text-[10px] ${calculateDayStatus(row.daysUntilDue).badgeClass}`}>
        {calculateDayStatus(row.daysUntilDue).label}
      </span>
    ) : <span className={`font-bold ${row.isHighlighted ? 'text-white' : 'text-[#004f71]'}`}>-</span>}
  </div>
</td>
<td className="p-0 h-px border-b-2 border-r-2 border-[#004f71] relative">
  <div className="flex w-full h-full relative items-center group/penalty">
    <CurrencyInput value={row.accruedPenalty === 0 && !row.penaltyConfig.enabled ? null : row.accruedPenalty} onChange={(v) => updateDataRow(row.id, 'manualPenalty', v)} />
    <Popover 
      isOpen={openPenaltyId === row.id} 
      onClose={() => setOpenPenaltyId(null)}
      trigger={
        <button 
          onClick={() => setOpenPenaltyId(openPenaltyId === row.id ? null : row.id)}
          className="absolute right-2 opacity-0 group-hover/penalty:opacity-100 p-1 bg-white hover:bg-slate-50 rounded text-slate-400 hover:text-slate-700 transition-all shadow-sm border border-slate-200"
        >
          <Settings2 className="w-3 h-3" />
        </button>
      }
    >
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#003366]">Late Charges Settings</p>
      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={row.penaltyConfig.enabled}
          onChange={(e) => updateRowConfig(row.id, { penalty: { ...row.penaltyConfig, enabled: e.target.checked } })}
          className="w-4 h-4 accent-[#004f71]"
        />
        Aktifkan Perhitungan Otomatis
      </label>
      {row.penaltyConfig.enabled && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500">Periode Rate</label>
            <select
              value={row.penaltyConfig.period || 'monthly'}
              onChange={(e) => updateRowConfig(row.id, { penalty: { ...row.penaltyConfig, period: e.target.value as any } })}
              className="border border-[#004f71] rounded-md px-2 py-1.5 text-xs bg-white text-slate-800"
            >
              <option value="daily">Harian</option>
              <option value="weekly">Mingguan</option>
              <option value="monthly">Bulanan</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500">Rate (%) per {row.penaltyConfig.period === 'daily' ? 'Hari' : row.penaltyConfig.period === 'weekly' ? 'Minggu' : 'Bulan'}</label>
            <input
              type="number" step="0.0001" min={0}
              value={Number((row.penaltyConfig.rate * 100).toFixed(4))}
              onChange={(e) => {
                const val = Number(e.target.value) / 100;
                if (Number.isFinite(val)) updateRowConfig(row.id, { penalty: { ...row.penaltyConfig, rate: val } });
              }}
              className="border border-[#004f71] rounded-md px-2 py-1.5 text-xs bg-white text-slate-800"
            />
          </div>
          
          <div className="mt-2 pt-2 border-t border-slate-200 flex flex-col gap-2">
            <p className="text-[11px] font-bold text-slate-600">Hitung Rate Otomatis (Dari Nominal)</p>
            <div className="flex gap-2 items-center text-xs">
              <input
                type="number"
                placeholder="Rp"
                className="border border-[#004f71] rounded-md px-2 py-1 w-full bg-white text-slate-800"
                onBlur={(e) => {
                  const nominal = Number(e.target.value);
                  const timeInput = e.target.nextElementSibling?.nextElementSibling;
                  const time = timeInput ? Number(timeInput.value) || 1 : 1;
                  const baseAmt = row.outstanding !== null ? row.outstanding : row.usageGap;
                  if (nominal > 0 && time > 0 && baseAmt > 0) {
                     const rate = nominal / (baseAmt * time);
                     updateRowConfig(row.id, { penalty: { ...row.penaltyConfig, rate } });
                  }
                }}
              />
              <span className="text-slate-500">/</span>
              <input
                type="number" min={1} defaultValue={1}
                className="border border-[#004f71] rounded-md px-2 py-1 w-14 bg-white text-slate-800 text-center"
                onBlur={(e) => {
                  const time = Number(e.target.value) || 1;
                  const nominalInput = e.target.previousElementSibling?.previousElementSibling;
                  const nominal = nominalInput ? Number(nominalInput.value) : 0;
                  const baseAmt = row.outstanding !== null ? row.outstanding : row.usageGap;
                  if (nominal > 0 && time > 0 && baseAmt > 0) {
                     const rate = nominal / (baseAmt * time);
                     updateRowConfig(row.id, { penalty: { ...row.penaltyConfig, rate } });
                  }
                }}
              />
              <span className="text-slate-500">{row.penaltyConfig.period === 'daily' ? 'hari' : (row.penaltyConfig.period === 'weekly' ? 'mgg' : 'bln')}</span>
            </div>
            <p className="text-[9px] text-slate-400">*(Dibagi base outstanding Rp{formatRupiah(row.outstanding !== null ? row.outstanding : row.usageGap)})</p>
          </div>
        </>
      )}
    </div>
  </Popover>
  </div>
</td>
<td className="p-0 h-px border-b-2 border-[#004f71]">
  <CurrencyInput value={row.totalOutstanding} onChange={(v) => updateDataRow(row.id, 'manualTotalOutstanding', v)} isTotal={true} />
</td>
</tr>
                    </React.Fragment>
                  );
                })}
                  </tbody>
            </table>
          </div>
          <button onClick={addNewRow} className="w-full py-3 text-sm font-bold bg-[#004f71] text-white hover:bg-[#003366] transition-colors border-t-2 border-[#004f71] shrink-0 ">
            + Tambah Baris
          </button>
        </div>
      </main>

      {/* Confirmation Modal */}
      {rowToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">{rowToDelete === 'ALL' ? 'Clear All Data' : 'Konfirmasi Hapus'}</h3>
            <p className="text-slate-600 mb-6">{rowToDelete === 'ALL' ? 'Apakah Anda yakin ingin menghapus semua isi tabel? Semua sel akan dikosongkan.' : 'Apakah Anda yakin ingin menghapus baris ini?'}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRowToDelete(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleDeleteRow(rowToDelete);
                  setRowToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium cursor-pointer"
              >
                {rowToDelete === 'ALL' ? 'Clear All' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
