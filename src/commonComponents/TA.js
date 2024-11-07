import React, { useRef ,useState} from "react";

const TextAreaFieldEl = ({inputId, name, onChange, placeholder,compnayDetailsErrorMsg, 
    type, value,label, className, containerClassName,
    labelClassName, required, disabled, readOnly, 
    hide, togglePassword, rows, cols}) => {

    const inputRef = useRef(null);
    const [errMsg, setErrMsg] = useState("");

    const handleClick = () => {
        if (inputRef && inputRef.current) inputRef.current.focus();
    };
    
    return(
        <div className="newInputcontainerOuterCon">
            {hide != "true" &&
                <div className="newInputcontainerOuterCon">
                    <label className={labelClassName} htmlFor={inputId}>{label}<span style={{color:"red"}}>{required && label != "" ? "*" : "" }</span></label>
                    <div id={`con${inputId}`} onClick={()=>handleClick()} className={containerClassName}>
                        <textarea
                            ref={inputRef}
                            id={inputId}
                            type={type}
                            name={name}
                            onChange={(e)=>onChange(e)}
                            placeholder={placeholder}
                            value={value}
                            className={className}
                            disabled={disabled}
                            cols={cols}
                            rows={rows}
                        />

                        { placeholder.includes("Password") && placeholder!="Re-Enter your Password" &&
                        <div className="hide-eye-icon" onClick={()=>togglePassword()}>
                            { type==="password" ? <i id="eye-icon" className="fa fa-eye-slash"></i> : <i id="eye-icon" className="fa fa-eye"></i> }
                        </div>
                        }
                        
                        
                    </div>
                     {required == "true" &&
                        <div id={`err${inputId}`} className="inputErrorMsgCon"><span id={`errmsg${inputId}`} className={`inputErrorMsg  ${compnayDetailsErrorMsg}`}>{errMsg}</span></div>
                    }
                </div>
            }
        </div>
    )
};

export default TextAreaFieldEl;