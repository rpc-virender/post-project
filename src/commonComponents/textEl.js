import React, { memo, useRef, useState} from "react";
import $ from 'jquery';
import { capitalizeFirstLetterOfEveryWord, capitalizeFirstLetterOfFirstWord, capitalizeFirstLetterOfFirstWordWithoutTrim } from "../helperComponent/RegexValidation";

const TextAreaFieldEl = ({inputId, name, onChange, placeholder, capital, maxCheracterLimit,
    value, label, className, containerClassName, inputOuterContainerClassName,
    labelClassName, required, disabled, compnayDetailsErrorMsg, errMsg, hide, rows, cols }) => {

    const inputRef = useRef(null);

    const handleClick = () => {
        if (inputRef && inputRef.current) inputRef.current.focus();
    };

    const onInputFocus = (e) => {
        //onfoucus border color change..
        let inputTextArID = document.getElementById(`${e.target.id}`);
        if(e.target.value ==="" || e.target.value == null || e.target.value == undefined){
            if(inputTextArID != undefined && inputTextArID != null && required == "true"){
                inputTextArID.style.borderColor = "#F00";
            }
        };

        if(e.target.value != null && e.target.value != ""){
            let value = e.target.value

            if(e.target.name != "aboutproject"){
                if(typeof value === 'string'){
                    if(capital !== null && capital !== undefined && capital !== ""){
                        if(capital === "A"){
                            value = capitalizeFirstLetterOfEveryWord(value);
                        }else if(capital === "F"){
                            value = capitalizeFirstLetterOfFirstWord(value);
                        }
                    }else{
                        value = value.replace(/\s+/g, " ").trim();
                    }
                }
            }else{
                const lines = value.split('\n');
                
                // const filteredLines = lines.filter(line => line.trim() !== '');
                // const newText = filteredLines.join('\n');

                // Remove empty rows from the top
                while (lines.length > 0 && lines[0].trim() === '') {
                    lines.shift();
                }

                // Remove empty rows from the bottom
                while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
                    lines.pop();
                }

                // Join the remaining lines back together with newline characters
                const newText = lines.join('\n');

                value = capitalizeFirstLetterOfFirstWordWithoutTrim(newText);
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
            onChange(modifiedEvent);
        }
        
    };

    const [isError, setIsError] = useState(false);

    const ifError = (errMsg) => {
        if(required && required != "true"){
            setIsError(true);
        };
        $(`#errmsg${inputId}`).text(errMsg);
        // $(`#${inputId}`).css("border-color","#F00");

        setTimeout(()=>{
            $(`#errmsg${inputId}`).text("");
            // $(`#${inputId}`).css("border-color","#148B16");
            if(required && required != "true"){
                setIsError(false);
            };
        }, 2000);
    };

    const onInputChange = (e) =>{
        if(onChange){ 
            if(maxCheracterLimit){
                // $(`#errmsg${inputId}`).text("");
                // $(`#${inputId}`).css("border-color","#148B16");

                let val = e.target.value;
                let valLength = val.toString().length;
                if(valLength < maxCheracterLimit + 1){
                    onChange(e)
                }else{
                    value ? $(`#${inputId}`).val(value) : $(`#${inputId}`).val(val.slice(0, maxCheracterLimit));
                } 
            }else{
                onChange(e);
            }
        };
    };
    
    return(
        <div className={inputOuterContainerClassName}>
            {hide != "true" &&
                <div>
                    {label && label !== "" &&
                    <label className={labelClassName} htmlFor={inputId}>{label}<span style={{color:"red"}}>{required == "true" && label != "" ? "*" : "" }</span></label>
                    }
                    <div id="textAreaElMainContainer" onClick={()=>handleClick()} className={containerClassName}>
                        <textarea
                            ref={inputRef}
                            id={inputId}
                            name={name}
                            onChange={(e)=>onInputChange(e)}
                            placeholder={placeholder}
                            value={value}
                            className={className}
                            disabled={disabled && disabled == true ? true : false }
                            onBlur={e =>onInputFocus(e)}
                            cols={cols}
                            rows={rows}
                        />
                    </div>

                    {(required == "true" || isError) &&
                        <div id={`err${inputId}`} className="inputErrorMsgCon"><span id={`errmsg${inputId}`} className={`inputErrorMsg  ${compnayDetailsErrorMsg}`}>{errMsg}</span></div>
                    } 
                </div>
            }
        </div>
    )
};

export default memo(TextAreaFieldEl);