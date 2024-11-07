import React, { useEffect, useState } from "react";

import {successGif} from "../images/commonImages";

const SuccessPage = ({time}) => {
	
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  


  useEffect(() => {
		  if(remainingSeconds > 0) {
			  
			  setTimeout(() => {
				  setRemainingSeconds(remainingSeconds-1);
				}, 1000);
				
		  }else {
			  // reload
		  }    
  }, [remainingSeconds]);
  
  useEffect(() => {
	  if(time != undefined && time != null && time != 0){
		  setRemainingSeconds(time/1000);
	  }    
  }, [time]);
  
  
  
  
 
    return(
        <div className="successPageMainCon">
            <h2 className="congratesHeading">Congratulations !</h2>
            <p className="successPageContent">Your account has been created successfully</p>

            <img src={successGif} alt="" className="success_gif" />
            <p className="SuccessPageBottomContent">
				You will be redirected to homepage in <span>{remainingSeconds}</span> Sec.
			</p>
        </div>
    )
};





export default SuccessPage;