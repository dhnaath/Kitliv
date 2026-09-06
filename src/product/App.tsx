import React, { useState } from 'react';
import { TrackedItem, ItemCategory } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AddItemForm } from './components/AddItemForm';
import { ItemCard } from './components/ItemCard';
import { Button, Card, Select } from './components/ui';
import { Plus, LayoutDashboard, Box, Search } from 'lucide-react';
import { calculateStatus, calculateTotalCost, formatCurrency } from './utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [items, setItems] = useLocalStorage<TrackedItem[]>('lifespan_tracker_items', []);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<ItemCategory | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddItem = (newItemData: Omit<TrackedItem, 'id' | 'createdAt'>) => {
    const newItem: TrackedItem = {
      ...newItemData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setItems(prev => [newItem, ...prev]);
    setIsAdding(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // Stats
  const activeItems = items.filter(i => calculateStatus(i.endDate) === 'aman').length;
  const expiringSoonItems = items.filter(i => calculateStatus(i.endDate) === 'hampir_habis').length;
  const expiredItems = items.filter(i => calculateStatus(i.endDate) === 'kadaluarsa').length;
  
  // Adjusted total asset calculation
  const totalAssetValue = items.reduce((acc, item) => acc + calculateTotalCost(item.price, item.quantity, item.discount), 0);

  // Filter & Search
  const filteredItems = items
    .filter(item => filter === 'Semua' || item.category === filter)
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()); // Sort by closest to expire

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-100">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Box className="w-7 h-7 text-blue-600" />
              Pelacak Masa Pakai & Aset
            </h1>
            <p className="text-sm text-slate-500 mt-1">Kelola masa pakai, garansi, kadaluarsa, dan nilai aset barang Anda.</p>
          </div>
          <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Barang
          </Button>
        </header>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <p className="text-slate-500 text-sm font-medium">Total Aset</p>
            <p className="text-2xl font-bold mt-1 text-slate-900">
              {formatCurrency(totalAssetValue)}
            </p>
            <span className="text-slate-400 text-xs">{items.length} Barang terdaftar</span>
          </Card>
          <Card>
            <p className="text-slate-500 text-sm font-medium">Aman</p>
            <p className="text-3xl font-bold mt-1 text-slate-900">{activeItems}</p>
            <span className="text-green-500 text-xs font-bold">Kondisi baik</span>
          </Card>
          <Card>
            <p className="text-slate-500 text-sm font-medium">Peringatan</p>
            <p className="text-3xl font-bold mt-1 text-slate-900">{expiringSoonItems}</p>
            <span className="text-amber-500 text-xs font-bold">Hampir habis/kadaluarsa</span>
          </Card>
          <Card>
            <p className="text-slate-500 text-sm font-medium">Kritis</p>
            <p className="text-3xl font-bold mt-1 text-slate-900">{expiredItems}</p>
            <span className="text-red-500 text-xs font-bold">Perlu penggantian</span>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.2 }}
              >
                <AddItemForm 
                  onAdd={handleAddItem} 
                  onCancel={() => setIsAdding(false)} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari barang..." 
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-100 rounded-full focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Kategori:</span>
              <Select 
                value={filter} 
                onChange={e => setFilter(e.target.value as any)}
                className="w-full sm:w-40 bg-white border border-slate-100 shadow-sm"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Makanan">Makanan</option>
                <option value="Obat">Obat</option>
                <option value="Kosmetik">Kosmetik</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Lainnya">Lainnya</option>
              </Select>
            </div>
          </div>

          {/* Item Grid */}
          {items.length === 0 ? (
            <div className="text-center py-16 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
              <Box className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">Belum ada barang</h3>
              <p className="text-slate-500 mt-1 mb-4">Tambahkan barang pertama Anda untuk mulai melacak masa pakainya.</p>
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="w-4 h-4 mr-2" /> Tambah Barang
              </Button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-white rounded-3xl border border-slate-100">
              Tidak ada barang yang cocok dengan pencarian Anda.
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredItems.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ItemCard item={item} onDelete={handleDeleteItem} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

