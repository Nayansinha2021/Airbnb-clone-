"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RealMap from "@/components/RealMap";
import { getMyTrips, cancelBooking, getListing } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, Trash2, ArrowRight } from "lucide-react";

export default function TripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [listingMap, setListingMap] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    if (user) {
      setLoading(true);
      const data = await getMyTrips(user.id);
      setTrips(data);

      const map: Record<number, any> = {};
      for (const t of data) {
        if (t.listing_id && !map[t.listing_id]) {
          try {
            const l = await getListing(String(t.listing_id));
            map[t.listing_id] = l;
          } catch(e) {}
        }
      }
      setListingMap(map);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [user]);

  const handleCancelTrip = async (bookingId: number) => {
    if (confirm("Are you sure you want to cancel this booking reservation?")) {
      try {
        await cancelBooking(bookingId);
        fetchTrips();
      } catch(e) {
        alert("Failed to cancel booking.");
      }
    }
  };

  // Convert trips listings into map markers
  const tripMarkers = trips.map((t) => {
    const l = listingMap[t.listing_id];
    return {
      id: t.id,
      title: l?.title || `Trip #${t.id}`,
      price: l?.price_per_night,
      lat: l?.latitude || 30.7333,
      lng: l?.longitude || 76.7794
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header startCollapsed={true} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 xl:px-10 py-8">
        
        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading your trips...</div>
        ) : trips.length > 0 ? (
          /* Booked Trips View (Split view with Cards + RealMap) */
          <div>
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
                <p className="text-sm text-gray-500 mt-1">Your upcoming and past reservations</p>
              </div>
              <Link 
                href="/"
                className="bg-[#E51D53] hover:bg-rose-600 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition shadow-sm"
              >
                Book another stay
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Trip Cards */}
              <div className="lg:col-span-7 space-y-6">
                {trips.map((trip) => {
                  const listing = listingMap[trip.listing_id];
                  const photo = listing?.photos?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80";
                  const title = listing?.title || `Listing #${trip.listing_id}`;
                  const location = listing?.location || "India";

                  return (
                    <div key={trip.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-sm hover:shadow-md transition">
                      <div className="sm:w-48 h-48 sm:h-auto bg-gray-200 relative flex-shrink-0">
                        <img src={photo} alt={title} className="w-full h-full object-cover" />
                        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${trip.status === 'CONFIRMED' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-white'}`}>
                          {trip.status}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-1">{title}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                            <MapPin size={12} /> {location}
                          </p>

                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs space-y-1.5 mb-3">
                            <div className="flex justify-between">
                              <span className="text-gray-500 font-medium">Check-in</span>
                              <span className="font-semibold text-gray-900">{format(new Date(trip.check_in), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 font-medium">Check-out</span>
                              <span className="font-semibold text-gray-900">{format(new Date(trip.check_out), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-gray-200">
                              <span className="text-gray-700 font-semibold">Total Paid</span>
                              <span className="font-bold text-sm text-gray-900">₹{trip.total_price}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                          <Link href={`/rooms/${trip.listing_id}`} className="font-semibold text-gray-900 underline hover:text-rose-600">
                            View property
                          </Link>
                          {trip.status === "CONFIRMED" && (
                            <button 
                              onClick={() => handleCancelTrip(trip.id)}
                              className="font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                            >
                              <Trash2 size={13} /> Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Real Map */}
              <div className="lg:col-span-5 h-[550px] sticky top-24 rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
                <RealMap center={[20.5937, 78.9629]} zoom={5} markers={tripMarkers} />
              </div>
            </div>
          </div>
        ) : (
          /* Empty Trips View (Matching Image 2 Airbnb Layout) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6">
            
            {/* Left Column: Heading, 3D Illustration & Call to Action */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Trips</h1>

              {/* 3D Isometric Travel Map Illustration */}
              <div className="w-64 sm:w-80 aspect-square my-2 flex items-center justify-center">
                <img 
                  src="/travel_map_illustration.png" 
                  alt="Map out your next trip" 
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 drop-shadow-md"
                />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Map out your next trip
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                  After you book a trip, experience or service, come back here to see details, explore the map and save places to visit.
                </p>
              </div>

              <Link 
                href="/"
                className="bg-[#E51D53] hover:bg-[#d8164b] text-white font-semibold px-8 py-3.5 rounded-xl text-base transition shadow-md inline-block"
              >
                Get started
              </Link>
            </div>

            {/* Right Column: Interactive Real Map (Matching Image 2) */}
            <div className="lg:col-span-7 h-[500px] sm:h-[580px] rounded-3xl overflow-hidden border border-gray-200 shadow-md relative">
              <RealMap center={[20.5937, 78.9629]} zoom={3} />
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
