import React, { useState, useEffect, Fragment } from "react";
import $ from 'jquery';

import {DropdownArrowIcon} from '../images/commonSvgs';

const SingleSelectBySeaechDropdown = ({
                inputId, name, onChange, value,
                placeholder, searchFieldPlaceholder,
                className, containerClassName,  outerContainerClassName, inputOuterContainerClassName,
                label, label2, labelClassName, labelClassName2, labelTwoPositionClass,
                required, disabled, readOnly, 
                dropdownArray, addPlusOption,
                hideSearhInputField, hide, radioFieldShow, compnayDetailsErrorMsg, errMsg, custumOption, custumOptionClass, showCheckBox,
                singleSelectDropdownClassName, singleSelectDropdownItemsClassName, dropdownItemClassName, arrowIconClass,isProjSearch,onProjSearch, isInputSearch
            }) => {
        
    useEffect(() => {
		if(value !== undefined && value != null && value !== "" ){
			setValueFromId(value);
            if(labelTwoPositionClass === undefined){
                $(`#singleSelectedDropdownLableTwo_${inputId}`).addClass("afterSelectedLableClass");
            }else{
                $(`#singleSelectedDropdownLableTwo_${inputId}`).addClass(labelTwoPositionClass);
            }

			if(dropdownArray !== undefined && dropdownArray != null && dropdownArray.length !== undefined && dropdownArray.length >0 ){
				setValueFromId(value);
            	$(`#${inputId}`).css("border" , "0.8px solid var(--Brand-green-primary, #148B16)");
			}
			
		}else{
            $("#"+inputId).val("");
            $(`#${inputId}`).css("border" , "0.8px solid var(--GREY4, #C9C9C9)");

            if(labelTwoPositionClass === undefined){
                $(`#singleSelectedDropdownLableTwo_${inputId}`).removeClass("afterSelectedLableClass");
            }else{
                $(`#singleSelectedDropdownLableTwo_${inputId}`).removeClass(labelTwoPositionClass);
            }

        }
	},[value,dropdownArray]);

	
	const setValueFromId =(value) => {
		dropdownArray.map(each=>{
		    if(each.cid !== undefined && each.cid == value){
				$("#"+inputId).val(each.constDesc);
				return;
			}else if(each.id !== undefined && each.id === value){
                $("#"+inputId).val(each.name);
				return;
			}else if(each !== undefined && each === value){
                $("#"+inputId).val(each);
				return;
			}else if(each != null && each.phaseId === value){
				$("#"+inputId).val(each.phaseName);
				return;
			}else if(value === ""){
				$("#"+inputId).val("");
			}else if(name.toLowerCase().includes("floor") && !name.toLowerCase().includes("flooring") ){
                $("#"+inputId).val(value);
            }
		})
        
	}

    const onInputClick = () => {
        if(disabled === undefined || disabled == false){
            let el = document.getElementById(`mainDropdownCon_${inputId}`);
            if(el != undefined && el != undefined){
                if( el.style.display != "none" ){
                    $(`#mainDropdownCon_${inputId}`).hide();
                    //transform: rotate(180deg);   
                    $(`#arrowIconRotate_${inputId}`).css("transform" , "");

                }else{
                    $(`#mainDropdownCon_${inputId}`).show();
                    $(`#arrowIconRotate_${inputId}`).css("transform" , "rotate(180deg)");
                    let currentHeight = el.clientHeight;
                    $(`#mainDropdownCon_${inputId}`).css("margin-bottom" , `-${currentHeight-10}px`);
                }
            }
        }
    };

    const setDropdownNames = (each) => {
        if(each.constDesc != undefined){
            return each.constDesc;
        }else if(each.name != undefined){
            return each.name;
        }else if(each.phaseName != null){
			return each.phaseName
		}else if(each.projId != undefined ){
            return each.projName
        } else{
			return each;
		}
    };

    const getValue = (each, ind) => {
        $("#"+inputId).val(setDropdownNames(each));

        if(labelTwoPositionClass == undefined){
            $(`#singleSelectedDropdownLableTwo_${inputId}`).addClass("afterSelectedLableClass");
        }else{
            $(`#singleSelectedDropdownLableTwo_${inputId}`).addClass(labelTwoPositionClass);
        }
        
        $(`#mainDropdownCon_${inputId}`).hide();

        onChange(name,each);

        if(radioFieldShow && ind != undefined){
            $(`#${ind}_name`).prop("checked", true);
        }
    };


    function onMouseOut(event) {
        // Check if the mouse is leaving the parent element, not entering a child element
        if (!event.currentTarget.contains(event.relatedTarget)) {
            $(`#mainDropdownCon_${inputId}`).hide();
            $(`#arrowIconRotate_${inputId}`).css("transform" , "rotate(0)");

            if(isInputSearch){
                if(value != undefined && value != null && value != "") {
                    $("#"+inputId).css("border-color", "var(--Brand-green-primary, #148B16)");
                    setValueFromId(value);
                }else {
                    $("#"+inputId).val("");
                }
            }
        }
   };


    const [resultedList, setResultedList] = useState([]);
    useEffect(()=>{
        setResultedList(dropdownArray);
    },[dropdownArray]);
    
    const onSearchByField = (e) => {
        $(`#stateAndCityErrMsg_${inputId}`).text("");
        if(name == "city" && dropdownArray != undefined &&  dropdownArray.length != undefined && dropdownArray.length == 0){
            $(`#stateAndCityErrMsg_${inputId}`).text("-Select State First-");
        }

        else if(name == "locality" && dropdownArray != undefined  && dropdownArray.length != undefined  && dropdownArray.length == 0){
            $(`#stateAndCityErrMsg_${inputId}`).text("-Select City First-");
        }

        if(isInputSearch){
            let value = e.target.value;
            
            let array = [];

            if (isProjSearch) {
                // call the api for project search
                if(value != undefined && value != "" && value.length >2) {
                    onProjSearch(value,1);
                }
                
            } else {
                value = value.toLowerCase().trim().replace(/\s+/g, '');
                if (dropdownArray != undefined && dropdownArray != null) {
                    dropdownArray.map((each) => {
                        setResultedList([]);
                        let name = setDropdownNames(each);
                        name = name.toLowerCase().trim().replace(/\s+/g, '');

                        if (name.includes(value)) {
                            array.push(each)
                        };
                    });
                };
                setResultedList(array);

                if (value === "") {
                    setResultedList(dropdownArray);
                }
            };
        }
    };
    
  
    return (
        <Fragment>
            {hide != "true" &&
            <div id={`singleselectyDropdownMainCon_${inputId}`} className={inputOuterContainerClassName}>
                <div className="singleSelectBySeaechMainCon"  onMouseOut={onMouseOut}>
                    {label && label !== "" &&
                    <label className={labelClassName} htmlFor={inputId}>{label}<span className="requiredStars">{required == "true" && label != "" ? "*" : "" }</span></label>
                    }
                    <div id="M" className={containerClassName} onClick={(e)=>onInputClick("M")}>
                        <input
                            id={inputId}
                            type="text"
                            name={name}
                            placeholder={placeholder}
                            //value={result}
                            className={className}
                            disabled={disabled ? disabled : false }
                            required={required && (required == "true" || required == true) ? true : false}
                            autoComplete="off"
                            onChange={(e)=>onSearchByField(e)}
                            readOnly={!isInputSearch}
                            onFocus={(event) => { event.target.setAttribute('autocomplete', 'none'); }}
                            // onBlur={e =>onInputFocus(e)}
                        />

                        <DropdownArrowIcon iconId={`arrowIconRotate_${inputId}`} dropdownArrowClass={arrowIconClass} />
                        {label2 && label2 !== "" &&
                        <label id={`singleSelectedDropdownLableTwo_${inputId}`}
                            htmlFor={inputId} className={labelClassName2}>
                                {label2}
                                <span className="requiredStar">
                                    {required == "true" && label2 != "" ? "*" : "" }
                                </span>
                        </label>
                        }
                    </div> 

                    {required == "true" &&
                        <div id={`err${inputId}`} className="inputErrorMsgCon"><span id={`errmsg${inputId}`} className={`inputErrorMsg  ${compnayDetailsErrorMsg}`}>{errMsg}</span></div>
                    }

                    
                    <div id={`mainDropdownCon_${inputId}`} style={{display: "none"}} className={singleSelectDropdownClassName}>

                        {dropdownArray != undefined &&  dropdownArray.length != undefined && dropdownArray.length == 0 &&
                        <span id={`stateAndCityErrMsg_${inputId}`} className="StateAndCityErrMsg"></span>
                        }
                        

                        {/* {hideSearhInputField == "true" && 
                        <div className="singleSelectDropdownSearchFieldCon">
                            <input type="text" placeholder={searchFieldPlaceholder} onChange={(e)=>onSearchByField(e)} className="singleSelectDropdownSearchField"  autoComplete="off" />
                            <svg id="lense-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"  fill="none">
                                <path d="M20.0313 20.7896C20.4913 21.2496 21.2013 20.5396 20.7413 20.0896L16.9913 16.3296C18.3068 14.8741 19.0339 12.9814 19.0313 11.0196C19.0313 6.62957 15.4613 3.05957 11.0713 3.05957C6.68133 3.05957 3.11133 6.62957 3.11133 11.0196C3.11133 15.4096 6.68133 18.9796 11.0713 18.9796C13.0513 18.9796 14.8813 18.2496 16.2813 17.0396L20.0313 20.7896ZM4.11033 11.0196C4.11033 7.17957 7.24033 4.05957 11.0703 4.05957C14.9103 4.05957 18.0303 7.17957 18.0303 11.0196C18.0303 14.8596 14.9103 17.9796 11.0703 17.9796C7.24033 17.9796 4.11033 14.8596 4.11033 11.0196Z" fill="#767270"/>
                            </svg>
                        </div>
                        } */}

                        {showCheckBox &&
                            showCheckBox
                        }
                        
                        <div className={singleSelectDropdownItemsClassName}>             

                        {resultedList != undefined && resultedList != null && 
                            resultedList.map((each, ind)=>{

                                if(each != "Overlooking"){
                                    return(
                                        <div key={ind} className={dropdownItemClassName}  onClick={()=>getValue(each, ind)}>
                                            { radioFieldShow ? 
                                                <div className="dropdownItemClassName">
                                                    <input 
                                                        id={`${ind}_name`} 
                                                        type="radio" 
                                                        name={name} 
                                                        className="singleSelectedRadioField" 
                                                        //checked={value == each ? true : false}
                                                        onChange={()=>getValue(each, ind)}
                                                    />
                                                    <label htmlFor={`${ind}_name`}>{setDropdownNames(each)}</label>
                                                </div>
                                                :
                                                <p>{setDropdownNames(each) == 0 && name.toLowerCase().includes("floor") ? "G" : setDropdownNames(each)}</p>
                                            }
                                        </div>
                                    )
                                }
                        })}

                        {addPlusOption != undefined &&
                            <div className={dropdownItemClassName} onClick={()=>getValue(addPlusOption)}>
                                <p>{`${addPlusOption}+`}</p>
                            </div>
                        }

                        {custumOption != undefined && custumOption != null && custumOption != "" &&
                            <button id={`custom_${inputId}`} value="custom" onClick={()=>{onChange(name,"custom"); $(`#mainDropdownCon_${inputId}`).hide();}} className={`${custumOptionClass} ${dropdownItemClassName}`}>{custumOption}</button>
                        }


                        </div>
                    </div>
                    
                </div>
            </div>
        }
        </Fragment>
    )
};

export default SingleSelectBySeaechDropdown;
