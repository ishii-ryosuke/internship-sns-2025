import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxCYC_oCXYR8B9qNVGGL00Nbi8EIFW8eo",
  authDomain: "my-sns-a8f5a.firebaseapp.com",
  projectId: "my-sns-a8f5a",
  storageBucket: "my-sns-a8f5a.firebasestorage.app",
  messagingSenderId: "82041137539",
  appId: "1:82041137539:web:99a3852a5a4cedd86eeeb6"
};

// Firebase アプリの初期化
export const app = initializeApp(firebaseConfig);
// Firestore のインスタンスをエクスポート
export const firestore = getFirestore(app);
