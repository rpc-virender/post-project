import React, {useEffect, useState} from "react";
import Input from "./Input";
import { getUnit } from "../apis/userDashboardAPIs";
import { formatPriceToCommaPrice, inWords } from "../images/commonImages";

const SinglePhaseMinAndMaxPriceBlock = ({entity, onChangePricinginner,propTypeId, selectedPhase, index,boxId ,projIdEnc,constData}) => {

    const [jkhnk,setjkhnk] =useState(false);

    // const calcullatePriceValue = (amt, identifier, type) => {
    //     let minCurrenctType = $(`#minPriceCurrencyDropdown_${boxId}_${index}`).val();
    //     let maxCurrenctType = $(`#maxPriceCurrencyDropdown_${boxId}_${index}`).val();

    //     if(amt != undefined && amt != null && amt != 0){
    //         if(type == "min"){
                
    //             if(minCurrenctType == "Thousand"){
    //                 return  amt/1000;
    //             }else if(minCurrenctType == "Crore"){
    //                 return  amt/10000000;
    //             }else{
    //                 return  amt/100000;
    //             }
    //         }else if(type=="max"){
    //             if(maxCurrenctType == "Thousand"){
    //                 return  amt/1000;
    //             }else if(maxCurrenctType == "Crore"){
    //                 return  amt/10000000;
    //             }else{
    //                 return  amt/100000;
    //             }
    //         }
    //     }
    // };


    return(
        <div id={`MinAndMaxPriceBlock${entity.bhkId}`} className="pricingPropBoxInDropdownACRMAXMIN">               
            <div className="pricingPropBoxHeadingACRMAXMINFirstcon">
               {/* {propTypeId == projectprops.plot ? entity.bhk:map.get(entity.bhk)} */}
               <p>
               { entity.bhkCustom != undefined && entity.bhkCustom != null && entity.phaseId == selectedPhase && entity.proptypeId == propTypeId ? 
                        entity.bhkCustom  : entity.bhkId != undefined && entity.bhkId != null && entity.phaseId == selectedPhase && entity.proptypeId == propTypeId ? getUnit(entity.bhkId,constData.bhktype)
                : ""
                }
                </p>
            </div>

            <div className="pricingPropBoxInnerRightSideConMAXMIN">
                <p className="pricingPropBoxTextACRMAXMIN">Price Range</p>

                <p className="pricingLableACRMAXMIN">Minimum<span className="requiredStar">*</span></p>

                <div className="postPropMinAndMaxPriceInputMainCon" >
                    <div className="postPropMinAndMaxPriceInputCon" id={`min_price_border_${entity.bhkId}_${propTypeId}`}>
                        <span className="postPropMinAndMaxPriceRupeesText">₹ |</span>


                        <Input
                            required = "false"
                            inputId={`minPrice_${propTypeId}_${index}`}
                            name="minPrice"
                            onChange={(e)=>onChangePricinginner(e, e.target.value ,"minPrice" , entity.bhkId, propTypeId, projIdEnc , selectedPhase, boxId, index)}
                            placeholder="Minimum Price..."
                            type="number"
                            className="postPropMinAndMaxPriceInput"
                            disabled={false}
                            hide="false"
                            containerClassName="postPropMinAndMaxPriceInputFieldCon"
                            inputOuterContainerClassName="postPropMinAndMaxPriceInputInnerCon"
                            outerContainerClassName="postPropMinAndMaxPriceInputOuterCon"
                            label=""
                            labelClassName=""
                            label2=""
                            labelClassName2=""
                            value={entity.minPrice != undefined && entity.minPrice != null ?  entity.minPrice : ""}              
                        />


                    </div>
                    {entity != undefined && entity!= null && entity.minPrice != null && entity.minPrice != "" &&
                    <span className="postPropMinAndMaxPriceDisplayText"> {inWords(entity.minPrice)}</span>
                    }
                </div>

                <p className="pricingLableACRMAXMIN">Maximum<span className="requiredStar">*</span></p>

                <div className="postPropMinAndMaxPriceInputMainCon">
                    <div className="postPropMinAndMaxPriceInputCon" id={`max_price_border_${entity.bhkId}_${propTypeId}`}>
                        <span className="postPropMinAndMaxPriceRupeesText">₹ |</span>
                        <Input
                            required = "false"
                            inputId={`maxPrice_${propTypeId}_${index}`}
                            name="maxPrice"
                            onChange={(e) => onChangePricinginner(e,e.target.value,"maxPrice",entity.bhkId,propTypeId,projIdEnc ,selectedPhase,boxId,index)}
                            placeholder="Maximum Price..."
                            type="number"
                            torefresh={jkhnk}
                            className="postPropMinAndMaxPriceInput"
                            hide="false"
                            containerClassName="postPropMinAndMaxPriceInputFieldCon"
                            inputOuterContainerClassName="postPropMinAndMaxPriceInputInnerCon"
                            outerContainerClassName="postPropMinAndMaxPriceInputOuterCon"
                            label=""
                            labelClassName=""
                            label2=""
                            labelClassName2=""
                            value={entity != undefined && entity!= null && entity.maxPrice != null ? entity.maxPrice : ""}                  
                        />

                    </div>

                    {entity != undefined && entity!= null && entity.maxPrice != null && entity.maxPrice != "" &&
                    <span className="postPropMinAndMaxPriceDisplayText"> {inWords(entity.maxPrice)}</span>
                    }

                    
                </div>
                
                <p id={`maxAndMinPriceErrMsg_${propTypeId}_${index}`} style={{display:"none"}} className={`MinAndMaxValuesErrMsg`}>*Minimum value must be smaller than maximum value</p>
                
            </div>
 
        </div>
    )
};

export default SinglePhaseMinAndMaxPriceBlock;