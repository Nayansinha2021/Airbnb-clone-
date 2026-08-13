import json
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import schemas
import crud

models.Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()
    
    # Wipe existing for fresh seed
    db.query(models.Booking).delete()
    db.query(models.Listing).delete()
    db.query(models.User).delete()
    db.commit()
        
    print("Seeding database...")
    
    # 1. Create a host
    host = schemas.UserCreate(email="host@example.com", name="Super Host", role="HOST")
    db_host = crud.create_user(db, host)
    
    # 2. Create a guest
    guest = schemas.UserCreate(email="guest@example.com", name="Happy Guest", role="GUEST")
    db_guest = crud.create_user(db, guest)
    
    # 3. 32 listings across 8 categories (4 items per category)
    all_listings = [
        # --- AMAZING POOLS (4 items) ---
        {
            "title": "Luxury Pool Estate in Panchkula",
            "desc": "High-end villa featuring a private heated infinity pool, sun deck, outdoor bar, and lush garden views.",
            "price": 15800,
            "place": "Panchkula, Haryana",
            "cat": "Amazing pools",
            "rating": 4.97,
            "badge": True,
            "prop_type": "Villa",
            "max_g": 8,
            "img": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
        },
        {
            "title": "Chandigarh Modern Villa & Pool",
            "desc": "A beautiful, spacious home in Chandigarh featuring a sunken lounge next to an azure lap pool.",
            "price": 10499,
            "place": "Chandigarh, India",
            "cat": "Amazing pools",
            "rating": 4.95,
            "badge": True,
            "prop_type": "Home",
            "max_g": 4,
            "img": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
        },
        {
            "title": "Tropical Pool Haven in Candolim",
            "desc": "Serene private pool villa surrounded by tropical palms, outdoor dining, and luxury loungers.",
            "price": 14200,
            "place": "Candolim, Goa",
            "cat": "Amazing pools",
            "rating": 4.92,
            "badge": True,
            "prop_type": "Villa",
            "max_g": 6,
            "img": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80"
        },
        {
            "title": "Hilltop Resort & Infinity Pool",
            "desc": "Perched high on Morni Hills with panoramic mountain views from a cliffside glass infinity pool.",
            "price": 12500,
            "place": "Morni Hills",
            "cat": "Amazing pools",
            "rating": 4.98,
            "badge": True,
            "prop_type": "Resort",
            "max_g": 4,
            "img": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
        },

        # --- BEACHFRONT (4 items) ---
        {
            "title": "Coastal Sunset Villa in Goa",
            "desc": "Steps away from white sandy beaches with private ocean access, outdoor shower, and hammock terrace.",
            "price": 9800,
            "place": "Anjuna, Goa",
            "cat": "Beachfront",
            "rating": 4.91,
            "badge": True,
            "prop_type": "Villa",
            "max_g": 5,
            "img": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80"
        },
        {
            "title": "Oceanfront Glass Cottage",
            "desc": "Wake up to breaking waves in this panoramic beachfront glass-walled cottage.",
            "price": 13500,
            "place": "Morjim, Goa",
            "cat": "Beachfront",
            "rating": 4.96,
            "badge": True,
            "prop_type": "Cottage",
            "max_g": 4,
            "img": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
        },
        {
            "title": "Seaside Haven Bungalow",
            "desc": "Charming wooden beachfront bungalow featuring sunset views and private beach loungers.",
            "price": 8900,
            "place": "Palolem, Goa",
            "cat": "Beachfront",
            "rating": 4.88,
            "badge": False,
            "prop_type": "Bungalow",
            "max_g": 3,
            "img": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"
        },
        {
            "title": "Palms & Tide Penthouse",
            "desc": "Luxury top-floor beach retreat with floor-to-ceiling balcony overlooking the Arabian Sea.",
            "price": 11200,
            "place": "Benaulim, Goa",
            "cat": "Beachfront",
            "rating": 4.94,
            "badge": True,
            "prop_type": "Penthouse",
            "max_g": 4,
            "img": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
        },

        # --- CABINS (4 items) ---
        {
            "title": "Alpine Wooden A-Frame Cabin",
            "desc": "Cozy triangular wooden A-frame cabin surrounded by deep pine woods. Features fire pit and deck.",
            "price": 5108,
            "place": "Morni Hills",
            "cat": "Cabins",
            "rating": 5.0,
            "badge": True,
            "prop_type": "Cabin",
            "max_g": 2,
            "img": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80"
        },
        {
            "title": "Rustic Red-Brick Cottage",
            "desc": "Beautiful rustic red-brick cottage with a sprawling lawn and outdoor fire pit. Perfect getaway.",
            "price": 9757,
            "place": "Morni Hills",
            "cat": "Cabins",
            "rating": 4.95,
            "badge": True,
            "prop_type": "Cottage",
            "max_g": 4,
            "img": "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80"
        },
        {
            "title": "Hilltop Valley View Cabin",
            "desc": "Charming hilltop cabin with panoramic deck overlooking the valley. Features fully equipped kitchen.",
            "price": 7189,
            "place": "Morni Hills",
            "cat": "Cabins",
            "rating": 4.88,
            "badge": False,
            "prop_type": "Cabin",
            "max_g": 4,
            "img": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
        },
        {
            "title": "Pine Forest Log Lodge",
            "desc": "Handcrafted cedar log cabin nestled in thick evergreen forest with wood-burning fireplace.",
            "price": 6400,
            "place": "Solan, Himachal Pradesh",
            "cat": "Cabins",
            "rating": 4.93,
            "badge": True,
            "prop_type": "Lodge",
            "max_g": 4,
            "img": "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80"
        },

        # --- OMG! (4 items) ---
        {
            "title": "Futuristic Glass Geodesic Dome",
            "desc": "Transparent stargazing dome with 360-degree mountain views, heated jacuzzi, and smart controls.",
            "price": 18500,
            "place": "Manali, Himachal Pradesh",
            "cat": "OMG!",
            "rating": 4.99,
            "badge": True,
            "prop_type": "Dome",
            "max_g": 2,
            "img": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80"
        },
        {
            "title": "Floating Mirror Cube Treehouse",
            "desc": "Architectural masterpiece wrapped in reflective glass, floating high among pine canopy.",
            "price": 21000,
            "place": "Jibhi, Himachal Pradesh",
            "cat": "OMG!",
            "rating": 4.97,
            "badge": True,
            "prop_type": "Treehouse",
            "max_g": 3,
            "img": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
        },
        {
            "title": "Subterranean Cave Villa",
            "desc": "Sculpted stone cave dwelling featuring indoor thermal pool, skylights, and organic earthen walls.",
            "price": 19800,
            "place": "Udaipur, Rajasthan",
            "cat": "OMG!",
            "rating": 4.95,
            "badge": True,
            "prop_type": "Villa",
            "max_g": 4,
            "img": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
        },
        {
            "title": "Organic Shell Beach House",
            "desc": "Curved Nautilus-inspired white shell structure right on the coast with spiral interior stairways.",
            "price": 22500,
            "place": "Gokarna, Karnataka",
            "cat": "OMG!",
            "rating": 4.94,
            "badge": True,
            "prop_type": "House",
            "max_g": 4,
            "img": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
        },

        # --- LAKEFRONT (4 items) ---
        {
            "title": "Sukhna Lake View Residence",
            "desc": "Peaceful residence overlooking Sukhna Lake, featuring private balcony, kayaks, and morning mist views.",
            "price": 8600,
            "place": "Chandigarh, India",
            "cat": "Lakefront",
            "rating": 4.90,
            "badge": True,
            "prop_type": "House",
            "max_g": 4,
            "img": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80"
        },
        {
            "title": "Serene Lakefront Villa & Dock",
            "desc": "Waterfront estate with private wooden pier, rowboat, outdoor fire pit, and panoramic water vistas.",
            "price": 11400,
            "place": "Bhimtal, Uttarakhand",
            "cat": "Lakefront",
            "rating": 4.96,
            "badge": True,
            "prop_type": "Villa",
            "max_g": 6,
            "img": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
        },
        {
            "title": "Lakeside Timber Chalet",
            "desc": "Rustic timber chalet right at the lake edge with floor-to-ceiling windows and wood-burning stove.",
            "price": 9200,
            "place": "Nainital, Uttarakhand",
            "cat": "Lakefront",
            "rating": 4.89,
            "badge": False,
            "prop_type": "Chalet",
            "max_g": 4,
            "img": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
        },
        {
            "title": "Pichola Palace Lake Suite",
            "desc": "Palatial lakefront suite looking directly out over Lake Pichola with traditional Rajasthani balconies.",
            "price": 16500,
            "place": "Udaipur, Rajasthan",
            "cat": "Lakefront",
            "rating": 4.98,
            "badge": True,
            "prop_type": "Suite",
            "max_g": 2,
            "img": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
        },

        # --- DESIGN (4 items) ---
        {
            "title": "Minimalist Penthouse in Panchkula",
            "desc": "Light-filled penthouse with floor-to-ceiling glass and private terrace overlooking Shivalik hills.",
            "price": 7800,
            "place": "Panchkula, Haryana",
            "cat": "Design",
            "rating": 4.89,
            "badge": False,
            "prop_type": "Penthouse",
            "max_g": 4,
            "img": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
        },
        {
            "title": "Elegant Mountain Flat in Dharmpur",
            "desc": "Elegant mountain flat featuring scenic sunset views from the terrace balcony. Modern heating & desk.",
            "price": 8185,
            "place": "Dharmpur, Himachal Pradesh",
            "cat": "Design",
            "rating": 5.0,
            "badge": True,
            "prop_type": "Flat",
            "max_g": 3,
            "img": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
        },
        {
            "title": "Sector 10 Heritage Architect Villa",
            "desc": "Classic Chandigarh heritage villa with high ceilings, brutalist concrete accents, and inner courtyards.",
            "price": 12000,
            "place": "Chandigarh, India",
            "cat": "Design",
            "rating": 4.96,
            "badge": True,
            "prop_type": "Villa",
            "max_g": 6,
            "img": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
        },
        {
            "title": "Panchkula Art District Home",
            "desc": "Modern clean interior home in Panchkula. Featuring curated art pieces, warm wooden details, and comfy bedrooms.",
            "price": 8730,
            "place": "Panchkula, Haryana",
            "cat": "Design",
            "rating": 5.0,
            "badge": True,
            "prop_type": "Home",
            "max_g": 4,
            "img": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80"
        },

        # --- CASTLES (4 items) ---
        {
            "title": "Royal Heritage Fort Castle",
            "desc": "Stay in a 400-year-old restored fort castle featuring grand arches, stone courtyards, and royal dining.",
            "price": 25000,
            "place": "Jaipur, Rajasthan",
            "cat": "Castles",
            "rating": 4.99,
            "badge": True,
            "prop_type": "Castle",
            "max_g": 6,
            "img": "https://images.unsplash.com/photo-1585128792020-803d29415281?w=800&q=80"
        },
        {
            "title": "Historic Stone Palace Estate",
            "desc": "Majestic palace castle with turrets, manicured gardens, peacock grounds, and antique furnishings.",
            "price": 28500,
            "place": "Jodhpur, Rajasthan",
            "cat": "Castles",
            "rating": 4.97,
            "badge": True,
            "prop_type": "Palace",
            "max_g": 8,
            "img": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
        },
        {
            "title": "Medieval Hilltop Fortress Tower",
            "desc": "Private castle tower suite atop a rocky ridge offering breathtaking panoramic sunset views.",
            "price": 22000,
            "place": "Neemrana, Rajasthan",
            "cat": "Castles",
            "rating": 4.93,
            "badge": True,
            "prop_type": "Castle",
            "max_g": 4,
            "img": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
        },
        {
            "title": "Regal Heritage Citadel",
            "desc": "Opulent castle estate with marble columns, rooftop banquet dining, and royal heritage service.",
            "price": 26800,
            "place": "Udaipur, Rajasthan",
            "cat": "Castles",
            "rating": 4.98,
            "badge": True,
            "prop_type": "Castle",
            "max_g": 6,
            "img": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
        },

        # --- FARMS (4 items) ---
        {
            "title": "Organic Countryside Farmstay",
            "desc": "Peaceful organic farm in Panchkula with fresh dairy, fruit orchards, tractor rides, and open fields.",
            "price": 6500,
            "place": "Panchkula, Haryana",
            "cat": "Farms",
            "rating": 4.92,
            "badge": True,
            "prop_type": "Farmstay",
            "max_g": 5,
            "img": "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80"
        },
        {
            "title": "Sunflower Valley Farm Villa",
            "desc": "Charming villa situated amidst blooming sunflower fields with farm-to-table breakfast included.",
            "price": 7200,
            "place": "Kasauli, Himachal Pradesh",
            "cat": "Farms",
            "rating": 4.88,
            "badge": False,
            "prop_type": "Farmstay",
            "max_g": 4,
            "img": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
        },
        {
            "title": "Heritage Ranch & Apple Orchard",
            "desc": "Sprawling apple orchard farm in the hills featuring cozy wooden cottages and bonfire nights.",
            "price": 8400,
            "place": "Shimla, Himachal Pradesh",
            "cat": "Farms",
            "rating": 4.96,
            "badge": True,
            "prop_type": "Ranch",
            "max_g": 6,
            "img": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80"
        },
        {
            "title": "Rustic Farmhouse & Stables",
            "desc": "Authentic countryside farmhouse with friendly horses, organic herb garden, and outdoor brick oven.",
            "price": 9100,
            "place": "Chandigarh Suburbs",
            "cat": "Farms",
            "rating": 4.91,
            "badge": True,
            "prop_type": "Farmhouse",
            "max_g": 6,
            "img": "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80"
        }
    ]

    for idx, d in enumerate(all_listings):
        listing = schemas.ListingCreate(
            title=d["title"],
            description=d["desc"],
            price_per_night=d["price"],
            location=d["place"],
            latitude=30.7 + idx * 0.02,
            longitude=76.8 + idx * 0.02,
            category=d["cat"],
            rating=d["rating"],
            is_guest_favorite=d["badge"],
            property_type=d["prop_type"],
            max_guests=d["max_g"],
            amenities=["Wifi", "Kitchen", "Air conditioning", "TV", "Dedicated workspace", "Free parking"],
            photos=[
                d["img"],
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070"
            ]
        )
        db_listing = crud.create_listing(db, listing, host_id=db_host.id)

        # Create sample reviews for first 5 listings
        if idx < 5:
            crud.create_review(
                db, 
                schemas.ReviewCreate(
                    rating=5.0,
                    cleanliness_rating=5.0,
                    accuracy_rating=5.0,
                    checkin_rating=5.0,
                    communication_rating=4.9,
                    location_rating=5.0,
                    value_rating=4.8,
                    comment="We had a wonderful stay! The property was exceptionally clean, well-maintained, and exactly as described. Highly recommended for families and peaceful staycations."
                ),
                listing_id=db_listing.id,
                user_id=db_guest.id,
                user_name="Anurag Sharma"
            )
            crud.create_review(
                db, 
                schemas.ReviewCreate(
                    rating=4.9,
                    cleanliness_rating=4.9,
                    accuracy_rating=5.0,
                    checkin_rating=5.0,
                    communication_rating=5.0,
                    location_rating=4.8,
                    value_rating=4.9,
                    comment="One of the best stays I've ever had! The host was super friendly and responsive. Everything was stocked and pristine."
                ),
                listing_id=db_listing.id,
                user_id=db_guest.id,
                user_name="Diya Patel"
            )

    # Create 1 sample booking
    from datetime import date, timedelta
    sample_booking = schemas.BookingCreate(
        listing_id=1,
        check_in=date.today() + timedelta(days=5),
        check_out=date.today() + timedelta(days=9),
        guests=2
    )
    crud.create_booking(db, sample_booking, guest_id=db_guest.id, total_price=15800 * 4)

    print("Database seeding completed successfully with 32 listings, reviews, and sample booking.")
    db.close()

if __name__ == "__main__":
    seed_db()

