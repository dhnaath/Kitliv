import { useState } from 'react';
import { CheckCircle2, Circle, FileText, TrendingUp, TrendingDown, Plus, Download, Clock, CreditCard, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

const incomeData = [
  { name: 'Week 1', Income: 1200, Expenses: 400 },
  { name: 'Week 2', Income: 2100, Expenses: 350 },
  { name: 'Week 3', Income: 800, Expenses: 600 },
  { name: 'Week 4', Income: 1500, Expenses: 200 },
];

const invoiceData = [
  { name: 'Paid', value: 12, color: '#10b981' }, // emerald-500
  { name: 'Unpaid', value: 4, color: '#f59e0b' }, // amber-500
  { name: 'Overdue', value: 1, color: '#ef4444' }, // red-500
];

const recentActivity = [
  { id: 1, type: 'invoice_paid', title: 'Invoice #0042 Paid', desc: 'Client A paid $1,200', time: '2 hours ago', icon: CreditCard, color: 'text-emerald-500 bg-emerald-50' },
  { id: 2, type: 'task_completed', title: 'Task Completed', desc: 'Design Landing Page', time: '5 hours ago', icon: CheckCircle2, color: 'text-blue-500 bg-blue-50' },
  { id: 3, type: 'expense_added', title: 'Expense Logged', desc: 'Software Subscriptions ($45)', time: '1 day ago', icon: TrendingDown, color: 'text-rose-500 bg-rose-50' },
  { id: 4, type: 'invoice_sent', title: 'Invoice #0043 Sent', desc: 'Sent to TechStart', time: '2 days ago', icon: FileText, color: 'text-indigo-500 bg-indigo-50' },
];

export function DashboardView() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInvoice = async () => {
    setIsGenerating(true);
    try {
      // In a real app, you would fetch completed tasks for a specific client
      // For this demo, we're using the mock data IDs from our server
      const response = await fetch('/api/invoices/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: 'c2',
          clientName: 'TechStart',
          tasks: ['t2', 't3'] // Mock completed/in-progress task IDs
        })
      });

      if (!response.ok) throw new Error('Failed to generate invoice');

      // Create a blob from the PDF stream
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_TechStart_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      console.error(err);
      alert('Error generating invoice');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full h-full overflow-y-auto scrollbar-hide">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of your income, expenses, and invoices.</p>
        </div>
        <button 
          onClick={handleGenerateInvoice}
          disabled={isGenerating}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70"
        >
          {isGenerating ? (
            <span className="flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Generating...</span>
          ) : (
            <><Download size={16} className="mr-2" /> Auto-Generate Invoice</>
          )}
        </button>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-slate-500">
              <TrendingUp size={18} className="mr-2 text-emerald-500" />
              <span className="text-sm font-medium">Income this month</span>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+14%</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">$5,600.00</div>
        </div>
        
        <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-slate-500">
              <TrendingDown size={18} className="mr-2 text-rose-500" />
              <span className="text-sm font-medium">Expenses this month</span>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">-2%</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">$1,550.00</div>
        </div>
        
        <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-slate-500">
              <FileText size={18} className="mr-2 text-amber-500" />
              <span className="text-sm font-medium">Pending Invoices</span>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Action Needed</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">$3,400.00</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bar Chart: Income vs Expenses */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Cash Flow</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom row of charts / lists if needed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pie Chart: Invoice Status */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Invoice Status</h3>
              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={invoiceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {invoiceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {invoiceData.map(item => (
                  <div key={item.name} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs text-slate-600 font-medium">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions or Summary */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <CreditCard size={100} />
               </div>
               <div className="relative z-10">
                 <h3 className="text-lg font-bold mb-2">Ready to bill?</h3>
                 <p className="text-sm text-slate-400 mb-6 leading-relaxed">You have 5 completed tasks this week that haven't been invoiced yet.</p>
               </div>
               <button 
                  onClick={handleGenerateInvoice}
                  disabled={isGenerating}
                  className="relative z-10 bg-white text-slate-900 w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-70"
               >
                 {isGenerating ? 'Generating...' : 'Review & Invoice Now'}
               </button>
            </div>
          </div>
        </div>

        {/* Activity Log Sidebar */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
            <Activity size={18} className="text-slate-400" />
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
              {recentActivity.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="relative pl-6">
                    <div className={cn("absolute -left-[17px] top-0.5 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white", activity.color)}>
                      <Icon size={14} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{activity.title}</div>
                      <div className="text-sm text-slate-500 mt-1">{activity.desc}</div>
                      <div className="text-xs text-slate-400 mt-2 flex items-center">
                        <Clock size={10} className="mr-1" /> {activity.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-4 border-t border-gray-50">
             <button className="w-full text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors py-2 text-center">
               View All Activity
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
