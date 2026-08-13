from sqlalchemy.orm import Session
import models, schemas
import json

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(email=user.email, name=user.name, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_listings(db: Session, skip: int = 0, limit: int = 100, category: str = None):
    query = db.query(models.Listing)
    if category:
        query = query.filter(models.Listing.category == category)
    db_listings = query.offset(skip).limit(limit).all()
    return db_listings

def get_listing(db: Session, listing_id: int):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    return listing

def create_listing(db: Session, listing: schemas.ListingCreate, host_id: int):
    db_listing = models.Listing(
        title=listing.title,
        description=listing.description,
        price_per_night=listing.price_per_night,
        location=listing.location,
        latitude=listing.latitude,
        longitude=listing.longitude,
        category=listing.category,
        rating=listing.rating,
        is_guest_favorite=listing.is_guest_favorite,
        property_type=listing.property_type,
        max_guests=listing.max_guests,
        amenities=json.dumps(listing.amenities),
        photos=json.dumps(listing.photos),
        host_id=host_id
    )
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

def update_listing(db: Session, listing_id: int, listing: schemas.ListingUpdate):
    db_listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if db_listing:
        update_data = listing.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if key in ["amenities", "photos"]:
                setattr(db_listing, key, json.dumps(value))
            else:
                setattr(db_listing, key, value)
        db.commit()
        db.refresh(db_listing)
    return db_listing

def delete_listing(db: Session, listing_id: int):
    db_listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if db_listing:
        db.delete(db_listing)
        db.commit()
        return True
    return False

def check_booking_overlap(db: Session, listing_id: int, check_in, check_out):
    existing = db.query(models.Booking).filter(
        models.Booking.listing_id == listing_id,
        models.Booking.status == "CONFIRMED",
        models.Booking.check_in < check_out,
        models.Booking.check_out > check_in
    ).first()
    return existing is not None

def create_booking(db: Session, booking: schemas.BookingCreate, guest_id: int, total_price: float):
    db_booking = models.Booking(
        listing_id=booking.listing_id,
        guest_id=guest_id,
        check_in=booking.check_in,
        check_out=booking.check_out,
        total_price=total_price,
        status="CONFIRMED"
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_bookings_by_guest(db: Session, guest_id: int):
    return db.query(models.Booking).filter(models.Booking.guest_id == guest_id).all()

def get_bookings_by_listing(db: Session, listing_id: int):
    return db.query(models.Booking).filter(
        models.Booking.listing_id == listing_id,
        models.Booking.status == "CONFIRMED"
    ).all()

def get_bookings_by_host(db: Session, host_id: int):
    return db.query(models.Booking).join(models.Listing).filter(models.Listing.host_id == host_id).all()

def cancel_booking(db: Session, booking_id: int):
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if db_booking:
        db_booking.status = "CANCELLED"
        db.commit()
        db.refresh(db_booking)
        return db_booking
    return None

def create_review(db: Session, review: schemas.ReviewCreate, listing_id: int, user_id: int, user_name: str):
    from datetime import datetime
    db_review = models.Review(
        listing_id=listing_id,
        user_id=user_id,
        user_name=user_name,
        rating=review.rating,
        cleanliness_rating=review.cleanliness_rating or 5.0,
        accuracy_rating=review.accuracy_rating or 5.0,
        checkin_rating=review.checkin_rating or 5.0,
        communication_rating=review.communication_rating or 5.0,
        location_rating=review.location_rating or 5.0,
        value_rating=review.value_rating or 5.0,
        comment=review.comment,
        created_at=datetime.now().strftime("%B %Y")
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    # Recalculate listing rating
    reviews = db.query(models.Review).filter(models.Review.listing_id == listing_id).all()
    if reviews:
        avg_rating = round(sum(r.rating for r in reviews) / len(reviews), 2)
        listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
        if listing:
            listing.rating = avg_rating
            db.commit()

    return db_review

def get_reviews_by_listing(db: Session, listing_id: int):
    return db.query(models.Review).filter(models.Review.listing_id == listing_id).all()

