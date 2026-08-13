"use client";

import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import RealMap from "@/components/RealMap";
import { getListing, createBooking, getListingBookings, getListingReviews, createListingReview } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
  Star, Medal, ChevronLeft, Utensils, Wifi, Monitor, Car, 
  Snowflake, ShieldAlert, BellRing, Tag, Flag, 
  Key, MessageSquare, Map, Check, SprayCan, MapPin, X
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { format, differenceInCalendarDays, parseISO } from "date-fns";

export default function ListingDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookedRanges, setBookedRanges] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [bookingError, setBookingError] = useState("");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const reservationCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchListingData() {
      const data = await getListing(id);
      setListing(data);
      
      const bookings = await getListingBookings(Number(id));
      setBookedRanges(bookings);

      const listingReviews = await getListingReviews(Number(id));
      setReviews(listingReviews);

      setLoading(false);
    }
    fetchListingData();
  }, [id]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (reservationCardRef.current) {
            const rect = reservationCardRef.current.getBoundingClientRect();
            setShowStickyHeader(rect.bottom < 0);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate pricing breakdown
  let nights = 0;
  if (checkIn && checkOut) {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diff = differenceInCalendarDays(d2, d1);
      if (diff > 0) nights = diff;
    } catch(e) {}
  }

  const basePrice = listing ? listing.price_per_night * nights : 0;
  const cleaningFee = listing && nights > 0 ? Math.round(listing.price_per_night * 0.12) : 0;
  const serviceFee = listing && nights > 0 ? Math.round(listing.price_per_night * 0.14) : 0;
  const totalPrice = basePrice + cleaningFee + serviceFee;

  const handleOpenCheckout = () => {
    setBookingError("");
    if (!user) {
      alert("Please login first using the top-right profile menu to book.");
      return;
    }
    if (!checkIn || !checkOut || nights <= 0) {
      alert("Please select valid check-in and check-out dates.");
      return;
    }

    // Client-side overlap check
    const newIn = new Date(checkIn).getTime();
    const newOut = new Date(checkOut).getTime();
    for (const b of bookedRanges) {
      const bIn = new Date(b.check_in).getTime();
      const bOut = new Date(b.check_out).getTime();
      if (newIn < bOut && newOut > bIn) {
        setBookingError("Selected dates overlap with an existing reservation. Please choose different dates.");
        return;
      }
    }

    setShowCheckoutModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!user) return;
    setBookingStatus("loading");
    setBookingError("");
    try {
      await createBooking({
        listing_id: Number(id),
        check_in: checkIn,
        check_out: checkOut,
        guests: guests
      }, user.id);
      setBookingStatus("success");
      setTimeout(() => {
        setShowCheckoutModal(false);
        router.push("/trips");
      }, 1500);
    } catch (error: any) {
      setBookingStatus("error");
      const msg = error?.response?.data?.detail || "Failed to complete booking. Please check date availability.";
      setBookingError(msg);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to write a review.");
      return;
    }
    if (!reviewComment.trim()) return;

    setReviewSubmitting(true);
    try {
      const newRev = await createListingReview(
        Number(id),
        { rating: reviewRating, comment: reviewComment },
        user.id,
        user.name
      );
      setReviews([newRev, ...reviews]);
      setShowReviewModal(false);
      setReviewComment("");
    } catch(e) {
      alert("Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-32 text-center text-xl">Loading property details...</div>;
  }

  if (!listing) {
    return <div className="min-h-screen pt-32 text-center text-xl">Listing not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 relative bg-white">
      <Header startCollapsed={true} />

      {/* Sticky Sub-Header */}
      <div 
        className={`fixed top-[70px] left-0 right-0 bg-white border-b border-[var(--color-border-subtle)] z-40 transition-transform duration-300 ${showStickyHeader ? 'translate-y-0 shadow-sm' : '-translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div className="max-w-7xl mx-auto px-6 xl:px-10 h-20 flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium text-[var(--color-text-primary)]">
            <a href="#photos" className="hover:underline">Photos</a>
            <a href="#amenities" className="hover:underline">Amenities</a>
            <a href="#reviews" className="hover:underline">Reviews</a>
            <a href="#location" className="hover:underline">Location</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="font-semibold text-[15px]">₹{listing.price_per_night} night</span>
              <div className="flex items-center gap-1 text-[13px] text-[var(--color-text-secondary)]">
                <Star size={12} className="fill-[var(--color-text-primary)] text-[var(--color-text-primary)]" />
                <span className="font-semibold text-[var(--color-text-primary)]">{listing.rating || 4.95}</span>
                <span>·</span>
                <a href="#reviews" className="underline">{reviews.length || 19} reviews</a>
              </div>
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Check availability
            </button>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-6 xl:px-10 py-6 w-full">
        {/* Title Section */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 hover:bg-[var(--color-surface-muted)] p-2 -ml-2 rounded-lg transition">
            <ChevronLeft size={16} />
            <span className="font-semibold text-sm underline decoration-gray-300">Back</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-[var(--color-text-primary)]">
            {listing.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--color-text-primary)] font-medium">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-[var(--color-text-primary)]" />
              <span>{listing.rating || 4.95}</span>
              <span className="underline cursor-pointer">{reviews.length || 19} reviews</span>
            </div>
            <div className="flex items-center gap-1">
              <Medal size={14} />
              <span>Superhost</span>
            </div>
            <div className="flex items-center gap-1 underline cursor-pointer">
              {listing.location}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div id="photos" className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-10 h-[400px] md:h-[500px]">
          <div className="w-full h-full relative group cursor-pointer">
            <img 
              src={listing.photos[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80"} 
              alt="Main" 
              className="w-full h-full object-cover group-hover:brightness-90 transition"
            />
          </div>
          <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative group cursor-pointer h-full">
                <img 
                  src={listing.photos[i % listing.photos.length] || listing.photos[0]} 
                  alt="Gallery" 
                  className="w-full h-full object-cover group-hover:brightness-90 transition"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-20 relative">
          
          {/* Main Info */}
          <div className="flex-1 lg:w-2/3 flex flex-col">
            <div className="flex justify-between items-start border-b border-[var(--color-border-subtle)] pb-8 mb-8">
              <div>
                <h2 className="text-[22px] font-semibold text-[var(--color-text-primary)]">Entire {listing.property_type.toLowerCase()} hosted by Host</h2>
                <div className="flex gap-1 mt-1 text-[var(--color-text-primary)] text-[16px]">
                  <span>{listing.max_guests} guests</span>
                  <span>·</span>
                  <span>{Math.ceil(listing.max_guests/2)} bedrooms</span>
                  <span>·</span>
                  <span>2 baths</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-rose-500 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold text-xl">
                H
              </div>
            </div>

            <div className="border-b border-[var(--color-border-subtle)] pb-8 mb-8">
              <p className="text-[16px] leading-relaxed text-[var(--color-text-primary)]">
                {listing.description}
                <br /><br />
                Features a spacious living area with plush seating, curated decor, indoor plants, and a tranquil terrace. Two well-appointed bedrooms with premium bedding and work desks make it ideal for families, workcations, and longer stays.
              </p>
            </div>

            <div id="amenities" className="border-b border-[var(--color-border-subtle)] pb-10 mb-8">
              <h2 className="text-[22px] font-semibold mb-6">What this place offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                <div className="flex items-center gap-4 text-[16px] text-[var(--color-text-primary)] pb-2">
                  <Utensils size={24} strokeWidth={1.5} /> <span>Kitchen</span>
                </div>
                <div className="flex items-center gap-4 text-[16px] text-[var(--color-text-primary)] pb-2">
                  <Wifi size={24} strokeWidth={1.5} /> <span>Wifi</span>
                </div>
                <div className="flex items-center gap-4 text-[16px] text-[var(--color-text-primary)] pb-2">
                  <Monitor size={24} strokeWidth={1.5} /> <span>Dedicated workspace</span>
                </div>
                <div className="flex items-center gap-4 text-[16px] text-[var(--color-text-primary)] pb-2">
                  <Car size={24} strokeWidth={1.5} /> <span>Free parking on premises</span>
                </div>
                <div className="flex items-center gap-4 text-[16px] text-[var(--color-text-primary)] pb-2">
                  <Snowflake size={24} strokeWidth={1.5} /> <span>Air conditioning</span>
                </div>
              </div>
            </div>

            {/* Booked Dates Status */}
            {bookedRanges.length > 0 && (
              <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <h3 className="font-semibold text-amber-900 text-sm mb-1">Currently Reserved Dates</h3>
                <ul className="text-xs text-amber-800 space-y-1">
                  {bookedRanges.map((b: any, idx: number) => (
                    <li key={idx}>
                      • {b.check_in} to {b.check_out} (Unavailable)
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Reservation Card Container */}
          <div className="lg:w-1/3 relative">
            <div ref={reservationCardRef} className="sticky top-32 flex flex-col gap-6">
              
              {/* Main Reservation Card */}
              <div className="bg-white border border-[var(--color-border-subtle)] rounded-2xl shadow-xl p-6">
                <div className="flex items-baseline justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold">₹{listing.price_per_night}</span>
                    <span className="text-gray-500 font-normal"> / night</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Star size={14} className="fill-current" />
                    <span>{listing.rating || 4.95}</span>
                  </div>
                </div>

                {/* Error Banner */}
                {bookingError && (
                  <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center justify-between">
                    <span>{bookingError}</span>
                    <button onClick={() => setBookingError("")}><X size={14}/></button>
                  </div>
                )}

                <div className="border border-gray-400 rounded-xl mb-4 overflow-hidden focus-within:border-black focus-within:ring-1 focus-within:ring-black">
                  <div className="flex border-b border-gray-400">
                    <div className="p-3 w-1/2 border-r border-gray-400 cursor-text hover:bg-gray-50">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700">Check-in</label>
                      <input 
                        type="date" 
                        value={checkIn}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full text-xs outline-none bg-transparent"
                      />
                    </div>
                    <div className="p-3 w-1/2 cursor-text hover:bg-gray-50">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700">Checkout</label>
                      <input 
                        type="date"
                        value={checkOut}
                        min={checkIn || new Date().toISOString().split("T")[0]}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full text-xs outline-none bg-transparent"
                      />
                    </div>
                  </div>
                  <div className="p-3 cursor-pointer hover:bg-gray-50">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700">Guests</label>
                    <select 
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full text-sm outline-none bg-transparent cursor-pointer appearance-none"
                    >
                      {[...Array(listing.max_guests || 4)].map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1} guest{i !== 0 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price Breakdown */}
                {nights > 0 && (
                  <div className="space-y-3 my-4 text-sm text-gray-600 border-t border-b border-gray-100 py-4">
                    <div className="flex justify-between">
                      <span className="underline">₹{listing.price_per_night} x {nights} nights</span>
                      <span>₹{basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="underline">Cleaning fee</span>
                      <span>₹{cleaningFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="underline">Airbnb service fee</span>
                      <span>₹{serviceFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t">
                      <span>Total before taxes</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleOpenCheckout}
                  className="w-full py-3.5 rounded-lg text-white font-semibold text-[16px] transition bg-[#e51d53] hover:bg-[#d8164b] shadow-md"
                >
                  {nights > 0 ? "Reserve" : "Check availability"}
                </button>
                <p className="text-center text-xs text-gray-500 mt-3">You won't be charged yet</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <hr className="border-[var(--color-border-subtle)] my-10" />

      {/* Reviews & Guest Favorite Section */}
      <section id="reviews" className="max-w-7xl mx-auto px-6 xl:px-10 pb-12 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Star className="fill-black" size={24} />
              <span>{listing.rating || 4.95} · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
            </h2>
          </div>
          {user && (
            <button 
              onClick={() => setShowReviewModal(true)}
              className="border border-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
            >
              Write a review
            </button>
          )}
        </div>

        {/* Reviews Grid */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
            {reviews.map((rev: any, i: number) => (
              <div key={i} className="flex flex-col">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {rev.user_name ? rev.user_name.charAt(0) : "G"}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{rev.user_name}</div>
                    <div className="text-xs text-gray-500">{rev.created_at || "Recent"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={12} className={s < Math.floor(rev.rating) ? "fill-black text-black" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet for this listing.</p>
        )}
      </section>

      <hr className="border-[var(--color-border-subtle)] my-6" />

      {/* Location / Map Section */}
      <section id="location" className="max-w-7xl mx-auto px-6 xl:px-10 pb-16 w-full">
        <h2 className="text-[22px] font-semibold mb-1">Where you'll be</h2>
        <p className="text-sm text-gray-500 mb-6">{listing.location || "Chandigarh, India"}</p>
        <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative">
          <RealMap 
            center={[listing.latitude || 30.7333, listing.longitude || 76.7794]} 
            zoom={13} 
            markers={[{
              id: listing.id,
              title: listing.title,
              lat: listing.latitude || 30.7333,
              lng: listing.longitude || 76.7794
            }]} 
          />
        </div>
      </section>

      {/* Checkout Modal */}
      <Modal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} title="Confirm and pay">
        <div className="flex flex-col gap-6">
          <div className="flex gap-4 border-b pb-4">
            <img src={listing.photos[0]} alt="Property" className="w-24 h-20 object-cover rounded-lg" />
            <div>
              <h4 className="font-semibold text-base">{listing.title}</h4>
              <p className="text-xs text-gray-500">{listing.location}</p>
              <p className="text-xs font-medium mt-1">★ {listing.rating || 4.95}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm border-b pb-4">
            <h4 className="font-semibold text-base">Your trip</h4>
            <div className="flex justify-between">
              <span className="font-medium">Dates</span>
              <span>{checkIn} to {checkOut} ({nights} nights)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Guests</span>
              <span>{guests} guest{guests > 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="space-y-2 text-sm border-b pb-4">
            <h4 className="font-semibold text-base">Price details</h4>
            <div className="flex justify-between text-gray-600">
              <span>₹{listing.price_per_night} x {nights} nights</span>
              <span>₹{basePrice}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Cleaning fee</span>
              <span>₹{cleaningFee}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Airbnb service fee</span>
              <span>₹{serviceFee}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 text-gray-900 border-t">
              <span>Total (INR)</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Mock Payment Method</p>
            <p className="text-xs text-gray-600">Visa ending in 4242 (Mocked Checkout)</p>
          </div>

          {bookingError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {bookingError}
            </div>
          )}

          <button 
            onClick={handleConfirmBooking}
            disabled={bookingStatus === "loading"}
            className="w-full bg-[#e51d53] hover:bg-[#d8164b] text-white py-3.5 rounded-lg font-semibold transition"
          >
            {bookingStatus === "loading" ? "Processing Booking..." : `Confirm & Pay ₹${totalPrice}`}
          </button>
        </div>
      </Modal>

      {/* Write a Review Modal */}
      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Write a review">
        <form onSubmit={handleAddReview} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star size={24} className={star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Your Feedback</label>
            <textarea 
              rows={4}
              required
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Describe your stay experience..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-black"
            />
          </div>
          <button 
            type="submit"
            disabled={reviewSubmitting}
            className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {reviewSubmitting ? "Submitting..." : "Post Review"}
          </button>
        </form>
      </Modal>

    </div>
  );
}
