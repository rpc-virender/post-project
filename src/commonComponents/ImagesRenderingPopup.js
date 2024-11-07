import React, {useState, useEffect, Fragment} from "react";
import $ from 'jquery';
import SingleButton from "../commonComponents/SingleButton";

import PostPropertyMediaFieldBox from '../commonComponents/PostPropertyMediaFieldBox';

import {fileIcon, DeleteIcon, rotateIcon, PopupCrossMark} from '../images/commonSvgs'
import { isBlobURL, loadergifuserprofile } from "../images/commonImages";

import '../styles/imagesRendringPopupBox.css';

const ImagesRenderingPopup = ({onImagePopup, filesList, urlsList, onUploadBtnClick, onRemoveImage, previewData,btn2Name, fileId, prevPgIden,editPopUpData}) => {
   
    const [imageUrl , setImageUrl] = useState(null);
    const [rotation, setRotation] = useState(0);

    const [defaultUrl , setDefaultUrl] = useState(null);

    useEffect(()=>{
        setRotation(0);
        
        if((prevPgIden? urlsList !=null : editPopUpData != null)&& urlsList !== undefined && urlsList.length > 0 && typeof urlsList[0] !== 'object'){
            if ( urlsList.length > 0 ) {
                if(!isBlobURL(urlsList[0])){
                    const cacheBuster = Math.random(); 
                    setImageUrl(`${urlsList[0]}?v=${cacheBuster}`);
                    setDefaultUrl(`${urlsList[0]}?v=${cacheBuster}`);
                }else{
                    setImageUrl(urlsList[0]);
                    setDefaultUrl(urlsList[0]);
                }
            } 
        }else{
            setImageUrl("");
        }
    
    },[urlsList,editPopUpData]);


    const rotateImage = (angle) => {
        $("#imagesRenderingLoader").show();
        $("#_img_popup_saveAndCloseBtn").prop("disabled", true);
	    $("#_img_popup_saveAndCloseBtn").css("cursor", "wait");

        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = defaultUrl;
    
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
    
            const width = image.width;
            const height = image.height;
    
            if (angle === 90 || angle === 270) {
                canvas.width = height; // Swap width and height for 90 or 270 degrees
                canvas.height = width;
            } else {
                canvas.width = width; // Set canvas width to original width
                canvas.height = height; // Set canvas height to original height
            }
    
            // Clear the canvas before drawing
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            // Move canvas origin to the center
            ctx.translate(canvas.width / 2, canvas.height / 2);
    
            // Rotate canvas
            ctx.rotate((angle * Math.PI) / 180);
    
            // Draw the image
            ctx.drawImage(image, -width / 2, -height / 2);
    
            // Reset transformation
            ctx.setTransform(1, 0, 0, 1, 0, 0);
    
            canvas.toBlob((blob) => {
                const rotatedImageURL = URL.createObjectURL(blob);
                // $("#imagesRenderingLoader").hide();
                $("#_img_popup_saveAndCloseBtn").prop("disabled", false);
	            $("#_img_popup_saveAndCloseBtn").css("cursor", "pointer");
                onImagePopup("SAVE", undefined, btn2Name !== 'Close' ?"s":'ns', previewData, rotatedImageURL);
            }, 'image/jpeg');
        };
    };
    

    const onRotateImg = (identifier) => {
        if(identifier === "L"){
            if(rotation !== 0){
                setRotation(rotation => rotation - 90 );
            }
        }else{
            if(rotation !== 360){
                setRotation(rotation => rotation + 90 );
            }
        }
    };

    const onMainConClick = (e) => {
        var checkboxes = document.getElementById("floorplanImagesPopupinnerCon");
    
        if (checkboxes && !checkboxes.contains(e.target)){
            onImagePopup("CLOSE");
        }
    };


    return(
        <div className="imagesConPopupStaticCon" onClick={(e)=>onMainConClick(e)}>
            <div className="imagesPopupinnerPopupCon" id="floorplanImagesPopupinnerCon">
                <div className="headingAndCrossCon">
                    <h3>Floor Plan</h3>

                    <PopupCrossMark id="imgsRenneringCrossIcon" key="imgsRenneringCrossIcon" className="imagesPopupCrossIcon" onClick={()=>{onImagePopup("CLOSE"); setRotation(0);}} />
                </div>
				
                <div className="displayingImageInPopupCon">

                    {urlsList !== undefined && urlsList != null && urlsList.length > 0 ?
                        <div className="imageRenderingPopupimageDisplayBlock">
                            <div className={`displayingImageInPopup ${(rotation !== 0 && rotation !== 360) ? "ifImageRotatedInPopup" : ""} `}>

                                {imageUrl === "" ?
                                <div className="imagesRenderingLoader" >
                                    <img src={loadergifuserprofile} alt="Loading..." />
                                </div>
                                :
                                <img 
                                    id={`mainImg_${fileId}`} 
                                    alt="Orginal" 
                                    style={{ transform: `rotate(${rotation}deg)` }}
                                    src={ prevPgIden ? imageUrl : (editPopUpData != null &&  Object.keys(editPopUpData).length > 0 ? imageUrl : "")}  
                                    className={`imageInPopupBox`}
                                /> 
                                } 
                                
                            </div>

                            {previewData && previewData.id !== undefined &&
                            <div className="popupImagesDetailsMainCon">
                                <div className="popupImagesNameDislayBox">
                                    <span className="popupImagesFileAndDeleteIcons">{fileIcon}</span>
                                    <p>Image</p>
                                </div>

                                {(prevPgIden === undefined || prevPgIden === "" || prevPgIden == null) || !prevPgIden ? 
                                    <DeleteIcon key={`imagesRenderingPop_${fileId}`} className={"popupImagesFileAndDeleteIcons"} iconId={`imagesRenderingPop_${fileId}`} onClick={(e) => onRemoveImage("I")}/> 
                                : "" }

                                <div className="imgRotateBtnsCon">
                                    <SingleButton
                                        buttonId={`imgRotateBtnL_${fileId}`}
                                        containerClassName=""
                                        buttonClassName={`imgRotateBtn ${rotation === 0 ? "noRotation" : ""}`}
                                        onSubmit={()=>onRotateImg("L")}
                                        title=""
                                        icon={rotateIcon}
                                        toolTip="Rotate Left"
                                    />

                                    <SingleButton
                                        buttonId={`imgRotateBtnR_${fileId}`}
                                        containerClassName=""
                                        buttonClassName={`imgRotateBtn imgRotateBtnRight ${rotation === 360 ? "noRotation" : ""}`}
                                        onSubmit={()=>onRotateImg("R")}
                                        title=""
                                        icon={rotateIcon}
                                        toolTip="Rotate Right"
                                    />
                                </div>
                                
                            </div>
                            }
                        </div>

                        :
                        <div className="imageRenderingPopupUploadBlock">
                            <PostPropertyMediaFieldBox
                                fileId={"_"+fileId}
                                title=""
                                mediaType="P"
                                selectedType="S"
                                mediaFilesList={filesList}
                                imgUrlsList={urlsList}
                                required={false}
                                dataLimit={5}
                                errorMsg="Please upload the floorplan image"
                                onUploadBtnClick={(e) => onUploadBtnClick(e,"I")}
                                onRemoveImage={""}
                                buttonTitle="Select File"
                                hideImageDisplayBox="true"
                                cssForText="stylesForImagesBoxTexts"
                                continerWidth="100%"
                                key="media-box-from-image-preview"
                                hideNamesList="true"
                            />
                        </div>
                    }

                </div>
                
                {previewData && previewData.id !== undefined &&
                <Fragment>
                    <p id={`imagesPopupMaxLimit_${fileId}`} style={{display:"none"}} className="imgMaxLimitErrMsg">File size more than 5 MB is not accepted. Please use another file</p>

                    <p id="imagesRenderingLoader" style={{display: "none"}} className="loaderStatusForImagePopup" >
                        <img src={loadergifuserprofile} alt="Loading..." />
                        Please Wait a moment
                    </p>

                    {((prevPgIden === undefined || prevPgIden === "" || prevPgIden == null) || !prevPgIden) &&
                    <div className="popupImagesSubmitBtnsMainCon">
                        <input 
                            id={fileId}
                            style={{display:"none"}}
                            type="file"
                            accept=".png, .jpg, .webp,.jfif, .JPEG"
                            onChange={(e)=>onUploadBtnClick(e,"I")}
                            onClick={(e) => e.target.value = ''}
                        />

                        {imageUrl !== "" &&
                        <label 
                            className="popupChangeCloseBtn" 
                            htmlFor={fileId}
                        >
                            {urlsList !== undefined && urlsList.length !== undefined && urlsList.length > 0?"Replace Floor Plan":"Upload New Image"}
                        </label>
                        }

                        {(rotation === 0 || rotation === 360) ?
                        <SingleButton
                            buttonId="_img_popup_Btns"
                            containerClassName=""
                            buttonClassName="popupChangeImageBtn"
                            onSubmit={()=>onImagePopup("CLOSE", undefined, btn2Name !=='Close' ?"s":'ns', previewData)}
                            title={btn2Name !== undefined ? btn2Name : "Close"}
                        />
                        :
                        <SingleButton
                            buttonId="_img_popup_saveAndCloseBtn"
                            containerClassName=""
                            buttonClassName="popupChangeImageBtn"
                            onSubmit={()=>rotateImage(rotation)}
                            title="Save and Close"
                        />
                        }
                        
                    </div>
                    }
                </Fragment>
            }
    
                
                
            </div>
        </div>
    )
};

export default ImagesRenderingPopup;