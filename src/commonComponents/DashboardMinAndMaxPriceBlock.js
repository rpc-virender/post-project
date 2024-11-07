import React, {useEffect, useState} from "react";
import Input from "./Input";
import { getUnit } from "../apis/userDashboardAPIs";
import { formatPriceToCommaPrice, inWords, projectprops } from "../images/commonImages";

const DashboardMinAndMaxPriceBlock = ({entity, onChangePricinginner,propTypeId, selectedPhase, index,boxId ,projIdEnc,constData}) => {


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
        <div id={`MinAndMaxPriceBlock${ propTypeId == projectprops.plot ? entity.dimentions :entity.bhkId}`} className="pricingPropBoxInDropdownACRMAXMIN">               
            <div className="pricingPropBoxHeadingACRMAXMINFirstcon">
               {/* {propTypeId == projectprops.plot ? entity.bhk:map.get(entity.bhk)} */}
                <p>
                    {entity.proptypeId != null && entity.proptypeId === projectprops.plot ? `(${entity.dimentions.replace("_"," X ")}) sq.ft` : 
                        entity.bhkCustom != undefined && entity.bhkCustom != null && entity.phaseId == selectedPhase && 
                        entity.proptypeId == propTypeId ? 
                        `${entity.bhkCustom} BHK`  : entity.bhkId != undefined && entity.bhkId != null && entity.phaseId == selectedPhase && entity.proptypeId == propTypeId ? 
                            getUnit(entity.bhkId,constData.bhktype)
                            : ""
                    }
                </p>
            </div>

            <div className="pricingPropBoxInnerRightSideConMAXMIN">
                <p className="pricingPropBoxTextACRMAXMIN">Price Range</p> 

                <p className="pricingLableACRMAXMIN">Minimum<span className="requiredStar">*</span></p>

                <div className="postPropMinAndMaxPriceInputMainCon" >
                    <div 
                        className="postPropMinAndMaxPriceInputCon" 
                        id={`min_price_border_${propTypeId == projectprops.plot ? entity.dimentions :entity.bhkId}_${propTypeId}_${entity.phaseId+""}`}
                    >
                        <span className="postPropMinAndMaxPriceRupeesText">₹ |</span>

                        <Input
                            required = "false"
                            key={`minPrice_${propTypeId}_${index}`} 
                            inputId={`minPrice_${propTypeId}_${index}`} 
                            name="minPrice"
                            onChange={(e)=>onChangePricinginner(e, e.target.value ,"minPrice" , propTypeId == projectprops.plot ? 
                                entity.dimentions : entity.bhkId, propTypeId, projIdEnc , selectedPhase, boxId, index)}
                            placeholder="Minimum Price..."
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9\s]{13,19}" 
                            className="postPropMinAndMaxPriceInput"
                            containerClassName="postPropMinAndMaxPriceInputFieldCon"
                            inputOuterContainerClassName="postPropMinAndMaxPriceInputInnerCon"
                            outerContainerClassName="postPropMinAndMaxPriceInputOuterCon"
                            value={entity.minPrice != undefined && entity.minPrice != null ?  formatPriceToCommaPrice(`${entity.minPrice}`) : ""}              
                        />
                    </div>
                    {entity != undefined && entity!= null && entity.minPrice != null && entity.minPrice != "" &&
                    <span className="postPropMinAndMaxPriceDisplayText"> {inWords(entity.minPrice)}</span>
                    }
                </div>

                <p className="pricingLableACRMAXMIN">Maximum<span className="requiredStar">*</span></p>

                <div className="postPropMinAndMaxPriceInputMainCon">
                    <div className="postPropMinAndMaxPriceInputCon" id={`max_price_border_${ propTypeId == projectprops.plot 
                        ? entity.dimentions : entity.bhkId}_${propTypeId}_${entity.phaseId+""}`}>
                        <span className="postPropMinAndMaxPriceRupeesText">₹ |</span>
                        <Input
                            required = "false"
                            key={`maxPrice_${propTypeId}_${index}`}
                            inputId={`maxPrice_${propTypeId}_${index}`}
                            name="maxPrice"
                            onChange={(e) => onChangePricinginner(e, e.target.value,"maxPrice", propTypeId == projectprops.plot ?
                             entity.dimentions : entity.bhkId,propTypeId,projIdEnc ,selectedPhase,boxId,index)}
                            placeholder="Maximum Price..."
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9\s]{13,19}"
                            className="postPropMinAndMaxPriceInput"
                            containerClassName="postPropMinAndMaxPriceInputFieldCon"
                            inputOuterContainerClassName="postPropMinAndMaxPriceInputInnerCon"
                            outerContainerClassName="postPropMinAndMaxPriceInputOuterCon"
                            value={entity != undefined && entity!= null && entity.maxPrice != null ? formatPriceToCommaPrice(`${entity.maxPrice}`) : ""}       
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

export default DashboardMinAndMaxPriceBlock;