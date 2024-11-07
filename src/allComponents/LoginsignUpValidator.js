
// to convert the date from (2023-11-01T00:00:00.000+05:30) to (01-11-2023)
export const convertDateofBackend =(originalDate)=> {
  const updatedDate = new Date(originalDate);
  
  updatedDate.setDate(updatedDate.getDate());

  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const convertedDate = updatedDate.toLocaleDateString('en-IN', options);

  return convertedDate;
}

export const checkDateFormat = (dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}[+-]\d{2}:\d{2}$/;
    
    if (dateRegex.test(dateString)) {
        const date1 = new Date(dateString);
        return !isNaN(date1.getTime());
    }
    return false;
}

export const convertAllDateToBasic = (inputDate)=>{
	if(inputDate != undefined ){
		if(checkingDateFormatPhase(inputDate) == true){
			return convertDateFormatForPhases(inputDate)
		}else if (checkDateFormat(inputDate) == true){
			return convertDateofBackend(inputDate)
		}else{
			return inputDate ;
		}
	}
}

export const convertDateFormatForPhases =(inputDate)=> {
    var dateParts = inputDate.split('-');
    var inputDateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    var outputDate = inputDateObj.getDate() + '/' + (inputDateObj.getMonth() + 1) + '/' + inputDateObj.getFullYear();
    return outputDate;
}

export const checkingDateFormatPhase =(inputDate)=> {
    var regexYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;
    return regexYYYYMMDD.test(inputDate);
}

export const builderValidator = (signUpData,setErrorList,identifier,setErrorIds) => {
	let status=true;
	let errorList=[];
	var errorIds=[];
	
	if(!(typeof signUpData !== 'undefined' && signUpData)) {
		errorList.push("Please Register");
		status= false;
	}
	
	if(identifier == "b1") {
		
		if( !(typeof signUpData.address !== 'undefined' && signUpData.address )  ) {
			errorList.push("invalid builder address");
			errorIds.push("addressForBuilder")
			status= false;
		}
	
		if( !(typeof signUpData.state !== 'undefined' && signUpData.state )  ) {
			errorList.push("please select state");
			errorIds.push("state")
			status= false;
		}
		
		if( !(typeof signUpData.city !== 'undefined' && signUpData.city )  ) {
			errorList.push("Please Select City");
			errorIds.push("city")
			status= false;
		}
		
		
		if( !(typeof signUpData.pincode !== 'undefined' && signUpData.pincode && signUpData.pincode.length ==6  )  ) {
			errorList.push("Please Enter PinCode");
			errorIds.push("pincode")
			status= false;
		}
	}else if(identifier == "b2") {
		if( !(typeof signUpData.companyName !== 'undefined' && signUpData.companyName )  ) {
			errorList.push("Please Enter companyName");
			errorIds.push("companyNameforBuilder")
			status= false;
		}
		
		if( signUpData.branch.length == 0 ) {
			errorList.push("Please Enter branch cities");
			errorIds.push("branchName")
			status= false;
		}
		
		let el = document.getElementById("companyStartDate")
		if(el.value == null || el.value == undefined || el.value == ""){
			errorList.push("Please Enter company's start date");
			errorIds.push("companyStartDate")
			status= false;
		}
		
		if( !(typeof signUpData.foundedBy !== 'undefined' && signUpData.foundedBy )  ) {
			errorList.push("Please Enter foundedBy");
			errorIds.push("foundedBy")
			status= false;
		}
		
		if( !(typeof signUpData.ceoName !== 'undefined' && signUpData.ceoName )  ) {
			errorList.push("Please Enter ceoName");
			errorIds.push("ceoName")
			status= false;
		}
		
		if( !(typeof signUpData.managingDirectorName !== 'undefined' && signUpData.managingDirectorName )  ) {
			errorList.push("Please Enter managingDirectorName");
			errorIds.push("managingDirectorName")
			status= false;
		}
		
		if( !(typeof signUpData.officeContact != 'undefined' && signUpData.officeContact &&  !(signUpData.officeContact.length > 17) && 
		!(signUpData.officeContact.length < 10) )  ) {
			errorList.push("Please Enter officeContact");
			errorIds.push("officeContact")
			status= false;
		}
	}else if (identifier == "b3") {
		if( !(typeof signUpData.vission !== 'undefined' && signUpData.vission )  ) {
			errorList.push("Please Enter vission");
			errorIds.push("vission")
			status= false;
		}
		
		if( !(typeof signUpData.mission !== 'undefined' && signUpData.mission )  ) {
			errorList.push("Please Enter mission");
			errorIds.push("mission")
			status= false;
		}
	}
	
	setErrorIds(errorIds);
	setErrorList(errorList);
	return status;
}


