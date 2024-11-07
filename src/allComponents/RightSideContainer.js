import React, { Fragment, useEffect, useState } from "react";
import $ from 'jquery';

import '../styles/postProjectRightSideCon.css';
// import styles from '../styles/postProjectRightSideCon.css';

import { saveProjBasicDetails, saveProjectImages, addProjectAmenities, getProjectMedia, addProjectHighlight, getSpecificationData,
          getAmenitiesData, addspecification, getSavedPropType, saveProjPropDetails, getProjPropDetails, sendSuccessMailToBuilder,
          getpropPricingData, savepropPricing, saveTowerDetails, getTowerDetails, addBanksDetails, getBanksDetails,
          onSavingProjectPage, getApprovedByDetails, deletingPhases,
          newpostProjectAmenities,
      } from "../apis/postApi";
      
import {getCitiesDetails, getLocalityDetails, getGroupList} from "../apis/cityAndStateApi";
import { projectprops } from "../images/commonImages";
import { completed, current, handPointUp2, next } from "../images/commonSvgs";
import UserDeactivatedPage from "../commonComponents/UserDeactivatedPage";
import { activeStatus, basicData, checkOverViewData, convertToPlainText, getUnit, isLoggedin, page, pageCount, phases, projectEncId, repeatCounterForMinMax, userType } from "../images/constant";
import PostProjectPreviewPage from "./PostProjectPreviewPage";
import WhyBuyThisProject from "./WhyBuyThisProject";
import Amenities from "./Amenities";
import Specifications from "./Specifications";
import ProjectImages from "./ProjectImages";
import PropertyDetails from "./PropertyDetails";
import ProjectDetails from "./ProjectDetails";
import LeftSideTrackingCon from "./LeftSideTrackingCon";
import { postprojectValidetory, postImagesValidationIsEdit } from "./validations";
import { convertDateofBackend, checkDateFormat } from "./LoginsignUpValidator";
import DeletePhasesPopup from "./pojectDetailsComponents/DeletePhasesPopup";

