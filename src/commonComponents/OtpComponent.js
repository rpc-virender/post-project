import React, { useState, useEffect } from "react";
import $ from 'jquery';
import SingleButton from '../commonComponents/SingleButton';
import { verifyOtp } from "../apis/verifyOTPAPi";
import { getOtp } from "../apis/forgetPasswordApi";
import ResetPassword from "../loginSignupComponents/resetAndForgetPasswordComponents/resetPassword";
import OtpInputField from '../commonComponents/OtpInputField';
import ErrorMsgPopup from '../commonComponents/ErrorMsgPopup';
//import BackEndErrorPopup from "./BackEndErrorPopup";

const OtpComponent = ({setStyleForWrongOTP, styleForWrongOTP,value, setCountDown, countDown, valueLength, onChange, otpValue, setOtp, username,onNextClick,identifier ,signupDetails}) => {
	const [otpRes, setOtpRes] = useState({});
	const [res , setRes] = useState({});
  	const [mobileShow , setMObileShow] = useState("")

    // if OTP RESPOSE IS FAIL then : {color:"#F00", borderBottom: "1px solid #F00"}

    const [errorMessage , setErrorMessage] = useState("");
      
    const openResetPassword = (otpRes) => {
      if (otpRes.status) {
        $("#otpBox").css("display", "none");
        $("#resetPasswordBox").css("display", "flex");
      }
    };
    
	
	useEffect(()=>{
		if( signupDetails != undefined && signupDetails.mobile != undefined){
			setMObileShow(signupDetails.mobile.replace(/\d(?=\d{4})/g, "*"))
		}
	},[signupDetails.mobile])
    
   const onResendButtonClick = (e) => {
    setErrorMessage('')
    setOtp("")
    setStyleForWrongOTP({color:"#000", borderBottom: "1px solid #144A76"})
    e.preventDefault();
    if (signupDetails !== undefined && signupDetails !== null) {
        getOtp(signupDetails.mobile, setRes,setCountDown);
        
    }
}
	

const submitOtp = (e) => {

  if(value != undefined || value.length == 0 || value == ""){
    setErrorMessage("Enter OTP to continue")
  }else{
      
    if(identifier=='L'){
      onNextClick(e);
    }
    else{
      verifyOtp(otpValue, setOtpRes, username.username,identifier, setCountDown);
    }
  }
  
};


  useEffect(() => {
    if (otpRes.status) {
      //setErrorMessage(otpRes.message);
      openResetPassword(otpRes);
    }
    else{
      setErrorMessage(otpRes.message);
      if(otpRes.status != undefined && otpRes.status ==false) {
        $("#errMsgForOtpErrors-1").show();
      }
    }

    if (otpRes.status) {
      //setErrorMessage(otpRes.message);
      openResetPassword(otpRes);
    }
    else{
      if(otpRes.status != undefined && otpRes.status =="F"){
        //setErrorMessage(otpRes.message);
        
      }
    }
    
  }, [otpRes]);

  // useEffect(() => {
    
    
  // }, [otpRes]);
	
	const onChange1 = (e) => {
    onChange(e);
    $("#errMsgForOtpErrors-1").hide();
    setStyleForWrongOTP({color:"#505050", borderBottom: "1px solid #505050"});
  }
    

    

    let interval;

    useEffect(() => {
      if(countDown != null){

          
          interval = setInterval(() => {
            if(countDown > 0){
              setCountDown(countDown - 1);
            }
          }, 1000);
      
          return () => clearInterval(interval);
    }
    }, [countDown]);

  
    if(countDown == -1){
      clearInterval(interval);
    }    

    return(
		<div className="otpComponentMainCon">
		
			<div id="resetPasswordBox" style={{display:"none"}}>
					<ResetPassword/>
				</div>
		
        <div id="otpBox" className="ver-order">
            <p  className="otpHeadingContent">Please enter your OTP to verify your account</p>
            <p className="otpParaContent">A One-Time Password has been sent to {mobileShow}</p>

            <div className="otpComponentFieldAndResendCon">
              <OtpInputField 
                styleForWrongOTP={styleForWrongOTP}
                value={value}
                valueLength={valueLength}
                onChange={onChange1}
              />
               

              {countDown != 0  ? <p className="resend-timer">Resend in <span id="some_div">{countDown}</span> sec</p> : <a onClick={(e) =>  onResendButtonClick(e)}className="resendBtn">Resend OTP</a>}
            </div>

              <p id="errMsgForOtpErrors-1" className="errMsgForOtpErrors" style={{display:"none"}}>You’ve entered wrong OTP, Please enter your OTP again!</p>
            

            <SingleButton 
                buttonId="otpButton"
                containerClassName="LoginButtonSingup loginRemembarMeBoxLgSgGtpComopanybutttons"
                buttonClassName="otp-validation-btn"
                onSubmit={(e) => submitOtp(e)}
                title="VALIDATE"
            />

             <ErrorMsgPopup key="erroronforgotPassword2" setMessage={setErrorMessage} message={errorMessage} />



        </div>
      
    </div>
    )
};

export default OtpComponent;