"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
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

      // Fetch listing details for each trip
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

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header startCollapsed={true} />
        <div className="max-w-7xl mx-auto px-6 py-16 flex-1 w-full">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Trips</h1>
          <hr className="mb-6 border-gray-200" />
          <h2 className="text-xl font-semibold mb-2 text-gray-900">No trips booked...yet!</h2>
          <p className="text-gray-600 mb-6 text-sm">Please log in to view your booked trips or start planning your next stay.</p>
          <Link href="/" className="inline-block border border-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition text-sm">
            Start searching
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 bg-gray-50">
      <Header startCollapsed={true} />
      
      <main className="max-w-7xl mx-auto px-6 xl:px-10 py-10 w-full">
        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Booked Trips</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your upcoming and past stay reservations</p>
          </div>
          <Link 
            href="/"
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
          >
            Explore more stays <ArrowRight size={16} />
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading your trips...</div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => {
              const listing = listingMap[trip.listing_id];
              const photo = listing?.photos?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80";
              const title = listing?.title || `Listing #${trip.listing_id}`;
              const location = listing?.location || "India";

              return (
                <div key={trip.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition">
                  <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                    <img src={photo} alt={title} className="w-full h-full object-cover" />
                    <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md ${trip.status === 'CONFIRMED' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-white'}`}>
                      {trip.status}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">{title}</h2>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mb-4">
                        <MapPin size={12} /> {location}
                      </p>
                      
                      <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700 flex items-center gap-1">
                            <Calendar size={12} /> Dates
                          </span>
                          <span>
                            {format(new Date(trip.check_in), "MMM d")} - {format(new Date(trip.check_out), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                          <span className="font-semibold text-gray-700">Total Price</span>
                          <span className="font-bold text-sm text-gray-900">₹{trip.total_price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <Link href={`/rooms/${trip.listing_id}`} className="text-xs font-semibold text-gray-900 underline hover:text-rose-600 transition">
                        View Property
                      </Link>
                      {trip.status === "CONFIRMED" && (
                        <button 
                          onClick={() => handleCancelTrip(trip.id)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition"
                        >
                          <Trash2 size={13} /> Cancel Trip
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">No trips booked...yet!</h2>
            <p className="text-gray-500 mb-6 text-sm">Time to dust off your bags and start planning your next adventure.</p>
            <Link href="/" className="inline-block bg-[#FF385C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-600 transition text-sm shadow-sm">
              Explore stays
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
