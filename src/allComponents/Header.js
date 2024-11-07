import React from "react";

import { builderProfileDefaultImg, agentProfileDefaultImg, individualProfileDefaultImg, GrpLogoSvg } from "../images/commonSvgs";
import { userName, userType } from "../images/constant";

import '../styles/header.css';

const Header = () => {
    
    const getUserProfile = () => {
        // let type = userDetails != undefined && userDetails != null && userDetails.usertype != undefined && userDetails.usertype != null ? userDetails.usertype : "" ; 
        if(typeOfuser){
            if(typeOfuser === "Builder"){
                return builderProfileDefaultImg
            }else if(typeOfuser === "Agent"){
                return agentProfileDefaultImg
            }else{
                return individualProfileDefaultImg
            } 
        } 
    }
    const TypeUser= userType !== undefined && userType != null ? userType : "B";
    
    const typeOfuser=TypeUser === "I"? "Individual" : TypeUser === "A" ? "Agent" : "Builder"
    return(
        <div className="mainHeaderCon space-between-order">
            <a href={window.location.origin}>
                {/* <img src={projectLogoWeb} className="headerLogoImg" alt="" /> */}


                <GrpLogoSvg key="posteProjAndPropHeaderLogo" className="headerLogoImg" />
            </a>
            
            <div className="hor-order">
                <div className="userNameDetailsCon">
                    <span className="userName">{userName ? userName : ""}</span>
                    <span className="userType">{typeOfuser ? typeOfuser : ""}</span>
                </div>
                
                <div className="profileImgCon hor-order">
                <span className="profileImg">{getUserProfile()}</span>
                </div>
            </div>
        </div>
    )
};


export default Header;