import React from "react";
import $ from 'jquery';

import { emailIdValidation } from '../helperComponent/RegexValidation';
import { checkDateFormat } from '../validator/LoginsignUpValidator';
import { chnagingDateForBackend } from './postApi';
import { itemScrollIntoView } from "../images/commonImages";

const ReactDOM = require('react-dom');

const URL = window.location.origin;

export const getUnit = (value, GroupData) =>{
        let res = "";
        if(GroupData !== undefined && GroupData !== null){
            GroupData.map(item => {
                if(value === item.cid) {
                    res = item.constDesc
                }
                else if(value === item.id) {
                    res = item.name
                }
            })
        };
        return res;
    };

export const logoutUser =() => {

	const url = `${URL}/user/v1/logOut`;
    fetch(url, {method: 'get'})
    .then(response => { return response.json() })
    .then(data => { 
        //let baseurl=window.location.origin+"/home";
        let baseurl=window.location.origin;
        window.location.replace(baseurl);
	})
    .catch((err) => {
		console.error(err)
    });
};


export const getShortlistedProject = (setter, setApiCalled, flag) => {
    const url = `${URL}/user/v1/my-shortlisted` + (flag ? "?isProp=P" : "");
    // if(flag != undefined && flag != null && flag == "P" ) {
    //     url=url+"?isProp=Y"
    // }

    fetch(url, {method: 'post'})
    .then(response => { return response.json() })
    .then(data => { 
        if(flag === undefined || flag == null) {
            setter(data.project != null ? data.project : []);
        }else if(flag === "P") {
            setter(data.props != null ? data.props : []);
        }else {
            setter(data.project != null  ? data.project : []);
        }
        
        setApiCalled(prev => ({...prev,"step_E":"Y"}));
	})
    .catch((err) => {
		console.error(err)
    });
}



export const removeFromShortlist = (each, boxId) => {

    //Disebling Buttons and Adding Loader --
    if(boxId != undefined){
    $(`#shortlist_remove_btn_${boxId}`).prop("disabled", true);
    $(`#shortlist_remove_btn_${boxId}`).css("cursor", "wait");
    }

    const url = `${URL}/user-actions/add?type=2`;
    fetch(url, {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(each)
    })
    .then(response => { return response.json() })
    .then(res => { 
        if(boxId != undefined){
        $(`#shortlist_remove_btn_${boxId}`).prop("disabled", false);
        $(`#shortlist_remove_btn_${boxId}`).css("cursor", "pointer");
        }

        // if(res.status == true){
        //     console.error("remove from shortlist");
        // }else{
        //    console.error("error while removing from shortlist");
        // }
    })
    .catch((err) => {
        console.error(err);
    });
}

export const getDashboardUserDetails =(setUserDetails,setApiCalled) => {

	const url = `${URL}/user/v1/my-detail`;
    fetch(url, {method: 'post'})
    .then(response => { return response.json() })
    .then(data => { 
        setUserDetails(data.data);
        setApiCalled(prev => ({...prev,"step_A":"Y"}));
	})
    .catch((err) => {
		console.error(err)
    });
};



export const getUserData =(setter, setApiCalled, endpoint, stepname, status, orderBy, setTotalCount, pageCount, propCategory, setApiRes, setIsDataAvilable) => {
    let page = pageCount === null || pageCount === undefined ? 0 : pageCount;
	let url = `${URL}/user/v1/${endpoint}?orderBy=${orderBy}&page=${page}`;
    if (status !== null) {
        url += `&status=${status}`;
    };

    if (propCategory !== null && (propCategory === "S" || propCategory === "R")) {
        url += `&category=${propCategory}`;
    };

    if(setApiRes) setApiRes(prev=>({...prev, postedProjLoader: true}));
	
    fetch(url, {method: 'post'})
    .then(response => { return response.json()})
    .then(data => {
        if(data.status) {
            if(data.data && data.data.length > 0){
                if(setIsDataAvilable) setIsDataAvilable(true);
            }else{
                if(setIsDataAvilable) setIsDataAvilable(false);
            };
            
            if(page === 0){
                if(stepname === "step_C"){
                    setTotalCount(data.tcp);
                }else if(stepname === "step_D"){
                    setTotalCount(data.tcl)
                }
                setter(data.data);
            }else{
                setter(prev => [...prev, ...data.data]);
            }
            setApiCalled(prev => ({...prev, [stepname]:"Y"}));
            
        }else{
            if(setApiRes) setApiRes(prev=>({...prev, postedProjLoader: false}));
        }
        
	})
    .catch((err) => {
        if(setApiRes) setApiRes(prev=>({...prev, postedProjLoader: false}));
		console.error(err);
    });
};

