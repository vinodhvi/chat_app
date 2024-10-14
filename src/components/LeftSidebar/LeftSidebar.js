import React, { useContext, useState } from "react";
import assets from "./../../assets/assets";

import "./LeftSidebar.css";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where , doc, setDoc, serverTimestamp, updateDoc, arrayUnion} from "firebase/firestore";
import { db } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData,chatData, chatUser, setChatUser, setMessagesId, messageId } = useContext(AppContext);
  // state for users
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      // user
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          // console.log(querySnap.docs[0].data());
          let userExist = false
          chatData.map((user) => {
              if(user.rId === querySnap.docs[0].data().id) {
                userExist = true;
              }
          })
            if(!userExist) {
              setUser(querySnap.docs[0].data());
            }
          // setUser(querySnap.docs[0].data());
        }else{
          setUser(null);
        }
      }else{
        setShowSearch(false)
      }
    } catch (error) {
      console.log(error);
    }
  };

  // for chat
  const addChat = async () => {
    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try{
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createAt : serverTimestamp(),
        messages:[]
      })
      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage : "",
          rId: userData.id,
          updatedAt:Date.now(),
          messageSeen:true
        })
      })

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage : "",
          rId: user.id,
          updatedAt:Date.now(),
          messageSeen:true
        })
      })
    }catch(error) {
      toast.error(error.message);
      console.log(error)
    }
  }
  // for message

  const setChat = async (item) => {
    setMessagesId(item.messageId);
    setChatUser(item)
  }

  return (
    <div className="ls-bar">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="logo" className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="menu" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="search" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here..."
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? 
        <div className="friends add-user" onClick={addChat}>
           <img src={user.avatar} alt="profile" />
           <p>{user.name}</p>
           <span>{user.lastMessage}</span>
        </div> : chatData.map((item, index) => (
            <div className="friends" key={index} onClick={()=> setChat(item)}>
              <img src={item.userData.avatar} alt="profile" />
              <div>
                <p>{item.userData.name}</p>
                <span>{item.lastMessage}</span>
              </div>
            </div>
          ))
        }
           {/* {Array(12)
          .fill("")
          .map((item, index) => (
            <div className="friends" key={index}>
              <img src={assets.profile_img} alt="profile" />
              <div>
                <p>Vinodh</p>
                <span>Hello, How are you?</span>
              </div>
            </div>
          ))} */}
     
      </div>
    </div>
  );
};

export default LeftSidebar;
