const _K = "mikan2026"; 

// 同意ボタンを押した時
function nextStep() {
    const s1 = document.getElementById('step-1');
    const s2 = document.getElementById('step-2');
    if(s1 && s2) {
        s1.style.display = 'none';
        s2.style.display = 'block';
    }
}

// パスワードチェック
function checkAccess() {
    const val = document.getElementById('access-input').value;
    if (val === _K) {
        buildSNS();
    } else {
        alert("トークンが違います");
    }
}

// SNSの組み立て
function buildSNS() {
    const body = document.getElementById('main-body');
    
    // 背景色を即座に変更
    body.style.backgroundColor = "#131314";

    // SNSの本体（HTMLとCSSのみ）
    // ※ <html>や<body>タグは含めず、中身の<div>からスタートさせます
    body.innerHTML = `
        <style>
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

        <div id="sns-wrapper">
            <header>
                <div style="font-size:20px; font-weight:bold; color:#4285f4;">Fainder</div>
            </header>
            
            <section id="home" class="page active">
                <h1>こんにちは！</h1>
                <div id="postsList">読み込み中...</div>
            </section>

            </div>
    `;

    // 最後にFirebaseなどのロジックファイルを読み込む
    const script = document.createElement('script');
    script.src = "core-sync.js"; 
    document.body.appendChild(script);
}
