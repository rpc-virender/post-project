import React, { useEffect } from 'react'
import { userdeactivatedImage } from '../images/commonImages'
import { crossIconSvg } from '../images/commonSvgs'

export default function UserDeactivatedPage() {

  useEffect(()=>{
    document.body.style.overflow = "hidden";
  },[]);

  const onRedirectToHomePage =()=>{
    window.location.href = (`${window.location.origin}/home`)
  };

  return (
    <div className='userDeactivatedPageMainCon'>
        
        <div className='userdeactivatedPoupBox'>
            <span className='userDeactivatedPageCrossIcon' onClick={()=>onRedirectToHomePage()} >
                {crossIconSvg}
            </span>
            <img alt="" src={userdeactivatedImage} className="userdeactivatedImage" />
            <div className='userdeactivatedPoupContantBox'>
                <p className='userdeactivatedHeading'>Approval Pending  !</p>
                <p className='userdeactivatedContant'>The user is currently not approved. Please wait for our internal team's approval. Thank you for your patience.</p>
            </div>
        </div>
    </div>
  )
}
