import { convertToPlainText, reraStatusConst } from "../images/constant";
import $ from 'jquery';

export const isEmpty = (value) => {
	
	var status=false;
	if(value == undefined || value == null || value == '' || value == "" ) {
		status=true;
	};
	
	return status;
};

var allPostProjBasicDEtailsIds = ["landAreaForAppartment", "noOfUnitForAppartment", "noOfTowerForAppartment", "noOfBlockForAppartment", "elevationBasementForAppartment", "elevationFloor",
									"noOfRowhouseForRowhouse", "landAreaForRowhouse", "noOfUnitsForRowhouse", "noOfTowersForRowhouse", "elevationBasementForRowhouse", "elevationFloor_RH", 
									"noOfVillarForVilla", "landAreaForVilla", "noOFUnitsForVilla", "elevationBasementForVilla", "elevationFloor_V",
									 "noOfVillamentForVillament", "landAreaForVillament", "noOfUnitsForVillament", "elevationBasementForVillament", "noOfFloorForVillament",
									  "noOfPlotForPlotBlock"
									];

var errorIds=[];

export const postImagesValidationIsEdit = (coverImageUrl , masterPlanUrl ,setErrorIds,statusList) =>{
	var status = true ;
	errorIds=[];
	if(coverImageUrl  == undefined || coverImageUrl.length == 0){
	 	errorIds.push("mediaBox_cover_image");
	 	status=false;
	}
	
	if(masterPlanUrl == undefined || masterPlanUrl.length == 0){
	 	errorIds.push("mediaBox_master_plan");
	 	status=false;
	}
	
	errorIds.map(eachId=>{
		$("#"+eachId).css("border-color", "#F00");
		var element = document.getElementById(eachId);
		if(element){
			element.scrollIntoView();
		}
	});
	
	setErrorIds(errorIds);
	return status;
}

