// 1. Firebase初期化（app.jsと共通の設定）
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

// ページ読み込み時にCookieがあれば自動ログイン
window.addEventListener('DOMContentLoaded', () => {
    if (document.cookie.includes("fainder_access=true")) {
        launchSNS();
    }
});

// パスワード照合
async function verifyGate() {
    const inputPass = document.getElementById('gate-pass').value;
    
    try {
        const doc = await db.collection("secrets").doc("gate").get();
        
        if (doc.exists && inputPass === doc.data().pass) {
            // Cookieに保存（1日間有効）
            document.cookie = "fainder_access=true; max-age=86400; path=/";
            launchSNS(); 
        } else {
            alert("Access Denied.");
        }
    } catch (e) {
        console.error("Error:", e);
        alert("接続エラー。広告ブロックをオフにしてください。");
    }
}

// Enterキー対応
document.getElementById('gate-pass')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verifyGate();
});
