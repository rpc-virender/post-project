import React, { useRef } from "react";

import {signupPageBackIcon} from '../images/commonSvgs';

const BackAndVerifyButtons = ({ buttonId, buttonOneClassName, buttonTwoClassName, containerClassName, onButtonOneCall, onButtonTwoCall, buttonOneTitle, buttonTwoTitle }) => {

    const buttonRef = useRef(null);
    const backBtnRef = useRef(null);
  
    const handleClick = () => {
      if (buttonRef && buttonRef.current) buttonRef.current.focus();
      if (backBtnRef && backBtnRef.current) backBtnRef.current.focus();
    };

    return(
        <div className={containerClassName} onClick={()=>handleClick()}>
            <button 
            id={buttonId}
                ref={buttonRef}
                className={buttonOneClassName}
                onClick={(e)=>onButtonOneCall(e)}
            >
                {buttonOneTitle == "Back" &&
                    signupPageBackIcon
                }
                {buttonOneTitle}
            </button>

            <button 
                id={`_${buttonId}`}
                ref={backBtnRef}
                className={buttonTwoClassName}
                onClick={(e)=>onButtonTwoCall(e)}
            >
                {buttonTwoTitle}
            </button>

        </div>
    )
};

export default BackAndVerifyButtons;


/*




                <div className={containerClassName} onClick={()=>handleClick()}>

            <button 
                ref={buttonRef}
                id={buttonId}
                className={buttonClassName}
                onClick={()=>onSubmit()}>
                {title}
            </button>

        </div>

*/