export const signUpValidator = (signUpData,setErrorList,setErrroIDs) => {
	
	let status=true;
	let errorList=[];
	let erroIds=[];
	
	if(!(typeof signUpData !== 'undefined' && signUpData)) {
		errorList.push("Please Register");
		
		status= false;
	}
	
	if( !(typeof signUpData.usertype !== 'undefined' && signUpData.usertype )  ) {
		
		errorList.push("Please Register");
		
		status= false;
	}
	
	if( !(typeof signUpData.userName !== 'undefined' || signUpData.userName)   ) {
		
		errorList.push("Please Enter Name");
		errorList.push("Please Enter Email");
		erroIds.push("userName")
		status= false;
	}
	
	if( !(typeof signUpData.email !== 'undefined' || signUpData.email )  ) {
		
		errorList.push("Please Enter Email");
		erroIds.push("email");
		status= false;
	}
	
	if( !(typeof signUpData.password !== 'undefined' || signUpData.password )  ) {
		errorList.push("Please Enter Password");
		erroIds.push("password");
		status= false;
	}
	
	if( !(typeof signUpData.mobile !== 'undefined' || signUpData.mobile)   ) {
		
		errorList.push("Please Enter Mobile");
		erroIds.push("mobile")
		status= false;
	}
	
	setErrorList(errorList);
	setErrroIDs(erroIds);
	
	return status;
}

export const isValidMailUserName = (username,setErrorIds) => {
	// let errorList=[];
	let status  =  true;
	var errorIds=[];
    	// Regular expression for email validation
        let regex = /* '[a-z0-9]+@[a-z]+\.[a-z]{2,3}' */ /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ /* new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}') *//* /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/i */;
		if(regex.test(username)){
			status = true;
		}
		else{
			status = false;
		//	errorList.push("Fill email in Correct form")
			errorIds.push("Vemail");
		}
	//	setErrorList(errorList);
		setErrorIds(errorIds);
       return status;
    }

export const isValidMobileUserName =  (username,setErrorIds)=>{
		let  status = true;
		var errorIds=[];
		let username2=parseInt(username);
		

	if(!(typeof username2 !== 'undefined' || username2)) {
		status= false;
	}

		if(/^[6-9]\d{9}$/.test(username2)){
			return true
		}
		else{
			status = false;
			errorIds.push("Vmobile")
		}
        setErrorIds(errorIds);
       return status;
    }

	export const loginValidator = (loginDetails,setErrorList, setErroeMessage) => {
		let errorList =[];
		let status  = true;
		
		if(!(typeof loginDetails !== 'undefined' || loginDetails)) {
			errorList.push("Please Register");
			status= false;
		}
		
		if(!(typeof loginDetails.username !== 'undefined' || loginDetails.username)){
						status  = false;
						errorList.push("user name is null")
					}
	
		if(loginDetails.password == null || loginDetails.password  == undefined ||
					loginDetails.password ==""){
						status  = false;
						errorList.push("password is null")
					}
	
		setErrorList(errorList);
		return status;
	}


	export const 	agentAddressValidator = (signUpData ,  setErrorList ,setErrorIds) => {
		
		let errorList =[];
		let status  = true;
			var errorIds=[];
		
		if(!(typeof signUpData != undefined || signUpData)) {
			errorList.push("no data  present");
			status= false;
		}
		
		if( /* !(typeof */ signUpData.address == undefined || signUpData.address == null|| signUpData.address == "") /*  )  */{
			errorList.push("Please Enter address");
			errorIds.push("address");
			status= false;
		}
		
		if( /* !(typeof */ signUpData.companyName == undefined || signUpData.companyName == null  || signUpData.companyName == "")  /* ) */ {
			
			errorList.push("Please Enter company Name");
			errorIds.push("companyName");
			status= false;
		}
		
		
		setErrorIds(errorIds);
		setErrorList(errorList);
		return status;
		
	}
	
	
	export const otpVerifyAtSignInValidator = (signUpData , otp , setErrorList) => {
	
				let errorList =[];
				let status  = true;
	
	if(!(typeof signUpData != undefined || signUpData)) {
			errorList.push("no data  present");
			status= false;
		}
		
		
		if( !(typeof signUpData.mobile != undefined || signUpData.mobile ||signUpData.mobile !="" )  ) {
			
			status= false;
		}
		
		if( !(typeof otp !== 'undefined' || otp )  ) {
			
			errorList.push("Please Enter otp");
			status= false;
		}
		
		setErrorList(errorList);
		return status;	
		
	}
	
	
	
	
	
	
	
	
	
	
	
	