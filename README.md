# Airbnb Web Application Clone (Fullstack SDE Assignment)

A production-ready, full-stack clone of the Airbnb web application built with **Next.js (TypeScript)**, **FastAPI (Python)**, and **SQLite (SQLAlchemy ORM)**. It replicates Airbnb's iconic design, photo-forward user interface, explore view filtering, interactive map toggle, date availability validation, host listing CRUD, review system, and mocked checkout workflow.

---

## 🚀 Key Features

### 1. Home & Search (Explore View)
- **Grid Layout**: Responsive property cards featuring image carousels, guest favorite badges, location, price per night, and rating.
- **Search Bar**: Interactive Location, Date Range, and Guest count picker with live client filtering.
- **Category Filter Bar**: Filter by property categories (*Amazing pools, Beachfront, Cabins, OMG!, Lakefront, Design, Castles, Farms*).
- **Map View Toggle**: Floating button switching between grid view and an interactive map interface with price markers.
- **Wishlist & Favorites**: Persistent heart toggle saved to browser `localStorage`.

### 2. Listing Detail Page
- **Photo Gallery**: High-resolution image grid displaying primary photos and gallery previews.
- **Availability & Pricing**: Dynamic date picker with real-time night calculation, cleaning fee, Airbnb service fee, and total cost breakdown.
- **Date Overlap Prevention**: Backend enforces strict date validation (`HTTP 400`) if requested dates overlap with an existing confirmed booking.
- **Reviews & Ratings**: Detailed breakdown of cleanliness, accuracy, check-in, communication, location, and value ratings with guest review cards.
- **Write a Review**: Interactive review submission modal for logged-in guests.

### 3. Booking Flow & "My Trips"
- **Mocked Checkout**: Step-by-step confirmation modal with trip summary, itemized price breakdown, and mock credit card payment method.
- **Trips Dashboard (`/trips`)**: View all booked stays with property photo, location, date ranges, total price, and status badge (`CONFIRMED` / `CANCELLED`).
- **Trip Cancellation**: Ability to cancel confirmed reservations.

### 4. Host Experience (Full CRUD & Dashboard)
- **Host Dashboard (`/hosting`)**: Tabbed interface for managing host properties and viewing guest reservations.
- **Create Listing Modal**: Full form to publish new listings with title, description, price, max guests, category, property type, location, and photos.
- **Edit Listing Modal**: Modify existing property attributes.
- **Delete Listing**: Instant removal with confirmation dialog.
- **Guest Reservations Tab**: Monitor incoming guest bookings and total revenue earned across host properties.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 16 (React 19, TypeScript), Tailwind CSS v4, Lucide Icons, Date-fns, Axios.
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy ORM, Pydantic v2.
- **Database**: SQLite (`airbnb_clone.db`).

```
                              ┌───────────────────────────┐
                              │     Next.js Frontend      │
                              │  (React 19 / TypeScript)  │
                              └─────────────┬─────────────┘
                                            │ REST API
                                            ▼
                              ┌───────────────────────────┐
                              │     FastAPI Backend       │
                              │    (Python / SQLAlchemy)  │
                              └─────────────┬─────────────┘
                                            │ SQLite Engine
                                            ▼
                              ┌───────────────────────────┐
                              │     Database Schema       │
                              │     (airbnb_clone.db)     │
                              └───────────────────────────┘
```

---

## 🗄️ Database Schema

### 1. `users` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | Primary Key, Auto Increment | Unique user ID |
| `email` | String | Unique, Indexed | User email address |
| `name` | String | Not Null | User full name |
| `role` | String | Default: 'GUEST' | Role (`GUEST` or `HOST`) |

### 2. `listings` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | Primary Key, Auto Increment | Unique listing ID |
| `host_id` | Integer | Foreign Key -> `users.id` | ID of the host |
| `title` | String | Indexed | Property title |
| `description` | Text | Not Null | Property description |
| `price_per_night` | Float | Not Null | Nightly rate in INR |
| `location` | String | Indexed | City / Region |
| `category` | String | Indexed | Category (*Amazing pools*, etc.) |
| `rating` | Float | Nullable | Aggregated rating |
| `is_guest_favorite` | Boolean | Default: False | Guest favorite flag |
| `property_type` | String | Not Null | *Villa, House, Cabin, Dome* |
| `max_guests` | Integer | Not Null | Maximum allowed guests |
| `amenities` | Text | JSON String | Array of amenity names |
| `photos` | Text | JSON String | Array of image URLs |

### 3. `bookings` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | Primary Key, Auto Increment | Unique booking ID |
| `listing_id` | Integer | Foreign Key -> `listings.id` | Target property ID |
| `guest_id` | Integer | Foreign Key -> `users.id` | ID of the guest |
| `check_in` | Date | Not Null | Check-in date |
| `check_out` | Date | Not Null | Check-out date |
| `total_price` | Float | Not Null | Total calculated price |
| `status` | String | Default: 'CONFIRMED' | `CONFIRMED` or `CANCELLED` |

### 4. `reviews` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | Primary Key, Auto Increment | Unique review ID |
| `listing_id` | Integer | Foreign Key -> `listings.id` | Target property ID |
| `user_id` | Integer | Foreign Key -> `users.id` | Author ID |
| `user_name` | String | Not Null | Author display name |
| `rating` | Float | Not Null | Overall score (1.0 to 5.0) |
| `comment` | Text | Not Null | Review text |
| `created_at` | String | Not Null | Date string |

---

## 📡 API Overview

### Listings Endpoints
- `GET /api/listings/` - Fetch all property listings (supports `?category=` filter).
- `GET /api/listings/{id}` - Fetch single listing details.
- `POST /api/listings/?host_id={host_id}` - Create a new listing (Host required).
- `PUT /api/listings/{id}` - Update existing listing.
- `DELETE /api/listings/{id}` - Delete listing.

### Bookings Endpoints
- `POST /api/bookings/?guest_id={guest_id}` - Create booking (validates non-overlapping dates).
- `GET /api/bookings/my-trips/{guest_id}` - Fetch guest's booked trips.
- `GET /api/bookings/host/{host_id}` - Fetch incoming reservations for host's properties.
- `GET /api/listings/{id}/bookings` - Fetch confirmed booking date ranges for calendar blocking.
- `DELETE /api/bookings/{id}` - Cancel booking.

### Reviews Endpoints
- `GET /api/listings/{id}/reviews` - Fetch listing reviews.
- `POST /api/listings/{id}/reviews?user_id={id}&user_name={name}` - Create review and update aggregate listing rating.

---

## 💻 Local Setup Instructions

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.10+)

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed SQLite database with sample data
python seed.py

# Start FastAPI dev server
uvicorn main:app --reload --port 8000
```
*Backend API will run at `http://localhost:8000` (Swagger docs available at `http://localhost:8000/docs`).*

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run Next.js dev server
npm run dev
```
*Frontend web app will run at `http://localhost:3000`.*

---

## 📋 Evaluation Criteria Coverage
- **Functionality**: Complete explore view, date overlap protection, checkout modal, trips management, reviews, and host CRUD.
- **UI/UX**: Exact visual parity with Airbnb design system (typography, rounded corners, sticky headers, carousels).
- **Database Design**: Normalized SQLite schema with relational foreign keys and JSON serialization for amenities/photos.
- **Code Quality**: Modular Next.js app directory layout, custom context, and FastAPI route organization.
