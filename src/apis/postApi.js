import { itemScrollIntoView, propertyDetailsTypes } from "../images/commonImages";
import { pageCount, previousPages, projectEncId } from "../images/constant";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';

export const onSavingProjectPage = (page, encId, setStep) =>{
	var URL2 = window.location.origin;
    const url = `${URL2}/post-project/user-project-step?page=${page}${encId && encId !== "" ? `&projIdEnc=${encId}` : ""}`;

	let prevPagesNums = previousPages.get("prevPages");
	let lastPage = pageCount && pageCount.get("page") ? pageCount.get("page") : 0;

	if(prevPagesNums && !prevPagesNums.includes(page)  && page > lastPage){
		fetch(url,{
			method:'post'
		})
		.then(response => { 
			return response.json()
		})
		.then(res=>{
			if(res){
				prevPagesNums.push(page);
				previousPages.set("prevPages", prevPagesNums);
				setStep(page);
			}
		})
		.catch((err=>{
			console.error(err);
		}));
	}else{
		if(prevPagesNums && !prevPagesNums.includes(page)){
			prevPagesNums.push(page);
			previousPages.set("prevPages", prevPagesNums);
		};
		setStep(page);
	}
};


export const saveProjectImages = (projectMedia,setStatusList,setStep,setGetMediaResponse,step,setOtherImagesFiles) =>{
	const URL2 = window.location.origin;
	const url = `${URL2}/post-project/saveMedia`;
	
	const collectedData = {};

	Object.keys(projectMedia).forEach(key => {
	  const value = projectMedia[key];
	  
	  let newKey = key; // By default, keep the same key
	  if (key === 'cover') newKey = 'coverUrl';
	  if (key === 'masterplan') newKey = 'projMasterPlanUrl';
	  if (key === 'video') newKey = 'projVideo';
	  if (key ==='other') newKey  =  'projOtherImagesUrl'
	  
	  if (Array.isArray(value)) {
	    collectedData[newKey] = value.map(item => item);
	  } else {
	    collectedData[newKey] = value;
	  }
	});
	
	setGetMediaResponse(collectedData);
	const formData = new FormData();
	const testArray = [];
	if(projectMedia.cover && projectMedia.cover[0]) {
		formData.append('cover', projectMedia.cover[0]);
	}
	if(projectMedia.masterplan && projectMedia.masterplan[0]){
		formData.append('masterplan', projectMedia.masterplan[0]);
	}
	if(projectMedia.video && projectMedia.video[0]){ 
		formData.append('video', projectMedia.video[0]);
	}
	if(projectMedia.walkThroughVideo && projectMedia.walkThroughVideo[0]) {
		formData.append('walkThroughVideo',projectMedia.walkThroughVideo[0]);
	}
	projectMedia.other.map(images => {
		testArray.push(images);
        formData.append("otherImagesFile", images);
    })
    
	formData.append('status', projectMedia.statusList)
	fetch(url,{
		method:'post',
		body:formData
	})
	.then(response => { 
	    return response.json()
	})
	.then(res=>{
			if(step === 2){	
				if(res.status) {
					setStatusList(res.statusList)
					setTimeout(() => {
						onSavingProjectPage(3, projectEncId.get("projId"), setStep);
						$('#loaderForProjectimages').hide();
					}, 1000);
				}
			}
			
			setTimeout(() => {
				$('#loaderForProjectimages').hide();
			}, 1000);
			
	})
	.catch((err=>{
		setTimeout(() => {
			$('#loaderForProjectimages').hide();
		}, 1000);
	    console.error(err);
	}));
		    
}
		
export const getProjectMedia = (setGetMediaResponse,setStep,setStatusList,setBankDetailsResponse) =>{
	var URL2 = window.location.origin
    const url = `${URL2}/post-project/projectMedia`;
    
    fetch(url,{
		method:'post'
	})
	
	.then(response => { 
		return response.json()
	})
	.then(res=>{
		setGetMediaResponse(res.projectMedia);
		setStatusList(res.statusList);
			if(res != null && res.projectMedia != null && res.projectMedia.projBroucherUrl != null && setBankDetailsResponse != null){
				setBankDetailsResponse((prev) => ({ ...prev, projBroucherUrl: res.projectMedia.projBroucherUrl }))
			}else{
				setBankDetailsResponse((prev) => ({ ...prev, projBroucherUrl: null }))
			}
	})
	.catch((err=>{
		console.error(err);
	}));
};

