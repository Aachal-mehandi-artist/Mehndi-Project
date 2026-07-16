// ============================================================
//  ARTIST CONFIGURATION — edit this file to personalise the site
// ============================================================
const ARTIST_CONFIG = {
  name:        "Aachal Bodkhe",       // Artist full name
  tagline:     "Mehndi Artist Loni, Warud",
  photo:       "images/artist-aachal.jpg",  // About section photo
  phone:       "+91 96994 11360",     // Phone / WhatsApp number (digits only for links)
  phoneDigits: "919699411360",        // Country code + number, no spaces or +
  instagram:   "@aachal_mehandi_art_loni",  // Instagram handle
  instagramUrl:"https://www.instagram.com/aachal_mehandi_art_loni",
  facebook:    "",                    // Facebook page URL (leave empty to hide)
  location:    "Near Awdhut Mandir, Loni, Ta. Warud, Dist. Amravati",
  experience:  "2+",                  // Years of experience
  happyClients:"20+",
  bridalDone:  "50+",
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
