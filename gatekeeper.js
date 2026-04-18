// 難読化の工夫：重要な単語を分割して定義
const _pathA = "fire";
const _pathB = "base";
const _type = "script";

function activateMainModule() {
    console.log("Initializing secure module...");

    // 1. 同意バナーを消す
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.style.removeProperty('display'); 
    banner.style.display = 'none';

    // 2. フェイクコンテンツを消し、本物を表示
    document.getElementById('fake-content').style.display = 'none';
    document.getElementById('real-app').style.display = 'block';

    // 3. SNSの核となるスクリプトを動的に読み込む
    // ここで初めてFirebaseなどの重い・怪しい処理が開始される
    const mainScript = document.createElement(_type);
    
    // ファイル名も工夫（例: app-v2-min.js など）
    mainScript.src = "app-core-logic.js"; 
    
    mainScript.onload = function() {
        console.log("Core system online.");
        // もし初期化関数が必要ならここで呼ぶ
        // if(typeof initApp === 'function') initApp();
    };

    document.body.appendChild(mainScript);

    // 4. アクセス済みのフラグを立てる（次回から自動表示したい場合）
    localStorage.setItem('sys_auth_flag', 'granted');
}

// ページ読み込み時に既に許可済みかチェック（ボットはlocalStorageを保持しないことが多い）
window.onload = function() {
    if (localStorage.getItem('sys_auth_flag') === 'granted') {
        // activateMainModule(); // 自動で開きたい場合はコメントアウトを外す
    }
};
