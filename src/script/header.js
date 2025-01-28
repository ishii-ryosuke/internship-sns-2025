import { getCurrentUser, onUserChange } from "../auth/authState.js";
import FirestoreWrapper from "../firebase-wrapper/firestore.js";

// FirestoreWrapper のインスタンスを作成
const firestore = new FirestoreWrapper();

// ユーザー情報を表示するコンテナを取得
const userInfoContainer = document.querySelector(".user-info");

/**
 * ユーザー情報を表示する関数
 * @param {string} displayName - ユーザーの表示名
 * @param {string} email - ユーザーのメールアドレス
 * @param {string} icon - ユーザーのアイコン画像のURLまたはBase64文字列
 */
function displayUser(displayName, email, icon) {
  // 表示するアイコン画像のURLを準備
  let userIconSrc;

  // アイコンが設定されていない場合はデフォルトアイコンを使用
  if (icon === null || icon === undefined || icon === "") {
    userIconSrc = "../asset/avatar.png";
  }
  // アイコンが Base64 形式のデータURLの場合はそのまま使用
  else if (icon.startsWith("data:")) {
    userIconSrc = icon;
  }
  // アイコンが Base64 データ（ヘッダーなし）の場合はヘッダーを追加
  else {
    userIconSrc = `data:image/png;base64,${icon}`;
  }

  // ユーザー情報をHTMLに設定
  userInfoContainer.innerHTML = `
    <div class="flex items-center space-x-4">
      <div class="flex flex-col">
        <!-- 表示名を表示。表示名がない場合は 'Anonymous' を表示 -->
        <span class="text-gray-700 font-medium">${displayName !== null && displayName !== undefined && displayName !== "" ? displayName : "Anonymous"}</span>
        <!-- メールアドレスを表示 -->
        <span class="text-gray-500 text-sm">${email}</span>
      </div>
      <!-- アイコン画像を表示 -->
      <img src="${userIconSrc}" alt="Avatar" class="w-10 h-10 rounded-full">
    </div>
  `;
}

/**
 * Firestore からログイン中のユーザー情報を取得して表示する関数
 */
async function loadAndDisplayUserInfo() {
  // 現在ログイン中のユーザー情報を取得
  const currentUser = getCurrentUser();

  // ユーザーがログインしていない場合は処理を中断
  if (currentUser === null || currentUser === undefined) {
    console.warn("ユーザーがログインしていません。");
    return;
  }

  try {
    // Firestore からログイン中のユーザー情報を検索
    const users = await firestore.getDocuments("users", [
      { field: "email", operator: "==", value: currentUser.email },
    ]);

    // Firestore に該当するユーザー情報が存在しない場合
    if (users.length === 0) {
      console.error("Firestore に該当するユーザーが見つかりません。");
      alert("ユーザー情報が見つかりません。管理者にお問い合わせください。");
      window.location.href = "signIn.html"; // サインインページにリダイレクト
      return;
    }

    // Firestore から取得したユーザー情報を取得
    const userData = users[0];

    // 取得したユーザー情報を表示
    displayUser(userData.name, userData.email, userData.icon);
  } catch (error) {
    // エラー発生時のログ出力とアラート表示
    console.error("ユーザー情報の取得中にエラーが発生しました:", error.message);
    alert("ユーザー情報の取得に失敗しました。時間を置いて再試行してください。");
  }
}

/**
 * ユーザー情報の変更を監視し、変更があれば情報を再取得・再表示する
 */
onUserChange(() => {
  // ユーザー情報を再取得して表示
  loadAndDisplayUserInfo();
});
