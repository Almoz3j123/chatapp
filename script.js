console.log("جارٍ تحميل script.js...");

// إعداد Firebase (استبدل القيم بمعلومات مشروعك من Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyAlsfgG5cbyMUNiFpbxX9gUYonrXprIRDg",
  authDomain: "chatapp-c3b80.firebaseapp.com",
  databaseURL: "https://chatapp-c3b80-default-rtdb.firebaseio.com",
  projectId: "chatapp-c3b80",
  storageBucket: "chatapp-c3b80.firebasestorage.app",
  messagingSenderId: "677277490313",
  appId: "1:677277490313:web:3cf7d7f15f6596479c7a58",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const auth = firebase.auth();

// التأكد من تحميل Firebase
console.log("Firebase:", firebase);

// التأكد من تحميل زر تسجيل الدخول
document.getElementById("loginButton").addEventListener("click", function() {
    console.log("تم الضغط على زر تسجيل الدخول!");
    login();
});

// تسجيل الدخول باستخدام جوجل
function login() {
    console.log("جارٍ محاولة تسجيل الدخول...");
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)
        .then((result) => {
            console.log("✅ تم تسجيل الدخول بنجاح:", result.user);
            alert("تم تسجيل الدخول بنجاح!");
            document.getElementById("login").style.display = "none";
            document.getElementById("chat").style.display = "block";
            loadMessages();
        })
        .catch((error) => {
            console.error("❌ خطأ في تسجيل الدخول:", error);
            alert("⚠️ خطأ في تسجيل الدخول: " + error.message);
        });
}

// تسجيل الخروج
function logout() {
    auth.signOut().then(() => {
        console.log("🚪 تم تسجيل الخروج!");
        document.getElementById("login").style.display = "block";
        document.getElementById("chat").style.display = "none";
    });
}

// إرسال رسالة
function sendMessage() {
    const user = auth.currentUser;
    if (user) {
        const messageInput = document.getElementById("messageInput");
        const message = messageInput.value;
        if (message.trim() !== "") {
            db.ref("messages").push({
                name: user.displayName,
                text: message,
                timestamp: new Date().toISOString()
            });
            messageInput.value = "";
        }
    }
}

// تحميل الرسائل في الوقت الفعلي
function loadMessages() {
    db.ref("messages").on("child_added", (snapshot) => {
        const msg = snapshot.val();
        const msgElement = document.createElement("div");
        msgElement.textContent = `${msg.name}: ${msg.text}`;
        document.getElementById("messages").appendChild(msgElement);
    });
}
