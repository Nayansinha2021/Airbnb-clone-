import React, { useState } from "react";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export interface ListingProps {
  id: number;
  title: string;
  location: string;
  price_per_night: number;
  photos: string[];
  rating?: number;
  isGuestFavorite?: boolean;
  property_type: string;
  description: string;
  category: string;
}

export default function ListingCard({ listing }: { listing: ListingProps }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('airbnb_wishlist');
      if (saved) {
        const list = JSON.parse(saved);
        if (list.includes(listing.id)) {
          setIsFavorite(true);
        }
      }
    } catch(e) {}
  }, [listing.id]);

  // Generate random stable mock data if not provided
  const rating = listing.rating || (4.5 + (listing.id % 5) * 0.1).toFixed(2);
  const isGuestFav = listing.isGuestFavorite ?? (listing.id % 3 === 0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImage((prev) => (prev + 1) % Math.max(1, listing.photos?.length || 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImage((prev) => (prev === 0 ? Math.max(0, (listing.photos?.length || 1) - 1) : prev - 1));
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextState = !isFavorite;
    setIsFavorite(nextState);
    try {
      const saved = localStorage.getItem('airbnb_wishlist');
      let list = saved ? JSON.parse(saved) : [];
      if (nextState) {
        if (!list.includes(listing.id)) list.push(listing.id);
      } else {
        list = list.filter((id: number) => id !== listing.id);
      }
      localStorage.setItem('airbnb_wishlist', JSON.stringify(list));
    } catch(e) {}
  };


  const photos = listing.photos?.length > 0 ? listing.photos : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80"];

  return (
    <Link href={`/rooms/${listing.id}`} className="group flex flex-col gap-3 relative">
      {/* Image Gallery Container */}
      <div 
        className="relative aspect-square overflow-hidden rounded-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Sliding images wrapper */}
        <div 
          className="flex h-full w-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {photos.map((photo, i) => (
            <img
              key={i}
              src={photo}
              alt={`${listing.title} - photo ${i+1}`}
              className="h-full w-full flex-shrink-0 object-cover"
            />
          ))}
        </div>

        {/* Guest Favorite Badge */}
        {isGuestFav && (
          <span className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-md text-gray-900 z-10">
            Guest favourite
          </span>
        )}

        {/* Favorite Button */}
        <button 
          onClick={toggleFavorite}
          className="absolute top-3 right-3 transition-transform hover:scale-110 active:scale-95 z-10"
        >
          <Heart 
            size={24} 
            className={clsx(
              "drop-shadow-md",
              isFavorite ? "fill-[#FF385C] text-[#FF385C]" : "fill-black/30 text-white border-white stroke-2"
            )}
          />
        </button>

        {/* Carousel Controls */}
        {isHovered && photos.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none z-10">
            <button 
              onClick={prevImage}
              className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow-md pointer-events-auto hover:bg-white hover:scale-105 transition-transform ${currentImage === 0 ? 'opacity-0' : 'opacity-100'}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={nextImage}
              className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow-md pointer-events-auto hover:bg-white hover:scale-105 transition-transform ${currentImage === photos.length - 1 ? 'opacity-0' : 'opacity-100'}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
        
        {/* Carousel Dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {photos.map((_, i) => (
              <div 
                key={i} 
                className={clsx(
                  "h-1.5 rounded-full bg-white transition-all duration-300", 
                  i === currentImage ? "w-2 opacity-100" : "w-1.5 opacity-60"
                )} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-[15px] truncate pr-4 text-gray-900">{listing.location}</h3>
          <div className="flex items-center gap-1 text-[15px] text-gray-900">
            <Star size={14} className="fill-current" />
            <span>{rating}</span>
          </div>
        </div>
        <p className="text-[15px] text-gray-500 truncate">
          {listing.title}
        </p>
        <p className="text-[15px] text-gray-500">
          Added recently
        </p>
        <div className="mt-1 flex items-center gap-1 text-[15px]">
          <span className="font-semibold text-gray-900">₹{listing.price_per_night}</span>
          <span className="text-gray-900">night</span>
        </div>
      </div>
    </Link>
  );
}
