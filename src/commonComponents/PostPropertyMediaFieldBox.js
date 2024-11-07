import React, { Fragment, memo, useEffect, useState } from "react";
import {
  blankuploadimage,
  blankuploadVideo,
  isBlobURL,
  pdfOrImage,
  pdfUploadDefaultImg,
  pdfuploaded,
} from "../images/commonImages";

import { DeleteIcon, EditIcon, FileIcon, ImagePreviewEyeIcon, MediaImagesScrollIcon, commonPdfIcon, mediaCloudIcon } from "../images/commonSvgs";
import ImageLoaderBlock from "./ImageLoaderBlock";

const PostPropertyMediaFieldBox = ({fileId, title, mediaType, selectedType, required, mediaFilesList, imgUrlsList, hideIcon, displayImgClass,
                                    icon, boxHeight, dataLimit,  errorMsg,  onUploadBtnClick,  onRemoveImage,  isError,  hideNamesList,
                                    cssForText,  onImagePopup,  hideImageDisplayBox,  hideNotificationText,  continerWidth,  acceptedFile,
                                    innerTextContent,  hideIconEditPreview,  setImageIndex,  hideDataText,  disbleDeleteIcon,  progress
                                  }) => {

  const [imageUrl, setImageUrl] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const SelectingImage = (identifier) => {
    if (imgUrlsList != undefined) {
      if (identifier == "R") {
        if (imgUrlsList[currentImgIndex + 1] != undefined) {
          setCurrentImgIndex(currentImgIndex + 1);
        }
      } else if (identifier == "L") {
        if (imgUrlsList[currentImgIndex - 1] != undefined) {
          setCurrentImgIndex(currentImgIndex - 1);
        }
      }
    }
  };


  const getImageUrl = (otherEachUrl) => {
    var url;
    if(otherEachUrl){
        url = otherEachUrl;
    }
    else{
        url = imgUrlsList[0];
    }

    if(url){
      if (!isBlobURL(url)) {
          const cacheBuster = Math.random();
          return `${url}?v=${cacheBuster}`;
      } else {
          return url;
      }
    }
  };

  useEffect(() => {
    if (
      imgUrlsList != undefined &&
      imgUrlsList.length > 0 &&
      typeof imgUrlsList[0] !== "object"
    ) {
      if ((mediaType === "P" || mediaType === "V" || mediaType === "N" ) && imgUrlsList.length > 0) {
        if (!isBlobURL(imgUrlsList[0])) {
          const cacheBuster = Math.random();
          setImageUrl(`${imgUrlsList[0]}?v=${cacheBuster}`);
        } else {
          setImageUrl(imgUrlsList[0]);
        }
      }
    }

    if (
      imgUrlsList != undefined &&
      imgUrlsList.length != 0 &&
      imgUrlsList[currentImgIndex] == undefined && 
      currentImgIndex > 0
    ) {
      setCurrentImgIndex(currentImgIndex - 1);
    }
  }, [imgUrlsList]);

  const getIputText = () => {
    if (imgUrlsList != undefined && imgUrlsList.length == 0) {
      return "Select File";
    } else {
      if (fileId == "master_plan" && selectedType == "S") {
        return "REPLACE File";
      }else if (mediaType == "PDF" && selectedType == "S") {
        return "REPLACE PDF";
      } else if (mediaType == "P" && selectedType == "M") {
        return "ADD MORE";
      } else if (mediaType == "P" && selectedType == "S") {
        return "REPLACE IMAGE";
      } else {
        return "Replace video";
      }
    }
  };

  const overrideEventDefaults = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDropFun = (dargged) => {
    if (dargged != undefined && dargged != null) {
      dargged.preventDefault();
      dargged.stopPropagation();
      //let fileId = id;
      let files = dargged.dataTransfer.files;
      let f = files[0];

      let allowedExtensions = fileId == "master_plan" ? /(\.png|\.jpg|\.JPEG|\.webp|\.jfif|\.pdf)$/i : 
                              mediaType == "PDF" ? /(\.pdf)$/i : 
                              mediaType == "P" ? /(\.png|\.jpg|\.webp|\.jfif|\.JPEG)$/i : /(\.mov|\.mp4)$/i
        

      if (allowedExtensions.test(f.name) == true) {
        onUploadBtnClick({ target: { id: fileId, files: files } });
      }
    }
  };

  const getTheId = (ind) => {
    if(setImageIndex){
      setImageIndex(ind);
    };
    
  }

  return (
    <div
      className="postProjectMidiaMainCon"
      style={{ height: hideIcon == true ? "80px" : "" }}
    >

      <input
        id={fileId}
        style={{ display: "none" }}
        type="file"
        accept={
          fileId == "master_plan" ? ".pdf, .png, .jpg,.webp,.jfif, .JPEG" : 
            mediaType == "PDF" ? ".pdf" : 
              mediaType == "P" ? ".png, .jpg,.webp, .JPEG,.jfif" : ".mov,.mp4"
        }
        onChange={(e) => onUploadBtnClick(e)}
        onClick={(e) => (e.target.value = "")}
      />

      <input
        id={fileId + "_rep"}
        style={{ display: "none" }}
        type="file"
        accept=".png, .jpg, .webp, .jfif, .JPEG"
        onChange={(e) => onUploadBtnClick(e, undefined, undefined, true)}
        onClick={(e) => (e.target.value = "")}
      />

      {title != undefined && title != null && title != "" &&
        hideNotificationText != "true" && (
          <h3 className="postProjectMidiaBoxHeading">
            {title}
            <span className="mediaRequired">{required == true ? "*" : ""}</span>
          </h3>
        )}

      <p id={`${fileId}_ErrorMsg`} style={{ display: "none" }} className="errorMsgForPropmedia" >
        {errorMsg}
      </p>

      <div className="postProjectMidiaBox" style={{ width: `${continerWidth}%` }} >
        {/* Displaying Images */}
        {hideImageDisplayBox != "true" && (
          <div className="postProjectImagesDisplayBox" style={{ height: boxHeight}} >
            {imgUrlsList != undefined &&
            imgUrlsList != null &&
            imgUrlsList.length == 0 ? (
              <img
                src={
                  mediaType == "PDF"
                    ? pdfUploadDefaultImg
                    : mediaType == "P"
                    ? blankuploadimage
                    : mediaType == "N" 
                    ? pdfOrImage :
                    blankuploadVideo
                }
                alt=""
                className="uploadImgIcon"
              />
            ) : selectedType != "S" ? (
              <div className="imagesCarosalsMainCon">
                <div className="imagesCarosalsCon">
                  {imgUrlsList !== undefined && imgUrlsList !== null && imgUrlsList.length != 0 && (
                      <img
                        src={getImageUrl(imgUrlsList[currentImgIndex])}
                        className="displayImage"
                        alt={`Image ${currentImgIndex + 1}`}
                      />
                    )}
                </div>

                {imgUrlsList !== undefined && imgUrlsList !== null && imgUrlsList.length > 1 &&
                <div className="imageBoxArrowsCon">
                  <MediaImagesScrollIcon
                    iconId={`postProjMultiMediaLeftscroll_${fileId}`}
                    className={`imageBoxLeftAndRightArrow leftArrowIcon ${currentImgIndex === 0 ? "noRotation" : ""}`}
                    onClick={() => SelectingImage("L")}
                  />
                  <MediaImagesScrollIcon
                    iconId={`postProjMultiMediaRightscroll_${fileId}`}
                    className={`imageBoxLeftAndRightArrow ${currentImgIndex === (imgUrlsList && imgUrlsList.length !== undefined ? imgUrlsList.length - 1 : 4) ? "noRotation" : ""}`}
                    onClick={() => SelectingImage("R")}
                  />
                </div>
                }

              </div>
            ) : mediaType == "PDF" ? (
              <img
                id={`${fileId}_pdfImg`}
                src={pdfuploaded}
                className={`displayImage ${displayImgClass}`}
                style={{ height: boxHeight }}
                alt="..."
              />
            ) : mediaType == "P" ? (
              <img
                id={`${fileId}_SingleImg`}
                src={imageUrl}
                className={`displayImage ${displayImgClass}`}
                style={{ height: boxHeight }}
                alt="..."
              />
            ) : (
              <video
                id={`${fileId}_video`}
                src={imageUrl}
                controls
                className={`displayImage ${displayImgClass}`}
                alt="..."
              />
            )}
          </div>
        )}

        {/* Uploading Media From Input */}
        <div
          className="postProjectImagesUploadBox"
          onDrop={(e) => onDropFun(e)}
          onDragEnter={overrideEventDefaults}
          onDragLeave={overrideEventDefaults}
          onDragOver={overrideEventDefaults}
          id={`mediaBox_${fileId}`}
          style={{ height: boxHeight }}
        >
          <div 
            className={`insideCon ${(imgUrlsList != undefined && imgUrlsList.length != undefined && imgUrlsList.length != 0) || (progress && progress.status) || isError ? "ifMediaAdded" : "" } ${cssForText != undefined ? cssForText : ""}`}
            // style={{ order: hideIcon == true ? "2" : "1" }}
          >
            {hideIcon != true && (
              mediaCloudIcon
            )} 

            <div style={{ display: hideNotificationText == "true" && imgUrlsList.length != 0 ? "none" : "block"}}>
              <p className="textStyleForLargeDevices">
                {innerTextContent != undefined ? "Add specific Floor Plan" : "Select a file or drag and drop here"}
              </p>

              <p className="textStyleForMobile">
                {innerTextContent != undefined ? "Add specific Floor Plan" : "Select a file"}
              </p>

              {hideDataText != true &&
              <span>
                {`${
                  mediaType == "N" || fileId == "master_plan"
                    ? "JPG, WEBP, PNG, JFIF or JPEG, PDF" 
                    :
                  mediaType == "PDF"
                    ? "PDF"
                    : mediaType == "P"
                    ? "JPG, WEBP, PNG, JFIF or JPEG,"
                    :  "MP4, MOV, WMV, FLV, AVI,"
                } ${selectedType == "M" ? "Each " : ""} file size not more than `}
                {dataLimit} MB
              </span>
              }
            </div>

            {selectedType != "M" &&
            <label htmlFor={fileId} className="upoladMediaFileBtn">
              {getIputText()}
              {icon != undefined && icon != null ? icon : ""}
            </label>
            }

            {imgUrlsList != undefined && imgUrlsList.length != undefined &&  imgUrlsList.length < 5 && selectedType == "M" &&
            <label htmlFor={fileId} className="upoladMediaFileBtn">
              {getIputText()}
              {icon != undefined && icon != null ? icon : ""}
            </label>
            }
          </div>

          <span id={`postProp_err_msg_${fileId}`} style={{ display: "none" }} className="mediaErrMsg">
            File size more than {dataLimit} MB is not accepted.Try another file.
          </span>

          {/* Displaying Media Files */}
          {imgUrlsList != undefined && imgUrlsList != null && imgUrlsList.length > 0 && (
              <div
                className="imageFilesCon"
                style={{
                  display: hideNamesList == "true" ? "none" : "flex",
                  order: hideIcon == true ? "1" : "2",
                }}
              >
                {hideIcon != undefined && hideIcon != true && (
                  <p className="filesAddingHeading">File added</p>
                )}

                {imgUrlsList != undefined && imgUrlsList != null && imgUrlsList.length != 0 &&
                    imgUrlsList.map((each, index) => {
                      // console.log(fileId, progress.id)
                      return (
                        <Fragment>
                          {((progress && !progress.status) || (progress && progress.status && index !== progress.index) || progress === undefined) ?
                          <div key={`mediaNameDislayBox_${index}`} className="mediaDetailsMainCon">
                            <div className="mediaNameDislayBox">
                              {mediaType == "PDF" ? (
                                commonPdfIcon
                              ) : (
                                <FileIcon className="fileAndDeleteIcons" onClick={()=>("")} />
                              )}
                              {each != undefined && each != null && mediaType != undefined && mediaType != null && mediaType == "PDF" ? (
                                <p>{fileId == "master_plan" ? "Master Plan.PDF" : "BROCHURE.PDF"}</p>
                              ) : mediaType == "P" ? (
                                <p>{"Image " + (index + 1)}</p>
                              ) : (
                                <p>{"video " + (index + 1)}</p>
                              )}
                            </div>

                            <div className="mediaBoxSideIcons">
                              {hideIconEditPreview ? (
                                ""
                              ) : (
                                <div className="mediaBoxSideIcons">
                                  <ImagePreviewEyeIcon 
                                      key={`preview_${fileId}`}
                                      className="fileAndDeleteIcons" 
                                      onClick={()=>onImagePopup( "OPEN", title, selectedType, mediaType, mediaFilesList, imgUrlsList, fileId, dataLimit, index )} 
                                  />

                                  {fileId && fileId.includes("other") != undefined && fileId.includes("other") ?
                                  <span onClick={()=>getTheId(index)}>
                                    <label className="editIconForSecondMediaLable" htmlFor={fileId+"_rep"} >
                                      <EditIcon key={`imgEdit_${fileId}`} className="fileAndDeleteIcons" onClick={()=>("")} />
                                    </label>
                                  </span>
                                  :
                                  <label className="editIconForSecondMediaLable" htmlFor={fileId} >
                                    <EditIcon key={`imgEdit2_${fileId}`} className="fileAndDeleteIcons" onClick={()=>("")} />
                                  </label>
                                  }
                                </div>
                              )}

                              {(disbleDeleteIcon === undefined || disbleDeleteIcon !== true) &&
                              <DeleteIcon key={`deleteImg_${fileId}`} className="fileAndDeleteIcons" onClick={() =>onRemoveImage(each, fileId)} />
                              }

                            </div>
                          </div>
                          :
                          <ImageLoaderBlock key={`imagesProgres_${fileId}`} id={`imagesProgres_${fileId}`} value={progress.loader} />
                          }
                        </Fragment>
                      );
                    })
                }

                {(progress && progress.status && progress.index >= imgUrlsList.length) &&
                <ImageLoaderBlock key={`imagesProgres_${fileId}`} id={`imagesProgres_${fileId}`} value={progress.loader} />
                }
              </div>
          )}

          {(imgUrlsList && imgUrlsList.length === 0 && progress && progress.status) &&
          <div className="imageFilesCon">
            <ImageLoaderBlock key={`imagesProgres2_${fileId}`} id={`imagesProgres2_${fileId}`} value={progress.loader} />
          </div>
          }
        </div>
      </div>
    </div>
  );
};

export default memo(PostPropertyMediaFieldBox);
