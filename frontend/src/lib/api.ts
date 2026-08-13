import axios from 'axios';
import { ListingProps } from '@/components/ListingCard';

const API_URL = 'http://localhost:8000/api';

const MOCK_LISTINGS: ListingProps[] = [
  // --- AMAZING POOLS (4 items) ---
  {
    id: 1,
    title: "Luxury Pool Estate in Panchkula",
    description: "High-end villa featuring a private heated infinity pool, sun deck, outdoor bar, and lush garden views.",
    price_per_night: 15800,
    location: "Panchkula, Haryana",
    category: "Amazing pools",
    rating: 4.97,
    isGuestFavorite: true,
    property_type: "Villa",
    photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80"]
  },
  {
    id: 2,
    title: "Chandigarh Modern Villa & Pool",
    description: "A beautiful, spacious home in Chandigarh featuring a sunken lounge next to an azure lap pool.",
    price_per_night: 10499,
    location: "Chandigarh, India",
    category: "Amazing pools",
    rating: 4.95,
    isGuestFavorite: true,
    property_type: "Home",
    photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"]
  },
  {
    id: 3,
    title: "Tropical Pool Haven in Candolim",
    description: "Serene private pool villa surrounded by tropical palms, outdoor dining, and luxury loungers.",
    price_per_night: 14200,
    location: "Candolim, Goa",
    category: "Amazing pools",
    rating: 4.92,
    isGuestFavorite: true,
    property_type: "Villa",
    photos: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"]
  },
  {
    id: 4,
    title: "Hilltop Resort & Infinity Pool",
    description: "Perched high on Morni Hills with panoramic mountain views from a cliffside glass infinity pool.",
    price_per_night: 12500,
    location: "Morni Hills",
    category: "Amazing pools",
    rating: 4.98,
    isGuestFavorite: true,
    property_type: "Resort",
    photos: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"]
  },

  // --- BEACHFRONT (4 items) ---
  {
    id: 5,
    title: "Coastal Sunset Villa in Goa",
    description: "Steps away from white sandy beaches with private ocean access, outdoor shower, and hammock terrace.",
    price_per_night: 9800,
    location: "Anjuna, Goa",
    category: "Beachfront",
    rating: 4.91,
    isGuestFavorite: true,
    property_type: "Villa",
    photos: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80"]
  },
  {
    id: 6,
    title: "Oceanfront Glass Cottage",
    description: "Wake up to breaking waves in this panoramic beachfront glass-walled cottage.",
    price_per_night: 13500,
    location: "Morjim, Goa",
    category: "Beachfront",
    rating: 4.96,
    isGuestFavorite: true,
    property_type: "Cottage",
    photos: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"]
  },
  {
    id: 7,
    title: "Seaside Haven Bungalow",
    description: "Charming wooden beachfront bungalow featuring sunset views and private beach loungers.",
    price_per_night: 8900,
    location: "Palolem, Goa",
    category: "Beachfront",
    rating: 4.88,
    isGuestFavorite: false,
    property_type: "Bungalow",
    photos: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"]
  },
  {
    id: 8,
    title: "Palms & Tide Penthouse",
    description: "Luxury top-floor beach retreat with floor-to-ceiling balcony overlooking the Arabian Sea.",
    price_per_night: 11200,
    location: "Benaulim, Goa",
    category: "Beachfront",
    rating: 4.94,
    isGuestFavorite: true,
    property_type: "Penthouse",
    photos: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"]
  },

  // --- CABINS (4 items) ---
  {
    id: 9,
    title: "Alpine Wooden A-Frame Cabin",
    description: "Cozy triangular wooden A-frame cabin surrounded by deep pine woods. Features fire pit and deck.",
    price_per_night: 5108,
    location: "Morni Hills",
    category: "Cabins",
    rating: 5.0,
    isGuestFavorite: true,
    property_type: "Cabin",
    photos: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80"]
  },
  {
    id: 10,
    title: "Rustic Red-Brick Cottage",
    description: "Beautiful rustic red-brick cottage with a sprawling lawn and outdoor fire pit. Perfect getaway.",
    price_per_night: 9757,
    location: "Morni Hills",
    category: "Cabins",
    rating: 4.95,
    isGuestFavorite: true,
    property_type: "Cottage",
    photos: ["https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80"]
  },
  {
    id: 11,
    title: "Hilltop Valley View Cabin",
    description: "Charming hilltop cabin with panoramic deck overlooking the valley. Features fully equipped kitchen.",
    price_per_night: 7189,
    location: "Morni Hills",
    category: "Cabins",
    rating: 4.88,
    isGuestFavorite: false,
    property_type: "Cabin",
    photos: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"]
  },
  {
    id: 12,
    title: "Pine Forest Log Lodge",
    description: "Handcrafted cedar log cabin nestled in thick evergreen forest with wood-burning fireplace.",
    price_per_night: 6400,
    location: "Solan, Himachal Pradesh",
    category: "Cabins",
    rating: 4.93,
    isGuestFavorite: true,
    property_type: "Lodge",
    photos: ["https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80"]
  },

  // --- OMG! (4 items) ---
  {
    id: 13,
    title: "Futuristic Glass Geodesic Dome",
    description: "Transparent stargazing dome with 360-degree mountain views, heated jacuzzi, and smart controls.",
    price_per_night: 18500,
    location: "Manali, Himachal Pradesh",
    category: "OMG!",
    rating: 4.99,
    isGuestFavorite: true,
    property_type: "Dome",
    photos: ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80"]
  },
  {
    id: 14,
    title: "Floating Mirror Cube Treehouse",
    description: "Architectural masterpiece wrapped in reflective glass, floating high among pine canopy.",
    price_per_night: 21000,
    location: "Jibhi, Himachal Pradesh",
    category: "OMG!",
    rating: 4.97,
    isGuestFavorite: true,
    property_type: "Treehouse",
    photos: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"]
  },
  {
    id: 15,
    title: "Subterranean Cave Villa",
    description: "Sculpted stone cave dwelling featuring indoor thermal pool, skylights, and organic earthen walls.",
    price_per_night: 19800,
    location: "Udaipur, Rajasthan",
    category: "OMG!",
    rating: 4.95,
    isGuestFavorite: true,
    property_type: "Villa",
    photos: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"]
  },
  {
    id: 16,
    title: "Organic Shell Beach House",
    description: "Curved Nautilus-inspired white shell structure right on the coast with spiral interior stairways.",
    price_per_night: 22500,
    location: "Gokarna, Karnataka",
    category: "OMG!",
    rating: 4.94,
    isGuestFavorite: true,
    property_type: "House",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"]
  },

  // --- LAKEFRONT (4 items) ---
  {
    id: 17,
    title: "Sukhna Lake View Residence",
    description: "Peaceful residence overlooking Sukhna Lake, featuring private balcony, kayaks, and morning mist views.",
    price_per_night: 8600,
    location: "Chandigarh, India",
    category: "Lakefront",
    rating: 4.90,
    isGuestFavorite: true,
    property_type: "House",
    photos: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80"]
  },
  {
    id: 18,
    title: "Serene Lakefront Villa & Dock",
    description: "Waterfront estate with private wooden pier, rowboat, outdoor fire pit, and panoramic water vistas.",
    price_per_night: 11400,
    location: "Bhimtal, Uttarakhand",
    category: "Lakefront",
    rating: 4.96,
    isGuestFavorite: true,
    property_type: "Villa",
    photos: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"]
  },
  {
    id: 19,
    title: "Lakeside Timber Chalet",
    description: "Rustic timber chalet right at the lake edge with floor-to-ceiling windows and wood-burning stove.",
    price_per_night: 9200,
    location: "Nainital, Uttarakhand",
    category: "Lakefront",
    rating: 4.89,
    isGuestFavorite: false,
    property_type: "Chalet",
    photos: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"]
  },
  {
    id: 20,
    title: "Pichola Palace Lake Suite",
    description: "Palatial lakefront suite looking directly out over Lake Pichola with traditional Rajasthani balconies.",
    price_per_night: 16500,
    location: "Udaipur, Rajasthan",
    category: "Lakefront",
    rating: 4.98,
    isGuestFavorite: true,
    property_type: "Suite",
    photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"]
  },

  // --- DESIGN (4 items) ---
  {
    id: 21,
    title: "Minimalist Penthouse in Panchkula",
    description: "Light-filled penthouse with floor-to-ceiling glass and private terrace overlooking Shivalik hills.",
    price_per_night: 7800,
    location: "Panchkula, Haryana",
    category: "Design",
    rating: 4.89,
    isGuestFavorite: false,
    property_type: "Penthouse",
    photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"]
  },
  {
    id: 22,
    title: "Elegant Mountain Flat in Dharmpur",
    description: "Elegant mountain flat featuring scenic sunset views from the terrace balcony. Modern heating & desk.",
    price_per_night: 8185,
    location: "Dharmpur, Himachal Pradesh",
    category: "Design",
    rating: 5.0,
    isGuestFavorite: true,
    property_type: "Flat",
    photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"]
  },
  {
    id: 23,
    title: "Sector 10 Heritage Architect Villa",
    description: "Classic Chandigarh heritage villa with high ceilings, brutalist concrete accents, and inner courtyards.",
    price_per_night: 12000,
    location: "Chandigarh, India",
    category: "Design",
    rating: 4.96,
    isGuestFavorite: true,
    property_type: "Villa",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"]
  },
  {
    id: 24,
    title: "Panchkula Art District Home",
    description: "Modern clean interior home in Panchkula. Featuring curated art pieces, warm wooden details, and comfy bedrooms.",
    price_per_night: 8730,
    location: "Panchkula, Haryana",
    category: "Design",
    rating: 5.0,
    isGuestFavorite: true,
    property_type: "Home",
    photos: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80"]
  },

  // --- CASTLES (4 items) ---
  {
    id: 25,
    title: "Royal Heritage Fort Castle",
    description: "Stay in a 400-year-old restored fort castle featuring grand arches, stone courtyards, and royal dining.",
    price_per_night: 25000,
    location: "Jaipur, Rajasthan",
    category: "Castles",
    rating: 4.99,
    isGuestFavorite: true,
    property_type: "Castle",
    photos: ["https://images.unsplash.com/photo-1585128792020-803d29415281?w=800&q=80"]
  },
  {
    id: 26,
    title: "Historic Stone Palace Estate",
    description: "Majestic palace castle with turrets, manicured gardens, peacock grounds, and antique furnishings.",
    price_per_night: 28500,
    location: "Jodhpur, Rajasthan",
    category: "Castles",
    rating: 4.97,
    isGuestFavorite: true,
    property_type: "Palace",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"]
  },
  {
    id: 27,
    title: "Medieval Hilltop Fortress Tower",
    description: "Private castle tower suite atop a rocky ridge offering breathtaking panoramic sunset views.",
    price_per_night: 22000,
    location: "Neemrana, Rajasthan",
    category: "Castles",
    rating: 4.93,
    isGuestFavorite: true,
    property_type: "Castle",
    photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"]
  },
  {
    id: 28,
    title: "Regal Heritage Citadel",
    description: "Opulent castle estate with marble columns, rooftop banquet dining, and royal heritage service.",
    price_per_night: 26800,
    location: "Udaipur, Rajasthan",
    category: "Castles",
    rating: 4.98,
    isGuestFavorite: true,
    property_type: "Castle",
    photos: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"]
  },

  // --- FARMS (4 items) ---
  {
    id: 29,
    title: "Organic Countryside Farmstay",
    description: "Peaceful organic farm in Panchkula with fresh dairy, fruit orchards, tractor rides, and open fields.",
    price_per_night: 6500,
    location: "Panchkula, Haryana",
    category: "Farms",
    rating: 4.92,
    isGuestFavorite: true,
    property_type: "Farmstay",
    photos: ["https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80"]
  },
  {
    id: 30,
    title: "Sunflower Valley Farm Villa",
    description: "Charming villa situated amidst blooming sunflower fields with farm-to-table breakfast included.",
    price_per_night: 7200,
    location: "Kasauli, Himachal Pradesh",
    category: "Farms",
    rating: 4.88,
    isGuestFavorite: false,
    property_type: "Farmstay",
    photos: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"]
  },
  {
    id: 31,
    title: "Heritage Ranch & Apple Orchard",
    description: "Sprawling apple orchard farm in the hills featuring cozy wooden cottages and bonfire nights.",
    price_per_night: 8400,
    location: "Shimla, Himachal Pradesh",
    category: "Farms",
    rating: 4.96,
    isGuestFavorite: true,
    property_type: "Ranch",
    photos: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80"]
  },
  {
    id: 32,
    title: "Rustic Farmhouse & Stables",
    description: "Authentic countryside farmhouse with friendly horses, organic herb garden, and outdoor brick oven.",
    price_per_night: 9100,
    location: "Chandigarh Suburbs",
    category: "Farms",
    rating: 4.91,
    isGuestFavorite: true,
    property_type: "Farmhouse",
    photos: ["https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80"]
  }
];

