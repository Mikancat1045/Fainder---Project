// SNSの用語を隠す（Base64で難読化）
const secretWords = {
    app: atob("RmFpbmRlcg=="), // Fainder
    tl: atob("44K/44Kk44Og44Op44Kk44Oz"), // タイムライン
    prof: atob("44OX44Ot44OV44Kj44O844Or") // プロフィール
};

// 1. URLパラメータがない時はログイン画面すら出さない（究極の隠し扉）
// gateway.js
window.addEventListener('load', () => { // DOMContentLoadedより確実な 'load' を使用
    if (document.cookie.includes("fainder_access=true")) {
        // 少しだけ待ってから実行（HTMLの構築を確実にするため）
        setTimeout(() => {
            launchSNS();
        }, 100); 
    }
});

// 2. パスワード検証（Firebaseから取得する部分は今のままでOK）
async function verifyGate() {
    const inputPass = document.getElementById('gate-pass').value;
    // ...Firebaseの照合ロジック...
    // 成功したら document.cookie = "fainder_access=true; max-age=86400; path=/";
}