export const getProjectPricing = (setter, projIdenc, apiRes) => {
	const url = `${URL}/post-project/getProjectPrices?projId=${projIdenc}`;
    apiRes(prev=> ({...prev, priceLoader : true}));
    fetch(url, {method: 'post'})
    .then(response => { return response.json() })
    .then(data => {
        apiRes(prev=> ({...prev, priceLoader : false}));
        if(data.status) {
            setter(prevData => ({...prevData, [projIdenc]: data.priceData}));
        }
	})
    .catch((err) => {
        apiRes(prev=> ({...prev, priceLoader : false}));
		console.error(err)
    });
}

export const getReviewDataList = (projIdenc, pageCount, setReviewOverviewData, setReviewDataList,setAllReviewData,setPageCount) => {
    const url = `${URL}/post-project/get-proj-review-data?projIdEnc=${projIdenc}&identifier=UD&page=${pageCount}`;


    fetch(url)
    .then(response => { return response.json() })
    .then(data => { 

        if(data.status) {
            if(pageCount == 0){
                setReviewOverviewData(data.reviewOverviewData);
                setReviewDataList(data.reviewDataList);
                setAllReviewData(prev => ({...prev,
                    [projIdenc]: {
                        "overView": data.reviewOverviewData,
                        "reviewData": data.reviewDataList
                    }
                }));
            }else{
                setReviewDataList(prev => [...prev, ...data.reviewDataList]);
                setPageCount(pageCount)
            }
            
        }
        
	})
    .catch((err) => {
		console.error(err);
    });
}



export const sendEmailForOtp =(email, isPrimary, identifier, setIsVerifingBoxOpen) => {

    const url = `${URL}/user/v1/send-Email-otp?email=${email}&isprimary=${isPrimary}`;

    fetch(url, {method: 'post'})
    .then(response => { return response.json() })
    .then(res => { 
        if(res.status == true){
            if(isPrimary != null && isPrimary === "Y"){
                $("#bachEndResponsePopupText").text(`OTP has been sent to your Email to get verified`);
            }else if(isPrimary != null && isPrimary === "N"){
                $("#bachEndResponsePopupText").text(`OTP has been send to this email, click on save & verify to save email.`);
            }
            
            $("#bachEndResponsePopup").show();
            setTimeout(()=>{
                $("#bachEndResponsePopup").hide();
            }, 3000);
            
            if( identifier == "ASE"){
                if(setIsVerifingBoxOpen){
                    setIsVerifingBoxOpen({ VPE: false, VSE: true, ASE: false });
                }
            };

        }
	})
    .catch((err) => {
      console.error(err)
    });
};


