import AuthWrapper from "../firebase-wrapper/auth.js";

const auth = new AuthWrapper();

let currentUser = null; // 現在のユーザー情報
let userListeners = []; // ユーザー情報が更新された際のリスナー

/**
 * ログインユーザーの状態を監視
 */
auth.onAuthStateChanged((user) => {
  currentUser = user; // 現在のユーザー情報を更新
  notifyListeners(); // リスナーに通知
});

/**
 * リスナーを通知
 */
function notifyListeners() {
  userListeners.forEach((listener) => {
    listener(currentUser);
  });
}

/**
 * 現在のユーザーを取得
 * @returns {Object | null} 現在のユーザー情報
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * ユーザー情報の変更を監視するリスナーを追加
 * @param {Function} callback ユーザー情報が更新された際に呼ばれるコールバック関数
 */
export function onUserChange(callback) {
  userListeners.push(callback);
}

/**
 * リスナーを削除
 * @param {Function} callback 削除するリスナー
 */
export function removeUserChangeListener(callback) {
  userListeners = userListeners.filter((listener) => listener !== callback);
}
