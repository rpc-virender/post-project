import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';

const URL = window.location.origin;

export const verifyOtp = (otp, setOtpRes, username ,  identifier,setOtp ,setCountDown) => {

  const url = `${URL}/user/v1/isMobileAndEmailOTPVerified`;
  
  let requestBody;
  
  if(identifier==="F"){
  	 requestBody = JSON.stringify({ otp: otp, username: username.username });
  }
  else{
	   requestBody = JSON.stringify({ otp: otp, username: username });
  }

  fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: requestBody
  })

    .then(response => { 
        return response.json() })
     .then(data => {
			//setOtp('');
		  setOtpRes(data);

      if (data.status === true) {
        if(identifier !== undefined && identifier==='F'){
         Cookies.set('token', data.token)
        }
       
        $("#backendPopup1").hide();
		    $("#otpVerifyId").text("");
      }
      else{
        setCountDown(0)
		   $("#backendPopup1").show();
			$("#otpVerifyId").text("fill correct otp");
	  } 
      
    })
   
    .catch(err => console.error('Error:', err));
};

