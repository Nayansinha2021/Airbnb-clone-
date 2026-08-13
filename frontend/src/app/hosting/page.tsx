"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import { getListings, createListing, updateListing, deleteListing, getHostBookings } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Calendar, DollarSign, Home } from "lucide-react";

export default function HostingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"listings" | "reservations">("listings");
  
  const [myListings, setMyListings] = useState<any[]>([]);
  const [hostBookings, setHostBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);

  // Form fields state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState(5000);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Amazing pools");
  const [propertyType, setPropertyType] = useState("Villa");
  const [maxGuests, setMaxGuests] = useState(4);
  const [photosUrl, setPhotosUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchHostData = async () => {
    if (user && user.role === "HOST") {
      setLoading(true);
      const allListings = await getListings();
      const userListings = allListings.filter((l: any) => l.host_id === user.id);
      setMyListings(userListings);

      const bookings = await getHostBookings(user.id);
      setHostBookings(bookings);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostData();
  }, [user]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPricePerNight(5000);
    setLocation("");
    setCategory("Amazing pools");
    setPropertyType("Villa");
    setMaxGuests(4);
    setPhotosUrl("");
    setEditingListing(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleOpenEdit = (listing: any) => {
    setEditingListing(listing);
    setTitle(listing.title);
    setDescription(listing.description);
    setPricePerNight(listing.price_per_night);
    setLocation(listing.location);
    setCategory(listing.category || "Amazing pools");
    setPropertyType(listing.property_type || "Villa");
    setMaxGuests(listing.max_guests || 4);
    setPhotosUrl(listing.photos ? listing.photos.join(", ") : "");
    setShowEditModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const photosList = photosUrl.trim() 
      ? photosUrl.split(",").map(s => s.trim()) 
      : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"];

    try {
      await createListing({
        title,
        description,
        price_per_night: Number(pricePerNight),
        location,
        category,
        property_type: propertyType,
        max_guests: Number(maxGuests),
        amenities: ["Wifi", "Kitchen", "Air conditioning", "Free parking", "TV"],
        photos: photosList
      }, user.id);

      setShowCreateModal(false);
      resetForm();
      fetchHostData();
    } catch(e) {
      alert("Failed to create listing.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;
    setSubmitting(true);

    const photosList = photosUrl.trim() 
      ? photosUrl.split(",").map(s => s.trim()) 
      : editingListing.photos;

    try {
      await updateListing(editingListing.id, {
        title,
        description,
        price_per_night: Number(pricePerNight),
        location,
        category,
        property_type: propertyType,
        max_guests: Number(maxGuests),
        photos: photosList
      });

      setShowEditModal(false);
      resetForm();
      fetchHostData();
    } catch(e) {
      alert("Failed to update listing.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteListing(id);
        setMyListings(myListings.filter(l => l.id !== id));
      } catch(e) {
        alert("Failed to delete listing");
      }
    }
  };

  if (!user || user.role !== "HOST") {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header startCollapsed={true} />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center flex-1 w-full">
          <h1 className="text-3xl font-bold mb-4">Host Dashboard</h1>
          <p className="text-gray-600 mb-6">You must be logged in as a Host to view this dashboard.</p>
          <p className="text-sm text-gray-500">Use the profile menu in the top right header to switch to a Host account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 bg-gray-50">
      <Header startCollapsed={true} />
      
      <main className="max-w-7xl mx-auto px-6 xl:px-10 py-10 w-full">
        
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your properties and guest reservations</p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-[#FF385C] text-white px-5 py-3 rounded-lg font-semibold hover:bg-rose-600 transition shadow-sm"
          >
            <Plus size={18} />
            Create new listing
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab("listings")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition ${activeTab === 'listings' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            <Home size={16} />
            Your Properties ({myListings.length})
          </button>
          <button 
            onClick={() => setActiveTab("reservations")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition ${activeTab === 'reservations' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            <Calendar size={16} />
            Guest Reservations ({hostBookings.length})
          </button>
        </div>
        
        {loading ? (
          <div className="text-lg py-12 text-center text-gray-500">Loading host data...</div>
        ) : activeTab === "listings" ? (
          myListings.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[12px] uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="p-4">Property</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Price / Night</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {myListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 flex items-center gap-4">
                        <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={listing.photos[0]} alt="thumbnail" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-semibold text-sm block text-gray-900">{listing.title}</span>
                          <span className="text-xs text-gray-500">{listing.property_type} · Max {listing.max_guests} guests</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-medium text-gray-600">{listing.category}</td>
                      <td className="p-4 text-xs text-gray-600">{listing.location}</td>
                      <td className="p-4 text-sm font-semibold text-gray-900">₹{listing.price_per_night}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Link href={`/rooms/${listing.id}`} className="text-xs font-semibold text-gray-700 hover:text-black flex items-center gap-1">
                            <Eye size={14} /> View
                          </Link>
                          <button onClick={() => handleOpenEdit(listing)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            <Edit size={14} /> Edit
                          </button>
                          <button onClick={() => handleDelete(listing.id)} className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">You don't have any listings yet</h2>
              <p className="text-gray-500 mb-6 text-sm">Create your first listing to start welcoming guests from around the world.</p>
              <button 
                onClick={handleOpenCreate}
                className="bg-[#FF385C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-600 transition shadow-sm text-sm"
              >
                Create your first listing
              </button>
            </div>
          )
        ) : (
          /* Host Guest Reservations Tab */
          hostBookings.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[12px] uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Property ID</th>
                    <th className="p-4">Check-In</th>
                    <th className="p-4">Check-Out</th>
                    <th className="p-4">Total Revenue</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {hostBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition text-sm">
                      <td className="p-4 font-mono font-bold">#{b.id}</td>
                      <td className="p-4 font-semibold text-gray-900">Listing #{b.listing_id}</td>
                      <td className="p-4 text-gray-600">{b.check_in}</td>
                      <td className="p-4 text-gray-600">{b.check_out}</td>
                      <td className="p-4 font-bold text-gray-900">₹{b.total_price}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold mb-2">No guest reservations yet</h2>
              <p className="text-gray-500 text-sm">When guests book your listings, their reservation details will appear here.</p>
            </div>
          )
        )}
      </main>

      {/* Create Listing Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create a new property listing">
        <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4 text-sm">
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input 
              type="text" 
              required
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Luxury Beachfront Villa in Goa"
              className="w-full p-2.5 border rounded-lg outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Price per night (₹)</label>
              <input 
                type="number" 
                required
                min={500}
                value={pricePerNight} 
                onChange={(e) => setPricePerNight(Number(e.target.value))}
                className="w-full p-2.5 border rounded-lg outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Max Guests</label>
              <input 
                type="number" 
                required
                min={1}
                value={maxGuests} 
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                className="w-full p-2.5 border rounded-lg outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 border rounded-lg outline-none focus:border-black bg-white"
              >
                {["Amazing pools", "Beachfront", "Cabins", "OMG!", "Lakefront", "Design", "Castles", "Farms"].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Property Type</label>
              <select 
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full p-2.5 border rounded-lg outline-none focus:border-black bg-white"
              >
                {["Villa", "House", "Apartment", "Cabin", "Cottage", "Resort", "Penthouse", "Castle"].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Location</label>
            <input 
              type="text" 
              required
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Candolim, Goa"
              className="w-full p-2.5 border rounded-lg outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea 
              rows={3}
              required
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your property, amenities, and surroundings..."
              className="w-full p-2.5 border rounded-lg outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Photo URLs (comma-separated)</label>
            <input 
              type="text" 
              value={photosUrl} 
              onChange={(e) => setPhotosUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..., https://..."
              className="w-full p-2.5 border rounded-lg outline-none focus:border-black text-xs"
            />
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="mt-2 bg-[#FF385C] hover:bg-rose-600 text-white font-semibold py-3 rounded-lg transition"
          >
            {submitting ? "Publishing listing..." : "Publish Listing"}
          </button>
        </form>
      </Modal>

      {/* Edit Listing Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit property details">
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 text-sm">
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input 
              type="text" 
              required
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border rounded-lg outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Price per night (₹)</label>
              <input 
                type="number" 
                required
                value={pricePerNight} 
                onChange={(e) => setPricePerNight(Number(e.target.value))}
                className="w-full p-2.5 border rounded-lg outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Max Guests</label>
              <input 
                type="number" 
                required
                value={maxGuests} 
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                className="w-full p-2.5 border rounded-lg outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Location</label>
            <input 
              type="text" 
              required
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 border rounded-lg outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea 
              rows={3}
              required
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border rounded-lg outline-none focus:border-black"
            />
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="mt-2 bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition"
          >
            {submitting ? "Saving changes..." : "Save Changes"}
          </button>
        </form>
      </Modal>

    </div>
  );
}
