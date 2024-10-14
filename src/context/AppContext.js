import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null) ;
    const [messagesId, setMessagesId] = useState(null);
    const [messages, setMessages] = useState(null);
    const [chatUser, setChatUser] = useState(null)

    const navigate = useNavigate();
    // to get userchat
    const loadUserData = async (uid) => {
        try{
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
         
            const userData = userSnap.data();
            setUserData(userData);
            if(userData.avatar && userData.name) {
                navigate('/chat');
            }else {
                navigate("/profile");
            }
            await updateDoc(userRef, {
                lastSeen:Date.now()
            })
            setInterval(async ()=> {
                if(auth.chatUser) {
                    await updateDoc(userRef, {
                        lastSeen:Date.now()
                    })
                }
            }, 6000);
        }catch(error) {

        }
    }
    // for chatData

    useEffect(()=> {
        if(userData) {
            const chatRef = doc(db, 'chats' , userData.id);
            const unSub = onSnapshot(chatRef, async(res) => {
                 const chatItems = res.data().chatsData;
                //  console.log(res.data())
                 const tempData = [];
                 for (const item of chatItems) {
                    const userRef= doc(db, 'users', item.rId);
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.data();
                    tempData.push({...item, userData})
                 }
                 setChatData(tempData.sort((a, b)=> b.updateAt - a.updateAt))
            })
            return () => {
                unSub();
            }
        }
    }, [userData])

    const value = {
        userData, setUserData, chatData ,setChatData, loadUserData,
        messages, setMessages, messagesId, setMessagesId,
        chatUser, setChatUser
    }

    return(
        <>
            <AppContext.Provider value={value}>
                    {props.children}
            </AppContext.Provider>
        </>
    )
}

export default AppContextProvider;