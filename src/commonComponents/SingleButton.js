import React, { memo, useRef } from "react";
import {loader} from '../images/commonImages';

const SingleButton = ({ buttonId, containerClassName, buttonClassName, onSubmit, title, disabled, hide, value, name, icon, LoaderMessage, onMouseOver, toolTip }) => {

    const buttonRef = useRef(null);
  
    const handleClick = () => {
      if (buttonRef && buttonRef.current) buttonRef.current.focus();
    };

    return(
        <div id={`${buttonId}_main_con`} className={containerClassName} onClick={()=>handleClick()}>
            <div style={{ display : disabled ? "flex" : "none" }} id={`${buttonId}_loader`} className="loaderContainer">
                <img src={loader} alt="" className="loaderGif" />
                <span>{LoaderMessage}</span>
            </div>

            {hide != "true" &&
            <button 
                ref={buttonRef}
                id={buttonId}
                className={buttonClassName}
                disabled={disabled}
                style={{ cursor : disabled ? "wait" : "pointer" }}
                onClick={(e)=>onSubmit ? onSubmit(e) : ""}
                value={value}
                name={name}
                title={toolTip ? toolTip : ""}
                onMouseOver={(e)=>{
                    if(onMouseOver){
                        onMouseOver(e, "O")}
                    }
                }
                onMouseOut={(e)=>{
                    if(onMouseOver){
                        onMouseOver(e, "L")}
                    }}
                >
                {/* <span id={`${buttonId}_title`} className={buttonTitle}>{title}</span> */}
                {icon ? icon : ""}
                {title}
            </button>
            } 
        </div>
    )
};

export default memo(SingleButton);