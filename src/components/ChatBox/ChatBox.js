import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc ,setDoc} from 'firebase/firestore';
import { db } from "../../config/firebase";
import { toast } from 'react-toastify';
const ChatBox = () => {
  const {userData, messagesId, chatUser, messages, setMessages} = useContext(AppContext)
    // state for input data
    const [input, setInput] = useState("")
// for set message
const sendMessage = async () => {
  try {
    if (input && messagesId) {
      // Update the message in the 'messages' collection
      await updateDoc(doc(db, 'messages', messagesId), {
        messages: arrayUnion({
          sId: userData.id,
          text: input,
          createdAt: new Date(),
        }),
      });

      // Update chat data for both users
      const userIDs = [chatUser.rId, userData.id];
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "chats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatData = userChatsSnapshot.data();

          // Ensure that chatsData exists and is an array
          if (userChatData.chatsData && Array.isArray(userChatData.chatsData)) {
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messagesId === messagesId
            );

            // Check if a valid chat was found
            if (chatIndex !== -1) {
              // Update the last message and other info
              userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
              userChatData.chatsData[chatIndex].updatedAt = Date.now();

              // Mark the message as unseen for the other user
              if (userChatData.chatsData[chatIndex].rId === userData.id) {
                userChatData.chatsData[chatIndex].messageSeen = false;
              }
            } else {
              // No chat found, create a new entry
              console.log("No chat found with the given messagesId. Creating a new chat entry.");
              userChatData.chatsData.push({
                messagesId,
                lastMessage: input.slice(0, 30),
                rId: userData.id,
                updatedAt: Date.now(),
                messageSeen: false,
              });
            }

            // Update the chat data
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          } else {
            console.error("chatsData is undefined or not an array.");
          }
        }
      });
    }
  } catch (error) {
    toast.error(error.message);
  }

  // Clear input after sending the message
  setInput("");
};

const convertTimestamp = (timestamp) => {
  let date = timestamp.toDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  if(hour > 12) {
    return hour -12 + ":" + minute + "PM";
  }
  else {
    return hour + ":" + minute + "AM";
  }
}

// useEffect for message

useEffect(() => {
  if (messagesId) {
    const fetchData = async () => {
      const docRef = doc(db, "messages", messagesId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const unSub = onSnapshot(docRef, (res) => {
          const data = res.data();
          if (data && data.messages) {
            setMessages(data.messages.reverse());
            console.log(data.messages.reverse());
          } else {
            console.log("No messages found.");
          }
        });
        return () => {
          unSub();
        };
      } else {
        console.log("Document does not exist!");
        // You can also create the document here if needed
        await setDoc(docRef, { messages: [] });
        console.log("New document created with empty messages array.");
      }
    };

    fetchData();
  }
}, [messagesId]);

  return chatUser ? (
    <div className='chat-box'>
        <div className='chat-user'>
          <img src={chatUser.userData.avatar} alt='profile'/>
          <p>{chatUser.userData.name}<img src={assets.green_dot} alt='green-dot' className='dot'/></p>
          <img src={assets.help_icon} className='help' alt=''/>
        </div>
        <div className='chat-msg'>
         {/* sender message */}
         {
  messages?.length > 0 && messages.map((msg, index) => (
    <div key={index} className={msg.sId === userData.id ? "sent-msg" : "receive-msg"}>
      <p className='msg'>{msg.text}</p>
      <div>
        <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt='profile'/>
        <p>{convertTimestamp(msg.createdAt)}</p>
      </div>
    </div>
  ))
}

      
         {/* sender message */}
         {/* sender image section */}
         {/* <div className='sent-msg'>
         <img src={assets.pic1} alt='pic1' className='msg-img'/>
               <div>
                  <img src={assets.profile_img} alt='profile'/>
                  <p>2:30 PM</p>
              </div>
            </div> */}
         {/* sender image section  */}
         {/* receiiver message */}
         {/* <div className='receive-msg'>
              <p className='msg'>Lorem ipsum Lorem ipsumLorem ipsumLorem ipsum</p>
              <div>
                  <img src={assets.profile_img} alt='profile'/>
                  <p>2:30 PM</p>
              </div>
            </div> */}
         {/* receiiver message */}
         
        </div>
        <div className='chat-input'>
          <input type='text' placeholder='send a message' onChange={(e)=> setInput(e.target.value)} value={input}/>
          <input type='file' id="image" accept='image/png, image/jpeg' hidden/>
          <label htmlFor='image'>
            <img src={assets.gallery_icon} alt='Gallery icon'/>
          </label>
          <img onClick={sendMessage} src={assets.send_button} alt='send button'/>
        </div>
    </div>
  ) : <div className='chat-welcome'>
      <img src={assets.logo_icon} alt='logo' />
      <p>Chat anytime , anyWhere</p>
  </div>
}

export default ChatBox;