export const addspecification = (specificationData,setStep) =>{
	var URL2 = window.location.origin
    const url = `${URL2}/post-project/addspecification`;
    const myObject = Object.fromEntries(specificationData);
    const requestBody = { specifications: myObject };
	$('#loaderForProjectspecification').show();
	fetch(url, {
	    method: 'post',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify(requestBody)
	})
    .then(response => { 
        return response.json()
         })
    .then(res=>{
		setTimeout(() => {
			if(res.status) {
				// setStep(4);
				onSavingProjectPage(4, projectEncId.get("projId"), setStep);
			}
			$('#loaderForProjectspecification').hide();
		})
    })
    .catch((err=>{
		setTimeout(() => {
			$('#loaderForProjectspecification').hide();
		})
        console.error(err);
    }));
	
    
}

export const getSpecificationData = (setSpecificationOrHighlightData,setStep,step) =>{
	var URL2 = window.location.origin
    const url = `${URL2}/post-project/posted-specification`;
    
    fetch(url,{
		method:'post'
	})
	.then(response => { 
		return response.json()
		})
	.then(res=>{
	if(step === 2){
		if(res.status){
			if(res.specifications !== undefined && res.specifications!= null){
				setSpecificationOrHighlightData(res.specifications);
				return;
			}
		}
	}
	if(step === 4){
		if(res.status){
			if(res.highlights  !== undefined && res.highlights != null){
				setSpecificationOrHighlightData(res.highlights);
				return;
			}
		}
	 }
	
	})
	.catch((err=>{
		console.error(err);
	}));
}

export const chnagingDateForBackend = (inputDate) =>{

	var parts = inputDate.split('/');
	var day = parts[0];
	var month = parts[1];
	var year = parts[2];
	
	var dateObject = new Date(year, month - 1, day);
	var newYear = dateObject.getFullYear();
	var newMonth = ("0" + (dateObject.getMonth() + 1)).slice(-2); 
	var newDay = ("0" + dateObject.getDate()).slice(-2);
	
	var newDateFormat = newYear + '-' + newMonth + '-' + newDay;
	
	return newDateFormat 
};

export const saveProjBasicDetails=(setPreviousPhase, setProjIdEnc, basicDetails, setStep, step, identifier, phasearray, setPhaseArray) => {
	var URL2 = window.location.origin
    const url = `${URL2}/post-project`;
	
	if(basicDetails.possessionDate != null){
		basicDetails.possessionDate = chnagingDateForBackend(basicDetails.possessionDate)
	}
	
	if(basicDetails.launchDate != null){
		basicDetails.launchDate = chnagingDateForBackend(basicDetails.launchDate)
	}

	let finalBodyObj = {}

	if(phasearray){
		let newPhasearray = [...phasearray];
		newPhasearray.filter(eachPhase => 
			(eachPhase.expectedCompletion === undefined || eachPhase.expectedCompletion === null || eachPhase.expectedCompletion === "") ? 
			eachPhase.expectedCompletion = eachPhase.possassionDate : eachPhase
		);

		finalBodyObj = {...basicDetails, "phaseList": newPhasearray}
	}else{
		finalBodyObj = basicDetails;
	};
	
    
	$('#loaderForProject').show();
    fetch(url,{
        method:'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(finalBodyObj)
    })
    .then(response => { 
        return response.json();
    })
    .then(res=>{
		if(step === 0){
			if(res.status === true) {
				let sortedPhaseArray = res.phase.sort((a, b) => a.sequence - b.sequence);
				setPhaseArray((prev)=>(sortedPhaseArray));
				if(setPreviousPhase !== null && setPreviousPhase !== undefined){
					// setPreviousPhase((prev)=>(res.phase));
					setPreviousPhase(prev => ({ ...prev, phaseArray: sortedPhaseArray }));
				}
				setProjIdEnc(res.encId);				
	
				$('#loaderForProject').hide();
				// var queryParams = new URLSearchParams(window.location.search);
				// queryParams.set("projid", res.encId);
				// history.replaceState(null, null, "?"+queryParams.toString());
				// history.pushState(null, null, "?"+queryParams.toString());

				const navigate = useNavigate();
    			const queryParams = new URLSearchParams();

				const newUrl = `?${queryParams.toString()}`;
        		navigate(newUrl, { replace: true }); // Replaces current entry in the history stack


				projectEncId.set("projId", res.encId);

				onSavingProjectPage(step + 1, projectEncId.get("projId"), setStep);
				
			}else {
				$('#loaderForProject').hide();

				if(res.flag && res.flag === "duplicate"){
					$("#dupilcateProjectNameErrMsg").show();
					// itemScrollIntoView("projName");
					$("#projName").css("border-color", "#F00");

					setTimeout(()=>{
						$("#dupilcateProjectNameErrMsg").hide();
						$("#projName").css("border-color", "");
					},3000);
				}
			}
		}
   })
    .catch((err=>{
		$('#loaderForProject').hide();
        console.error(err);
    }));
}

