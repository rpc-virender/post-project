import React, { useState } from "react";

import {mediaCloudIcon, PreviewEyeIcon, EditIcon, DeleteIcon, fileIcon} from '../images/commonSvgs';
import { formatBytes } from "../images/commonImages";

const UploadImageField = ({inputId, label,onChange, labelClassName, type, required}) => {
    const [companyLogo, setCompanyLogo ] = useState(null);
    const [imgUrl, setImgUrl ] = useState("");
    const [ previewPopup, setPreviewPopup ] = useState("none");

    const onUploadBtnClick = (e) => {
         if (e.target.files !== null && e.target.files.length > 0) {
        let file = e.target.files[0];

        if (file !== null) {
        let messageEl = document.getElementById("size_content");
        if(file.size > 10000000){
            if(messageEl !== undefined && messageEl !== null){
                messageEl.style.color = "red";
            }
        }else{
            setCompanyLogo(file); 
            setImgUrl(URL.createObjectURL(file));
            onChange(null,"logoData",file);
            onChange(null,"isLogoChange","Y");
            if(messageEl !== undefined && messageEl !== null){
                messageEl.style.color = "rgba(0, 0, 0, 0.40)";
            	}  
             }
          }        
       }
    };

    const onRemoveImage = () => {
        setCompanyLogo(null);
        setImgUrl("");
        onChange(null,"logoData",null);
        onChange(null,"isLogoChange","Y");
    }
        
    const onPopup = (e) => {
        if(e.target.id == "open"){
            setPreviewPopup("flex");
        }else{
            setPreviewPopup("none");
        }
    }
    
    return(
        <div className="uploadImgMainCon">
            <label className={labelClassName} htmlFor={inputId}>{label}</label>
            <div className="fieldContainer">
                <input 
                    id={inputId} 
                    style={{display:"none"}} 
                    type="file" 
                    accept=".png, .jpg,.webp,.jfif, .JPEG"
                    onChange={(e)=>onUploadBtnClick(e)}
                />

                {companyLogo == null &&
                <div className="imgUploadingBox">
                    <div className="imgUploadingBoxInnerCon">

                        {mediaCloudIcon}

                        <div className="imgUploadingBoxInnerRightSideCon">
                            <div className="textContentBox">
                                <span className="contentForField">Select a file or drag and drop here</span>
                                <span id="size_content" className="sizeDetailsForFile">JPG, WEBP, JFIF PNG or JPEG, file size no more than 10MB</span>
                            </div>


                            <div className="input_container">
                                <label htmlFor={inputId} className="fileUploadBtn">Select file</label>
                            </div>
                        </div>

                    </div>
                </div>
                }

                <div className="imgDisplayingBox">
                    {/* <p className="filesAddedHeading">File added</p> */}
                    {companyLogo != null &&
                            <div className="companyLogoDetailsMainCon">

                                <img src={imgUrl} className="companyLogoImgMiniDislayBox"  />
                                
                                <div className="companyLogoDetailsNameAnddataCon">

                                    <div className="companyLogoNameDislayBox">
                                        {fileIcon}
                                        <p className="companyLogoName"> <span className="UploadedImageName">{companyLogo.name}</span> | <span style={{fontSize:"10px"}}>{formatBytes(companyLogo.size)}</span></p>
                                    </div>

                                    <div className="iconsBox">
                                        <PreviewEyeIcon iconId={`svg_preview_${inputId}`} onClick={(e)=>setPreviewPopup("flex")}  />

                                        <label htmlFor={inputId}>
                                            <EditIcon iconId={`svg_edit_${inputId}`} />
                                        </label>

                                        <DeleteIcon iconId={`svg_delete_${inputId}`} onClick={(e)=>onRemoveImage()} />
                                    </div>
                                </div>
{/* Popup for Preview image  */}
                                <div id="popup" className="imgPreviewPopupCon" style={{ display: previewPopup }}>
                                    <div className="imgPreviewBox">
                                        <svg id="close" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" className="crossIconInnerCon" onClick={()=>setPreviewPopup("none")}>
                                            <rect width="32" height="32" rx="16" fill="#767270"/>
                                            <path d="M22.5 9.5L9.5 22.5M9.5 9.5L22.5 22.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <p className="previewImgHeading">Image preview</p>
                                        <img src={imgUrl} alt="" className="previewImage" />
                                    </div>
                                </div>
                                
                                
                            </div>
                        
                    }
                    
                </div>
            </div>
        </div>
    )
};

export default UploadImageField;