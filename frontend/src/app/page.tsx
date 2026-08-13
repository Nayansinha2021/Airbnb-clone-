"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import ListingCard, { ListingProps } from "@/components/ListingCard";
import RealMap from "@/components/RealMap";

import Footer from "@/components/Footer";
import Link from "next/link";
import { getListings } from "@/lib/api";
import { 
  Map as MapIcon,
  List
} from "lucide-react";

export default function HomePage() {
  const [listings, setListings] = useState<ListingProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState({ location: '', guests: 1 });
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      const data = await getListings();
      
      // Filter by activeTab (All, Homes, Experiences, Services)
      let filtered = [...data];
      if (activeTab === 'Experiences' || activeTab === 'Services') {
        filtered = [];
      }
      
      // Filter by selectedCategory
      if (selectedCategory !== 'All' && filtered.length > 0) {
        filtered = filtered.filter(listing => {
          const categoryLower = selectedCategory.toLowerCase();
          return listing.category.toLowerCase() === categoryLower || 
                 listing.property_type.toLowerCase() === categoryLower;
        });
      }

      // Filter by searchQuery
      if (searchQuery.location.trim() !== '') {
        const q = searchQuery.location.toLowerCase();
        filtered = filtered.filter(l => 
          l.location.toLowerCase().includes(q) ||
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.property_type.toLowerCase().includes(q)
        );
      }
      
      setListings(filtered);
      setLoading(false);
    }
    fetchListings();
  }, [activeTab, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col pb-20 relative">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        showCategories={true}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onSearch={(params) => setSearchQuery(params)}
      />
      


      <main className="flex-1 w-full max-w-7xl mx-auto px-6 xl:px-10 py-6">

        {showMap ? (
          <div className="w-full h-[calc(100vh-220px)] bg-gray-100 rounded-2xl overflow-hidden relative shadow-inner">
            <RealMap 
              center={[30.7333, 76.7794]} 
              zoom={6} 
              markers={listings.map((l: any) => ({
                id: l.id,
                title: l.title,
                price: l.price_per_night,
                lat: l.latitude || (30.7 + (l.id % 10) * 0.08),
                lng: l.longitude || (76.8 + (l.id % 10) * 0.08)
              }))} 
            />
          </div>
        ) : (
          loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map((n) => (
                <div key={n} className="flex flex-col gap-3 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-[var(--radius-card)]"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            selectedCategory === 'All' ? (
              <div className="flex flex-col gap-12">
                {/* Section 1: Guest Favourites */}
                {listings.slice(0, 4).length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Guest favourites</h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">The most loved homes on Airbnb based on ratings and reliability</p>
                      </div>
                      <span className="text-sm font-semibold underline cursor-pointer hover:text-gray-600">Show all (4)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
                      {listings.slice(0, 4).map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Section 2: Popular Cabins & Country Stays */}
                {listings.slice(4, 8).length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Popular Cabins & Country Stays</h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">Cozy getaways nestled in scenic nature</p>
                      </div>
                      <span className="text-sm font-semibold underline cursor-pointer hover:text-gray-600">Show all (4)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
                      {listings.slice(4, 8).map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Section 3: Trending Design Homes */}
                {listings.slice(8).length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Trending Design Homes</h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">Architectural gems with unique interior styling</p>
                      </div>
                      <span className="text-sm font-semibold underline cursor-pointer hover:text-gray-600">Show all ({listings.slice(8).length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
                      {listings.slice(8).map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{selectedCategory}</h2>
                  <p className="text-sm text-[var(--color-text-secondary)]">Showing properties matching {selectedCategory}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </section>
            )
          ) : (
            <div className="text-center py-32">
              <h2 className="text-2xl font-semibold mb-2">No exact matches</h2>
              <p className="text-[var(--color-text-secondary)]">Try changing or removing some of your filters or adjusting your search area.</p>
            </div>
          )
        )}
      </main>

      {/* Floating Map Toggle Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
        <button 
          onClick={() => setShowMap(!showMap)}
          className="bg-gray-900 hover:bg-black text-white px-6 py-3.5 rounded-full shadow-lg flex items-center gap-2 font-semibold transition-transform hover:scale-105"
        >
          {showMap ? (
            <>
              <span>Show list</span>
              <List size={18} />
            </>
          ) : (
            <>
              <span>Show map</span>
              <MapIcon size={18} />
            </>
          )}
        </button>
      </div>

      <Footer />
    </div>
  );
}