export const postProjectAmenities = (setAmenitiesFromDB) => {
	var URL = window.location.origin
	const url = `${URL}/common/projAmenities`;
	fetch(url,{
		method:'post'
	})
	.then(response => { 
		return response.json()
	})
	.then(res=>{
		setAmenitiesFromDB(res);
	})
	.catch((err=>{
		console.error(err);
	}));
};

export const newpostProjectAmenities = (setAmenitiesFromDB) => {
	var URL = window.location.origin
	const url = `${URL}/common/all-proj-Amenities`;
	fetch(url,{
		method:'post'
	})
	.then(response => { 
		return response.json()
	})
	.then(res=>{
		setAmenitiesFromDB(res);
	})
	.catch((err=>{
		console.error(err);
	}));
};


export const addProjectAmenities = (amenitiesData, customAmenities, setStep) => {
	var URL = window.location.origin
	const url = `${URL}/post-project/addAmenities`;
	
	const requestBody = JSON.stringify({ amenities: amenitiesData, customAmenities: customAmenities });
	$('#loaderForProjectamenities').show();
	fetch(url, {
		method: 'post',
		headers: { 'Content-Type': 'application/json' },
		body: requestBody
	})
		.then(response => {
			return response.json()
		})
		.then(res => {
			setTimeout(() => {
				$('#loaderForProjectamenities').hide();
				if (res.status) {
					// setStep(5);
					onSavingProjectPage(5, projectEncId.get("projId"), setStep);
				}
			}, 500);
		})
		.catch((err => {
			setTimeout(() => {
				$('#loaderForProjectamenities').hide();
			}, 500);
			console.error(err);
		}));

}

export const addProjectHighlight = (basicDetails, setStep) => {

	var URL = window.location.origin
	const url = `${URL}/post-project/saveHighlights`;

	const requestBody = JSON.stringify({ whyBuyThisProject: basicDetails.whyBuyThisProject, highlights: basicDetails.highlights });
	$('#loaderForProjectreason').show();

	fetch(url, {
		method: 'post',
		headers: { 'Content-Type': 'application/json' },
		body: requestBody
	})
		.then(response => {
			return response.json()
		})

		.then(res => {
			if (res.status) {
				$('#loaderForProjectreason').hide();
				// setStep(6);
				onSavingProjectPage(6, projectEncId.get("projId"), setStep);
			}
		})

		.catch((err => {
			console.error(err);
		}));
}


export const getAmenitiesData = (setAmenitiesData, setCustomAmenities) =>{
	var URL2 = window.location.origin
    const url = `${URL2}/post-project/posted-Amenities`;
    
    fetch(url,{ method:'post'})
	.then(response => { 
		return response.json()
	})
	.then(res=>{
		setAmenitiesData(res.amenities);
		const  data  = res.customAmenities;
		setCustomAmenities([...data]);
	})
	.catch((err=>{
		console.error(err);
	}));
};

const hideErrorMsgs = (id) => {
	$("#rowLoaderAndStatusCon").hide();
	$(`#tableImageLable0_${id}`).show();
	$(`#tableImageLoader0_${id}`).hide();
	$(`#tableImageLable_${id}`).show();
	$(`#tableImageLoader_${id}`).hide();
	$("#delete_"+id).hide();
	$("#rowDeleteStatus").hide();
	$("#rowEditStatus").hide();
	$("#imagesRenderingLoader").hide();
	$("#postPropertySubmitButton").prop("disabled", false);
    $("#postPropertySubmitButton").css("cursor", "pointer");
};

