import React, { useState, useEffect } from "react";
import $ from 'jquery';
import {DropdownArrowIcon} from '../images/commonSvgs';


const SingleSelectDropdown2 = ({
                inputId, name, onChange, value,
                placeholder, searchFieldPlaceholder,
                className, containerClassName,  outerContainerClassName, inputOuterContainerClassName,
                label, label2, labelClassName, labelClassName2, labelTwoPositionClass,
                required, disabled, readOnly, 
                dropdownArray, addPlusOption,
                hideSearhInputField, hide, radioFieldShow, custumOption, custumOptionClass,
                singleSelectDropdownClassName, singleSelectDropdownItemsClassName, dropdownItemClassName, arrowIconClass,isProjSearch,onProjSearch, isInputSearch
            }) => {
    
    
    useEffect(() => {
		if(value != undefined && value != null && value != "" ){
            if(labelTwoPositionClass == undefined){
                $(`#singleSelectedDropdownLableTwo_${inputId}`).addClass("afterSelectedLableClass");
            }else{
                $(`#singleSelectedDropdownLableTwo_${inputId}`).addClass(labelTwoPositionClass);
            }

			if(dropdownArray != undefined && dropdownArray != null && dropdownArray.length != undefined && dropdownArray.length >0 ){
				setValueFromId(value);
            	$(`#${inputId}`).css("border" , "0.8px solid var(--Brand-green-primary, #148B16)");
			}
			
		}else{
            $("#"+inputId).val("");
            $(`#${inputId}`).css("border" , "0.8px solid var(--GREY4, #C9C9C9)");

            if(labelTwoPositionClass == undefined){
                $(`#singleSelectedDropdownLableTwo_${inputId}`).removeClass("afterSelectedLableClass");
            }else{
                $(`#singleSelectedDropdownLableTwo_${inputId}`).removeClass(labelTwoPositionClass);
            }

        }
	},[value,dropdownArray]);

	const setValueFromId =(value) => {
        if(dropdownArray){
            dropdownArray.map(each=>{
                if(each.cid != undefined && each.cid == value){
                    $("#"+inputId).val(each.constDesc);
                    return each.constDesc;
                }else if(each.id != undefined && each.id == value){
                    $("#"+inputId).val(each.name);
                    return each.name;
                }else if(each != undefined && each == value){
                    $("#"+inputId).val(each);
                    return each;
                }
                
            });
        }
	};

    const onInputClick = () => {

        if (value == "") {
            setResultedList(dropdownArray);
        }

        $(`#stateAndCityErrMsg_${inputId}`).text("");

        if(name == "city" && dropdownArray != undefined &&  dropdownArray.length != undefined && dropdownArray.length == 0){
            $(`#stateAndCityErrMsg_${inputId}`).text("-Select State First-");
        }

        else if(name == "locality" && dropdownArray != undefined  && dropdownArray.length != undefined  && dropdownArray.length == 0){
            $(`#stateAndCityErrMsg_${inputId}`).text("-Select City First-");
        }

        if(disabled === undefined || disabled === false){
            let el = document.getElementById(`mainDropdownCon_${inputId}`);
            if(el != undefined && el != undefined){
                if( el.style.display != "none" ){
                    $(`#mainDropdownCon_${inputId}`).hide();
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
        }else if(each.projId != undefined ){
            return each.projName
        }else {
			return each;
		}
    };

    const getValue = (each) => {
        $("#"+inputId).val(setDropdownNames(each));

        if(labelTwoPositionClass == undefined){
            $(`#singleSelectedDropdownLableTwo_${inputId}`).addClass("afterSelectedLableClass");
        }else{
            $(`#singleSelectedDropdownLableTwo_${inputId}`).addClass(labelTwoPositionClass);
        }
        
        $(`#mainDropdownCon_${inputId}`).hide();
        onChange(name,each);
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
        $(`#mainDropdownCon_${inputId}`).show();
        $(`#arrowIconRotate_${inputId}`).css("transform" , "rotate(180deg)");

        if(isInputSearch){
                let value = e.target.value;
                
                let array = [];

                if (isProjSearch) {
                    // call the api for project search
                    if(value != undefined && value != "" && value.length > 2) {
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

                    if (value == "") {
                        setResultedList(dropdownArray);
                    }
            };
        }
    };

    
    return (
        <div id={`singleselectyDropdownMainCon_${inputId}`} className={inputOuterContainerClassName}>
            {hide != "true" &&
                <div className="singleSelectBySeaechMainCon" onMouseOut={onMouseOut}>
                    {label && label !== "" &&
                    <label className={labelClassName} htmlFor={inputId}>{label}<span className="requiredStars">{required == "true" && label != "" ? "*" : "" }</span></label>
                    }
                    <div id="M" className={containerClassName} onClick={(e)=>onInputClick("M")}>
                        <input
                            id={inputId}
                            type="text"
                            name={name}
                            placeholder={placeholder !== undefined && placeholder !== "" ? placeholder : "" }
                            className={className}
                            disabled={disabled && disabled == true ? true : false }
                            required={required && (required == "true" || required == true) ? true : false}
                            autoComplete="off"
                            onChange={(e)=> onSearchByField(e)}
                            readOnly={!isInputSearch}
                            onFocus={(event) => { event.target.setAttribute('autocomplete', 'none'); }}
                        />
                        
                        {(disabled === undefined || disabled === false) &&
                        <DropdownArrowIcon iconId={`arrowIconRotate_${inputId}`} dropdownArrowClass={arrowIconClass} />
                        }

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
                    
                    <div id={`mainDropdownCon_${inputId}`} style={{display: "none"}} className={singleSelectDropdownClassName}>

                        {dropdownArray != undefined &&  dropdownArray.length != undefined && dropdownArray.length == 0 &&
                        <span id={`stateAndCityErrMsg_${inputId}`} className="StateAndCityErrMsg"></span>
                        }
                        
                        <div className={singleSelectDropdownItemsClassName}>
                            {resultedList != undefined && resultedList != null && 
                                resultedList.map((each, ind)=>{
                                    return(
                                        <div key={ind} className={dropdownItemClassName} onClick={()=>getValue(each)}>
                                            { radioFieldShow ? 
                                                <div className="dropdownItemClassName">
                                                    <input id={`${ind}_name`} type="radio" name={name} className="singleSelectedRadioField" />
                                                    <label htmlFor={`${ind}_name`}>{setDropdownNames(each)}</label>
                                                </div>
                                                :
                                                <p>{setDropdownNames(each)}</p>
                                            }
                                        </div>
                                    )
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
            }
        </div>
    )
};

export default SingleSelectDropdown2;
