import { createPostElement } from "./postUtils.js";
import FirestoreWrapper from "../firebase-wrapper/firestore.js";

const firestore = new FirestoreWrapper();
const postsContainer = document.querySelector(".home-posts-container");

/**
 * Firestore から投稿データを取得して表示する関数
 */
export async function loadPosts() {
  if (!postsContainer) {
    console.warn("home-posts-container が見つからないため、投稿表示をスキップします。");
    return;
  }

  try {
    const posts = await firestore.getDocuments("posts");
    posts.sort((a, b) => b.updated.toMillis() - a.updated.toMillis());

    postsContainer.innerHTML = "";

    for (const post of posts) {
      const postElement = await createPostElement(post);
      if (postElement) postsContainer.appendChild(postElement);
    }
  } catch (error) {
    console.error("投稿一覧の取得中にエラーが発生しました:", error.message);
  }
}

// 初期化関数
document.addEventListener("DOMContentLoaded", async () => {
  const currentPage = document.body.getAttribute("data-page");
  if (currentPage === "home") await loadPosts();
});