//property details apis
export const savePropType=(singleRow, setUpdateResponse, onImagePopup) => {
	if(singleRow.isDeleted === "Y"){
		$("#delete_"+singleRow.id).show();
		$("#rowDeleteStatus").show();
	}else if(singleRow.isEdit === "Y"){
		$("#delete_"+singleRow.id).show();
		$("#rowEditStatus").show();
	}else{
		$("#rowLoaderAndStatusCon").show();
	}

	// For Image Loader
	$(`#tableImageLable0_${singleRow.id}`).hide();
	$(`#tableImageLoader0_${singleRow.id}`).show();
	$(`#tableImageLable_${singleRow.id}`).hide();
	$(`#tableImageLoader_${singleRow.id}`).show();

	$("#postPropertySubmitButton").prop("disabled", true);
    $("#postPropertySubmitButton").css("cursor", "wait");
	
	if(singleRow.isEdit === "Y"){
		singleRow.floorPlan != null ? singleRow.editFloorPlan = "Y" : singleRow.editFloorPlan = "N"
	}

	if(singleRow.bhk === "custom") delete singleRow.bhk;
	if(singleRow.facing === "custom") delete singleRow.facing;
	
	var URL2 = window.location.origin
    const url = `${URL2}/post-project/save-prop-type`;

	if(singleRow.aptType === 900) singleRow.aptType = null;
	
    const formData = new FormData();
    formData.append("floorPlan",singleRow.floorPlan);
    formData.append("prop", JSON.stringify(singleRow));
    
    fetch(url,{
        method:'post',
        body: formData
    })
    .then(response => { 
        return response.json()
    })
    .then(res=>{
		if(res.status === true) {
			setUpdateResponse(res.data);
			if(onImagePopup) onImagePopup("CLOSE");
		}else{
			if(res.flag != null && res.flag === "duplicate"){
				$(`#popup_details_err_msg_${singleRow.propType}`).show();
				$(`#popup_details_err_msg_${singleRow.propType}`).text(res.message);
			}
			// show msg for duplicate unit number
		};
		hideErrorMsgs(singleRow.id);
		return true;
    })
    .catch((err=>{
		hideErrorMsgs(singleRow.id);
        console.error(err);
		return false;
    }));
};


export const getSavedPropType=(setPropertyTypeDetails, setTableLoader) => {
	var URL2 = window.location.origin
    const url = `${URL2}/post-project/get-prop-types`;
	setTableLoader(true);
    
    fetch(url,{method:'post'})
    .then(response => { 
        return response.json()
    })
    .then(res=>{
		setTableLoader(false);
		if(res.status) {
			setPropertyTypeDetails({...res.data});
		}
    })
    .catch((err=>{
        console.error(err);
		setTableLoader(false);
    }));
};

export const saveTowerDetails = (setter,towers,combinedPropertyDetails,setIsEditTower) => {
	var URL = window.location.origin
	const url = `${URL}/post-project/save-towerDetails`;
	$('#loaderForProjectproperty').show();

	if(towers && towers.length > 0){
		towers.filter(eachTower=>eachTower.towerName = eachTower.towerName.replace(/\s+/g, " ").trim())
	};

	return fetch(url, {
		method: 'post',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({"towersData":towers,"overViewData":combinedPropertyDetails})
	})

		.then(response => {
			return response.json()
		})

		.then(res => {
			if(res.status === true) {
				if(setIsEditTower){
					setIsEditTower(false);
				};
				setter(res.data);
				return true; 
			}else{
				return false;
			}
			
		})
		.catch((err => {
			setTimeout(() => {
				$('#loaderForProjectproperty').hide();
			}, 500);
			console.error(err);

			return false;
		}));

}

