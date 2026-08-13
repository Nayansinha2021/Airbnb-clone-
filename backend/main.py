from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas, crud
from database import SessionLocal, engine

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Airbnb Clone API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to Airbnb Clone API"}

@app.post("/api/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/api/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/api/listings/", response_model=List[schemas.Listing])
def read_listings(skip: int = 0, limit: int = 100, category: str = None, db: Session = Depends(get_db)):
    listings = crud.get_listings(db, skip=skip, limit=limit, category=category)
    return listings

@app.post("/api/listings/", response_model=schemas.Listing)
def create_listing(listing: schemas.ListingCreate, host_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id=host_id)
    if not user or user.role != "HOST":
        raise HTTPException(status_code=403, detail="Only hosts can create listings")
    return crud.create_listing(db=db, listing=listing, host_id=host_id)

@app.get("/api/listings/{listing_id}", response_model=schemas.Listing)
def read_listing(listing_id: int, db: Session = Depends(get_db)):
    db_listing = crud.get_listing(db, listing_id=listing_id)
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return db_listing

@app.put("/api/listings/{listing_id}", response_model=schemas.Listing)
def update_listing(listing_id: int, listing: schemas.ListingUpdate, db: Session = Depends(get_db)):
    db_listing = crud.update_listing(db, listing_id, listing)
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return db_listing

@app.delete("/api/listings/{listing_id}")
def delete_listing(listing_id: int, db: Session = Depends(get_db)):
    success = crud.delete_listing(db, listing_id)
    if not success:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"message": "Listing deleted successfully"}

@app.post("/api/bookings/", response_model=schemas.Booking)
def create_booking(booking: schemas.BookingCreate, guest_id: int, db: Session = Depends(get_db)):
    # Validate listing exists
    listing = crud.get_listing(db, listing_id=booking.listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Simple validation for dates
    if booking.check_in >= booking.check_out:
        raise HTTPException(status_code=400, detail="Check-out must be after check-in")
    
    # Overlapping booking check
    if crud.check_booking_overlap(db, listing_id=booking.listing_id, check_in=booking.check_in, check_out=booking.check_out):
        raise HTTPException(status_code=400, detail="Selected dates overlap with an existing booking for this property.")
    
    # Calculate price
    nights = (booking.check_out - booking.check_in).days
    total_price = nights * listing.price_per_night
    
    return crud.create_booking(db=db, booking=booking, guest_id=guest_id, total_price=total_price)

@app.get("/api/bookings/my-trips/{guest_id}", response_model=List[schemas.Booking])
def read_guest_bookings(guest_id: int, db: Session = Depends(get_db)):
    return crud.get_bookings_by_guest(db, guest_id=guest_id)

@app.get("/api/bookings/host/{host_id}", response_model=List[schemas.Booking])
def read_host_bookings(host_id: int, db: Session = Depends(get_db)):
    return crud.get_bookings_by_host(db, host_id=host_id)

@app.get("/api/listings/{listing_id}/bookings", response_model=List[schemas.Booking])
def read_listing_bookings(listing_id: int, db: Session = Depends(get_db)):
    return crud.get_bookings_by_listing(db, listing_id=listing_id)

@app.delete("/api/bookings/{booking_id}", response_model=schemas.Booking)
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    cancelled = crud.cancel_booking(db, booking_id=booking_id)
    if not cancelled:
        raise HTTPException(status_code=404, detail="Booking not found")
    return cancelled

@app.get("/api/listings/{listing_id}/reviews", response_model=List[schemas.Review])
def read_listing_reviews(listing_id: int, db: Session = Depends(get_db)):
    return crud.get_reviews_by_listing(db, listing_id=listing_id)

@app.post("/api/listings/{listing_id}/reviews", response_model=schemas.Review)
def create_listing_review(listing_id: int, review: schemas.ReviewCreate, user_id: int, user_name: str, db: Session = Depends(get_db)):
    listing = crud.get_listing(db, listing_id=listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return crud.create_review(db=db, review=review, listing_id=listing_id, user_id=user_id, user_name=user_name)