export const varifyUserEmail = (otp, email, isPrimary, identifier, data, setData, setIsVerifingBoxOpen) => {
	
	if(identifier == "ASE"){
		email = data.secondaryEmail
		identifier == "VSE"
	}

    $(`#btn_${identifier}`).prop('disabled', true);
    $(`#btn_${identifier}`).css('cursor', "wait");

	const url = `${URL}/user/v1/varify-email-otp?otp=${otp}&email=${email}&isprimary=${isPrimary}`;

    fetch(url, {method: 'post'})
    .then(response => { return response.json() })
    .then(res => { 
        if(res.status == true){

            // Clearing Container
            if( identifier == "VPE"){
				setData((prev) => ({...prev, isEmailVarified: "Y" }));
                // $("#emailVerifyingFieldCon").hide();
            };

            if( identifier == "VSE"){
				setData((prev) => ({...prev, isSecondaryEmailVerified: "Y" }));
				// $("#secondaryEmailVerifyingFieldCon").hide();
                // $("#secondaryEmailOtpVerifyingCon").hide();
            };

            $("#bachEndResponsePopupText").text(`Email is Verified successfully`);
            
            $("#bachEndResponsePopup").show();
            setTimeout(()=>{
                $("#bachEndResponsePopup").hide();
            }, 3000);

            if(setIsVerifingBoxOpen){
                setIsVerifingBoxOpen({ VPE: false, VSE: false, ASE: false });
            }

        }else{
            $(`#input_${identifier}`).css("border-color", "#F00"); 
            $(`#${identifier}_EmailErrorMsg`).text("Wrong OTP. Enter Correct OTP");

            setTimeout(()=>{
                $(`#input_${identifier}`).css("border-color", "#98A5B8");
                $(`#${identifier}_EmailErrorMsg`).text("");
            }, 3000);
        }

        $(`#btn_${identifier}`).prop("disabled", false);
        $(`#btn_${identifier}`).css('cursor', "pointer");
	})
    .catch((err) => {
		console.error(err)
    });
};

//localhost:8081/user/v1/change-password


export const changePassword =(password, setIsChangePassword) => {
	
    const url = `${URL}/user/v1/change-password`;
    fetch(url, {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          "password": password
        })
    })
    .then(response => { return response.json() })
    .then(res => { 
        if(res.status == true){
            setIsChangePassword(false);
            $("#changePasswordErrorMsg").text("");
            $("#userDetailsUserPassword").css("border-color", "var(--Brand-green-primary, #148B16)");
            $("#userDetailsUserComfirmPassword").css("border-color", "var(--Brand-green-primary, #148B16)");
            $("#newPasswordSubmitBtn").prop('disabled', false);
            $("#newPasswordSubmitBtn").css('cursor', "pointer");
        }else{
            $("#changePasswordErrorMsg").text(res.Message);
        }
    })
    .catch((err) => {
        console.error(err);
    });
};

// /update-userDetails

export const updateUserDashboardDetails =(userDetails, setUserActualDetails, userNewDetails) => {
	
    const url = `${URL}/user/v1/update-userDetails`;
    fetch(url, {
        method: 'post',
        body: userDetails
    })
    .then(response => { return response.json() })
    .then(res => { 
        if(res.status == true){
            setUserActualDetails(userNewDetails);
            $("#editprofileBtn").prop('disabled', false);
            $("#editprofileBtn").css('cursor', "pointer");
            $("#editprofileBtn").css('background-color', "#148B16");
        }else{
            $("#editprofileBtn").prop('disabled', false);
            $("#editprofileBtn").css('cursor', "pointer");
            $("#editprofileBtn").css('background-color', "red");
        }
    })
    .catch((err) => {
        console.error(err);
    });
};



const findChangedValues=(data, editedData)=> {
    const changedValues = {};
    
    for (const key in data) {
        if (data[key] !== editedData[key]) {
            changedValues[key] = editedData[key];
        }
    }
    
    if(editedData.isLogoChange == "Y"){
		changedValues.isLogoChange = "Y"
	}
	
    return changedValues;
}


const convertObjectToParticularId =(obj)=> {
	  if (typeof obj === 'object' && obj !== null) {
	    return Object.keys(obj).map(key => {
	      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
	        return null;
	      } else {
	        return 'dashboard_' + key;
	      }
	    }).filter(Boolean); 
	  } else {
	    console.error('Invalid input type. Please provide an object.');
	    return null;
	  }
}

