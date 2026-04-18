// 秘密のパスワード（ハッシュ化せず簡易版。必要ならもっと複雑にできます）
const SECRET_KEY = "mikan2026"; 

// ステップ1: クッキー同意からパスワード入力へ
function showPassStep() {
    document.getElementById('cookie-step').style.display = 'none';
    document.getElementById('pass-step').style.display = 'block';
}

// ステップ2: パスワード検証とボットチェック
function verifyAndLaunch() {
    const input = document.getElementById('access-key').value;
    const ua = navigator.userAgent.toLowerCase();
    
    // 強力なボット判定キーワード
    const botList = ["googlebot", "bingbot", "yahoobot", "baiduspider", "lighthouse", "ahrefs", "crawler"];
    const isBot = botList.some(k => ua.includes(k));

    // ボットだった場合は、パスワードが合っていてもわざと「エラー」を出す
    if (isBot) {
        alert("System Error: Access Denied.");
        return;
    }

    if (input === SECRET_KEY) {
        launchSNS();
    } else {
        alert("キーが違います。");
    }
}

function launchSNS() {
    // 門番バナーを消す
    document.getElementById('gate-container').style.display = 'none';
    
    // フェイクを消して本物を表示
    document.getElementById('fake-content').style.display = 'none';
    document.getElementById('real-app').style.display = 'block';

    // ここで初めてSNS用の重いスクリプト（Firebaseなど）を読み込む
    const script = document.createElement('script');
    script.src = "app-core-logic.js"; // 以前のSNSロジックを入れたファイル
    document.body.appendChild(script);

    // 成功フラグを保存（次回から入力を省くなら）
    sessionStorage.setItem('authorized', 'true');
}
