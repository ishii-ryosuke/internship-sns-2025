const openModalButton = document.getElementById("openModal");
const cancelModalButton = document.getElementById("cancelModal");
const postModalButton = document.getElementById("postModal");
const modalPanel = document.getElementById("modalPanel");
const modalBackdrop = document.getElementById("modalBackdrop");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");

/**
 * モーダルを表示する
 */
function showModal() {
  modalBackdrop.classList.remove("hidden");
  modalPanel.parentElement.classList.remove("hidden");
  modalPanel.classList.remove("hidden");
}

/**
 * モーダルを非表示にする
 */
function hideModal() {
  modalBackdrop.classList.add("hidden");
  modalPanel.parentElement.classList.add("hidden");
  modalPanel.classList.add("hidden");
  clearModalFields();
}

/**
 * モーダルの入力内容をクリアする
 */
function clearModalFields() {
  titleInput.value = "";
  bodyInput.value = "";
}

/**
 * モーダルを開く
 */
function postModal() {
  const title = titleInput.value;
  const body = bodyInput.value;

  if (!title || !body) {
    alert("タイトルと本文を入力してください");
    return;
  }

  // 投稿内容を送信する
  console.log("Title:", title);
  console.log("Body:", body);

  // モーダルを非表示にする
  hideModal();
}

// 「Post」ボタンがクリックされたときの処理を登録
openModalButton.addEventListener("click", showModal);
// モーダルの「Cancel」ボタンがクリックされたときの処理を登録
cancelModalButton.addEventListener("click", hideModal);
// モーダルの「Post」ボタンがクリックされたときの処理を登録
postModalButton.addEventListener("click", postModal);
