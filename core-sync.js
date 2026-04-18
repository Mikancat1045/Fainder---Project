// Firebase設定などは以前のものを使用
const cfg = {
    apiKey: "AIza" + "Sy" + "...", // 分割して記述
    // ...その他の設定
};

// 投稿処理（「データのプッシュ」という名称に）
async function pushData() {
    const txt = document.getElementById('p-input').value;
    if(!txt) return;

    try {
        console.log("Synchronizing data...");
        // ここにFirestoreの保存処理を書く
        // await addDoc(...);
        document.getElementById('p-input').value = "";
        refreshList();
    } catch(e) {
        console.error(e);
    }
}

// タイムライン取得（「リストの更新」という名称に）
function refreshList() {
    const list = document.getElementById('p-list');
    // ここにFirestoreからデータを取得して表示する処理を書く
}

// 初期実行
refreshList();
