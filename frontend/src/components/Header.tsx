import React, { useState, useEffect } from "react";
import { 
  Menu, Search, SlidersHorizontal, Waves, Umbrella, Tent, 
  Castle, Palmtree, Home, Mountain, Compass
} from "lucide-react";
import SearchBar from "./SearchBar";
import ProfileMenu from "./ProfileMenu";
import Link from "next/link";

export const CATEGORIES = [
  { name: "All", icon: Compass },
  { name: "Amazing pools", icon: Waves },
  { name: "Beachfront", icon: Umbrella },
  { name: "Cabins", icon: Tent },
  { name: "OMG!", icon: Castle },
  { name: "Lakefront", icon: Palmtree },
  { name: "Design", icon: Home },
  { name: "Castles", icon: Castle },
  { name: "Farms", icon: Mountain }
];

export default function Header({ 
  activeTab = "All", 
  setActiveTab = () => {},
  showCategories = false,
  selectedCategory = "All",
  setSelectedCategory = () => {},
  startCollapsed = false,
  onSearch
}: { 
  activeTab?: string; 
  setActiveTab?: (tab: string) => void;
  showCategories?: boolean;
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void;
  startCollapsed?: boolean;
  onSearch?: (params: { location: string; guests: number }) => void;
}) {
  const [isCollapsed, setIsCollapsed] = useState(startCollapsed);
  const [isForceExpanded, setIsForceExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (startCollapsed) {
      setIsCollapsed(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
        setIsForceExpanded(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [startCollapsed]);

  const isExpanded = !isCollapsed || isForceExpanded;

  const tabs = [
    { name: "All", icon: "🌍" },
    { name: "Homes", icon: "🏡" },
    { name: "Experiences", icon: "🎈" },
    { name: "Services", icon: "🛎️" }
  ];

  return (
    <>
      {/* Backdrop for Force Expanded state */}
      {isCollapsed && isForceExpanded && (
        <div 
          className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-45 transition-all duration-300"
          onClick={() => setIsForceExpanded(false)}
        />
      )}

      <header className={`sticky top-0 z-50 bg-white border-b border-[var(--color-border-subtle)] shadow-sm w-full transition-all duration-300 ${
        isExpanded ? "pb-4" : "pb-0"
      }`}>
        {/* Top Row: Logo, Middle Switch/Compact Pill, User Menu */}
        <div className="max-w-7xl mx-auto px-6 xl:px-10 py-3 flex items-center justify-between">
          
          {/* Left: Logo */}
          <Link href="/" className="flex items-center text-[var(--color-primary)] font-bold text-xl cursor-pointer flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" className="mr-1">
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.267 3.42-6.536 3.615l-.28.019-.207.006C5.877 31 3 28.584 3 24.522l.005-.469c.026-.928.23-1.768.83-3.244l.216-.524c.966-2.298 5.05-10.82 7.044-14.736l.512-.992C12.827 2.052 14.154 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.736l-.213.518c-.534 1.284-.716 1.94-.741 2.673l-.004.288c0 2.82 1.834 4.567 4.5 4.567 1.815 0 3.865-1.127 5.76-3.053l.363-.376.17-.184h.01l.169.183c1.986 2.012 4.148 3.197 6.075 3.4l.285.023.2.005c2.666 0 4.5-1.746 4.5-4.566l-.006-.31c-.033-.71-.194-1.353-.726-2.617l-.142-.347c-.947-2.203-5.02-10.74-6.91-14.436l-.55-1.053c-.951-1.704-1.782-2.261-3.04-2.261zm0 9.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4zm0 2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"></path>
            </svg>
            <span className="hidden lg:block tracking-tight text-2xl font-extrabold mt-1">airbnb</span>
          </Link>

          {/* Center Column: Crossfade between Middle Tabs & Compact Pill */}
          <div className="flex-1 flex justify-center max-w-[420px] px-4 relative min-h-[48px] items-center">
            
            {/* Middle Tabs (Shown when Expanded) */}
            <div className={`flex items-center gap-6 transition-all duration-300 ${
              isExpanded 
                ? "opacity-100 scale-100 pointer-events-auto" 
                : "opacity-0 scale-90 pointer-events-none absolute invisible"
            }`}>
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2 pb-1.5 border-b-2 transition-all cursor-pointer font-bold text-sm select-none ${
                    activeTab === tab.name
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
                  }`}
                >
                  <span className="text-lg leading-none">{tab.icon}</span>
                  <span className="text-sm font-semibold">{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Compact Search Pill (Shown when Collapsed) */}
            <div 
              onClick={() => setIsForceExpanded(true)}
              className={`w-full max-w-[360px] flex items-center bg-white border border-gray-200 rounded-full py-1.5 pl-5 pr-2.5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer select-none h-11 ${
                !isExpanded 
                  ? "opacity-100 scale-100 pointer-events-auto" 
                  : "opacity-0 scale-90 pointer-events-none absolute invisible"
              }`}
            >
              <span className="text-[13px] font-bold text-gray-800 pr-3 border-r border-gray-100 truncate flex-shrink-0">Anywhere</span>
              <span className="text-[13px] font-bold text-gray-800 px-3 border-r border-gray-100 truncate flex-shrink-0">Any week</span>
              <span className="text-[13px] font-medium text-gray-400 pl-3 pr-2 truncate flex-1 text-left">Add guests</span>
              <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Search size={12} strokeWidth={3.5} />
              </div>
            </div>

          </div>

          {/* Right: User Menu */}
          <div className="flex items-center gap-4 flex-shrink-0 relative">
            <Link href="/hosting" className="hidden sm:block text-[14px] font-bold text-gray-800 hover:bg-gray-100 py-2 px-4 rounded-full transition-colors cursor-pointer select-none">
              Become a host
            </Link>
            
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1.5 pl-3 border border-gray-200 hover:shadow-md rounded-full transition-all cursor-pointer bg-white"
            >
              <button className="text-gray-700">
                <Menu size={18} strokeWidth={2.5} />
              </button>
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm shadow-inner select-none">
                N
              </div>
            </div>

            {showProfileMenu && (
              <ProfileMenu onClose={() => setShowProfileMenu(false)} />
            )}
          </div>

        </div>

        {/* Bottom Row: Detailed Search Bar (Collapsible) */}
        <div className={`w-full flex justify-center px-6 transition-all duration-300 origin-top ${
          isExpanded 
            ? "opacity-100 max-h-[100px] mt-2 pb-2 translate-y-0 pointer-events-auto" 
            : "opacity-0 max-h-0 pointer-events-none overflow-hidden scale-95 -translate-y-2 pb-0"
        }`}>
          <div className="w-full max-w-[850px]">
            <SearchBar onSearch={onSearch} />
          </div>
        </div>

        {/* Categories Bar Row (Optional rendering) */}
        {showCategories && (
          <div className="border-t border-[var(--color-border-subtle)] mt-2">
            <div className="max-w-7xl mx-auto px-6 xl:px-10 py-3 flex items-center justify-between gap-4">
              
              {/* Categories Scrollable Area */}
              <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-8 scroll-smooth py-1">
                {CATEGORIES.map((cat, idx) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedCategory?.(cat.name)}
                      className={`flex flex-col items-center gap-1.5 pb-1 border-b-2 transition-all cursor-pointer flex-shrink-0 select-none ${
                        isActive 
                          ? "border-black text-black font-semibold" 
                          : "border-transparent text-gray-500 hover:text-black hover:border-gray-200"
                      }`}
                    >
                      <Icon size={18} className={isActive ? "text-black" : "text-gray-400"} />
                      <span className="text-[11px] font-medium tracking-wide whitespace-nowrap">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* Filters Button */}
              <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 hover:border-black transition-colors cursor-pointer select-none text-[12px] font-semibold flex-shrink-0 h-9 bg-white shadow-sm">
                <SlidersHorizontal size={13} />
                <span>Filters</span>
              </button>

            </div>
          </div>
        )}

      </header>
    </>
  );
}
