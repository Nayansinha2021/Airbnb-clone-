"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingCard, { ListingProps } from "@/components/ListingCard";
import { getListings } from "@/lib/api";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";

export default function WishlistsPage() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [allListings, setAllListings] = useState<ListingProps[]>([]);
  const [savedListings, setSavedListings] = useState<ListingProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<"all" | "recently">("all");

  useEffect(() => {
    async function loadWishlist() {
      setLoading(true);
      const data = await getListings();
      setAllListings(data);

      try {
        const saved = localStorage.getItem("airbnb_wishlist");
        if (saved) {
          const ids: number[] = JSON.parse(saved);
          setFavoriteIds(ids);
          const filtered = data.filter((l) => ids.includes(l.id));
          setSavedListings(filtered.length > 0 ? filtered : data.slice(0, 3));
        } else {
          // Default to first 3 items if empty so page looks lush
          setFavoriteIds([1, 2, 5]);
          setSavedListings(data.slice(0, 3));
        }
      } catch (e) {
        setSavedListings(data.slice(0, 3));
      }
      setLoading(false);
    }
    loadWishlist();
  }, []);

  const collagePhotos = savedListings.map(l => l.photos[0]).slice(0, 4);
  while (collagePhotos.length < 4) {
    collagePhotos.push("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80");
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header startCollapsed={true} />

      <main className="max-w-7xl mx-auto px-6 xl:px-10 py-10 flex-1 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Wishlists</h1>
          <button 
            onClick={() => alert("Create new wishlist collection modal coming soon!")}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-xl text-sm font-semibold hover:border-black transition shadow-sm"
          >
            <Plus size={16} /> Create wishlist
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading your wishlists...</div>
        ) : (
          <div className="space-y-12">
            
            {/* Collage Folder Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              
              {/* Recently Viewed Collage Card (Matching Airbnb Screenshot) */}
              <div 
                onClick={() => setActiveCategory("recently")}
                className="group cursor-pointer flex flex-col gap-3"
              >
                <div className="aspect-square bg-gray-200 rounded-3xl overflow-hidden p-1 gap-1 grid grid-cols-2 grid-rows-2 border border-gray-200 group-hover:shadow-lg transition-all shadow-sm">
                  {collagePhotos.map((img, i) => (
                    <div key={i} className="w-full h-full relative overflow-hidden bg-gray-300 rounded-2xl">
                      <img 
                        src={img} 
                        alt={`Wishlist preview ${i+1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-base text-gray-900 group-hover:underline">Recently viewed</h3>
                  <p className="text-xs text-gray-500">{savedListings.length} {savedListings.length === 1 ? 'stay' : 'stays'} saved · Yesterday</p>
                </div>
              </div>

              {/* Summer Favorites Card */}
              <div 
                onClick={() => setActiveCategory("all")}
                className="group cursor-pointer flex flex-col gap-3"
              >
                <div className="aspect-square bg-gray-200 rounded-3xl overflow-hidden p-1 gap-1 grid grid-cols-2 grid-rows-2 border border-gray-200 group-hover:shadow-lg transition-all shadow-sm">
                  {allListings.slice(4, 8).map((l, i) => (
                    <div key={i} className="w-full h-full relative overflow-hidden bg-gray-300 rounded-2xl">
                      <img 
                        src={l.photos[0]} 
                        alt="Wishlist preview" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-base text-gray-900 group-hover:underline">Summer Getaways</h3>
                  <p className="text-xs text-gray-500">4 stays saved · 3 days ago</p>
                </div>
              </div>

            </div>

            {/* Saved Properties Grid Section */}
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Saved Properties ({savedListings.length})
              </h2>

              {savedListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {savedListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-gray-50 rounded-2xl border border-gray-200">
                  <Heart size={36} className="mx-auto text-rose-500 mb-3" />
                  <h3 className="font-semibold text-lg text-gray-900">Your wishlist is empty</h3>
                  <p className="text-sm text-gray-500 mb-6 mt-1">As you search, tap the heart icon on any stay to save your favorite properties here.</p>
                  <Link href="/" className="inline-block bg-black text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition">
                    Start exploring stays
                  </Link>
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
