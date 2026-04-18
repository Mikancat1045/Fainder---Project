// --- 1. 認証設定 ---
const _K = "mikan2026"; 

function nextStep() {
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
}

function checkAccess() {
    const input = document.getElementById('access-input');
    if (input && input.value === _K) {
        buildSNS();
    } else {
        alert("トークンが違います。");
    }
}

// --- 2. SNS構造の流し込み ---
function buildSNS() {
    const body = document.getElementById('main-body');
    body.innerHTML = `
        <header>
            <div class="app-brand" onclick="showPage('home')">
                <span style="font-size:20px; font-weight:bold; margin-left:10px;">Fainder</span>
            </div>
            <img id="header-user-icon" style="width:34px; height:34px; border-radius:50%; margin-left:auto; cursor:pointer; display:none;">
        </header>

        <section id="home" class="page active">
            <h1 class="gradient-text">こんにちは、<span id="display-name">Guest</span></h1>
            <p>Fainderへようこそ！</p>
            <button onclick="showPage('timeline')">タイムラインを見る</button>
        </section>

        <section id="timeline" class="page">
            <h2>タイムライン</h2>
            <textarea id="postText" placeholder="今何してる？" style="width:100%; background:#28292a; color:white; border:1px solid #444; border-radius:8px; padding:10px;"></textarea>
            <button onclick="addPost()" style="margin-top:10px;">投稿する</button>
            <div id="postsList" style="margin-top:20px;"></div>
        </section>
    `;
    
    injectFirebase();
}

// --- 3. Firebase SDKの読み込み ---
function injectFirebase() {
    const scripts = [
        "https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js",
        "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth-compat.js",
        "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore-compat.js"
    ];

    let loaded = 0;
    scripts.forEach(src => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => { if (++loaded === scripts.length) initApp(); };
        document.head.appendChild(s);
    });
}

// --- 4. アプリロジック (Firebase) ---
function initApp() {
    const firebaseConfig = {
        apiKey: "AIzaSyAYsZXBexcfcDzR2XZv7lshV-aDwKUHQXQ",
        authDomain: "fainder-snsapp.firebaseapp.com",
        projectId: "fainder-snsapp",
        storageBucket: "fainder-snsapp.firebasestorage.app",
        messagingSenderId: "536723303370",
        appId: "1:536723303370:web:09317f23f335d1a6bf3d33"
    };
    
    firebase.initializeApp(firebaseConfig);
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
            name: auth.currentUser ? auth.currentUser.displayName : "ゲスト",
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

    // 自動ログインチェック
    auth.onAuthStateChanged(user => {
        if(user) {
            document.getElementById('display-name').innerText = user.displayName;
            const icon = document.getElementById('header-user-icon');
            icon.src = user.photoURL;
            icon.style.display = "block";
        }
    });
}
