# ☕ Coffee & Code

A community-driven event platform where developers can create, share, and join tech & coffee meetups.  
Built with **React (Vite)** + **Firebase** + **Google Maps API** + **Google Pay integration**.

---

## 🚀 Features

- 🌍 Interactive **Google Maps** integration with location autocomplete  
- 🧠 Create and manage events (online or in-person)  
- 🪙 Accept **Google Pay** for paid events  
- ⭐ Live rating system with average calculation  
- 📅 Add events directly to **Google Calendar**  
- 🧑‍💻 Firebase Authentication + Firestore database  
- 📷 Image upload with Firebase Storage  
- 💬 Fully responsive design (Bootstrap + custom CSS)

---

## 🧩 Tech Stack

- **Frontend:** React + Vite  
- **Database:** Firebase Firestore  
- **Auth & Storage:** Firebase Authentication & Storage  
- **Maps:** Google Maps + Places + Geocoding APIs  
- **Payments:** Google Pay (Stripe Gateway)  
- **Hosting:** Netlify / Vercel (optional)

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/coffee-and-code.git
cd coffee-and-code



2️⃣ Install dependencies

npm install

3️⃣ Create your .env file

Inside the root of the project, create a file named .env and add your credentials:

VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

    ⚠️ Make sure to enable the following Google Cloud APIs for your Maps key:

        Maps JavaScript API

        Places API

        Geocoding API

Also, restrict your key to these referrers:

http://localhost:5173/*
https://your-deployed-domain.netlify.app/*

4️⃣ Run the project

npm run dev

The app will be available at
👉 http://localhost:5173
☁️ Firebase Setup

If you're setting up your own Firebase project:

    Go to Firebase Console

    Create a new project

    Enable Authentication → Google Sign-In

    Enable Firestore Database

    Enable Storage

    Copy your Firebase config and paste it in the .env file above.

🗺️ Google Maps Setup

    Visit Google Cloud Console

    Enable:

        Maps JavaScript API

        Places API

        Geocoding API

    Create a new API key

    Restrict it to HTTP referrers (localhost + your production URL)

💳 Google Pay Setup

Google Pay is used for paid events.
To enable it, create a Stripe test account and set your publishable key:

VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx

    The app uses environment="TEST" by default — safe for development.

🧠 Developer Notes

    The project uses @react-google-maps/api for map integration.

    The loader is unified through the custom hook:
    src/hooks/useGoogleMaps.js
    → ensures only one Google Maps script is loaded across the app.

    Ratings are saved per-user and averaged automatically in Firestore.

    Styles are modular: each component (e.g. EventCard.jsx) has its own .css.

🤝 Contributing

Pull requests are welcome!
If you’d like to improve functionality or design, fork the repo and submit a PR.
🧑‍💻 Author

Alicele Barbieri
💼 Junior Full-Stack Developer
🌐 LinkedIn/Alicele.Barbieri
📜 License

This project is licensed under the MIT License — feel free to use, modify, and share.