const RightSideContainer = () => {
  const [step, setStep] = useState(0);
  const [basicDetails, setBasicDetails] = useState({});
  const [imageForStep, setImageForStep] = useState({
    step0: current,
    step1: next,
    step2: next,
    step3: next,
    step4: next,
    step5: next,
  });
  const [errorIds, setErrorIds] = useState([]);

  const [specificationData, setSpecificationData] = useState(new Map());
  const [statusList, setStatusList] = useState([ "N","N","N","N","N","N","N","N","N"]);

  pageCount.set("page", page);

  const projectMedia = {
    cover: [],
    other: [],
    masterplan: [],
    video: [],
    walkThroughVideo: [],
    statusList: [],
  };

  const [amenitiesFromDB, setAmenitiesFromDB] = useState([]);
  const [amenitiesData, setAmenitiesData] = useState([]);
  const [customAmenities, setCustomAmenities] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [city, setCities] = useState([]);
  const [locality, setLocality] = useState([]);
  const [getMediaResponse, setGetMediaResponse] = useState(new Map());
  const [propertyTypeDetails, setPropertyTypeDetails] = useState({});
  const [combinedPropertyDetails, setCombinedPropertyDetails] = useState({});
  const [commonData, setCommonData] = useState([]);
  const [ SinglePasevalid,setSinglePasevalid]=useState(true)
  const [ NamePhaseNoOf, setNamePhaseNoOf]=useState()
  const [phaseArray, setPhaseArray] = useState(phases !== undefined && phases !== null ? phases : [{ phaseName: null, sequence: 1  }]);
  const [newCustomAmenity, setNewCustomAmenity] = useState("");

  const [previousPhase, setPreviousPhase] = useState(
      {
          isOpen: false,
          isNewPhase: true,
          phaseCount: 
              basicData && 
              basicData.phaseCount !== undefined && basicData.phaseCount !== null
              ? basicData.phaseCount : 1,
          phaseArray: 
              [phases !== undefined && phases != null ? phases : []],
          deletedPhaseIds:[],    
      }
  );

  const [projIdEnc, setProjIdEnc] = useState("");
  
  const [NoOfPhase, setNoOfPhase] = useState(
      basicData !== undefined &&
      basicData != null &&
      basicData.phaseCount !== undefined &&
      basicData.phaseCount != null
      ? basicData.phaseCount
      : 1
  );
  const [specificationprev, setspecificationprev] = useState(new Map());

  const [isMailSent, setisMailSent] = useState(false);
  const [propPricing, setPropPricing] = useState({});
  const [towers, setTowers] = useState([]);
  const [noOfTower, setNoofTower] = useState(0);
  const [villamenttower, setvillamenttower] = useState(0);
  const [NophasesOfcurrent, setNophasesOfcurrent] = useState(0);
  const [masterPlanUrl, setMasterPlanUrl] = useState([]);
  const [coverImgUrl, setCoverImgUrl] = useState([]);
  const [phasesDateVal, setphasesDateVal] = useState(false);
  const [phaseDateValidationByid, setphaseDateValidationByid]=useState([]);
  const [selectedPhase, setSelectedPhase] = useState(
    phaseArray !== undefined && phaseArray != null && phaseArray.length >= 1
      ? phaseArray[0].phaseId
      : null
  );
  const [propTypeId, setPropTypeId] = useState(null);
  const [bankDetailsObject, setBankDetailsObject] = useState({});
  const [bankDetailsResponse, setBankDetailsResponse] = useState({});

  // Bank Details use states
  const [file, setFile] = useState([]);
  const [fileUrl, setFileUrl] = useState([]);
  const [banKIds, setBankIds] = useState([]);
  const [approvalsIds, setApprovalsIds] = useState(basicData && basicData.projAuthority ? basicData.projAuthority.split(",").map(each=>parseInt(each)) : []);

  const [customBankNames, setCustomBankNames] = useState([]);
  const [faqsData, setFaqsData] = useState([]);
  const [faqsObj, setFaqsObj] = useState({});

  const [projectUtube,setProjectUtube] = useState({url:"", isYoutubeVideo: false});
  const [walkThroughUtube,setWalkThroughUtube] = useState({url:"", isYoutubeVideo: false});

  const [allApprovedByList, setAllApprovedByList] = useState([]);
  const [tableLoader,setTableLoader] = useState(false);

  const apartmentTypeList = commonData && commonData.aptType && commonData.aptType.length !== undefined && commonData.aptType.length > 0 ?  
    [{ cid: 900, constDesc: propTypeId === projectprops.apartment ? "Apartment" : "Villament" }, ...commonData.aptType ] : [];

  useEffect(() => {
    if (Object.keys(bankDetailsResponse).length > 0) {
      if(bankDetailsResponse && bankDetailsResponse.projBankNames && bankDetailsResponse.projBankNames.length > 0){
          setCustomBankNames(bankDetailsResponse.projBankNames.filter( each => each !== "" ));
      };

      if(bankDetailsResponse && bankDetailsResponse.projBankNames && bankDetailsResponse.projBankNames.length === 0){
        setCustomBankNames([]);
      };

      setBankIds(bankDetailsResponse.projBankIds);
      // setFileUrl(bankDetailsResponse.projBroucherUrl != null ? [bankDetailsResponse.projBroucherUrl]  : [] );
      setFaqsData(bankDetailsResponse.faqsList);
    }
  }, [bankDetailsResponse.faqsList, bankDetailsResponse.projBankIds, bankDetailsResponse.projBankNames]);

  const parseDateString = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  const idValidatar = (name, identifier) => {
    if (identifier === projectprops.apartment) {
      let apt = [ "unitType", "aptType", "unitNumber", "towers", "floors", "blocks", "superBuildUpArea", "carpetArea",
                "bathrooms", "balcony", "unitFacing", "carParking", "openParking",
      ];

      if (apt.includes(name)) {
        return true;
      } else {
        return false;
      }
    } else if (identifier === projectprops.rowHouse) {
      let rhs = [
        "unitType",
        "aptType",
        "unitNumber",
        "Elevations",
        "superBuildUpArea",
        "carpetArea",
        "area",
        "plotArea",
        "bathrooms",
        "balcony",
        "unitFacing",
        "carParking",
        "gardenSpace",
        "terracespace",
      ];

      if (rhs.includes(name)) {
        return true;
      } else {
        return false;
      }
    } else if (identifier === projectprops.villa) {
      let vil = [
        "unitType",
        "aptType",
        "unitNumber",
        "Elevations",
        "superBuildUpArea",
        "carpetArea",
        "area",
        "plotArea",
        "bathrooms",
        "balcony",
        "unitFacing",
        "carParking",
        "gardenSpace",
        "terracespace",
      ];
      if (vil.includes(name)) {
        return true;
      } else {
        return false;
      }
    } else if (identifier === projectprops.villament) {
      let vilm = [
        "unitType",
        "aptType",
        "unitNumber",
        "towers",
        "floors",
        "superBuildUpArea",
        "carpetArea",
        "area",
        "bathrooms",
        "balcony",
        "unitFacing",
        "carParking",
        "gardenSpace",
        "terracespace",
        "totalBalconySize",
      ];
      if (vilm.includes(name)) {
        return true;
      } else {
        return false;
      }
    } else if (identifier === projectprops.plot) {
      let plo = [
        "unitNumber",
        "breadthOfPlot",
        "plotFacing",
        "plotArea",
        "lengthOfPlot",
      ];

      if (plo.includes(name)) {
        return true;
      } else {
        return false;
      }
    }
  };

  useEffect(() => {
    if (step === 0) {
      getGroupList(setCommonData, [
        "state",
        "rerastatus",
        "projectstatus",
        "banks",
        "aptType"
      ]);
      if (basicData !== undefined && basicData !== null) {
        if (basicData.state != null) {
          getCitiesDetails(setCities, basicData.state);
          getLocalityDetails(setLocality, basicData.city);
        }
        setIsEdit(true);
        setBasicDetails(basicData);
        setStep(0)
      } else {
        basicDetails.phaseCount = 1;
        setBasicDetails((prev) => ({ ...prev, phaseCount: 1 }));
      }
    }

  }, []);

  const removeFromErrorIds = (name) => {
    if (errorIds !== undefined && errorIds != null && errorIds.length != 0) {
      setErrorIds(
        errorIds.filter(function (item) {
          return item !== name;
        })
      );
    }
  };

  let latval = document.getElementById("latitude");
  let lngval = document.getElementById("longtitude");

  $("#selectByLocation_2").blur(function(){
      setTimeout(()=>{
          if($("#selectByLocation_2").val()[0] !== " " ){
              setBasicDetails((basicDetails) => ({
                ...basicDetails,
                ["address"]: $("#selectByLocation_2").val().replace(/\s+/g, " ").trim(),
                ...(latval !== undefined && latval.value !== "" ? { latitude: latval.value } : {}),
                ...(lngval !== undefined && lngval.value !== "" ? { longtitude: lngval.value } : {}),
              }));
              $("#address").css("border-color", "var(--Brand-green-primary, #148B16)");
          }
     
          if(latval.value !== ""){
            $("#latitude").css("border-color", "var(--Brand-green-primary, #148B16)");
          };
          if(lngval.value !== ""){
            $("#longtitude").css("border-color", "var(--Brand-green-primary, #148B16)");	
          };

      }, 300);
  });


  const onChangeBasicDetails = (e, key, value) => {
    var latval = document.getElementById("latitude");
    let lngval = document.getElementById("longtitude");

    if (step !== 1) {
      if (key !== undefined && key != null && value !== undefined) {

      if(value !== "custom" ){
        setBasicDetails((basicDetails) => ({
            ...basicDetails,
            [key]: value,
            ...(latval !== undefined && latval.value !== "" ? { latitude: latval.value } : {}),
            ...(lngval !== undefined && lngval.value !== "" ? { longtitude: lngval.value } : {}),
        }));
      };

      if(key === "locality" && value !== "custom" && value !== "notCustom" && value < 100000){
            setBasicDetails((basicDetails) => ({
              ...basicDetails,
              [key]: value,
              customLocalityChange: "N",
              customLocality: ""
            }));
			  }else if(key === "locality" && value !== "custom" && value !== "notCustom" && value > 100000){
          setBasicDetails((basicDetails) => ({
            ...basicDetails,
            [key]: value,
          }));
			  }else if(key === "locality" && value === "custom" ){
          setBasicDetails((basicDetails) => ({
            ...basicDetails,
            [key]: "",
            customLocalityChange: "Y",
          }));
				$("#locality").val("");
			  }else if(key === "locality" && value === "notCustom" ){
          setBasicDetails((basicDetails) => ({
            ...basicDetails,
            [key]: "",
            customLocalityChange: "N",
            customLocality: ""
            }));
            $("#locality").val("");
			  }

        if(key === "customLocality" && value != null){
            setBasicDetails((basicDetails) => ({
                ...basicDetails,
                [key]: value.replace(/\s\s+/g, ' '),
                customLocalityChange: "Y",
            }));
        }
        
        if(key === "state"){
          setBasicDetails((basicDetails) => ({
            ...basicDetails,
            [key]: value,
            ["city"]: "",
            ["locality"]: ""
          }));
          $("#city").val("");
          $("#locality").val("");
        }else if(key === "city"){
          setBasicDetails((basicDetails) => ({
            ...basicDetails,
            [key]: value,
            ["locality"]: ""
          }));
          $("#locality").val("");
        }

        $("#" + key).css("border", "0.8px solid var(--Brand-green-primary, #148B16)" );

        removeFromErrorIds(key);
      } else {
          if (e !== undefined && e != null ) {

              if (e.target.name === "reraId") {
                var obj = {};
                //obj.phaseName = 1;
                if (phaseArray[0] === undefined) {
                  obj[`${e.target.name}`] = e.target.value;
                  phaseArray.push(obj);
                } else {
                  obj = phaseArray[0];
                  obj[`${e.target.name}`] = e.target.value;
                }
              }

              setPhaseArray(phaseArray);
              if (e.target.name === "projName") {
                  setBasicDetails((basicDetails) => ({
                    ...basicDetails,
                    [e.target.name]: e.target.value.replace(/[^\w\s&]/g, "").replace("_", ""),
                  }));
                  if (step !== null && step !== undefined  && step !== 1) {
                    let stepKey = `step${step}`;
                    setImageForStep({ ...imageForStep, [stepKey]: current });
                  }
              }else if (e.target.name === "pincode") {
                let pincodeVal = e.target.value === "" ? "" : Math.trunc(e.target.value).toString().replace(/\s+/g, " ").trim();
                if (e.target.value > 0 && pincodeVal.length <= 6) {
                  setBasicDetails((basicDetails) => ({
                    ...basicDetails,
                    [e.target.name]: pincodeVal,
                  }));
                  if (step !== null && step !== undefined  && step !== 1) {
                    let stepKey = `step${step}`;
                    setImageForStep({ ...imageForStep, [stepKey]: current });
                  }
                  $("#errmsgpincode").text("");
                  $("#pincode").css("border-color","#148B16");
                } else {
                  if(e.target.value === ""){
                    setBasicDetails((basicDetails) => ({ ...basicDetails, [e.target.name]: "", }));
                  }
                  $("#errmsgpincode").text("Pincode Should Six Digits");
                  $("#pincode").css("border-color","#F00");
                  setTimeout(() => {
                    $("#errmsgpincode").text("");
                    $("#pincode").css("border-color","#148B16");
                  }, 2800);
                }
              }else if (e.target.name === "whyBuyThisProject") {
                if (convertToPlainText(e.target.value).length < 5002) {
                  setBasicDetails((basicDetails) => ({
                    ...basicDetails,
                    [e.target.name]: e.target.value,
                  }));
                }
              }else {
                    setBasicDetails((basicDetails) => ({
                        ...basicDetails,
                        [e.target.name]: e.target.name === "projPromoter" ? e.target.value.replace(/[^\w\s&]/g, "").replace("_", "") : e.target.value ,
                        ...(latval !== undefined && latval.value !== "" ? {  latitude: latval.value } : {}),
                        ...(lngval !== undefined && lngval.value !== "" ? { longtitude: lngval.value } : {}),
                    }));

                    if (step !== null && step !== undefined  && step !== 1) {
                      let stepKey = `step${step}`;
                      setImageForStep({ ...imageForStep, [stepKey]: current });
                    }
                }
                if(e.target.name !== "Specification"){
                  $("#" + e.target.id).css( "border", "0.8px solid var(--Brand-green-primary, #148B16)" );
                }
                removeFromErrorIds(e.target.name);
          }
      }
    }
  };


  const trackeForProject = (identifier) => {
    if (identifier !== undefined && identifier != null) {

      //let previousKey = `step${step}`;

      // if (imageForStep[previousKey] === current ) {
      //     setImageForStep((prev) => {
      //       return { ...prev, [previousKey]: completed };
      //     });
      // };

      let stepKey = `step${identifier}`;

      if ( imageForStep[stepKey] === completed || imageForStep[stepKey] === current ) {
        setStep(identifier);
      };
    }
  };



  useEffect(() => {
    // let prevSteps = [...compltedSteps];

    // if(!prevSteps.includes(step)){
    //     prevSteps.push(step)
    //     setCompltedSteps(prevSteps);
    // };

    let stepKey = `step${step}`;
    
    for (let i = 0; i < step; i++) {
        let previousKey = `step${i}`;
        setImageForStep((prev) => {
            return { ...prev, [previousKey]: completed, [stepKey]: current };
        });
    };
    

    if (step === 0) {
      $("#loaderForProject").hide();
    }

    if (step === 1) {
      $(`#basicDetailsEditIcon`).show();
      $("#loaderForProjectimages").hide();
      getTowerDetails(setTowers);
      getProjPropDetails(setCombinedPropertyDetails);
      getpropPricingData(setPropPricing);
      getSavedPropType(setPropertyTypeDetails, setTableLoader);
      setSelectedPhase( phaseArray != null && phaseArray.length > 0 ? phaseArray[0].phaseId : "" );
      setPropTypeId(null);
    }

    if (step === 2) {
        $(`#propDetailsEditIcon`).show();
        $("#loaderForProjectproperty").hide();
        $("#loaderForProjectimages").hide();
      
        getProjectMedia( setGetMediaResponse, setStep, setStatusList, setBankDetailsResponse );
    }

    if (step === 3) {
      $(`#imagesEditIcon`).show();
      $("#loaderForProjectspecification").hide();

      newpostProjectAmenities(setAmenitiesFromDB);
    }

    if (step === 4) {
      $(`#specificationsEditIcon`).show();
      $("#loaderForProjectamenities").hide();
    }

    if (step === 5) {
      $(`#amenitiesEditIcon`).show();
      let dataLength = phaseArray.filter(each=>each.phaseBrochureUrl !== undefined && each.phaseBrochureUrl !== null ).length;
      if(dataLength > 0){
        setBasicDetails(prev=>({ ...prev, isPhaseBroucher: true }));
      }

      if (getMediaResponse.projBroucherUrl !== undefined && getMediaResponse.projBroucherUrl != null && getMediaResponse.projBroucherUrl.length > 0) {
        setFileUrl([getMediaResponse.projBroucherUrl]);
        setBasicDetails(prev=>({ ...prev, isPhaseBroucher: false }));
      };

      getProjectMedia( setGetMediaResponse, setStep, setStatusList, setBankDetailsResponse );
      $("#loaderForProjectreason").hide();

      getBanksDetails(setBankDetailsResponse);
    }

    if (step === 6) {

      // if (imageForStep.step1 !== completed) {
        // saveProjectImages( projectMedia, setStatusList, setStep, setGetMediaResponse, step);
      // }
      $(`#whyBuyThisEditIcon`).show();
      $("#loaderForProjectPrev").hide();
    }
  }, [step]);


  const onNextclick = () => {
    if (step != 6 && isMailSent == true) {
      setisMailSent(false);
    }

    if(step === 0){
      if(basicData !== undefined && basicData !== null){
        let prevLocality = basicData.locality && basicData.locality !== "" && basicData.locality < 100000 ? 
          basicData.locality : basicData.customLocality && basicData.customLocality !== "" ? 
          basicData.customLocality : "";

        let newLocality = basicDetails.locality && basicDetails.locality !== "" && basicDetails.locality < 100000 ? 
          basicDetails.locality : basicDetails.customLocality && basicDetails.customLocality !== "" ? 
          basicDetails.customLocality : "";
      
        if(basicData.city !== basicDetails.city || basicData.projName !== basicDetails.projName || prevLocality !== newLocality){
          basicDetails.isImageUrlChanged = "Y";
          setBasicDetails(basicDetails);
        };
      }

      // turn on loader here
      if (isEdit === true) {
        // if (imageForStep.step0 != completed) {
          var latval = document.getElementById("latitude");
          let lngval = document.getElementById("longtitude");

          onChangeBasicDetails( null, "latitude", latval !== undefined && latval != null ? latval.value : null);
          onChangeBasicDetails( null, "longtitude", lngval !== undefined && lngval != null ? lngval.value : null );

          if (
            postprojectValidetory(
              {
                ...basicDetails,
                longtitude: lngval.value,
                latitude: latval.value,
              },
              step,
              setErrorIds,
              phaseArray,
              phasesDateVal,
              phaseDateValidationByid,
              setphaseDateValidationByid,
               SinglePasevalid,
               NamePhaseNoOf,NoOfPhase
            )  
          ){
            saveProjBasicDetails(setPreviousPhase, setProjIdEnc, {...basicDetails,longtitude: lngval.value,latitude: latval.value,}, setStep, step, undefined, phaseArray, setPhaseArray);
          }
      } else {
        var latval = document.getElementById("latitude");
        var lngval = document.getElementById("longtitude");
        onChangeBasicDetails(
          null,
          "latitude",
          latval !== undefined && latval != null ? latval.value : null
        );
        onChangeBasicDetails(
          null,
          "longtitude",
          lngval !== undefined && lngval != null ? lngval.value : null
        );

        if (
            postprojectValidetory(
              {
                ...basicDetails,
                longtitude: lngval.value,
                latitude: latval.value,
              },
              step,
              setErrorIds,
              phaseArray,
              phasesDateVal,
              phaseDateValidationByid,
              setphaseDateValidationByid,
               SinglePasevalid,
               NamePhaseNoOf,
               NoOfPhase
            )
          ) {
          saveProjBasicDetails(setPreviousPhase,
            setProjIdEnc,
            {
              ...basicDetails,
              longtitude: lngval.value,
              latitude: latval.value,
            },
            setStep,
            step,
            "Y",
            phaseArray,
            setPhaseArray
          );
        }
      }
    }

    if (step === 1) {
      if (postprojectValidetory(combinedPropertyDetails, step, setErrorIds, propPricing)) {
        $("#loaderForProjectPropertyPage").show();
        if (isEdit === true) {
          saveProjPropDetails(combinedPropertyDetails, isEdit, setStep);
          savepropPricing(propPricing);
          saveTowerDetails(setTowers, towers, combinedPropertyDetails, undefined);
          
          // setStep(2); 
        } else {
          //save property details
          savepropPricing(propPricing);
          saveProjPropDetails(combinedPropertyDetails, isEdit, setStep);
          saveTowerDetails(setTowers, towers, combinedPropertyDetails, undefined);
        }
      }
    }

    if (step === 2) {
      $("#loaderForProjectPropertyPage").hide();
      // setStep(2);
      if (
        postImagesValidationIsEdit(
          coverImgUrl,
          masterPlanUrl,
          setErrorIds,
          statusList
        )
      ) {
        if (isEdit === true) {
          getSpecificationData(setSpecificationData, setStep, step);

          const allN = statusList.every((status) => status !== "Y");
          $("#loaderForProjectimages").show();
          if (allN) {
            setTimeout(() => {
              // setStep(3);
              onSavingProjectPage(3, projectEncId.get("projId"), setStep);
              $("#loaderForProjectimages").hide();
            }, 500);
          } else {
            saveProjectImages(
              projectMedia,
              setStatusList,
              setStep,
              setGetMediaResponse,
              step
            );
          }
        } else {
          $("#loaderForProjectimages").show();
          if (postprojectValidetory(projectMedia, step, setErrorIds)) {
            saveProjectImages(
              projectMedia,
              setStatusList,
              setStep,
              setGetMediaResponse,
              step
            );
          } else {
            setTimeout(() => {
              $("#loaderForProjectimages").hide();
            }, 500);
          }
        }
      } 
      // else {
      //   console.log("validations failed in post project images");
      // }
    }

    if (step === 3) {
      if (isEdit === true) {
        getAmenitiesData(setAmenitiesData, setCustomAmenities);
        addspecification(specificationData, setStep);
      } else {
        if (postprojectValidetory(specificationData, step, setErrorIds)) {
          addspecification(specificationData, setStep);
        } else {
        }  
      }
    }

    if (step === 4) {
      if(allApprovedByList && allApprovedByList.length === 0){
        getApprovedByDetails(basicDetails.city != undefined && basicDetails.city != null ? basicDetails.city : "", setAllApprovedByList);
      };

      if (isEdit === true) {
        onAddCustomAmenities("save");

        //for highlight
        getBanksDetails(setBankDetailsResponse);
        getSpecificationData(setHighlights, setStep, step);
      } else {
        if (postprojectValidetory(amenitiesData, step, setErrorIds)) {
          addProjectAmenities(amenitiesData, customAmenities, setStep);
        }
      }
    }

    if (step === 5) {
      var el = document.getElementById("_addingInputField");

      if (el !== undefined && el != null) {
        let value = el !== undefined && el != null ? el.value.replace(/\s+/g, " ").trim()  : "";
        //let prevHighlights = [...highlights];
  
        if (value !== "") {       
          if (value.length < 1024) {
            //prevHighlights.push(value)
            highlights.push(value);
            el.value = "";
          }
        };
  
        setHighlights(highlights);
      } 
    
      if (isEdit === true) {
        // if (imageForStep.step1 !== completed) {
        //   saveProjectImages(
        //     projectMedia,
        //     setStatusList,
        //     setStep,
        //     setGetMediaResponse,
        //     step
        //   );
        // }
        if (imageForStep.step2 !== completed) {
          //overview + detailed info of project
          saveProjPropDetails(combinedPropertyDetails, isEdit, setStep);
        }
        if (imageForStep.step3 !== completed) {
          addspecification(specificationData, setStep, step);
        }
        if (imageForStep.step4 !== completed) {
          addProjectAmenities(amenitiesData, customAmenities, setStep, step);
        }
        basicDetails.highlights = highlights;

        if(approvalsIds.length > 0){
          let approvalsIdsString = approvalsIds.join(",");
          basicDetails.projAuthority = approvalsIdsString;
        }else{
          if(basicDetails.projAuthority){
            delete basicDetails.projAuthority;
          }
        }

        if (postprojectValidetory(basicDetails, step, setErrorIds, faqsData)) {
          let name = $("#customBankName").val();
          if(name && name !== ""){
            let prevBankDetail = {...bankDetailsObject};
            setCustomBankNames([...customBankNames, name]);
            prevBankDetail.customBankNames = [...customBankNames, name];
            setBankDetailsObject(prevBankDetail);
          }

          if (faqsObj.faqQuestion !== undefined && faqsObj.faqQuestion !== "" && faqsObj.faqAnswer !== undefined && faqsObj.faqAnswer !== ""){

              let nonDeletedFaqs = faqsData.filter((each)=> (each.isDeleted !== "Y")).length;
              if(nonDeletedFaqs < 10){
                let prevBankDetails = {...bankDetailsObject};

                setFaqsData(prevFaqs => [...prevFaqs, faqsObj]);
                prevBankDetails.faqsData = [...prevBankDetails.faqsData, faqsObj];

                setBankDetailsObject({...prevBankDetails});

                addBanksDetails(prevBankDetails, setBankDetailsResponse);

                setFaqsObj({});
              }else{
                $("#addNewfaqErrMsg").text("Maximum Limit is 10 Exceeded");
              }
              
              getProjPropDetails(setCombinedPropertyDetails);
              addProjectHighlight(basicDetails, setStep, step);

              getProjectMedia( setGetMediaResponse, setStep, setStatusList, setBankDetailsResponse);
              saveProjBasicDetails(null, setProjIdEnc, basicDetails, setStep, step );
          };

          if ((faqsObj.faqQuestion === undefined || faqsObj.faqQuestion === "") && (faqsObj.faqAnswer !== undefined && faqsObj.faqAnswer !== "")) {
            //addNewfaqErrMsg
            $("#addNewfaqErrMsg").text("Please Add Your Question");
            $("#faqQuestion").css("border-color", "#F00");
          }else if((faqsObj.faqAnswer === undefined || faqsObj.faqAnswer === "") && (faqsObj.faqQuestion !== undefined && faqsObj.faqQuestion !== "")){
            //addNewfaqErrMsg
            $("#addNewfaqErrMsg").text("Please Add Your Answer");
            $("#faqAnswer").css("border-color", "#F00")
          }
          
          // If Question or answer Exist Blocking next page...
          if ((faqsObj.faqQuestion === undefined || faqsObj.faqQuestion === "") && (faqsObj.faqAnswer === undefined || faqsObj.faqAnswer === "")){
            addBanksDetails(bankDetailsObject, setBankDetailsResponse);
            getProjectMedia(setGetMediaResponse, setStep, setStatusList, setBankDetailsResponse);
            saveProjBasicDetails( null,setProjIdEnc, basicDetails, setStep, step );
            setBankDetailsObject(bankDetailsObject);

            getProjPropDetails(setCombinedPropertyDetails);
            addProjectHighlight(basicDetails, setStep, step);
          }


        }
      } else {
        basicDetails.highlights = highlights;
        getGroupList(setCommonData, ["state", "rerastatus", "projectstatus"]);
        addProjectHighlight(basicDetails, setStep);
      }
    }
    if (step === 6) {
      $("#loaderForProjectPrev").show();
      sendSuccessMailToBuilder(basicDetails, setisMailSent);
      repeatCounterForMinMax.set("count", 0);
    }
  };

  // useEffect(() => {
    
  //   if (phaseArray != null && phaseArray.length > 0 && NoOfPhase != null && NoOfPhase != "") {
  //     const updatedPhaseDateValidation = [];
  //     phaseArray.map((each, i) => {
  //       if(i < NoOfPhase ||( i ==( NoOfPhase-1))){
  //         if (
  //           each.possassionDate != null &&
  //           each.possassionDate != "" &&
  //           each.launchDate != null &&
  //           each.launchDate != ""
  //         ) {
  //           const dateA =
  //             checkDateFormat(each.possassionDate) == true
  //               ? convertDateofBackend(each.possassionDate)
  //               : parseDateString(each.possassionDate);
  //           const dateB =
  //             checkDateFormat(each.launchDate) == true
  //               ? convertDateofBackend(each.launchDate)
  //               : parseDateString(each.launchDate);
  //           let result =  new Date( dateA) > new Date(dateB);
  //           if (result == false) {
  //             setphasesDateVal(false);
  //           updatedPhaseDateValidation.push(false);
           
  //             if(NoOfPhase === 1){
             
  //               setSinglePasevalid(false)
  //             $("#errmsglaunchDate").text(
  //               "Launch Date Should Before Possession Date"
  //             );
  //             $("#errmsgpossessionDate").text(
  //               "Possession Date Should be after Launch Date"
  //             );
  //             $("#possessionDate").css(
  //               "border",
  //               "0.8px solid var(--Mandatory, #F00)"
  //             );
  //             $("#launchDate").css("border", "0.8px solid var(--Mandatory, #F00)") 
  //             }else{
               

  //               $(`#errmsgLanuchDate_phaseing${i}`).text(
  //                 "Launch Date Should Before Possession Date"
  //               );
  //               $(`#errmsgpossassionDate_phaseing${i}`).text(
  //                 "Possession Date Should be after Launch Date"
  //               );
  //               $(`#possassionDate_phaseing${i}`).css(
  //                 "border",
  //                 "0.8px solid var(--Mandatory, #F00)"
  //               );
  //               $(`#LanuchDate_phaseing${i}`).css(
  //                 "border",
  //                 "0.8px solid var(--Mandatory, #F00)"
  //               );
  //             }
  //           } else {
  //             setphasesDateVal(true);
  //             updatedPhaseDateValidation.push(true);
  //             if(NoOfPhase === 1){
  //               setSinglePasevalid(true)
  //               let index = errorIds.indexOf("conlaunchDate");
  //             if (index !== -1) {
  //               errorIds.splice(index, 1);
  //            }
  //               $("#errmsglaunchDate").text("");
  //               $("#errmsgpossessionDate").text("");
  //               $("#launchDate").css(
  //                 "border",
  //                 "0.8px solid var(--Brand-green-primary, #148B16)"
  //               );
  //               $("#possessionDate").css(
  //                 "border",
  //                 "0.8px solid var(--Brand-green-primary, #148B16)"
  //               );

  //             }else{

  //             $(`#errmsgLanuchDate_phaseing${i}`).text("");
  //             $(`#errmsgpossassionDate_phaseing${i}`).text("");
  //             $(`#LanuchDate_phaseing${i}`).css(
  //               "border",
  //               "0.8px solid var(--Brand-green-primary, #148B16)"
  //             );
  //             $(`#possassionDate_phaseing${i}`).css(
  //               "border",
  //               "0.8px solid var(--Brand-green-primary, #148B16)"
  //             );
  //             }
  //           }
  //         }
  //       }
  //     });

      

  //     setphaseDateValidationByid(updatedPhaseDateValidation);
  //     // if (step != undefined && step != null && step != 1) {
  //     //   let stepKey = `step${step}`;
  //     //   setImageForStep({ ...imageForStep, [stepKey]: current });
  //     // }
  //   }
  // }, [phaseArray, NamePhaseNoOf, NoOfPhase]);

  useEffect(() => {
    
    if (phaseArray != null && phaseArray.length > 0 && NoOfPhase != null && NoOfPhase !== "") {
      const updatedPhaseDateValidation = [];
      phaseArray.map((each, i) => {
        if(i < NoOfPhase ||( i ===( NoOfPhase-1))){
          if (
            each.possassionDate != null &&
            each.possassionDate !== "" &&
            each.launchDate != null &&
            each.launchDate !== ""
          ) {
            const dateA =
              checkDateFormat(each.possassionDate) === true
                ? convertDateofBackend(each.possassionDate)
                : parseDateString(each.possassionDate);
            const dateB =
              checkDateFormat(each.launchDate) === true
                ? convertDateofBackend(each.launchDate)
                : parseDateString(each.launchDate);
            let result =  new Date( dateA) > new Date(dateB);
            if (result == false) {
              setphasesDateVal(false);
            updatedPhaseDateValidation.push(false);
           
              if(NoOfPhase === 1){
                setSinglePasevalid(false)
              $("#errmsglaunchDate").text(
                "Launch Date Should Before Possession Date"
              );
              $("#errmsgpossessionDate").text(
                "Possession Date Should be after Launch Date"
              );
              $("#possessionDate").css(
                "border",
                "0.8px solid var(--Mandatory, #F00)"
              );
              $("#launchDate").css("border", "0.8px solid var(--Mandatory, #F00)") 
              }else{
               

                $(`#errmsgLanuchDate_phaseing${i}`).text(
                  "Launch Date Should Before Possession Date"
                );
                $(`#errmsgpossassionDate_phaseing${i}`).text(
                  "Possession Date Should be after Launch Date"
                );
                $(`#possassionDate_phaseing${i}`).css(
                  "border",
                  "0.8px solid var(--Mandatory, #F00)"
                );
                $(`#LanuchDate_phaseing${i}`).css(
                  "border",
                  "0.8px solid var(--Mandatory, #F00)"
                );
              }
            } else {
              setphasesDateVal(true);
              updatedPhaseDateValidation.push(true);
              if(NoOfPhase === 1){
                setSinglePasevalid(true)
                let index = errorIds.indexOf("conlaunchDate");
              if (index !== -1) {
                errorIds.splice(index, 1);
             }
                $("#errmsglaunchDate").text("");
                $("#errmsgpossessionDate").text("");
                $("#launchDate").css(
                  "border",
                  "0.8px solid var(--Brand-green-primary, #148B16)"
                );
                $("#possessionDate").css(
                  "border",
                  "0.8px solid var(--Brand-green-primary, #148B16)"
                );

              }else{

              $(`#errmsgLanuchDate_phaseing${i}`).text("");
              $(`#errmsgpossassionDate_phaseing${i}`).text("");
              $(`#LanuchDate_phaseing${i}`).css(
                "border",
                "0.8px solid var(--Brand-green-primary, #148B16)"
              );
              $(`#possassionDate_phaseing${i}`).css(
                "border",
                "0.8px solid var(--Brand-green-primary, #148B16)"
              );
              }
            }
          }
        }
      });

      setphaseDateValidationByid(updatedPhaseDateValidation);
      if (step !== undefined && step != null && step !== 1) {
        let stepKey = `step${step}`;
        setImageForStep({ ...imageForStep, [stepKey]: current });
      }
    }
  }, [phaseArray, NamePhaseNoOf, NoOfPhase]);

  const [selectedPropsIds, setSelectedPropsIds] = useState([]);



  useEffect(() => {
      if(
        combinedPropertyDetails !== undefined && Object.keys(combinedPropertyDetails) !== undefined && 
        Object.keys(combinedPropertyDetails).length !== undefined && Object.keys(combinedPropertyDetails).length > 0
      ){
          let selectedPropIds = [];
          let defaultProp = null;

          Object.keys(combinedPropertyDetails).map(each=>{
              if(combinedPropertyDetails[each].length > 0){
                combinedPropertyDetails[each].map(eachItem=>{
                  if(eachItem.phaseId == selectedPhase && !selectedPropIds.includes(each)){
                    if(checkOverViewData(eachItem, eachItem.projType)){
                      selectedPropIds = [...selectedPropIds, parseInt(each)];
                    }
                  }
                })
              }
          });

          // reference to sort array
          let a = [35, 33, 31, 34, 32];
          let sortedArray = [];

          // Create an array of objects containing both values and their corresponding index
          let indexedB = selectedPropIds.map((value, index) => ({ value, index }));

          // Sort indexedB based on the order defined by array a
          indexedB.sort((obj1, obj2) => {
              let index1 = a.indexOf(obj1.value);
              let index2 = a.indexOf(obj2.value);
              return index1 - index2;
          });

          // Extract the sorted values from indexedB
          indexedB.map(obj => {
              if(!sortedArray.includes(obj.value)){
                  sortedArray.push(obj.value);
              }
          });

          selectedPropIds = sortedArray;

          setSelectedPropsIds(selectedPropIds);

          if(propTypeId === null){
            if(selectedPropIds.length > 0){
                defaultProp = selectedPropIds[0];
            }else{
                defaultProp = projectprops.apartment;
            }
          }else{
            defaultProp = propTypeId;
          }

          setPropTypeId(defaultProp);
      }else{
        setPropTypeId(projectprops.apartment);
      }
    
  }, [combinedPropertyDetails, selectedPhase]);

  // Function to set border color based on validation result
  // const setBorderColor = (index, color) => {
  //   $(`#possassionDate_phaseing${index}`).css("border", `0.8px solid ${color}`);
  //   $(`#LanuchDate_phaseing${index}`).css("border", `0.8px solid ${color}`);
  // };
  
    //phases
    const onChnagePhasesinputs = (value, inputId, identifier) => {
      
        let updatedArray;

        switch (identifier) {
          case "PN":
            updatedArray = updatePhaseArray(inputId, "PhaseName", "phaseName", value);
            break;
          case "PD":
            updatedArray = updatePhaseArray(inputId, "possassionDate_phaseing", "possassionDate", value);
            break;
          case "LD":
            updatedArray = updatePhaseArray(inputId, "LanuchDate_phaseing", "launchDate", value);
            break;
          case "CD":
            updatedArray = updatePhaseArray(inputId, "expectedCompletion", "expectedCompletion", value);
            break;
          case "RS":
            updatedArray = updatePhaseArray(inputId, "rera_status_", "reraStatus", value);
            break;
          case "RI":
            updatedArray = updatePhaseArray(inputId, "rera_id_", "reraId", value);
            break;
          default:
            break;
        }

        setPhaseArray(updatedArray);

        if (step && step !== 1) {
          let stepKey = `step${step}`;
          setImageForStep({ ...imageForStep, [stepKey]: current });
        }
    };

    const updatePhaseArray = (inputId, substring, key, value) => {
        const ind = inputId.substring(inputId.indexOf(substring) + substring.length);
        const updatedArray = [...phaseArray];
        let each = updatedArray[parseInt(ind)];
        if(key === "reraStatus" && value === 103 && value === 104){
            each["reraId"] = null;
        }
        if(key === "reraStatus" && value !== 103 && value !== 104){
          each["reraId"] = "";
        }
        if(updatedArray.length <2){
          $(`#${key}`).css("border", "0.8px solid var(--Brand-green-primary, #148B16)");
        }else{
          $(`#${inputId}`).css("border", "0.8px solid var(--Brand-green-primary, #148B16)");
        }
        each[key] = value;
        updatedArray[parseInt(ind)] = each;
        return updatedArray;
    };


  //const [newarray, setNewarray] = useState();

  function onChangePhase(e) {
    setIsEdit(true);
    if(e.target.id  ===  "NoOfPhase"){
      $("#NoOfPhase").css("border-color", "var(--Brand-green-primary, #148B16)");
    }

    let vlaue;
    if (e.target.value === "") {
      vlaue = e.target.value;
    } else {
      vlaue = parseInt(e.target.value);
    }

    if (vlaue === 0) {
      vlaue = 1;
    }

    if (vlaue > 100) {
      return;
    }
    setNamePhaseNoOf(e.target.id)
    setNophasesOfcurrent(vlaue);
    setNoOfPhase(vlaue);
    setPreviousPhase(prev => ({ ...prev, phaseCount: vlaue }));

    setBasicDetails({ ...basicDetails, ["phaseCount"]: vlaue });

    if(vlaue === 1){
      phaseArray[0].phaseName = null;
    }

    let prevCount = phaseArray.length;
    if(vlaue > prevCount){
      let remaining = vlaue - prevCount;

      for (let i = 0; i < remaining; i++) {
        // ading new
        phaseArray.push({ phaseName: null });
      }
      setPhaseArray(phaseArray);
    } else {
    }
  }

  const onchangePropPrice = (value, key, bhk, proptype, removeReq) => {
 
    if (removeReq !== undefined && removeReq != null && removeReq === "Y") {
        let typeData = propPricing != null && propPricing[proptype] != null ? propPricing[proptype] : null ;
        let bhkData = typeData != null && typeData[bhk] != null ? typeData[bhk] : null;

        if (bhkData != null && bhkData.length !== 0) {
            const updatedBhkData = bhkData.map(each => {
                if(each.phaseId === selectedPhase){
                  each.ischange = "Y"
                  each.isActive = "N"
                }
                return each;
              });

            setPropPricing({
                ...propPricing,
                [proptype]: {
                    ...typeData,
                    [bhk]: updatedBhkData
                }
            });
            return;
      }else{
                const newPropPricing = {
                  ...propPricing,
                  [proptype]: {
                    ...propPricing[proptype],
                  },
                };

                delete newPropPricing[proptype][bhk];
                setPropPricing(newPropPricing);
                return;
      }
    }

    if (propPricing !== undefined && propPricing != null) {
      // all proptype price data
          let typeDataObj = propPricing[proptype];

          if (typeDataObj !== undefined && typeDataObj !== null) {
                  let bhkDataList = typeDataObj[bhk];
                  if (bhkDataList !== undefined && bhkDataList != null) {
                    let updatedPropPricing = {
                      ...propPricing,
                      [proptype]: {
                        ...propPricing[proptype],
                        [bhk]: bhkDataList
                          .map((item) =>
                            selectedPhase !== null && item.phaseId === selectedPhase
                              ? { ...item,
                                  [key]: value, 
                                  ischange: "Y",
                                  phaseId: selectedPhase,
                                  isActive: "Y",
                                  bhkId: proptype !== projectprops.plot ? bhk : null,
                                  dimentions : proptype === projectprops.plot ? bhk : null,
                                  proptypeId: proptype,
                                }
                              : item
                          )
                          .concat(
                            !bhkDataList.some(
                              (item) =>
                                selectedPhase !== null && item.phaseId === selectedPhase
                            )
                              ? [
                                  {
                                    [key]: value,
                                    ischange: "Y",
                                    phaseId: selectedPhase,
                                    isActive: "Y",
                                    bhkId: proptype !== projectprops.plot ? bhk : null,
                                    dimentions : proptype === projectprops.plot ? bhk : null,
                                    proptypeId: proptype,
                                  },
                                ]
                              : []
                          ),
                      },
                    };

                    setPropPricing(updatedPropPricing);
                  } else {
                              setPropPricing({
                                  ...propPricing,
                                    [proptype]: {
                                      ...propPricing[proptype],
                                          [bhk]: [
                                            {
                                              [key]: value,
                                              ischange: "Y",
                                              phaseId: selectedPhase,
                                              isActive: "Y",
                                            },
                                          ],
                                    },
                              });
                  }
            } else {
                

                setPropPricing({
                    ...propPricing,
                    [proptype]: {
                        [bhk]: [
	                          {
	                            [key]: value,
	                            ischange: "Y",
	                            phaseId: selectedPhase,
	                            isActive: "Y",
	                          },
                        ],
                    },
                });

            }
    } else {
        setPropPricing({
            [proptype]: {
                bhk: {
                  [key]: value,
                  ischange: "Y",
                  phaseId: selectedPhase,
                  isActive: "Y",
                },
            },
        });
    }
  };

  const onAddCustomAmenities = (identifier, value) => {
      switch(identifier){
          case "text":
              setNewCustomAmenity(value);
              $("#addCustomAmenity").css("border-color", "#C9C9C9");
              $("#customAmenityErrMessage").text("");
              break;
          case "add":
              if (newCustomAmenity !== "") {
                  if(!customAmenities.includes(newCustomAmenity)){
                      setCustomAmenities((prevAmenities) => {
                        const updatedAmenities = [...prevAmenities, newCustomAmenity.slice(0, 100)];
                        $("#customAmenityErrMessage").text("");
                        $("#addCustomAmenity").css("border-color", "#C9C9C9");
                        return updatedAmenities;
                      });
                      setNewCustomAmenity("");
                  }else{
                      setNewCustomAmenity("");
                      $("#customAmenityErrMessage").text("Sorry it's already exist!");
                      $("#addCustomAmenity").css("border-color", "#F00");
                  }
              }else{
                  $("#addCustomAmenity").css("border-color", "#F00");
                  $("#customAmenityErrMessage").text("Please enter Custom Amenity before adding");
              }
              break;
          case "save":
              let prevAme = [...customAmenities]
              if (newCustomAmenity !== "" && !customAmenities.includes(newCustomAmenity)) {
                  prevAme = [...prevAme, newCustomAmenity.slice(0, 100)];
                  setCustomAmenities(prevAme);
              };

              addProjectAmenities(amenitiesData, prevAme, setStep);
              setNewCustomAmenity("");
              break;
          case "delete":
              setCustomAmenities((prevAmenities) => {
                  const updatedAmenities = prevAmenities.filter(each => each !== value);
                  return updatedAmenities;
              });
              break;
          default:
            return ""
      }

  };

  const goToNextPage = () => {
      let newPhaseArray = [];
      phaseArray.map(eachOne=>{
        if(!previousPhase.deletedPhaseIds.includes(eachOne.phaseId)){
          newPhaseArray = [...newPhaseArray, eachOne]
        }
      })
      setPreviousPhase(prev => ({...prev, phaseCount: NoOfPhase, phaseArray: newPhaseArray, isOpen: false, isNewPhase: true, deletedPhaseIds:[] }));
      
      setPhaseArray(prevObjs => {
        prevObjs = newPhaseArray
        return prevObjs;
      });
      
      setTimeout(()=>{
        onNextclick();
      }, 100);
  };


  const onDeletePhase=(e, phase, index)=>{
    let name = e && e.target && e.target.name ? e.target.name : "";

    switch(name){
        case "OPEN":
            if(previousPhase.phaseCount === NoOfPhase || previousPhase.isNewPhase){
                onNextclick();
                setPreviousPhase(prev => ({...prev, phaseCount: NoOfPhase, phaseArray: phaseArray, isOpen: false, isNewPhase: true, deletedPhaseIds:[] }));
            }else{
                // Checking the phase data is exist or not...
                if(combinedPropertyDetails && Object.keys(combinedPropertyDetails) !== undefined && Object.keys(combinedPropertyDetails).length && Object.keys(combinedPropertyDetails).length > 0){
                    let allPhasesData = [];

                    Object.keys(combinedPropertyDetails).map(eachObj=>{
                      allPhasesData = [...allPhasesData, ...combinedPropertyDetails[eachObj]];
                    });

                    let idsHaveData = allPhasesData.map(eachId=>eachId.phaseId);
                    let result = false;

                    previousPhase.deletedPhaseIds.map(eachPId => {
                        if(idsHaveData.includes(eachPId)) result = true;
                    });

                    if(result){
                      setPreviousPhase(prev => ({ ...prev, isOpen: true }));
                      console.log("if phases Have data");
                    }else{
                      console.log("if phases Have no data but exist in data base");
                      if(!previousPhase.isNewPhase && previousPhase.deletedPhaseIds !== undefined && previousPhase.deletedPhaseIds.length > 0){
                          deletingPhases(previousPhase.deletedPhaseIds, goToNextPage);
                      };
                    }
                }else{
                  // if phase exist in data base but no properties
                  goToNextPage();
                }
            };
            break;
        case "CLOSE":
            setBasicDetails(prev=>({...prev, phaseCount: previousPhase.phaseCount }))
            setPhaseArray(previousPhase.phaseArray);
            setNoOfPhase(previousPhase.phaseCount);
            setPreviousPhase(prev => ({ ...prev, isOpen: false, isNewPhase: true, deletedPhaseIds:[] }));
            break;
        case "phaseDelete":
            setNoOfPhase(prev=> prev - 1);
            setBasicDetails(prevObj => ({...prevObj, phaseCount : prevObj.phaseCount - 1 }));
        
            let newArray = phaseArray.filter((_, ind)=> ind !== index );
        
            if(phase.phaseId !== undefined){
              // if the phase is already existed in Database
              newArray.push(phase);
              setPreviousPhase(prev => ({ ...prev, isNewPhase: false, deletedPhaseIds: [...prev.deletedPhaseIds, phase.phaseId] }));
              
              // Calling over view API here...
              // if(Object.keys(combinedPropertyDetails).length === 0){
              getProjPropDetails(setCombinedPropertyDetails);

            }else{
              // if the phase in newly added
              setPreviousPhase(prev => ({ ...prev, isNewPhase: true }));
            };
        
            setPhaseArray(newArray);
            break;
        case "NO":
            // If "No" update all states to previous states
            setBasicDetails(prev=>({...prev, phaseCount: previousPhase.phaseCount }))
            setPhaseArray(previousPhase.phaseArray);
            setNoOfPhase(previousPhase.phaseCount);
            setPreviousPhase(prev => ({ ...prev, isOpen: false, isNewPhase: true, deletedPhaseIds:[] }));
            break;
        case "YES":
            // call delete phases API Here... before calling onNextclick()...
            if(previousPhase.deletedPhaseIds !== undefined && previousPhase.deletedPhaseIds.length > 0){
                deletingPhases(previousPhase.deletedPhaseIds, goToNextPage);
            };
            break;
        case "clear":
            setPhaseArray((prevObjs)=>{
                let prevPhases = [...prevObjs];
                let newObj = {};

                if(prevPhases[index].phaseId === undefined){
                  newObj = {};
                }else{
                  newObj = {phaseId: prevPhases[index].phaseId}
                }

                prevPhases[index] = newObj;
                return prevPhases;
            })
            break;
        default:
            return ""
    }
  };

  

  return (
    <div className="postProjectMainContainer">

        {previousPhase.isOpen &&
        <DeletePhasesPopup onSelect={onDeletePhase} />
        }

        {isLoggedin === "Y" && userType === "B" && activeStatus !== "Y" &&
        <UserDeactivatedPage key="userDeactivatePageDashboard" />
        }

        <LeftSideTrackingCon
          imageForStep={imageForStep}
          trackeForProject={trackeForProject}
        />

        <div className="bottomDetailsMainContainer" style={{display: step === 0 ? "flex" : "none"}}>
            <Fragment>
                <div className="staticHeadingTextsCon">Project details</div>
                <ProjectDetails
                    data={basicDetails}
                    onChange={onChangeBasicDetails}
                    setLocality={setLocality}
                    onChangePhase={onChangePhase}
                    phaseArray={phaseArray}
                    setPhaseArray={setPhaseArray}
                    NoOfPhase={NoOfPhase}
                    onDeletePhase={onDeletePhase}
                    onChnagePhasesinputs={onChnagePhasesinputs}
                    locality={locality}
                    setCities={setCities}
                    city={city}
                    setIsEdit={setIsEdit}
                    setBasicDetails={setBasicDetails}
                />
            </Fragment>
        </div>
        
        {step !== 0 &&
        <div className="bottomDetailsMainContainer">
            {step === 1 &&
            <Fragment>
                <div className="staticHeadingTextsCon HeaderOfPostPropertiesDetails">
                  Property Details
                  {phaseArray !== undefined &&
                    phaseArray != null &&
                    phaseArray.length !== undefined &&
                    phaseArray.length > 1 && basicDetails.phaseCount && basicDetails.phaseCount !== 1 && (
                        <p className="phasesMessageTop">
                          {handPointUp2}
                          Currently you’re filling details for Phase <span id="phaseNumberText"> {phaseArray[0].phaseName} </span>
                        </p>
                  )}

                </div>
                <PropertyDetails
                  data={basicDetails}
                  onNextclick={onNextclick}
                  propertyTypeDetails={[]}
                  idValidatar={idValidatar}
                  setCombinedPropertyDetails={setCombinedPropertyDetails}
                  combinedPropertyDetails={combinedPropertyDetails}
                  tableData={propertyTypeDetails}
                  setTableData={setPropertyTypeDetails}
                  propPricing={propPricing}
                  onChangePropPricing={onchangePropPrice}
                  towers={towers}
                  setTowers={setTowers}
                  setNoofTower={setNoofTower}
                  NoOfPhase={NoOfPhase}
                  phaseArray={phaseArray}
                  setvillamenttower={setvillamenttower}
                  propTypeId={propTypeId}
                  setSelectedPhase={setSelectedPhase}
                  selectedPhase={selectedPhase}
                  setPropTypeId={setPropTypeId}
                  setPropPricing={setPropPricing}
                  NophasesOfcurrent={NophasesOfcurrent}
                  projIdEnc={projIdEnc}
                  selectedPropsIds={selectedPropsIds}
                  apartmentTypeList={apartmentTypeList}
                  tableLoader={tableLoader}
                  cityName={getUnit(basicDetails.city, city)}
                  localityName={basicDetails.locality && basicDetails.locality !== "" && basicDetails.locality < 100000 ? 
                                getUnit(basicDetails.locality, locality) : basicDetails.customLocality && basicDetails.customLocality !== "" ? 
                                basicDetails.customLocality : "" 
                              }
                />
            </Fragment>
            }
        
            {step === 2 && 
            <Fragment>
                <div className="staticHeadingTextsCon">Project Images</div>
                <ProjectImages
                  onNextclick={onNextclick}
                  projectMedia={projectMedia}
                  setStatusList={setStatusList}
                  statusList={statusList}
                  setImageForStep={setImageForStep}
                  imageForStep={imageForStep}
                  step={step}
                  getMediaResponse={getMediaResponse}
                  isEdit={isEdit}
                  setMasterPlanUrl={setMasterPlanUrl}
                  masterPlanUrl={masterPlanUrl}
                  setCoverImgUrl={setCoverImgUrl}
                  coverImgUrl={coverImgUrl}
                  walkThroughUtube={walkThroughUtube}
                  setWalkThroughUtube={setWalkThroughUtube}
                  projectUtube={projectUtube}
                  setProjectUtube={setProjectUtube}
                />
            </Fragment>
            }

            {step === 3 &&
            <Fragment>
                <div className="staticHeadingTextsCon">Specifications</div>
                <Specifications
                  data={basicDetails}
                  onNextclick={onNextclick}
                  onChange={onChangeBasicDetails}
                  specificationData={specificationData}
                  isEdit={isEdit}
                  setSpecificationData={setSpecificationData}
                  setspecificationprev={setspecificationprev}
                  errorIds={errorIds}
                />
            </Fragment>
            }

            {step === 4 && 
            <Fragment>
                <div className="staticHeadingTextsCon">Amenities</div>
                <Amenities
                  key="postProjectAmenities"
                  onNextclick={onNextclick}
                  amenitiesFromDB={amenitiesFromDB}
                  amenitiesData={amenitiesData}
                  setAmenitiesData={setAmenitiesData}
                  customAmenities={customAmenities}
                  isEdit={isEdit}
                  errorIds={errorIds}
                  onAddCustomAmenities={onAddCustomAmenities}
                  newCustomAmenity={newCustomAmenity} 
                />
            </Fragment>
            }

            {step === 5 &&
            <Fragment>
                <div className="staticHeadingTextsCon">Why Buy This Project?</div>
                <WhyBuyThisProject
                  data={basicDetails}
                  onNextclick={onNextclick}
                  onChange={onChangeBasicDetails}
                  setHighlights={setHighlights}
                  highlights={highlights}
                  errorIds={errorIds}
                  bankDetailsObject={bankDetailsObject}
                  setBankDetailsObject={setBankDetailsObject}
                  bankDetailsResponse={bankDetailsResponse}
                  commonData={commonData}
                  file={file}
                  setFile={setFile}
                  fileUrl={fileUrl}
                  setFileUrl={setFileUrl}
                  banKIds={banKIds}
                  setBankIds={setBankIds}
                  customBankNames={customBankNames}
                  setCustomBankNames={setCustomBankNames}
                  faqsData={faqsData}
                  setFaqsData={setFaqsData}
                  setFaqsObj = {setFaqsObj}
                  faqsObj= {faqsObj}
                  approvalsIds={approvalsIds}
                  setApprovalsIds={setApprovalsIds}
                  allApprovedByList={allApprovedByList}
                  phaseArray={phaseArray}
                  setPhaseArray={setPhaseArray}
                />
            </Fragment>
            }

            {step === 6 && 
            <Fragment>
                <div className="staticHeadingTextsCon">Preview</div>
                <PostProjectPreviewPage
                  onNextclick={onNextclick}
                  data={basicDetails}
                  projectMedia={getMediaResponse}
                  specificationData={specificationprev}
                  amenitiesData={amenitiesData}
                  customAmenities={customAmenities}
                  setStep={setStep}
                  city={city}
                  locality={locality}
                  propertyTypeDetails={propertyTypeDetails}
                  combinedPropertyDetails={combinedPropertyDetails}
                  amenitiesFromDB={amenitiesFromDB}
                  commonData={commonData}
                  idValidatar={idValidatar}
                  isMailSent={isMailSent}
                  phaseArray={phaseArray}
                  bankDetailsObject={bankDetailsObject}
                  propPricing={propPricing}
                  noOfTower={noOfTower}
                  towers={towers}
                  allApprovedByList={allApprovedByList}
                  apartmentTypeList={apartmentTypeList}
                />
            </Fragment>
            }
        </div>
        }
    </div>
  );
};

export default RightSideContainer;

