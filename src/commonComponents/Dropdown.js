import React, { useRef, useEffect, memo} from "react";
import { DropdownArrowIcon } from "../images/commonSvgs";

const Dropdown = ({inputId, name, onChange, placeholder, value,label, 
                    className, containerClassName,labelClassName, required, zeroValue,
                    disabled, readOnly, dropdownArray, hide, label2,labelClassName2,
                    inputOuterContainerClassName, defaultValue, custumOption, addPlusOption }) => {    
    const inputRef = useRef(null);

    useEffect(()=>{
        if(value != undefined && value != null && value != "" && dropdownArray != undefined && dropdownArray != null && dropdownArray.length >0 ){
			setValueFromId(value);
		}
    },[value, dropdownArray]);

    const setValueFromId =(value) => {
        if(dropdownArray != undefined){
            dropdownArray.map(each=>{
                if(each.cid != undefined && each.cid == value){
                    return each.constDesc;
                }else if(each.id != undefined && each.id == value){
                    return each.name;
                }else if(each != undefined && each == value){
                    return each;
                }
            })
        }
    };

    const setDropdownNames = (each) => {
        if(each.constDesc != undefined){
            return each.constDesc;
        }else if(each.name != undefined){
            return each.name;
        }else{
            return each;
        }
    };

    const setDropdownId = (each) => {
        if(each.cid != undefined){
            return each.cid;
        }else if(each.id != undefined){
            return each.id;
        }else{
            return each;
        }
    };
  
    const handleClick = () => {
      if (inputRef && inputRef.current) inputRef.current.focus();
    };
  
    return (
        <div className={inputOuterContainerClassName}>  
            {hide != "true" &&
            <div style={{width: "100%"}}>
                {label !== undefined  && label !== "" &&
                <label className={labelClassName} htmlFor={inputId}>{label}<span style={{color:"red"}}>{required == "true" && label != "" ? "*" : "" }</span></label>
                }
                <div id={`con${inputId}`}  onClick={()=>handleClick()} className={containerClassName}> 
                    {custumOption && (value == "custom" || value > 100000 ) &&
                    <DropdownArrowIcon iconId={`selectArrow_${inputId}`} dropdownArrowClass={`selectDropdownArrowClass customArrowClass`} />
                    }

                    <select
                        name={name} 
                        id={inputId} 
                        onChange={(e)=>onChange(e)}
                        className={`${className} ${custumOption && (value == "custom" || value > 100000 ) ? "selectCustomDropdownTag" : ""}`}
                        value={value}
                        defaultValue={defaultValue}
                        readOnly={readOnly}
                        disabled={disabled && disabled == true ? true : false }
                        required={required && (required == "true" || required == true) ? true : false}
                        autoComplete="off"
                        >
                            {placeholder != undefined && placeholder != null &&
                            <option value="" hidden>{placeholder}</option>
                            }

                            {/* {name == "floor" && label2 != "Elevation" &&
                               <option className="dropdown-item" value={0}>G</option>
                            } */}

                            {dropdownArray != undefined &&  dropdownArray != null &&
								dropdownArray.map((eachItem, ind)=>{
                                    let idss=setDropdownId(eachItem);
                                    let nameO=setDropdownNames(eachItem);
                                    if(zeroValue !== undefined && nameO === 0){
                                        nameO = zeroValue
                                    };
                                    return(
                                        <option key={ind} id={idss} className="dropdown-item" value={idss}>{nameO}</option>
                                    )
                                    
                            })};

  
                            {addPlusOption != undefined && 
                                <option id={`plus_number_${inputId}`} className="addPlusValueOption" value={addPlusOption}>{addPlusOption}+</option>
                            }  

                            {custumOption != undefined && custumOption != null && custumOption != "" &&
                                <option className="custumOptionDropdownClass" id={`custom_${inputId}`} value="custom">{custumOption}</option>
                            }          
                    </select>   
                    {label2 !== undefined && label2 !== "" &&
                    <label id={`customLabel_${inputId}`} className={labelClassName2}>{label2}<span className="requiredStar" /* style={{color:"red"}} */>{required && label2 != "" ? "*" : "" }</span></label>
                    }
                </div>
                {required && required == "true" &&
                <div id={`err${inputId}`} className="inputErrorMsgCon"><span id={`errmsg${inputId}`} className="inputErrorMsg"></span></div>
                }
                </div>
            }
        </div>
    )
};

export default memo(Dropdown);
