import { useState } from 'react';
import { 
  Plus, Users, Search, Mail, Globe, Phone, MessageCircle, 
  Instagram, Twitter, Linkedin, Facebook, Youtube, Tag, Folder, X, ChevronDown, Check, MoreHorizontal
} from 'lucide-react';
import { Contact, SocialLinks } from '../../types';
import { cn } from '../../lib/utils';

const CATEGORIES = ['Client', 'Lead', 'Partner', 'Vendor', 'Personal', 'Other'];
const COMMON_LABELS = ['VIP', 'Warm', 'Cold', 'Follow Up', 'Active', 'Inactive'];
const SOCIAL_OPTIONS = [
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { id: 'twitter', label: 'Twitter / X', icon: Twitter },
  { id: 'facebook', label: 'Facebook', icon: Facebook },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'tiktok', label: 'TikTok', icon: MoreHorizontal },
];

export function ContactsView() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory ? c.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Contacts & CRM</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your network, clients, and leads.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
        >
          <Plus size={18} className="mr-2" /> Add Contact
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search contacts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide">
          <button 
            onClick={() => setFilterCategory(null)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border",
              filterCategory === null 
                ? "bg-slate-800 text-white border-slate-800" 
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            )}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border",
                filterCategory === cat 
                  ? "bg-slate-800 text-white border-slate-800" 
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50 p-8">
           <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
             <Users size={32} className="text-blue-500" />
           </div>
           <h3 className="text-xl font-bold text-slate-800">No contacts yet</h3>
           <p className="text-slate-500 mt-2 max-w-md text-center">Add your first contact to start building your personal CRM.</p>
           <button 
              onClick={() => setIsAddModalOpen(true)}
              className="mt-6 text-blue-600 font-medium hover:text-blue-700 flex items-center"
           >
             <Plus size={16} className="mr-1" /> Add your first contact
           </button>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-slate-100">
           <Search size={32} className="text-slate-300 mb-4" />
           <h3 className="text-lg font-semibold text-slate-700">No matching contacts</h3>
           <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-24 md:pb-6">
          {filteredContacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <AddContactModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={(contact) => {
            setContacts(prev => [contact, ...prev]);
            setIsAddModalOpen(false);
          }} 
        />
      )}
    </div>
  );
}

