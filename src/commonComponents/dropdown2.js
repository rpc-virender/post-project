import React, { useRef,useState} from "react";

const Dropdown2 = ({inputId, name, onChange, placeholder, type, value,label, 
                    className, containerClassName,labelClassName, required, 
                    disabled, readOnly, dropdownArray, mainConSIgnUP, hide}) => {    
    const inputRef = useRef(null);
    const [errMsg, setErrMsg] = useState("");
  
    const handleClick = () => {
      if (inputRef && inputRef.current) inputRef.current.focus();
    };
  
    return (
        <div className={mainConSIgnUP}>
            {hide != "true" &&
            <div>
                <label className={labelClassName} htmlFor={inputId}>{label}<span style={{color:"red"}}>{required && label != "" ? "*" : "" }</span></label>
                <div id={`con${inputId}`} onClick={()=>handleClick()} className={containerClassName}> 
                    <select
                        name={name} 
                        id={inputId} 
                        onChange={(e)=>onChange(e)}
                        className={className}
                        value={value}
                        readOnly={readOnly}
                        disabled={disabled}
                        type={type}
                        autoComplete="off"
                        >
                            <option value="Please Choose..." hidden>{placeholder}</option>
                            {dropdownArray != undefined &&  dropdownArray != null &&
								dropdownArray.map((eachItem, ind)=>{
									
                                return(
									<option key={ind} id={eachItem.id} className="dropdown-item" value={eachItem.id}>{eachItem.name}</option>
									)
                            })};              
                    </select>
                     
                </div>
                 <div id={`err${inputId}`} className="inputErrorMsgCon"><span id={`errmsg${inputId}`} className="inputErrorMsg">{errMsg}</span></div>
            </div>
            }
        </div>
    )
};

export default Dropdown2;
