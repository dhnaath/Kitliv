import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Users,
  DollarSign,
  Settings,
  Bell,
  Search,
  Plus,
  LogOut,
  User,
  CreditCard,
  Moon,
  Globe,
  Calendar,
  Clock,
  Activity,
  Target,
  BookOpen,
  Bookmark,
  Lightbulb,
  Key,
  Dumbbell,
  Utensils,
  Briefcase,
  Music,
  CloudSun,
  Wallet,
  Book,
  Plane,
  ShoppingCart,
  Heart,
  Archive,
  GraduationCap,
  Layers,
  FileCheck,
  Film,
  Gamepad2,
  Podcast,
  Ticket,
  PenTool,
  Camera,
  Type,
  Code,
} from "lucide-react";
import { cn } from "../lib/utils";
import { ReactNode, useState } from "react";

interface ZohoSoloLayoutProps {
  children: ReactNode;
  activeApp: string;
  onNavigate: (app: string) => void;
  onQuickAdd?: () => void;
}

export function ZohoSoloLayout({
  children,
  activeApp,
  onNavigate,
  onQuickAdd,
}: ZohoSoloLayoutProps) {
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');

  const handleOpenSettings = (tab = 'general') => {
    setActiveSettingsTab(tab);
    setIsSettingsOpen(true);
    setIsMobileProfileOpen(false);
    setIsDesktopProfileOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-white text-slate-800 overflow-hidden font-sans">
      {/* Floating ME Circle for Mobile */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <div 
          onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
          className="w-10 h-10 rounded-full bg-slate-700 text-white border-2 border-slate-600 flex items-center justify-center font-bold text-[10px] shadow-lg cursor-pointer relative"
        >
          ME
          <ProfileMenu isOpen={isMobileProfileOpen} onClose={() => setIsMobileProfileOpen(false)} isMobile onOpenSettings={handleOpenSettings} />
        </div>
      </div>

      {/* Far Left Rail (Zoho Style) - Hidden on Mobile */}
      <div className="hidden md:flex w-[68px] flex-shrink-0 bg-[#1E293B] border-r border-slate-800 flex-col items-center py-5 z-50 shadow-xl relative">
        {/* User Profile / Logo */}
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white flex items-center justify-center font-bold text-lg mb-8 shadow-md">
          Z
        </div>

        {/* Main Navigation */}
        <div className="flex flex-col gap-4 w-full px-3 relative">
          <RailItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeApp === "dashboard"}
            onClick={() => onNavigate("dashboard")}
          />
          <RailItem
            icon={Activity}
            label="Habits"
            active={activeApp === "habits"}
            onClick={() => onNavigate("habits")}
          />
          <RailItem
            icon={Target}
            label="Goals"
            active={activeApp === "goals"}
            onClick={() => onNavigate("goals")}
          />
          <RailItem
            icon={BookOpen}
            label="Journal"
            active={activeApp === "journal"}
            onClick={() => onNavigate("journal")}
          />
          <RailItem
            icon={Bookmark}
            label="Bookmarks"
            active={activeApp === "bookmarks"}
            onClick={() => onNavigate("bookmarks")}
          />
          <RailItem
            icon={Lightbulb}
            label="Ideas"
            active={activeApp === "ideas"}
            onClick={() => onNavigate("ideas")}
          />
          <RailItem
            icon={Key}
            label="Passwords"
            active={activeApp === "passwords"}
            onClick={() => onNavigate("passwords")}
          />
          <RailItem
            icon={Dumbbell}
            label="Workouts"
            active={activeApp === "workouts"}
            onClick={() => onNavigate("workouts")}
          />
          <RailItem
            icon={Utensils}
            label="Recipes"
            active={activeApp === "recipes"}
            onClick={() => onNavigate("recipes")}
          />
          <RailItem
            icon={Briefcase}
            label="Projects"
            active={activeApp === "projects"}
            onClick={() => onNavigate("projects")}
          />
          <RailItem
            icon={Music}
            label="Music"
            active={activeApp === "music"}
            onClick={() => onNavigate("music")}
          />
          <RailItem
            icon={CloudSun}
            label="Weather"
            active={activeApp === "weather"}
            onClick={() => onNavigate("weather")}
          />
          <RailItem
            icon={Wallet}
            label="Budget"
            active={activeApp === "budget"}
            onClick={() => onNavigate("budget")}
          />
          <RailItem
            icon={Book}
            label="Reading"
            active={activeApp === "reading"}
            onClick={() => onNavigate("reading")}
          />
          <RailItem
            icon={Plane}
            label="Trips"
            active={activeApp === "trips"}
            onClick={() => onNavigate("trips")}
          />
          <RailItem
            icon={ShoppingCart}
            label="Shopping"
            active={activeApp === "shopping"}
            onClick={() => onNavigate("shopping")}
          />
          <RailItem
            icon={Heart}
            label="Health"
            active={activeApp === "health"}
            onClick={() => onNavigate("health")}
          />
          <RailItem
            icon={Archive}
            label="Inventory"
            active={activeApp === "inventory"}
            onClick={() => onNavigate("inventory")}
          />
          <RailItem
            icon={CreditCard}
            label="Subscriptions"
            active={activeApp === "subscriptions"}
            onClick={() => onNavigate("subscriptions")}
          />
          <RailItem
            icon={GraduationCap}
            label="Courses"
            active={activeApp === "courses"}
            onClick={() => onNavigate("courses")}
          />
          <RailItem
            icon={Layers}
            label="Flashcards"
            active={activeApp === "flashcards"}
            onClick={() => onNavigate("flashcards")}
          />
          <RailItem
            icon={FileCheck}
            label="Exams"
            active={activeApp === "exams"}
            onClick={() => onNavigate("exams")}
          />
          <RailItem
            icon={Globe}
            label="Languages"
            active={activeApp === "languages"}
            onClick={() => onNavigate("languages")}
          />
          <RailItem
            icon={Film}
            label="Movies"
            active={activeApp === "movies"}
            onClick={() => onNavigate("movies")}
          />
          <RailItem
            icon={Gamepad2}
            label="Games"
            active={activeApp === "games"}
            onClick={() => onNavigate("games")}
          />
          <RailItem
            icon={Podcast}
            label="Podcasts"
            active={activeApp === "podcasts"}
            onClick={() => onNavigate("podcasts")}
          />
          <RailItem
            icon={Ticket}
            label="Events"
            active={activeApp === "events"}
            onClick={() => onNavigate("events")}
          />
          <RailItem
            icon={PenTool}
            label="Design"
            active={activeApp === "design"}
            onClick={() => onNavigate("design")}
          />
          <RailItem
            icon={Camera}
            label="Photography"
            active={activeApp === "photography"}
            onClick={() => onNavigate("photography")}
          />
          <RailItem
            icon={Type}
            label="Writing"
            active={activeApp === "writing"}
            onClick={() => onNavigate("writing")}
          />
          <RailItem
            icon={Code}
            label="Code"
            active={activeApp === "code"}
            onClick={() => onNavigate("code")}
          />
          <RailItem
            icon={FileText}
            label="Notes & Docs"
            active={activeApp === "notes"}
            onClick={() => onNavigate("notes")}
          />
          <RailItem
            icon={Users}
            label="CRM"
            active={activeApp === "contacts"}
            onClick={() => onNavigate("contacts")}
          />
          <RailItem
            icon={DollarSign}
            label="Finances"
            active={activeApp === "finances"}
            onClick={() => onNavigate("finances")}
          />
        </div>

        {/* Global Quick Add */}
        <div className="my-6">
          <button
            onClick={onQuickAdd}
            className="w-11 h-11 mx-auto rounded-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-4 w-full px-3 relative">
          <RailItem icon={Search} label="Search" />
          <RailItem icon={Bell} label="Notifications" />
          <RailItem icon={Settings} label="Settings" onClick={() => handleOpenSettings('general')} />
          <div 
            onClick={() => setIsDesktopProfileOpen(!isDesktopProfileOpen)}
            className="w-10 h-10 rounded-full bg-slate-700 text-white border-2 border-slate-600 flex items-center justify-center font-bold text-xs mt-2 mx-auto cursor-pointer hover:border-slate-400 transition-colors relative"
          >
            ME
            <ProfileMenu isOpen={isDesktopProfileOpen} onClose={() => setIsDesktopProfileOpen(false)} onOpenSettings={handleOpenSettings} />
          </div>
        </div>
      </div>

      {/* App Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-white pb-[60px] md:pb-0">
        {children}
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        initialTab={activeSettingsTab} 
      />

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-[#1E293B] border-t border-slate-800 flex items-center justify-around px-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
        <MobileRailItem
          icon={LayoutDashboard}
          label="Home"
          active={activeApp === "dashboard"}
          onClick={() => onNavigate("dashboard")}
        />
        {/* Floating Quick Add for Mobile */}
        <div className="relative -top-5">
          <button
            onClick={onQuickAdd}
            className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center shadow-lg shadow-blue-900/40 border-4 border-[#1E293B] transition-transform active:scale-95"
          >
            <Plus size={24} />
          </button>
        </div>

        <MobileRailItem
          icon={FileText}
          label="Notes"
          active={activeApp === "notes"}
          onClick={() => onNavigate("notes")}
        />
        <MobileRailItem
          icon={DollarSign}
          label="Finance"
          active={activeApp === "finances"}
          onClick={() => onNavigate("finances")}
        />
      </div>
    </div>
  );
}

function MobileRailItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-14 h-14 rounded-xl cursor-pointer transition-all",
        active ? "text-blue-400" : "text-slate-400 hover:text-slate-200",
      )}
    >
      <Icon
        size={20}
        strokeWidth={active ? 2.5 : 2}
        className={cn("mb-1", active && "scale-110 transition-transform")}
      />
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </div>
  );
}

function RailItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-11 h-11 mx-auto rounded-xl flex items-center justify-center cursor-pointer transition-all group relative",
        active
          ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
      )}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />

      {/* Tooltip */}
      <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-800 transform translate-x-2 group-hover:translate-x-0 transition-all">
        {label}
        {/* Tooltip Triangle */}
        <div className="absolute top-1/2 -left-1 -mt-1 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-slate-900"></div>
      </div>
    </div>
  );
}

function ProfileMenu({ isOpen, onClose, isMobile, onOpenSettings }: { isOpen: boolean, onClose: () => void, isMobile?: boolean, onOpenSettings: (tab: string) => void }) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); onClose(); }} />
      <div 
        className={cn(
          "absolute z-50 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 cursor-default text-left",
          isMobile ? "top-14 right-0" : "bottom-0 left-16 mb-2"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* User Info */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
              ME
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800">My Account</span>
              <span className="text-xs text-slate-500">Free Plan</span>
            </div>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="p-2 space-y-1">
          <ProfileMenuItem icon={User} label="Profile Settings" onClick={() => onOpenSettings('profile')} />
          <ProfileMenuItem icon={Settings} label="Preferences" onClick={() => onOpenSettings('general')} />
          <ProfileMenuItem icon={CreditCard} label="Billing & Subscription" onClick={() => onOpenSettings('billing')} />
          <ProfileMenuItem icon={Globe} label="Language & Region" onClick={() => onOpenSettings('region')} />
          <ProfileMenuItem icon={Moon} label="Appearance" onClick={() => onOpenSettings('appearance')} />
        </div>
        
        <div className="p-2 border-t border-slate-100">
          <ProfileMenuItem icon={LogOut} label="Sign Out" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => {}} />
        </div>
      </div>
    </>
  );
}

