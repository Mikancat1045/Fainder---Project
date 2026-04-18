// gateway.js の冒頭
const firebaseConfig = {
    apiKey: "AIzaSyAYsZXBexcfcDzR2XZv7lshV-aDwKUHQXQ",
    authDomain: "fainder-snsapp.firebaseapp.com",
    projectId: "fainder-snsapp",
    storageBucket: "fainder-snsapp.firebasestorage.app",
    messagingSenderId: "536723303370",
    appId: "1:536723303370:web:09317f23f335d1a6bf3d33"
};

// 二重初期化エラー（System Errorの主因）を防ぐ
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); 
}

const db = firebase.firestore();
const auth = firebase.auth();

async function verifyGate() {
    const inputPass = document.getElementById('gate-pass').value;
    
    try {
        // ここでエラーが出ると「System Error」に飛ぶ
        const doc = await db.collection("secrets").doc("gate").get();
        
        if (doc.exists && inputPass === doc.data().pass) {
            document.cookie = "mikan_access=true; max-age=86400; path=/";
            launchSNS();
        } else {
            alert("Access Denied.");
        }
    } catch (e) {
        console.error("Firebaseの読み取りに失敗:", e); // ブラウザのF12コンソールに詳細が出る
        alert("System Error: Firebaseとの接続に失敗しました。");
    }
}

window.addEventListener('load', () => {
    if (document.cookie.includes("mikan_access=true")) {
        launchSNS();
    }
});
