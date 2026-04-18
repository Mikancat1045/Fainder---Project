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

// --- 2. ページが読み込まれたら自動でHTMLを構築 ---
window.addEventListener('DOMContentLoaded', () => {
    // <body>の中身を完全に空にしてSNS構造を流し込む
    document.body.innerHTML = `
    <div id="sns-root" style="background-color: #131314; color: white; min-height: 100vh;">
        <header style="display:flex; align-items:center; padding:10px; background:#1e1f20; position:sticky; top:0; z-index:100;">
            <div class="app-brand" style="display:flex; align-items:center; cursor:pointer;" onclick="showPage('home')">
                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80" style="width:32px; border-radius:8px; margin-right:10px;">
                <span style="font-weight:bold; font-size:20px;">Fainder</span>
            </div>
        </header>

        <nav id="bottom-nav" style="position:fixed; bottom:0; width:100%; background:#1e1f20; display:flex; justify-content:space-around; padding:15px 0; border-top:1px solid #333;">
            <div onclick="showPage('home')" style="cursor:pointer;">🏠</div>
            <div onclick="showPage('timeline')" style="cursor:pointer;">🌐</div>
            <div onclick="showPage('promote')" style="cursor:pointer;">🚀</div>
            <div onclick="showPage('settings')" style="cursor:pointer;">⚙️</div>
        </nav>

        <main style="padding: 20px; padding-bottom: 80px;">
            <section id="home" class="page active">
                <h1>Fainderへようこそ</h1>
                <p>最新の情報をチェックしましょう。</p>
            </section>
            
            <section id="timeline" class="page" style="display:none;">
                <h2>タイムライン</h2>
                <div id="postsList">読み込み中...</div>
            </section>

            <section id="promote" class="page" style="display:none;">
                <h2>拡散・宣伝</h2>
                <div id="promoteList"></div>
            </section>

            <section id="settings" class="page" style="display:none;">
                <h2>設定</h2>
                <button onclick="loginWithGoogle()" id="loginBtn">Googleログイン</button>
                <button onclick="logoutAction()" id="logoutBtn" style="display:none;">ログアウト</button>
            </section>
        </main>
    </div>
    `;

    // 基本的なCSSを動的に追加
    const style = document.createElement('style');
    style.innerHTML = `
        body { margin: 0; font-family: sans-serif; background: #131314; }
        .page { display: none; }
        .page.active { display: block; }
        .post-card { background: #1e1f20; padding: 15px; border-radius: 12px; margin-bottom: 10px; border: 1px solid #333; }
    `;
    document.head.appendChild(style);

    initSNSLogic();
});

// --- 3. ロジック部分 ---
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function initSNSLogic() {
    auth.onAuthStateChanged(user => {
        if (user) {
            document.getElementById('loginBtn').style.display = 'none';
            document.getElementById('logoutBtn').style.display = 'block';
        }
        loadPosts();
    });
}

window.loginWithGoogle = () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
window.logoutAction = () => { auth.signOut(); location.reload(); };

function loadPosts() {
    const list = document.getElementById('postsList');
    if (!list) return;
    db.collection("posts").orderBy("createdAt", "desc").limit(20).onSnapshot(snap => {
        list.innerHTML = "";
        snap.forEach(doc => {
            const d = doc.data();
            list.innerHTML += `<div class="post-card"><strong>${d.name}</strong><p>${d.content}</p></div>`;
        });
    });
}
