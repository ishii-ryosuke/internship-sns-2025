import FirestoreWrapper from "../firebase-wrapper/firestore.js";
import { initializeModal, showEditModal} from "./modal.js";

const firestore = new FirestoreWrapper();

/**
 * 投稿を編集する関数
 * @param {string} postId - 編集する投稿の ID
 */
export function editPost(postId) {
  showEditModal(postId);
 
}

/**
 * 投稿を削除する関数
 * @param {string} postId - 削除する投稿の ID
 */
export async function deletePost(postId) {
  alert(`投稿の削除機能は未実装です。Post ID: ${postId}`);
}

/**
 * 投稿データを HTML 要素として生成する関数
 * @param {Object} post - Firestore から取得した投稿データ
 * @returns {Promise<HTMLElement>} - 投稿データを表す HTML 要素
 */
export async function createPostElement(post) {
  if (!post || !post.userId || !post.title || !post.body) {
    console.warn("不正な投稿データ:", post);
    return null;
  }

  // 投稿データを表示する要素を作成
  const postDiv = document.createElement("div");
  postDiv.classList.add("bg-white", "shadow", "rounded-lg", "p-6", "space-y-4", "my-6");

  try {
    // 投稿者のユーザー情報を Firestore から取得
    const userDoc = await firestore.getDocument("users", post.userId.split("/")[1]);
    const userIcon = userDoc?.icon?.trim() || "../asset/avatar.png";
    const userName = userDoc?.name || "Anonymous";

    // 改行を HTML の <br> に置き換え
    const formattedBody = post.body.replace(/\n/g, "<br>");

    // 投稿データの HTML を生成
    postDiv.innerHTML = `
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <img src="${userIcon}" alt="User Avatar" class="w-10 h-10 rounded-full">
          <div>
            <h4 class="text-gray-700 font-medium">${userName}</h4>
            <span class="text-gray-500 text-sm">${FirestoreWrapper.timestampToDate(post.updated).toLocaleString()}</span>
          </div>
        </div>
        <div class="flex space-x-4 text-gray-500">
          <button class="hover:text-blue-500 edit-post-btn">
            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
          <button class="hover:text-blue-500 delete-post-btn">
            <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
      <h3 class="text-gray-800 font-bold text-lg">${post.title}</h3>
      <p class="text-gray-600 text-sm">${formattedBody}</p>
    `;

    // ボタンにイベントリスナーを設定
    const editButton = postDiv.querySelector(".edit-post-btn");
    const deleteButton = postDiv.querySelector(".delete-post-btn");

    if (editButton) {
      editButton.addEventListener("click", () => editPost(post.id));
    }

    if (deleteButton) {
      deleteButton.addEventListener("click", () => deletePost(post.id));
    }
  } catch (error) {
    console.error("投稿データの表示中にエラーが発生しました:", error.message);
  }

  return postDiv;
}
