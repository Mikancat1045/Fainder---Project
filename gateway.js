// gateway.js
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

async function verifyGate() {
    const inputPass = document.getElementById('gate-pass').value;
    const db = firebase.firestore();

    try {
        const doc = await db.collection("secrets").doc("gate").get();
        if (doc.exists && inputPass === doc.data().pass) {
            document.cookie = "mikan_access=true; max-age=86400; path=/";
            launchSNS(); // app.js 内の関数を起動
        } else {
            alert("コードが正しくありません");
        }
    } catch (e) {
        alert("認証エラー");
    }
}

window.addEventListener('load', () => {
    if (document.cookie.includes("mikan_access=true")) {
        launchSNS();
    }
});
