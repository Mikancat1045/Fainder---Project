const KEY = "mikan2026"; // パスワード

function nextStep() {
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
}

function checkAccess() {
    const input = document.getElementById('pass').value;
    
    // ボット判定（簡易版）
    if (navigator.userAgent.toLowerCase().includes("bot")) {
        alert("Access Denied");
        return;
    }

    if (input === KEY) {
        buildSNSPage();
    } else {
        alert("Key Incorrect");
    }
}

function buildSNSPage() {
    // 【最重要】bodyの中身を完全に消去する
    const body = document.getElementById('main-body');
    body.innerHTML = ""; 
    
    // SNSの新しいHTMLを注入する
    const snsHTML = `
        <div id="sns-container" style="background: #121212; color: white; min-height: 100vh; padding: 20px; font-family: Arial;">
            <header style="border-bottom: 1px solid #333; padding-bottom: 10px; display: flex; justify-content: space-between;">
                <h1 style="color: #4caf50; margin: 0;">Fainder SNS</h1>
                <button onclick="location.reload()" style="background:none; color:#888; border:none; cursor:pointer;">Logout</button>
            </header>
            
            <div id="post-box" style="margin-top: 20px;">
                <textarea id="msg-input" placeholder="今何してる？" style="width:100%; height:100px; background:#1e1e1e; color:white; border:1px solid #333; padding:10px; border-radius:8px;"></textarea>
                <button onclick="sendData()" style="width:100%; padding:12px; background:#4caf50; color:white; border:none; border-radius:8px; margin-top:10px; font-weight:bold; cursor:pointer;">投稿する</button>
            </div>

            <div id="timeline" style="margin-top: 30px;">
                <div style="border:1px solid #333; padding:15px; border-radius:8px; margin-bottom:10px;">
                    <small style="color:#888;">System</small>
                    <p>Welcome to Fainder! ここに投稿が表示されます。</p>
                </div>
            </div>
        </div>
    `;
    
    body.innerHTML = snsHTML;

    // SNS用のロジック（Firebaseなど）を動的に読み込む
    const script = document.createElement('script');
    script.src = "sync-module.js"; // 実際のSNS機能が入ったファイル
    document.body.appendChild(script);

    // 背景色などをSNS用に上書き
    document.body.style.backgroundColor = "#121212";
}