function ProfileMenuItem({ icon: Icon, label, rightText, className, onClick }: any) {
  return (
    <button 
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors", className)}
    >
      <div className="flex items-center gap-3">
        <Icon size={16} />
        {label}
      </div>
      {rightText && <span className="text-xs text-slate-400">{rightText}</span>}
    </button>
  );
}

function SettingsModal({ isOpen, onClose, initialTab }: { isOpen: boolean, onClose: () => void, initialTab: string }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'general');

  // Update tab if initialTab changes while open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl h-[80vh] max-h-[800px] flex overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Settings Sidebar */}
        <div className="w-64 bg-slate-50 border-r border-slate-100 flex flex-col hidden md:flex shrink-0">
          <div className="p-6 pb-4">
            <h2 className="text-xl font-bold text-slate-800">Settings</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 space-y-1">
            <SettingsTab id="profile" icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <SettingsTab id="general" icon={Settings} label="Preferences" active={activeTab === 'general'} onClick={() => setActiveTab('general')} />
            <SettingsTab id="region" icon={Globe} label="Language & Region" active={activeTab === 'region'} onClick={() => setActiveTab('region')} />
            <SettingsTab id="appearance" icon={Moon} label="Appearance" active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} />
            <SettingsTab id="billing" icon={CreditCard} label="Billing" active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between md:justify-end">
            <div className="md:hidden flex items-center gap-2">
              <select 
                value={activeTab} 
                onChange={e => setActiveTab(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 outline-none"
              >
                <option value="profile">Profile</option>
                <option value="general">Preferences</option>
                <option value="region">Language & Region</option>
                <option value="appearance">Appearance</option>
                <option value="billing">Billing</option>
              </select>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <LogOut size={18} className="rotate-180" /> {/* Reusing LogOut icon for close or just use text if no X */}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'general' && <GeneralSettings />}
            {activeTab === 'region' && <RegionSettings />}
            {activeTab === 'appearance' && <AppearanceSettings />}
            {activeTab === 'billing' && <BillingSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
        active ? "bg-white text-blue-600 shadow-sm border border-slate-200/50" : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
      )}
    >
      <Icon size={18} className={active ? "text-blue-500" : "text-slate-400"} />
      {label}
    </button>
  );
}

function ProfileSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Profile Information</h3>
        <p className="text-sm text-slate-500 mb-6">Update your personal details and public profile.</p>
      </div>
      <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
        <div className="w-20 h-20 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-2xl shrink-0">
          ME
        </div>
        <div>
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors">
            Change Avatar
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">First Name</label>
            <input type="text" defaultValue="John" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Last Name</label>
            <input type="text" defaultValue="Doe" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Email Address</label>
          <input type="email" defaultValue="john.doe@example.com" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
        </div>
      </div>
      <div className="pt-4">
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-md shadow-blue-600/20 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function RegionSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Language & Region</h3>
        <p className="text-sm text-slate-500 mb-6">Customize your language, time, and currency formats.</p>
      </div>
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Language</label>
          <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none">
            <option>English (United States)</option>
            <option>English (United Kingdom)</option>
            <option>Bahasa Indonesia</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Country / Region</label>
          <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none">
            <option>United States</option>
            <option>Indonesia</option>
            <option>United Kingdom</option>
            <option>Australia</option>
            <option>Singapore</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">State / Province</label>
            <input type="text" placeholder="e.g. Jakarta" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">City</label>
            <input type="text" placeholder="e.g. Central Jakarta" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Timezone</label>
          <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none">
            <option>(UTC-08:00) Pacific Time (US & Canada)</option>
            <option>(UTC+07:00) Western Indonesia Time (WIB)</option>
            <option>(UTC+08:00) Central Indonesia Time (WITA)</option>
            <option>(UTC+09:00) Eastern Indonesia Time (WIT)</option>
            <option>(UTC+00:00) Coordinated Universal Time (UTC)</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Currency</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none">
              <option>USD ($)</option>
              <option>IDR (Rp)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Time Format</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none">
              <option>12-hour (1:00 PM)</option>
              <option>24-hour (13:00)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="pt-4">
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-md shadow-blue-600/20 transition-all">
          Save Preferences
        </button>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">General Preferences</h3>
        <p className="text-sm text-slate-500 mb-6">Manage how the application behaves.</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <h4 className="font-medium text-slate-800">Desktop Notifications</h4>
            <p className="text-xs text-slate-500 mt-0.5">Receive alerts for tasks and events.</p>
          </div>
          <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <h4 className="font-medium text-slate-800">Email Summaries</h4>
            <p className="text-xs text-slate-500 mt-0.5">Receive daily agenda emails.</p>
          </div>
          <div className="w-10 h-6 bg-slate-300 rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Appearance</h3>
        <p className="text-sm text-slate-500 mb-6">Customize the look and feel.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <button className="flex flex-col items-center gap-2 p-4 border-2 border-blue-600 rounded-xl bg-slate-50">
          <div className="w-full h-20 bg-white border border-slate-200 rounded shadow-sm flex flex-col">
            <div className="h-4 bg-slate-100 border-b border-slate-200"></div>
            <div className="flex-1 flex p-1 gap-1">
              <div className="w-1/4 h-full bg-slate-100 rounded-sm"></div>
              <div className="flex-1 bg-slate-50 rounded-sm"></div>
            </div>
          </div>
          <span className="text-sm font-bold text-blue-600">Light</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-4 border-2 border-transparent hover:border-slate-300 rounded-xl">
          <div className="w-full h-20 bg-slate-900 border border-slate-700 rounded shadow-sm flex flex-col">
            <div className="h-4 bg-slate-800 border-b border-slate-700"></div>
            <div className="flex-1 flex p-1 gap-1">
              <div className="w-1/4 h-full bg-slate-800 rounded-sm"></div>
              <div className="flex-1 bg-slate-900 rounded-sm"></div>
            </div>
          </div>
          <span className="text-sm font-medium text-slate-600">Dark</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-4 border-2 border-transparent hover:border-slate-300 rounded-xl">
          <div className="w-full h-20 bg-gradient-to-br from-slate-100 to-slate-800 border border-slate-300 rounded shadow-sm"></div>
          <span className="text-sm font-medium text-slate-600">System</span>
        </button>
      </div>
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Billing & Subscription</h3>
        <p className="text-sm text-slate-500 mb-6">Manage your plan and payment methods.</p>
      </div>
      <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-xl">Free Plan</h4>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">Current</span>
        </div>
        <p className="text-blue-100 text-sm mb-6">You are currently on the free tier. Upgrade to unlock premium features and higher limits.</p>
        <button className="bg-white text-blue-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}
