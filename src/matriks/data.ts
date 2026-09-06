import { Framework } from './types';

export const frameworks: Framework[] = [
  {
    id: 'pengeluaran',
    name: 'Kuadran Pengeluaran',
    description: 'Memetakan karakter pengeluaran berdasarkan sifat dan wujudnya (Sumbu X: Tangible vs Intangible, Sumbu Y: Primary vs Secondary).',
    quadrants: {
      tl: { id: 'tl', title: 'Primary & Tangible', subtitle: 'Kebutuhan Pokok Fisik (Makan, Rumah)', theme: 'emerald' },
      tr: { id: 'tr', title: 'Primary & Intangible', subtitle: 'Kebutuhan Pokok Layanan (Listrik, Edukasi)', theme: 'blue' },
      bl: { id: 'bl', title: 'Secondary & Tangible', subtitle: 'Pelengkap Berwujud (Gadget, Pakaian)', theme: 'amber' },
      br: { id: 'br', title: 'Secondary & Intangible', subtitle: 'Pelengkap Non-Fisik (Liburan, Hiburan)', theme: 'rose' }
    }
  },
  {
    id: 'pendapatan',
    name: 'Kuadran Pendapatan',
    description: 'Memetakan bagaimana arus masuk uang dihasilkan dan kepastian nilainya (Sumbu X: Active vs Passive, Sumbu Y: Fixed vs Variable).',
    quadrants: {
      tl: { id: 'tl', title: 'Fixed & Active', subtitle: 'Pasti & Butuh Waktu (Gaji Tetap)', theme: 'emerald' },
      tr: { id: 'tr', title: 'Fixed & Passive', subtitle: 'Pasti & Otomatis (Sewa, Obligasi)', theme: 'blue' },
      bl: { id: 'bl', title: 'Variable & Active', subtitle: 'Fluktuatif & Butuh Waktu (Freelance, Bonus)', theme: 'amber' },
      br: { id: 'br', title: 'Variable & Passive', subtitle: 'Fluktuatif & Otomatis (Dividen, Royalti)', theme: 'rose' }
    }
  },
  {
    id: 'financial_health',
    name: 'Financial Health & Resilience',
    description: 'Memetakan kesehatan finansial berdasarkan surplus/defisit dan ketahanan (Sumbu X: Defisit vs Surplus, Sumbu Y: Resilient vs Vulnerable).',
    quadrants: {
      tl: { id: 'tl', title: 'Resilient & Defisit', subtitle: 'Punya Safety Net, Arus Kas Negatif', theme: 'amber' },
      tr: { id: 'tr', title: 'Resilient & Surplus', subtitle: 'Punya Safety Net, Arus Kas Positif', theme: 'emerald' },
      bl: { id: 'bl', title: 'Vulnerable & Defisit', subtitle: 'Tanpa Safety Net, Arus Kas Negatif', theme: 'rose' },
      br: { id: 'br', title: 'Vulnerable & Surplus', subtitle: 'Tanpa Safety Net, Arus Kas Positif', theme: 'blue' }
    }
  },
  {
    id: 'swot',
    name: 'SWOT Analysis',
    description: 'Strategic planning technique used to help identify strengths, weaknesses, opportunities, and threats.',
    quadrants: {
      tl: { id: 'tl', title: 'Strengths', subtitle: 'Helpful & Internal', theme: 'emerald' },
      tr: { id: 'tr', title: 'Weaknesses', subtitle: 'Harmful & Internal', theme: 'rose' },
      bl: { id: 'bl', title: 'Opportunities', subtitle: 'Helpful & External', theme: 'blue' },
      br: { id: 'br', title: 'Threats', subtitle: 'Harmful & External', theme: 'amber' }
    }
  },
  {
    id: 'eisenhower',
    name: 'Eisenhower Matrix',
    description: 'Time management and prioritization framework based on urgency and importance.',
    quadrants: {
      tl: { id: 'tl', title: 'Do First', subtitle: 'Urgent & Important', theme: 'emerald' },
      tr: { id: 'tr', title: 'Schedule', subtitle: 'Not Urgent & Important', theme: 'blue' },
      bl: { id: 'bl', title: 'Delegate', subtitle: 'Urgent & Not Important', theme: 'amber' },
      br: { id: 'br', title: 'Don\'t Do', subtitle: 'Not Urgent & Not Important', theme: 'rose' }
    }
  }
];
