import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdx5Yn-k_q4WCz15IQgIlfQSwVztxkADk",
  authDomain: "new-sns-project.firebaseapp.com",
  projectId: "new-sns-project",
  storageBucket: "new-sns-project.firebasestorage.app",
  messagingSenderId: "142626252418",
  appId: "1:142626252418:web:3fdbcdf31a9bd027c7769b"
};

// Firebase アプリの初期化
export const app = initializeApp(firebaseConfig);
// Firestore のインスタンスをエクスポート
export const firestore = getFirestore(app);
