

export const emailIdValidation = (input) => {
	let status  =  false;
	let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(input == null ){
			return false
		}else if(regex.test(input)){
			status = true;
		}
       return status;
}



export const mobileNumberValidation =  (input)=>{
		let  status = false;
		let username2=parseInt(input);
		
		if(input == null){
			return false;
		}else if(/^[6-9]\d{9}$/.test(username2)){
			return true
		}
		
       return status;
}


export const stringInputValidation = (input) => {
	let status  =  false;
        if(input == null ){
			return false
		}else if(/^[A-Za-z ]+$/.test(input)){
			status = true;
		}
       return status;
}

export const distanceRoundOff=(value)=> {
    if (value >= 0 && value <= 0.5) {
        return 0.5;
    } else if (value > 0.5 && value <= 1) {
        return 1;
    } else if (value > 1 && value <= 2) {
        return 2;
    } else if (value > 2 && value <= 3) {
        return 3;
    } else if (value > 3 && value <= 4) {
        return 4;
	// need to check whether to add  && value <= 5 this condtion or not
    } else if (value > 4) {
        return 5;
    } else {
        return value; 
    }
}

export const isInsideDistanceValue=(value,distance)=> {
	if(value != null && distance != null){
		if (distance === 0.5) {
        return (value >= 0 && value <= 0.5);
		}else if (distance === 1) {
			return value > 0.5 && value <= 1;
		} else if (distance === 2) {
			return value > 1 && value <= 2;
		} else if (distance === 3) {
			return value > 2 && value <= 3;
		} else if (distance === 4) {
			return value > 3 && value <= 4;
		} else{
			return value > 4;
		}
	}
    return false;
}

// this is for roudning off any number according to identifier
export const roundOffCustomValue=(value, identifier)=> {
    if (identifier === 'integer') {
        return Math.round(value);
    } else if (identifier === 'tenth') {
        return Math.round(value * 10) / 10;
    } else if (identifier === 'hundredth') {
        return Math.round(value * 100) / 100;
    } else if (identifier === 'thousandth') {
        return Math.round(value * 1000) / 1000;
    } else {
        throw new Error("Invalid identifier. Please choose from 'integer', 'tenth', 'hundredth', or 'thousandth'.");
    }
}

export const convertSolrDate=(inputString)=>{
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Split the input string by space
  const dateParts = inputString.split(' ');

  // Extract day, month, and year from dateParts
  const day = parseInt(dateParts[2], 10);
  const monthIndex = months.indexOf(dateParts[1]); // Get the index of the month
  const year = parseInt(dateParts[5], 10);

  // Format the date string
  return `${day} ${months[monthIndex]} ${year}`;

}


export const capitalizeFirstLetterOfFirstWord=(str)=>{
    if(typeof str === "string"){
        if (!str) return str;
        return (str.charAt(0).toUpperCase() + str.slice(1)).replace(/\s+/g, " ").trim();
    }
    return str
};

export const capitalizeFirstLetterOfFirstWordWithoutTrim=(str)=>{
    if(typeof str === "string"){
        if (!str) return str;
        return (str.charAt(0).toUpperCase() + str.slice(1));
    }
    return str
};


export const capitalizeFirstLetterOfEveryWord=(str)=> {
    if (typeof str === "string") {
        if (!str) return str;
        str = str.replace(/\s+/g, " ").trim();
        return str.split(' ').map(word => {
            if (/^[a-zA-Z]/.test(word.charAt(0))) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
            return word;
        }).join(' ');
    }
    return str;
}



export const formatDateToDateAndTime=(isoDateStr)=> {
    const date = new Date(isoDateStr);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}