import React, { useState, useRef, useEffect } from "react";
import { Search, Minus, Plus } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";

export default function SearchBar({ 
  onSearch 
}: { 
  onSearch?: (params: { location: string; guests: number }) => void;
}) {
  const [activeInput, setActiveInput] = useState<"where" | "when" | "who" | null>(null);
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    }
  ]);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setActiveInput(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalGuests = guests.adults + guests.children;
  const isDatesSelected = dateRange[0].startDate !== dateRange[0].endDate;

  const handleLocationChange = (val: string) => {
    setLocation(val);
    onSearch?.({ location: val, guests: totalGuests });
  };

  const handleGuestChange = (newGuests: { adults: number; children: number; infants: number }) => {
    setGuests(newGuests);
    const newTotal = newGuests.adults + newGuests.children;
    onSearch?.({ location, guests: newTotal });
  };

  const handleSearch = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    setActiveInput(null);
    onSearch?.({ location, guests: totalGuests });
  };

  return (
    <div className="relative w-full z-50" ref={searchRef}>
      {/* Pill Search Container */}
      <div className="flex items-center bg-white border border-gray-200 rounded-full h-[66px] shadow-[0_3px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_3px_16px_rgba(0,0,0,0.12)] transition-shadow duration-200 cursor-pointer">
        
        {/* Where Section */}
        <div 
          onClick={() => setActiveInput("where")}
          className={`flex flex-col justify-center rounded-full px-8 h-full flex-[1.2] transition-colors duration-150 ${activeInput === "where" ? "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]" : "hover:bg-gray-100"}`}
        >
          <span className="text-[12px] font-extrabold text-black tracking-wide">Where</span>
          <input 
            type="text" 
            placeholder="Search destinations" 
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(e); }}
            className="text-[14px] bg-transparent outline-none truncate w-full placeholder-gray-500 font-medium text-black mt-0.5" 
          />
        </div>

        <div className="h-8 w-[1px] bg-gray-200 self-center"></div>

        {/* When Section */}
        <div 
          onClick={() => setActiveInput("when")}
          className={`flex flex-col justify-center rounded-full px-8 h-full flex-1 transition-colors duration-150 ${activeInput === "when" ? "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]" : "hover:bg-gray-100"}`}
        >
          <span className="text-[12px] font-extrabold text-black tracking-wide">When</span>
          <span className={`text-[14px] font-medium mt-0.5 ${isDatesSelected ? "text-black" : "text-gray-500"}`}>
            {isDatesSelected 
              ? `${format(dateRange[0].startDate, "MMM dd")} – ${format(dateRange[0].endDate, "MMM dd")}` 
              : "Add dates"}
          </span>
        </div>

        <div className="h-8 w-[1px] bg-gray-200 self-center"></div>

        {/* Who Section */}
        <div 
          onClick={() => setActiveInput("who")}
          className={`flex items-center justify-between rounded-full pl-8 pr-2 h-full flex-[1.2] transition-colors duration-150 ${activeInput === "who" ? "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]" : "hover:bg-gray-100"}`}
        >
          <div className="flex flex-col justify-center">
            <span className="text-[12px] font-extrabold text-black tracking-wide">Who</span>
            <span className={`text-[14px] font-medium mt-0.5 ${totalGuests > 0 ? "text-black" : "text-gray-500"}`}>
              {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? "s" : ""}` : "Add guests"}
            </span>
          </div>

          {/* Search Circular Button */}
          <button 
            onClick={handleSearch}
            className="w-12 h-12 rounded-full bg-[#FF385C] text-white flex items-center justify-center hover:bg-rose-600 transition-colors duration-150 shadow-sm ml-2 flex-shrink-0 cursor-pointer"
          >
            <Search size={18} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Date Picker Overlay */}
      {activeInput === "when" && (
        <div className="absolute top-[80px] left-1/2 -translate-x-1/2 bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.15)] p-6 border border-gray-100 z-50">
          <DateRange
            editableDateInputs={true}
            onChange={(item: any) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            months={2}
            direction="horizontal"
            rangeColors={["#222222"]}
            showDateDisplay={false}
          />
        </div>
      )}

      {/* Guest Dropdown Overlay */}
      {activeInput === "who" && (
        <div className="absolute top-[80px] right-0 bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.15)] p-6 border border-gray-100 w-[380px] z-50">
          {/* Adults */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
              <div className="font-semibold text-[15px] text-black">Adults</div>
              <div className="text-[13px] text-gray-500">Ages 13 or above</div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleGuestChange({...guests, adults: Math.max(1, guests.adults - 1)})}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition-colors"
              >
                <Minus size={14}/>
              </button>
              <span className="w-4 text-center font-medium text-black">{guests.adults}</span>
              <button 
                onClick={() => handleGuestChange({...guests, adults: guests.adults + 1})}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition-colors"
              >
                <Plus size={14}/>
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
              <div className="font-semibold text-[15px] text-black">Children</div>
              <div className="text-[13px] text-gray-500">Ages 2-12</div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleGuestChange({...guests, children: Math.max(0, guests.children - 1)})}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 disabled:opacity-30 transition-colors"
                disabled={guests.children === 0}
              >
                <Minus size={14}/>
              </button>
              <span className="w-4 text-center font-medium text-black">{guests.children}</span>
              <button 
                onClick={() => handleGuestChange({...guests, children: guests.children + 1})}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition-colors"
              >
                <Plus size={14}/>
              </button>
            </div>
          </div>

          {/* Infants */}
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-semibold text-[15px] text-black">Infants</div>
              <div className="text-[13px] text-gray-500">Under 2</div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleGuestChange({...guests, infants: Math.max(0, guests.infants - 1)})}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 disabled:opacity-30 transition-colors"
                disabled={guests.infants === 0}
              >
                <Minus size={14}/>
              </button>
              <span className="w-4 text-center font-medium text-black">{guests.infants}</span>
              <button 
                onClick={() => handleGuestChange({...guests, infants: guests.infants + 1})}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition-colors"
              >
                <Plus size={14}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
