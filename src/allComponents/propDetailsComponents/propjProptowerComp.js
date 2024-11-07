import React, { Fragment, useEffect, useState } from "react";
import $ from 'jquery';
import Input from "../../commonComponents/Input";
import RangeSlider from "../../commonComponents/RangeSlider";
import { DropdownArrowIcon } from "../../images/commonSvgs";
import Dropdown from "../../commonComponents/Dropdown";

const ProjProptowerComp = ({ ontowerDetailsChange, towers, towerCount }) => {

  const elevationList = [
      {
        id:"elevationGround",
        name:"Ground",
      },{
        id:"elevationStilt",
        name:"Stilt",
      },{
        id:"groundAndStilt",
        name:"Stilt+Ground",
      },
      {
        id:"none",
        name:"Not Applicable",
      },
  ];

  return (
    <React.Fragment>
      {towerCount !== undefined && towerCount > 0 && 
        <div className="TowersMainHeadingCon">
          <h1 className="headerTowerpara">Tower Details</h1>
        </div>
      }
    <div id="towerCardsCon" className="apartmentTowerAndElevationCardsHoldingCon">
      <div id="towerDataToggogle" className="towerDataToggogle">
        {towers != undefined && towers != null && towers.map((each, ind) => {
            if (ind > 4) {
              $("#towerCardsCon").addClass("apartmentTowerCardsConScrollingClass");
            }
            if (towerCount != undefined && towerCount != null && ind < towerCount ) {
              return (
                <div
                  id="apartmentTowerAndElevationCard"
                  key={`${ind}`}
                  className="apartmentTowerAndElevationCard"
                >
                  <div className="aptTowerAndEleCardTowerCon">
                    Tower-{ind + 1}
                  </div>
                  
                  <div className="aptTowerAndEleCardRightSideCon">
                    {towerCount > 1 &&
                    <Input
                        key={`towerName_${ind}`}
                        required="true"
                        inputId={`towerName_${ind}`}
                        name="towerName"
                        onChange={(e) => ontowerDetailsChange(e, ind, each)}
                        placeholder="Enter Tower Name"
                        type="text"
                        className="aptTowerAndEleCardInput"
                        containerClassName="aptTowerAndEleCardInputCon"
                        outerContainerClassName="aptTowerAndEleCardInputInnerCon"
                        inputOuterContainerClassName="aptTowerAndEleCardInputOuterCon"
                        label="Tower Name"
                        labelClassName="aptTowerAndEleCardInputLable"
                        hideErrorMsg={true}
                        value={
                          each != undefined &&
                          each.towerName != undefined &&
                          each.towerName != null
                            ? each.towerName + ""
                            : ""
                        }
                        maxCheracterLimit={45}
                    />
                    }

                    <p className="aptTowerAndEleCardEleHeading">
                      Elevations <span className="requiredStar">*</span> |
                    </p>

                    <div className="aptTowerAndEleCardBasementBlock">
                      <Input
                        key={`basement_${ind}`}
                        required="false"
                        inputId={`basement_${ind}`}
                        name="elevationBasement"
                        onChange={(e) => ontowerDetailsChange(e, ind, each)}
                        type="number"
                        className="aptTowerAndEleCardBasementInput"
                        containerClassName="aptTowerAndEleCardBasementInputCon"
                        outerContainerClassName="aptTowerAndEleCardBasementInputInnerCon"
                        inputOuterContainerClassName="aptTowerAndEleCardBasementInputOuterCon"
                        label="Basement"
                        labelClassName="aptTowerAndEleCardInputLable"
                        value={
                          each != undefined &&
                          each.elevationBasement != undefined &&
                          each.elevationBasement != null
                            ? each.elevationBasement + ""
                            : ""
                        }
                      />

                      <RangeSlider
                        key={`elevationBasement_slider_${ind}`}
                        data={
                          each != undefined &&
                          each.elevationBasement != undefined &&
                          each.elevationBasement != null &&
                          each.elevationBasement != ""
                            ? each.elevationBasement
                            : 0
                        }
                        points={5}
                        name="elevationBasement"
                        coInputFieldId="elevationBasementForAppartment"
                        rangeSliderMainContainer="aptTowerAndEleCardSliderMainCon"
                        id={`elevationBasement_slider_${ind}`}
                        onChange={(e) => ontowerDetailsChange(e, ind, each)}
                      />
                    </div>

                    {/* Podium */}
                    <div className="aptTowerAndEleCardBasementBlock">
                      <Input
                        key={`podium_${ind}`}
                        required="false"
                        inputId={`podium_${ind}`}
                        name="noOfPodium"
                        onChange={(e) => ontowerDetailsChange(e, ind, each)}
                        type="number"
                        className="aptTowerAndEleCardBasementInput"
                        containerClassName="aptTowerAndEleCardBasementInputCon"
                        outerContainerClassName="aptTowerAndEleCardBasementInputInnerCon"
                        inputOuterContainerClassName="aptTowerAndEleCardBasementInputOuterCon"
                        label="Podium"
                        labelClassName="aptTowerAndEleCardInputLable"
                        value={ each != undefined && each.noOfPodium != undefined && each.noOfPodium != null ? each.noOfPodium + "" : "" }
                      />

                      <RangeSlider
                        key={`podium_slider_${ind}`}
                        data={
                          each != undefined && each.noOfPodium != undefined && each.noOfPodium != null && each.noOfPodium != ""
                            ? each.noOfPodium : 0
                        }
                        points={5}
                        name="noOfPodium"
                        coInputFieldId="podiumForAppartment"
                        rangeSliderMainContainer="aptTowerAndEleCardSliderMainCon"
                        id={`podium_slider_${ind}`}
                        onChange={(e) => ontowerDetailsChange(e, ind, each)}
                      />
                    </div>

                    <div Id={`elevationAndFloorCon_${ind}`} className="aptTowerAndEleCardGroundBlock">
                      <Dropdown
                          key={`elevationTypedropdown_${ind}`}
                          required = "true"
                          inputId={`elevationTypedropdown_${ind}`}
                          name="elevation"
                          onChange={(e)=>ontowerDetailsChange(e, ind, each)}
                          placeholder="Select Elevation"
                          className="newElevationDropdown"
                          containerClassName= "newElevationDropdownCon"
                          inputOuterContainerClassName="newElevationDropdownOuterCon"
                          dropdownArray={elevationList}
                          value={
                            each != undefined && each.elevationGround != undefined && each.elevationGround != null
                            ? "elevationGround"
                            : each != undefined && each.elevationStilt != undefined && each.elevationStilt != null
                            ? "elevationStilt"
                            : each != undefined && each.groundAndStilt != undefined && each.groundAndStilt != null
                            ? "groundAndStilt"
                            : each != undefined && each.totalFloor != undefined && each.totalFloor != null
                            ? "none" : ""
                          }
                      />

                      {(each.elevationGround !== undefined || each.elevationStilt !== undefined || each.groundAndStilt !== undefined || 
                      (each.totalFloor !== undefined)) &&
                      <Fragment>
                        <hr className="elevationBlockHrLine" />

                        <Input
                          key={`groundAndStiltNOoOfFloors_${ind}`}
                          required="true"
                          inputId={`groundAndStiltNOoOfFloors_${ind}`}
                          name={each != undefined && each.elevationGround != undefined && each.elevationGround != null
                            ? "elevationGround"
                            : each != undefined && each.elevationStilt != undefined && each.elevationStilt != null
                            ? "elevationStilt"
                            : each != undefined && each.groundAndStilt != undefined && each.groundAndStilt != null
                            ? "groundAndStilt"
                            : "totalFloor"
                          }
                          onChange={(e) => ontowerDetailsChange(e, ind, each)}
                          placeholder="Add No:of Floors"
                          type="number"
                          className="elevationsNumberFied"
                          containerClassName="elevationsNumberFiedCon"
                          outerContainerClassName="elevationsNumberFiedInnerCon"
                          inputOuterContainerClassName="elevationsNumberFiedOuterCon"
                          hideErrorMsg={true}
                          value={
                            each != undefined && each.elevationGround != undefined && each.elevationGround != null
                              ? each.elevationGround
                              : each != undefined && each.elevationStilt != undefined && each.elevationStilt != null
                              ? each.elevationStilt
                              : each != undefined && each.groundAndStilt != undefined && each.groundAndStilt != null
                              ? each.groundAndStilt
                              : each != undefined && each.totalFloor != undefined && each.totalFloor != null
                              ? each.totalFloor : ""
                          }
                          // maxCheracterLimit={{type: "INT"}}
                        />
                      </Fragment>
                      }
                    </div>
                  </div>
                </div>
              );
            }
          })}
      </div>
    </div>
    </React.Fragment>
  );
};

export default ProjProptowerComp;