export const saveProjPropDetails = (details, isEdit, setStep,setCombinedPropertyDetails,setIsEditOverview) => {

	var URL = window.location.origin
	const url = `${URL}/post-project/save-proj-overview`;
	$('#loaderForProjectproperty').show();

	fetch(url, {
		method: 'post',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(details)
	})
	.then(response => {
		return response.json()
	})
	.then(res => {
		if (isEdit) {
			if (res.status) {
				if(setIsEditOverview){
					setIsEditOverview(false);
				}
				
				setTimeout(() => {
					$('#loaderForProjectproperty').hide();
					if(setStep !== undefined){
						// setStep(2);
						onSavingProjectPage(2, projectEncId.get("projId"), setStep);
					}
				}, 1000);
				if(setCombinedPropertyDetails != null && res.data != null){
					setCombinedPropertyDetails(res.data)
				}
				
				// get no of Towers
			}

			setTimeout(() => {
				$('#loaderForProjectproperty').hide();
			}, 1000);
		} else {
			if (res.status) {
				setTimeout(() => {
					$('#loaderForProjectproperty').hide();
					if(setStep !== undefined){
						// setStep(2);
						onSavingProjectPage(2, projectEncId.get("projId"), setStep);
					};
				}, 1000);
			}
			else {
				setTimeout(() => {
					$('#loaderForProjectproperty').hide();
				}, 500);
			}
		}

	})
	.catch((err => {
		setTimeout(() => {
			$('#loaderForProjectproperty').hide();
		}, 500);
		console.error(err);
	}));
}

export const getProjPropDetails = (setCombinedPropertyDetails) => {

	var URL2 = window.location.origin
    const url = `${URL2}/post-project/get-overviewdata`;
    fetch(url,{
        method:'get',
		// headers: {
		// 	'Referer': window.location.href
		// }
    })
    .then(response => { 
        return response.json()
    })
    .then(res=>{
		if(res.status) {
			setCombinedPropertyDetails({...res.data});
		}
    })
    .catch((err=>{
        console.error(err);
    }));
};

export const deletingPhases = (deletedPhaseIds, goToNextPage) => {
	let stringOfIds = deletedPhaseIds.join(",");
	
	$("#phasePopupDeleteBtn").prop("disabled", true);
    $("#phasePopupDeleteBtn").css("cursor", "wait");
	var URL2 = window.location.origin
    const url = `${URL2}/post-project/delete-phase-data?phaseId=${stringOfIds}`;
    fetch(url, {method:'post'})
	.then(response => {
        return response.json()
    })
    .then(res=>{
		$("#phasePopupDeleteBtn").prop("disabled", false);
    	$("#phasePopupDeleteBtn").css("cursor", "pointer");
		if(res && res.status) {
			goToNextPage();
		};
    })
    .catch((err=>{
		$("#phasePopupDeleteBtn").prop("disabled", false);
    	$("#phasePopupDeleteBtn").css("cursor", "pointer");
        console.error(err);
		return false;
    }));
};


export const savepropPricing=(data) => {

	var URL2 = window.location.origin
    const url = `${URL2}/post-project/saveProjectprice`;
    fetch(url,{
        method:'post',
        headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
    })
    .then(response => { 
        return response.json()
         })
    .then(res=>{
		if(res.status) {
			// console.log("price saved successfully");
		}
    })
    .catch((err=>{
        console.error(err);
    }));
}


export const getpropPricingData=(setter) => {

	var URL2 = window.location.origin
    const url = `${URL2}/post-project/get-prices`;
    fetch(url,{
        method:'post'
    })
    .then(response => { 
        return response.json()
         })
    .then(res=>{
		if(res.status) {
			setter({...res.priceData});
		}	
    })
    .catch((err=>{
        console.error(err);
    }));
}

export const getTowerDetails = (setter) => {
	
	var URL2 = window.location.origin
    const url = `${URL2}/post-project/get-projecttower`;
    fetch(url,{
        method:'post'
    })
    .then(response => { 
        return response.json()
         })
    .then(res=>{
		if(res.status) {
			setter([...res.data]);
		}
    })
    .catch((err=>{
        console.error(err);
    }));
}



