import { initializeModal, showModal } from "./modal.js";

// ページの読み込みが完了したら実行されるイベントリスナー
document.addEventListener("DOMContentLoaded", async () => {
  // モーダルの初期化を行います（モーダルのHTMLを動的に挿入）
  await initializeModal();

  // 「Post」ボタンのクリックイベントを登録します
  const openModalButton = document.getElementById("openModal");

  // モーダル表示ボタンのイベントリスナー
  if (openModalButton) {
    openModalButton.addEventListener("click", showModal);
  }
});