export const updateBasicUserDetailsFromDashboard = (data, setData, particularUserDetails) => {
	const url = `${URL}/user/v1/update-basic-details`;
	const result = findChangedValues(data, particularUserDetails);
	let entries = Object.entries(result);
	let isValid = true;
	entries.map(([key, val] = entry) => {
		if(key == "email"){
			if(emailIdValidation(val) == false){
				let con = document.getElementById(`dashboardPrimaryEmailFeild`);
                let err = document.getElementById(`errmsgdashboardPrimaryEmailFeild`);

                con.style.borderColor = "#F00";
                if(val === ""){
                    err.textContent = `Primary Email is Required`;
                }else{
				    err.textContent = `email is not in correct format`;
                }

				isValid = false;
				return;
			}
		};

		if(key == "secondaryEmail" && !(val === null || val === undefined || val === "")){
            let pEmail = result.email !== undefined && result.email !== "" ? result.email : data.email !== undefined && data.email !== "" ? data.email : ""
            let isEmailSame = val == pEmail;
            
			if(emailIdValidation(val) == false || isEmailSame){
                let con = document.getElementById(`dashboardSecondaryEmailFeild`);
                let err = document.getElementById(`errmsgdashboardSecondaryEmailFeild`);

                con.style.borderColor = "#F00";
                if(val === ""){
                    err.textContent = `Secondary Email is Required`;
                }else if(isEmailSame){
				    err.textContent = `Secondary Email should not same as Primary Email`;
                }else{
                    err.textContent = `Secondary Email is not in correct format`;
                }

                isValid = false;
                return
			}
		}
		if(key == "name"){
			// if(stringInputValidation(val) == false){
            if(val === ""){
				let con = document.getElementById(`dashboardUserNameFeild`);
				let err = document.getElementById(`errmsgdashboardUserNameFeild`);

                con.style.borderColor = "#F00";
                err.textContent = `${data.usertype == "A" ? "Agent" : data.usertype == "B" ? "Builder" : "Individual"} Name is Required`;
                
				isValid = false
				return
            }
		}
	})
	
	if(isValid == true){
		fetch(url,{
		    method:'post',
		    headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(particularUserDetails),
		})
		.then(response => { return response.json() })
		.then(res => { 
		    if(res.status == true){
				setData((prev) => ({
				  ...prev,
				  ...res.updatedData,
				  isEmailVarified: res.updatedData.isEmailVerified,
				}));
				$("#PDdetailsDisplayCon").show();
		        $("#PDdataCollectingCon").hide();
	
		        $("#PDEditButton").show();
		        $("#PDsaveAndCancelBtn").hide();
		        
                $("#emailVerifyingFieldCon").hide();	
		    };
		})
		.catch((err) => {
		    console.error(err);
		});
	}
};

export const updateUserDetails =(data,setData , particularUserDetails,logoFile	,identifier) => {
	
	const result = findChangedValues(data, particularUserDetails);
	let dashboardStateList = convertObjectToParticularId(result);
	
	if (dashboardStateList.length == 0) {
	    const url = `${URL}/user/v1/my-detail/Detail-edit`;
	    $(`#${identifier}detailsLoader`).show();
	    const formData = new FormData();
	    if(logoFile != null ){
			formData.append("logo",logoFile[0]);
		}
	    formData.append("dto", JSON.stringify(result));
	
	    fetch(url, {
		    method: 'POST',
		    body: formData,
		})
		
	    .then(response => { return response.json() })
	    .then(res => { 
	        if(res.status == true){
				$(`#${identifier}detailsLoader`).hide();
				setData(res.updatedData)
				
				$(`#${identifier}detailsDisplayCon`).show();
	            $(`#${identifier}dataCollectingCon`).hide();
	            $(`#${identifier}EditButton`).show();
	            $(`#${identifier}saveAndCancelBtn`).hide();
			}
	    })
	    .catch((err) => {
	        console.error(err);
	    });
	} else {
		
		dashboardStateList.map(each=>{
            $(`#${each}`).css("border-color", "#F00");
            
			let err = document.getElementById(`errmsg${each}`);
            itemScrollIntoView(each);
            // if(err != undefined && err != null){
            //     err.textContent = `input field cannot be empty`;
            // }
            
		})
		
    }
};