export const sendSuccessMailToBuilder = (basicDetails,setter) => {
	var URL2 = window.location.origin
    const url = `${URL2}/post-project/projectSubmit`;
  	let backendBasicDetails = { ...basicDetails };
	// backendBasicDetails.possessionDate = chnagingDateForBackend(backendBasicDetails.possessionDate)
	// backendBasicDetails.launchDate = chnagingDateForBackend(backendBasicDetails.launchDate)
    
    fetch(url,{
        method:'post',
        headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(backendBasicDetails)
        
    })
    .then(response => { 
        return response.json()
         })
    .then(res=>{
		$('#loaderForProjectPrev').hide();
		if(res.status) {
			$("#project-final-submission-success-msg").css("display", "flex");
			// postProjectButton-preview
			$('.postProjectButton-preview').css('display','none');
			setter(true);
		}
		else {
			$("#project-final-submission-success-msg").css("display", "none");
			// postProjectButton-preview
			$('.postProjectButton-preview').css('display','flex');
		}
		
    })
    .catch((err=>{
		$('#loaderForProjectPrev').hide();
        console.error(err);
    }));
};

export const addBanksDetails = (dataObject, setBankDetailsResponse) =>{
	const URL2 = window.location.origin;
	const url = `${URL2}/post-project/save-bank-details`;
		
	const formData = new FormData();
	Object.entries(dataObject).forEach(([key, value]) => {
		switch (key) {
			case 'banKIds':
				if (value && value.length > 0) {
					formData.append('banks', value);
				}
				break;
			case 'customBankNames':
				if (value && value.length > 0) {
					formData.append('customBanks', value);
				}
				break;
			case 'faqsData':
				if(value && value.length > 0) {
					const faqsListJson = JSON.stringify(value);
					formData.append('faqsList', faqsListJson);
				}
				break;
			default:
		}
	});

	fetch(url,{
		method:'post',
		body:formData
	})
	.then(response => { 
		return response.json()
	})
	.then(res=>{
		// console.log(res);
		setTimeout(()=>{
			getBanksDetails(setBankDetailsResponse);
		}, 300);
	})
	.catch((err=>{
		console.error(err);
	}));	    
};

export const saveProjectBrochure = (identifier, array, onNextclick, onChange) =>{
	const URL2 = window.location.origin;
	const url = `${URL2}/post-project/save-project-brochure`;
	$('#loaderForProjectreason').show();

	const formData = new FormData();
	if (identifier === "S") {
		if(array && array.length > 0){
			formData.append('brochure',  array[0]); // Single brochure
		}
	} else {
		array.forEach((each, index) => {
			if(each.phaseBrochureFile) {
				formData.append(each.phaseId, each.phaseBrochureFile);
			}else if(each.phaseBrochureUrl) {
				formData.append(each.phaseId, each.phaseBrochureUrl);
			}else{
				console.error(`No file or URL provided for phase ${each.phaseId}`);
        	}
		});
	};

	fetch(url,{
		method:'post',
		body:formData
	})
	.then(response => { 
		return response.json()
	})
	.then(res=>{
		if(res && res.status === true){
			onChange({target: { name: "isEditSingleBroucher", value : false}});
			onNextclick();
			$('#loaderForProjectreason').hide();
		}
	})
	.catch((err=>{
		console.error(err);
		$('#loaderForProjectreason').hide();
	})); 

};


export const getBanksDetails = (setBankDetailsResponse) =>{
	const URL2 = window.location.origin;
	const url = `${URL2}/post-project/get-bank-details`;

	fetch(url,{
        method:'get'
    })
	.then(response => { 
		return response.json()
	})
	.then(res=>{
		if(res.status === true){
			const { status, message, ...newObject } = res;
			setBankDetailsResponse((prev) => ({ ...prev, ...newObject }));
		}
	})
	.catch((err=>{
		console.error(err);
	}));
		    
};

export const getApprovedByDetails = (cityId, setAllApprovedByList) =>{
	const URL2 = window.location.origin;
	const url = `${URL2}/common/proj-authority${cityId !== undefined ? `?cityId=${cityId}` : ""}`;

	fetch(url,{
        method:'post'
    })
	.then(response => { 
		return response.json()
	})
	.then(res=>{
		if(res){
			setAllApprovedByList(res);
		}
	})
	.catch((err=>{
		console.error(err);
	})); 
};


