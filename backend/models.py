from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text, Date
from sqlalchemy.orm import relationship
from database import Base
import json

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(String, default="GUEST")  # 'GUEST' or 'HOST'

    listings = relationship("Listing", back_populates="host")
    bookings = relationship("Booking", back_populates="guest")
    reviews = relationship("Review", back_populates="user")

class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, index=True)
    description = Column(Text)
    price_per_night = Column(Float)
    location = Column(String, index=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    category = Column(String, index=True, default="Amazing pools")
    rating = Column(Float, nullable=True)
    is_guest_favorite = Column(Boolean, default=False)
    property_type = Column(String)
    max_guests = Column(Integer)
    amenities = Column(Text)  # Stored as JSON string
    photos = Column(Text)     # Stored as JSON string of URLs

    host = relationship("User", back_populates="listings")
    bookings = relationship("Booking", back_populates="listing")
    reviews = relationship("Review", back_populates="listing")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"))
    guest_id = Column(Integer, ForeignKey("users.id"))
    check_in = Column(Date)
    check_out = Column(Date)
    total_price = Column(Float)
    status = Column(String, default="CONFIRMED") # 'CONFIRMED', 'CANCELLED'

    listing = relationship("Listing", back_populates="bookings")
    guest = relationship("User", back_populates="bookings")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    user_name = Column(String)
    rating = Column(Float)
    cleanliness_rating = Column(Float, default=5.0)
    accuracy_rating = Column(Float, default=5.0)
    checkin_rating = Column(Float, default=5.0)
    communication_rating = Column(Float, default=5.0)
    location_rating = Column(Float, default=5.0)
    value_rating = Column(Float, default=5.0)
    comment = Column(Text)
    created_at = Column(String)

    listing = relationship("Listing", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

