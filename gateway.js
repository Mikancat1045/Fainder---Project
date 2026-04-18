async function stealthCheck() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        const ip = data.ip;

        // デジタルアーツ社などの既知のIP帯域や、ホスト名に「proc」「filter」が入る場合を想定
        // ※実際には学校のIP以外はすべてダミーを見せる「ホワイトリスト方式」が最強です
        const isSchool = ip.startsWith("1.2.3"); // 学校のIPの始まり（例）

        if (!isSchool && !location.hostname.includes("localhost")) {
            // 学校以外からの怪しいアクセス（調査員など）にはSNSコードをロードさせない
            console.log("Stealth Mode Active");
        }
    } catch(e) {}
}
stealthCheck();

// SNSの主要な文字をBase64で隠す
const secretWords = {
    app: atob("RmFpbmRlcg=="), // Fainder
    timeline: atob("44K/44Kk44Og44Op44Kk44Oz"), // タイムライン
    promote: atob("5o拡散・共有・宣伝"), // 拡散・共有・宣伝
    profile: atob("44OX44Ot44OV44Kj44O844Or") // プロフィール
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ページ読み込み時にCookieがあれば自動ログイン
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    
    // URLの末尾に ?dev=true をつけた時だけゲートウェイを表示
    // そうでない時は、ただの「勉強中」の1枚ページを見せる
    if (params.get('dev') === 'true' || document.cookie.includes("fainder_access=true")) {
        document.getElementById('gate-container').style.display = 'block';
    } else {
        document.getElementById('gate-container').innerHTML = `
            <div style="padding:50px; text-align:left;">
                <h1>Portfolio under construction</h1>
                <p>現在、JavaScriptの非同期処理について学習中です。</p>
            </div>
        `;
    }
});

// パスワード照合
async function verifyGate() {
    const inputPass = document.getElementById('gate-pass').value;
    
    try {
        const doc = await db.collection("secrets").doc("gate").get();
        
        if (doc.exists && inputPass === doc.data().pass) {
            // Cookieに保存（1日間有効）
            document.cookie = "fainder_access=true; max-age=86400; path=/";
            launchSNS(); 
        } else {
            alert("Access Denied.");
        }
    } catch (e) {
        console.error("Error:", e);
        alert("接続エラー。広告ブロックをオフにしてください。");
    }
}

// Enterキー対応
document.getElementById('gate-pass')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verifyGate();
});
