# Product Requirements Document (PRD)

## 1. Project Overview
The objective is to build a functional, full-stack clone of the Airbnb web application. The platform will allow users to browse and search property listings, view detailed listing pages, filter based on specific criteria, and book stays. It will also provide a host dashboard for users to create and manage their own property listings.

## 2. Core Features (Must Have)

### 2.1 Home & Search (Explore View)
- Grid layout displaying listing cards.
- Listing card elements: High-quality photo (carousel), title, location, price per night, and rating.
- Interactive search bar supporting: Location, Date Range, and Guest count.
- Horizontal category/filter row (e.g., price range, property type, amenities).
- Pagination or infinite scrolling to load more listings.

### 2.2 Listing Detail Page
- Large photo gallery layout.
- Listing specifics: Title, comprehensive description, location, amenities list, and host information.
- Availability calendar with a date-range picker.
- Dynamic price breakdown (Nightly rate × Number of nights + mock fees).
- Reviews and ratings section.

### 2.3 Booking Flow
- End-to-end mocked booking capability.
- Validation to prevent booking overlapping or unavailable dates.
- Mocked checkout and confirmation step.
- "My Trips" dashboard to list a user's booked stays.
- Booked dates must persist in the database and block future availability.

### 2.4 Host Experience (CRUD)
- "Become a Host" capability.
- Full Create, Read, Update, Delete (CRUD) operations for property listings.
- Listing creation requires: Title, description, photo URLs, price, location, and amenities.
- Host dashboard to view owned listings and associated bookings.

## 3. User Experience (UX) & Design
- Visual parity with modern Airbnb interfaces.
- Responsive design tailored for desktop, tablet, and mobile views.
- Dynamic interactions (hover states, modal transitions, date pickers).
- Toast notifications for actions (e.g., successful booking, errors).
- Functional but simplified "Wishlist/Favorites" feature.

## 4. Scope Limitations & Mocks
- Payment processing will be mocked; no real financial transactions.
- User authentication can be a simplified mock (e.g., switching between 'Guest' and 'Host' views).
- Messaging between guest and host is out of scope (placeholder acceptable).
- Real-time map with live pricing pins is out of scope (static map placeholder acceptable).
