// app.js
function launchSNS() {
    // ゲートウェイを消去
    document.getElementById('gate-container').remove();
    const root = document.getElementById('sns-root');
    root.style.display = 'block';
    
    // 背景などをSNS用にリセット
    document.body.style.display = 'block';
    document.body.style.height = 'auto';

    // HTMLとCSSをまるごと注入
    root.innerHTML = `
    <style>
        :root {
            --bg-color: #131314;
            --nav-bg: rgba(19, 19, 20, 1);
            --text-gemini: #e3e3e3;
            --accent-gradient: linear-gradient(90deg, #4285f4, #9b72cb, #d96570);
            --sidebar-bg: #1e1f20;
            --card-bg: #1e1f20;
            --user-custom-bg: #131314;
        }

        body {
            margin: 0;
            background-color: var(--user-custom-bg);
            color: var(--text-gemini);
            font-family: "Google Sans", sans-serif;
            transition: background 0.5s ease;
            overflow-x: hidden;
        }

        /* --- ヘッダー & ナビ --- */
        header {
            position: fixed; top: 0; width: 100%; height: 64px;
            background-color: var(--nav-bg); display: flex; align-items: center;
            padding: 0 16px; z-index: 1000; border-bottom: 1px solid #333; box-sizing: border-box;
        }
        .menu-btn { background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 8px; }
        .app-brand { display: flex; align-items: center; gap: 12px; cursor: pointer; margin-left: 4px; }
        #app-main-logo { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; }
        .app-name { font-size: 20px; font-weight: 500; }
        .search-container { margin-left: auto; margin-right: 15px; }
        .search-bar { background: #28292a; border: none; color: white; padding: 8px 15px; border-radius: 20px; outline: none; width: 120px; transition: 0.3s; }
        .search-bar:focus { width: 200px; background: #333; }
        #header-user-icon { width: 34px; height: 34px; border-radius: 50%; cursor: pointer; object-fit: cover; border: 1px solid #444; display: none; }

        #sidebar { position: fixed; top: 0; left: -280px; width: 260px; height: 100%; background: var(--sidebar-bg); z-index: 1200; padding-top: 80px; transition: 0.3s; }
        .sidebar-open #sidebar { transform: translateX(280px); }
        #overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1100; }

        /* --- ページ管理 --- */
        .page { display: none; padding: 80px 20px; max-width: 800px; margin: 0 auto; }
        .page.active { display: block; animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* --- タイムライン & 投稿 --- */
        .timeline-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; overflow-x: auto; }
        .tab-btn, .prof-tab-btn { background: none; border: none; color: #888; padding: 8px 16px; cursor: pointer; border-radius: 20px; transition: 0.2s; white-space: nowrap; }
        .tab-btn.active, .prof-tab-btn.active { background: #303134; color: #8ab4f8; }
        
        .post-input-container { background: #1e1f20; border: 1px solid #444746; border-radius: 24px; padding: 12px 16px; margin-bottom: 30px; }
        .post-input-wrapper { display: flex; align-items: center; gap: 12px; }
        #postText, #promoteText { flex: 1; background: none; border: none; color: white; font-size: 16px; outline: none; resize: none; }
        
        .post-card { background: var(--card-bg); border-radius: 16px; padding: 16px; margin-bottom: 15px; border: 1px solid #333; position: relative; }
        .user-icon-img { width: 40px; height: 40px; border-radius: 50%; margin-right: 12px; object-fit: cover; cursor: pointer; }
        .del-btn { position: absolute; top: 10px; right: 10px; background: none; border: none; color: #666; cursor: pointer; }

        /* --- 拡散・宣伝用 --- */
        .tag-badge { display: inline-block; background: #333; color: #8ab4f8; padding: 2px 10px; border-radius: 12px; font-size: 12px; margin-bottom: 8px; border: 1px solid #444; }
        .promote-card { border-left: 4px solid #f4b400 !important; }

        /* --- リストアイテム --- */
        .list-item { display: flex; align-items: center; justify-content: space-between; background: #1e1f20; padding: 12px; border-radius: 12px; margin-bottom: 8px; border: 1px solid #333; }
        .list-item-info { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .sponsor-msg { font-size: 12px; color: #aaa; margin-top: 4px; font-style: italic; }

        /* --- プロフィール統計 --- */
        .stat-container { display: flex; justify-content: center; gap: 20px; margin: 15px 0; }
        .stat-item { text-align: center; cursor: pointer; }
        .stat-value { font-size: 20px; font-weight: bold; color: #8ab4f8; }
        .stat-label { font-size: 12px; color: #888; }

        .btn-follow { background: #4285f4; color: white; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; }
        .btn-block { background: #333; color: #d96570; border: 1px solid #d96570; padding: 8px 20px; border-radius: 20px; cursor: pointer; }
        .btn-sponsor { background: #f4b400; color: #000; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; font-weight: bold; }
        .unblock-btn { background: #d96570; color: white; border: none; padding: 5px 12px; border-radius: 15px; cursor: pointer; font-size: 12px; }
    </style>

    <header>
        <button class="menu-btn" onclick="toggleSidebar()">≡</button>
        <div class="app-brand" onclick="showPage('home')">
            <img id="app-main-logo" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80" alt="App Logo">
            <span class="app-name">Fainder</span>
        </div>
        <div class="search-container">
            <input type="text" id="searchInput" class="search-bar" placeholder="検索...">
        </div>
        <img id="header-user-icon" onclick="showPage('settings')" alt="User Icon">
    </header>

    <div id="overlay" onclick="toggleSidebar()"></div>

    <nav id="sidebar">
        </nav>

    <section id="home" class="page active">
        </section>

    `;

    <script src="https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.10.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore-compat.js"></script>

    // --- ボット検知・表示切り替え ---
(function() {
    const ua = navigator.userAgent.toLowerCase();
    // 主要なボットやクローラーのキーワード
    const botKeywords = ["googlebot", "bingbot", "yahoobot", "baiduspider", "slurp", "crawler", "spider", "robot"];
    
    const isBot = botKeywords.some(keyword => ua.includes(keyword));

    if (isBot) {
        // ボットの場合：SNSの要素を消して、偽のコンテンツを挿入
        window.addEventListener('DOMContentLoaded', () => {
            document.body.innerHTML = `
                <div style="padding: 50px; text-align: center; color: #fff; background: #131314; height: 100vh;">
                    <h1>Mikan Project Portfolio</h1>
                    <p>This is a web development testing site for personal learning purposes.</p>
                    <p>Exploring modern UI design and static web technologies.</p>
                    <hr style="width: 50px; margin: 20px auto; border: 1px solid #444;">
                    <p>© 2026 Mikan Programming Lab.</p>
                </div>
            `;
        });
    }
})();
    const firebaseConfig = {
        apiKey: "AIzaSyAYsZXBexcfcDzR2XZv7lshV-aDwKUHQXQ",
        authDomain: "fainder-snsapp.firebaseapp.com",
        projectId: "fainder-snsapp",
        storageBucket: "fainder-snsapp.firebasestorage.app",
        messagingSenderId: "536723303370",
        appId: "1:536723303370:web:09317f23f335d1a6bf3d33"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    let blockedIds = [];
    let currentProfileUid = "";

    // --- ログイン状態の監視 ---
    auth.onAuthStateChanged(async user => {
        const loginBtn = document.getElementById('loginBtn');
        const headerIcon = document.getElementById('header-user-icon');
        const myProfLink = document.getElementById('sidebar-my-profile');
        const displayNameElem = document.getElementById('display-name');

        if (user) {
            loginBtn.style.display = "none";
            headerIcon.style.display = "block";
            myProfLink.style.display = "block";

            const iconUrl = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
            headerIcon.src = iconUrl;
            if(document.getElementById('user-post-icon')) document.getElementById('user-post-icon').src = iconUrl;
            displayNameElem.innerText = user.displayName || "User";

            await db.collection("users").doc(user.uid).set({
                name: user.displayName || "名無し",
                icon: iconUrl,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            const blockSnap = await db.collection("blocks").where("blockerId", "==", user.uid).get();
            blockedIds = blockSnap.docs.map(doc => doc.data().blockedId);
            
            loadPosts();
        } else {
            loginBtn.style.display = "flex";
            headerIcon.style.display = "none";
            myProfLink.style.display = "none";
            displayNameElem.innerText = "Guest";
            loadPosts();
        }
    });

    // --- ページ管理 ---
    function showPage(id) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        if (id === 'promote') loadPromotePosts();
        if (id === 'notifications') loadNotifications();
        if (document.getElementById('appBody').classList.contains('sidebar-open')) toggleSidebar();
    }

    function openMyProfile() {
        if (auth.currentUser) {
            showUserProfile(auth.currentUser.uid);
        } else {
            alert("プロフィールを表示するにはログインが必要です");
        }
    }

    // --- 通知機能の実装 ---
    async function sendNotification(targetUid, message) {
        if (!auth.currentUser || targetUid === auth.currentUser.uid) return;
        await db.collection("notifications").add({
            toUid: targetUid,
            fromName: auth.currentUser.displayName || "誰か",
            fromIcon: auth.currentUser.photoURL || "",
            message: message,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            read: false
        });
    }

    function loadNotifications() {
        const user = auth.currentUser;
        if (!user) {
            document.getElementById('notificationsList').innerHTML = "<p style='text-align:center;'>ログインすると通知を確認できます</p>";
            return;
        }

        db.collection("notifications")
            .where("toUid", "==", user.uid)
            .orderBy("createdAt", "desc")
            .limit(20)
            .onSnapshot(snap => {
                const list = document.getElementById('notificationsList');
                list.innerHTML = "";
                if(snap.empty) {
                    list.innerHTML = "<p style='text-align:center; color:#666;'>通知はありません</p>";
                    return;
                }
                snap.forEach(doc => {
                    const n = doc.data();
                    list.innerHTML += `
                        <div class="list-item" style="border-left: 4px solid #4285f4;">
                            <div class="list-item-info">
                                <img src="${n.fromIcon || 'https://api.dicebear.com/7.x/avataaars/svg?seed=none'}" style="width:32px; height:32px; border-radius:50%;">
                                <span><strong>${n.fromName}</strong>さんが${n.message}</span>
                            </div>
                        </div>`;
                });
            });
    }

    // --- 投稿機能 (ログインなし対応) ---
    async function addPost() {
        const user = auth.currentUser;
        const text = document.getElementById('postText').value;
        if (!text.trim()) return;

        const postData = {
            uid: user ? user.uid : "guest_user",
            name: user ? (user.displayName || "名無し") : "ゲストさん",
            icon: user ? (user.photoURL || "") : "https://api.dicebear.com/7.x/avataaars/svg?seed=guest",
            content: text,
            isPromote: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection("posts").add(postData);
        document.getElementById('postText').value = "";
    }

    async function addPromotePost() {
        const user = auth.currentUser;
        if (!user) { alert("宣伝するにはログインが必要です"); return; }
        const text = document.getElementById('promoteText').value;
        const tag = document.getElementById('promoteTag').value;
        if (!text.trim()) return;
        await db.collection("posts").add({
            uid: user.uid, name: user.displayName, icon: user.photoURL || "",
            content: text, tag: tag, isPromote: true, createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById('promoteText').value = "";
        alert("拡散しました！");
    }

    // --- 読み込み & 表示 ---
    function loadPosts() {
        db.collection("posts").orderBy("createdAt", "desc").onSnapshot(snap => {
            const list = document.getElementById('postsList');
            if (!list) return;
            list.innerHTML = "";
            let hasContent = false;
            snap.forEach(doc => {
                const d = doc.data();
                if (d.isPromote !== true && !blockedIds.includes(d.uid)) {
                    list.innerHTML += renderPostCard(doc.id, d);
                    hasContent = true;
                }
            });
            if (!hasContent) list.innerHTML = "<p style='text-align:center; color:#666; margin-top:20px;'>投稿がまだありません</p>";
        });
    }

    function loadPromotePosts() {
        db.collection("posts").orderBy("createdAt", "desc").onSnapshot(snap => {
            const list = document.getElementById('promoteList');
            if (!list) return;
            list.innerHTML = "";
            let hasContent = false;
            snap.forEach(doc => {
                const d = doc.data();
                if (d.isPromote === true && !blockedIds.includes(d.uid)) {
                    list.innerHTML += `
                        <div class="post-card promote-card">
                            <span class="tag-badge">${d.tag || '📢 宣伝'}</span>
                            <div style="display:flex; align-items:center; margin-bottom:8px;">
                                <img src="${d.icon}" class="user-icon-img" onclick="showUserProfile('${d.uid}')">
                                <strong onclick="showUserProfile('${d.uid}')" style="cursor:pointer;">${d.name}</strong>
                            </div>
                            <p style="margin:0; white-space:pre-wrap;">${d.content}</p>
                        </div>`;
                    hasContent = true;
                }
            });
            if (!hasContent) list.innerHTML = "<p style='text-align:center; color:#666; margin-top:20px;'>宣伝投稿はまだありません</p>";
        });
    }

    function renderPostCard(id, d) {
        const isMe = auth.currentUser && auth.currentUser.uid === d.uid;
        const icon = d.icon || "https://api.dicebear.com/7.x/avataaars/svg?seed=guest";
        return `
            <div class="post-card">
                <div style="display:flex; align-items:center; margin-bottom:8px;">
                    <img src="${icon}" class="user-icon-img" onclick="showUserProfile('${d.uid}')">
                    <strong style="cursor:pointer;" onclick="showUserProfile('${d.uid}')">${d.name}</strong>
                </div>
                <p style="margin:0; white-space:pre-wrap;">${d.content}</p>
                ${isMe ? `<button class="del-btn" onclick="deletePost('${id}')">🗑</button>` : ''}
            </div>`;
    }

    // --- プロフィール詳細 ---
    async function showUserProfile(uid) {
        if(uid === "guest_user") { alert("ゲストユーザーのプロフィールはありません"); return; }
        currentProfileUid = uid;
        const userDoc = await db.collection("users").doc(uid).get();
        const data = userDoc.exists ? userDoc.data() : { name: "Unknown", icon: "" };

        document.getElementById('prof-name').innerText = data.name;
        document.getElementById('prof-icon').src = data.icon || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`;
        document.getElementById('prof-id').innerText = `@${uid.substring(0, 8)}`;

        const isMe = auth.currentUser && auth.currentUser.uid === uid;
        const f1 = await db.collection("follows").where("followerId", "==", uid).get();
        const f2 = await db.collection("follows").where("followingId", "==", uid).get();
        document.getElementById('count-following').innerText = f1.size;
        document.getElementById('count-followers').innerText = f2.size;

        const actions = document.getElementById('prof-actions');
        actions.innerHTML = !isMe && auth.currentUser ? `
            <button class="btn-follow" onclick="toggleFollow('${uid}')">フォロー / 解除</button>
            <button class="btn-block" onclick="toggleBlock('${uid}')">ブロック</button>
            <button class="btn-sponsor" onclick="openSponsorModal('${uid}')">スポンサー</button>
        ` : "";

        switchProfileTab('posts');
        showPage('profile');
    }

    async function switchProfileTab(type) {
        const area = document.getElementById('profile-content-area');
        area.innerHTML = "<p style='text-align:center;'>読み込み中...</p>";
        document.querySelectorAll('.prof-tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`p-tab-${type}`).classList.add('active');

        let html = "";
        if (type === 'posts') {
            const snap = await db.collection("posts").where("uid", "==", currentProfileUid).orderBy("createdAt", "desc").get();
            snap.forEach(doc => html += renderPostCard(doc.id, doc.data()));
        } else if (type === 'following' || type === 'followers') {
            const field = type === 'following' ? 'followerId' : 'followingId';
            const targetField = type === 'following' ? 'followingId' : 'followerId';
            const snap = await db.collection("follows").where(field, "==", currentProfileUid).get();
            for (const doc of snap.docs) {
                const uDoc = await db.collection("users").doc(doc.data()[targetField]).get();
                if (uDoc.exists) html += renderUserItem(uDoc.id, uDoc.data());
            }
        } else if (type === 'sponsors') {
            const s2 = await db.collection("sponsors").where("to", "==", currentProfileUid).get();
            html += "<h4>支援してくれた人</h4>";
            for (const doc of s2.docs) {
                const uDoc = await db.collection("users").doc(doc.data().from).get();
                if(uDoc.exists) html += renderSponsorItem(uDoc.data(), doc.data().message);
            }
        }
        area.innerHTML = html || "<p style='text-align:center; color:#666;'>データがありません</p>";
    }

    function renderUserItem(uid, data) {
        return `<div class="list-item" onclick="showUserProfile('${uid}')"><div class="list-item-info"><img src="${data.icon}" style="width:32px; height:32px; border-radius:50%;"><span>${data.name}</span></div></div>`;
    }
    function renderSponsorItem(data, msg) {
        return `<div class="list-item"><div class="list-item-info"><img src="${data.icon}" style="width:32px; height:32px; border-radius:50%;"><div><div>${data.name}</div><div class="sponsor-msg">"${msg}"</div></div></div></div>`;
    }

    // --- アクション ---
    async function toggleFollow(targetUid) {
        const id = `${auth.currentUser.uid}_${targetUid}`;
        const ref = db.collection("follows").doc(id);
        const doc = await ref.get();
        if (doc.exists) {
            await ref.delete();
        } else {
            await ref.set({ followerId: auth.currentUser.uid, followingId: targetUid });
            await sendNotification(targetUid, "あなたをフォローしました");
        }
        showUserProfile(targetUid);
    }

    async function toggleBlock(targetUid) {
        if (confirm("ブロックしますか？")) {
            await db.collection("blocks").add({ blockerId: auth.currentUser.uid, blockedId: targetUid });
            location.reload();
        }
    }

    function openSponsorModal(uid) {
        const msg = prompt("応援メッセージを入力してください");
        if (msg) {
            db.collection("sponsors").add({ from: auth.currentUser.uid, to: uid, message: msg }).then(() => {
                sendNotification(uid, `あなたを支援しました：「${msg}」`);
                alert("支援しました！");
            });
        }
    }

    function toggleSidebar() {
        document.getElementById('appBody').classList.toggle('sidebar-open');
        document.getElementById('overlay').style.display = document.getElementById('appBody').classList.contains('sidebar-open') ? 'block' : 'none';
    }

    function autoResize(t) { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }
    async function loginWithGoogle() { await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); location.reload(); }
    function logoutAction() { auth.signOut(); location.reload(); }
    async function deletePost(id) { if(confirm("削除しますか？")) await db.collection("posts").doc(id).delete(); }
    
    async function updateProfile() {
        const user = auth.currentUser;
        const name = document.getElementById('input-name').value;
        const icon = document.getElementById('input-icon').value;
        await user.updateProfile({ displayName: name, photoURL: icon });
        await db.collection("users").doc(user.uid).set({ name, icon }, { merge: true });
        alert("更新しました"); location.reload();
    }
    
    // 例: 変数の定義
    let blockedIds = [];
    let currentProfileUid = "";

    // ログイン状態の監視
    auth.onAuthStateChanged(async user => {
        // ... 元のロジック ...
    });

    // 関数の定義（windowオブジェクトに紐付けてアクセス可能にする）
    window.showPage = function(id) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        // ...
    };

    window.toggleSidebar = function() {
        document.getElementById('appBody').classList.toggle('sidebar-open');
        // ...
    };

    // ... その他のすべての関数（addPost, loadPostsなど）をここに移植 ...
    
    console.log("SNS Environment Loaded.");
    // 初回読み込みの実行
    loadPosts();
}