export const uploadCsv = (phaseId, propTypeId, formData, setCsvFile, setTableData, setCsvUploadRes) =>{
	const URL2 = window.location.origin;
	const url = `${URL2}/post-project/fileUpload/upload/csv/unit?phaseId=${phaseId}&propTypeId=${propTypeId}`;

	setCsvUploadRes(prev=> ({...prev, loader: true }));

	fetch(url,{
        method:'post',
		body: formData
    })
	.then(response => { return response.json()})
	.then(res=>{
		setCsvUploadRes(prev=> ({...prev, loader: false }));

		if(res.status != null && res.status === true && res.save != null && res.save === true){
			setCsvUploadRes(prev=> ({...prev, response: true, csvErrorMsg: "", totalUnits: res.totalUnits  }));
			itemScrollIntoView("tableFloorplansHeader", true);

			setTimeout(()=>{
				setCsvUploadRes(prev=> ({...prev, response: false, isCsvPopup: false, totalUnits: 0 }));
			}, 5000);
			
			setCsvFile(null);

			if(res.csvData){
				setTableData((prev) => {
					const existingData = prev[propTypeId] || [];
					const newData = [...existingData, ...res.csvData];
					return { ...prev, [propTypeId]: newData };
				});
			};

		}else{
			setCsvFile(null);
			setCsvUploadRes(prev=> ({...prev, csvErrorMsg: `${res.message ? res.message : "" } ${res.line != null ? res.line : ""}`}));
		};
	})
	.catch((err=>{
		console.error(err);
		setCsvUploadRes(prev=> ({...prev, loader: false }));
	}));	    
};

function downloadFile(fileName, blob) {
    try {
        const link = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}

export const generateCsvFromS3 = (propTypeId, towerCount) => {
    const URL2 = window.location.origin;
    const url = `${URL2}/post-project/fileUpload/generate-csv/s3?propTypeId=${propTypeId}${towerCount !== undefined && towerCount !== 0 ? `&tower=${towerCount}` : "" }`; 

    $("#csvGenerateBtn").prop("disabled", true);
    $("#csvGenerateBtn").css("cursor", "wait");

    fetch(url, { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(res => {
            $("#csvGenerateBtn").prop("disabled", false);
            $("#csvGenerateBtn").css("cursor", "pointer");

            if (res && res.imgUrl) {
                // Fetch the file as a Blob
                return fetch(res.imgUrl);
            } else {
                throw new Error('Invalid response from server');
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            downloadFile(`${propertyDetailsTypes.get(propTypeId).name}_sample.csv`, blob);
        })
        .catch(error => {
            console.error('Error:', error);
            $("#csvGenerateBtn").prop("disabled", false);
            $("#csvGenerateBtn").css("cursor", "pointer");
        });
};

export const deleteAllUnits = (phaseId, propTypeId, bhkId, setIsDeleteAllUnitsPopup, setSelectedFilteredBhk, setTableData) =>{
	const URL2 = window.location.origin;
	const url = `${URL2}/post-project/delete-all-project-unit?phaseId=${phaseId}&propType=${propTypeId}${bhkId === null ? "" : `&bhkId=${bhkId}`}`;

	$("#csvPopupUploadBtn").prop("disabled", true);
    $("#csvPopupUploadBtn").css("cursor", "wait");

	fetch(url,{method:'post'})
	.then(response => { 
		return response.json()
	})
	.then(res=>{
		$("#csvPopupUploadBtn").prop("disabled", false);
    	$("#csvPopupUploadBtn").css("cursor", "pointer");
		if(res && res.status == true){
			setIsDeleteAllUnitsPopup(false);
			setSelectedFilteredBhk(null);

			if(bhkId === null){
				setTableData((prev) => {
					let newArray = prev[propTypeId].filter(each=>each.phaseId != phaseId);
					return { ...prev, [propTypeId]: newArray };
				});
			}else if(bhkId < 100000){
				setTableData((prev) => {
					const existingData = prev[propTypeId];
					const newData = existingData.filter(each=>!(each.bhk == bhkId && each.phaseId == phaseId));
					return { ...prev, [propTypeId]: newData };
				});
			}else if(bhkId > 100000){
				setTableData((prev) => {
					const existingData = prev[propTypeId];
					const newData = existingData.filter(each=>!(each.bhk > 100000 && each.phaseId == phaseId));
					return { ...prev, [propTypeId]: newData };
				});
			}
		}
	})
	.catch((err=>{
		console.error(err);
		$("#csvPopupUploadBtn").prop("disabled", false);
    	$("#csvPopupUploadBtn").css("cursor", "pointer");
	}));
		    
};