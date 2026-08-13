from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date
import json

class UserBase(BaseModel):
    email: str
    name: str
    role: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class ListingBase(BaseModel):
    title: str
    description: str
    price_per_night: float
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    category: str = "Amazing pools"
    rating: Optional[float] = None
    is_guest_favorite: bool = False
    property_type: str
    max_guests: int
    amenities: List[str]
    photos: List[str]

class ListingCreate(ListingBase):
    pass

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price_per_night: Optional[float] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    category: Optional[str] = None
    rating: Optional[float] = None
    is_guest_favorite: Optional[bool] = None
    property_type: Optional[str] = None
    max_guests: Optional[int] = None
    amenities: Optional[List[str]] = None
    photos: Optional[List[str]] = None

from pydantic import BaseModel, Field, model_validator

class Listing(ListingBase):
    id: int
    host_id: int
    
    @model_validator(mode='before')
    @classmethod
    def parse_json_fields(cls, data):
        if hasattr(data, 'amenities') and isinstance(data.amenities, str):
            setattr(data, 'amenities', json.loads(data.amenities))
        elif isinstance(data, dict) and isinstance(data.get('amenities'), str):
            data['amenities'] = json.loads(data['amenities'])
            
        if hasattr(data, 'photos') and isinstance(data.photos, str):
            setattr(data, 'photos', json.loads(data.photos))
        elif isinstance(data, dict) and isinstance(data.get('photos'), str):
            data['photos'] = json.loads(data['photos'])
        return data

    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    listing_id: int
    check_in: date
    check_out: date
    guests: int

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: int
    guest_id: int
    total_price: float
    status: str
    listing: Optional[Listing] = None

    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    rating: float
    cleanliness_rating: Optional[float] = 5.0
    accuracy_rating: Optional[float] = 5.0
    checkin_rating: Optional[float] = 5.0
    communication_rating: Optional[float] = 5.0
    location_rating: Optional[float] = 5.0
    value_rating: Optional[float] = 5.0
    comment: str

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int
    listing_id: int
    user_id: int
    user_name: str
    created_at: str

    class Config:
        from_attributes = True