export const getListings = async (): Promise<ListingProps[]> => {
  try {
    const response = await axios.get(`${API_URL}/listings/`, { timeout: 3000 });
    if (response.data && response.data.length > 0) {
      return response.data;
    }
    return MOCK_LISTINGS;
  } catch (error) {
    console.warn('Backend API unreachable, using fallback mock listings:', error);
    return MOCK_LISTINGS;
  }
};

export const getListing = async (id: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/listings/${id}`, { timeout: 3000 });
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.warn(`Backend API unreachable for listing ${id}, returning fallback listing.`);
  }
  
  const numericId = Number(id);
  const found = MOCK_LISTINGS.find(l => l.id === numericId) || MOCK_LISTINGS[0];
  return {
    ...found,
    max_guests: 4,
    amenities: ["Wifi", "Kitchen", "Air conditioning", "Dedicated workspace", "Free parking"],
    photos: [
      found.photos[0],
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80"
    ]
  };
};

export const createBooking = async (bookingData: any, guestId: number) => {
  try {
    const response = await axios.post(`${API_URL}/bookings/?guest_id=${guestId}`, bookingData, { timeout: 3000 });
    return response.data;
  } catch (error) {
    console.warn('Backend API error on booking, simulating successful booking:', error);
    return {
      id: Date.now(),
      listing_id: bookingData.listing_id,
      guest_id: guestId,
      check_in: bookingData.check_in,
      check_out: bookingData.check_out,
      total_price: 15000,
      status: "CONFIRMED"
    };
  }
};

export const getMyTrips = async (guestId: number) => {
  try {
    const response = await axios.get(`${API_URL}/bookings/my-trips/${guestId}`, { timeout: 3000 });
    return response.data;
  } catch (error) {
    console.warn('Backend API unreachable for trips, using fallback data:', error);
    return [];
  }
};

export const createListing = async (listingData: any, hostId: number) => {
  try {
    const response = await axios.post(`${API_URL}/listings/?host_id=${hostId}`, listingData);
    return response.data;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

export const updateListing = async (listingId: number, listingData: any) => {
  try {
    const response = await axios.put(`${API_URL}/listings/${listingId}`, listingData);
    return response.data;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

export const deleteListing = async (listingId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/listings/${listingId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

export const getListingBookings = async (listingId: number) => {
  try {
    const response = await axios.get(`${API_URL}/listings/${listingId}/bookings`);
    return response.data;
  } catch (error) {
    console.warn('Backend API error getting listing bookings:', error);
    return [];
  }
};

export const getHostBookings = async (hostId: number) => {
  try {
    const response = await axios.get(`${API_URL}/bookings/host/${hostId}`);
    return response.data;
  } catch (error) {
    console.warn('Backend API error getting host bookings:', error);
    return [];
  }
};

export const cancelBooking = async (bookingId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

export const getListingReviews = async (listingId: number) => {
  try {
    const response = await axios.get(`${API_URL}/listings/${listingId}/reviews`);
    return response.data;
  } catch (error) {
    console.warn('Backend API error getting reviews:', error);
    return [];
  }
};

export const createListingReview = async (listingId: number, reviewData: any, userId: number, userName: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/listings/${listingId}/reviews?user_id=${userId}&user_name=${encodeURIComponent(userName)}`,
      reviewData
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

