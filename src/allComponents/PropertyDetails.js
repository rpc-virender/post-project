import React, { useState, useEffect, Fragment, memo } from "react";
import $ from 'jquery';
import { createPopper } from '@popperjs/core';

import '../styles/postPojectPropertyDetails.css';

import SingleButton from "../commonComponents/SingleButton";
import { propertyDetailsTypes, projectprops, itemScrollIntoView, csvLoader } from "../images/commonImages";

import { deleteAllUnits, generateCsvFromS3, saveProjPropDetails, savePropType, uploadCsv } from "../apis/postApi";
import Loader from "../commonComponents/Loader";
import ImagesRenderingPopup from "../commonComponents/ImagesRenderingPopup";
import { getGroupList } from "../apis/cityAndStateApi";
import { saveTowerDetails } from "../apis/postApi";
import CsvUploadComponent from "../commonComponents/CsvUploadComponent";
import CsvInstructionsBox from "../commonComponents/CsvInstructionsBox";
import DeleteUnitsPopup from "./propDetailsComponents/DeleteUnitsPopup";
import PropertyOverviewComponent from "./propDetailsComponents/PropertyOverviewComponent";
import PropertyDetailsInputsPopup from "./propDetailsComponents/propertyDetailsInputsPopup";
import PropertiesFeedingBlock from "./propDetailsComponents/PropertiesFeedingBlock";
import PropertyTypeTable from "./propDetailsComponents/PropertyTypeTable";
import DetailsPreviewPopup from "./propDetailsComponents/DetailsPreviewPopup";

const PropertyDetails = ({ data, onNextclick, propertyTypeDetails, idValidatar, NoOfPhase, phaseArray, combinedPropertyDetails, 
  setCombinedPropertyDetails, tableData, setTableData, propPricing, onChangePropPricing, towers, setTowers, setNoofTower,
                            setvillamenttower, selectedPhase, setSelectedPhase, propTypeId, setPropTypeId, setPropPricing, NophasesOfcurrent,
                            projIdEnc, selectedPropsIds, apartmentTypeList, tableLoader, localityName, cityName
                        }) => {
                          
  const allKeys = [...propertyDetailsTypes.keys()];

  const [newCombinedList, setNewCombinedList] = useState([]);
  const [overview, setOverview] = useState({});
  const [previewPopup, setPreviewPopup] = useState("none");
  const [previewData, setPreviewData] = useState({});
  const [rows, setRows] = useState([]);
  const [floors, setFloors] = useState([]);
  const [bathRooms, setBathRooms] = useState([]);
  const [bhktypeData, setBhktypeData] = useState({});
  const [csvFile, setCsvFile] = useState(null);
  const [isEditTower, setIsEditTower] = useState(false);
  const [isEditOverview, setIsEditOverview] = useState(false);
  const [csvUploadRes, setCsvUploadRes] = useState({ response: false, isCsvPopup: false, csvErrorMsg: "", loader: false, totalUnits:0 });
  const [isDetailsPopup, setIsDetailsPopup] = useState(false);


  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
          const content = e.target.result;
          const rows = content.split(/\r?\n/);
          const hasHeaders = true;
          const count = hasHeaders ? rows.length - 1 : rows.length;
          const maxRowsCount = 3000;
          if(count <= maxRowsCount){
              setCsvFile(file);
          }else{
              setCsvUploadRes(prev=> ({...prev, csvErrorMsg: `Maximum ${maxRowsCount} units can be added at a time` }));
              setTimeout(()=>{
                  setCsvUploadRes(prev=> ({...prev, csvErrorMsg: "" }));
              },3000);
          }
      };
      // Read the file as text
      reader.readAsText(file);
    }
  };

  const onCsvFunction = (identifier, e) => {
    switch(identifier){
      case "open":
        if (checTowerAndOverViewData(overview, propTypeId) === true) {
          // setIsCsvPopup(true);
          setCsvUploadRes(prev=> ({...prev, isCsvPopup: true }));
        }
        break;
      case "close":
        setCsvFile(null);
        setCsvUploadRes(prev=> ({...prev, response: false, isCsvPopup: false, csvErrorMsg: "" }));
        break;
      case "upload":
        setCsvUploadRes(prev=> ({...prev, csvErrorMsg: "" }));
        setCsvFile(null);
        let file = e.target.files[0];
        handleFileUpload(file);
        break;
      case "submit":
        const formData = new FormData();
	      formData.append('file', csvFile);
        uploadCsv(selectedPhase, propTypeId, formData, setCsvFile, setTableData, setCsvUploadRes);
        // itemScrollIntoView("tableFloorplansHeader");
        break;
      case "remove":
        setCsvFile(null);
        break; 
      case "download":
          generateCsvFromS3(propTypeId, 
            overview !== undefined && overview !== null && overview.noOfTower !== undefined && overview.noOfTower !== 0 && 
            (propTypeId === projectprops.apartment || propTypeId === projectprops.villament)
            ? overview.noOfTower : undefined
          );
        break;
      default:
        return "";
    }
  }


  const plotFacing = [ "North", "South", "East", "West"];
  const openParking = ["None", "Open", "Covered"];

  const [groundFloors, setGroundFloors] = useState([]);
  const [basementFloors, setBasementFloors] = useState([]);
  const [imgpopUpbtnName, setImgpopUpbtnName] = useState("Close");
  const [filteredTableData, setFilteredTableData] = useState([]);

  //  pop data
  const [editPopUpData, setEditpopUpData] = useState({});
  const [isPopupDisplayed,setIsPopupDisplayed] = useState(false);

  const [selectedFilteredBhk, setSelectedFilteredBhk] = useState(null);

  useEffect(() => {
    makeFloors(20, setRows, undefined, 0);
    makeFloors(20, setBathRooms, undefined, 1);
    makeFloors(9, setFloors, undefined, 0);
    makeFloors(10, setGroundFloors, "G", 1);
    makeFloors(10, setBasementFloors, "B", 1);
    getGroupList(setBhktypeData, ["bhktype", "facing"]);
    setNoofTower(
      combinedPropertyDetails != undefined && combinedPropertyDetails != null
        ? combinedPropertyDetails[projectprops.apartment] !== undefined &&
          combinedPropertyDetails[projectprops.apartment] != null &&
          combinedPropertyDetails[projectprops.apartment].noOfTower !== undefined &&
          combinedPropertyDetails[projectprops.apartment].noOfTower !== null
          ? combinedPropertyDetails[projectprops.apartment].noOfTower
          : 0
        : 0
    );
    setvillamenttower(
      combinedPropertyDetails != undefined && combinedPropertyDetails != null
        ? combinedPropertyDetails[projectprops.villament] !== undefined &&
          combinedPropertyDetails[projectprops.villament] != null &&
          combinedPropertyDetails[projectprops.villament].noOfTower !== undefined &&
          combinedPropertyDetails[projectprops.villament].noOfTower !== null
          ? combinedPropertyDetails[projectprops.villament].noOfTower
          : 0
        : 0
    );
  }, []);


  useEffect(() => {
    let data = [];

    if (propTypeId != null && tableData[propTypeId] != null && tableData[propTypeId].length > 0 ) {
      tableData[propTypeId].map((each) => {
        if (selectedPhase != null) {
          if (each.phaseId === selectedPhase) {
            data.push(each);
          }
        } else {
          data.push(each);
        }
      });
    }

    setFilteredTableData(data);
    
  }, [tableData, propTypeId, selectedPhase]);


  useEffect(() => {
    if (previewPopup !== "none") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "none";
    }
  }, [previewPopup]);

  useEffect(() => {
    setOverview({});
    let allIds = ["landArea", "basePrice", "noOfUnit", "noOfTower" ];
    let otherIds = ["towerName", "basement", "groundAndStiltNOoOfFloors" ];

    allIds.map(eachId=>{
      if($(`#${eachId}_${propTypeId}`).val() === ""){
        $(`#${eachId}_${propTypeId}`).css("border-color", "var(--GREY4, #C9C9C9)");
      }else{
        $(`#${eachId}_${propTypeId}`).css("border-color", "var(--Brand-green-primary, #148B16)");
      }
    })

    towers.map((each, i) => {
      otherIds.map((eachId) => {        
        if($(`#${eachId}_${i}`).val() === ""){
          $(`#${eachId}_${i}`).css("border-color", "var(--GREY4, #C9C9C9)");
        }else{
          $(`#${eachId}_${i}`).css("border-color", "var(--Brand-green-primary, #148B16)");
        }
      });
    });

    if (
      propTypeId != null &&
      selectedPhase != null &&
      combinedPropertyDetails != null &&
      Object.keys(combinedPropertyDetails).length > 0
    ) {
      if (
        combinedPropertyDetails[propTypeId] != null &&
        combinedPropertyDetails[propTypeId].length !== 0
      ) {
        combinedPropertyDetails[propTypeId].map((each) => {
          if (each.phaseId === selectedPhase) {
            setOverview(each);
          }
        });
      }
    } else if (
      propTypeId != null &&
      selectedPhase == null &&
      combinedPropertyDetails != null &&
      Object.keys(combinedPropertyDetails).length > 0
    ) {
      if (combinedPropertyDetails[propTypeId] != null) {
        setOverview(combinedPropertyDetails[propTypeId][0]);
      }
    }
  }, [propTypeId, selectedPhase, combinedPropertyDetails]);


  const removeFormFromString = (str) => {
    return str.replace(/Form/g, "");
  };

  const showIfPricingValidationsFailed = (proptype, phaseId) => {
    $("#MaxAndMinErrMsgOverview").show();
    $("#MaxAndMinErrMsgOverview").text("*Please provide the applicable minimum and maximum values");
    setTimeout(()=>{
      $("#MaxAndMinErrMsgOverview").hide();
    },2000);

    getPhase(phaseId, { id: proptype });

  };

  const scrollIntoViewItems = (id) => {
      let element=document.getElementById(id);
			if(element) {
				  element.scrollIntoView();
			}
  }

  const validFof = (proptype) => {
    let status = true;
    let propertiesAddedAll = tableData[proptype];
    let pricinginDataAll = propPricing[proptype];
    phaseArray && phaseArray.forEach(phase => {

      if (status === false) {
        return false;
      }

      let currentPhaseId = phase.phaseId;
      let propertiesAdded = propertiesAddedAll ? propertiesAddedAll.filter(each => each.phaseId === currentPhaseId) : [];
      // 
      let pricinginData = [];
      let pricingBhk = []
      pricinginDataAll && Object.keys(pricinginDataAll).length > 0 && Object.keys(pricinginDataAll).forEach(each => {

        pricinginDataAll[each] && pricinginDataAll[each].forEach(priceEach => {
          if (priceEach.phaseId === currentPhaseId) {
            pricinginData.push(priceEach);
            pricingBhk.push(each + "");
          }
        });
      });


      if (
        propertiesAdded !== undefined &&
        propertiesAdded != null &&
        propertiesAdded.length > 0
      ) {
        let bhkList = [];

        propertiesAdded.forEach((each) => {
          let bhk = proptype === projectprops.plot ? each.length + "_" + each.width : each.bhk + "";
          if (
            bhk !== undefined &&
            bhk != null &&
            !bhkList.includes(bhk)
          ) {
            bhkList.push(bhk);
          }
        });



        bhkList.forEach((bhk) => {
          if (!pricingBhk.includes(bhk + "")) {
            // const showIfPricingValidationsFailed =(bhk,proptype,phaseId,status)
            status = false;
            
            showIfPricingValidationsFailed(proptype, currentPhaseId);
            $(`#min_price_border_${bhk+""}_${proptype+""}_${currentPhaseId+""}`).css("border-color", "#F00");
            $(`#max_price_border_${bhk+""}_${proptype+""}_${currentPhaseId+""}`).css("border-color", "#F00");
            
            scrollIntoViewItems(`min_price_border_${bhk}_${proptype}_${currentPhaseId+""}`);
            scrollIntoViewItems(`max_price_border_${bhk}_${proptype}_${currentPhaseId+""}`);

            return status;
          }
        });


        pricinginData.forEach((each) => {
          if(each.isActive != null && each.isActive !== "N"){
              if ((each.minPrice === undefined || each.minPrice == null || each.minPrice === 0 || (each.minPrice + "").trim() === "")) {
                  status = false;
                  setTimeout(()=>{
                      showIfPricingValidationsFailed(proptype, currentPhaseId);
                      scrollIntoViewItems(`min_price_border_${each.bhkId != null ? each.bhkId : each.dimentions }_${each.proptypeId}_${each.phaseId+""}`);
                      $(`#min_price_border_${each.bhkId != null ? each.bhkId : each.dimentions }_${each.proptypeId}_${each.phaseId+""}`).css("border-color", "#F00"); 
                  },200);
                  return status;
                }
                else if ((each.maxPrice === undefined || each.maxPrice == null || each.maxPrice === 0 || (each.maxPrice + "").trim() === "")) {
                  status = false;
                  setTimeout(()=>{
                      showIfPricingValidationsFailed(proptype, currentPhaseId);
                      scrollIntoViewItems(`max_price_border_${each.bhkId != null ? each.bhkId : each.dimentions}_${each.proptypeId}_${each.phaseId+""}`)
                      $(`#max_price_border_${each.bhkId != null ? each.bhkId : each.dimentions}_${each.proptypeId}_${each.phaseId+""}`).css("border-color", "#F00"); 
                  },200);
                  return status;
                } else if (parseInt(each.maxPrice) <= parseInt(each.minPrice)) {
                  status = false;
                  setTimeout(()=>{
                      showIfPricingValidationsFailed(proptype, currentPhaseId);
                      scrollIntoViewItems(`max_price_border_${each.bhkId != null ? each.bhkId : each.dimentions}_${each.proptypeId}_${each.phaseId+""}`)
                      $(`#max_price_border_${each.bhkId != null ? each.bhkId : each.dimentions}_${each.proptypeId}_${each.phaseId+""}`).css("border-color", "#F00"); 
                      $(`#min_price_border_${each.bhkId != null ? each.bhkId : each.dimentions}_${each.proptypeId}_${each.phaseId+""}`).css("border-color", "#F00"); 
                      $(`#maxAndMinPriceErrMsg_${each.bhkId != null ? each.bhkId : each.dimentions}`).show();
                  },200);
                  return status;
                }
          }
        });


        if (status === false) {
          return false;
        }
      }
    });

    return status;

    // overview data
  };

  const isAnyData = (each) => {
      const isNull = (val) => (val === null || val === undefined || val === "");

      if(each){
          let ifNoDAta = (each.projType === projectprops.apartment || each.projType === projectprops.villament) ?
          (
            isNull(each.noOfUnit) &&
            isNull(each.landArea) &&
            isNull(each.basePrice) &&
            isNull(each.noOfTower) 
          ):(
            isNull(each.noOfUnit) &&
            isNull(each.landArea) &&
            isNull(each.basePrice)
          );

          let ifAnyData = (each.projType === projectprops.apartment || each.projType === projectprops.villament) ?
          (
            !isNull(each.noOfUnit) ||
            !isNull(each.landArea) ||
            !isNull(each.basePrice) ||
            !isNull(each.noOfTower)
          ):(
            !isNull(each.noOfUnit) ||
            !isNull(each.landArea) ||
            !isNull(each.basePrice)
          );

          // if no data
          if(ifNoDAta){
            return false;
          }

          // any one data
          if(ifAnyData){
              let finalCheck = (each.projType === projectprops.apartment || each.projType === projectprops.villament) ?
                (
                  isNull(each.noOfUnit) ||
                  isNull(each.landArea) ||
                  isNull(each.basePrice) ||
                  isNull(each.noOfTower)
                ):(
                  isNull(each.noOfUnit) ||
                  isNull(each.landArea) ||
                  isNull(each.basePrice) 
              );

            return finalCheck;
          }
      }else{
        return false;
      };
  
  };

  const isDeletedOverView = () => {
    let isProperData = true;

    Object.values(combinedPropertyDetails).flat().some(each => {
        const isNull = (val) => (val === null || val === undefined || val === "");

        // if all are empty no data, so allow to next page
        // let isAnyData = !(
        //     isNull(each.noOfUnit) == true &&
        //     isNull(each.landArea) == true &&
        //     isNull(each.basePrice) == true &&
        //     (each.projType == projectprops.apartment || each.projType == projectprops.villament) ? isNull(each.noOfTower) : true == true
        // );

        if (isAnyData(each)) {
            // const isUnitsRemaining = Object.values(tableData).flat().some(eachUnit => eachUnit.phaseId == each.phaseId && eachUnit.propType == each.projType);

            isProperData = false;
            getPhase(each.phaseId,{ id: each.projType });
            $("#MaxAndMinErrMsgOverview").text("Overview data is not present either fill the data or delete the associated data to save other data");
            $("#MaxAndMinErrMsgOverview").show();

            if(isNull(each.basePrice)){
              itemScrollIntoView(`basePrice_${each.projType}`);
              $(`#basePrice_${each.projType}`).css("border-color", "#F00");
            };

            if(isNull(each.landArea)){
              itemScrollIntoView(`landArea_${each.projType}`);
              $(`#landArea_${each.projType}`).css("border-color", "#F00");
            };

            if((each.projType == projectprops.apartment || each.projType === projectprops.villament) ? isNull(each.noOfTower) : false){
              itemScrollIntoView(`noOfTower_${each.projType}`);
              $(`#noOfTower_${each.projType}`).css("border-color", "#F00");
            };

            if(isNull(each.noOfUnit)){
              itemScrollIntoView(`noOfUnit_${each.projType}`);
              $(`#noOfUnit_${each.projType}`).css("border-color", "#F00");
            };
            
            setTimeout(()=>{
              $("#MaxAndMinErrMsgOverview").hide();
            },3000);
        }

        return isProperData; 
    });


    return isProperData;
};



