import React, {Fragment, useEffect} from "react";
import $ from 'jquery';

import {formatPriceToCommaPrice, projectprops} from '../../images/commonImages';
import { map } from "../../images/commonImages";


import MinAndMaxPriceBlock from '../../commonComponents/MinAndMaxPriceBlock';
import SingleButton from "../../commonComponents/SingleButton";



const PropertyOverviewComponent = ({propTypeId,newCombinedList, bhktypeData,pricindData,onChangePricing,selectedPhase}) => {

    
    useEffect(() => {

        if(bhktypeData != undefined && bhktypeData != null && bhktypeData.bhktype != undefined ) {
            bhktypeData.bhktype.map(each => {
                map.set(each.cid+"",each.constDesc);
            });
        }

        if(bhktypeData != undefined && bhktypeData != null && bhktypeData.facing != undefined ) {

            bhktypeData.facing.map(each => {
                if(!map.has(each.cid+"")) {map.set(each.cid+"",each.constDesc)};
            });
            
        }

    },[bhktypeData]);

    const onChangePricinginner=(e,value,type,bhk,proptype,obj) => {
        // check it's max and min price

        onChangePricing(value,type,bhk,proptype);
        

        let minValue, maxValue;

        // Retrieve values based on proptype
        if (proptype !== projectprops.plot) {
            maxValue = getValue(`maxPrice_B_esdrf_${bhk}`);
            minValue = getValue(`maxPrice_B_esjkfnddrf_${bhk}`);
        } else {
            minValue = getValue(`maxPrice_B_esjkfnddrf_${bhk}`);
            maxValue = getValue(`maxPrice_B_esdrf_${bhk}`);
        } 

        // Function to retrieve value from DOM element and replace commas
        function getValue(id) {
            const element = document.getElementById(id);
            return element ? parseFloat(element.value.replace(/,/g, '').trim()) : undefined;
        };


        let maxCurrentValue = parseFloat(maxValue);
        let minCurrentValue = parseFloat(minValue);

        $(`#maxAndMinPriceErrMsg_${bhk}`).hide();
  
        if($(`#maxPrice_B_esdrf_${bhk}`).val() != "" && $(`#maxPrice_B_esjkfnddrf_${bhk}`).val() != "" ){
            if (maxCurrentValue != 0 && minCurrentValue != 0) {
                if (maxCurrentValue > minCurrentValue) {
                    $(`#maxAndMinPriceErrMsg_${bhk}`).hide();
                } else {
                    $(`#maxAndMinPriceErrMsg_${bhk}`).show();
                }
            }
        };
    };


    return (
        <Fragment>
           
            <div className="bottomTableCon">
                <div className="propertyTypeTableHeaderCon"> 
                    {propTypeId != projectprops.plot &&
                        <div className="headerBlock bottomTable overviewTableHeader1 overviewTableFirst">Unit Type</div>
                    }

                    {propTypeId != projectprops.plot &&
                        <div className="headerBlock bottomTable overviewTableHeader1">No: of Units</div>
                    }

                    {propTypeId != projectprops.plot &&
                        <div className="headerBlock bottomTable overviewTableHeader2">Total Super Builtup Area (in Sq.ft)</div>
                    }

                    {propTypeId != projectprops.plot &&
                        <div className="headerBlock bottomTable overviewTableHeader2 sideBorder">Total Carpet Area (in Sq.ft)</div>
                    }

                    {propTypeId == projectprops.plot &&
                        <div className="headerBlock bottomTable overviewTableHeader2 overviewTableFirst">Unit Types <br /> (Length x Breadth )</div>
                    }

                    {propTypeId == projectprops.plot &&
                        <div className="headerBlock bottomTable overviewTableHeader1">No: of Plot</div>
                    }

                    {propTypeId == projectprops.plot &&
                        <div className="headerBlock bottomTable overviewTableHeader2 sideBorder">Total Area (in Sq.ft)</div>
                    }
                </div>

                <div className="">
                    {newCombinedList != undefined && newCombinedList.length != 0 &&
                        newCombinedList.map((each, ind) => {
                            if(each.propTypeId == propTypeId){
                            $("#defaultApartmentRow").hide();
                            //setValueFromId(each.bhk != undefined ? each.bhk : ""  );
                            return (
                                <div key={ind} className="propertyTypeTableInputsCon">

                                    {propTypeId != projectprops.plot &&
                                        <div className="inputBlock bottomTable overviewTableHeader1 overviewTableFirst" style={{ background: (ind % 2) == 0 ? "#FCFCFC" : "white" }}>
                                            {/* {each.bhk != undefined ?map.get(each.bhk): ""} */}
                                            { each.bhkCustom != undefined && each.bhkCustom != null && each.phaseId == selectedPhase && each.propTypeId == propTypeId ? 
                                                `${each.bhkCustom} BHK`  : (each.bhk != undefined && each.bhk != null) && (each.phaseId == selectedPhase && each.propTypeId == propTypeId ) ? map.get(each.bhk)
                                            : ""
                                            }
                                        </div>
                                    }

                                    {propTypeId != projectprops.plot &&
                                        <div className="inputBlock bottomTable overviewTableHeader1" style={{ background: (ind % 2) == 0 ? "#FCFCFC" : "white" }}>
                                            {each.noOfUnit != undefined  && (each.phaseId == selectedPhase && each.propTypeId == propTypeId) ? 
                                                formatPriceToCommaPrice(each.noOfUnit) : ""}
                                        </div>
                                    }
                                    

                                    {propTypeId != projectprops.plot &&
                                        <div className="inputBlock bottomTable overviewTableHeader2" style={{ background: (ind % 2) == 0 ? "#FCFCFC" : "white" }}>
                                            {each.sba != undefined && each.phaseId == selectedPhase && each.propTypeId == propTypeId ? 
                                                formatPriceToCommaPrice(Math.round(each.sba*100)/100) : ""}
                                        </div>
                                    }

                                    {propTypeId != projectprops.plot &&
                                        <div className="inputBlock bottomTable overviewTableHeader2 sideBorder" style={{ background: (ind % 2) == 0 ? "#FCFCFC" : "white" }}>
                                            {each.ca != undefined && each.phaseId == selectedPhase && each.propTypeId == propTypeId ? 
                                                formatPriceToCommaPrice(Math.round(each.ca*100)/100) : ""}
                                        </div>
                                    }


                                    {propTypeId == projectprops.plot &&
                                        <div className="inputBlock bottomTable overviewTableHeader2 overviewTableFirst" style={{ background: (ind % 2) == 0 ? "#FCFCFC" : "white" }}>
                                            {each.bhk && each.phaseId == selectedPhase && each.propTypeId == propTypeId ? each.bhk.replaceAll("_"," X ") : ""}

                                        </div>
                                    }

                                    {propTypeId == projectprops.plot &&
                                        <div className="inputBlock bottomTable overviewTableHeader1" style={{ background: (ind % 2) == 0 ? "#FCFCFC" : "white" }}>
                                            {each.noOfUnit && each.phaseId == selectedPhase && each.propTypeId == propTypeId ? 
                                                formatPriceToCommaPrice(each.noOfUnit) : "" }
                                        </div>
                                    }

                                    {propTypeId == projectprops.plot &&
                                        <div className="inputBlock bottomTable overviewTableHeader2 sideBorder" style={{ background: (ind % 2) == 0 ? "#FCFCFC" : "white" }}>
                                            {each.area && each.phaseId == selectedPhase && each.propTypeId == propTypeId ? 
                                                    formatPriceToCommaPrice(Math.round(each.area*100)/100 ): ""}
                                        </div>
                                    }

                                </div>
                            )}
                        })
                    }
                </div>

                <div id="defaultApartmentRow" className="propertyTypeTableInputsCon">

                    {propTypeId != projectprops.plot &&
                        <div className="inputBlock bottomTable overviewTableHeader1">
                            --
                        </div>
                    }

                    {propTypeId != projectprops.plot &&
                        <div className="inputBlock bottomTable overviewTableHeader1">
                            --
                        </div>
                    }

                    {propTypeId != projectprops.plot &&
                        <div className="inputBlock bottomTable overviewTableHeader2">
                            --
                        </div>
                    }

                    {propTypeId != projectprops.plot &&
                        <div className="inputBlock bottomTable overviewTableHeader2">
                            --
                        </div>
                    }

                    {propTypeId == projectprops.plot &&
                        <div className="inputBlock bottomTable overviewTableHeader2">
                            --
                        </div>
                    }

                    {propTypeId == projectprops.plot &&
                        <div className="inputBlock bottomTable overviewTableHeader1">
                            --
                        </div>
                    }

                    {propTypeId == projectprops.plot &&
                        <div className="inputBlock bottomTable overviewTableHeader2">
                            --
                        </div>
                    }

                </div>
            </div>

            {newCombinedList != undefined && newCombinedList.length > 0 &&
            <Fragment >
                <h2 id="projectDetailsMinMaxPricesBlock" className="minAndMaxBoxsHeading">Price Range for Unit Type</h2>
                <p className="minAndMaxBoxsPara">Please provide the Minimum and Maximum price for the unit types you added</p>
            </Fragment>
            }

            {newCombinedList != undefined && newCombinedList.length > 0 &&
            <div className="propertyTypeBtnCon minAndMaxBoxesHoldingCon" >
                {newCombinedList.map((each, ind) => {    
					const bhkData = pricindData !== undefined ? pricindData[each.bhk] : null;
					let object = "";
					
					if (bhkData !== undefined && bhkData !== null && bhkData.length > 0 && selectedPhase !== null ) {
					  object = selectedPhase !== null 
					    ? bhkData.find(each1 => each1 != undefined && each1.phaseId === selectedPhase) 
					    : bhkData[0];
					}

					if(each.propTypeId == propTypeId){  
                        return(
                            <MinAndMaxPriceBlock  
                                key={each.bhk} 
                                    each={each} 
                                    onChangePricinginner={onChangePricinginner}
                                    propTypeId={propTypeId}
                                    object={object}
                                    map={map}
                                selectedPhase={selectedPhase}
                            />
                        )
                    }
                })}
            </div>
            }

        </Fragment>

    )
    }


export default PropertyOverviewComponent;