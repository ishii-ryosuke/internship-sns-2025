import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
  deleteDoc,
  where,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { app } from "./index.js";

class FirestoreWrapper {
  constructor() {
    this.db = getFirestore(app);
  }

  /**
   * ドキュメントを新規作成します
   * @param {string} collectionName - コレクション名
   * @param {Object} data - 作成するデータ
   * @returns {Promise<string>} - 作成されたドキュメントのID
   */
  async createDocument(collectionName, data) {
    const collectionRef = collection(this.db, collectionName);
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  }

  /**
   * 特定のドキュメントを取得します
   * @param {string} collectionName - コレクション名
   * @param {string} docId - ドキュメントID
   * @returns {Promise<Object|null>} - ドキュメントデータまたはnull
   */
  async getDocument(collectionName, docId) {
    const docRef = doc(this.db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }

  /**
   * 全てのドキュメントを取得します
   * @param {string} collectionName - コレクション名
   * @param {Array<Object>} conditions - クエリ条件 (例: [{ field: 'age', operator: '>=', value: 18 }])
   * @param {Object} options - 並び替えオプション（例: { orderBy: "updated", orderDirection: "desc" }）
   * @returns {Promise<Array<Object>>} - ドキュメントの配列
   */
  async getDocuments(collectionName, conditions = [], options = {}) {
    let queryRef = collection(this.db, collectionName);

    if (conditions.length > 0) {
      conditions.forEach((cond) => {
        queryRef = query(queryRef, where(cond.field, cond.operator, cond.value));
      });
    }

    // ソート条件をクエリに追加
    if (options.orderBy) {
      queryRef = query(queryRef, orderBy(options.orderBy, options.orderDirection || "asc"));
    }

    const snapshot = await getDocs(queryRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * ドキュメントを更新します
   * @param {string} collectionName - コレクション名
   * @param {string} docId - ドキュメントID
   * @param {Object} data - 更新するデータ
   * @returns {Promise<void>}
   */
  async updateDocument(collectionName, docId, data) {
    const docRef = doc(this.db, collectionName, docId);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  }

  /**
   * ドキュメントを削除します
   * @param {string} collectionName - コレクション名
   * @param {string} docId - ドキュメントID
   * @returns {Promise<void>}
   */
  async deleteDocument(collectionName, docId) {
    const docRef = doc(this.db, collectionName, docId);
    await deleteDoc(docRef);
  }

  /**
   * Firestore の Timestamp を JS Date に変換します
   * @param {Timestamp} timestamp - Firestore の Timestamp
   * @returns {Date} - JS の Date オブジェクト
   */
  static timestampToDate(timestamp) {
    return timestamp.toDate();
  }

  /**
   * JS Date を Firestore の Timestamp に変換します
   * @param {Date} date - JS の Date オブジェクト
   * @returns {Timestamp} - Firestore の Timestamp
   */
  static dateToTimestamp(date) {
    return Timestamp.fromDate(date);
  }

  /**
   * ファイルを Base64 に変換するユーティリティ関数
   * @param {File} file - 入力ファイル
   * @returns {Promise<string>} - Base64 エンコード済みデータ
   */
  static convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export default FirestoreWrapper;
