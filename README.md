# 🌿 StayNest — Modern & Elegant Homestay Booking Platform

> **"Stay Somewhere Beautiful"** — Discover peaceful homestays, cozy mountain villas, tea plantation retreats, and unforgettable travel experiences across India's most scenic destinations.

Built with **React.js 19**, **Vite**, **React Router DOM 7**, **Vanilla CSS Design System**, and **Axios**.

---

## 🎨 Design Aesthetic & Color Palette
The UI is styled with a nature-inspired, warm luxury travel aesthetic:
* **Deep Forest Green** (`#1B3B2B`, `#2D5A43`): Primary brand color, representing lush foliage, trust, and grounding calm.
* **Warm Earthy Terracotta** (`#C47444`, `#9F5428`): Accent buttons, badges, highlights, and icons.
* **Cream / Natural Ivory** (`#FAF7F2`, `#F4EFE7`): Warm background hues providing comfort and elegance over stark cold white.
* **Muted Sand Beige** (`#E8E0D5`): Soft borders and subtle card dividers.
* **Crisp Card White** (`#FFFFFF`): Clean elevation with soft shadows and smooth hover transitions.
* **Editorial Typography**: Heading serif fonts (`Playfair Display`), body text (`Plus Jakarta Sans`), and geometric UI accents (`Outfit`).

---

## 🚀 Key Features & Pages

### 1. Home Page (`/`)
* **Hero Banner**: Full-width high-definition homestay backdrop with smooth gradient overlay.
* **Interactive Search Box**: Real-time filters for Location, Check-in, Check-out, and Guest counts with 1-click search.
* **Trust Highlights**: Verified homestays, Superhost hospitality, and homecooked breakfast guarantees.
* **Popular Homestays**: Responsive card grid with wishlist toggles, ratings, pricing, and specs.
* **Recommended For You**: Category filter pills (Mountain Villas, Plantation Stays, Backwater Retreats, Beach Cottages, Heritage Homes).
* **Explore Destinations**: Scenic destination cards for **Wayanad**, **Munnar**, **Vagamon**, **Thekkady**, **Alleppey**, and **Varkala** linking directly to filtered listings.
* **Why Choose Us**: 4 visual cards highlighting the StayNest hospitality difference.
* **Guest Reviews**: Real guest testimonials with verified traveler badges, dates, and ratings.
* **Host CTA Banner**: Call to action for property owners to list their homestay.

### 2. Homestay Listing Page (`/explore`)
* Real-time search query matching property names, locations, and descriptions.
* Multi-criteria sidebar filters:
  * Destination / Region dropdown
  * Category / Experience selector
  * Price range slider (₹2,500 – ₹6,000+)
  * Minimum guest capacity counter
  * Amenities checklist (WiFi, Parking, Breakfast, Mountain View, Swimming Pool, Garden, Kitchen, AC, Pet Friendly)
  * Sorting (Recommended, Price: Low to High, Price: High to Low, Top Rated)
* Active filter chips with individual remove buttons and a "Clear All" action.
* Responsive slide-out filter drawer on tablet and mobile viewports.

### 3. Homestay Details Page (`/homestay/:id`)
* Interactive 5-photo grid and a full-screen **"View All Photos" Lightbox Modal**.
* Key property specs: guests, bedrooms, beds, private baths.
* Superhost profile banner with response rate and host bio.
* Rich narrative description & "StayNest Peace Guarantee".
* Amenities icons grid with Lucide icons.
* House rules, etiquette, and safety guidelines.
* Reviews breakdown with interactive **"Write a Review" Modal**.
* **Sticky Dynamic Booking Card**:
  * Live night calculation based on date pickers
  * Itemized price breakdown: Base price × nights + cleaning fee + service fee = Total
  * "Reserve Now" button pre-populating dates into checkout.

### 4. Booking & Reservation Page (`/booking/:id`)
* Complete guest checkout form: Name, Email, Phone, Stay Dates, Guest Count, Special Requests.
* Payment modes: Credit / Debit Card, Instant UPI / QR, and Pay at Homestay.
* Live reservation summary card with property thumbnail and itemized invoice.
* Instant booking confirmation with unique **Booking Reference ID** (e.g. `#SN-784102`) and direct navigation to ledger.

