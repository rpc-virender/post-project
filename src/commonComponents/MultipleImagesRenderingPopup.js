import React, { Fragment, memo, useEffect } from "react";
// import '../styles/multiImagesRendringPopupBox.css';

import $ from 'jquery';
import PostPropertyMediaFieldBox from './PostPropertyMediaFieldBox';
import { MediaImagesScrollIcon, PopupCrossMark } from "../images/commonSvgs";
import { isBlobURL } from "../images/commonImages";
import YouTubeEmbed from "./YouTubeEmbed";


const MultipleImagesRenderingPopup = ({onImagePopup, filesList, urlsList, BlockTitle, onUploadBtnClick, onRemoveImage, fileId, 
                                    selectedType, imageIndex, setImageIndex, showUploadBox, setShowUploadBox}) => {

    const SelectingImage = (index, identifier) => {    
        if(setShowUploadBox){
            setShowUploadBox(false);
        } ;
        
        $("#changeImageButton").hide();
        $(`#multiImagesPopupMaxLimit_${fileId}_replace`).hide();

        if(identifier == "N"){
            $("#changeImageButton").show();
            setImageIndex(index);
        }else if(identifier == "R"){
            $("#changeImageButton").show();
            if(urlsList[index + 1] != undefined){
                setImageIndex(index + 1);
            }
        }else if(identifier == "L"){
            $("#changeImageButton").show();
            if(urlsList[index - 1] != undefined){
                setImageIndex(index - 1);
            }
        }else{
            setImageIndex(index);
            if(setShowUploadBox){
                setShowUploadBox(true);
            }  
        }
    };

    useEffect(()=>{
        if(setShowUploadBox){
            if(urlsList != undefined && urlsList.length != undefined && urlsList.length == 0 && 
                selectedType != undefined && selectedType.type != undefined && selectedType.type == "S" ){
                setShowUploadBox(true);
            }else{
                setShowUploadBox(false);
            }
        }
    },[urlsList, filesList]);

    const getImageUrl = (otherEachUrl) => {
        var url;
        if(otherEachUrl){
            url = otherEachUrl;
        }else{
            url = urlsList[selectedType.type == "M" ? imageIndex : 0];
        }

        if(url){
            if (!isBlobURL(url)) {
                const cacheBuster = Math.random();
                return `${url}?v=${cacheBuster}`
            } else {
                return url
            }
        }
    };


    const onMainConClick = (e) => {
        var checkboxes = document.getElementById("multiImagesPopupinnerCon");
    
        if (checkboxes && !checkboxes.contains(e.target)){
            onImagePopup("CLOSE");
        }
    };

    return(
        <div className="multIImagesConPopupStaticCon" onClick={(e)=>onMainConClick(e)}>
            <div id="multiImagesPopupinnerCon" className={`multiImagesPopupinnerPopupCon ${selectedType.type === "M" ? "multiImagesPopupMainCon" : ""}`}>
                <div className="multiheadingAndCrossCon">
                    <h3>{selectedType != undefined && selectedType.boxTitle != undefined && selectedType.boxTitle != "" ? selectedType.boxTitle : BlockTitle}</h3>

                    <PopupCrossMark id="multiImagesCrossIcon" key="multiImagesCrossIcon" className="multiImagesPopupCrossIcon" onClick={()=>onImagePopup("CLOSE")} />
                </div>
				

                <div className="multiDisplayingImageInPopupCon">

{/* ALL IMAGES DISPLAY AND SELECTING CON */}
                    {urlsList != undefined && urlsList != null && urlsList.length != 0 &&
                    <div className="displayingImagesWithAlbumCon" style={{ justifyContent : selectedType != undefined && selectedType.type != undefined && selectedType.type != "S" ? "space-between" : "center" }}>
                        
                        {selectedType.type === "M" &&
                        <div className="eachImageBoxsMainCon">

{/* Showing Images boxs if images not null */}
                            {selectedType != undefined && selectedType.type != undefined && selectedType.type != "S" && urlsList != undefined && urlsList != null && urlsList.length != 0 &&
                             urlsList.map((imgUrl, index)=>{
                                return(
                                    <div id={`imageBoxForEachImage_${index}`} className={`eachImageConBox ${index == imageIndex ? "selectedEachImageConBox" : ""}`} key={index} onClick={()=>SelectingImage(index, "N")}>
                                        <img alt="" src={getImageUrl(imgUrl)} className="eachImageCon" />
                                        <p className="multiMediaNameDislayBox">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="fileAndDeleteIcons" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M9.75293 10.5C10.0484 10.5 10.341 10.4418 10.614 10.3287C10.887 10.2157 11.135 10.0499 11.3439 9.84099C11.5529 9.63206 11.7186 9.38402 11.8317 9.11104C11.9447 8.83806 12.0029 8.54547 12.0029 8.25C12.0029 7.95453 11.9447 7.66194 11.8317 7.38896C11.7186 7.11598 11.5529 6.86794 11.3439 6.65901C11.135 6.45008 10.887 6.28434 10.614 6.17127C10.341 6.0582 10.0484 6 9.75293 6C9.15619 6 8.5839 6.23705 8.16194 6.65901C7.73998 7.08097 7.50293 7.65326 7.50293 8.25C7.50293 8.84674 7.73998 9.41903 8.16194 9.84099C8.5839 10.2629 9.15619 10.5 9.75293 10.5Z" fill="#148B16"/>
                                                <path d="M21 21C21 21.7956 20.6839 22.5587 20.1213 23.1213C19.5587 23.6839 18.7956 24 18 24H6C5.20435 24 4.44129 23.6839 3.87868 23.1213C3.31607 22.5587 3 21.7956 3 21V3C3 2.20435 3.31607 1.44129 3.87868 0.87868C4.44129 0.316071 5.20435 0 6 0L14.25 0L21 6.75V21ZM6 1.5C5.60218 1.5 5.22064 1.65804 4.93934 1.93934C4.65804 2.22064 4.5 2.60218 4.5 3V18L7.836 14.664C7.95422 14.5461 8.10843 14.4709 8.27417 14.4506C8.43992 14.4302 8.60773 14.4657 8.751 14.5515L12 16.5L15.2355 11.97C15.2988 11.8815 15.3806 11.8078 15.4753 11.754C15.5699 11.7003 15.6751 11.6678 15.7836 11.6588C15.8921 11.6498 16.0012 11.6645 16.1034 11.702C16.2056 11.7394 16.2985 11.7986 16.3755 11.8755L19.5 15V6.75H16.5C15.9033 6.75 15.331 6.51295 14.909 6.09099C14.4871 5.66903 14.25 5.09674 14.25 4.5V1.5H6Z" fill="#148B16"/>
                                            </svg>
                                            <span>{selectedType.mediaType == "P" ? "Image" : "Video" }</span>
                                        </p>
                                    </div>
                                )
                            })}

{/* Showing default empty boxs if images is null */}
                            {urlsList != undefined && urlsList != null && urlsList.length != 0 && selectedType.type != undefined && selectedType.type != "S" && Array.from(Array(5 - urlsList.length), (e, i) => {
                                let currentBoxIndex = i + urlsList.length;
                                return (
                                    <div key={currentBoxIndex} className={`eachImageConBox ${currentBoxIndex == imageIndex ? "selectedEachImageConBox" : ""}`}  onClick={()=>SelectingImage(currentBoxIndex, "D")}>
                                        <div className="defaultImageCon">
                                            {/* <img alt="" src={defaultImageUrl} className="defaultImage" /> */}
                                            Add
                                        </div>
                                        <div className="multiMediaNameDislayBox">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="fileAndDeleteIcons" width="24" height="24" viewBox="0 0 19 18" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M4.72656 12.1869C4.87575 12.1869 5.01882 12.2461 5.12431 12.3516C5.2298 12.4571 5.28906 12.6002 5.28906 12.7494V14.2494C5.28906 14.3529 5.37306 14.4369 5.47656 14.4369H14.4766C14.5263 14.4369 14.574 14.4171 14.6091 14.382C14.6443 14.3468 14.6641 14.2991 14.6641 14.2494V12.7494C14.6641 12.6002 14.7233 12.4571 14.8288 12.3516C14.9343 12.2461 15.0774 12.1869 15.2266 12.1869C15.3757 12.1869 15.5188 12.2461 15.6243 12.3516C15.7298 12.4571 15.7891 12.6002 15.7891 12.7494V14.2494C15.7891 14.5975 15.6508 14.9313 15.4046 15.1775C15.1585 15.4236 14.8247 15.5619 14.4766 15.5619H5.47656C5.12847 15.5619 4.79463 15.4236 4.54848 15.1775C4.30234 14.9313 4.16406 14.5975 4.16406 14.2494V12.7494C4.16406 12.6002 4.22333 12.4571 4.32881 12.3516C4.4343 12.2461 4.57738 12.1869 4.72656 12.1869ZM9.03006 12.0946C8.84393 12.0948 8.6645 12.0252 8.52718 11.8995C8.38987 11.7739 8.30464 11.6013 8.28831 11.4159C8.1734 10.1015 8.15335 8.78061 8.22831 7.46338C8.04296 7.45301 7.8577 7.44101 7.67256 7.42738L6.55506 7.34563C6.45664 7.33842 6.36178 7.30578 6.27977 7.25091C6.19775 7.19604 6.13138 7.12081 6.08716 7.03259C6.04293 6.94437 6.02237 6.84618 6.02748 6.74764C6.03259 6.64909 6.0632 6.55355 6.11631 6.47038C6.91273 5.22379 7.93896 4.14003 9.14031 3.27688L9.58806 2.95513C9.70128 2.87382 9.83717 2.83008 9.97656 2.83008C10.116 2.83008 10.2518 2.87382 10.3651 2.95513L10.8128 3.27763C12.0141 4.14057 13.0403 5.22407 13.8368 6.47038C13.8899 6.55355 13.9205 6.64909 13.9256 6.74764C13.9308 6.84618 13.9102 6.94437 13.866 7.03259C13.8217 7.12081 13.7554 7.19604 13.6734 7.25091C13.5913 7.30578 13.4965 7.33842 13.3981 7.34563L12.2806 7.42738C12.0961 7.44088 11.9108 7.45288 11.7256 7.46263C11.8006 8.78038 11.7796 10.1011 11.6641 11.4151C11.6479 11.6006 11.5629 11.7732 11.4257 11.899C11.2885 12.0248 11.1092 12.0946 10.9231 12.0946H9.03006Z" fill="#148B16"/>
                                            </svg>
                                            <p>Add Image</p>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                        }


{/* Main image display BOX */}
                        {!showUploadBox &&
                        <div className={`multiDisplayingImageInPopupCon ${selectedType.type === "M" ? "multiImagesPopupSideImageCon" : ""}`} >
                            <div className="multiDisplayingImageInPopup">

                                {urlsList != undefined && urlsList != null && urlsList.length != 0 && selectedType != undefined && selectedType.mediaType != undefined && selectedType.mediaType == "P" ?
                                    <img alt="" src={getImageUrl()} className="multiImageInPopupBox" />
                                    :
                                    <Fragment>
                                        {getImageUrl().includes("https://www.youtube.com/embed/") ?
                                        <YouTubeEmbed key={`projPreviewPopup`} url={getImageUrl()} className="multiImageInPopupBox" />
                                        :
                                        <video controls alt="" src={getImageUrl()} className="multiImageInPopupBox" />
                                        }
                                    </Fragment>
                                }

                                {selectedType != undefined && selectedType.type != undefined && selectedType.type != "S" &&
                                <div className="imagesSlideArrowsMainCon">
              
                                    <MediaImagesScrollIcon
                                        iconId={`postProjMultiMediaLeftscroll___${fileId}`}
                                        className={`imageBoxLeftAndRightArrow leftArrowIcon ${imageIndex == 0 ? "noRotation" : ""}`}
                                        onClick={()=>SelectingImage(imageIndex, "L")}
                                    />
                                    <MediaImagesScrollIcon
                                        iconId={`postProjMultiMediaRightscroll___${fileId}`}
                                        className={`imageBoxLeftAndRightArrow ${imageIndex === (urlsList && urlsList.length !== undefined ? urlsList.length - 1 : 4) ? "noRotation" : ""}`}
                                        onClick={()=>SelectingImage(imageIndex, "R")}
                                    />
                                </div>
                                }
                            </div>
                        </div>
                        }
                        

{/* ADDING NEW IMAGES */}
                        {showUploadBox &&
                        <div className="newMediaUploadingBlock">
                            <PostPropertyMediaFieldBox
                                key="for multipule selected values"
                                fileId={fileId}
                                title=""
                                mediaType="P"
                                selectedType="M"
                                mediaFilesList={filesList}
                                imgUrlsList={urlsList}
                                required={true}
                                dataLimit={selectedType.dataLimit}
                                errorMsg="Please upload the Other image"
                                onUploadBtnClick={onUploadBtnClick}
                                onRemoveImage={onRemoveImage}
                                buttonTitle="Select File"
                                hideImageDisplayBox="true"
                                cssForText="stylesForImagesBoxTexts"
                                continerWidth="100%"
                                hideNamesList="true"
                            />
                            <p id={`multiImagesPopupMaxLimit_${fileId}`} style={{display:"none"}} className="imgMaxLimitErrMsg">Upload size exceeds limit. Please reduce!</p>
                        </div>
                        }
                    </div>
                    }

                    {showUploadBox && selectedType != undefined && selectedType.type == "S" &&
                    <div className="newMediaUploadingBlockForSingleBox">
                        <PostPropertyMediaFieldBox
                            key="for single selected selected "
                            fileId={fileId}
                            title=""
                            mediaType={selectedType.mediaType}
                            selectedType={selectedType.type}
                            mediaFilesList={filesList}
                            imgUrlsList={urlsList}
                            required={true}
                            dataLimit={selectedType.dataLimit}
                            errorMsg="Please upload the Other image"
                            onUploadBtnClick={onUploadBtnClick}
                            onRemoveImage={onRemoveImage}
                            buttonTitle="Select File"
                            hideImageDisplayBox="true"
                            cssForText="stylesForImagesBoxTexts"
                            continerWidth="100%"

                            hideNamesList="true"
                        />
                        {/* <p id={`singleImagesPopupMaxLimit_${fileId}`} style={{display:"none"}} className="imgMaxLimitErrMsg">Upload size exceeds limit. Please reduce!</p> */}
                    </div>     
                    }
                </div>

                {selectedType != undefined && selectedType.type != undefined && selectedType.type != "M" && 
                <React.Fragment>
                    <p id={`singleImagesPopupMaxLimit_${fileId}_replace`} style={{display:"none"}} className="imgMaxLimitErrMsg">Upload size exceeds limit. Please reduce!</p>
                    <p id={`singleImagesPopupMaxLimit_${fileId}`} style={{display:"none"}} className="imgMaxLimitErrMsg">Upload size exceeds limit. Please reduce!</p>
                </React.Fragment>
                }

                {selectedType != undefined && selectedType.type != undefined && selectedType.type == "M" && 
                <p id={`multiImagesPopupMaxLimit_${fileId}_replace`} style={{display: "none" }} className="imgMaxLimitErrMsg">Upload size exceeds limit. Please reduce!</p>
                } 
                
            </div>
        </div>
    )
};

export default memo(MultipleImagesRenderingPopup);