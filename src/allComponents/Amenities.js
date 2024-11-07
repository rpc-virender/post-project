import React, { useState, useEffect, memo } from "react";
import $ from 'jquery';

import '../styles/projectAmenities.css';

import Input from "../commonComponents/Input";
import SingleButton from "../commonComponents/SingleButton";
import { amenitiesGroupList } from "../images/commonImages";
import Loader from "../commonComponents/Loader";
import { amenityDefaultIcon, CarosalScrollIcon, crossIconSvg, MiniItemsCrossMark } from "../images/commonSvgs";
import HeaderContent from "./HeaderContent";

const Amenities = ({onNextclick, amenitiesFromDB, amenitiesData, setAmenitiesData, customAmenities,
                    isEdit, errorIds, onAddCustomAmenities, newCustomAmenity, page}) => {

  const [word, setWord] = useState("");
  const keys = amenitiesFromDB ? Object.keys(amenitiesFromDB) : [];
  useEffect(() => {
    if (isEdit === true) {
      if (amenitiesData !== undefined) {
        amenitiesData.forEach((item) => {
          $("#img_" + item).css("opacity", 1);
          $("#amenityName_" + item).addClass("selectedAmenityName");
        });
      }
    }
  }, [amenitiesData]);

  const onAmenitySelect = (cid) => {
    // selectedAmenityName - for names css selector
    // opacity : 1 - for selected and 0.1 for unSelected
    let data = [...amenitiesData];

    if (!data.includes(cid)) {
      data.push(cid);
      $("#img_" + cid).css("opacity", 1);
      $("#amenityName_" + cid).addClass("selectedAmenityName");
    } else {
      const itemIndex = data.indexOf(cid);
      data.splice(itemIndex, 1);
      $("#img_" + cid).css("opacity", 0.1);
      $("#amenityName_" + cid).removeClass("selectedAmenityName");
    }
    setAmenitiesData(data);
  };

  const onValueChangeBySearch = (e) => {
    if(e.target.value[0] !== " "){
      setWord(e.target.value);
    }
  };

  useEffect(() => {
    amenitiesData.map((eachId) => {
      $("#img_" + eachId).css("opacity", 1);
      $("#amenityName_" + eachId).addClass("selectedAmenityName");
    });
  }, [word]);

  const onScrollingLeftAndRight = (direction) => {
    //amenitiesBoxsDisplayCon
    if (direction === "L") {
      document.getElementById("amenitiesBoxsDisplayCon").scrollLeft -= 200;
    } else {
      document.getElementById("amenitiesBoxsDisplayCon").scrollLeft += 200;
    }
  };

  let matchedBranches = [];

  const isMatched = (name) => {
    var each = name.toLowerCase().replace(/\s+/g, ' ').trim();
    var result = each.includes(word.toLowerCase().replace(/\s+/g, ' ').trim());
    return result;
  };


  return (
    <div className="PropjectAmenitiesMainCon" id="amenityContainer">
      {page && page === "prop" &&
      <HeaderContent headerText="Please Specify The Amenities" contentText="Please select the features from the given amenities" />
      }
      
      {/* DISPLAYING Selected Amenities Names */}
      {amenitiesData !== undefined && amenitiesData != null && amenitiesData.length !== 0 && (
          <div className="displayingAmenitiesMainCon">
            <h3 className="customAmenitiesBoxsHeading">amenities added</h3>
            <div className="AmenitiesDisplayingTopMainContainer">
              {amenitiesData !== undefined && amenitiesData != null && amenitiesData.length > 1 &&
              <CarosalScrollIcon
                key="amenityScrollLeft"
                id="amenityScrollLeft"
                className="amenitiesDisplayingScrollButtons"
                onClick={() => onScrollingLeftAndRight("L")}
              />
              }

              <div className="AmenitiesBoxsTopCon" id="amenitiesBoxsDisplayCon">
                  {keys.map((group) => {
                      return amenitiesFromDB && amenitiesFromDB[group] &&
                          Object.keys(amenitiesFromDB[group]).map((eachSub) => {
                            return amenitiesFromDB[group][eachSub] && amenitiesFromDB[group][eachSub].map(eachOne=>{
                              if(amenitiesData.includes(eachOne.cid)){
                                return (
                                  <div key={`display_Amenities_${eachOne.cid}`} className="customAmenitiesItemsCon amenitiyDisplayingText" id={`displayningAmenityBox_${eachOne.cid}`}>
                                      {group} | {eachOne.constDesc}
                                      <span className="amenityCrossIcon" onClick={() => onAmenitySelect(eachOne.cid)}>
                                          {crossIconSvg}
                                      </span>
                                  </div>
                                );
                              }
                            })
                          }
                      )}
                  )}
              </div>

              {amenitiesData !== undefined && amenitiesData != null && amenitiesData.length > 1 &&
              <CarosalScrollIcon
                key="amenityScrollRight"
                id="amenityScrollRight"
                className="amenitiesDisplayingScrollButtons amenityLeftArrowIcon"
                onClick={() => onScrollingLeftAndRight("R")}
              />
              }
            </div>
          </div>
      )}
      <h2 className="searchAmenityHeadings">Search Amenities</h2>

      <div className="searchAmenityFieldCon">
        <Input
          required="false"
          key="amenitySearch"
          inputId="amenitySearch"
          name="projectame"
          onChange={onValueChangeBySearch}
          type="search"
          className="searchAmenityField"
          containerClassName="AminputContainer"
          inputOuterContainerClassName="AminputOuterContainer"
          label2={<p className="aminityLableElement">
            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
              <path d="M21.9159 22.895C22.4143 23.3933 23.1834 22.6242 22.6851 22.1367L18.6226 18.0633C20.0477 16.4866 20.8354 14.4362 20.8326 12.3108C20.8326 7.555 16.9651 3.6875 12.2093 3.6875C7.45344 3.6875 3.58594 7.555 3.58594 12.3108C3.58594 17.0667 7.45344 20.9342 12.2093 20.9342C14.3543 20.9342 16.3368 20.1433 17.8534 18.8325L21.9159 22.895ZM4.66819 12.3108C4.66819 8.15083 8.05902 4.77083 12.2082 4.77083C16.3682 4.77083 19.7482 8.15083 19.7482 12.3108C19.7482 16.4708 16.3682 19.8508 12.2082 19.8508C8.05902 19.8508 4.66819 16.4708 4.66819 12.3108Z" fill="#242424"/>
            </svg>
            Search amenities
            </p>}
          labelClassName2={`searchAmenityFieldLable ${word !== "" ? "hideLable" : ""}`}
          value={word}
        />
      </div>

      {/* Displaying All Amenities */}
      {keys.map((group) => {
        var subGroupKeys = []; 
        let tempArray = [];

        if(amenitiesFromDB && amenitiesFromDB[group] && Object.keys(amenitiesFromDB[group]).length > 0){
            subGroupKeys = [...Object.keys(amenitiesFromDB[group])];
            
            subGroupKeys.map(sunG=>{
                let testBranchAme = amenitiesFromDB[group][sunG];
                testBranchAme.map((eachO)=>{
                    if(isMatched(eachO.constDesc)){
                      tempArray = [...tempArray, group];
                    }
                });
            })
        };

        if(word !== ""){
          if(tempArray.length > 0 && !matchedBranches.includes(group)){
            matchedBranches = [...matchedBranches, group];
          }else{
            let items = matchedBranches.filter(item=>item !== group);
            matchedBranches = items
          }
        };

        if (tempArray.length > 0) {
            return (
                <div className="subGroupDataMainBlock">
                  <h2 className="amenityGroupHeading"><hr/>{group}</h2>
                    <ul className="subGroupDataBlock">
                        {subGroupKeys.map(eachSubGrouup=>{
                            let branchAmenities = amenitiesFromDB[group][eachSubGrouup];
                            let ameLength;
                            if(word !== "") ameLength = branchAmenities.filter(each=>isMatched(each.constDesc)).length;
                            if(ameLength > 0 || word === ""){
                            return(
                                <li key={eachSubGrouup} className="amenitySubGroupCon">
                                    <p className="amenitySubGroupHeading">{eachSubGrouup}</p>

                                    <div key={eachSubGrouup} id={eachSubGrouup} className="amenityBoxsContainer">
                                        {branchAmenities.map(eachOne => {
                                          if(isMatched(eachOne.constDesc)){
                                            return(
                                              <div id={`sub_group_con_${eachOne.cid}`} key={`ametities_${eachOne.cid}`} className="amenityBox">
                                                  <Input
                                                      key={`ametitiesCheckBox_${eachOne.cid}`}
                                                      required="false"
                                                      inputId={`amenityCheckbox_${eachOne.cid}`}
                                                      name="priceThree"
                                                      onChange={()=>onAmenitySelect(eachOne.cid)}
                                                      type="checkbox"
                                                      className="newAmenityCheckbox"
                                                      value={eachOne.cid}
                                                      checked={
                                                        amenitiesData && amenitiesData.length !== undefined && amenitiesData.length !== 0 &&
                                                        amenitiesData.includes(eachOne.cid) ? true : false
                                                      }
                                                  />

                                                  <span id={`img_${eachOne.cid}`} className="amenityImage" >
                                                    {amenitiesGroupList.get(eachOne.cid) !== undefined &&
                                                    amenitiesGroupList.get(eachOne.cid) != null
                                                      ? amenitiesGroupList.get(eachOne.cid) : amenityDefaultIcon
                                                    }
                                                  </span>

                                                  <label
                                                    id={`amenityName_${eachOne.cid}`}
                                                    className="amenityName"
                                                    onClick={() => onAmenitySelect(eachOne.cid)}
                                                  >
                                                    {eachOne.constDesc}
                                                  </label>
                                              </div>
                                            )
                                          }else{ 
                                            branchAmenities = [];
                                          }
                                        })}
                                    </div>
                                </li>
                            )}
                          }
                        )}
                    </ul>
                </div>
            )
        }
      })}

      {matchedBranches.length === 0 && word !== "" &&
          <div className="noMatchAmenitiesText">Sorry, no amenities available for your search criteria.</div>
      }

      <h2 id="custoAmenityHeadings" className="customAmenityHeading">Add Custom Amenities</h2>
      {/* DISPLAYING CUSTOM Amenities */}
      {customAmenities && customAmenities.length !== 0 && (
          <div className="customAmenitiesBoxsCon">
              {customAmenities.map((eachItem, ind) => {
                  if(eachItem !== undefined && eachItem !== null && eachItem !== ""){
                    return (
                      <div key={`custom_${ind}`} className="customAmenitiesItemsCon">
                          {eachItem}
                          <MiniItemsCrossMark 
                              key={`customCross_${ind}`} 
                              onClick={() => onAddCustomAmenities("delete", eachItem)} 
                              className="amenityCrossIcon" 
                          />
                      </div>
                    )
                  }
                })}
          </div>
      )}

      {/* ADDING CUSTOM Amenities */}
      <div className="addCustomMainCon">
        <Input
          required="false"
          key="addCustomAmenity"
          inputId="addCustomAmenity"
          placeholder="+ Add Custom Amenities"
          type="text"
          className="addCustomInputField"
          containerClassName="addCustomInputFieldCon"
          inputOuterContainerClassName="addCustomOuterContainer"
          onChange={(e)=>onAddCustomAmenities("text", e.target.value)}
          maxCheracterLimit={100}
          hideErrorMsg={true}
          value={newCustomAmenity}
        />

        <SingleButton
          key="customAmenitiesButton"
          buttonId="customAmenitiesButton"
          containerClassName="addCustomButtonOuterCon"
          buttonClassName="addCustomButton"
          onSubmit={()=>onAddCustomAmenities("add")}
          title="Click to Add More"
        />
      </div>
      <span id="customAmenityErrMessage" className="validationaErrorMessageForAllPages"></span>

      <div id="loaderForProjectamenities" style={{ display: "none" }}>
        <Loader message="Please wait for few seconds will redirect you to next page" />
      </div>

      {errorIds !== undefined && errorIds != null && errorIds.length !== undefined && errorIds.length !== 0 &&
          <span className="validationaErrorMessageForAllPages">
            Note: * Is mandatory to Add the Amenities.
          </span>
      }

      <SingleButton
        key="UserTypeSelectButton"
        buttonId="UserTypeSelectButton"
        containerClassName="postProjectAmenityBtnCon"
        buttonClassName="postProjectAmenityBtn"
        onSubmit={onNextclick}
        title="SAVE & CONTINUE"
      />
    </div>
  );
};

export default memo(Amenities);
