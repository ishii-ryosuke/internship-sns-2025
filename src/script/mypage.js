import { createPostElement } from "./postUtils.js";
import { getCurrentUser, onUserChange } from "../auth/authState.js";
import FirestoreWrapper from "../firebase-wrapper/firestore.js";

// Firestore クラスのインスタンスを作成
const firestore = new FirestoreWrapper();

// DOM の要素を取得
const profileSection = document.querySelector(".profile-section");
const postsContainer = document.querySelector(".mypage-posts-container");

/**
 * Firestore からユーザー情報を取得し、画面に表示する関数
 * @returns {Promise<string|null>} Firestore のユーザードキュメントID（取得できなければ null）
 */
async function loadUserProfile() {
  // 必要な要素が見つからない場合は処理をスキップ
  if (!profileSection) {
    console.warn("profileSection が見つからないため、ユーザー情報の表示をスキップします。");
    return null;
  }

  // 現在ログイン中のユーザー情報を取得
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.error("ログインユーザーが取得できませんでした。");
    return null;
  }

  try {
    // Firestore からログインユーザーに対応する情報を取得
    const users = await firestore.getDocuments("users", [
      { field: "email", operator: "==", value: currentUser.email }
    ]);

    if (users.length === 0) {
      console.error("該当するユーザー情報が見つかりません。");
      alert("ユーザー情報が見つかりません。");
      return null;
    }

    // ユーザー情報を取得
    const userProfile = users[0];

    // 必要な情報を画面に描画
    const userIcon = userProfile.icon && userProfile.icon.trim() ? userProfile.icon.trim() : "../asset/avatar.png";
    const userName = userProfile.name ? userProfile.name : "Anonymous";
    const userIntroduction = userProfile.introduction ? userProfile.introduction : "説明文が設定されていません。";

    profileSection.innerHTML = `
      <div class="bg-white shadow rounded-lg p-6 space-y-4">
        <div class="flex justify-between items-center pb-6">
          <div class="flex items-center space-x-4">
            <!-- ユーザーアイコン -->
            <img src="${userIcon}" alt="User Avatar" class="w-24 h-24 rounded-full">
            <div>
              <!-- ユーザー名 -->
              <h4 class="text-gray-700 font-bold text-xl">${userName}</h4>
              <!-- メールアドレス -->
              <span class="text-gray-500 text-lg">${userProfile.email}</span>
            </div>
          </div>
          <!-- 編集ボタン -->
          <button id="editProfileButton" class="hover:text-blue-500">
            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path>
            </svg>
          </button>
        </div>
        <div>
          <!-- ユーザー紹介文 -->
          <p class="text-gray-600 text-sm">${userIntroduction}</p>
        </div>
      </div>
    `;

    // 編集ボタンにイベントリスナーを設定
    const editButton = profileSection.querySelector("#editProfileButton");
    if (editButton) {
      editButton.addEventListener("click", () => editProfile(userProfile.email));
    }

    // ユーザードキュメントIDを返す
    return userProfile.id;
  } catch (error) {
    console.error("ユーザー情報の取得中にエラーが発生しました:", error.message);
    alert("ユーザー情報の取得に失敗しました。");
    return null;
  }
}

/**
 * Firestore から指定されたユーザーの投稿を取得し、画面に表示する関数
 * @param {string} userId Firestore のユーザードキュメントID
 */
export async function loadUserPosts(userId) {
  if (!postsContainer) {
    console.warn("postsContainer が見つからないため、投稿一覧の表示をスキップします。");
    return;
  }

  clearPostsContainer();

  try {
    const posts = await firestore.getDocuments("posts");

    // ユーザーの投稿をフィルタリングし、降順でソート
    const userPosts = posts
      .filter((post) => post.userId === `users/${userId}`)
      .sort((a, b) => b.updated.toMillis() - a.updated.toMillis());

    // 投稿を一つずつ描画
    for (const post of userPosts) {
      const postElement = await createPostElement(post);
      if (postElement) {
        postsContainer.appendChild(postElement);
      }
    }
  } catch (error) {
    console.error("投稿の取得中にエラーが発生しました:", error.message);
    alert("投稿の取得に失敗しました。");
  }
}

/**
 * 投稿エリアをクリアする関数
 */
function clearPostsContainer() {
  if (!postsContainer) return;
  while (postsContainer.firstChild) {
    postsContainer.removeChild(postsContainer.firstChild);
  }
}

/**
 * アカウントプロフィールを編集する関数
 * @param {string} email 編集対象のユーザーのメールアドレス
 */
function editProfile(email) {
  alert(`アカウントプロフィールの編集機能は未実装です。email: ${email}`);
}

/**
 * 初期化関数
 * onUserChange イベントを監視してデータをロード
 */
onUserChange(async () => {
  if (!profileSection || !postsContainer) {
    console.warn("必要なDOM要素が見つからないため、初期化をスキップします。");
    return;
  }

  const userId = await loadUserProfile();
  if (userId) {
    await loadUserPosts(userId);
  }
});
