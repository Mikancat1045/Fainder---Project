function launchSNS() {
    // 1. ゲートウェイUIを消去して器を表示
    const gate = document.getElementById('gate-container');
    if (gate) gate.remove();
    
    const root = document.getElementById('sns-root');
    root.style.display = 'block';
    
    // 2. スタイルをSNS用に調整
    document.body.style.display = 'block';
    document.body.style.height = 'auto';
    document.body.style.overflowY = 'auto';
    document.body.id = 'appBody'; // 既存ロジック用

    // 3. SNSのHTML/CSSを注入
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

        .page { display: none; padding: 80px 20px; max-width: 800px; margin: 0 auto; }
        .page.active { display: block; animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .timeline-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; overflow-x: auto; }
        .tab-btn, .prof-tab-btn { background: none; border: none; color: #888; padding: 8px 16px; cursor: pointer; border-radius: 20px; transition: 0.2s; white-space: nowrap; }
        .tab-btn.active, .prof-tab-btn.active { background: #303134; color: #8ab4f8; }
    
        .post-input-container { background: #1e1f20; border: 1px solid #444746; border-radius: 24px; padding: 12px 16px; margin-bottom: 30px; }
        .post-input-wrapper { display: flex; align-items: center; gap: 12px; }
        #postText, #promoteText { flex: 1; background: none; border: none; color: white; font-size: 16px; outline: none; resize: none; }
        
        .post-card { background: var(--card-bg); border-radius: 16px; padding: 16px; margin-bottom: 15px; border: 1px solid #333; position: relative; }
        .user-icon-img { width: 40px; height: 40px; border-radius: 50%; margin-right: 12px; object-fit: cover; cursor: pointer; }
        .del-btn { position: absolute; top: 10px; right: 10px; background: none; border: none; color: #666; cursor: pointer; }

        .tag-badge { display: inline-block; background: #333; color: #8ab4f8; padding: 2px 10px; border-radius: 12px; font-size: 12px; margin-bottom: 8px; border: 1px solid #444; }
        .promote-card { border-left: 4px solid #f4b400 !important; }

        .list-item { display: flex; align-items: center; justify-content: space-between; background: #1e1f20; padding: 12px; border-radius: 12px; margin-bottom: 8px; border: 1px solid #333; }
        .list-item-info { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .sponsor-msg { font-size: 12px; color: #aaa; margin-top: 4px; font-style: italic; }

        .stat-container { display: flex; justify-content: center; gap: 20px; margin: 15px 0; }
        .stat-item { text-align: center; cursor: pointer; }
        .stat-value { font-size: 20px; font-weight: bold; color: #8ab4f8; }
        .stat-label { font-size: 12px; color: #888; }

        .btn-follow { background: #4285f4; color: white; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; }
        .btn-block { background: #333; color: #d96570; border: 1px solid #d96570; padding: 8px 20px; border-radius: 20px; cursor: pointer; }
        .btn-sponsor { background: #f4b400; color: #000; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; font-weight: bold; }
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
        <div onclick="showPage('home')" style="padding:15px 25px; cursor:pointer;"> ホーム</div>
        <div onclick="showPage('timeline')" style="padding:15px 25px; cursor:pointer;"> タイムライン</div>
        <div onclick="showPage('promote')" style="padding:15px 25px; cursor:pointer;"> 拡散・宣伝</div>
        <div id="sidebar-my-profile" onclick="openMyProfile()" style="padding:15px 25px; cursor:pointer; display:none;"> プロフィール</div>    
        <div onclick="showPage('notifications')" style="padding:15px 25px; cursor:pointer;"> 通知</div>
        <div onclick="showPage('settings')" style="padding:15px 25px; cursor:pointer;"> 設定</div>
        <div id="loginBtn" onclick="loginWithGoogle()" style="margin: 10px 20px; padding:12px; cursor:pointer; background:white; color:#757575; border-radius:4px; display:flex; align-items:center; font-weight:500; border:1px solid #dadce0;">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" style="width:18px; margin-right:10px;">
            Googleでログイン
        </div>
    </nav>

    <section id="home" class="page active">
        <h1 style="background:var(--accent-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:40px;">
            こんにちは、<span id="display-name">Guest</span>
        </h1>
        <p style="font-size:18px; color:#8ab4f8;">Fainderへようこそ！</p>
    </section>

    <section id="timeline" class="page">
        <h2>タイムライン</h2>
<div class="timeline-tabs">
    <button id="tab-new" class="tab-btn active" onclick="switchTab('new')">最新</button>
    <button id="tab-following" class="tab-btn" onclick="switchTab('following')">フォロー中</button>
    <button id="tab-recommend" class="tab-btn" onclick="switchTab('recommend')">おすすめ</button>
</div>
        <div class="post-input-container">
            <div class="post-input-wrapper">
                <img id="user-post-icon" src="https://api.dicebear.com/7.x/avataaars/svg?seed=guest" class="user-icon-img">
                <textarea id="postText" placeholder="今何してる？" rows="1" oninput="autoResize(this)"></textarea>
                <button onclick="addPost()" style="background:none; border:none; color:#8ab4f8; cursor:pointer;">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        </div>
        <div id="postsList"></div>
    </section>

    <section id="promote" class="page">
        <h2>🚀 拡散・共有・宣伝</h2>
        <div class="post-input-container">
            <div style="margin-bottom: 10px;">
                <label style="font-size: 12px; color: #8ab4f8;">カテゴリ：</label>
                <select id="promoteTag" style="background: #28292a; color: white; border: 1px solid #444; border-radius: 8px; padding: 5px;">
                    <option value=" 動画"> 動画</option>
                    <option value=" アプリ/サイト"> アプリ/サイト</option>
                    <option value=" 世界情勢"> 世界情勢</option>
                    <option value=" 流行り"> 流行り</option>
                    <option value=" その他宣伝"> その他宣伝</option>
                </select>
            </div>
            <div class="post-input-wrapper">
                <textarea id="promoteText" placeholder="URLや説明を入力して拡散しよう！" rows="2" oninput="autoResize(this)"></textarea>
                <button onclick="addPromotePost()" style="background:none; border:none; color:#f4b400; cursor:pointer;">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        </div>
        <div id="promoteList"></div>
    </section>

    <section id="notifications" class="page">
        <h2> 通知</h2>
        <div id="notificationsList"></div>
    </section>

    <section id="profile" class="page">
        <div class="profile-header" style="text-align: center; padding: 30px 20px; background: #1e1f20; border-radius: 24px; margin-bottom: 20px;">
            <img id="prof-icon" src="" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid #4285f4; object-fit: cover;">
            <h2 id="prof-name" style="margin: 10px 0 5px 0;">---</h2>
            <div class="stat-container">
                <div class="stat-item" onclick="switchProfileTab('following')">
                    <div id="count-following" class="stat-value">0</div>
                    <div class="stat-label">フォロー</div>
                </div>
                <div class="stat-item" onclick="switchProfileTab('followers')">
                    <div id="count-followers" class="stat-value">0</div>
                    <div class="stat-label">フォロワー</div>
                </div>
            </div>
            <p id="prof-id" style="color: #888; font-size: 14px; margin-bottom: 15px;"></p>
            <div id="prof-actions" style="display: flex; justify-content: center; gap: 10px;"></div>
        </div>
        <div class="timeline-tabs">
            <button id="p-tab-posts" class="prof-tab-btn active" onclick="switchProfileTab('posts')">投稿</button>
            <button id="p-tab-following" class="prof-tab-btn" onclick="switchProfileTab('following')">フォロー</button>
            <button id="p-tab-followers" class="prof-tab-btn" onclick="switchProfileTab('followers')">フォロワー</button>
            <button id="p-tab-blocks" class="prof-tab-btn" onclick="switchProfileTab('blocks')" style="display:none;">ブロック</button>
            <button id="p-tab-sponsors" class="prof-tab-btn" onclick="switchProfileTab('sponsors')">スポンサー</button>
        </div>
        <div id="profile-content-area"></div>
    </section>

    <section id="settings" class="page">
        <h2>設定</h2>
        <div style="background:#1e1f20; padding:20px; border-radius:16px; border: 1px solid #333;">
            <label>表示名</label>
            <input type="text" id="input-name" style="width:100%; padding:10px; margin:10px 0 20px 0; background:#28292a; border:1px solid #444; color:white; border-radius:8px; box-sizing: border-box;">
            <label>アイコンURL</label>
            <input type="text" id="input-icon" style="width:100%; padding:10px; margin:10px 0 20px 0; background:#28292a; border:1px solid #444; color:white; border-radius:8px; box-sizing: border-box;">
            <button onclick="updateProfile()" style="width:100%; padding:12px; background:#4285f4; border:none; color:white; border-radius:8px; cursor:pointer; font-weight:bold;">プロフィールの保存</button>
            <button onclick="logoutAction()" style="width:100%; padding:12px; background:#d96570; border:none; color:white; border-radius:8px; margin-top:10px; cursor:pointer;">ログアウト</button>
        </div>
    </section>
    `;

    // 4. ロジック実行（貼り付けてもらったscript部分）
    const db = firebase.firestore();
    const auth = firebase.auth();
    let blockedIds = [];
    let currentProfileUid = "";

    // --- ボット検知 ---
    const ua = navigator.userAgent.toLowerCase();
    const botKeywords = ["googlebot", "bingbot", "yahoobot", "baiduspider", "slurp", "crawler", "spider", "robot"];
    if (botKeywords.some(keyword => ua.includes(keyword))) {
        document.body.innerHTML = `<div style="padding: 50px; text-align: center; color: #fff; background: #131314; height: 100vh;"><h1>Mikan Project Portfolio</h1><p>© 2026 Mikan Programming Lab.</p></div>`;
        return;
    }

    auth.onAuthStateChanged(async user => {
        const loginBtn = document.getElementById('loginBtn');
        const headerIcon = document.getElementById('header-user-icon');
        const myProfLink = document.getElementById('sidebar-my-profile');
        const displayNameElem = document.getElementById('display-name');

        if (user) {
            if(loginBtn) loginBtn.style.display = "none";
            if(headerIcon) { headerIcon.style.display = "block"; headerIcon.src = user.photoURL || ""; }
            if(myProfLink) myProfLink.style.display = "block";
            const iconUrl = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
            if(document.getElementById('user-post-icon')) document.getElementById('user-post-icon').src = iconUrl;
            if(displayNameElem) displayNameElem.innerText = user.displayName || "User";

            await db.collection("users").doc(user.uid).set({
                name: user.displayName || "名無し",
                icon: iconUrl,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            const blockSnap = await db.collection("blocks").where("blockerId", "==", user.uid).get();
            blockedIds = blockSnap.docs.map(doc => doc.data().blockedId);
            loadPosts();
        } else {
            if(loginBtn) loginBtn.style.display = "flex";
            if(headerIcon) headerIcon.style.display = "none";
            if(myProfLink) myProfLink.style.display = "none";
            if(displayNameElem) displayNameElem.innerText = "Guest";
            loadPosts();
        }
    });

    window.showPage = (id) => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        if (id === 'promote') loadPromotePosts();
        if (id === 'notifications') loadNotifications();
        if (document.getElementById('appBody').classList.contains('sidebar-open')) toggleSidebar();
    };

    window.openMyProfile = () => {
        if (auth.currentUser) showUserProfile(auth.currentUser.uid);
        else alert("プロフィールを表示するにはログインが必要です");
    };

    window.addPost = async () => {
        const user = auth.currentUser;
        const text = document.getElementById('postText').value;
        if (!text.trim()) return;
        await db.collection("posts").add({
            uid: user ? user.uid : "guest_user",
            name: user ? (user.displayName || "名無し") : "ゲストさん",
            icon: user ? (user.photoURL || "") : "https://api.dicebear.com/7.x/avataaars/svg?seed=guest",
            content: text,
            isPromote: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById('postText').value = "";
    };

    window.addPromotePost = async () => {
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
    };

    function loadPosts() {
        db.collection("posts").orderBy("createdAt", "desc").onSnapshot(snap => {
            const list = document.getElementById('postsList');
            if (!list) return;
            list.innerHTML = "";
            snap.forEach(doc => {
                const d = doc.data();
                if (d.isPromote !== true && !blockedIds.includes(d.uid)) {
                    list.innerHTML += renderPostCard(doc.id, d);
                }
            });
        });
    }

    function loadPromotePosts() {
        db.collection("posts").orderBy("createdAt", "desc").onSnapshot(snap => {
            const list = document.getElementById('promoteList');
            if (!list) return;
            list.innerHTML = "";
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
                }
            });
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

    window.showUserProfile = async (uid) => {
        if(uid === "guest_user") { alert("ゲストユーザーのプロフィールはありません"); return; }
        currentProfileUid = uid;
        showPage('profile');
        const userDoc = await db.collection("users").doc(uid).get();
        const data = userDoc.exists ? userDoc.data() : { name: "Unknown", icon: "" };
        document.getElementById('prof-name').innerText = data.name;
        document.getElementById('prof-icon').src = data.icon || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`;
        document.getElementById('prof-id').innerText = `@${uid.substring(0, 8)}`;
        switchProfileTab('posts');
    };

    let currentTimelineTab = 'new';

function loadPosts() {
    db.collection("posts").orderBy("createdAt", "desc").onSnapshot(async snap => {
        const list = document.getElementById('postsList');
        if (!list) return;
        list.innerHTML = "";

        // フォロー中タブの場合、自分がフォローしている人のIDリストを取得
        let followingUids = [];
        if (currentTimelineTab === 'following' && auth.currentUser) {
            const followSnap = await db.collection("follows").where("followerId", "==", auth.currentUser.uid).get();
            followingUids = followSnap.docs.map(doc => doc.data().followingId);
        }

        snap.forEach(doc => {
            const d = doc.data();
            if (d.isPromote === true || blockedIds.includes(d.uid)) return;

            if (currentTimelineTab === 'new') {
                // 最新：全表示
                list.innerHTML += renderPostCard(doc.id, d);
            } else if (currentTimelineTab === 'following') {
                // フォロー中：フォローリストに含まれる人のみ
                if (followingUids.includes(d.uid)) {
                    list.innerHTML += renderPostCard(doc.id, d);
                }
            } else if (currentTimelineTab === 'recommend') {
                // おすすめ：例えば「スポンサーがついている投稿」や「特定の文字数以上の投稿」など
                // ここでは簡易的に「10文字以上の投稿」を抽出する例
                if (d.content.length > 10) {
                    list.innerHTML += renderPostCard(doc.id, d);
                }
            }
        });
        
        if (list.innerHTML === "") {
            list.innerHTML = "<p style='text-align:center; color:#666;'>表示する投稿がありません</p>";
        }
    });
}

// プロフィールのタブ切り替えロジックの修正

    window.toggleSidebar = () => {
        document.getElementById('appBody').classList.toggle('sidebar-open');
        document.getElementById('overlay').style.display = document.getElementById('appBody').classList.contains('sidebar-open') ? 'block' : 'none';
    };

    window.autoResize = (t) => { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; };
    window.loginWithGoogle = async () => { await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); location.reload(); };
    window.logoutAction = () => { auth.signOut(); document.cookie = "fainder_access=; max-age=0; path=/"; location.reload(); };
    window.deletePost = async (id) => { if(confirm("削除しますか？")) await db.collection("posts").doc(id).delete(); };
    
    window.updateProfile = async () => {
        const user = auth.currentUser;
        const name = document.getElementById('input-name').value;
        const icon = document.getElementById('input-icon').value;
        await user.updateProfile({ displayName: name, photoURL: icon });
        await db.collection("users").doc(user.uid).set({ name, icon }, { merge: true });
        alert("更新しました"); location.reload();
    };

    function loadNotifications() {
        const user = auth.currentUser;
        if (!user) return;
        db.collection("notifications").where("toUid", "==", user.uid).orderBy("createdAt", "desc").limit(20).onSnapshot(snap => {
            const list = document.getElementById('notificationsList');
            if(!list) return;
            list.innerHTML = "";
            snap.forEach(doc => {
                const n = doc.data();
                list.innerHTML += `<div class="list-item" style="border-left: 4px solid #4285f4;"><div class="list-item-info"><span><strong>${n.fromName}</strong>さんが${n.message}</span></div></div>`;
            });
        });
    }

    // --- 修正されたロジック部分 ---

    // --- タイムラインのタブ切り替え ---
window.switchTab = (tabType) => {
    currentTimelineTab = tabType;

    // 1. 全てのタイムラインボタンから active クラスを消す
    document.querySelectorAll('.timeline-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 2. クリックされたボタンにだけ active クラスを付ける
    const activeBtn = document.getElementById(`tab-${tabType}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // 3. 投稿を再読み込み
    loadPosts();
};

// --- プロフィールのタブ切り替え ---
window.switchProfileTab = async (type) => {
    currentProfileTab = type; // 現在のタブを保持

    // 1. 全てのプロフィールタブから active クラスを消す
    document.querySelectorAll('.prof-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 2. クリックされたボタンに active クラスを付ける
    // IDが p-tab-posts, p-tab-following などの形式になっているか確認
    const activeTab = document.getElementById(`p-tab-${type}`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // 3. コンテンツの表示（読み込み中...）
    const area = document.getElementById('profile-content-area');
    if (area) area.innerHTML = "<p style='text-align:center;'>読み込み中...</p>";

    // ここにデータ取得ロジック（前回の内容）を記述
    // ...
};
}
