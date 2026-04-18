// --- 1. 定数と初期チェック ---
const _TOKEN_KEY = "fainder_access_token";
const _VALID_PASS = "mikan2026"; // 変更不可のパスワード

// ページ読み込み時にストレージを確認
window.onload = () => {
    const savedToken = localStorage.getItem(_TOKEN_KEY);
    if (savedToken === _VALID_PASS) {
        // 保存されたパスワードが正しければ即座にSNSビルド
        buildSNS();
    }
};

// --- 2. 認証ロジック ---
function checkAccess() {
    const input = document.getElementById('access-input');
    const saveCheckbox = document.getElementById('save-token');
    const msg = document.getElementById('auth-msg');

    if (input.value === _VALID_PASS) {
        // ボット対策：成功時に一瞬待機して人間らしさを演出
        msg.innerText = "認証に成功しました...";
        
        if (saveCheckbox.checked) {
            localStorage.setItem(_TOKEN_KEY, _VALID_PASS); // Cookieの代わりに保存
        }
        
        setTimeout(() => {
            buildSNS();
        }, 800);
    } else {
        msg.style.color = "#d96570";
        msg.innerText = "トークンが正しくありません";
        input.value = "";
    }
}

// --- 3. SNSの組み立て（認証後のみ実行） ---
function buildSNS() {
    // 認証画面を消去
    document.getElementById('auth-container').remove();
    
    const root = document.getElementById('app-root');
    root.innerHTML = `
        <header>
            <div style="font-weight:bold; font-size:1.2rem;">Fainder</div>
            <img id="user-icon" style="width:32px; height:32px; border-radius:50%; margin-left:auto; display:none;">
            <button onclick="logoutApp()" style="width:auto; padding:5px 15px; margin-left:15px; font-size:12px; background:#333;">切断</button>
        </header>

        <section id="home" class="page active">
            <h1 class="gradient-text">こんにちは、<span id="display-name">Guest</span></h1>
            <button onclick="showPage('timeline')">タイムラインへ</button>
        </section>

        <section id="timeline" class="page">
            <h2>Timeline</h2>
            <textarea id="postText" placeholder="メッセージを入力..." style="width:100%; height:80px; background:#28292a; color:white; border-radius:12px; padding:10px; border:1px solid #444;"></textarea>
            <button onclick="addPost()" style="margin-top:10px;">送信</button>
            <div id="postsList" style="margin-top:20px;"></div>
        </section>
    `;

    injectFirebase();
}

// --- 4. Firebase連携 ---
function injectFirebase() {
    const scripts = [
        "https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js",
        "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth-compat.js",
        "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore-compat.js"
    ];

    let count = 0;
    scripts.forEach(src => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => { if (++count === scripts.length) startApp(); };
        document.head.appendChild(s);
    });
}

function startApp() {
    const config = {
        apiKey: "AIzaSyAYsZXBexcfcDzR2XZv7lshV-aDwKUHQXQ",
        authDomain: "fainder-snsapp.firebaseapp.com",
        projectId: "fainder-snsapp",
        storageBucket: "fainder-snsapp.firebasestorage.app",
        messagingSenderId: "536723303370",
        appId: "1:536723303370:web:09317f23f335d1a6bf3d33"
    };
    
    if (!firebase.apps.length) firebase.initializeApp(config);
    const auth = firebase.auth();
    const db = firebase.firestore();

    window.showPage = (id) => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        if(id === 'timeline') loadPosts(db);
    };

    window.addPost = async () => {
        const text = document.getElementById('postText').value;
        if (!text.trim()) return;
        await db.collection("posts").add({
            name: auth.currentUser ? auth.currentUser.displayName : "Guest",
            content: text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById('postText').value = "";
    };

    function loadPosts(db) {
        db.collection("posts").orderBy("createdAt", "desc").onSnapshot(snap => {
            const list = document.getElementById('postsList');
            list.innerHTML = "";
            snap.forEach(doc => {
                const d = doc.data();
                list.innerHTML += `<div class="post-card"><strong>${d.name}</strong><p>${d.content}</p></div>`;
            });
        });
    }

    // ログアウト（ストレージも削除）
    window.logoutApp = () => {
        localStorage.removeItem(_TOKEN_KEY);
        location.reload();
    };

    auth.onAuthStateChanged(user => {
        if(user) {
            document.getElementById('display-name').innerText = user.displayName;
            const icon = document.getElementById('user-icon');
            icon.src = user.photoURL;
            icon.style.display = "block";
        }
    });
}
