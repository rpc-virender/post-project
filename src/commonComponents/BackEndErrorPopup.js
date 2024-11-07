import React from "react";
import {backendErrorIcon} from '../images/commonSvgs';
import $ from 'jquery';

const BackEndErrorPopup = ({textId, containerId}) => {
	
    return(
        <div id={containerId} className="backendErrPopupCon">
            <div className="backendErrBox">
                <svg id="close" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" className="beckendErrcrossIcon" onClick={()=> $(`#${containerId}`).hide()}>
                    <rect width="32" height="32" rx="16" fill="#767270"/>
                    <path d="M22.5 9.5L9.5 22.5M9.5 9.5L22.5 22.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {backendErrorIcon}
                <p id={textId} className="backendErrHeading">problem is from our side </p> 
            </div>
        </div>
    )
};

export default BackEndErrorPopup;