export const updatingProjectPriceData =(data, projIdEnc, boxId, setPopupType, setPropSection) => {
	const url = `${URL}/user/v1/edit-price-dashboard?projIdEnc=${(projIdEnc)}`;

    fetch(url,{
        method:'post',
        headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
    })
    .then(response => { return response.json() })
    .then(res => { 
        if(res.status == true){
            $(`#postedProjbachEndResponsePopup`).show();
            
            $("#SavePricingBtn").css('background-color', 'green');

            setTimeout(()=>{
                $("#SavePricingBtn").css('background-color', '#0073C6');
                $(`#projCardExtraDetailsCon_${boxId}`).hide();
                setPopupType("");

                if(setPropSection){
                    setPropSection("");
                }

                $(`#postedProjbachEndResponsePopup`).hide();
            },3000);
        }
    })
    .catch((err) => {
        console.error(err);
    });
};



export const updatingProjectInfoData =(project, projIdEnc, projlist, identifier, boxId, setPopupType) => {
	const url = `${URL}/user/v1/edit-project-info?projIdEnc=${projIdEnc}&identifier=${identifier}`;
	
	const backData = project.phaseArray.map(each => {
						  return {
						    ...each,
						    launchDate: checkDateFormat(each.launchDate) == false ? chnagingDateForBackend(each.launchDate) : each.launchDate,
						    possassionDate: checkDateFormat(each.possassionDate) == false ? chnagingDateForBackend(each.possassionDate) : each.possassionDate
						  };
					});
					
	const dummyProject = { ...project, phaseArray: backData };
	
    fetch(url,{
        method:'post',
        headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(dummyProject),
    })
    .then(response => { return response.json() })
    .then(res => { 
        if(res.status == true){
            $(`#postedProjbachEndResponsePopup`).show();
			$("#SavePricingBtn").css('background-color', 'green');

            setTimeout(()=>{
                $("#SavePricingBtn").css('background-color', '#0073C6');
                $(`#projCardExtraDetailsCon_${boxId}`).hide();
                setPopupType("");

                $(`#postedProjbachEndResponsePopup`).hide();
            },3000);

			projlist.forEach(each => {
				  if (each.projectId === project.projectId) {
				    Object.assign(each, project);
				  }
			});
        }
    })
    .catch((err) => {
        console.error(err);
    });
};

	export  const rentOutmark = (identifier,id,popupType,boxId,setProperties) => {
		
        const URL = window.location.origin;
        const url = `${URL}/user/v1/updatePropertyout?id=${id}&identifier=${identifier}`;
        fetch(url, { method: 'post' })
            .then(response => { return response.json() })
            .then(data => {
                if (data.status) {
                    let el = document.getElementById("rentedOutPopUp");
                    if(el){
                        ReactDOM.render( <div></div> , el );
                    }

                    const buttonClick = data.update;
                    setProperties((prev) => 
                        prev.map(property => 
                            property.propIdEnc === id 
                                ? { ...property, propertyStatus: buttonClick != null ? buttonClick : null } 
                                : property
                        )
                    );
                
                    if(buttonClick == "S"){
						let el = document.getElementById(`propCradSoldBtn_${boxId}`);
                        el.textContent = "Remove From Sold Out"
						let el1 = document.getElementById(`propCradRatingBtn_${boxId}`);
                    	el1.style.display = "none"
                    	
					}else if(buttonClick == "R"){
						let el = document.getElementById(`propCradSoldBtn_${boxId}`);
                    	el.textContent = "Remove From Rented Out";
                    	let el1 = document.getElementById(`propCradRatingBtn_${boxId}`);
                    	el1.style.display = "none"
					}else if(buttonClick == "P"){
						let el = document.getElementById(`propCradRatingBtn_${boxId}`);
                    		el.textContent = "Resume Listing"
					}else{
						if(popupType == "soldOut" ){
							let el = document.getElementById(`propCradSoldBtn_${boxId}`);
                    		el.textContent = "Mark as Sold Out"
                    		let el1 = document.getElementById(`propCradRatingBtn_${boxId}`);
                    		el1.style.display = "flex"
						}else if(popupType == "rentOut" ){
							let el = document.getElementById(`propCradSoldBtn_${boxId}`);
                    		el.textContent = "Mark As Rented Out"
                    		let el1 = document.getElementById(`propCradRatingBtn_${boxId}`);
                    		el1.style.display = "flex"
						}else if(popupType == "pause"){
							let el = document.getElementById(`propCradRatingBtn_${boxId}`);
                    		el.textContent = "Pause Listing"
						}
					}
                }
            })
            .catch((err) => {
                console.error(err)
            });
    }
    
    
    export const addToCompareAndFetchProperty = (propId, addToCompare, comparePropMap, setComparePropMap, dataNeed, propList, setPropList,propIds,setPropIds,identifier,setShortListedProp, boxId, setLoaderStatus,setIsWraningPopup)=>{
        if(setLoaderStatus){
            setLoaderStatus(true);
        };

        if(boxId != undefined){ 
            $(`#shortlist_addToCompare_btn_${boxId}`).prop("disabled", true);
            $(`#shortlist_addToCompare_btn_${boxId}`).css("cursor", "wait");
        };

		const baseURL = `${URL}/post-listing/compare`;

        const queryParams = [];

        if (identifier !== null) {
            queryParams.push(`identifier=${identifier}`);
        }

        if (propId !== null) {
            queryParams.push(`propId=${propId}`);
        }

        if (addToCompare !== null) {
            queryParams.push(`addToCompare=${addToCompare}`);
        }

        if (dataNeed !== null) {
            queryParams.push(`dataNeed=${dataNeed}`);
        }

        const fullURL = queryParams.length > 0 ? `${baseURL}?${queryParams.join('&')}` : baseURL;


	    fetch(fullURL, {
	        method: 'post',
	    })
	    .then(response => { return response.json() })
	    .then(res => { 
            if(setLoaderStatus){
                setLoaderStatus(false);
            }

            if(boxId != undefined){
                $(`#shortlist_addToCompare_btn_${boxId}`).prop("disabled", false);
                $(`#shortlist_addToCompare_btn_${boxId}`).css("cursor", "pointer");
            };

	        if(res.status == true){
                if(res.flag === "limit"){
                    if(setIsWraningPopup != null){
                        setIsWraningPopup(true);
                        setTimeout(()=>{
                            setIsWraningPopup(false);
                        },5000);
                    }
                }else{
                    if(setShortListedProp != null && addToCompare != null){
                     setShortListedProp(prev => prev.map((each) => {
                            if (each.propIdEnc === propId) {
                                return { ...each, isAddedInCompare: addToCompare };
                            } else {
                                return each;
                            }
                        }));
                    }
                    let compProp=res.properties;
                    if (compProp.length > 1) {
                        const newObject = {};
                        
                        compProp.forEach(each => {
                            newObject[each.propertyId] = each;
                            propIds.push(each.propertyId)
                        });
                        setComparePropMap(newObject);
                    } else if (compProp.length === 1) {
                        const singleProperty = compProp[0];
                        const updatedMap = { ...comparePropMap, [singleProperty.propertyId]: singleProperty };
                        propIds.push(singleProperty.propertyId)
                        setComparePropMap(updatedMap);
                    } else {
                        if (addToCompare === "N") {
                            const filteredPropList = propList.filter(each => each.propertyId != propId);
                            setPropList(filteredPropList);
                            const filtertedPropId = propIds.filter(each=> each != propId);
                            setPropIds(filtertedPropId);
                        }
                    }
                }
	        }

            
	    })
	    .catch((err) => {
	        console.error(err);
	    });
		
	};

    const addLoaderForBtn = (id, identifier) => {
        let btnEl = document.getElementById(id);
        if(btnEl){
            if(identifier === "A"){
                btnEl.disabled = true;
                btnEl.style.cursor = "wait";
            }else{
                btnEl.disabled = false;
                btnEl.style.cursor = "pointer";
            }
        }
    };

    export const addToCompareAndFetchProject = (projId,addToCompare,compareProjMap,setCompareProjMap,dataNeed,projList,setProjList,projIds,setProjIds,identifier,setShortListedProj, boxId, setLoaderStatus,setCompareProjectCount) => {
        if(boxId != undefined && boxId != null){
            $(`#shortlist_addToCompare_btn_${boxId}`).prop("disabled", true);
            $(`#shortlist_addToCompare_btn_${boxId}`).css("cursor", "wait");
            addLoaderForBtn(`shortlist_addToCompare_btn_${boxId}`, "A");
        };

        if(setLoaderStatus){
            setLoaderStatus(true);
        };

        const baseURL = `${URL}/post-project/addToCompare`;

        const queryParams = [];

        if (identifier !== null) {
            queryParams.push(`identifier=${identifier}`);
        }
        if (projId !== null) {
            queryParams.push(`projId=${projId}`);
        }
        if (addToCompare !== null) {
            queryParams.push(`addToCompare=${addToCompare}`);
        }
        if (dataNeed !== null) {
            queryParams.push(`dataNeed=${dataNeed}`);
        }

        const fullURL = queryParams.length > 0 ? `${baseURL}?${queryParams.join('&')}` : baseURL;

        fetch(fullURL, {
            method : 'post'
        })
        .then(response => { return response.json() })
        .then(res => { 
            if(boxId != undefined && boxId != null){
                $(`#shortlist_addToCompare_btn_${boxId}`).prop("disabled", false);
                $(`#shortlist_addToCompare_btn_${boxId}`).css("cursor", "pointer");
                addLoaderForBtn(`shortlist_addToCompare_btn_${boxId}`, "R");
            };

            if(setLoaderStatus){
                setLoaderStatus(false);
            };
            if(res.status == true){
                if(setShortListedProj != null && addToCompare != null){
                    setShortListedProj(prev => prev.map((each) => {
                        if (each.projIdEnc === projId) {
                            return { ...each, isAddedInCompare: addToCompare };
                        } else {
                            return each;
                        }
                    }));
                }
                if(setCompareProjectCount != null){
                    if (addToCompare === "N") {
                        setCompareProjectCount((prev) => prev - 1);
                    }else{
                        setCompareProjectCount((prev) => prev + 1);
                    }
                }
                
               
                 let compProj=res.project;
                    if (compProj.length > 1) {
                        const newObject = {};
                        compProj.forEach(each => {
                            newObject[each.projIdEnc] = each;
                            projIds.push(each.projIdEnc)
                        });
                        setCompareProjMap(newObject);
                    } else if (compProj.length === 1) {
                        const singleProperty = compProj[0];
                        const updatedMap = { ...compareProjMap, [singleProperty.projIdEnc]: singleProperty };
                        projIds.push(singleProperty.projIdEnc)
                        setCompareProjMap(updatedMap);
                    } else {
                        if (addToCompare === "N") {
                            const filteredPropList = projList.filter(each => each.projIdEnc != projId);
                            setProjList(filteredPropList);
                            const filtertedPropId = projIds.filter(each=> each != projId);
                            setProjIds(filtertedPropId)
                        }
                    }
            }else{
            }
        })
        .catch((err) => {
            if(boxId != undefined && boxId != null){
                $(`#shortlist_addToCompare_btn_${boxId}`).prop("disabled", false);
                $(`#shortlist_addToCompare_btn_${boxId}`).css("cursor", "pointer");
            };
            console.error(err);
        });

    }


