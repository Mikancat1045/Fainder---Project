// SNSの用語を隠す（Base64で難読化）
const secretWords = {
    app: atob("RmFpbmRlcg=="), // Fainder
    tl: atob("44K/44Kk44Og44Op44Kk44Oz"), // タイムライン
    prof: atob("44OX44Ot44OV44Kj44O844Or") // プロフィール
};

async function verifyGate() {
    const inputPass = document.getElementById('gate-pass').value;
    
    // FirebaseのFirestoreなどでパスワードを管理している場合はここで照合
    // 今回は簡易的に '1234' でデモ
    if (inputPass === "1234") { 
        document.cookie = "fainder_access=true; max-age=86400; path=/";
        launchSNS();
    } else {
        alert("Access Keyが違います");
    }
}

// 読み込み時の自動チェック
window.addEventListener('load', () => {
    // クッキーがある、またはURLに ?dev=1234 がある場合に起動
    const params = new URLSearchParams(window.location.search);
    if (document.cookie.includes("fainder_access=true") || params.get('dev') === '1234') {
        launchSNS();
    }
});
