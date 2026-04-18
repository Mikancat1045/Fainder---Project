// gateway.js
const firebaseConfig = {
    apiKey: "AIzaSyAYsZXBexcfcDzR2XZv7lshV-aDwKUHQXQ",
    authDomain: "fainder-snsapp.firebaseapp.com",
    projectId: "fainder-snsapp",
    storageBucket: "fainder-snsapp.firebasestorage.app",
    messagingSenderId: "536723303370",
    appId: "1:536723303370:web:09317f23f335d1a6bf3d33"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

async function verifyGate() {
    const inputPass = document.getElementById('gate-pass').value;
    const ua = navigator.userAgent.toLowerCase();
    const bots = ["googlebot", "bingbot", "lighthouse"];

    // ボット検知（簡易）
    if (bots.some(bot => ua.includes(bot))) return;

    try {
        // Firebaseからパスワードを取得して照合
        const doc = await db.collection("secrets").doc("gate").get();
        if (doc.exists && inputPass === doc.data().pass) {
            // 成功：クッキーに保存してSNS起動
            document.cookie = "mikan_access=true; max-age=86400; path=/";
            launchSNS();
        } else {
            alert("Access Denied.");
        }
    } catch (e) {
        console.error(e);
        alert("System Error.");
    }
}

// クッキーがあれば自動でSNSを表示
window.onload = () => {
    if (document.cookie.includes("mikan_access=true")) {
        launchSNS();
    }
};
