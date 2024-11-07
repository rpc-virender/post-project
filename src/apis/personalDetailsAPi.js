import $ from 'jquery';
const URL = window.location.origin;

export const postDetailsFunction = (signupDetails,setErrorList,setStep,isUpdated,seterroIds,SetPostDetailsRes,isOtpRequired,increaseStep) => {
	
	$("#_PD_Btns").css("disabled", true);
    $("#_PD_Btns").css("cursor", "wait");
	
	var URL2 = window.location.origin
    const url = `${URL2}/user/v1/registerUser?isupdate=${isUpdated}`;
    fetch(url, {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            "name": signupDetails.userName,
            "email": signupDetails.email,
            "usertype": signupDetails.usertype,
            "password": signupDetails.password,
            "mobile": signupDetails.mobile
        })
    })
    .then(response => { 
        return response.json() })
    .then(res => { 
        if(res.status == true){
			if(isOtpRequired){
	           setStep(prevState => {
	                return prevState+1;
	            });
            }else{
				if(signupDetails.usertype == 'A'){
					increaseStep(2);
				}
				else if(signupDetails.usertype == 'B'){
					increaseStep(3);
				}
				else{
					increaseStep(6);
				}
				
			}
			// setSignupRes(res.status);
             
        }else{
			
			if(res != undefined && res != null && res.flag != undefined && res.flag != null) {
				// 
				if(res.flag == "m") {
					seterroIds(["mobile"]);
				//	setErrorList(["mobile number already exist"])
					let con=document.getElementById("conmobile");
					con.style.borderColor="#F00"
                    //signupWithOutRigisterText
                    //goToForgetPassword

                    $("#signupWithOutRigisterText").hide();
                    $("#goToForgetPassword").show();

					let err=document.getElementById("errmsgmobile");
					err.textContent="Provided Mobile number already Registered with us"
					
				}else if(res.flag == "e") {
					seterroIds(["email"]);
				//	setErrorList(["email id already exist"])
					
					let con=document.getElementById("conemail");
					con.style.borderColor="#F00"
					
					let err=document.getElementById("errmsgemail");
					err.textContent="Provided Email id is already Registered with us"

                    $("#signupWithOutRigisterText").hide();
                    $("#goToForgetPassword").show();
				}
			}else {
				seterroIds(["erroInternal"]);
            	    setErrorList(["please fill all the Field properly"]);
				}
			
        }  
        
        SetPostDetailsRes(res);
    }
    
    
    ) 
    .catch((err) => {
        console.error(err);

    } );
};



export const agentAddressDetails = (signupDetails,setRes ,setErrorList,increaseStep) => {
	
	$("#_AA_Btns").css("disabled", true);
    $("#_AA_Btns").css("cursor", "wait");

	var URL2 = window.location.origin
    const url = `${URL2}/user/v1/registerUser-other`;
    
    const formData = new FormData();
    formData.append("logo",signupDetails.logoData);
    formData.append("data", JSON.stringify(signupDetails));

    fetch(url,{
        method:'post',
        body: formData
    })
    
    .then(response => { 
        return response.json()
         })
         
    .then(response=>{
		if(response){
			increaseStep(4)
            $("#tracker").hide()
		}
		setRes(response);
        
    })

    .catch((err=>{
        console.error(err);
    }));

}





export const builderAndCompanyDetails = (signupDetails,setRes ,setErrorList,increaseStep) => {
	
	$("#_BCD_D_Btns").css("disabled", true);
    $("#_BCD_D_Btns").css("cursor", "wait");
	
	var URL2 = window.location.origin
    const url = `${URL2}/user/v1/registerUser-other`;
    
    const formData = new FormData();
    formData.append("logo",signupDetails.logoData);
    formData.append("data", JSON.stringify(signupDetails));

    fetch(url,{
        method:'post',
        body: formData
    })
    
    .then(response => { 
        return response.json()
         })
         
    .then(response=>{
		if(response.status){
            $("#tracker").hide()
			increaseStep(1)
		}
		setRes(response);
        
    })

    .catch((err=>{
        console.error(err);
    }));

}