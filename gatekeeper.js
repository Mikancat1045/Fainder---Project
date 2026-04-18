const _K = "mikan2026"; 

// --- 門番の基本機能 ---
function nextStep() {
    const s1 = document.getElementById('step-1');
    const s2 = document.getElementById('step-2');
    if (s1 && s2) {
        s1.style.display = 'none';
        s2.style.display = 'block';
    }
}

function checkAccess() {
    const input = document.getElementById('access-input');
    if (input && input.value === _K) {
        buildSNS();
    } else {
        alert("トークンが違います。");
    }
}

// --- SNSをゼロから組み立てる関数 ---
function buildSNS() {
    const body = document.getElementById('main-body');
    
    // 1. 画面をリセットし、SNS用のコンテナを作成
    body.innerHTML = '<div id="appBody"></div>';
    const appBody = document.getElementById('appBody');
    body.style.backgroundColor = "#131314";

    // 2. SNSのHTMLとCSSを注入
    appBody.innerHTML = `
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
            body { margin: 0; background-color: var(--user-custom-bg); color: var(--text-gemini); font-family: "Google Sans", sans-serif; transition: background 0.5s ease; overflow-x: hidden; }
            header { position: fixed; top: 0; width: 100%; height: 64px; background-color: var(--nav-bg); display: flex; align-items: center; padding: 0 16px; z-index: 1000; border-bottom: 1px solid #333; box-sizing: border-box; }
            .menu-btn { background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 8px; }
            .app-brand { display: flex; align-items: center; gap: 12px; cursor: pointer; margin-left: 4px; }
            #app-main-logo { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; }
            .app-name { font-size: 20px; font-weight: 500; }
            .search-container { margin-left: auto; margin-right: 15px; }
            .search-bar { background: #28292a; border: none; color: white; padding: 8px 15px; border-radius: 20px; outline: none; width: 120px; transition: 0.3s; }
            .search-bar:focus { width: 200px; background: #333; }
            #header-user-icon { width: 34px; height: 34px; border-radius: 50%; cursor: pointer; object-fit: cover; border: 1px solid #444; display: none; }
            #sidebar { position: fixed; top: 0; left: -280px; width: 260px; height: 100%; background: var(--sidebar-bg); z-index: 1200; padding-top: 80px; transition: 0.3s; }
            .sidebar-open #sidebar { transform: translateX(280px); }
            #overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1100; }
            .page { display: none; padding: 80px 20px; max-width: 800px; margin: 0 auto; }
            .page.active { display: block; animation: fadeIn 0.4s ease; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .timeline-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; overflow-x: auto; }
            .tab-btn, .prof-tab-btn { background: none; border: none; color: #888; padding: 8px 16px; cursor: pointer; border-radius: 20px; transition: 0.2s; white-space: nowrap; }
            .tab-btn.active, .prof-tab-btn.active { background: #303134; color: #8ab4f8; }
            .post-input-container { background: #1e1f20; border: 1px solid #444746; border-radius: 24px; padding: 12px 16px; margin-bottom: 30px; }
            .post-input-wrapper { display: flex; align-items: center; gap: 12px; }
            #postText, #promoteText { flex: 1; background: none; border: none; color: white; font-size: 16px; outline: none; resize: none; }
            .post-card { background: var(--card-bg); border-radius: 16px; padding: 16px; margin-bottom: 15px; border: 1px solid #333; position: relative; }
            .user-icon-img { width: 40px; height: 40px; border-radius: 50%; margin-right: 12px; object-fit: cover; cursor: pointer; }
            .del-btn { position: absolute; top: 10px; right: 10px; background: none; border: none; color: #666; cursor: pointer; }
            .tag-badge { display: inline-block; background: #333; color: #8ab4f8; padding: 2px 10px; border-radius: 12px; font-size: 12px; margin-bottom: 8px; border: 1px solid #444; }
            .promote-card { border-left: 4px solid #f4b400 !important; }
            .list-item { display: flex; align-items: center; justify-content: space-between; background: #1e1f20; padding: 12px; border-radius: 12px; margin-bottom: 8px; border: 1px solid #333; }
            .list-item-info { display: flex; align-items: center; gap: 10px; cursor: pointer; }
            .sponsor-msg { font-size: 12px; color: #aaa; margin-top: 4px; font-style: italic; }
            .stat-container { display: flex; justify-content: center; gap: 20px; margin: 15px 0; }
            .stat-item { text-align: center; cursor: pointer; }
            .stat-value { font-size: 20px; font-weight: bold; color: #8ab4f8; }
            .stat-label { font-size: 12px; color: #888; }
            .btn-follow { background: #4285f4; color: white; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; }
            .btn-block { background: #333; color: #d96570; border: 1px solid #d96570; padding: 8px 20px; border-radius: 20px; cursor: pointer; }
            .btn-sponsor { background: #f4b400; color: #000; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; font-weight: bold; }
        </style>

        <header>
            <button class="menu-btn" onclick="toggleSidebar()">≡</button>
            <div class="app-brand" onclick="showPage('home')">
                <img id="app-main-logo" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80" alt="App Logo">
                <span class="app-name">Fainder</span>
            </div>
            <div class="search-container">
                <input type="text" id="searchInput" class="search-bar" placeholder="検索...">
            </div>
            <img id="header-user-icon" onclick="showPage('settings')" alt="User Icon">
        </header>

        <div id="overlay" onclick="toggleSidebar()"></div>

        <nav id="sidebar">
            <div onclick="showPage('home')" style="padding:15px 25px; cursor:pointer;"> ホーム</div>
            <div onclick="showPage('timeline')" style="padding:15px 25px; cursor:pointer;"> タイムライン</div>
            <div onclick="showPage('promote')" style="padding:15px 25px; cursor:pointer;"> 拡散・宣伝</div>
            <div id="sidebar-my-profile" onclick="openMyProfile()" style="padding:15px 25px; cursor:pointer; display:none;"> プロフィール</div>    
            <div onclick="showPage('notifications')" style="padding:15px 25px; cursor:pointer;"> 通知</div>
            <div onclick="showPage('settings')" style="padding:15px 25px; cursor:pointer;"> 設定</div>
            <div id="loginBtn" onclick="loginWithGoogle()" style="margin: 10px 20px; padding:12px; cursor:pointer; background:white; color:#757575; border-radius:4px; display:flex; align-items:center; font-weight:500; border:1px solid #dadce0;">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" style="width:18px; margin-right:10px;">
                Googleでログイン
            </div>
        </nav>

        <section id="home" class="page active">
            <h1 style="background:var(--accent-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:40px;">こんにちは、<span id="display-name">Guest</span></h1>
            <p style="font-size:18px; color:#8ab4f8;">Fainderへようこそ！</p>
        </section>

        <section id="timeline" class="page">
            <h2>タイムライン</h2>
            <div class="post-input-container">
                <div class="post-input-wrapper">
                    <img id="user-post-icon" src="https://api.dicebear.com/7.x/avataaars/svg?seed=guest" class="user-icon-img">
                    <textarea id="postText" placeholder="今何してる？" rows="1" oninput="autoResize(this)"></textarea>
                    <button onclick="addPost()" style="background:none; border:none; color:#8ab4f8; cursor:pointer;">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                </div>
            </div>
            <div id="postsList"></div>
        </section>

        <section id="promote" class="page">
            <h2>🚀 拡散・共有・宣伝</h2>
            <div id="promoteList"></div>
        </section>

        <section id="profile" class="page">
            <div id="prof-header" style="text-align:center; padding:20px; background:#1e1f20; border-radius:16px;">
                <img id="prof-icon" style="width:80px; height:80px; border-radius:50%;">
                <h2 id="prof-name">---</h2>
                <div id="prof-actions"></div>
            </div>
            <div id="profile-content-area"></div>
        </section>

        <section id="settings" class="page">
            <h2>設定</h2>
            <button onclick="logoutAction()" style="padding:10px; background:#d96570; border:none; color:white; border-radius:8px;">ログアウト</button>
        </section>
    `;

    // 3. SNSのJavaScriptロジックとFirebaseライブラリを注入
    injectScripts();
}