### 5. My Bookings Page (`/bookings`)
* Complete travel ledger of all reservations.
* Status filter tabs: `All`, `Confirmed`, `Pending`, `Completed`, `Cancelled`.
* Actionable booking cards with:
  * **"View Voucher" Modal**: Official printable voucher receipt with reference ID, guest details, and invoice breakdown.
  * **"Cancel Reservation"**: Live cancellation with confirmation dialog and status update.

### 6. User Profile Page (`/profile`)
* Traveler summary header with avatar, verification badge, and contact information.
* Stats cards: Total Trips, Saved Homestays, Destinations Explored, Member Since.
* **Wishlist Tab**: Live grid of all favorited homestays with instant heart toggle.
* **Edit Profile Tab**: Editable form to update personal details, phone, and bio.

### 7. Authentication Pages (`/login` & `/register`)
* Nature-themed split layout with side photography showcase.
* Form validation, show/hide password toggles, "Remember me", and "Forgot password" notice.
* **1-Click Demo Login**: "Demo Traveler" & "Demo Host" buttons for instantaneous testing.

### 8. Sticky Header & Modals
* Transparent blur-glass navbar on scroll.
* Live wishlist count badge.
* User avatar dropdown menu.
* Mobile slide-out drawer menu with hamburger toggle.
* **"List Your Property" Modal**: Application form for prospective hosts.
* **"About StayNest" Modal**: Story, ethics, and stats.
* **"Contact Support" Modal**: 24/7 direct helpline, concierge email, and headquarters info.

---

## 🛠️ Project Structure

```text
src/
├── components/
│   ├── Header.jsx & Header.css           # Sticky navbar, drawer, and popups
│   ├── Footer.jsx & Footer.css           # Brand info, links, newsletter
│   ├── HomestayCard.jsx & HomestayCard.css # Reusable card with heart toggle
│   ├── SearchBox.jsx & SearchBox.css     # Filter inputs (Hero & Explore)
│   ├── ReviewCard.jsx & ReviewCard.css   # Testimonials card
│   └── DestinationCard.jsx & DestinationCard.css # Destination photo cards
│
├── pages/
│   ├── Home.jsx & Home.css               # Landing page with 7 sections
│   ├── Explore.jsx & Explore.css         # Listing with filters & sorting
│   ├── HomestayDetails.jsx & HomestayDetails.css # Detailed stay page
│   ├── Booking.jsx & Booking.css         # Checkout & confirmation
│   ├── Login.jsx                         # Sign In with demo account buttons
│   ├── Register.jsx                      # Sign Up page
│   ├── Auth.css                          # Shared auth styling
│   ├── Profile.jsx & Profile.css         # User profile, stats & wishlist
│   └── MyBookings.jsx & MyBookings.css   # Reservation ledger & voucher
│
├── context/
│   ├── AuthContext.jsx                   # User session & profile persistence
│   ├── WishlistContext.jsx               # Saved properties with localStorage
│   └── BookingContext.jsx                # Bookings state, add & cancel
│
├── data/
│   ├── homestays.js                      # 8+ rich homestays with photos & details
│   ├── destinations.js                   # Wayanad, Munnar, Vagamon, etc.
│   └── reviews.js                        # Authentic guest reviews
│
├── services/
│   └── api.js                            # Axios API client with local fallback
│
├── App.jsx & App.css                     # React Router & shell
├── main.jsx                              # React Root
└── index.css                             # Global design system & variables
```

---

## 🔌 Future Backend Integration (Node.js + Express + MongoDB)
The frontend uses an Axios client in `src/services/api.js` structured to connect seamlessly to a backend API without changing component logic:

```text
GET    /api/homestays           # Retrieve filtered homestays
GET    /api/homestays/:id       # Retrieve single homestay
POST   /api/bookings            # Create new reservation
GET    /api/bookings/:userId    # Retrieve bookings for a user
PATCH  /api/bookings/:id/cancel # Cancel a reservation
POST   /api/auth/login          # User authentication
POST   /api/auth/register       # User registration
PUT    /api/users/:id           # Update profile details
```

To point to your real backend server, simply add `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build production bundle
npm run build
```

Open `http://localhost:5174/` (or the port displayed in terminal) in your browser.
