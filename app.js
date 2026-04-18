// app.js
function launchSNS() {
    // 1. ゲートウェイUIの消去とコンテナ表示
    if (document.getElementById('gate-container')) {
        document.getElementById('gate-container').remove();
    }
    const root = document.getElementById('sns-root');
    root.style.display = 'block';
    
    // 2. ページ全体のスタイル調整
    document.body.style.display = 'block';
    document.body.style.height = 'auto';
    document.body.style.overflowY = 'auto';

    // 3. HTMLとCSSの注入
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
        body { margin: 0; background-color: var(--user-custom-bg); color: var(--text-gemini); font-family: sans-serif; }
        header { position: fixed; top: 0; width: 100%; height: 64px; background-color: var(--nav-bg); display: flex; align-items: center; padding: 0 16px; z-index: 1000; border-bottom: 1px solid #333; box-sizing: border-box; }
        .menu-btn { background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 8px; }
        .app-brand { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        #app-main-logo { width: 32px; height: 32px; border-radius: 8px; }
        .app-name { font-size: 20px; font-weight: 500; }
        .search-container { margin-left: auto; margin-right: 15px; }
        .search-bar { background: #28292a; border: none; color: white; padding: 8px 15px; border-radius: 20px; width: 120px; outline: none; transition: 0.3s; }
        .search-bar:focus { width: 200px; }
        #header-user-icon { width: 34px; height: 34px; border-radius: 50%; cursor: pointer; border: 1px solid #444; }
        #sidebar { position: fixed; top: 0; left: -280px; width: 260px; height: 100%; background: var(--sidebar-bg); z-index: 1200; padding-top: 80px; transition: 0.3s; }
        .sidebar-open #sidebar { transform: translateX(280px); }
        #overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1100; }
        .page { display: none; padding: 80px 20px; max-width: 800px; margin: 0 auto; }
        .page.active { display: block; }
        .post-card { background: var(--card-bg); border-radius: 16px; padding: 16px; margin-bottom: 15px; border: 1px solid #333; position: relative; }
        .user-icon-img { width: 40px; height: 40px; border-radius: 50%; margin-right: 12px; object-fit: cover; }
        .post-input-container { background: #1e1f20; border: 1px solid #444746; border-radius: 24px; padding: 12px 16px; margin-bottom: 30px; }
        .post-input-wrapper { display: flex; align-items: center; gap: 12px; }
        #postText { flex: 1; background: none; border: none; color: white; outline: none; }
        .post-btn { background: #4285f4; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; }
        #display-name { margin-left: 10px; font-weight: bold; }
    </style>

    <header>
        <button class="menu-btn" onclick="toggleSidebar()">≡</button>
        <div class="app-brand" onclick="showPage('home')">
            <img id="app-main-logo" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80" alt="Logo">
            <span class="app-name">Fainder</span>
        </div>
        <div class="search-container">
            <input type="text" id="searchInput" class="search-bar" placeholder="検索...">
        </div>
        <img id="header-user-icon" onclick="openMyProfile()" alt="User">
    </header>

    <div id="overlay" onclick="toggleSidebar()"></div>
    <nav id="sidebar">
        <div style="padding: 20px;">
            <p id="display-name">Guest</p>
            <button onclick="showPage('home')" style="display:block; width:100%; padding:10px; margin-bottom:5px;">Home</button>
            <button id="sidebar-my-profile" onclick="openMyProfile()" style="display:none; width:100%; padding:10px; margin-bottom:5px;">Profile</button>
            <button id="loginBtn" onclick="loginWithGoogle()" style="display:flex; width:100%; padding:10px; background:#4285f4; color:white; border:none; border-radius:5px;">Login with Google</button>
            <button onclick="logoutAction()" style="margin-top:20px;">Logout</button>
        </div>
    </nav>

    <section id="home" class="page active">
        <div class="post-input-container">
            <div class="post-input-wrapper">
                <img id="user-post-icon" src="https://api.dicebear.com/7.x/avataaars/svg?seed=guest" class="user-icon-img">
                <input type="text" id="postText" placeholder="いま何してる？">
                <button class="post-btn" onclick="addPost()">投稿</button>
            </div>
        </div>
        <div id="postsList"></div>
    </section>

    <section id="profile" class="page">
        <div class="post-card">
            <img id="prof-icon" class="user-icon-img" style="width:80px; height:80px;">
            <h2 id="prof-name"></h2>
            <p id="prof-id"></p>
            <div id="prof-actions"></div>
        </div>
        <div id="profile-content-area"></div>
    </section>
    `;

    // 4. ロジック実行 (内部関数化)
    const db = firebase.firestore();
    const auth = firebase.auth();
    let blockedIds = [];

    // --- 各関数を window に紐付け (HTMLから呼べるようにする) ---
    window.toggleSidebar = function() {
        document.body.classList.toggle('sidebar-open');
        document.getElementById('overlay').style.display = document.body.classList.contains('sidebar-open') ? 'block' : 'none';
    };

    window.showPage = function(id) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        if (document.body.classList.contains('sidebar-open')) window.toggleSidebar();
    };

    window.loginWithGoogle = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        location.reload();
    };

    window.logoutAction = () => {
        auth.signOut();
        document.cookie = "mikan_access=; max-age=0; path=/"; // ログアウト時にゲートも閉じる
        location.reload();
    };

    window.addPost = async () => {
        const user = auth.currentUser;
        const text = document.getElementById('postText').value;
        if (!text.trim()) return;
        await db.collection("posts").add({
            uid: user ? user.uid : "guest",
            name: user ? user.displayName : "Guest",
            icon: user ? user.photoURL : "https://api.dicebear.com/7.x/avataaars/svg?seed=guest",
            content: text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById('postText').value = "";
    };

    window.openMyProfile = () => {
        if (auth.currentUser) window.showUserProfile(auth.currentUser.uid);
    };

    window.showUserProfile = async (uid) => {
        window.showPage('profile');
        const doc = await db.collection("users").doc(uid).get();
        const data = doc.exists ? doc.data() : { name: "Unknown", icon: "" };
        document.getElementById('prof-name').innerText = data.name;
        document.getElementById('prof-icon').src = data.icon;
        document.getElementById('prof-id').innerText = `@${uid.substring(0,5)}`;
    };

    // 5. データのリアルタイム購読
    auth.onAuthStateChanged(user => {
        const loginBtn = document.getElementById('loginBtn');
        const headerIcon = document.getElementById('header-user-icon');
        const displayNameElem = document.getElementById('display-name');

        if (user) {
            if (loginBtn) loginBtn.style.display = "none";
            if (headerIcon) {
                headerIcon.style.display = "block";
                headerIcon.src = user.photoURL;
            }
            if (displayNameElem) displayNameElem.innerText = user.displayName;
            document.getElementById('sidebar-my-profile').style.display = "block";
            
            db.collection("users").doc(user.uid).set({
                name: user.displayName,
                icon: user.photoURL,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }
        window.loadPosts();
    });

    window.loadPosts = () => {
        db.collection("posts").orderBy("createdAt", "desc").onSnapshot(snap => {
            const list = document.getElementById('postsList');
            if (!list) return;
            list.innerHTML = "";
            snap.forEach(doc => {
                const d = doc.data();
                list.innerHTML += `
                    <div class="post-card">
                        <div style="display:flex; align-items:center;">
                            <img src="${d.icon}" class="user-icon-img">
                            <strong>${d.name}</strong>
                        </div>
                        <p>${d.content}</p>
                    </div>`;
            });
        });
    };
}
