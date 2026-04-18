    const firebaseConfig = {
        apiKey: "AIzaSyAYsZXBexcfcDzR2XZv7lshV-aDwKUHQXQ",
        authDomain: "fainder-snsapp.firebaseapp.com",
        projectId: "fainder-snsapp",
        storageBucket: "fainder-snsapp.firebasestorage.app",
        messagingSenderId: "536723303370",
        appId: "1:536723303370:web:09317f23f335d1a6bf3d33"
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
