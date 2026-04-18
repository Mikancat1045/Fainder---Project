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

    // 3. SNSのHTML/CSS注入
    root.innerHTML = `
    <style>
        :root {
            --bg-color: #131314;
            --nav-bg: rgba(19, 19, 20, 1);
            --text-gemini: #e3e3e3;
            --accent-gradient: linear-gradient(90deg, #4285f4, #9b72cb, #d96570);
            --sidebar-bg: #1e1f20;
            --card-bg: #1e1f20;
        }
        body { background-color: var(--bg-color); color: var(--text-gemini); margin: 0; }
        header { position: fixed; top: 0; width: 100%; height: 64px; background: var(--nav-bg); display: flex; align-items: center; padding: 0 16px; border-bottom: 1px solid #333; box-sizing: border-box; z-index: 1000; }
        .app-brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        #app-main-logo { width: 32px; height: 32px; border-radius: 8px; }
        .search-bar { margin-left: auto; background: #28292a; border: none; color: white; padding: 8px 15px; border-radius: 20px; width: 150px; }
        
        #sidebar { position: fixed; top: 0; left: -280px; width: 260px; height: 100%; background: var(--sidebar-bg); transition: 0.3s; z-index: 1200; padding-top: 80px; }
        .sidebar-open #sidebar { transform: translateX(280px); }
        #overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1100; }

        .page { display: none; padding: 80px 20px; max-width: 700px; margin: 0 auto; animation: fadeIn 0.3s; }
        .page.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .post-card { background: var(--card-bg); border-radius: 16px; padding: 16px; margin-bottom: 15px; border: 1px solid #333; }
        .user-icon-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
        .post-input-container { background: #1e1f20; border-radius: 24px; padding: 15px; border: 1px solid #444; margin-bottom: 20px; }
        .post-btn { background: #4285f4; color: white; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; font-weight: bold; }
    </style>

    <header>
        <button onclick="toggleSidebar()" style="background:none; border:none; color:white; font-size:24px; cursor:pointer;">≡</button>
        <div class="app-brand" onclick="showPage('home')">
            <img id="app-main-logo" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80">
            <span style="font-size:20px; font-weight:bold;">Fainder</span>
        </div>
        <input type="text" class="search-bar" placeholder="Search...">
        <img id="header-user-icon" onclick="openMyProfile()" style="width:34px; height:34px; border-radius:50%; margin-left:15px; cursor:pointer; display:none;">
    </header>

    <div id="overlay" onclick="toggleSidebar()"></div>
    <nav id="sidebar">
        <div style="padding: 20px;">
            <p id="display-name" style="font-weight:bold; font-size:18px;">Guest</p>
            <hr style="border:0.5px solid #333; margin: 15px 0;">
            <div onclick="showPage('home')" style="padding:10px; cursor:pointer;">Home</div>
            <div id="sidebar-my-profile" onclick="openMyProfile()" style="padding:10px; cursor:pointer; display:none;">Profile</div>
            <div id="loginBtn" onclick="loginWithGoogle()" style="padding:10px; background:white; color:black; border-radius:8px; text-align:center; cursor:pointer; margin-top:10px;">Login with Google</div>
            <div onclick="logoutAction()" style="padding:10px; color:#d96570; cursor:pointer; margin-top:20px;">Logout</div>
        </div>
    </nav>

    <section id="home" class="page active">
        <div class="post-input-container">
            <div style="display:flex; gap:12px; align-items:center;">
                <img id="user-post-icon" src="https://api.dicebear.com/7.x/avataaars/svg?seed=guest" class="user-icon-img">
                <input type="text" id="postText" placeholder="いま何してる？" style="flex:1; background:none; border:none; color:white; outline:none; font-size:16px;">
                <button class="post-btn" onclick="addPost()">投稿</button>
            </div>
        </div>
        <div id="postsList"></div>
    </section>

    <section id="profile" class="page">
        <div class="post-card" style="text-align:center; padding:30px;">
            <img id="prof-icon" class="user-icon-img" style="width:100px; height:100px; margin-bottom:15px; border:3px solid #4285f4;">
            <h2 id="prof-name" style="margin:0;">---</h2>
            <p id="prof-id" style="color:#888;"></p>
        </div>
        <div id="profile-content-area"></div>
    </section>
    `;

    // 4. ロジック実行
    const auth = firebase.auth();
    const db = firebase.firestore();

    window.toggleSidebar = () => {
        document.body.classList.toggle('sidebar-open');
        document.getElementById('overlay').style.display = document.body.classList.contains('sidebar-open') ? 'block' : 'none';
    };

    window.showPage = (id) => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        if (document.body.classList.contains('sidebar-open')) toggleSidebar();
    };

    window.loginWithGoogle = async () => {
        await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        location.reload();
    };

    window.logoutAction = () => {
        auth.signOut();
        document.cookie = "fainder_access=; max-age=0; path=/";
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

    window.openMyProfile = () => { if (auth.currentUser) showUserProfile(auth.currentUser.uid); };

    window.showUserProfile = async (uid) => {
        showPage('profile');
        const doc = await db.collection("users").doc(uid).get();
        const data = doc.exists ? doc.data() : { name: "Unknown", icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=none" };
        document.getElementById('prof-name').innerText = data.name;
        document.getElementById('prof-icon').src = data.icon;
        document.getElementById('prof-id').innerText = `@${uid.substring(0,8)}`;
    };

    auth.onAuthStateChanged(user => {
        if (user) {
            document.getElementById('loginBtn').style.display = "none";
            document.getElementById('sidebar-my-profile').style.display = "block";
            const hIcon = document.getElementById('header-user-icon');
            hIcon.style.display = "block";
            hIcon.src = user.photoURL;
            document.getElementById('display-name').innerText = user.displayName;
            document.getElementById('user-post-icon').src = user.photoURL;
            
            db.collection("users").doc(user.uid).set({
                name: user.displayName,
                icon: user.photoURL,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }
        loadPosts();
    });

    function loadPosts() {
        db.collection("posts").orderBy("createdAt", "desc").onSnapshot(snap => {
            const list = document.getElementById('postsList');
            if (!list) return;
            list.innerHTML = "";
            snap.forEach(doc => {
                const d = doc.data();
                list.innerHTML += `
                    <div class="post-card">
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                            <img src="${d.icon}" class="user-icon-img" onclick="showUserProfile('${d.uid}')" style="cursor:pointer;">
                            <strong onclick="showUserProfile('${d.uid}')" style="cursor:pointer;">${d.name}</strong>
                        </div>
                        <p style="margin:0; line-height:1.5; white-space:pre-wrap;">${d.content}</p>
                    </div>`;
            });
        });
    }
}
