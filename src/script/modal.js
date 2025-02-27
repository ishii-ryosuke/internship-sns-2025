import AuthWrapper from "../firebase-wrapper/auth.js";
import FirestoreWrapper from "../firebase-wrapper/firestore.js";
import { loadPosts } from "./home.js";
import { loadUserPosts } from "./mypage.js";

const auth = new AuthWrapper();
const firestore = new FirestoreWrapper();

/**
 * 投稿用のモーダル HTML を動的に挿入する関数
 */
export async function loadPostModalHTML() {
  const modalContainer = document.createElement("div");
  modalContainer.innerHTML = `
    <div id="modalBackdrop" class="hidden fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
    <div id="modalPanel" class="hidden fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
          <div class="bg-white px-6 pb-6 pt-6 sm:p-8">
            <div class="sm:flex sm:flex-col sm:items-start space-y-6">
              <div class="flex items-center space-x-4">
                <img id="modalUserIcon" src="../asset/avatar.png" alt="User Avatar" class="w-12 h-12 rounded-full">
                <div>
                  <h4 id="modalUserName" class="text-lg font-medium text-gray-700">User Name</h4>
                  <span id="modalUserEmail" class="text-sm text-gray-500">user@example.com</span>
                </div>
              </div>
              <div class="w-full">
                <label for="title" class="block text-base font-medium text-gray-900">Title</label>
                <div class="mt-2">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    class="block w-full rounded-md bg-white px-4 py-2 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:border-indigo-500"
                  >
                </div>
              </div>
              <div class="w-full">
                <label for="body" class="block text-base font-medium text-gray-900">Body</label>
                <div class="mt-2">
                  <textarea name="body" id="body" rows="5"
                    class="block w-full rounded-md bg-white px-4 py-2 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:border-indigo-500"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
            <button type="button" id="postModal" class="inline-flex w-full justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 sm:ml-3 sm:w-auto">
              Post
            </button>
            <button type="button" id="cancelModal" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalContainer);
}

/**
 * モーダルを初期化する関数
 */
export async function initializeModal() {
  await loadPostModalHTML();

  // ログインユーザーの情報をモーダルに表示
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const users = await firestore.getDocuments("users", [
        { field: "email", operator: "==", value: user.email },
      ]);
      if (users.length > 0) {
        const loggedInUser = users[0];
        updateModalUserInfo(loggedInUser.name, loggedInUser.email, loggedInUser.icon);
      }
    }
  });

  // モーダルのキャンセルボタンと投稿ボタンにイベントを追加
  const cancelModalButton = document.getElementById("cancelModal");
  const postModalButton = document.getElementById("postModal");

  if (cancelModalButton) cancelModalButton.addEventListener("click", hideModal);
  if (postModalButton) postModalButton.addEventListener("click", post);
}

/**
 * モーダルにユーザー情報を更新する関数
 */
function updateModalUserInfo(name, email, icon) {
  const modalUserName = document.getElementById("modalUserName");
  const modalUserEmail = document.getElementById("modalUserEmail");
  const modalUserIcon = document.getElementById("modalUserIcon");

  if (modalUserName) modalUserName.textContent = name || "Unknown";
  if (modalUserEmail) modalUserEmail.textContent = email || "unknown@example.com";
  if (modalUserIcon) modalUserIcon.src = icon || "../asset/avatar.png";
}

/**
 * モーダルを表示する関数
 */
export function showModal() {
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalPanel = document.getElementById("modalPanel");

  if (modalBackdrop && modalPanel) {
    modalBackdrop.classList.remove("hidden");
    modalPanel.classList.remove("hidden");
  }
}

/**
 * モーダルを非表示にする関数
 */
export function hideModal() {
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalPanel = document.getElementById("modalPanel");

  if (modalBackdrop && modalPanel) {
    modalBackdrop.classList.add("hidden");
    modalPanel.classList.add("hidden");
  }

  clearModalFields();
}

/**
 * モーダルの入力内容をクリアする関数
 */
export function clearModalFields() {
  const titleInput = document.getElementById("title");
  const bodyInput = document.getElementById("body");

  if (titleInput) titleInput.value = "";
  if (bodyInput) bodyInput.value = "";
}

/**
 * 投稿データを作成する関数
 */
async function post() {
  const currentUser = auth.getCurrentUser();
  if (!currentUser) {
    alert("ログインしていません。再ログインしてください。");
    return;
  }

  const titleInput = document.getElementById("title");
  const bodyInput = document.getElementById("body");

  const title = titleInput?.value.trim();
  const body = bodyInput?.value.trim();

  if (!title || !body) {
    alert("タイトルと本文を入力してください");
    return;
  }

  try {
    const users = await firestore.getDocuments("users", [
      { field: "email", operator: "==", value: currentUser.email },
    ]);

    if (users.length === 0) {
      alert("ユーザー情報が見つかりません。");
      return;
    }

    const userDocumentId = users[0].id;

    const postData = {
      title,
      body,
      userId: `users/${userDocumentId}`,
      updated: FirestoreWrapper.dateToTimestamp(new Date()),
    };

    await firestore.createDocument("posts", postData);

    hideModal();
    clearModalFields();

    const currentPage = document.body.getAttribute("data-page");

    if (currentPage === "home") {
      await loadPosts();
    } else if (currentPage === "mypage") {
      await loadUserPosts(userDocumentId);
    }
  } catch (error) {
    console.error("投稿に失敗しました:", error.message);
    alert("投稿に失敗しました。");
  }
}