function injectScripts() {
    // Firebase SDKの読み込み
    const scripts = [
        "https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js",
        "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth-compat.js",
        "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore-compat.js"
    ];

    let loadedCount = 0;
    scripts.forEach(src => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => {
            loadedCount++;
            if (loadedCount === scripts.length) startSNSLogic();
        };
        document.head.appendChild(s);
    });
}

function startSNSLogic() {
    const script = document.createElement('script');
    script.textContent = `
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

        // ページ切り替えをグローバル関数に
        window.showPage = function(id) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            if(id === 'timeline') loadPosts();
        };

        window.toggleSidebar = function() {
            document.getElementById('appBody').classList.toggle('sidebar-open');
            document.getElementById('overlay').style.display = document.getElementById('appBody').classList.contains('sidebar-open') ? 'block' : 'none';
        };

        window.addPost = async function() {
            const user = auth.currentUser;
            const text = document.getElementById('postText').value;
            if (!text.trim()) return;
            await db.collection("posts").add({
                uid: user ? user.uid : "guest_user",
                name: user ? user.displayName : "ゲスト",
                content: text,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            document.getElementById('postText').value = "";
        };

        window.loadPosts = function() {
            db.collection("posts").orderBy("createdAt", "desc").onSnapshot(snap => {
                const list = document.getElementById('postsList');
                list.innerHTML = "";
                snap.forEach(doc => {
                    const d = doc.data();
                    list.innerHTML += \`<div class="post-card"><strong>\${d.name}</strong><p>\${d.content}</p></div>\`;
                });
            });
        };

        window.loginWithGoogle = () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        window.logoutAction = () => { auth.signOut(); location.reload(); };

        auth.onAuthStateChanged(user => {
            if(user) document.getElementById('display-name').innerText = user.displayName;
        });
    `;
    document.body.appendChild(script);
}
