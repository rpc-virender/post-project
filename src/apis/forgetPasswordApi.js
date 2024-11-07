const URL = window.location.origin;



export const getOtp = (username, setOtpRes, setCountDown) => {
    const url = `${URL}/user/v1/sendMobileAndEmailOTP`;
    const requestBody = JSON.stringify({username: username });
    fetch(url, {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: requestBody
    })
    .then(response => { return response.json() })
    .then(data => {
        setOtpRes(data);
        setCountDown(30);
       	
       	if(data != undefined && data != null && data.status == true) {
          
			    return true;
        }else {
          
          
          return false;
   
        }

        
      })
    .catch((err) => {
		  console.error(err);
		return false;
	});
};


