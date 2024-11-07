import React, {useRef, useState , useEffect, Fragment, memo } from "react";
import $ from 'jquery';
import {passwordEyeCrossIcon, passwordEyeIcon} from "../images/commonSvgs";
import { calendarIcon } from "../images/commonSvgs";
import { capitalizeFirstLetterOfEveryWord, capitalizeFirstLetterOfFirstWord } from "../helperComponent/RegexValidation";
import { removeCommasFromValue } from "../images/commonImages";

const Input = ({inputId, name, onChange, placeholder, compnayDetailsErrorMsg, mobileInputErroMsg,onKeyPress ,capital,
                type, value,label, className, containerClassName, inputOuterContainerClassName, maxCheracterLimit,
                labelClassName, required, disabled, hideErrorMsg, frontIcon, frontIconClassName, inputmode, skipOnFocus,
                hide, togglePassword, outerContainerClassName, pattern,label2, labelClassName2,checked, spanLable, spanLableClassName}
            ) => {
							    
    const inputRef = useRef(null);
    const [errMsg, setErrMsg] = useState("");

    const finallabel = label !== undefined && label !== null  && label !== "" ? 
                    label : name !== undefined && label2 !== "" ? name : label2 !== undefined && label2 !== null  && label2 !== "" ? label2 : "" ;

    const handleClick = () => {
      if (inputRef && inputRef.current) inputRef.current.focus();
    };

    let inValidName = ["customLocality", "customUnitType", "newPriceName", "customBankName"]

    const onInputFocus = (e) => {
        let inputIdel = document.getElementById(`${e.target.id}`);
        if(!inValidName.includes(e.target.name) && skipOnFocus !== true ){
            setTimeout(()=>{
                if(e.target.value != null && e.target.value != "" && (type == "text" || type == "email") ){
                    let value = e.target.value
                    if(typeof value === 'string'){
                        if(capital !== null && capital !== undefined && capital !== ""){
                            if(capital === "A"){
                                value = capitalizeFirstLetterOfEveryWord(value);
                            }else if(capital === "F"){
                                value = capitalizeFirstLetterOfFirstWord(value);
                            }else{
                                value = value.replace(/\s+/g, " ").trim();
                            }
                        }else{
                            value = value.replace(/\s+/g, " ").trim();
                            inputIdel.value = value;
                        }
                    }
                    const modifiedEvent = Object.assign({}, e, {
                                        target: {
                                            ...e.target,
                                            value: value,
                                            name: e.target.name,
                                            id:e.target.id,
                                            checked:e.target.checked
                                        },
                                    });
                    if(onChange){
                        onChange(modifiedEvent);
                    };
                }
                
                if(e.target.name != "companyStartDate"){
                    if(e.target.value === ""){
                        if(label && label != ""){
                            setErrMsg(`${label} is Required`);
                        }
                        
                        if(inputIdel != undefined && inputIdel != null && required == "true"){
                            inputIdel.style.borderColor = "#F00";
                        }
                    }else{
                        setErrMsg("");
                        if(inputIdel != undefined && inputIdel != null){
                            inputIdel.style.borderColor = "#148B16";
                        }
                    }
                }else{
                    setErrMsg("");
                    if(inputIdel != undefined && inputIdel != null && inputIdel != ""){
                        inputIdel.style.borderColor = "#148B16";
                    }
                }
            }, 200);
        }

        if((e.target.name == "customBankName") || (skipOnFocus && skipOnFocus === true) ){
            let value = e.target.value ? e.target.value.replace(/\s+/g, " ").trim() : "";
            const modifiedEvent = Object.assign({}, e, {
                target: {
                    ...e.target,
                    value: value,
                    name: e.target.name,
                    id:e.target.id,
                    checked:e.target.checked
                },
            });
            if(onChange){
                onChange(modifiedEvent);
            };
        }

    };

    useEffect(()=>{
        setErrMsg("");
    },[value]);

    var inputBox = document.getElementById(inputId);

    if(inputBox && type == 'number' && inputBox.value === ""){
        inputBox.value = "";
    };

    var invalidChars = ["e", "E", "+", "°"];
    
    const onPastingValue = (event) => {
        if(event && type === "number"){
            event.preventDefault();
            const paste = (event.clipboardData || window.clipboardData).getData('text');
            
            // Remove any non-numeric characters
            const cleanValue = paste.replace(/[^0-9.]/g, '');
            
            if(inputBox){
                inputBox.value = cleanValue;
                if(onChange){ onChange(event) };
            }
        }
    };

    const typeOfInts = ["INT", "SMALLINT", "BIGINT", "TINYINT", "unSMALLINT"];

    const valuesValidity = {
        INT: { minimum: -2147483648, maximum: 2147483647},
        SMALLINT:{ minimum: -32768, maximum: 32767},
        BIGINT:{minimum: -9223372036854775808, maximum: 9223372036854775807},
        TINYINT:{ minimum: 0, maximum: 255},
        unSMALLINT:{Minimum: 0, Maximum: 65535}
    };

    const [isError, setIsError] = useState(false);

    const ifError = (errMsg) => {
        if(required && required != "true" && inputId !== "dashboardSecondaryEmailFeild"){
            setIsError(true);
        };
        $(`#errmsg${inputId}`).text(errMsg);
        $(`#${inputId}`).css("border-color","#F00");

        setTimeout(()=>{
            $(`#errmsg${inputId}`).text("");
            $(`#${inputId}`).css("border-color","#148B16");
            if(required && required != "true"){
                setIsError(false);
            };
        }, 2000);
    };

    const onInputChange = (e) =>{
        if(type == "number" && e.target.value === "" ){
            $("#"+inputId).val("")
        };

        if(onChange){
            $(`#errmsg${inputId}`).text("");
            $(`#${inputId}`).css("border-color","#148B16");
            
            if(maxCheracterLimit){
                let val;
                let inputType = maxCheracterLimit.type ? maxCheracterLimit.type : maxCheracterLimit;

                if(inputType === "C" || typeof(maxCheracterLimit) === "number"){
                    // For string with comma sepereted values
                    let count = maxCheracterLimit.count ? maxCheracterLimit.count : maxCheracterLimit;
                    inputType === "C" ? val = removeCommasFromValue(e) : val = e.target.value;
                    let valLength = val.toString().length;
                    if(valLength < count + 1){
                        onChange(e)
                    }else{
                        ifError(`Only ${count} characters Allowed`);
                        value ? $(`#${inputId}`).val(value) : $(`#${inputId}`).val(val.slice(0, maxCheracterLimit));
                    }   
                };
                
                if(typeOfInts.includes(inputType)){
                    // For number with comma sepereted values
                    val = removeCommasFromValue(e);
                    if(val === "" || (parseInt(val) < (valuesValidity[inputType].maximum + 1))){
                        onChange(e)
                    }else{
                        ifError(`Value Exceeded`);
                    };
                };
            }else{
                onChange(e);
            }
        };
    };

    // || (minusCount === 1 && inputVal.indexOf('-') !== 0)

    const handleInput = (e) => {
        // let inputVal = e.target.value;
    
        // // Block more than one minus sign or minus signs not at the start
        // const minusCount = (inputVal.match(/-/g) || []).length;
        // if (minusCount > 1 ) {
        //   e.target.value = '';
        //   $("#"+inputId).val("");
        //   return;
        // }
   
    };

    
    return (
        <div className={inputOuterContainerClassName ? inputOuterContainerClassName : ""}>
            {hide != "true" &&
                <div className={outerContainerClassName}>
                    {spanLable != undefined && spanLable != "" && value != "" &&
                    <label className={spanLableClassName}>{spanLable}</label>
                    }

                    {frontIcon != undefined && frontIcon != "" && value != "" &&
                    <label className={frontIconClassName}>{frontIcon}</label>
                    }

                    {label && label !== "" &&
                    <label className={labelClassName} htmlFor={inputId}>{label}
                        <Fragment>
                        {required == "true" &&
                        <span className="requiredStar">*</span>
                        }
                        </Fragment>
                    </label>
                    }

                    <div id={`con${inputId}`} onClick={()=>handleClick()} className={containerClassName}>
                        <input
                            ref={inputRef}
                            id={inputId}
                            type={type}
                            pattern={pattern}
                            inputMode={inputmode}
                            name={name ? name : ""}
                            onChange={(e)=>onInputChange(e)}
                            placeholder={placeholder !== undefined && placeholder !== "" ? placeholder : "" }
                            value={value}
                            className={className}
                            disabled={disabled && disabled == true ? true : false }
                            required={required && (required == "true" || required == true) ? true : false}
                            // checked={checked}
                            {...(checked ? { checked: checked } : {})}
                            onWheel={ event => event.currentTarget.blur() }
                            capital={capital}
                            onInput={(e) => type == "number" ? handleInput(e) : ("")}
                            //onfocusout={(e) => onChange({ ...e, target: { ...e.target, value: typeof e.target.value === 'string' ? e.target.value.replace(/\s{2,}/g, ' ').trim() : e.target.value } })}
                            onBlur={e =>onInputFocus(e)}
                            autoComplete="off"
                            // onKeyDown={(e)=> onKeyPress != undefined ? onKeyPress(e) : ""}
                            // onKeyDown={(e) => {
                            //     type === "number" ? invalidChars.includes(e.key) && e.preventDefault() : "";

                            //     onKeyPress !== undefined ? onKeyPress(e) : ""
                            // }}
                            onPaste={(e)=>onPastingValue(e)}
                        />
                        {label2 && label2 !== "" &&
                        <label htmlFor={inputId} className={labelClassName2}>{label2}<span className="requiredStar">{required == "true" && label2 != "" ? "*" : "" }</span></label>
                        }

                        { placeholder != undefined && placeholder != null &&
                        placeholder.includes("Password") && /* placeholder!="Re-Enter your Password" && */
                        <div className="hide-eye-icon" onClick={()=>togglePassword()}>
                            { type==="password" ? passwordEyeCrossIcon : passwordEyeIcon }
                        </div>
                        }
                        
                       
                        { finallabel != undefined && finallabel != null && type == "text" && type != "radio" &&
                        <React.Fragment>
                            {(finallabel.toLowerCase().includes("date") || finallabel.toLowerCase().includes("available")) &&
                            <div className="hide-eye-icon calendarIconClass">
                                {calendarIcon}
                            </div>
                            }
                        </React.Fragment>
                        }
                    </div> 
                    {((required == "true" || isError) && hideErrorMsg != true) &&
                        <div id={`err${inputId}`} className="inputErrorMsgCon"><span id={`errmsg${inputId}`} className={`inputErrorMsg  ${compnayDetailsErrorMsg}`}>{errMsg}</span></div>
                    }
                </div>
            }
        </div>
    )
};

export default memo(Input);
