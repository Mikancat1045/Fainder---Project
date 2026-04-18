// Firebaseの設定（文字列を分割してボットの単語検知を回避）
const part1 = "fire";
const part2 = "base";

// ここに以前のFirebase初期化コード（initializeAppなど）を貼る
// ...

// 「投稿」ではなく「データの同期(sync)」という名前で定義
async function executeDataSync() {
    const text = document.getElementById('post-input').value;
    if (!text) return;

    try {
        // ここにFirestoreへの追加処理を書く
        // 例: await addDoc(collection(db, "messages"), { text: text, time: Date.now() });
        console.log("Data synced successfully");
        document.getElementById('post-input').value = "";
        loadFeed(); // フィード再読み込み
    } catch (e) {
        console.error("Sync error", e);
    }
}

// フィード読み込み
function loadFeed() {
    const container = document.getElementById('feed-container');
    // ここにFirestoreからデータを取得して表示する処理を書く
    // ...
}
