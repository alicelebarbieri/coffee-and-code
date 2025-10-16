// seedEvents.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

// --- 1️⃣ Firestore config (copie o mesmo do seu firebase.js) ---
const firebaseConfig = {
  apiKey: "AIzaSyCjyCi5cC4zDJHYmMtBgXVH3W7Sk3bu-kM",
  authDomain: "coffee-and-code-ffdf4.firebaseapp.com",
  projectId: "coffee-and-code-ffdf4",
  storageBucket: "coffee-and-code-ffdf4.appspot.com",
  messagingSenderId: "327139807493",
  appId: "1:327139807493:web:1bbce0a244f5906b1276c",
};

// --- 2️⃣ Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- 3️⃣ Events data ---
const userId = "XbTzAXXQobd09kXPhJx0gbyoUrH2";
const userName = "Alicele Ravanello";

const events = [
  {
    title: "Coffee & Code ☕💻",
    date: "2025-10-22",
    startTime: "15:00",
    location: "London",
    isOnline: false,
    price: "Free",
    description: "Join us for coffee, code, and networking in the heart of London!",
    imageUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348",
    rating: 5,
  },
  {
    title: "Music & Code 🎧",
    date: "2025-10-25",
    startTime: "09:00",
    location: "Leeds",
    isOnline: false,
    price: "Free",
    description: "A relaxed morning coding session with lo-fi music and good vibes.",
    imageUrl: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    rating: 4,
  },
  {
    title: "Latte & Logic ☕🤖",
    date: "2025-11-01",
    startTime: "10:00",
    location: "Coventry",
    isOnline: false,
    price: "10",
    description: "Discuss algorithms over cappuccinos and croissants.",
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
    rating: 5,
  },
  {
    title: "AI Jam 🤖",
    date: "2025-11-05",
    startTime: "18:00",
    location: "Online",
    isOnline: true,
    price: "Free",
    description: "Build small AI projects live with other developers online.",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    rating: 4.5,
  },
  {
    title: "Design Meets Code 🎨",
    date: "2025-11-10",
    startTime: "14:00",
    location: "Manchester",
    isOnline: false,
    price: "Free",
    description: "Learn how designers and developers can work together efficiently.",
    imageUrl: "https://images.unsplash.com/photo-1504805572947-34fad45aed93",
    rating: 4,
  },
  {
    title: "Hack & Snack 💻🍕",
    date: "2025-11-15",
    startTime: "12:00",
    location: "Birmingham",
    isOnline: false,
    price: "5",
    description: "Bring your laptop, grab a slice, and build something awesome!",
    imageUrl: "https://images.unsplash.com/photo-1528698827591-1b8b1a2be6a0",
    rating: 5,
  },
  {
    title: "Startup Builders 🚀",
    date: "2025-11-20",
    startTime: "17:30",
    location: "Bristol",
    isOnline: false,
    price: "20",
    description: "Meet tech founders and product people shaping the UK startup scene.",
    imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70",
    rating: 5,
  },
  {
    title: "Science & Software 🔬",
    date: "2025-11-25",
    startTime: "10:00",
    location: "Edinburgh",
    isOnline: false,
    price: "Free",
    description: "A discussion about how modern software is reshaping scientific research.",
    imageUrl: "https://images.unsplash.com/photo-1535930749574-1399327ce78f",
    rating: 4,
  },
];

// --- 4️⃣ Upload to Firestore ---
async function seed() {
  console.log("🌱 Seeding Firestore...");
  for (const event of events) {
    await addDoc(collection(db, "events"), {
      ...event,
      createdAt: Timestamp.now(),
      userId,
      userName,
    });
    console.log(`✅ Added: ${event.title}`);
  }
  console.log("🎉 All events added successfully!");
}

seed()
  .then(() => process.exit())
  .catch((err) => {
    console.error("❌ Error seeding events:", err);
    process.exit(1);
  });
