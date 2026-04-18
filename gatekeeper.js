const _K = "mikan2026"; 

function nextStep() {
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
}

function checkAccess() {
    const input = document.getElementById('access-input').value;
    const ua = navigator.userAgent.toLowerCase();
    
    // ボット判定
    if (["googlebot", "crawler", "spider"].some(b => ua.includes(b))) {
        alert("Busy."); return;
    }

    if (input === _K) {
        buildSNS();
    } else {
        alert("Invalid Token.");
    }
}

function buildSNS() {
    // ページを完全にリセット
    const body = document.getElementById('main-body');
    body.innerHTML = "";
    
    // あなたが作ったSNSのHTML + CSS + JSロジックを流し込む
    // ※ 内部にボット検知スクリプトも含まれています
    body.innerHTML = `
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

        body {
            margin: 0;
            background-color: var(--user-custom-bg);
            color: var(--text-gemini);
            font-family: "Google Sans", sans-serif;
            transition: background 0.5s ease;
            overflow-x: hidden;
        }

        /* --- ヘッダー & ナビ --- */
        header {
            position: fixed; top: 0; width: 100%; height: 64px;
            background-color: var(--nav-bg); display: flex; align-items: center;
            padding: 0 16px; z-index: 1000; border-bottom: 1px solid #333; box-sizing: border-box;
        }
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

        /* --- ページ管理 --- */
        .page { display: none; padding: 80px 20px; max-width: 800px; margin: 0 auto; }
        .page.active { display: block; animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* --- タイムライン & 投稿 --- */
        .timeline-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; overflow-x: auto; }
        .tab-btn, .prof-tab-btn { background: none; border: none; color: #888; padding: 8px 16px; cursor: pointer; border-radius: 20px; transition: 0.2s; white-space: nowrap; }
        .tab-btn.active, .prof-tab-btn.active { background: #303134; color: #8ab4f8; }
        
        .post-input-container { background: #1e1f20; border: 1px solid #444746; border-radius: 24px; padding: 12px 16px; margin-bottom: 30px; }
        .post-input-wrapper { display: flex; align-items: center; gap: 12px; }
        #postText, #promoteText { flex: 1; background: none; border: none; color: white; font-size: 16px; outline: none; resize: none; }
        
        .post-card { background: var(--card-bg); border-radius: 16px; padding: 16px; margin-bottom: 15px; border: 1px solid #333; position: relative; }
        .user-icon-img { width: 40px; height: 40px; border-radius: 50%; margin-right: 12px; object-fit: cover; cursor: pointer; }
        .del-btn { position: absolute; top: 10px; right: 10px; background: none; border: none; color: #666; cursor: pointer; }

        /* --- 拡散・宣伝用 --- */
        .tag-badge { display: inline-block; background: #333; color: #8ab4f8; padding: 2px 10px; border-radius: 12px; font-size: 12px; margin-bottom: 8px; border: 1px solid #444; }
        .promote-card { border-left: 4px solid #f4b400 !important; }

        /* --- リストアイテム --- */
        .list-item { display: flex; align-items: center; justify-content: space-between; background: #1e1f20; padding: 12px; border-radius: 12px; margin-bottom: 8px; border: 1px solid #333; }
        .list-item-info { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .sponsor-msg { font-size: 12px; color: #aaa; margin-top: 4px; font-style: italic; }

        /* --- プロフィール統計 --- */
        .stat-container { display: flex; justify-content: center; gap: 20px; margin: 15px 0; }
        .stat-item { text-align: center; cursor: pointer; }
        .stat-value { font-size: 20px; font-weight: bold; color: #8ab4f8; }
        .stat-label { font-size: 12px; color: #888; }

        .btn-follow { background: #4285f4; color: white; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; }
        .btn-block { background: #333; color: #d96570; border: 1px solid #d96570; padding: 8px 20px; border-radius: 20px; cursor: pointer; }
        .btn-sponsor { background: #f4b400; color: #000; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; font-weight: bold; }
        .unblock-btn { background: #d96570; color: white; border: none; padding: 5px 12px; border-radius: 15px; cursor: pointer; font-size: 12px; }
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
    <h1 style="background:var(--accent-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:40px;">
        こんにちは、<span id="display-name">Guest</span>
    </h1>
    <p style="font-size:18px; color:#8ab4f8;">Fainderへようこそ！</p>
</section>

<section id="timeline" class="page">
    <h2>タイムライン</h2>
    <div class="timeline-tabs">
        <button id="tab-new" class="tab-btn active" onclick="switchTab('new')">最新</button>
    </div>
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
    <div class="post-input-container">
        <div style="margin-bottom: 10px;">
            <label style="font-size: 12px; color: #8ab4f8;">カテゴリ：</label>
            <select id="promoteTag" style="background: #28292a; color: white; border: 1px solid #444; border-radius: 8px; padding: 5px;">
                <option value=" 動画"> 動画</option>
                <option value=" アプリ/サイト"> アプリ/サイト</option>
                <option value=" 世界情勢"> 世界情勢</option>
                <option value=" 流行り"> 流行り</option>
                <option value=" その他宣伝"> その他宣伝</option>
            </select>
        </div>
        <div class="post-input-wrapper">
            <textarea id="promoteText" placeholder="URLや説明を入力して拡散しよう！" rows="2" oninput="autoResize(this)"></textarea>
            <button onclick="addPromotePost()" style="background:none; border:none; color:#f4b400; cursor:pointer;">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
        </div>
    </div>
    <div id="promoteList"></div>
</section>

<section id="notifications" class="page">
    <h2> 通知</h2>
    <div id="notificationsList"></div>
</section>

<section id="profile" class="page">
    <div class="profile-header" style="text-align: center; padding: 30px 20px; background: #1e1f20; border-radius: 24px; margin-bottom: 20px;">
        <img id="prof-icon" src="" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid #4285f4; object-fit: cover;">
        <h2 id="prof-name" style="margin: 10px 0 5px 0;">---</h2>
        <div class="stat-container">
            <div class="stat-item" onclick="switchProfileTab('following')">
                <div id="count-following" class="stat-value">0</div>
                <div class="stat-label">フォロー</div>
            </div>
            <div class="stat-item" onclick="switchProfileTab('followers')">
                <div id="count-followers" class="stat-value">0</div>
                <div class="stat-label">フォロワー</div>
            </div>
        </div>
        <p id="prof-id" style="color: #888; font-size: 14px; margin-bottom: 15px;"></p>
        <div id="prof-actions" style="display: flex; justify-content: center; gap: 10px;"></div>
    </div>

    <div class="timeline-tabs">
        <button id="p-tab-posts" class="prof-tab-btn active" onclick="switchProfileTab('posts')">投稿</button>
        <button id="p-tab-following" class="prof-tab-btn" onclick="switchProfileTab('following')">フォロー</button>
        <button id="p-tab-followers" class="prof-tab-btn" onclick="switchProfileTab('followers')">フォロワー</button>
        <button id="p-tab-blocks" class="prof-tab-btn" onclick="switchProfileTab('blocks')" style="display:none;">ブロック</button>
        <button id="p-tab-sponsors" class="prof-tab-btn" onclick="switchProfileTab('sponsors')">スポンサー</button>
    </div>
    <div id="profile-content-area"></div>
</section>

<section id="settings" class="page">
    <h2>設定</h2>
    <div style="background:#1e1f20; padding:20px; border-radius:16px; border: 1px solid #333;">
        <label>表示名</label>
        <input type="text" id="input-name" style="width:100%; padding:10px; margin:10px 0 20px 0; background:#28292a; border:1px solid #444; color:white; border-radius:8px; box-sizing: border-box;">
        <label>アイコンURL</label>
        <input type="text" id="input-icon" style="width:100%; padding:10px; margin:10px 0 20px 0; background:#28292a; border:1px solid #444; color:white; border-radius:8px; box-sizing: border-box;">
        <button onclick="updateProfile()" style="width:100%; padding:12px; background:#4285f4; border:none; color:white; border-radius:8px; cursor:pointer; font-weight:bold;">プロフィールの保存</button>
        <button onclick="logoutAction()" style="width:100%; padding:12px; background:#d96570; border:none; color:white; border-radius:8px; margin-top:10px; cursor:pointer;">ログアウト</button>
    </div>
</section>
    `;

    // 以前のFirebase設定やSNSの関数(toggleSidebar, loadPosts等)をここに貼り付けるか、
    // 別ファイル(core-sync.js)から読み込む
    const s = document.createElement('script');
    s.src = "core-sync.js"; 
    document.body.appendChild(s);

    document.body.style.backgroundColor = "#131314";
}
