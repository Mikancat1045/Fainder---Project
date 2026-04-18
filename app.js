if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

// --- 2. SNS起動メイン関数 ---
function launchSNS() {
    const gate = document.getElementById('gate-container');
    const root = document.getElementById('sns-root');

    if (gate) gate.remove();
    if (!root) return;

    root.style.display = 'block';
    document.body.style.backgroundColor = '#131314';

    // HTML構造の注入
    root.innerHTML = `
<style>
                :root {
                    --bg-color: #131314; --nav-bg: #131314; --text-gemini: #e3e3e3;
                    --accent-gradient: linear-gradient(90deg, #4285f4, #9b72cb, #d96570);
                    --sidebar-bg: #1e1f20; --card-bg: #1e1f20;
                }
                body { color: var(--text-gemini); font-family: "Google Sans", sans-serif; overflow-x: hidden; }
                header { position: fixed; top: 0; width: 100%; height: 64px; background: var(--nav-bg); display: flex; align-items: center; padding: 0 16px; z-index: 1000; border-bottom: 1px solid #333; box-sizing: border-box; }
                .menu-btn { background: none; border: none; color: white; font-size: 24px; cursor: pointer; }
                .app-brand { display: flex; align-items: center; gap: 12px; cursor: pointer; margin-left: 10px; }
                #app-main-logo { width: 32px; height: 32px; border-radius: 8px; }
                .search-bar { background: #28292a; border: none; color: white; padding: 8px 15px; border-radius: 20px; outline: none; width: 120px; transition: 0.3s; margin-left: auto; }
                .search-bar:focus { width: 200px; }
                #header-user-icon { width: 34px; height: 34px; border-radius: 50%; cursor: pointer; display: none; margin-left: 15px; border: 1px solid #444; }
                
                #sidebar { position: fixed; top: 0; left: -280px; width: 260px; height: 100%; background: var(--sidebar-bg); z-index: 1200; padding-top: 80px; transition: 0.3s; }
                .sidebar-open #sidebar { left: 0; }
                #overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1100; }

                .page { display: none; padding: 80px 20px; max-width: 600px; margin: 0 auto; min-height: 100vh; }
                .page.active { display: block; animation: fadeIn 0.3s ease; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

                .post-card { background: var(--card-bg); border-radius: 16px; padding: 16px; margin-bottom: 15px; border: 1px solid #333; position: relative; }
                .user-icon-img { width: 40px; height: 40px; border-radius: 50%; margin-right: 12px; object-fit: cover; cursor: pointer; }
                .post-input-container { background: #1e1f20; border: 1px solid #444746; border-radius: 24px; padding: 12px 16px; margin-bottom: 20px; }
                textarea { width: 100%; background: none; border: none; color: white; font-size: 16px; outline: none; resize: none; }
                
                .timeline-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #333; }
                .tab-btn, .prof-tab-btn { background: none; border: none; color: #888; padding: 10px; cursor: pointer; transition: 0.2s; }
                .tab-btn.active, .prof-tab-btn.active { color: #8ab4f8; border-bottom: 2px solid #8ab4f8; }
                
                .btn-follow { background: #4285f4; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; }
                .btn-block { background: none; color: #d96570; border: 1px solid #d96570; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin-left: 10px; }
                .del-btn { position: absolute; top: 10px; right: 10px; background: none; border: none; color: #555; cursor: pointer; }
                .list-item { background: #28292a; padding: 12px; border-radius: 12px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; }
            </style>

            <header>
                <button class="menu-btn" onclick="toggleSidebar()">≡</button>
                <div class="app-brand" onclick="showPage('home')">
                    <img id="app-main-logo" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80">
                    <span class="app-name">Fainder</span>
                </div>
                <input type="text" class="search-bar" placeholder="検索...">
                <img id="header-user-icon" onclick="showPage('settings')">
            </header>

            <div id="overlay" onclick="toggleSidebar()"></div>
            <nav id="sidebar">
                <div onclick="showPage('home')" style="padding:15px 25px; cursor:pointer;">ホーム</div>
                <div onclick="showPage('timeline')" style="padding:15px 25px; cursor:pointer;">タイムライン</div>
                <div onclick="showPage('promote')" style="padding:15px 25px; cursor:pointer;">拡散・宣伝</div>
                <div id="sidebar-my-profile" onclick="openMyProfile()" style="padding:15px 25px; cursor:pointer; display:none;">プロフィール</div>
                <div onclick="showPage('notifications')" style="padding:15px 25px; cursor:pointer;">通知</div>
                <div onclick="showPage('settings')" style="padding:15px 25px; cursor:pointer;">設定</div>
                <div id="loginBtn" onclick="loginWithGoogle()" style="margin:20px; padding:10px; background:white; color:black; text-align:center; border-radius:5px; cursor:pointer; font-weight:bold;">Googleでログイン</div>
            </nav>

            <section id="home" class="page active">
                <h1 style="background:var(--accent-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:32px;">こんにちは、<span id="display-name">Guest</span></h1>
                <p>最新の情報やトレンドをチェックしましょう。</p>
            </section>

            <section id="timeline" class="page">
                <h2>タイムライン</h2>
                <div class="timeline-tabs">
                    <button id="tab-new" class="tab-btn active" onclick="switchTab('new')">最新</button>
                    <button id="tab-following" class="tab-btn" onclick="switchTab('following')">フォロー中</button>
                </div>
                <div class="post-input-container">
                    <textarea id="postText" placeholder="今何してる？" rows="1"></textarea>
                    <div style="text-align:right; margin-top:10px;">
                        <button onclick="addPost()" style="background:#8ab4f8; border:none; color:black; padding:8px 20px; border-radius:20px; font-weight:bold; cursor:pointer;">投稿</button>
                    </div>
                </div>
                <div id="postsList"></div>
            </section>

            <section id="promote" class="page">
                <h2>🚀 宣伝・拡散</h2>
                <div class="post-input-container">
                    <select id="promoteTag" style="background:#333; color:white; border:none; margin-bottom:10px; padding:5px;">
                        <option value="動画">動画</option>
                        <option value="アプリ/サイト">アプリ/サイト</option>
                        <option value="その他">その他</option>
                    </select>
                    <textarea id="promoteText" placeholder="広めたいURLや説明を入力" rows="2"></textarea>
                    <button onclick="addPromotePost()" style="width:100%; background:#f4b400; border:none; color:black; padding:10px; border-radius:10px; font-weight:bold; margin-top:10px;">拡散する</button>
                </div>
                <div id="promoteList"></div>
            </section>

            <section id="profile" class="page">
                <div style="text-align:center; padding:20px; background:#1e1f20; border-radius:20px;">
                    <img id="prof-icon" src="" style="width:80px; height:80px; border-radius:50%; background:#333;">
                    <h2 id="prof-name">---</h2>
                    <p id="prof-id" style="color:#888;"></p>
                    <div id="prof-actions"></div>
                </div>
                <div class="timeline-tabs" style="margin-top:20px;">
                    <button id="p-tab-posts" class="prof-tab-btn active" onclick="switchProfileTab('posts')">投稿</button>
                    <button id="p-tab-following" class="prof-tab-btn" onclick="switchProfileTab('following')">フォロー</button>
                    <button id="p-tab-followers" class="prof-tab-btn" onclick="switchProfileTab('followers')">フォロワー</button>
                </div>
                <div id="profile-content-area"></div>
            </section>

            <section id="notifications" class="page">
                <h2>通知</h2>
                <div id="notificationsList"></div>
            </section>

            <section id="settings" class="page">
                <h2>設定</h2>
                <div style="background:#1e1f20; padding:20px; border-radius:20px;">
                    <p>表示名の変更</p>
                    <input type="text" id="input-name" style="width:100%; padding:10px; background:#333; border:none; color:white; border-radius:8px; box-sizing:border-box;">
                    <button onclick="updateProfile()" style="width:100%; padding:12px; background:#4285f4; border:none; color:white; border-radius:8px; margin-top:20px; cursor:pointer;">保存</button>
                    <button onclick="logoutAction()" style="width:100%; padding:12px; background:none; border:1px solid #d96570; color:#d96570; border-radius:8px; margin-top:10px; cursor:pointer;">ログアウト</button>
                </div>
            </section>
    `;

    initSNSLogic();
}

