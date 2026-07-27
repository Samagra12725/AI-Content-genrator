# AI Product Content Generator

A secure MERN Stack web application that allows authenticated users to generate AI-powered product content based on product details, copy outputs in a single click, and manage history records.

---

## Technical Architecture & Features

### 🌟 Features
1. **User Authentication**:
   - Secure registration and login.
   - Passwords hashed using `bcryptjs`.
   - JWT-based authentication for state management and route security.
   - Protected dashboard and history access.
2. **Product Specs Form**:
   - Gathers Brand Name, Product Name, Category, Key Features, and Target Audience.
3. **AI Generation (OpenRouter)**:
   - Configured with `google/gemini-2.5-flash` model.
   - Returns structured JSON: Title, Tagline, Descriptions, Bullet points, and SEO Tags.
   - Runs on optimized `max_tokens: 1500` settings to avoid OpenRouter credit depletion exceptions.
4. **Copy-to-Clipboard in 1-Click**:
   - **Copy All Content**: Concatenates all generated text blocks into a clean markdown format and copies it.
   - **Individual Copy**: Selectively copy taglines, descriptions, selling points, or keyword strings.
   - Visual success feedback: glowing pulse animation, green checkmark toggles, and toast alerts.
5. **Product History Split-Pane**:
   - Scrollable history sidebar with date/category tags and quick delete triggers.
   - Detail panel displaying generated contents and copy triggers.
6. **Premium Theme**: Dark mode design featuring custom Vanilla CSS (glassmorphism cards, blurred backgrounds, dynamic loading animations).

---

## Folder Structure
```
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection helper
│   │   ├── controllers/     # Auth and Product handlers
│   │   ├── middlewares/     # JWT protect parser
│   │   ├── models/          # User and ProductContent schemas
│   │   ├── routes/          # Express routing routers
│   │   └── server.js        # Main entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, ProtectedRoute
│   │   ├── pages/           # Login, Register, Dashboard, History
│   │   ├── services/        # Fetch API Client wrapper
│   │   ├── App.jsx          # Router and global layout
│   │   ├── index.css        # Vanilla CSS Design System and CSS tokens
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js installed (v16+)
- MongoDB Atlas cluster or local database running

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
4. Fill in the `.env` values:
   ```env
    PORT=5001
    MONGO_URI=your_mongodb_connection_url
    JWT_SECRET=your_jwt_signing_secret_key
    OPENROUTER_API_KEY=your_open_router_api_key
   ```
5. Launch the server in development mode:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install React dependencies:
   ```bash
   npm install
   ```
3. Launch the React app:
   ```bash
   npm run dev
   ```
   The app will run locally on `http://localhost:5173`. Open this URL in your web browser.

---

## Sample Data for Testing

To test the generator, here are three sample product specifications:

### Sample 1: Fitness Wearable
*   **Brand Name**: ZenFit
*   **Product Name**: Aura Ring v2
*   **Product Category**: Smart Wearables
*   **Target Audience**: Biohackers and active professional athletes
*   **Key Features**: Continuous HRV tracking, Smart haptic feedback, 10-day battery life, Sunlight-readable display, Scratchproof titanium shell

### Sample 2: Eco-friendly Household
*   **Brand Name**: EarthClean
*   **Product Name**: PureWash Pods
*   **Product Category**: Household Supplies
*   **Target Audience**: Eco-conscious parents and zero-waste households
*   **Key Features**: 100% plant-derived enzymes, Soluble biodegradable film, Hypoallergenic scent-free formula, Recyclable zero-waste box, Optimized for cold wash cycles

### Sample 3: High-end Coffee Maker
*   **Brand Name**: BaristaCraft
*   **Product Name**: Precision Brew Elite
*   **Product Category**: Kitchen Appliances
*   **Target Audience**: Coffee connoisseurs and home baristas
*   **Key Features**: Dual heating boiler system, PID precise temperature control, Integrated conical burr grinder, 15-bar Italian pressure pump, Programmable profiling profiles
