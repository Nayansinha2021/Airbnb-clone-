# Design Document

## 1. Architecture Overview
The application follows a standard Client-Server architecture.
- **Frontend (Client)**: A Next.js application responsible for rendering the UI, handling user interactions, and maintaining client-side state. It communicates with the backend via REST APIs.
- **Backend (Server)**: A Python FastAPI application providing RESTful endpoints. It handles business logic, data validation, and interactions with the database.
- **Database**: A relational SQLite database used for persistent storage of users, listings, and bookings.

## 2. Database Schema (SQLite)

### Users Table
- `id` (Integer, Primary Key)
- `email` (String, Unique)
- `name` (String)
- `role` (String) - Enum: 'GUEST', 'HOST'

### Listings Table
- `id` (Integer, Primary Key)
- `host_id` (Integer, Foreign Key -> Users.id)
- `title` (String)
- `description` (Text)
- `price_per_night` (Float)
- `location` (String)
- `property_type` (String)
- `max_guests` (Integer)
- `amenities` (JSON or Comma-separated String)

### Photos Table (Optional mapping, or store as JSON array in Listings)
- `id` (Integer, Primary Key)
- `listing_id` (Integer, Foreign Key -> Listings.id)
- `url` (String)

### Bookings Table
- `id` (Integer, Primary Key)
- `listing_id` (Integer, Foreign Key -> Listings.id)
- `guest_id` (Integer, Foreign Key -> Users.id)
- `check_in` (Date)
- `check_out` (Date)
- `total_price` (Float)
- `status` (String) - Enum: 'CONFIRMED', 'CANCELLED'

## 3. UI/UX Component Architecture (React/Next.js)

The frontend is built using atomic design principles and reusable components.

### 3.1 Global Components
- `<Header />`: Adaptive header that changes state on scroll.
- `<SearchBar />`: Compound component comprising LocationPicker, DatePicker, and GuestPicker.
- `<Footer />`: Standard application footer.
- `<Modal />`: Reusable overlay wrapper for forms and dialogues.

### 3.2 Core UI Elements
- `<ListingCard />`: Renders an individual property with an image carousel, favorite button, and brief details.
- `<Carousel />`: Used for property images and horizontal scrolling lists.
- `<DatePicker />`: Custom calendar component for selecting date ranges.

### 3.3 Page Layouts
- **Home/Explore Layout**: Integrates Header, Category tabs, and a grid of ListingCards.
- **Listing Detail Layout**: Presents high-res image gallery, descriptive sections, and a sticky ReservationCard.
- **Dashboard Layout**: Side-navigation layout for user trips and host listings management.

## 4. API Endpoints

### Listings
- `GET /api/listings`: Fetch multiple listings (supports query params: location, dates, guests).
- `GET /api/listings/{id}`: Fetch single listing details.
- `POST /api/listings`: Create new listing.
- `PUT /api/listings/{id}`: Update listing.
- `DELETE /api/listings/{id}`: Remove listing.

### Bookings
- `GET /api/bookings/my-trips`: Fetch bookings for current guest.
- `POST /api/bookings`: Create new booking (requires date availability check).

### Auth (Mock)
- `POST /api/auth/mock-login`: Sets cookie/state for current active user (guest or host).
