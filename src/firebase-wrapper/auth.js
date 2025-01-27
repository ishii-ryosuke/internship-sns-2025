import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { app } from "./index.js";

class AuthWrapper {
  constructor() {
    this.auth = getAuth(app);
    // Google 認証プロバイダー
    this.googleProvider = new GoogleAuthProvider();
  }

  // ユーザー登録 (Email/Password)
  async register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(`Failed to register: ${error.message}`);
    }
  }

  // ログイン (Email/Password)
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(`Failed to login: ${error.message}`);
    }
  }

  // Google ログイン
  async loginWithGoogle() {
    try {
      const userCredential = await signInWithPopup(this.auth, this.googleProvider);
      return userCredential.user;
    } catch (error) {
      throw new Error(`Failed to login with Google: ${error.message}`);
    }
  }

  // ログアウト
  async logout() {
    try {
      await signOut(this.auth);
      return true;
    } catch (error) {
      throw new Error(`Failed to logout: ${error.message}`);
    }
  }

  // 現在のユーザーを取得
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // 認証状態の変更を監視
  onAuthStateChanged(callback) {
    onAuthStateChanged(this.auth, callback);
  }

  // パスワードリセットメールを送信
  async sendPasswordReset(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return true;
    } catch (error) {
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }
}

export default AuthWrapper;
