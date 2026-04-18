// パスワード設定
const _K = "mikan2026"; 

// 同意ボタンの処理
function nextStep() {
    const s1 = document.getElementById('step-1');
    const s2 = document.getElementById('step-2');
    if (s1 && s2) {
        s1.style.display = 'none';
        s2.style.display = 'block';
    }
}

// パスワード照合
function checkAccess() {
    const input = document.getElementById('access-input');
    if (input && input.value === _K) {
        buildSNS();
    } else {
        alert("トークンが違います。");
    }
}

// SNSの再構築
function buildSNS() {
    const body = document.getElementById('main-body');
    
    // 1. 既存の画面（ダミー）を削除して背景を変更
    body.innerHTML = "";
    body.style.backgroundColor = "#131314";

    // 2. SNSのHTMLを注入
    // ※ 内部のバッククォート「`」は使用不可。もしSNS内の文字で使いたいなら「'」に書き換えてください。
    body.innerHTML = `
    <div id="sns-root">
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

            #sns-root {
                min-height: 100vh;
                background-color: var(--user-custom-bg);
                color: var(--text-gemini);
                font-family: "Google Sans", sans-serif;
            }

            header {
                position: fixed; top: 0; width: 100%; height: 64px;
                background-color: var(--nav-bg); display: flex; align-items: center;
                padding: 0 16px; z-index: 1000; border-bottom: 1px solid #333; box-sizing: border-box;
            }
            
            .page { display: none; padding: 80px 20px; max-width: 800px; margin: 0 auto; }
            .page.active { display: block; animation: fadeIn 0.4s ease; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

            /* ポストカードなどの装飾 */
            .post-card { background: var(--card-bg); border-radius: 16px; padding: 16px; margin-bottom: 15px; border: 1px solid #333; position: relative; }
            .user-icon-img { width: 40px; height: 40px; border-radius: 50%; margin-right: 12px; object-fit: cover; }
        </style>

        <header>
            <div style="font-size: 20px; font-weight: bold; background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                Fainder Project
            </div>
        </header>

        <section id="home" class="page active">
            <h1>こんにちは</h1>
            <p style="color: #8ab4f8;">最新の投稿を読み込み中...</p>
            <div id="postsList"></div>
        </section>

        </div>
    `;

    // 3. ロジックファイルの読み込み（Firebaseなどの処理）
    // 画面構築が終わった直後に実行されるようにします
    const s = document.createElement('script');
    s.src = "core-sync.js"; 
    document.body.appendChild(s);
}