export const sendRequestCallback =(data,setListdata,setterIfNeeded,setIsSuccessReq, setIsPopup) => {
        const url = `${URL}/contact/v1/user/request-callback`;
    fetch(url,{
        method:'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => { return response.json() })
    .then(res => { 
        if(res.status == true){
            setIsSuccessReq(true);

            setTimeout(()=>{
                setIsSuccessReq(false);
                setIsPopup(false);
            },5000);
            
            if(data.src === "projShortList"){
                setListdata(prev => prev.map((each) => {
                    if (each.projIdEnc === data.projIdEnc) {
                        return { ...each,  isContacted: "Y"  };
                    } else {
                        return each;
                    }
                }));
            }else if(data.src === "propShortList"){
                setListdata(prev => prev.map((each) => {
                    if (each.propIdEnc === data.propIdEnc) {
                        return { ...each, isContacted: "Y" };
                    } else {
                        return each;
                    }
                }));
            }else if(data.src === "projCompare"){
                setListdata(prev => prev.map((each) => {
                    if (each.projIdEnc === data.projIdEnc) {
                        return { ...each, isContacted: "Y" };
                    } else {
                        return each;
                    }
                }));
                setterIfNeeded(prev => prev.map((each) => {
                    if (each.projIdEnc === data.projIdEnc) {
                        return { ...each, isContacted: "Y" };
                    } else {
                        return each;
                    }
                }));
            }else if(data.src === "propCompare"){
                setListdata(prev => prev.map((each) => {
                    if (each.propertyId === data.propIdEnc) {
                        return { ...each, isContacted: "Y" };
                    } else {
                        return each;
                    }
                }));s
                setterIfNeeded(prev => prev.map((each) => {
                    if (each.propIdEnc === data.propIdEnc) {
                        return { ...each, isContacted: "Y" };
                    } else {
                        return each;
                    }
                }));
            };

            
        }
        
    })
    .catch((err) => {
        console.error(err);
    });
};

export const getResposeDetails = (type, projIdEnc, setResponseData,projectResponseFinalData) => {

	const url = `${URL}/contact/v1/user/get-posted-enq?iden=${type}&id=${projIdEnc}`;
    fetch(url, {method: 'get'})
    .then(response => { return response.json() })
    .then(data => { 
        if(data && data.result && data.result.length > 0){
            setResponseData(data.result);
            //storing data globally
            projectResponseFinalData.set(projIdEnc, [...data.result]);
        }

	})
    .catch((err) => {
		console.error(err)
    });

};

export const csvExportApi =(type, projIdEnc, projectName, nonDeletedData) => {

	const url = `${URL}/contact/v1/user/generate-csv-contact?iden=${type}&id=${projIdEnc}&name=${projectName}`;

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nonDeletedData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'contact_data.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};


export const saveProjectResponseDetails = (responseDetails) => {
    const url = `${URL}/contact/v1/user/save-updated-enq`;
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(responseDetails)
    })
    .then(response => response.json())
    .then(res => {
        return res;
    })
    .catch(err => {
        throw err; 
    });
};

export const deleteProject = (projId, onDeleteProject) => {
    $(`#deletePopupEditBtn`).prop("disabled", true);
    $(`#deletePopupEditBtn`).css("cursor", "wait");
    const url = `${URL}/user/v1/update-project-delete?projIdEnc=${projId}`;
    fetch(url, {method: 'POST'})
    .then(response => response.json())
    .then(res => {
        $(`#deletePopupEditBtn`).prop("disabled", false);
        $(`#deletePopupEditBtn`).css("cursor", "pointer");
        if(res && res.status){
            onDeleteProject("ok");
        }
    })
    .catch(err => {
        $(`#deletePopupEditBtn`).prop("disabled", false);
        $(`#deletePopupEditBtn`).css("cursor", "pointer");
        throw err; 
    });
};