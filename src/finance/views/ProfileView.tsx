import React, { useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';

export function ProfileView({ onBack, onUnavailable }: { onBack: () => void, onUnavailable?: () => void }) {
  const [localName, setLocalName] = useState(() => localStorage.getItem('localName') || '');
  const [dob, setDob] = useState(() => localStorage.getItem('localDob') || '');

  React.useEffect(() => {
    localStorage.setItem('localName', localName);
  }, [localName]);

  React.useEffect(() => {
    localStorage.setItem('localDob', dob);
  }, [dob]);

  const calculateAge = (dobString: string) => {
    if (!dobString) return null;
    const diff_ms = Date.now() - new Date(dobString).getTime();
    if (diff_ms < 0) return 0;
    const age_dt = new Date(diff_ms); 
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] w-full relative z-50">
      <div className="flex items-center gap-6 p-4 pt-5 mb-2">
        <button onClick={onBack}><ArrowLeft size={24} className="text-gray-100 hover:text-gray-100 transition-colors" /></button>
        <h1 className="text-lg font-normal text-gray-100">Profil Saya</h1>
      </div>
      <div className="flex-1 p-4">
        <div className="flex flex-col items-center justify-center p-8 text-center bg-[#212121] rounded-2xl border border-[#2a2a2a] mb-6">
          <div className="w-20 h-20 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-4 text-gray-400">
            <User size={40} />
          </div>
          <h2 className="text-lg font-medium text-gray-100 mb-2">Profil Lokal</h2>
          <p className="text-sm text-gray-400 mb-2">Data Anda disimpan secara lokal.</p>
        </div>
        
        <div className="bg-[#212121] rounded-2xl border border-[#2a2a2a] p-4 flex flex-col gap-4">
          <div className="text-gray-100 font-medium mb-1">Pengaturan Profil Lokal</div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400">Nama Panggilan</label>
            <input 
              type="text" 
              value={localName} 
              onChange={(e) => setLocalName(e.target.value)}
              maxLength={19}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-100 outline-none focus:border-[#555]"
              placeholder="Masukkan nama"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-400 flex justify-between">
              <span>Tanggal Lahir</span>
              {calculateAge(dob) !== null && <span className="text-[#4caf50]">Usia: {calculateAge(dob)} tahun</span>}
            </label>
            <input 
              type="date" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-100 outline-none focus:border-[#555] [color-scheme:dark]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-center px-4 bg-[#212121] rounded-2xl border border-[#2a2a2a]">
      <div className="text-gray-400 mb-2 font-medium">{title}</div>
      <div className="text-sm text-gray-500">{desc}</div>
    </div>
  );
}
