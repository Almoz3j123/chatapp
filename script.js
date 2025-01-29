// إعداد Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAlsfgG5cbyMUNiFpbxX9gUYonrXprIRDg",
  authDomain: "chatapp-c3b80.firebaseapp.com",
  databaseURL: "https://chatapp-c3b80-default-rtdb.firebaseio.com",
  projectId: "chatapp-c3b80",
  storageBucket: "chatapp-c3b80.firebasestorage.app",
  messagingSenderId: "677277490313",
  appId: "1:677277490313:web:3cf7d7f15f6596479c7a58",
  measurementId: "G-9D96WZRY4P"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const auth = firebase.auth();

// تسجيل الدخول باستخدام جوجل
function login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            document.getElementById("login").style.display = "none";
            document.getElementById("chat").style.display = "block";
            loadMessages();
        })
        .catch((error) => {
            console.error("خطأ في تسجيل الدخول:", error);
        });
}

// تسجيل الخروج
function logout() {
    auth.signOut().then(() => {
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