// ==========================================
// BREVLO GLOBAL CONFIGURATION
// ==========================================

// 1. Ye check karega ki site abhi local PC pe chal rahi hai ya Vercel (live) par
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// 2. Apne Local aur Live Backend URLs yahan set kar
const LOCAL_BACKEND = "http://localhost:5000"; 
const LIVE_BACKEND = "https://brevlo-backend.onrender.com"; // JAB TU BACKEND DEPLOY KAREGA, BAS YE EK LINE UPDATE KARNI HAI

// 3. Final URL jo poori site use karegi
const SERVER_URL = isLocal ? LOCAL_BACKEND : LIVE_BACKEND;

// Debugging ke liye console log (taaki browser inspect mein dikh jaye kaunsa server connected hai)
console.log("🔥 Connected Server:", SERVER_URL);