// --- 3. 内部ロジック ---
let blockedIds = [];
let currentProfileUid = "";
let currentTimelineTab = 'new';

function initSNSLogic() {
    auth.onAuthStateChanged(async user => {
        const loginBtn = document.getElementById('loginBtn');
        const headerIcon = document.getElementById('header-user-icon');
        const myProfLink = document.getElementById('sidebar-my-profile');
        const displayNameElem = document.getElementById('display-name');

        if (user) {
            if(loginBtn) loginBtn.style.display = "none";
            if(headerIcon) { headerIcon.style.display = "block"; headerIcon.src = user.photoURL || ""; }
            if(myProfLink) myProfLink.style.display = "block";
            if(displayNameElem) displayNameElem.innerText = user.displayName || "User";

            await db.collection("users").doc(user.uid).set({
                name: user.displayName || "名無し",
                icon: user.photoURL || "",
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            const blockSnap = await db.collection("blocks").where("blockerId", "==", user.uid).get();
            blockedIds = blockSnap.docs.map(doc => doc.data().blockedId);
        }
        loadPosts();
    });
}

// ページ操作
window.showPage = (id) => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(id);
    if(target) target.classList.add('active');
    
    if (id === 'promote') loadPromotePosts();
    if (id === 'notifications') loadNotifications();
    if (document.getElementById('appBody').classList.contains('sidebar-open')) toggleSidebar();
};

window.toggleSidebar = () => {
    document.getElementById('appBody').classList.toggle('sidebar-open');
    const isOpen = document.getElementById('appBody').classList.contains('sidebar-open');
    document.getElementById('overlay').style.display = isOpen ? 'block' : 'none';
};

// 投稿関連
window.addPost = async () => {
    const user = auth.currentUser;
    const text = document.getElementById('postText').value;
    if (!text.trim()) return;
    await db.collection("posts").add({
        uid: user ? user.uid : "guest_user",
        name: user ? (user.displayName || "名無し") : "ゲスト",
        icon: user ? (user.photoURL || "") : "",
        content: text,
        isPromote: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById('postText').value = "";
};

window.addPromotePost = async () => {
    const user = auth.currentUser;
    if (!user) return alert("ログインが必要です");
    const text = document.getElementById('promoteText').value;
    const tag = document.getElementById('promoteTag').value;
    if (!text.trim()) return;
    await db.collection("posts").add({
        uid: user.uid, name: user.displayName, icon: user.photoURL || "",
        content: text, tag: tag, isPromote: true, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById('promoteText').value = "";
    alert("拡散しました！");
};

window.loadPosts = () => {
    db.collection("posts").orderBy("createdAt", "desc").limit(50).onSnapshot(async snap => {
        const list = document.getElementById('postsList');
        if (!list) return;
        list.innerHTML = "";

        let followingUids = [];
        if (currentTimelineTab === 'following' && auth.currentUser) {
            const followSnap = await db.collection("follows").where("followerId", "==", auth.currentUser.uid).get();
            followingUids = followSnap.docs.map(doc => doc.data().followingId);
        }

        snap.forEach(doc => {
            const d = doc.data();
            if (d.isPromote || blockedIds.includes(d.uid)) return;
            if (currentTimelineTab === 'following' && !followingUids.includes(d.uid)) return;
            list.innerHTML += renderPostCard(doc.id, d);
        });
    });
};

function loadPromotePosts() {
    db.collection("posts").where("isPromote", "==", true).orderBy("createdAt", "desc").onSnapshot(snap => {
        const list = document.getElementById('promoteList');
        if (!list) return;
        list.innerHTML = "";
        snap.forEach(doc => {
            const d = doc.data();
            list.innerHTML += `
                <div class="post-card" style="border-left: 4px solid #f4b400;">
                    <span style="background:#f4b400; color:black; padding:2px 8px; border-radius:10px; font-size:12px;">${d.tag}</span>
                    <div style="display:flex; align-items:center; margin:10px 0;">
                        <img src="${d.icon || 'https://api.dicebear.com/7.x/initials/svg?seed='+d.name}" class="user-icon-img" onclick="showUserProfile('${d.uid}')">
                        <strong>${d.name}</strong>
                    </div>
                    <p>${d.content}</p>
                </div>`;
        });
    });
}

function renderPostCard(id, d) {
    const isMe = auth.currentUser && auth.currentUser.uid === d.uid;
    const icon = d.icon || `https://api.dicebear.com/7.x/initials/svg?seed=${d.name}`;
    return `
        <div class="post-card">
            <div style="display:flex; align-items:center; margin-bottom:8px;">
                <img src="${icon}" class="user-icon-img" onclick="showUserProfile('${d.uid}')">
                <strong onclick="showUserProfile('${d.uid}')" style="cursor:pointer;">${d.name}</strong>
            </div>
            <p style="white-space:pre-wrap; margin:0;">${d.content}</p>
            ${isMe ? `<button class="del-btn" onclick="deletePost('${id}')">🗑</button>` : ''}
        </div>`;
}

// プロフィール関連
window.showUserProfile = async (uid) => {
    if(uid === "guest_user") return alert("ゲストユーザーです");
    currentProfileUid = uid;
    showPage('profile');
    
    const userDoc = await db.collection("users").doc(uid).get();
    const data = userDoc.exists ? userDoc.data() : { name: "Unknown", icon: "" };
    
    document.getElementById('prof-name').innerText = data.name;
    document.getElementById('prof-icon').src = data.icon || `https://api.dicebear.com/7.x/initials/svg?seed=${uid}`;
    document.getElementById('prof-id').innerText = `@${uid.substring(0, 8)}`;
    
    const actionArea = document.getElementById('prof-actions');
    actionArea.innerHTML = "";
    if (auth.currentUser && auth.currentUser.uid !== uid) {
        const fCheck = await db.collection("follows").where("followerId", "==", auth.currentUser.uid).where("followingId", "==", uid).get();
        if (fCheck.empty) {
            actionArea.innerHTML = `<button class="btn-follow" onclick="followUser('${uid}')">フォロー</button>`;
        } else {
            actionArea.innerHTML = `<span style="color:#888;">フォロー中</span>`;
        }
        actionArea.innerHTML += `<button class="btn-block" onclick="blockUser('${uid}')">ブロック</button>`;
    }
    switchProfileTab('posts');
};

window.switchProfileTab = async (type) => {
    const area = document.getElementById('profile-content-area');
    document.querySelectorAll('.prof-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`p-tab-${type}`).classList.add('active');
    area.innerHTML = "読み込み中...";

    if (type === 'posts') {
        const snap = await db.collection("posts").where("uid", "==", currentProfileUid).orderBy("createdAt", "desc").get();
        area.innerHTML = "";
        snap.forEach(doc => area.innerHTML += renderPostCard(doc.id, doc.data()));
    } else {
        area.innerHTML = "<p style='text-align:center; color:#666;'>準備中...</p>";
    }
};

window.followUser = async (targetUid) => {
    const user = auth.currentUser;
    if (!user) return alert("ログインしてください");
    await db.collection("follows").add({
        followerId: user.uid, followingId: targetUid, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    await db.collection("notifications").add({
        toUid: targetUid, fromName: user.displayName, message: "フォローされました", createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    showUserProfile(targetUid);
};

window.switchTab = (type) => {
    currentTimelineTab = type;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-${type}`).classList.add('active');
    loadPosts();
};

window.loginWithGoogle = () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
window.logoutAction = () => { auth.signOut(); location.reload(); };
window.deletePost = (id) => { if(confirm("削除しますか？")) db.collection("posts").doc(id).delete(); };
window.openMyProfile = () => { if(auth.currentUser) showUserProfile(auth.currentUser.uid); };

function loadNotifications() {
    const user = auth.currentUser;
    if(!user) return;
    db.collection("notifications").where("toUid", "==", user.uid).orderBy("createdAt", "desc").limit(10).onSnapshot(snap => {
        const list = document.getElementById('notificationsList');
        if(!list) return;
        list.innerHTML = "";
        snap.forEach(doc => {
            const n = doc.data();
            list.innerHTML += `<div class="list-item"><span><strong>${n.fromName}</strong>さんが${n.message}</span></div>`;
        });
    });
}
