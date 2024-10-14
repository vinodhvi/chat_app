import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import assets from './../../assets/assets';
import { onAuthStateChanged } from "firebase/auth";
import {auth, db} from './../../config/firebase'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../../lib/Upload";
import { AppContext } from "../../context/AppContext";
const ProfileUpdate = () => {
// state for image change

const [image, setImage] = useState(false)
const navigate = useNavigate()
// state for input
const [name, setName] = useState("")
const[bio, setBio] = useState('');
const[prevImage, setPrevImage] = useState('');
const [uid, setUid] = useState("")
const {setUserData} = useContext(AppContext)
// profile update
const profileUpdate = async (event) => {
  event.preventDefault();
  try{
    if(!prevImage && !image) {
      toast.error("Upload profile image")
    }
    const docRef = doc(db, "users", uid);
    if(image) {
      const imgUrl = await Upload(image)
      setPrevImage(imgUrl);
      await updateDoc(docRef, {
        avatar:imgUrl,
        bio:bio,
        name:name
      })
    }else {
      await updateDoc(docRef, {
     
        bio:bio,
        name:name
      })
    }
    const snap = await getDoc(docRef);
    setUserData(snap.data());
    navigate("/chat")
  }catch(error) {
    console.error(error);
    toast.error(error.message)
  }
}

useEffect(()=> {
  onAuthStateChanged(auth, async (user) => {
    if(user) {
      setUid(user.uid)
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.data().name) {
        setName(docSnap.data().name);
      }
      if (docSnap.data().bio) {
        setBio(docSnap.data().bio);
      }
      if (docSnap.data().avatar) {
       setPrevImage (docSnap.data().avatar);
      }
    }else {
      navigate("/")
    }
  })
},[])

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
            <h3>Profile Details</h3>
            <label htmlFor="avatar">
              <input onChange={(e)=> setImage(e.target.files[0])} type="file" id="avatar" accept=".png, .jpg, .jpeg"  hidden/>
              <img src={image? URL.createObjectURL(image) : assets.avatar_icon} alt="avatar"/>
              Upload profile image
            </label>
            <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="Your name" required />
            <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder="Write profile bio"/>
            <button type="submit">Save</button>
        </form>
        <img src={image? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt="logo_icon" className="profile-pic"/>
      </div>
    </div>
  );
};

export default ProfileUpdate;
