import React from 'react'
import './RightSidebar.css';
import assets from "./../../assets/assets";
import { logout } from '../../config/firebase';

const RightSidebar = () => {
  return (
    <div className='right-side'>
      <div className='rs-profile'>
        <img src={assets.profile_img} alt='profile'/>
        <h3>Vinodh <img src={assets.green_dot} className='dot' alt='green-dot'/></h3>
        <p>Hey there i am vinodh</p>
      </div>
      <hr/>
      <div className='rs-media'>
          <p>Media</p>
          <div>
              <img src={assets.pic1} alt='pic1'/>
              <img src={assets.pic2} alt='pic2'/>
              <img src={assets.pic3} alt='pic3'/>
              <img src={assets.pic4} alt='pic4'/>
              <img src={assets.pic1} alt='pic1'/>
              <img src={assets.pic2} alt='pic2'/>
          </div>
          <button onClick={()=> logout()}>Logout</button>
      </div>
    </div>
  )
}

export default RightSidebar
