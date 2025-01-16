import AuthWrapper from "../firebase-wrapper/auth.js";

const auth = new AuthWrapper();

/**
 * 画面に入力したメールアドレスとパスワードで Firebase アカウントを作成する
 */
async function createAccount(event) {
  // フォームのデフォルト送信動作をキャンセル
  event.preventDefault();

  // 入力フィールドから値を取得
  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;

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
    // ユーザーのアカウントを作成する
    const user = await auth.register(email, password);
    console.log("User registered:", user);
    moveToHome();
  } catch (error) {
    console.error("Error during registration:", error.message);
    alert(`アカウント作成に失敗しました: ${error.code || "Unknown"} - ${error.message || "No message available"}`);
  }
}

/**
 * Google アカウントを使用して Firebase アカウントを作成する
 */
async function googleSignUp(event) {
  // フォームのデフォルト送信動作をキャンセル
  event.preventDefault();

  try {
    // Google アカウントでログインする
    const user = await auth.loginWithGoogle();
    console.log("User logged in with Google:", user);
    moveToHome();
  } catch (error) {
    console.error("Error during registration:", error);
    if (error.code === "auth/email-already-in-use") {
      alert(
        "このメールアドレスは既に登録されています。別のメールアドレスで作成してください。"
      );
      // ログインページにリダイレクト
      window.location.href = "signIn.html";
    } else {
      alert(`アカウント作成に失敗しました: ${error.code || "Unknown"} - ${error.message || "No message available"}`);
    }
  }
}

/**
 * ホーム画面に遷移する
 */
function moveToHome() {
  window.location.href = "home.html";
}

// 「Create Account」ボタンがクリックされたときの処理を登録
document.getElementById("createAccount").addEventListener("click", createAccount);
// 「Sign Up With Google」ボタンがクリックされたときの処理を登録
document.getElementById("googleSignUp").addEventListener("click", googleSignUp);