export const postprojectValidetory = (basicData,step,setErrorIds,otherData,phasesDateVal, phaseDateValidationByid, setphaseDateValidationByid, SinglePasevalid,NamePhaseNoOf,NoOfPhase, propPricing, faqsData ) => {
	var status=true;
	var resultPhseDateValiod=true;
	var resultPhseDateValiodeachId;
	
	if(basicData != undefined && basicData != null) {
		if(step == 0) {

			if(phaseDateValidationByid != undefined && phaseDateValidationByid != null && phaseDateValidationByid != "" && phaseDateValidationByid != 0 ){

			resultPhseDateValiod= phaseDateValidationByid.find((single) => single === false)
			
			  !resultPhseDateValiod ? (resultPhseDateValiodeachId = phaseDateValidationByid.findIndex(
				(single) => single === false
			  )):(resultPhseDateValiodeachId =false);
			}
			errorIds.map(eachId=>{
				$("#"+eachId).css("border", "0.8px solid var(--Brand-green-primary, #148B16)");
			});

			errorIds=[];

			if(basicData != undefined && basicData != null) {
				var stateinputValue = $('#state').val();
				var cityInputValue=	$('#city').val();
				var localityInputValue=	$('#locality').val();

				if(isEmpty(basicData.projName)) {
					errorIds.push("projName");
					status=false;
				}

				if(isEmpty(basicData.totalLandArea)) {
					errorIds.push("totalLandArea");
					status=false;
				}
				
				// if(isEmpty(basicData.projectStatus)) {
				// 	errorIds.push("projectStatus");
				// 	status=false
				// }

				//latitude
				if(isEmpty(basicData.latitude) || basicData.latitude == 0) {
					errorIds.push("latitude");
					status=false;
				}

				//longtitude
				if(isEmpty(basicData.longtitude) || basicData.longtitude == 0) {
					errorIds.push("longtitude");
					status=false;
				}
				
				if(isEmpty(basicData.state) || stateinputValue == "" ) {
					errorIds.push("state");
					status=false;
				}
				
				if(isEmpty(basicData.city) || cityInputValue == "") {
					errorIds.push("city");
					status  = false;
				}
				
				if(basicData.customLocalityChange != undefined && basicData.customLocalityChange == "Y") {
					if(isEmpty(basicData.customLocality)) {
						errorIds.push("customLocality");
						status=false;
					}
				}else{
					if(isEmpty(basicData.locality) ||localityInputValue == "") {
						errorIds.push("locality");
						status=false;
					}
				}

					
				
				if(isEmpty(basicData.pincode) || (basicData.pincode+"").length != 6) {
					errorIds.push("pincode");
					status=false;
				}

				if(isEmpty(basicData.address)) {
					errorIds.push("address");
					status=false;
				}
				
			/*	if(basicData.phaseCount == 1){
					if(isEmpty(basicData.reraStatus)) {
					errorIds.push("reraStatus");
					status=false;
					}
				
					let isBothDateAvailable = true ;
					if(isEmpty(basicData.launchDate)) {
						isBothDateAvailable = false
						errorIds.push("launchDate");
						status=false;
					}
				
					if(isEmpty(basicData.possessionDate)) {
						isBothDateAvailable = false
						errorIds.push("possessionDate");
						status=false;
					}
				
				
					const parseDateString = (dateString) => {
							  const [day, month, year] = dateString.split("/");
							  return new Date(Number(year), Number(month) - 1, Number(day));
					};
				
					if(isBothDateAvailable == true){
						const dateA = parseDateString(basicData.possessionDate);
					  	const dateB = parseDateString(basicData.launchDate);
						let result = dateA > dateB
						if(result == false){
							status = false ;
							errorIds.push("vLP")
							$("#errmsglaunchDate").text("Launch Date Should Before Possession Date");
							$("#errmsgpossessionDate").text("Possession Date Should be after Launch Date");
							$("#possessionDate").css("border", "0.8px solid var(--Mandatory, #F00)");
							$("#launchDate").css("border", "0.8px solid var(--Mandatory, #F00)");
						}
					}
				}*/
				
				
				
				if(basicData.aboutproject === undefined || basicData.aboutproject === "" || isEmpty(convertToPlainText(basicData.aboutproject)) || convertToPlainText(basicData.aboutproject).length > 5000) {
					errorIds.push("aboutproject");
					status=false;
				}

				if(isEmpty(basicData.phaseCount)) {
					errorIds.push("NoOfPhase");
					status=false;
					// check all phase data 
				}else {
					if(otherData && basicData.phaseCount && parseInt(basicData.phaseCount) > 0) {
						
						if(otherData != undefined && otherData != null) {
							let i=0;
							for( i;i<parseInt(basicData.phaseCount);i++) {
								let phaseData=otherData[i];

								if(basicData.phaseCount !== 1 && isEmpty(phaseData.phaseName) ) {
									errorIds.push(`PhaseName${i}`);
									status=false;
								}

								if(isEmpty(phaseData.launchDate)) {
									errorIds.push(`LanuchDate_phaseing${i}`)
									status=false;
								}

								if(isEmpty(phaseData.possassionDate)) {
									errorIds.push(`possassionDate_phaseing${i}`)
									status=false;
								}

								if(NoOfPhase === 1){
									if(isEmpty(phaseData.launchDate)) {
										errorIds.push('launchDate')
										status=false;
									}

									if(isEmpty(phaseData.possassionDate)) {
										errorIds.push('possessionDate')
										status=false;
									}
								}
								
								if(NoOfPhase > 1){
									if(!resultPhseDateValiod && resultPhseDateValiodeachId == i){
										errorIds.push(`possassionDate_phaseing${i}`);
										errorIds.push(`LanuchDate_phaseing${i}`);
										status=false;
									}

									if(isEmpty(phaseData.sequence)) {
										errorIds.push(`sequense_${i}`);
										status=false;
									}

								}
								if(isEmpty(phaseData.reraStatus)) {
									errorIds.push(`rera_status_${i}`)
									errorIds.push(NoOfPhase === 1 ?   "reraStatus" :`rera_status_${i}`);
									status=false;
								}
								if( phaseData.reraStatus != undefined && phaseData.reraStatus != reraStatusConst.Not_Applied && 
									phaseData.reraStatus != reraStatusConst.Ready_to_Move_or_Not_Applicable ){
									if(isEmpty(phaseData.reraId)) {
										errorIds.push(NoOfPhase === 1 ?   "reraId" :`rera_id_${i}`);
										status=false;
									}
								}
							};

							const hasDuplicates = (list) => {
								return [...new Set(list.filter((item, index) => list.indexOf(item) !== index))];
							};
							
							// const sequenceArray = otherData.filter(eachPhase => eachPhase.isActive != "N").map(each=>each.sequence).filter((_, ind)=>ind < basicData.phaseCount);
							let sequenceArray = [];

							otherData.map((eachPhase, phaseIndex)=>{
								if(eachPhase.isActive != "N" && phaseIndex <= basicData.phaseCount-1){
									if(sequenceArray.length < basicData.phaseCount){
										sequenceArray = [...sequenceArray, eachPhase.sequence];
									}
								}
							});

							if( !(sequenceArray.includes(undefined) || sequenceArray.includes(null)) && basicData.phaseCount > 1 ){
								let duplicatesItemsList = [...hasDuplicates(sequenceArray)];
								if(duplicatesItemsList.length > 0){
									// Duplicate sequence
									otherData.map((each, index)=>{
										if(duplicatesItemsList.includes(each.sequence)){
											errorIds.push(`sequense_${index}`);
											$(`#phaseDetailsBoxErrorMsg_${index}`).show();
										}
									});
	
									status=false;
	
									$("#finalErrorMsg_basicDetails").show();
									$("#finalErrorMsg_basicDetails").text("Duplicate Sequences are Present in Phases Please Change");
									setTimeout(()=>{
										$("#finalErrorMsg_basicDetails").hide();
										$("#finalErrorMsg_basicDetails").text("Please Fill All The Required Mandatory Fields");
									},3000);
								};

								// if sequence number more than phase
								otherData.map((eachPhase, index)=>{
									if(eachPhase.isActive !== "N" && index <= basicData.phaseCount-1){
										if(eachPhase.sequence > basicData.phaseCount){
											errorIds.push(`sequense_${index}`);
											status=false;
										}
									}
								});
							}							
						}
					}
				};

				if(errorIds.length > 0){
					$("#finalErrorMsg_basicDetails").show();
					setTimeout(()=>{
						$("#finalErrorMsg_basicDetails").hide();
					},3000);
				};			
				
				let scrooled=false;
				errorIds.map(eachId=>{
					if(eachId == "pincode"){
						$("#errmsgpincode").text("Pincode Should Six Digits");
					}

					setTimeout(() => {
						$("#errmsgpincode").text("");
					}, 3000);

					if(scrooled == false) {
						var element = document.getElementById(eachId);
						if(element) element.scrollIntoView();
						scrooled=true;
					};

					$("#"+eachId).css("border-color", "#F00");
				});

				// setTimeout(() => {
				// 	errorIds.map(eachId=>{
				// 		$("#"+eachId).css("border-color", "");
				// 	});

				// 	setErrorIds([]);
				// }, 3000);

			}else {
				status=false;
			}
		}else if(step == 3) {
			errorIds=[];

			if(basicData != undefined && basicData != null) {
				
				if(isEmpty(basicData) || basicData.size === 0) {
					errorIds.push("structure");
					status=false;

					
					$("#finalErrorMsg_spec").show();
					setTimeout(()=>{
						$("#finalErrorMsg_spec").hide();
					},3000);
					
				}
			}
			else {
				status=false;
			}
			
		//Property Details
		}else if(step == 1) {
		
			if(basicData != undefined && basicData != null) {
				
				// if it is an Object
				if(basicData.length == undefined){
					if(basicData.apartment != undefined  && basicData.apartment != null && basicData.apartment.size>0){

							
						errorIds=[];

						if(isEmpty(basicData.apartment.unitType)) {
							errorIds.push("unitType");
							status=false;
						}
						
						if(isEmpty(basicData.apartment.carpetArea)) {
							errorIds.push("carpetArea");
							status=false;
						}
						
						if(isEmpty(basicData.apartment.superBuildUpArea)) {
							errorIds.push("superBuildUpArea");
							status=false;
						}
						
						if(isEmpty(basicData.apartment.bathrooms)) {
							errorIds.push("bathrooms");
							status=false;
						}
						
						if(isEmpty(basicData.apartment.balconies)) {
							errorIds.push("balconies");
							status=false;
						}
						
						if(isEmpty(basicData.apartment.minPrice)) {
							errorIds.push("minPrice");
							status=false;
						}
						
						if(isEmpty(basicData.apartment.maxPrice)) {
							errorIds.push("maxPrice");
							status=false;
						}
						
						if(isEmpty(basicData.apartment.floorPlan)) {
							errorIds.push("floorPlan");
							status=false;
						}						
					}
					else if(basicData.rowHouse != undefined  && basicData.rowHouse != null && basicData.rowHouse.size>0){
						
						if(isEmpty(basicData.rowHouse.unitType)) {
							errorIds.push("unitType");
							status=false;
						}
						
						if(isEmpty(basicData.rowHouse.area)) {
							errorIds.push("area");
							status=false;
						}
						
						if(isEmpty(basicData.rowHouse.carpetArea)) {
							errorIds.push("carpetArea");
							status=false;
						}
						
						if(isEmpty(basicData.rowHouse.superBuildUpArea)) {
							errorIds.push("superBuildUpArea");
							status=false;
						}
						
						if(isEmpty(basicData.rowHouse.bathrooms)) {
							errorIds.push("bathrooms");
							status=false;
						}
						
						
						
						if(isEmpty(basicData.rowHouse.minPrice)) {
							errorIds.push("minPrice");
							status=false;
						}
						
						if(isEmpty(basicData.rowHouse.maxPrice)) {
							errorIds.push("maxPrice");
							status=false;
						}
						
						if(isEmpty(basicData.rowHouse.floorPlan)) {
							errorIds.push("floorPlan");
							status=false;
						}
						
					}
					else if(basicData.villa != undefined  && basicData.villa != null && basicData.villa.size>0){
						
						if(isEmpty(basicData.villa.unitType)) {
							errorIds.push("unitType");
							status=false;
						}
						
						// if(isEmpty(basicData.villa.plotArea)) {
						// 	errorIds.push("plotArea");
						// 	status=false;
						// }
						
						if(isEmpty(basicData.villa.carpetArea)) {
							errorIds.push("carpetArea");
							status=false;
						}
						
						if(isEmpty(basicData.villa.superBuildUpArea)) {
							errorIds.push("superBuildUpArea");
							status=false;
						}
						
						if(isEmpty(basicData.villa.bathrooms)) {
							errorIds.push("bathrooms");
							status=false;
						}
						
						
						if(isEmpty(basicData.villa.minPrice)) {
							errorIds.push("minPrice");
							status=false;
						}
						
						if(isEmpty(basicData.villa.maxPrice)) {
							errorIds.push("maxPrice");
							status=false;
						}
						
						if(isEmpty(basicData.villa.floorPlan)) {
							errorIds.push("floorPlan");
							status=false;
						}
						
					}
					
					else if(basicData.villament != undefined  && basicData.villament != null && basicData.villament.size>0){
						
						if(isEmpty(basicData.villament.unitType)) {
							errorIds.push("unitType");
							status=false;
						}
						
						if(isEmpty(basicData.villament.carpetArea)) {
							errorIds.push("carpetArea");
							status=false;
						}
						
						if(isEmpty(basicData.villament.superBuildUpArea)) {
							errorIds.push("superBuildUpArea");
							status=false;
						}
						
						if(isEmpty(basicData.villament.bathrooms)) {
							errorIds.push("bathrooms");
							status=false;
						}
						
						
						if(isEmpty(basicData.villament.minPrice)) {
							errorIds.push("minPrice");
							status=false;
						}
						
						if(isEmpty(basicData.villament.maxPrice)) {
							errorIds.push("maxPrice");
							status=false;
						}
						
						if(isEmpty(basicData.villament.floorPlan)) {
							errorIds.push("floorPlan");
							status=false;
						}
					}
						
					else if(basicData.plot != undefined  && basicData.plot != null && basicData.plot.size>0){
						
						if(isEmpty(basicData.plot.plotArea)) {
							errorIds.push("plotArea");
							status=false;
						}
						
						if(isEmpty(basicData.plot.plotLength)) {
							errorIds.push("plotLength");
							status=false;
						}
						
						if(isEmpty(basicData.plot.plotBreadth)) {
							errorIds.push("plotBreadth");
							status=false;
						}
						
						
						if(isEmpty(basicData.plot.minPrice)) {
							errorIds.push("minPrice");
							status=false;
						}
						
						if(isEmpty(basicData.plot.maxPrice)) {
							errorIds.push("maxPrice");
							status=false;
						}
						
						if(isEmpty(basicData.apartment.floorPlan)) {
							errorIds.push("floorPlan");
							status=false;
						}
					}
				}else{
					// if it is an Array
					if(basicData.length != 0){
						basicData.map(eachDetails=>{
							if(eachDetails.dataType == 1 && eachDetails.projType == 31){

								errorIds.map(eachId=>{
									$("#"+eachId).css("border", "0.8px solid var(--Brand-green-primary, #148B16)");
								});

								errorIds=[];

								if(isEmpty(eachDetails.landArea)) {
									errorIds.push("landAreaForAppartment");
									status=false;
								}
								
								if(isEmpty(eachDetails.noOfUnit)) {
									errorIds.push("noOfUnitForAppartment");
									status=false;
								}
								
								if(isEmpty(eachDetails.noOfTower)) {
									errorIds.push("noOfTowerForAppartment");
									status=false;
								}
								if(isEmpty(eachDetails.noOfBlock)) {
									errorIds.push("noOfBlockForAppartment");
									status=false;
								}
								
								if(isEmpty(eachDetails.elevationFloor)) {
									errorIds.push("elevationFloor");
									status=false;
								}
								
								if(isEmpty(eachDetails.elevationBasement)) {
									errorIds.push("elevationBasementForAppartment");
									status=false;
								}

								errorIds.map(eachId=>{
									$("#"+eachId).css("border", "0.8px solid var(--Mandatory, #F00)");
								});
								
							}
							if(eachDetails.dataType == 1 && eachDetails.projType == 32){

								errorIds.map(eachId=>{
									$("#"+eachId).css("border", "0.8px solid var(--Brand-green-primary, #148B16)");
								});

								errorIds=[];

								if(isEmpty(eachDetails.landArea)) {
									errorIds.push("landAreaForRowhouse");
									status=false;
								}
								
								if(isEmpty(eachDetails.noOfUnit)) {
									errorIds.push("noOfUnitsForRowhouse");
									status=false;
								}
								
								if(isEmpty(eachDetails.noOfTower)) {
									errorIds.push("noOfTowersForRowhouse");
									status=false;
								}
								if(isEmpty(eachDetails.noOfBlock)) {
									errorIds.push("noOfRowhouseForRowhouse");
									status=false;
								}
								
								if(isEmpty(eachDetails.elevationFloor)) {
									errorIds.push("elevationFloor_RH");
									status=false;
								}
								
								if(isEmpty(eachDetails.elevationBasement)) {
									errorIds.push("elevationBasementForRowhouse");
									status=false;
								}

								errorIds.map(eachId=>{
									$("#"+eachId).css("border", "0.8px solid var(--Mandatory, #F00)");
								});
								
							}
							if(eachDetails.dataType == 1 && eachDetails.projType == 33){

								errorIds.map(eachId=>{
									$("#"+eachId).css("border", "0.8px solid var(--Brand-green-primary, #148B16)");
								});

								errorIds=[];

								if(isEmpty(eachDetails.landArea)) {
									errorIds.push("landAreaForVilla");
									status=false;
								}
								
								if(isEmpty(eachDetails.noOfUnit)) {
									errorIds.push("noOFUnitsForVilla");
									status=false;
								}
								
								if(isEmpty(eachDetails.elevationBasement)) {
									errorIds.push("elevationBasementForVilla");
									status=false;
								}
								if(isEmpty(eachDetails.noOfBlock)) {
									errorIds.push("noOfVillarForVilla");
									status=false;
								}
								
								if(isEmpty(eachDetails.elevationFloor)) {
									errorIds.push("elevationFloor_V");
									status=false;
								}				

								errorIds.map(eachId=>{
									$("#"+eachId).css("border", "0.8px solid var(--Mandatory, #F00)");
								});
								
							}
							if(eachDetails.dataType == 1 && eachDetails.projType == 34){

								errorIds.map(eachId=>{
									$("#"+eachId).css("border", "0.8px solid var(--Brand-green-primary, #148B16)");
								});

								errorIds=[];

								if(isEmpty(eachDetails.landArea)) {
									errorIds.push("landAreaForVillament");
									status=false;
								}
								
								if(isEmpty(eachDetails.noOfUnit)) {
									errorIds.push("noOfUnitsForVillament");
									status=false;
								}
								
								if(isEmpty(eachDetails.elevationBasement)) {
									errorIds.push("elevationBasementForVillament");
									status=false;
								}
								if(isEmpty(eachDetails.noOfBlock)) {
									errorIds.push("noOfVillamentForVillament");
									status=false;
								}
								
								if(isEmpty(eachDetails.elevationFloor)) {
									errorIds.push("noOfFloorForVillament");
									status=false;
								}				

								errorIds.map(eachId=>{
									$("#"+eachId).css("border", "0.8px solid var(--Mandatory, #F00)");
								});
								
							}
							if(eachDetails.dataType == 1 && eachDetails.projType == 35){
								errorIds=[];

								if(isEmpty(eachDetails.noOfBlock)) {
									errorIds.push("noOfPlotForPlotBlock");
									$("#noOfPlotForPlotBlock").css("border", "0.8px solid var(--Mandatory, #F00)");
									status=false;
								}else{
									$("#noOfPlotForPlotBlock").css("border", "0.8px solid var(--Brand-green-primary, #148B16)");
								}
								
							}
							

						})
					}else{
						allPostProjBasicDEtailsIds.map(eachOne=>{
							$("#"+eachOne).css("border", "0.8px solid var(--Mandatory, #F00)");
						});
						
					}
				}

			}else {
				status=false;
			}
		}else if(step ==2){

			errorIds.map(eachId=>{
				$("#"+eachId).css("border-color", "#0073C6");
			});

			errorIds=[];


			let statusList = otherData;
			
			if((basicData != undefined && basicData != null) ) {

				errorIds=[];

				 if(isEmpty(basicData.cover)) {
				 	errorIds.push("mediaBox_cover_image");
				 	status=false;
				}
				
				 if(isEmpty(basicData.masterplan)) {
				 	errorIds.push("mediaBox_master_plan");
				 	status=false;
				 }

				errorIds.map(eachId=>{
					$("#"+eachId).css("border-color", "#F00");
					var element = document.getElementById(eachId);
					if(element){
						element.scrollIntoView();
					}
				});
			
			}
			else{
				status=false;
			}
			
		}else if(step ==4){
			errorIds=[];

			if(basicData !=undefined && basicData != null ){
				if(basicData ==  undefined  ||  basicData.length == 0){
				status = false;
				errorIds.push("amenities")
			}
			
		}
		else{
			status = false;
		}
				
		}else if(step ==5){
			errorIds=[];

			if(basicData !=undefined && basicData != null ){
				// if(basicData.highlights ==  undefined || basicData.highlights.length <= 0){
				// 	status = false;
				// 	errorIds.push("highlights");
				// }
				
				if(basicData.whyBuyThisProject === undefined || basicData.whyBuyThisProject === "" || isEmpty(convertToPlainText(basicData.whyBuyThisProject))|| (convertToPlainText(basicData.whyBuyThisProject).length != undefined && convertToPlainText(basicData.whyBuyThisProject).length > 5000 )){
					status = false ;
					errorIds.push("whyBuyThisProject");
					$("#whyBuyThisProject").css("border", "0.8px solid var(--Mandatory, #F00)");
				}else{
					$("#whyBuyThisProject").css("border", "0.8px solid var(--Brand-green-primary, #148B16)");
				}
				if(otherData != undefined && otherData != null && otherData != ""){
					// this validation for faqs;  
					otherData.forEach((faq, index) => { 
						if(isEmpty(faq.faqQuestion) ){
							status = false ;
							errorIds.push(`faqQuestion_${index}`);
						}
						if(isEmpty(faq.faqAnswer) || faq.faqAnswer.length > 1000 ){
							status = false ;
							errorIds.push(`faqAnswer_${index}`);
						}
					 });
					
				}
				errorIds.map(eachId=>{
					$("#"+eachId).css("border-color", "#F00");
					var element = document.getElementById(eachId);
					if(element){
						element.scrollIntoView();
					}
				});

			}
			else{
				status = false;
			}
			
		}else if(step == "P"){
			if (areAllValuesNull(basicData) == true) {
			  status = false ;
			  $("#messageValidationForNullObjectInPropertyDetaila").text("please fill at least one property");
			}
		}
	};
	
	
	setErrorIds(errorIds);

	if(errorIds.length > 0){
		$("#finalErrorMsg_whyBuyThis").show();
		setTimeout(()=>{
			$("#finalErrorMsg_whyBuyThis").hide();
		},3000);
	};
	return status;
	
}


const areAllValuesNull=(obj)=> {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const values = obj[key];
      for (const prop in values) {
        if (values.hasOwnProperty(prop) && values[prop] !== null) {
          return false; // If any value is not null, return false
        }
      }
    }
  }
  return true; // All values are null
}



export const projectPropertyValidations = (pricing,combinedprop,towers) => {

}


