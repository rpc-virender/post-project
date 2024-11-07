import React, { useState, useEffect } from "react";
import { PopupCrossMark} from "../images/commonSvgs";

const ErrorMsgPopup = ({message, setMessage}) => {
    const [boxStatus, setBoxStatus] = useState("flex");

    const hideMainboxBox = () => {
        setTimeout(function () {
            setBoxStatus("none");
            setMessage("");
        }, 3000);
    };

    useEffect(()=>{
		setBoxStatus("flex");
        hideMainboxBox();
    },[message]);

    return(
		<div>
		{message  && message != '' && message != "" && (
	        <div className="errPopupCon" style={{display: boxStatus}}>
	            {/* {errorSymbolCrossIcon} */}
                <PopupCrossMark id="errMsgCrossIcon" key="errMsgCrossIcon" className="" onClick={()=>("")} />
	            <p className="errorContent">{message}</p>
	        </div>
       ) }
        </div>
    )
};

export default ErrorMsgPopup;