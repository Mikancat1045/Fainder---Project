// --- 1. Firebase初期化 (ご自身の値に書き換えてください) ---
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();

// ページが読み込まれた時の処理
window.addEventListener('DOMContentLoaded', () => {
    console.log("SNS App Loaded");
    loadPosts();
});

// 投稿を読み込む関数
function loadPosts() {
    const main = document.getElementById('content');
    db.collection("posts").orderBy("createdAt", "desc").limit(20).onSnapshot(snap => {
        main.innerHTML = "";
        snap.forEach(doc => {
            const d = doc.data();
            main.innerHTML += `
                <div class="post-card">
                    <strong>${d.name || '名無し'}</strong>
                    <p>${d.content}</p>
                </div>`;
        });
    });
}

// ページ切り替え
function showPage(pageId) {
    console.log("Switching to: " + pageId);
    // ここに切り替えロジックを記述
}
