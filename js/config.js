// ============================================================
//  ARTIST CONFIGURATION — edit this file to personalise the site
// ============================================================
const ARTIST_CONFIG = {
  name:        "Your Name",           // Artist full name
  tagline:     "Professional Mehndi Artist",
  phone:       "+91 99999 99999",     // Phone / WhatsApp number (digits only for links)
  phoneDigits: "919999999999",        // Country code + number, no spaces or +
  instagram:   "@mehndiartist",       // Instagram handle
  instagramUrl:"https://instagram.com/mehndiartist",
  facebook:    "",                    // Facebook page URL (leave empty to hide)
  location:    "Your City, India",
  experience:  "5+",                  // Years of experience
  happyClients:"500+",
  bridalDone:  "200+",
  patterns:    "50+",
};

// ============================================================
//  FIREBASE CONFIGURATION
//  1. Go to https://console.firebase.google.com
//  2. Create a project → Add Web App → copy the config below
//  3. Enable Firestore Database (test mode to start)
//  4. Enable Storage
//  5. Enable Authentication → Email/Password
// ============================================================
const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

// Set to false until you configure Firebase above
const USE_FIREBASE = false;
