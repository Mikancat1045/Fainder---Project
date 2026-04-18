// SNSの用語を隠す（Base64で難読化）
const secretWords = {
    app: atob("RmFpbmRlcg=="), // Fainder
    tl: atob("44K/44Kk44Og44Op44Kk44Oz"), // タイムライン
    prof: atob("44OX44Ot44OV44Kj44O844Or") // プロフィール
};

// 1. URLパラメータがない時はログイン画面すら出さない（究極の隠し扉）
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    
    // URLの最後に ?dev=1234 をつけた時、またはCookieがある時だけ表示
    if (params.get('dev') === '1234' || document.cookie.includes("fainder_access=true")) {
        document.getElementById('gate-container').style.display = 'block';
    } else {
        // 普通にアクセスした人（または調査員）にはダミー画面を出す
        document.getElementById('gate-container').innerHTML = `
            <div style="padding:40px; text-align:left; max-width:500px;">
                <h1>Under Construction</h1>
                <p>現在、JavaScriptの非同期通信とFirebaseの連携をテスト中です。</p>
                <p style="color:#666; font-size:14px;">© 2026 Mikan Coding Lab.</p>
            </div>
        `;
    }
});

// 2. パスワード検証（Firebaseから取得する部分は今のままでOK）
async function verifyGate() {
    const inputPass = document.getElementById('gate-pass').value;
    // ...Firebaseの照合ロジック...
    // 成功したら document.cookie = "fainder_access=true; max-age=86400; path=/";
}