const towerEmptyValidation = (tower,count)=>{
  let towersListForValidation=["towerName", "totalFloor", "elevationBasement", "elevationStilt", "elevationGround", "groundAndStilt"]
  let IsValidToSave=true;
      const each = tower;
      for (let j = 0 ; j < towersListForValidation.length ;j++) {
          const keyOftowerArray = towersListForValidation[j];
          if (keyOftowerArray === "elevationStilt" || keyOftowerArray === "elevationGround" || keyOftowerArray === "groundAndStilt") {
              if(tower.elevation !== undefined && tower.elevation !== ""){
                const elevationValue = each[tower.elevation] != null ? each[tower.elevation] : null;
                if(elevationValue === null || elevationValue === ""){
                    IsValidToSave = false;
                    $("#elevationTypedropdown_" + count).css("border-color", "#F00");
                    scrollIntoViewItems("elevationTypedropdown_" + count);
                    setTimeout(()=>{
                      $("#elevationTypedropdown_" + count).css("border-color", "#c9c9c9");
                    }, 2000);
                };
              }else{
                if (Object.keys(each).includes(keyOftowerArray)) {
                  const elevationValue = each[keyOftowerArray] != null ? each[keyOftowerArray] : null;
                  if(elevationValue === null || elevationValue === ""){
                      IsValidToSave = false;
                      $("#elevationAndFloorCon_" + count).css("border-color", "#F00");
                      $("#groundAndStiltNOoOfFloors_" + count).css("border-color", "#F00");
                      
                      scrollIntoViewItems("elevationAndFloorCon_" + count);
                      setTimeout(()=>{
                        $("#elevationAndFloorCon_" + count).css("border-color", "#c9c9c9");
                        $("#groundAndStiltNOoOfFloors_" + count).css("border-color", "#c9c9c9");
                      }, 2000);
                  };
                }
              };

          }else if(keyOftowerArray === "elevationBasement"){
              const value=each[keyOftowerArray] != null ? each[keyOftowerArray] : null; 
              if(value === null || value === undefined || value === ""){
                  IsValidToSave = false;
                  $("#basement_" + count).css("border-color", "#F00");
                  scrollIntoViewItems("basement_" + count);
                  setTimeout(()=>{
                    $("#basement_" + count).css("border-color", "#c9c9c9");
                  }, 2000);
              }
          }else{
              const valueOfTower=each[keyOftowerArray] != null ? each[keyOftowerArray] : null; 
              if (valueOfTower === undefined || valueOfTower === null || valueOfTower === "" || valueOfTower === 0) {
                  IsValidToSave = false;
                  if(keyOftowerArray === "towerName"){
                    $("#towerName_" + count).css("border-color", "#F00");
                    scrollIntoViewItems("towerName_" + count);
                  }

                  if(keyOftowerArray === "totalFloor"){
                    $("#elevationAndFloorCon_" + count).css("border-color", "#F00");
                    scrollIntoViewItems("elevationAndFloorCon_" + count);
                  }

                  setTimeout(()=>{
                    $("#towerName_" + count).css("border-color", "#c9c9c9");
                    $("#elevationAndFloorCon_" + count).css("border-color", "#c9c9c9");
                  }, 2000);
              }
          }
      };
  return IsValidToSave;
}

  const checkingTowerReduction = ()=>{
        let isPropertyTowerProper = true;
        const aptvlmentOverView = [...(combinedPropertyDetails[projectprops.apartment] || []),...(combinedPropertyDetails[projectprops.villament] || [])];

        const activeTowerIds = [];
        aptvlmentOverView.map((each)=>{
            const overviewPhase = each.phaseId;
            const overviewProp = each.projType;
            const noOfOverviewTower = parseInt(each.noOfTower);
            let count = 0; 
            towers.forEach((tower) => {
                if (tower.phaseId === overviewPhase && tower.propType === overviewProp){
                  count++;
                  if (count <= noOfOverviewTower) {
                    if(towerEmptyValidation(tower,count-1)){
                      activeTowerIds.push(tower.towerId);
                    }else{
                      getPhase(tower.phaseId, { id: tower.propType });
                      // itemScrollIntoView(`noOfTower_${tower.propType}`);
                      // $(`#noOfTower_${tower.propType}`).css("border-color", "#F00");
                      $("#MaxAndMinErrMsgOverview").text("some tower data is missing");
                      $("#MaxAndMinErrMsgOverview").show();
                      setTimeout(()=>{
                        $("#MaxAndMinErrMsgOverview").hide();
                      },2000);
                      isPropertyTowerProper = false;
                      return isPropertyTowerProper;
                    } 
                  }
                }
                });
            })

            if(!isPropertyTowerProper){
              return false;
            }
          const aptVillamentUnits = [...(tableData[projectprops.apartment] || []), ...(tableData[projectprops.villament] || [])];
            aptVillamentUnits.map((singleUnit)=>{
                if((singleUnit.isDeleted !== "Y") && (!activeTowerIds.includes(parseInt(singleUnit.tower)))){
                    isPropertyTowerProper = false
                    getPhase(singleUnit.phaseId, { id: singleUnit.propType });
                    itemScrollIntoView(`noOfTower_${singleUnit.propType}`);
                    $("#MaxAndMinErrMsgOverview").text("There are some Units Available in your Deleted Tower Please remove it");
                    $("#MaxAndMinErrMsgOverview").show();

                    setTimeout(()=>{
                      $("#MaxAndMinErrMsgOverview").hide();
                    },2000);
                    return isPropertyTowerProper;
                }
            })
      return isPropertyTowerProper;
  };

  const whileSavingData = () => {
    if(checkingTowerReduction() === true){
        if(isDeletedOverView() === true){
            if (validateOnSubmitData() === true) {
                onNextclick();
            }
        }
    }
  };

  const validateOnSubmitData = () => {
    let status = false;

    if (
      tableData !== undefined &&
      tableData != null &&
      validFof(projectprops.apartment) === true &&
      validFof(projectprops.rowHouse) === true &&
      validFof(projectprops.villa) === true &&
      validFof(projectprops.villament) === true &&
      validFof(projectprops.plot) === true
    ) {
      return true;
    }
    status = false;
    return status;
  };

  const [savedEntity, setSavedEntity] = useState({});
  const [propertyName, setPropertyName] = useState("Apartment Form");

  useEffect(() => {
    if (savedEntity != undefined && savedEntity.id !== undefined) {
      if (addinCurrentTable(tableData[propTypeId], savedEntity, propTypeId)) {
        closeEditPopUp();
        $("#rowLoaderAndStatusCon").hide();
      }
    }
  }, [savedEntity]);

  const openEditPopUp = (each) => {
    if (checTowerAndOverViewData(overview, propTypeId) === true) {
      document.body.style.overflow = "hidden";
      // $("#propDetailsPopupBox").show();
      setIsDetailsPopup(true);

      if(each.parkingType === undefined && Object.keys(each).length > 0){
        each.parkingType = "None";
      };

      if(Object.keys(each).length === 0 && (propTypeId === projectprops.apartment || propTypeId === projectprops.villament) ){
        each.aptType = 900;
      };

      if(Object.keys(each).length > 0 && (propTypeId === projectprops.apartment || propTypeId === projectprops.villament) && (each.aptType === undefined || each.aptType == null) ){
        each.aptType = 900;
      };

      // if(Object.keys(each).length > 0){
      //   each.projectName = data.projName;
      //   each.cityName = cityName;
      //   each.localityName = localityName;
      // };

      setEditpopUpData(each);
    }
  };

  

  const checTowerAndOverViewData = (overview, propTypeIdd) => {
    let errorIds = [];
    let status = true;
    if (overview !== undefined && overview !== null) {
      if (
        !(
          overview.landArea !== undefined &&
          overview.landArea !== null &&
          overview.landArea !== "" &&
          overview.landArea !== 0
        )
      ) {
        errorIds.push(`landArea_${propTypeIdd}`);
        status = false;
      }

      if (
        !(
          overview.basePrice !== undefined &&
          overview.basePrice !== null &&
          overview.basePrice !== "" && 
          overview.basePrice !== 0
        )
      ) {
        errorIds.push(`basePrice_${propTypeIdd}`);
        status = false;
      }

      if (
        !(
          overview.noOfUnit !== undefined &&
          overview.noOfUnit !== null &&
          overview.noOfUnit !== "" && 
          overview.noOfUnit !== 0  
        )
      ) {
        errorIds.push(`noOfUnit_${propTypeIdd}`);
        status = false;
      }


      if ( propTypeIdd === projectprops.apartment || propTypeIdd === projectprops.villament) {
        if (
          !(
            overview.noOfTower !== undefined &&
            overview.noOfTower !== null &&
            overview.noOfTower !== "" &&
            overview.noOfTower > 0
          )
        ) {
          //
          status = false;
          errorIds.push(`noOfTower_${propTypeIdd}`);
        } else {
          let towerTableopen = false;
          const towerData = [];
          towers.map((each) => {
            if (each.propType == propTypeIdd && each.phaseId == selectedPhase) {
              towerData.push(each);
            }
          });
          let i = 0;
          let isSaveReq = false;
          
          towerData.forEach((each) => {
            if (i < parseInt(overview.noOfTower)) {
              if (!(each.towerName !== undefined && each.towerName !== null &&each.towerName !== "")) {
                    towerTableopen = true;
                    status = false;
                    errorIds.push(`towerName_${i}`);
              };

              if (!(each.elevationBasement !== undefined && each.elevationBasement !== null && each.elevationBasement !== "")) {
                    towerTableopen = true;
                    status = false;
                    errorIds.push(`basement_${i}`);
              };

              let elevationName = each !== undefined && each.elevationGround !== undefined &&  each.elevationGround !== null
                                  ? "elevationGround"
                                  : each !== undefined && each.elevationStilt !== undefined && each.elevationStilt !== null
                                  ? "elevationStilt"
                                  : each !== undefined && each.groundAndStilt !== undefined && each.groundAndStilt !== null
                                  ? "groundAndStilt"
                                  : each !== undefined && each.elevation !== undefined && each.elevation !== null
                                  ? "elevation"
                                  : "totalFloor";

              if (!(each[elevationName] !== undefined && each[elevationName] !== null && each[elevationName] !== "" && each[elevationName] !== 0) && elevationName !== "") {
                  towerTableopen = true;
                  status = false;
                  // errorIds.push(`groundAndStiltNOoOfFloors_${i}`);
                  errorIds.push(`elevationAndFloorCon_${i}`);
              }              

              if (each.towerId === undefined || each.towerId == null) {
                isSaveReq = true;
              }
            }
            i++;
          });
            if(status){
                if (isSaveReq || isEditOverview || isEditTower) {
                  if(isSaveReq || isEditTower){
                      saveTowerDetails(setTowers, towers, combinedPropertyDetails,setIsEditTower)
                      .then(result => {
                          if (result === true) {
                              status = true;
                              saveProjPropDetails(combinedPropertyDetails, true, undefined,setCombinedPropertyDetails,setIsEditOverview);
                          } else {
                              status = false;
                              console.error("Error in saving tower details");
                          }
                      })
                      .catch(error => {
                          console.error("An error occurred:", error);
                      });
                  }else if(!isEditTower && isEditOverview){
                      saveProjPropDetails(combinedPropertyDetails, true, undefined,setCombinedPropertyDetails,setIsEditOverview);
                  }
                }
            }
        }
      }else{
        if(status){
            if(isEditOverview){
                  saveProjPropDetails(combinedPropertyDetails, true, undefined,setCombinedPropertyDetails,setIsEditOverview);
            }
        }
      }
    }


    // if((!isEditTower && isEditOverview)){
    //              saveProjPropDetails(combinedPropertyDetails, true, undefined,setCombinedPropertyDetails,setIsEditOverview);
    // }

    let isScrolled = false;
    errorIds.map((eachId) => {
      $("#" + eachId).css("border-color", "#F00");
      var element = document.getElementById(eachId);

      if (isScrolled === false) {
        
        if (element) {
          element.scrollIntoView();
          isScrolled = true;
        }
      }
    });

    // setTimeout(()=>{
    //   errorIds.map((eachId) => {
    //     $("#" + eachId).css("border-color", "#c9c9c9");
    //   });
    // },2000);

    return status;
  };

  const closeEditPopUp = () => {
    // $("#propDetailsPopupBox").hide();
    setIsDetailsPopup(false);
    document.body.style.overflow = "scroll";
    setEditpopUpData({});
    onEditPopUpSave(undefined, "close");
    var checkboxes = document.getElementById(`checkboxes_${propTypeId}`);
    if(checkboxes){
      checkboxes.style.display = "none";
    }
  };

  const onValuesChange = (e, each) => {
    $(`#popup_details_err_msg_${propTypeId}`).hide();
    $("#postPropertySubmitButton").prop("disabled", false);
    $("#postPropertySubmitButton").css("cursor", "pointer");

    if (e !== undefined && e.target !== undefined) {
      let value = e.target.value;
      let name = e.target.name;

      if(name !== undefined && value !== undefined){
          if(name === "bhkCustom"){
            if(parseInt(value) <= 50 || value === ""){
              setEditpopUpData((prevState) => ({
                ...prevState,
                [name]: value,
              }));
              
              $("#customUnitType").css("border-color", "#148B16");
            }else{
              $("#customUnitType").css("border-color", "#F00");
            }
          }else{
            setEditpopUpData((prevState) => ({ ...prevState, [name]: value }));
          }
          
          // if tower count = 1 updating tower value by floor changing...
          if(name === "floor"){
              let towercount = overview && overview.noOfTower !== undefined ? overview.noOfTower : 0;
              if(towercount === 1){
                  setEditpopUpData((prevState) => ({
                    ...prevState,
                    tower: towers[0].towerId,
                  }));
              };
          };

          if(name === "isBasement"){
            if(value === "N"){
              setEditpopUpData((prevState) => ({
                ...prevState,
                [name]: "Y",
              }));
            }else{
              setEditpopUpData((prevState) => ({
                ...prevState,
                [name]: "N",
              }));
            }
          }

          if (name === "bhk" && value === "custom") {
            setEditpopUpData((prevState) => ({
              ...prevState,
              ["bhkCustomChange"]: "Y",
            }));
          }

          if (name === "bhk" && value != "custom") {
            setEditpopUpData((prevState) => ({
              ...prevState,
              ["bhkCustomChange"]: "N",
              ["bhkCustom"]: "",
            }));
          }

          if (name == "facing" && value == "custom") {
            setEditpopUpData((prevState) => ({
              ...prevState,
              ["facingCustomChange"]: "Y",
            }));
          }

          if (name == "facing" && value != "custom") {
            setEditpopUpData((prevState) => ({
              ...prevState,
              ["facingCustomChange"]: "N",
              ["facingCustom"]: "",
            }));
          }

          if(name == "balcony"){
            if (value == 0){
              if(propTypeId == projectprops.villament ){
                setEditpopUpData((prevState) => ({
                  ...prevState,
                  ["balconyArea"]: "",
                }));
              }
            }
          }

          if (name == "noOfCarParking" ) {
            if (value == 0){
              if(propTypeId == projectprops.rowHouse || propTypeId == projectprops.villa || propTypeId == projectprops.villament ){
                  setEditpopUpData((prevState) => ({
                    ...prevState,
                    ["parkingArea"]: "",
                  }));
              }else{
                //parkingType
                setEditpopUpData((prevState) => ({
                  ...prevState,
                  ["parkingType"]: "None",
                }));
                $("#customLabel_openParking").addClass("aftergdasgda");
              }
            }
          } else {
            $("#openParking").removeAttr("disabled");
          }

      }
    
    } else {
      if (e === "unitType") {
        e = "bhk";
      }
      if (each.id != undefined) {
        setEditpopUpData((prevState) => ({
          ...prevState,
          [e]: each.id,
        }));
      } else if (each.cid != undefined) {
        setEditpopUpData((prevState) => ({
          ...prevState,
          [e]: each.cid,
        }));
      } else {
        setEditpopUpData((prevState) => ({ ...prevState, [e]: each }));
      }
    }


    if(e.target.name != undefined && e.target.name != null && e.target.name != "" && e.target.name === "floor"){
      $(`#${`floor`}`).css("border-color", "#148B16");
    }else if(e.target.name != undefined && e.target.name === "superBuildUpArea" && editPopUpData["carpetArea"] != null){
      $(`#${`carpetArea`}`).css("border-color", "#148B16");
      $(`#${`superBuildUpArea`}`).css("border-color", "#148B16");
    }else if(e.target.name != undefined && e.target.name === "carpetArea" && editPopUpData["superBuildUpArea"] != null){
      $(`#${`superBuildUpArea`}`).css("border-color", "#148B16");
      $(`#${`carpetArea`}`).css("border-color", "#148B16");
    }else{
      if(e.target.name !== "bhkCustom"){
        $(`#${e.target.id}`).css("border-color", "#148B16");
      }
    }

  };

  const [floorplanImageFile, setFloorplanImageFile] = useState([]);
  const [floorplanImgUrl, setFloorplanImgUrl] = useState([]);

  const onUploadBtnClick = (e, identifier) => {

    if (identifier != undefined && identifier == "I") {
      setImgpopUpbtnName("Save and Close");
    }
    if (e.target.files !== null && e.target.files.length > 0) {
      let fileId = e.target.id;
      let file = e.target.files[0];

      $(`#imagesPopupMaxLimit_${fileId}`).hide();
      $(`#imagesPopupMaxLimit${fileId}`).hide();

      if (file !== null) {
        if (file.size > 5 * 1000000) {
          $(`#postProp_err_msg_${fileId}`).css("font-size", "11px");
          $("#" + `postProp_err_msg_${fileId}`).css("display", "block");
          $("#newMediaImagesUploadBox").css("hieght", "");
          $(`#imagesPopupMaxLimit_${fileId}`).show();

          setTimeout(()=>{
            $("#" + `postProp_err_msg_${fileId}`).css("display", "none");
            $(`#imagesPopupMaxLimit_${fileId}`).hide();
          },5000)

        } else {
          $("#" + `postProp_err_msg_${fileId}`).css("display", "none");
          $(`#postProp_err_msg_${fileId}`).css("font-size", "20px");
          $("#newMediaImagesUploadBox").css("hieght", "100%");
          
          setEditpopUpData((singleRow) => ({
            ...singleRow,
            floorPlan: file,
            floorPlanUrl: URL.createObjectURL(file),
            editFloorPlan: "Y",
          }));
        }
      }
    }
  };

  const onRemoveImage = (identifier) => {
    if (
      floorplanImageFile != undefined &&
      floorplanImageFile[0] != undefined &&
      floorplanImgUrl != undefined &&
      floorplanImgUrl[0] != undefined
    ) {
      setFloorplanImageFile([]);
      setFloorplanImgUrl([]);
    }

    setEditpopUpData((singleRow) => ({
      ...singleRow,
      floorPlan: [],
      floorPlanUrl: undefined,
      editFloorPlan: "Y",
    }));

    if (identifier != undefined && identifier == "I") {
      setImgpopUpbtnName("Save and Close");
    }
  };

  // overview data change
  const onPropertyDetailsChange = (e) => {
    var idc = e.target.id;
    var id = idc != undefined ? idc.split("_")[0] : "";

    if (idc != undefined && idc != null) {
      $(`#${idc}`).css( "border", "0.8px solid var(--Brand-green-primary, #148B16)" );
    }

    var val = e.target.value;
    // setPropertyForEdit(false);
    setIsEditOverview(true);

    if (id == "elevationStilt") {
      setCombinedPropertyDetails((prev) => {
        if (selectedPhase !== null) {
          const updatedPropType = (prev[propTypeId] || []).map((item) =>
            item.phaseId === selectedPhase
              ? { ...item, [id]: val, elevationGround: null }
              : item
          );

          const newPropType = prev[propTypeId] && prev[propTypeId].some((item) => item.phaseId === selectedPhase) ? []
              : [
                {
                  isActive: "N",
                  isDeleted: "N",
                  phaseId: selectedPhase,
                  projType: propTypeId,
                  [id]: val,
                  elevationGround: null,
                },
              ];

          return { ...prev, [propTypeId]: updatedPropType.concat(newPropType) };
        } else {
          return {
            ...prev,
            [propTypeId]: [{ ...overview, [id]: val, elevationGround: null }],
          };
        }
      });
    } else if (id == "elevationGround") {
      setCombinedPropertyDetails((prev) => {
        if (selectedPhase !== null) {
          const updatedPropType = (prev[propTypeId] || []).map((item) =>
            item.phaseId === selectedPhase
              ? { ...item, [id]: val, elevationStilt: null }
              : item
          );

          const newPropType = prev[propTypeId] && prev[propTypeId].some((item) => item.phaseId === selectedPhase) ? []
              : [
                {
                  isActive: "N",
                  isDeleted: "N",
                  phaseId: selectedPhase,
                  projType: propTypeId,
                  [id]: val,
                  elevationStilt: null,
                },
              ];

          return { ...prev, [propTypeId]: updatedPropType.concat(newPropType) };
        } else {
          return { ...prev, [propTypeId]: [{ ...overview, [id]: val, elevationStilt: null }]};
        }
      });

    } else if (id == "elevationFloor") {
      let id2 = "elevationStilt";
      if ( overview.elevationGround != undefined && overview.elevationGround != null ) {
        id2 = "elevationGround";
      }

      setCombinedPropertyDetails((prev) => {
        if (selectedPhase !== null) {
          const updatedPropType = (prev[propTypeId] || []).map((item) =>
            item.phaseId === selectedPhase
              ? { ...item, [id2]: val, [id]: val }
              : item
          );

          const newPropType =
            prev[propTypeId] &&
              prev[propTypeId].some((item) => item.phaseId === selectedPhase)
              ? []
              : [
                {
                  isActive: "N",
                  isDeleted: "N",
                  phaseId: selectedPhase,
                  projType: propTypeId,
                  [id]: val,
                  [id2]: val,
                },
              ];
          return { ...prev, [propTypeId]: updatedPropType.concat(newPropType) };
        } else {
          return { ...prev, [propTypeId]: [{ ...overview, [id2]: val, [id]: val }]};
        }
      });

    } else if (e.target.name == "noOfBlock") {
      val = val !== "" ? Math.trunc(val) : val;
      if ((val > 0 && val <= 150) || val === "" ) {
        setCombinedPropertyDetails((prev) => {
          if (selectedPhase !== null) {
            const updatedPropType = (prev[propTypeId] || []).map((item) =>
              item.phaseId === selectedPhase ? { ...item, [id]: val } : item
            );

            const newPropType = prev[propTypeId] && prev[propTypeId].some((item) => item.phaseId === selectedPhase) ? []
                : [
                  {
                    isActive: "N",
                    isDeleted: "N",
                    phaseId: selectedPhase,
                    projType: propTypeId,
                    [id]: val,
                  },
                ];

            return { ...prev, [propTypeId]: updatedPropType.concat(newPropType)};
          } else {
            return { ...prev, [propTypeId]: [{ ...overview, [id]: val }] };
          }
        });
      }
    } else if (e.target.name == "landArea") {
      if (val < 10000000000) {
        setCombinedPropertyDetails((prev) => {
          if (selectedPhase !== null) {
            const updatedPropType = (prev[propTypeId] || []).map((item) =>
              item.phaseId === selectedPhase ? { ...item, [id]: val } : item
            );

            const newPropType = prev[propTypeId] && prev[propTypeId].some((item) => item.phaseId === selectedPhase) ? []
                : [
                  {
                    isActive: "N",
                    isDeleted: "N",
                    phaseId: selectedPhase,
                    projType: propTypeId,
                    [id]: val,
                  },
                ];

            return { ...prev, [propTypeId]: updatedPropType.concat(newPropType)};
          } else {
            return { ...prev, [propTypeId]: [{ ...overview, [id]: val }] };
          }
        });
      }
    } else if (e.target.name == "basePrice") {
      val = (val !== "" && val != 0) ? val : "";
      if (val < 500000001) {
        setCombinedPropertyDetails((prev) => {
          if (selectedPhase !== null) {
            const updatedPropType = (prev[propTypeId] || []).map((item) =>
              item.phaseId === selectedPhase ? { ...item, [id]: val } : item
            );

            const newPropType = prev[propTypeId] && prev[propTypeId].some((item) => item.phaseId === selectedPhase) ? []
                : [
                  {
                    isActive: "N",
                    isDeleted: "N",
                    phaseId: selectedPhase,
                    projType: propTypeId,
                    [id]: val,
                  },
                ];

            return { ...prev, [propTypeId]: updatedPropType.concat(newPropType)};
          } else {
            return { ...prev, [propTypeId]: [{ ...overview, [id]: val }] };
          }
        });
      }

    }else {
      setCombinedPropertyDetails((prev) => {
          val = (val !== "" && val != 0) ? Math.trunc(val) : "";
          if (selectedPhase !== null) {
              const updatedPropType = (prev[propTypeId] || []).map((item) =>
              item.phaseId === selectedPhase ? { ...item, [id]: val } : item
          );

          const newPropType = prev[propTypeId] && prev[propTypeId].some((item) => item.phaseId === selectedPhase) ? []
              : [
                {
                  isActive: "N",
                  isDeleted: "N",
                  phaseId: selectedPhase,
                  projType: propTypeId,
                  [id]: val,
                },
              ];
          return { ...prev, [propTypeId]: updatedPropType.concat(newPropType) };
        } else {
          return { ...prev, [propTypeId]: [{ ...overview, [id]: val }] };
        }
      });
    }

    $("#" + e.target.id).css( "border", "0.8px solid var(--Brand-green-primary, #148B16)");
  };



  const onEditPopUpSave = (each, dropdownStatus) => {
    let apt = ["unitType", "aptType", "unitNumber", "towers", "floor", "superBuildUpArea", "carpetArea", "bathrooms", "balcony", "unitFacing", "carParking", "openParking"];
    let rhs = ["unitType", "aptType", "unitNumber", "floors", "superBuildUpArea", "carpetArea", "plotArea", "bathrooms", "balcony", "unitFacing", "carParking", "elevation", "floor"];
    let vil = ["unitType", "aptType", "unitNumber", "floor", "superBuildUpArea", "carpetArea", "plotArea", "bathrooms", "balcony", "unitFacing", "carParking"];
    let vilm = ["unitType", "aptType", "unitNumber", "towers", "floor", "superBuildUpArea", "carpetArea", "bathrooms", "balcony", "unitFacing", "carParking"];
    let plo = ["unitNumber", "breadthOfPlot", "plotFacing", "plotArea", "lengthOfPlot"];


    let validatingArraysList = apt;

    switch (propTypeId) {
      case projectprops.apartment:
        validatingArraysList = apt;
        break;
      case projectprops.rowHouse:
        validatingArraysList = rhs;
        break;
      case projectprops.villa:
        validatingArraysList = vil;
        break;
      case projectprops.villament:
        validatingArraysList = vilm;
        break;
      case projectprops.plot:
        validatingArraysList = plo;
        break;
    }

    let testingArray = [];

    if (each != undefined) {
      if (each.isDeleted != "Y") {
        each.projectName = data.projName;
        each.cityName = cityName;
        each.localityName = localityName;

        // if(data.phaseCount !== undefined && data.phaseCount > 1 ){
        //     each.phaseName = phaseArray !== undefined && phaseArray.length > 0 ? phaseArray.filter(eachPhase=>eachPhase.phaseId == selectedPhase)[0].phaseName : "";
        // };
        
        validatingArraysList.map((eachFieldId) => {
          var everyFieldVal = $("#" + eachFieldId).val();

          if (each.bhk == "custom" || parseInt(each.bhk) > 100000 ){
              var custumBhkVal = $("#customUnitType").val();
              if(custumBhkVal == "" || custumBhkVal == 0){
                  testingArray.push("");
                  $("#customUnitType").css("border-color", "red");
                  $(`#popup_details_err_msg_${propTypeId}`).text("Custom Bhk Field Cannot be 0");
              }else{
                $("#customUnitType").css("border-color", "#148b16");
              }
          };

          if (each.facing == "custom"){
              var custumFacingVal = $("#customUnitFacing").val();
              if(custumFacingVal == ""){
                  testingArray.push(custumFacingVal);
                  $("#customUnitFacing").css("border-color", "red");
              }else{
                $("#customUnitFacing").css("border-color", "#148b16");
              }
          };

          if (eachFieldId == "plotArea" || eachFieldId == "lengthOfPlot" || eachFieldId == "breadthOfPlot") {
              let keyName = eachFieldId == "lengthOfPlot" ? "length" : eachFieldId == "breadthOfPlot" ? "width" : eachFieldId;
              if (each[keyName] == undefined || each[keyName] == "" || each[keyName] == 0) {
                  testingArray.push("");
                  $(`#${eachFieldId}`).css("border-color", "red");
              }
          };

        
          if ( each.bhk != undefined && each.bhk != "" && each.facing != undefined && each.facing != "" ) {
              if (eachFieldId != "unitType" && eachFieldId != "unitFacing") {
                  testingArray.push(everyFieldVal);
                  if (everyFieldVal == "") {
                      $(`#${eachFieldId}`).css("border-color", "red");
                  }
              }
          } else if (each.bhk != undefined && each.bhk != "") {
              if (eachFieldId != "unitType") {
                  testingArray.push(everyFieldVal);
                  if (everyFieldVal == "") {
                      $(`#${eachFieldId}`).css("border-color", "red");
                  }
              }
          } else if (each.facing != undefined && each.facing != "") {
            if (eachFieldId != "unitFacing") {
              testingArray.push(everyFieldVal);
              if (everyFieldVal == "") {
                $(`#${eachFieldId}`).css("border-color", "red");
              }
            }
          } else {
            testingArray.push(everyFieldVal);
            if (everyFieldVal == "") {
              $(`#${eachFieldId}`).css("border-color", "red");
            }
          }
        });

        if (projectprops.plot != propTypeId) {
           // CHECKING carpet area less then super buildup area are not...
            let superBuildupValue = parseInt(
              $("#superBuildUpArea").val() == "" ? 0 : $("#superBuildUpArea").val().replace(/\,/g,'')
            );
            let carpetValue = parseInt(
              $("#carpetArea").val() == "" ? 0 : $("#carpetArea").val().replace(/\,/g,'')
            );

          if (superBuildupValue != 0 && carpetValue != 0) {
            if (superBuildupValue > carpetValue) {
              $(`#superBuildUpArea`).css("border-color", "var(--GREY4, #C9C9C9)");
              $(`#carpetArea`).css("border-color", "var(--GREY4, #C9C9C9)");
              $(`#popup_details_err_msg_${propTypeId}`).text("*Note: Please fill in all mandatory required fields");
            } else {
              testingArray.push("");
              $(`#superBuildUpArea`).css("border-color", "red");
              $(`#carpetArea`).css("border-color", "red");
              $(`#popup_details_err_msg_${propTypeId}`).text("*Note: Carpet Area Cannot More Than Super Built-up Area");
            }
          }else{
            testingArray.push("");
            if(superBuildupValue == 0){
              $(`#superBuildUpArea`).css("border-color", "red");
            }

            if(carpetValue == 0){
              $(`#carpetArea`).css("border-color", "red");
            }

            $(`#popup_details_err_msg_${propTypeId}`).text("*Note: Please fill in all mandatory required fields");
          }
        }
        let finalCheck = testingArray.every((eachVal) => {
          return eachVal != "";
        });

        // Final Testing
        if (finalCheck) {
          if (
            savePropType(
              each.id == undefined ? { ...each, propType: propTypeId, phaseId: selectedPhase != null ? selectedPhase : null } : each,
              setSavedEntity
            )
          ) {
            onImagePopup("CLOSE");
          }
          $(`#popup_details_err_msg_${propTypeId}`).hide();
        } else {
          $(`#popup_details_err_msg_${propTypeId}`).show();
        }
      } else {
        if (
          savePropType(
            each.id == undefined ? { ...each, propType: propTypeId, phaseId: selectedPhase != null ? selectedPhase : null, } : each, 
            setSavedEntity
          )
        ) {
          let isPropertyEmpty = true;
          tableData.map((each) => {
            if (
              each.propType === propTypeId &&
              each.phaseId === selectedPhase
            ) {
              isPropertyEmpty = false;
            }
          });
          if (isPropertyEmpty === false) {
            propPricing[propTypeId][each.bhk].map((each) => {
              if (each.phaseId === selectedPhase) {
                each.isActive = "N";
                each.ischange = "Y";
              }
            });
            setPropPricing(propPricing);
          }
        }
      }
    }

    if(dropdownStatus == "close") {
        validatingArraysList.map((eachFieldId) => {
            $(`#${eachFieldId}`).css("border-color", "var(--GREY4, #C9C9C9)");
        });
        $(`#popup_details_err_msg_${propTypeId}`).hide();
        $(`#postProjPhases`).css("border-color", "var(--GREY4, #C9C9C9)");
    }
  };

  const addinCurrentTable = (list, savedEntity) => {
    if (list == undefined || list == null) {
      list = [savedEntity];
    } else {
      let added = false;
      let bhkCount = 0;
      list.forEach((each, index) => {
        if (each.id == savedEntity.id) {
          // edit
          if (savedEntity.isDeleted == "Y") {
              list.splice(index, 1);
              added = true;
              if(parseInt(savedEntity.bhk) < 100000){
                if(list.filter(eachRowItem=>  eachRowItem.bhk == savedEntity.bhk).length === 0){
                  setSelectedFilteredBhk(null);
                }
              }else{
                if(list.filter(eachRowItem=>  parseInt(eachRowItem.bhk) > 100000 ).length === 0){
                  setSelectedFilteredBhk(null);
                }
              }
              
              
          } else {
              // if bhk chnaged then change price
              let editBhkCount = 0
              if( savedEntity.propType != projectprops.plot && each.bhk != savedEntity.bhk){
                    let prevBhk = each.bhk;
                    list[index] = savedEntity;
                    added = true;
                    list.forEach((eachList, index) => {
                            if (eachList.bhk == each.bhk && eachList.phaseId == selectedPhase) {
                              editBhkCount++;
                            } 
                    });
                    if(editBhkCount == 0){
                        onChangePropPricing(undefined,undefined,prevBhk,savedEntity.propType,"Y");
                        setSelectedFilteredBhk(null);
                    }

                    // if(list.filter(eachRowItem=>  eachRowItem.bhk == prevBhk).length === 0){
                    //   setSelectedFilteredBhk(null);
                    // }

              }else if( savedEntity.propType == projectprops.plot && (each.length != savedEntity.length || each.width != savedEntity.width)){
                      let prevdim = each.length + "_" + each.width;
                      list[index] = savedEntity;
                      added = true;

                      list.forEach((eachList, index) => {
                                  if (eachList.length == each.length && eachList.width == each.width && eachList.phaseId == selectedPhase) {
                                      editBhkCount++;
                                  }
                          });
                    if(editBhkCount == 0){
                      onChangePropPricing(undefined,undefined,prevdim,savedEntity.propType,"Y");
                    }
              }else {
                list[index] = savedEntity;
                added = true;
              }    
          }
        }
      });

      if (added == true && savedEntity.isDeleted == "Y") {
        // deleting 
        list.forEach((each, index) => {
          if (savedEntity.propType != projectprops.plot) {
            if (each.bhk == savedEntity.bhk && each.phaseId == selectedPhase) {
              bhkCount++;
            }
          } else {
            if (each.length == savedEntity.length && each.width == savedEntity.width && each.phaseId == selectedPhase) {
              bhkCount++;
            }
          }
        });
        let bhk =
          savedEntity.propType != projectprops.plot
            ? savedEntity.bhk
            : savedEntity.length + "_" + savedEntity.width;
        if (bhkCount == 0) {
          onChangePropPricing(
            undefined,
            undefined,
            bhk,
            savedEntity.propType,
            "Y"
          );
        }
      }
      if (!added) {
        list.push(savedEntity);

        //adding price
        let priceBhk = savedEntity.propType != projectprops.plot ? savedEntity.bhk : savedEntity.length + "_" + savedEntity.width;
        let propPriceArray = propPricing != null && Object.keys(propPricing).length > 0 ? propPricing[savedEntity.propType] : null;
        let bhkPriceArray = propPriceArray != null && Object.keys(propPriceArray).length > 0 ? propPriceArray[priceBhk] : [];

        if (bhkPriceArray != null && bhkPriceArray.length > 0) {
          bhkPriceArray.map((each) => {
            if (each.phaseId === selectedPhase) {
              each.isActive = "Y";
              each.ischange = "Y";
            }
          });
          // need to check
          setPropPricing({
            ...propPricing,
            [savedEntity.propType]: {
              ...propPriceArray,
              [priceBhk]: bhkPriceArray
            }
          });
        }
      }

      // fghjk
    }

    setTableData((prev) => {
      return { ...prev, [propTypeId]: list };
    });

    setSavedEntity({});
    return true;
  };



  const makeFloors = (num, setData, base, start) => {
    let floors = [];
    var i = start;
    for (; i <= num; i++) {
      if (base == "G") {
        let item = "G+" + i;
        floors.push({ id: i, name: item });
      }else if(base == "B") {
        let b = "B+G+" + i;
        floors.push({ id: i, name: b });
      } else {
        floors.push(i);
      }
    }
    setData(floors);
    floors = [];
  };

  const updateNewCombineList = (typeid, list) => {
    var obj = {};
    if (list == undefined) {
      setNewCombinedList([]);
      return;
    }

    if (typeid != projectprops.plot) {
      list.forEach((each, index) => {
        if (obj[each.bhk] != undefined && obj[each.bhk] != null) {
          let data = obj[each.bhk];
          if (data.noOfUnit != undefined && data.noOfUnit != null) {
            data.noOfUnit = parseFloat(data.noOfUnit) + 1;
          } else {
            data.noOfUnit = 1;
          }

          if (data.bhkCustom != undefined && data.bhkCustom != null) {
            data.bhkCustom = data.bhkCustom;
          }

          if (data.sba != undefined && data.sba != null) {
            data.sba = parseFloat(data.sba) + parseFloat(each.superBuildUpArea);
          } else {
            data.sba = each.superBuildUpArea;
          }

          if (data.ca != undefined && data.ca != null) {
            data.ca = parseFloat(data.ca) + parseFloat(each.carpetArea);
          } else {
            data.ca = each.carpetArea;
          }

          obj[each.bhk] = data;
        } else {
          let data = {};

          data.noOfUnit = 1;
          data.sba = each.superBuildUpArea;
          data.ca = each.carpetArea;
          data.bhkCustom = each.bhkCustom;
          data.phaseId = each.phaseId;
          data.propTypeId = each.propType;

          obj[each.bhk] = data;
        }
      });
    } else {
      list.forEach((each, index) => {
        let key = each.length + "_" + each.width;

        if (obj[key] != undefined && obj[key] != null) {
          let data = obj[key];

          if (data.noOfUnit != undefined && data.noOfUnit != null) {
            data.noOfUnit = parseFloat(data.noOfUnit) + 1;
          } else {
            data.noOfUnit = 1;
          }
          if (data.area != undefined && data.area != null) {
            data.area = parseFloat(data.area) + parseFloat(each.plotArea);
          } else {
            data.area = each.plotArea;
          }
        } else {
          let data = {};
          data.noOfUnit = 1;
          data.area = each.plotArea;
          data.phaseId = each.phaseId;
          data.propTypeId = each.propType;
          obj[key] = data;
        }
      });
    }

    if (obj != undefined && obj != null) {
      let objkey = Object.keys(obj);
      let data = [];
      if (objkey != undefined && objkey != null && objkey.length > 0) {
        objkey.forEach((each) => {
          data.push({ ...obj[each], bhk: each });
        });
        setNewCombinedList(data);
      } else {
        setNewCombinedList([]);
      }
    } else {
      setNewCombinedList([]);
    }
  };


  useEffect(() => {

    updateNewCombineList(propTypeId, filteredTableData);

  }, [filteredTableData, selectedPhase, propTypeId]);

  const blobUrlToFile = (blobUrl, fileName) => {
      return fetch(blobUrl)
        .then(response => {
            return response.blob();
        })
        .then(blob => {
            return new File([blob], fileName);
        })
        .catch(error => {
            throw error;
        });
};

  const onImagePopup = (identifier, eachRow, flag, entity, imageUrl) => {
    if(entity !== undefined && entity !== null){
      entity.projectName = data.projName;
      entity.cityName = cityName;
      entity.localityName = localityName;
    }
    switch (identifier) {
      case "OPEN":
        if (typeof eachRow != "string") {
          setEditpopUpData(eachRow);
        }
        document.body.style.overflow = "hidden";
        setIsPopupDisplayed(true);
        $("#imagesRenderingPopup").show();
        break;

      case "CLOSE":
        setIsPopupDisplayed(false);
        $("#imagesRenderingPopup").hide();
        document.body.style.overflow = "scroll";
        if (flag == "s" && entity != undefined) {
          savePropType(entity,  setSavedEntity);
          setImgpopUpbtnName("Close");
        }
        break;
      case "SAVE":
        if(entity){

          // Converting Url into File --
          blobUrlToFile(imageUrl, "Rotated.jpg")
          .then(file => {
            entity.floorPlanUrl = imageUrl;
            entity.floorPlan = file;
            entity.editFloorPlan = "Y";
            savePropType(entity, setSavedEntity, onImagePopup)
          })
          .catch(error => {
              console.error("Error converting blob URL to file:", error);
          });
        }
        break;  
    }
  };

  const getPhase = (phaseId, proptypeid, makePropIdNull) => {
    setSelectedFilteredBhk(null);
    const propertyType = proptypeid != null && proptypeid != "" ? proptypeid.id : null;
    
    let value="";
    if(phaseId != null && phaseId != ""){
        setSelectedPhase(phaseId);
        let isfound = false;
        for (let item of phaseArray) {
            if (item.phaseId == phaseId){
              value = item.phaseName !== null && !item.phaseName.toLowerCase().includes("phase") ? `Phase ${item.phaseName}` : item.phaseName;
              isfound = true;
            }
        };

        $(`#phaseNumberText`).text(value);
        $("#propCsvPhaseName").text(value != null ? value : "" );
        
    }
    
    //changing the style of the properttype buttons
    if(propertyType != null && propertyType != "" ){

      if (propertyType != propTypeId) {
        switch (propertyType) {
          case projectprops.apartment:
            setPropertyName("Apartment Form");
            break;

          case projectprops.rowHouse:
            setPropertyName("RowHouse Form");
            break;
          case projectprops.villa:
            setPropertyName("Villa Form");
            break;
          case projectprops.villament:
            setPropertyName("Villament Form");
            break;
          case projectprops.plot:
            setPropertyName("Plot Form");
            break;
          default:
            break;
        }
      }
      setPropTypeId(propertyType);
      updateNewCombineList(propertyType, filteredTableData);
      
      if(makePropIdNull){
        setPropTypeId(null);
      }
      
    }
  };

  const [isDeleteAllUnitsPopup, setIsDeleteAllUnitsPopup] = useState(false);

  const onDeleteAllUnits = (identifier) =>{
    switch(identifier){
      case "delete":
        deleteAllUnits(
            selectedPhase, 
            propTypeId, 
            selectedFilteredBhk === 100000 ? 100001 : selectedFilteredBhk, 
            setIsDeleteAllUnitsPopup, 
            setSelectedFilteredBhk, 
            setTableData
        );
        break;
      case "cancel":
        setIsDeleteAllUnitsPopup(false);
        break;
      case "open":
        setIsDeleteAllUnitsPopup(true);
        break;
        default:
          return "";
    }
  };

    // csv instructions popup functions

    const popperButton = document.querySelector(`#popper-button`);
    const popperPopup = document.querySelector(`#popper-popup`);
    const popperArrow = document.querySelector(`#popper-arrow`);
  

    //Popover testing Functions:
    const [seeMore, setSeeMore] = useState(false);

    let popperInstance = null;

    //create popper instance
    function createInstance() {
        if(popperButton && popperPopup){
            popperInstance = createPopper(popperButton, popperPopup, {
                placement: "auto", //preferred placement of popper
                modifiers: [
                {
                    name: "offset", //offsets popper from the reference/button
                    options: {
                    offset: [0, 8]
                    }
                },
                {
                    name: "flip", //flips popper with allowed placements
                    options: {
                    allowedAutoPlacements: ["right", "left", "top", "bottom"],
                    rootBoundary: "viewport"
                    }
                }
                ]
            });
        }
    }

    //destroy popper instance
    function destroyInstance() {
        if (popperInstance) {
            popperInstance.destroy();
            popperInstance = null;
        }
    }

    //show and create popper
    function showAndHidePopper(status) {
        if(popperArrow && popperPopup){
            if(status === "show"){
                popperPopup.setAttribute("show-popper", "");
                popperArrow.setAttribute("data-popper-arrow", "");
                createInstance();
            }else{
                popperPopup.removeAttribute("show-popper");
                popperArrow.removeAttribute("data-popper-arrow");
                destroyInstance();
            }
        }
    };


    const onMainConClick = (e) => {
        if (popperPopup && !popperPopup.contains(e.target)){
            if (popperPopup && popperPopup.hasAttribute("show-popper")) {
              showAndHidePopper("hide");
              setSeeMore(false);
            }
        }
    };



  return (
    <div className="postProjectPropDetailsBottomCon" onClick={(e)=>onMainConClick(e)}>

      {/* discarted  */}
      <div style={{ display: previewPopup }}>
        <DetailsPreviewPopup
          setPreviewPopup={setPreviewPopup}
          eachRow={previewData}
        />
      </div>
        
      {isDeleteAllUnitsPopup &&
      <DeleteUnitsPopup
          onDeleteUnits={onDeleteAllUnits} 
          selectedFilteredBhk={selectedFilteredBhk}
      />
      }

      {phaseArray != undefined &&
        phaseArray != null &&
        phaseArray.length != undefined &&
        phaseArray.length >= 2 && data.phaseCount && data.phaseCount != 1 && (
          <div className="phasesPostPropCon">
            <h3 className="SelectPhaseHeadingAbove">
              Select Phase to fill the property details
            </h3>
            <div className="propertyTypeBtnCon">
              {phaseArray.map((eachPhase, ind) => {
                let currentUpdatePhsecount = (NophasesOfcurrent == 0 ? NoOfPhase : NophasesOfcurrent) - 1
                if (ind < 15 && eachPhase.isActive != "N") {
                  if (ind <= (currentUpdatePhsecount)) {

                    return (
                      <SingleButton
                        key={ind}
                        buttonId={`phaseBtn_${eachPhase.phaseId}`}
                        containerClassName="propertyPhasesBtnCon"
                        buttonClassName={`propertyPhasesBtn ${selectedPhase == eachPhase.phaseId ? "propertyPhasesBtnSelected" : "" }`}
                        onSubmit={() => { getPhase(eachPhase.phaseId,{ id: projectprops.apartment }, true)}}
                        title= {eachPhase.phaseName !== null && !eachPhase.phaseName.toLowerCase().includes("phase") ? `Phase ${eachPhase.phaseName}` : eachPhase.phaseName }
                      />
                    );
                  }
                }
              })}
            </div>
          </div>
        )}

      {/* classname for prop icons "propertyTypeImage" */}

      <div className="pdTopContainer">
        <h3>
          Select your property from below ,{" "}
          <span>can add more than one property</span>
        </h3>
        <div className="propertyTypeBtnCon">
          {propertyDetailsTypes != undefined &&
            propertyDetailsTypes != null &&
            allKeys.map((keyName, ind) => {
              if(keyName != projectprops["Independent House/Building"]){
                return (
                  <button
                    id={`PD_${keyName}`}
                    key={keyName}
                    className={`propertyTypeBtn ${propTypeId == keyName ? "selectedTypeBoX" : ""}`}
                    onClick={() => getPhase("", propertyDetailsTypes.get(keyName)) }
                  >
                      <span className="propertyTypeName"> {propertyDetailsTypes.get(keyName).name}</span>

                      <span className="propertyTypeImage">{propertyDetailsTypes.get(keyName).url}</span>

                      {selectedPropsIds.includes(keyName) &&
                      <svg id={`done_${keyName}`} className="propDoneIcon"xmlns="http://www.w3.org/2000/svg" width="20" height="23" viewBox="0 0 20 23" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M1.01452 11.9715C1.02206 9.58903 1.97575 7.3071 3.66577 5.62775C5.3558 3.9484 7.64372 3.00919 10.0262 3.01673C12.4087 3.02428 14.6907 3.97796 16.37 5.66799C18.0494 7.35801 18.9886 9.64594 18.981 12.0284C18.9735 14.411 18.0198 16.6929 16.3298 18.3722C14.6398 20.0516 12.3518 20.9908 9.96933 20.9833C7.58682 20.9757 5.30489 20.022 3.62554 18.332C1.94618 16.642 1.00697 14.3541 1.01452 11.9715ZM9.47296 15.8432L14.6654 9.39404L13.7335 8.64367L9.30587 14.1406L6.19033 11.528L5.42085 12.4454L9.47295 15.8444L9.47296 15.8432Z" fill="#148B16"/>
                      </svg>
                      }

                  </button>
                );
              }

            })}
        </div>
      </div>

      <PropertiesFeedingBlock
        propTypeId={propTypeId}
        onChange={onPropertyDetailsChange}
        data={overview}
        towers={towers}
        setTowers={setTowers}
        setNoofTower={setNoofTower}
        setvillamenttower={setvillamenttower}
        setSelectedPhase={setSelectedPhase}
        selectedPhase={selectedPhase}
        setIsEditTower = {setIsEditTower}
      />

      <p className="PropertyTypetableHeader">
        Start adding details of your property in unit- wise below{" "}
        <span className="SpanPropertyTypeHeader">
          “ Click to Add Unit Details “
        </span>
      </p>
      <p className="SubPropertyTypeTable">
        See your comprehensive calculated property details below in overview of
        project
      </p>

      {/* Adding CSV Popup */}
      <div className="csvUploadBoxMainCon">
        <div className="csvUploadBoxInnerCon">
          Or directly import CSV to auto -fill properly table with all the unit details 
          {data && data.phaseCount && data.phaseCount > 1 && 
          <Fragment>
            <span id="propCsvTextIn">in</span>  
            <span id="propCsvPhaseName">Phase 1</span>
          </Fragment>
          }
          <SingleButton
            key="csvUploadBtn"
            buttonId="csvUploadBtn"
            containerClassName=""
            buttonClassName="csvUploadBtn"
            onSubmit={()=>onCsvFunction("open")}
            title="Upload CSV"
          />
        </div>

        <p className="csvUploadBoxInnerText">Check out the sample CSV 
            <span className="csvGenerateBtn">
              <span onClick={()=>onCsvFunction("download")}>Download Sample CSV</span>
              {/* {isCsvPopup ?
                <svg className="csvGenerateCircle" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 0.5C8.9233 0.5 6.89323 1.11581 5.16652 2.26957C3.4398 3.42332 2.09399 5.0632 1.29927 6.98182C0.504549 8.90045 0.296614 11.0116 0.701759 13.0484C1.1069 15.0852 2.10693 16.9562 3.57538 18.4246C5.04383 19.8931 6.91476 20.8931 8.95156 21.2982C10.9884 21.7034 13.0996 21.4955 15.0182 20.7007C16.9368 19.906 18.5767 18.5602 19.7304 16.8335C20.8842 15.1068 21.5 13.0767 21.5 11C21.5 8.21523 20.3938 5.54451 18.4246 3.57538C16.4555 1.60625 13.7848 0.5 11 0.5ZM11 5C11.2225 5 11.44 5.06598 11.625 5.1896C11.81 5.31321 11.9542 5.48891 12.0394 5.69448C12.1245 5.90005 12.1468 6.12625 12.1034 6.34448C12.06 6.56271 11.9528 6.76316 11.7955 6.9205C11.6382 7.07783 11.4377 7.18498 11.2195 7.22838C11.0013 7.27179 10.7751 7.24951 10.5695 7.16436C10.3639 7.07922 10.1882 6.93502 10.0646 6.75002C9.94098 6.56501 9.875 6.3475 9.875 6.125C9.875 5.82663 9.99353 5.54048 10.2045 5.3295C10.4155 5.11853 10.7016 5 11 5ZM14 17.0938H8V15.4062H10.1563V11.0938H8.75V9.40625H11.8438V15.4062H14V17.0938Z" fill="#0073C6"/>
                </svg> 
                :
                <CsvInstructionsBox key="propCsvDownload" id="csvInOne" />
              } */}

              <CsvInstructionsBox 
                  key="propCsvDownload" 
                  id="csvInOne" 
                  seeMore={seeMore} 
                  setSeeMore={setSeeMore} 
                  showAndHidePopper={showAndHidePopper} 
              />
            </span> 
        </p>

      </div>

      {csvUploadRes.isCsvPopup &&
      <CsvUploadComponent 
          key="csvUploadPopup"
          onCsvFunction={onCsvFunction}
          csvFile={csvFile}
          selectedPhase={selectedPhase}
          propTypeId={propTypeId}
          phaseArray={phaseArray}
          csvUploadRes={csvUploadRes}
          seeMore={seeMore} 
          setSeeMore={setSeeMore} 
          showAndHidePopper={showAndHidePopper} 
      />
      }
      

      {tableLoader ?
      <p className='tableLoaderMessege'>
          <img src={csvLoader} className="tableLoaderimg" alt="" />
          Please Wait Unit Data is Loading...
      </p>
      :
      <PropertyTypeTable
        data={filteredTableData.length > 0 ? filteredTableData : []}
        identifier={propTypeId}
        openEditPopUp={openEditPopUp}
        onImagePopup={onImagePopup}
        propertyTypeDetails={propertyTypeDetails}
        towers={towers}
        onDeletingRow={onEditPopUpSave}
        previewData={previewData}
        idValidatar={idValidatar}
        selectedFilteredBhk={selectedFilteredBhk}
        setSelectedFilteredBhk={setSelectedFilteredBhk}
        onDeleteAllUnits={onDeleteAllUnits}
        towercount={
          overview != undefined &&
            overview != null &&
            overview.noOfTower != undefined
            ? overview.noOfTower
            : 0
        }
        apartmentTypeList={apartmentTypeList}
      />
      }
      
      <p style={{ display: "none" }} className="PropertyTypeTableErrMsg">
        Please add your property in detail. Click on “+ Click to Add your First
        Unit” to add
      </p>
      <h3>
        {`Overview of ${removeFormFromString(propertyName)} `}
        {phaseArray && phaseArray.length > 1 ? (
          phaseArray
            .map((eachPhase) => {
              return selectedPhase && eachPhase.phaseId === selectedPhase
                ? ` for Phase :${eachPhase.phaseName !== null ?eachPhase.phaseName : ""}`
                : null;
            })
            .filter(Boolean)
            .join(" , ")
        ) : (
          ""
        )}
      </h3>

      <span className="propdetailsSpanText">
        Project property snapshot: Unit Type, no: of Units, 
        {propTypeId == projectprops.plot ? " Plot Area " : " Super Builtup Area and Carpet Area " }
        for in depth exploration and understanding
      </span>

      <PropertyOverviewComponent
        key={propTypeId + "key_kjhgfd"}
        propTypeId={propTypeId}
        newCombinedList={newCombinedList}
        bhktypeData={bhktypeData}
        pricindData={propPricing[propTypeId]}
        onChangePricing={onChangePropPricing}
        selectedPhase={selectedPhase}
      />

      <div id="imagesRenderingPopup" style={{ display: "none" }}>
        <ImagesRenderingPopup
          key={`prop_flootplan_image_${propTypeId}`}
          onImagePopup={onImagePopup}
          filesList={isPopupDisplayed == true &&
            editPopUpData != undefined && editPopUpData.floorPlan != undefined
              ? [editPopUpData.floorPlan]
              : []
          }
          urlsList={isPopupDisplayed == true &&
            editPopUpData != null &&
              Object.keys(editPopUpData).length > 0 &&
              editPopUpData.floorPlanUrl != undefined
              ? [editPopUpData.floorPlanUrl]
              : []
          }
          onUploadBtnClick={(e, i) => onUploadBtnClick(e, i)}
          onRemoveImage={(i) => onRemoveImage(i)}
          previewData={editPopUpData}
          btn2Name={imgpopUpbtnName}
          fileId={`prop_flootplan_image_${propTypeId}`}
          editPopUpData={editPopUpData}
        />
      </div>

      {isDetailsPopup &&
      <div  id="propDetailsPopupBox" >
        <PropertyDetailsInputsPopup
          key={`inputs_popup__${propTypeId}`}
          closeEditPopUp={closeEditPopUp}
          rows={rows}
          floors={floors}
          bathRooms={bathRooms}
          bhktypeData={bhktypeData}
          towers={towers}
          towercount={
            overview != undefined &&
              overview != null &&
              overview.noOfTower != undefined
              ? overview.noOfTower
              : 0
          }
          onValuesChange={onValuesChange}
          singleRow={editPopUpData}
          setSingleRow={setEditpopUpData}
          openParking={openParking}
          groundFloors={groundFloors}
          basementFloors={basementFloors}
          idValidatar={idValidatar}
          identifier={propTypeId}
          title={propertyName}
          onButtonClick={onEditPopUpSave}
          onUploadBtnClick={onUploadBtnClick}
          onRemoveImage={onRemoveImage}
          floorplanImageFile={
            editPopUpData != undefined &&
              editPopUpData.floorPlan != undefined &&
              editPopUpData.floorPlan != []
              ? [editPopUpData.floorPlan]
              : []
          }
          floorplanImgUrl={
            editPopUpData != undefined &&
              editPopUpData.floorPlanUrl != undefined &&
              editPopUpData.floorPlanUrl != null
              ? [editPopUpData.floorPlanUrl]
              : []
          }
          onImagePopup={onImagePopup}
          selectedPhase={selectedPhase}
          apartmentTypeList={apartmentTypeList}
        />
      </div>
      }

      <span
        id="messageValidationForNullObjectInPropertyDetaila"
        className="validationaErrorMessageForAllPages"
      ></span>
      <p
        id="MaxAndMinErrMsgOverview"
        style={{ display: "none" }}
        className="validationaErrorMessageForAllPages"
      >
        *Please provide the applicable minimum and maximum values
      </p>


      <div id="imagesRenderingPopup" style={{ display: "none" }}>
        <ImagesRenderingPopup
          key="key-for-image-edit-popup"
          onImagePopup={onImagePopup}
          filesList={isPopupDisplayed == true &&
            editPopUpData != undefined && editPopUpData.floorPlan != undefined
              ? [editPopUpData.floorPlan]
              : []
          }
          urlsList={isPopupDisplayed == true &&
            editPopUpData != null &&
              Object.keys(editPopUpData).length > 0 &&
              editPopUpData.floorPlanUrl != undefined
              ? [editPopUpData.floorPlanUrl]
              : []
          }
          onUploadBtnClick={(e, i) => onUploadBtnClick(e, i)}
          onRemoveImage={(i) => onRemoveImage(i)}
          previewData={editPopUpData}
          btn2Name={imgpopUpbtnName}
          fileId={`prop_flootplan_image_${propTypeId}`}
          editPopUpData={editPopUpData}

        />
      </div>

      {/* <div id="propDetailsPopupBox" style={{ display: "none" }}>
        <PropertyDetailsInputsPopup
          key={`inputs_popup_${propTypeId}`}
          closeEditPopUp={closeEditPopUp}
          rows={rows}
          floors={floors}
          bathRooms={bathRooms}
          bhktypeData={bhktypeData}
          towers={towers}
          towercount={
            overview != undefined &&
              overview != null &&
              overview.noOfTower != undefined
              ? overview.noOfTower
              : 0
          }
          onValuesChange={onValuesChange}
          singleRow={editPopUpData}
          setSingleRow={setEditpopUpData}
          openParking={openParking}
          groundFloors={groundFloors}
          basementFloors={basementFloors}
          idValidatar={idValidatar}
          identifier={propTypeId}
          title={propertyName}
          onButtonClick={onEditPopUpSave}
          onUploadBtnClick={onUploadBtnClick}
          onRemoveImage={onRemoveImage}
          floorplanImageFile={
            editPopUpData != undefined &&
              editPopUpData.floorPlan != undefined &&
              editPopUpData.floorPlan != []
              ? [editPopUpData.floorPlan]
              : []
          }
          floorplanImgUrl={
            editPopUpData != undefined &&
              editPopUpData.floorPlanUrl != undefined &&
              editPopUpData.floorPlanUrl != null
              ? [editPopUpData.floorPlanUrl]
              : []
          }
          onImagePopup={onImagePopup}
          selectedPhase={selectedPhase}
          apartmentTypeList={apartmentTypeList}
        />
      </div> */}

      <div style={{ display: "none", marginTop:"20px" }}  id="loaderForProjectPropertyPage" className="loadDisplayingCon">
        <Loader message="Please wait for few seconds will redirect you to next page" />
      </div>

      <span
        id="messageValidationForNullObjectInPropertyDetaila"
        className="validationaErrorMessageForAllPages"
      ></span>

      <p
        id="MaxAndMinErrMsgOverview"
        style={{ display: "none" }}
        className="validationaErrorMessageForAllPages"
      >
        *Please provide the applicable minimum and maximum values
      </p>

      <SingleButton
        key="propDetailsSubmitButton"
        buttonId="propDetailsSubmitButton"
        containerClassName="postProjectButtonMainCon"
        buttonClassName="postProjectButton propertyDetailsFinalSubmitBtn"
        onSubmit={whileSavingData}
        title="SAVE & CONTINUE"
      />
    </div>
  );
};

export default memo(PropertyDetails);