function ContactCard({ contact }: { contact: Contact }) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg border border-blue-200 shrink-0">
            {getInitials(contact.name)}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight">{contact.name}</h3>
            {contact.company && <p className="text-slate-500 text-sm">{contact.company}</p>}
          </div>
        </div>
        <div className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center shrink-0">
          <Folder size={12} className="mr-1.5" />
          {contact.category}
        </div>
      </div>

      {contact.labels && contact.labels.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {contact.labels.map(label => (
            <span key={label} className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center">
              <Tag size={10} className="mr-1" />
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-3 mt-auto pt-4 border-t border-slate-50">
        {contact.email && (
          <div className="flex items-center text-sm text-slate-600">
            <Mail size={14} className="mr-3 text-slate-400 shrink-0" />
            <a href={`mailto:${contact.email}`} className="hover:text-blue-600 truncate">{contact.email}</a>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center text-sm text-slate-600">
            <Phone size={14} className="mr-3 text-slate-400 shrink-0" />
            <a href={`tel:${contact.phone}`} className="hover:text-blue-600">{contact.phone}</a>
          </div>
        )}
        {contact.website && (
          <div className="flex items-center text-sm text-slate-600">
            <Globe size={14} className="mr-3 text-slate-400 shrink-0" />
            <a href={contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 truncate">{contact.website}</a>
          </div>
        )}
        
        {/* Social Links Row */}
        {contact.socialLinks && Object.values(contact.socialLinks).some(Boolean) && (
          <div className="flex items-center gap-3 pt-3 mt-1">
            {Object.entries(contact.socialLinks).map(([platform, handle]) => {
              if (!handle) return null;
              const option = SOCIAL_OPTIONS.find(o => o.id === platform);
              if (!option) return null;
              const Icon = option.icon;
              return (
                <a key={platform} href="#" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors" title={handle}>
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AddContactModal({ onClose, onAdd }: { onClose: () => void, onAdd: (c: Contact) => void }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [labels, setLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  
  const [isSocialExpanded, setIsSocialExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    const newContact: Contact = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      company,
      email,
      phone,
      website,
      category,
      labels,
      socialLinks,
      createdAt: new Date().toISOString()
    };
    
    onAdd(newContact);
  };

  const toggleLabel = (label: string) => {
    if (labels.includes(label)) {
      setLabels(labels.filter(l => l !== label));
    } else {
      setLabels([...labels, label]);
    }
  };

  const handleAddCustomLabel = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newLabel.trim()) {
      e.preventDefault();
      if (!labels.includes(newLabel.trim())) {
        setLabels([...labels, newLabel.trim()]);
      }
      setNewLabel('');
    }
  };

  const updateSocialLink = (platform: keyof SocialLinks, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">Add New Contact</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Full Name *</label>
                <input 
                  type="text" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Company</label>
                <input 
                  type="text" value={company} onChange={e => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Acme Corp"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <div className="relative">
                  <select 
                    value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">Contact Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center"><Mail size={14} className="mr-1.5 text-slate-400"/> Email</label>
                <input 
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="jane@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center"><Phone size={14} className="mr-1.5 text-slate-400"/> Phone</label>
                <input 
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 flex items-center"><Globe size={14} className="mr-1.5 text-slate-400"/> Website</label>
                <input 
                  type="url" value={website} onChange={e => setWebsite(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Social Media</h3>
               <button type="button" onClick={() => setIsSocialExpanded(!isSocialExpanded)} className="text-sm text-blue-600 font-medium hover:text-blue-700">
                 {isSocialExpanded ? 'Show less' : 'Add social links'}
               </button>
             </div>
             
             {isSocialExpanded && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                 {SOCIAL_OPTIONS.map(option => {
                   const Icon = option.icon;
                   return (
                     <div key={option.id} className="flex items-center">
                       <div className="w-10 h-10 rounded-l-xl border border-r-0 border-slate-200 bg-white flex items-center justify-center text-slate-400 shrink-0">
                         <Icon size={16} />
                       </div>
                       <input 
                          type="text" 
                          value={socialLinks[option.id as keyof SocialLinks] || ''} 
                          onChange={e => updateSocialLink(option.id as keyof SocialLinks, e.target.value)}
                          placeholder={`${option.label} handle or URL`}
                          className="flex-1 w-full px-3 py-2.5 bg-white border border-slate-200 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                       />
                     </div>
                   );
                 })}
               </div>
             )}
          </div>

          {/* Labels */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">Labels & Tags</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {COMMON_LABELS.map(label => {
                  const isSelected = labels.includes(label);
                  return (
                    <button
                      type="button"
                      key={label}
                      onClick={() => toggleLabel(label)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center border",
                        isSelected 
                          ? "bg-blue-50 border-blue-200 text-blue-700" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {isSelected && <Check size={14} className="mr-1.5" />}
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  onKeyDown={handleAddCustomLabel}
                  placeholder="Type a custom label and press Enter..."
                  className="flex-1 bg-transparent border-b border-slate-200 py-2 text-sm focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              {labels.filter(l => !COMMON_LABELS.includes(l)).length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {labels.filter(l => !COMMON_LABELS.includes(l)).map(label => (
                    <span key={label} className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center">
                       {label}
                       <button type="button" onClick={() => toggleLabel(label)} className="ml-2 text-slate-400 hover:text-slate-600">
                         <X size={14} />
                       </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </form>
        
        <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 mt-auto shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all active:scale-95"
          >
            Save Contact
          </button>
        </div>
      </div>
    </div>
  );
}
