// gateway.js
async function checkAccess() {
    const pass = document.getElementById('entry-pass').value;
    const ua = navigator.userAgent.toLowerCase();
    const botKeywords = ["googlebot", "bingbot", "lighthouse"];

    // 1. ボット検知
    if (botKeywords.some(k => ua.includes(k))) {
        alert("Access Denied");
        return;
    }

    // 2. パスワードチェック (例: "mikan2026")
    if (pass === "mikan2026") {
        document.cookie = "access_granted=true; max-age=86400; path=/";
        initSNS(); // SNS機能の初期化
    } else {
        alert("Invalid Access Code");
    }
}

// ページ読み込み時にクッキーがあれば自動ログイン
window.onload = () => {
    if (document.cookie.includes("access_granted=true")) {
        initSNS();
    }
};
