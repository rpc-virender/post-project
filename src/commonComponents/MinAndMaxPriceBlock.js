import React from "react";
import $ from 'jquery';
import Input from "../commonComponents/Input";
import { projectprops, formatPriceToCommaPrice, inWords } from "../images/commonImages";

const MinAndMaxPriceBlock = ({each, onChangePricinginner,propTypeId, map, selectedPhase, object}) => {
    
    const handleChange = (event, type, bhk, propId, obj,phaseId) => {
        
        //if(event.target.name == "minPrice"){
            $(`#min_price_border_${bhk+""}_${propId+""}_${phaseId+""}`).css("border-color", "#4D6677");
        //}else{
            $(`#max_price_border_${bhk+""}_${propId+""}_${phaseId+""}`).css("border-color", "#4D6677");
            $(`#maxAndMinPriceErrMsg_${bhk}`).hide();
        //}

        const { value: inputValue } = event.target;
        //Adding commas {","} directly to the field---
        event.target.value = formatPriceToCommaPrice(inputValue);

        //removing commas {","} for saving data---
        let val = event.target.value.replace(/\,/g,'');
        
        if (parseFloat(val) < 500000001 || val === "" ) {
            onChangePricinginner(event, val, type, bhk, propId, obj);
        }
    };

    return(
        <div id={`MinAndMaxPriceBlock${each.bhk}`} className="pricingPropBoxInDropdownACRMAXMIN">               

            <p className="pricingPropBoxHeadingACRMAXMINFirstcon">
               { each.bhkCustom != undefined && each.bhkCustom != null && each.phaseId == selectedPhase && each.propTypeId == propTypeId ? 
                `${each.bhkCustom} BHK- Price Range`: 
                    each.bhk != undefined && each.bhk != null && each.phaseId == selectedPhase && each.propTypeId == propTypeId ?
                        propTypeId==projectprops.plot ? 
                        `${each.bhk.replaceAll("_"," X ")}- Price Range`
                        : 
                        `${map.get(each.bhk)}- Price Range`
                      
                : ""
                }
            </p>

            <div className="pricingPropBoxInputsCon">
                <div className="pricingPropBoxInputBoxCon">
                    <p className="pricingLableACRMAXMIN">Minimum Price<span className="requiredStar">*</span></p>

                    <div className="postPropMinAndMaxPriceInputMainCon" >
                        <div className="postPropMinAndMaxPriceInputCon" 
                            id={`min_price_border_${each.bhk+""}_${each.propTypeId+""}_${each.phaseId+""}`}>
                            <span className="postPropMinAndMaxPriceRupeesText">₹ |</span>
                            <Input
                                key={`maxPrice_B_esjkfnddrf_${each.bhk}`}
                                required = "false"
                                inputId={`maxPrice_B_esjkfnddrf_${each.bhk}`}
                                name="minPrice"
                                onChange={(e) => handleChange(e, "minPrice",each.bhk,propTypeId,object,each.phaseId)}
                                placeholder="Eg- 1,60,55,000"
                                type="text"
                                className="postPropMinAndMaxPriceInput"
                                inputmode="numeric"
                                pattern="[0-9\s]{13,19}"
                                hide="false"
                                containerClassName="postPropMinAndMaxPriceInputFieldCon"
                                inputOuterContainerClassName="postPropMinAndMaxPriceInputInnerCon"
                                outerContainerClassName="postPropMinAndMaxPriceInputOuterCon"
                                label=""
                                labelClassName=""
                                label2=""
                                labelClassName2=""
                                //value={object != undefined && object != null && object.minPrice != null ? object.minPrice  : ""} 
                                value={object != undefined && object != null && object.minPrice != null ? formatPriceToCommaPrice(`${object.minPrice}`)  : ""}                  
                            />
                        </div>
                        {object != undefined && object!= null && object.minPrice != null && object.minPrice != "" ?
                        <span className="postPropMinAndMaxPriceDisplayText">{inWords(object.minPrice)}</span>
                        :
                        <span className="postPropMinAndMaxPriceDisplayText">Eg- ₹ One Crore Sixty Lakhs Fifty Five Thousand</span>
                        }
                    </div>
                </div>

                <div className="pricingPropBoxInputBoxCon">
                    <p className="pricingLableACRMAXMIN">Maximum Price<span className="requiredStar">*</span></p>

                    <div className="postPropMinAndMaxPriceInputMainCon">
                        <div className="postPropMinAndMaxPriceInputCon" 
                            id={`max_price_border_${each.bhk+""}_${each.propTypeId+""}_${each.phaseId+""}`}>
                            <span className="postPropMinAndMaxPriceRupeesText">₹ |</span>
                            <Input
                                key={`maxPrice_B_esdrf_${each.bhk}`}
                                required = "false"
                                inputId={`maxPrice_B_esdrf_${each.bhk}`}
                                name="maxPrice"
                                onChange={(e) => handleChange(e, "maxPrice",each.bhk,propTypeId,object,each.phaseId)}
                                placeholder="Eg- 4,60,55,000"
                                type="text"
                                className="postPropMinAndMaxPriceInput"
                                inputMode="numeric"
                                pattern="[0-9\s]{13,19}"
                                hide="false"
                                containerClassName="postPropMinAndMaxPriceInputFieldCon"
                                inputOuterContainerClassName="postPropMinAndMaxPriceInputInnerCon"
                                outerContainerClassName="postPropMinAndMaxPriceInputOuterCon"
                                label=""
                                labelClassName=""
                                label2=""
                                labelClassName2=""
                                value={object != undefined && object != null && object.maxPrice != null ? formatPriceToCommaPrice(`${object.maxPrice}`)  : ""}                  
                            />
                        </div>

                        {object != undefined && object!= null && object.maxPrice != null && object.maxPrice != "" ?
                        <span className="postPropMinAndMaxPriceDisplayText"> {inWords(object.maxPrice)}</span>
                        :
                        <span className="postPropMinAndMaxPriceDisplayText"> Eg- ₹ Four Crore Sixty Lakhs Fifty Five Thousand</span>
                        }

                        
                    </div>
                </div>
                
            </div>

            <p id={`maxAndMinPriceErrMsg_${each.bhk}`} style={{display:"none"}} className={`MinAndMaxValuesErrMsg`}>*Minimum value must be smaller than maximum value</p>
 
        </div>
    )
};

export default MinAndMaxPriceBlock;