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
const db = firebase.firestore();

async function verifyGate() {
    const inputPass = document.getElementById('gate-pass').value;
    try {
        const doc = await db.collection("secrets").doc("gate").get();
        if (doc.exists && inputPass === doc.data().pass) {
            launchSNS(); 
        } else {
            alert("Access Denied.");
        }
    } catch (e) {
        console.error("Firebase読み取りエラー:", e);
        alert("システムエラーが発生しました。");
    }
}

function launchSNS() {
    document.open();
    // 💡 下の ` の直後から HTML が始まります
    document.write(`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fainder Project</title>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap" rel="stylesheet">   
    <style>
        :root {
            --bg-color: #131314;
            --nav-bg: rgba(19, 19, 20, 1);
            --text-gemini: #e3e3e3;
            --accent-gradient: linear-gradient(90deg, #4285f4, #9b72cb, #d96570);
            --sidebar-bg: #1e1f20;
            --card-bg: #1e1f20;
            --user-custom-bg: #131314;
        }
        body { margin: 0; background-color: var(--user-custom-bg); color: var(--text-gemini); font-family: "Google Sans", sans-serif; overflow-x: hidden; }
        header { position: fixed; top: 0; width: 100%; height: 64px; background-color: var(--nav-bg); display: flex; align-items: center; padding: 0 16px; z-index: 1000; border-bottom: 1px solid #333; box-sizing: border-box; }
        .menu-btn { background: none; border: none; color: white; font-size: 24px; cursor: pointer; }
        .app-brand { display: flex; align-items: center; gap: 12px; cursor: pointer; margin-left: 4px; }
        #app-main-logo { width: 32px; height: 32px; border-radius: 8px; }
        .app-name { font-size: 20px; font-weight: 500; }
        .page { display: none; padding: 80px 20px; max-width: 800px; margin: 0 auto; }
        .page.active { display: block; }
        /* サイドバーやカードのスタイルは元のまま維持 */
        #sidebar { position: fixed; top: 0; left: -280px; width: 260px; height: 100%; background: var(--sidebar-bg); z-index: 1200; padding-top: 80px; transition: 0.3s; }
        .sidebar-open #sidebar { transform: translateX(280px); }
        .post-card { background: var(--card-bg); border-radius: 16px; padding: 16px; margin-bottom: 15px; border: 1px solid #333; position: relative; }
        .user-icon-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
    </style>
</head>
<body id="appBody">
    <header>
        <button class="menu-btn" onclick="toggleSidebar()">≡</button>
        <div class="app-brand" onclick="showPage('home')">
            <img id="app-main-logo" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80">
            <span class="app-name">Fainder</span>
        </div>
    </header>

    <nav id="sidebar">
        <div onclick="showPage('home')" style="padding:15px 25px; cursor:pointer;"> ホーム</div>
        <div onclick="showPage('timeline')" style="padding:15px 25px; cursor:pointer;"> タイムライン</div>
        <div id="loginBtn" onclick="loginWithGoogle()" style="margin: 10px 20px; padding:12px; cursor:pointer; background:white; color:#757575; border-radius:4px;">Googleでログイン</div>
    </nav>

    <section id="home" class="page active">
        <h1>こんにちは、<span id="display-name">Guest</span></h1>
    </section>

    <section id="timeline" class="page">
        <h2>タイムライン</h2>
        <div id="postsList"></div>
    </section>

    <script src="https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.10.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore-compat.js"></script>

    <script>
        // ここにSNS側のロジック（auth.onAuthStateChangedなど）を記述
        // HTML内に `${d.icon}` などがある場合、JSのテンプレートリテラルと衝突するため
        // 実際のコードでは変数のエスケープ等が必要ですが、一旦単純化して貼り付けます。
        const firebaseConfigInner = {
            apiKey: "AIzaSyAYsZXBexcfcDzR2XZv7lshV-aDwKUHQXQ",
            authDomain: "fainder-snsapp.firebaseapp.com",
            projectId: "fainder-snsapp",
            storageBucket: "fainder-snsapp.firebasestorage.app",
            messagingSenderId: "536723303370",
            appId: "1:536723303370:web:09317f23f335d1a6bf3d33"
        };
        firebase.initializeApp(firebaseConfigInner);
        // ...（以下、SNS用のスクリプトを記述）
        function toggleSidebar() { document.getElementById('appBody').classList.toggle('sidebar-open'); }
        function showPage(id) { 
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(id).classList.add('active');
        }
    </script>
</body>
</html>
    `); // 💡 ここでバッククォートと閉じカッコを書く！
    document.close();
}
