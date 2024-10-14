import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCztyzC-1i6k-jOKRceyJPBbc6meijM5VY",
  authDomain: "chatt-app-b943f.firebaseapp.com",
  projectId: "chatt-app-b943f",
  storageBucket: "chatt-app-b943f.appspot.com",
  messagingSenderId: "672303751574",
  appId: "1:672303751574:web:32688c9e62d2c4cbf6bdb7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db= getFirestore(app);
const signup = async (username, email, password) => {
    try{
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey, There i an using Chat app",
            lastSeen:Date.now()
        })
        await setDoc(doc(db, "chats", user.uid), {
            chatsData:[],
        })
    }catch(error) {
        console.log(error)
        toast.error(error.code.split('/')[1].split('-').join(" "))
    }
}

const login = async(email, password) => {
    try{
        await signInWithEmailAndPassword(auth, email, password)
    }catch(error) {
        console.log(error)
        toast.error(error.code.split('/')[1].split('-').join(" "))
    }
}
const logout =async () => {
   try{
    await signOut(auth)
   }catch(error) {
    console.log(error)
    toast.error(error.code.split('/')[1].split('-').join(" "));
   }
}

export {signup, login, logout, auth, db}