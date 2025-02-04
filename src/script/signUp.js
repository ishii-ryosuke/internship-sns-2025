import AuthWrapper from "../firebase-wrapper/auth.js";
import FirestoreWrapper from "../firebase-wrapper/firestore.js";

const auth = new AuthWrapper();
const firestore = new FirestoreWrapper();

/**
 * 画面に入力したメールアドレスとパスワードで Firebase アカウントを作成する
 * @param {Event} event イベントオブジェクト
 */
async function createAccount(event) {
  // フォームのデフォルト送信動作をキャンセル
  event.preventDefault();

  // 入力フィールドから値を取得
  const nameInput = document.querySelector('input[type="text"]');
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // 入力内容のチェック
  if (!email || !password) {
    alert("メールアドレスとパスワードを入力してください");
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    alert("有効なメールアドレスを入力してください");
    return;
  }
  if (password.length < 6) {
    alert("パスワードは6文字以上である必要があります");
    return;
  }

  try {
    // Firebase Authentication にユーザーのアカウントを作成
    const user = await auth.register(email, password);

    // Firestore にユーザー情報を保存
    await registerUser(name, user);

    // ホーム画面に遷移
    moveToHome();
  } catch (error) {
    // エラー内容を表示
    showErrorMessage(error);
  }
}

/**
 * Google アカウントを使用して Firebase アカウントを作成する
 * @param {Event} event イベントオブジェクト
 */
async function googleSignUp(event) {
  // フォームのデフォルト送信動作をキャンセル
  event.preventDefault();

  try {
    // Google アカウントでログイン
    const user = await auth.loginWithGoogle();

    // `user.displayName` が存在しない場合のフォールバック
    const name = user.displayName || "Anonymous";

    // Firestore にユーザー情報を保存（デフォルトのアイコンを設定）
    await registerUser(name, user);

    // ホーム画面に遷移
    moveToHome();
  } catch (error) {
    // エラー内容を表示
    showErrorMessage(error);
  }
}

/**
 * エラー内容を画面に表示する
 * @param {Object} error Error object
 */
function showErrorMessage(error) {
  console.error("Error during registration:", error);
  if (error.code === "auth/email-already-in-use" || error.message.includes("auth/email-already-in-use")) {
    alert(
      "このメールアドレスは既に登録されています。別のメールアドレスで作成してください。"
    );
  } else {
    alert(`アカウント作成に失敗しました: ${error.code || "Unknown"} - ${error.message || "No message available"}`);
  }
}

/**
 * Firestore にユーザー情報を保存する
 * @param {string} name ユーザー名
 * @param {Object} user 登録するユーザー情報
 */
async function registerUser(name, user) {
  // Firestore に保存するユーザーデータを作成
  const userData = {
    email: user.email, // Firebase Auth から取得したメールアドレス
    name: name, // ユーザー名
    introduction: "", // プロフィール説明（初期値は空）
    icon: "", // アイコンのパス(初期値は空)
    updatedAt: FirestoreWrapper.dateToTimestamp(new Date()), // 現在時刻
  };

  // Firestore の "users" コレクションにデータを保存
  await firestore.createDocument("users", userData);
}

/**
 * ホーム画面に遷移する
 */
function moveToHome() {
  // ホーム画面の URL に遷移
  window.location.href = "home.html";
}

// 「Create Account」ボタンがクリックされたときの処理を登録
document.getElementById("createAccount").addEventListener("click", createAccount);

// 「Sign Up With Google」ボタンがクリックされたときの処理を登録
document.getElementById("googleSignUp").addEventListener("click", googleSignUp);
