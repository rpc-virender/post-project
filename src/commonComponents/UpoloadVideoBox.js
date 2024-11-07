import React, { memo, useEffect, useState } from "react";
import { blankuploadVideo, isBlobURL } from "../images/commonImages";
import { DeleteIcon, EditIcon, FileIcon, ImagePreviewEyeIcon, smallGrayDot } from "../images/commonSvgs";
import Input from "./Input";
import SingleButton from "./SingleButton";
import YouTubeEmbed from "./YouTubeEmbed";

const UpoloadVideoBox = ({ fileId, title, required, mediaFilesList, imgUrlsList, hideIcon, displayImgClass, boxHeight,
                          dataLimit, errorMsg, onUploadBtnClick, onRemoveImage, onImagePopup, continerWidth, uploadingVideo, youTube
                        }) => {

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if ( imgUrlsList != undefined && imgUrlsList.length > 0 && typeof imgUrlsList[0] !== "object" ) {
      if (imgUrlsList.length > 0) {
        if (!isBlobURL(imgUrlsList[0])) {
          const cacheBuster = Math.random();
          setImageUrl(`${imgUrlsList[0]}?v=${cacheBuster}`);
        } else {
          setImageUrl(imgUrlsList[0]);
        }
      }
    }

  }, [imgUrlsList]);

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

      let allowedExtensions = /(\.mov|\.mp4)$/i
        
      if (allowedExtensions.test(f.name) == true) {
        onUploadBtnClick({ target: { id: fileId, files: files } });
      }
    }
  };

  return (
    <div className="postProjectMidiaMainCon" style={{ height: hideIcon == true ? "80px" : "" }} >
      <input
        id={fileId}
        style={{ display: "none" }}
        type="file"
        accept=".mov,.mp4"
        onChange={(e) => onUploadBtnClick(e)}
        onClick={(e) => (e.target.value = "")}
      />

      {title  && title != "" &&
      <h3 className="postProjectMidiaBoxHeading">
        {title} <span className="mediaRequired">{required == true ? "*" : ""}</span>
      </h3>
      }

      <p id={`${fileId}_ErrorMsg`} style={{ display: "none" }} className="errorMsgForPropmedia">
        {errorMsg}
      </p>

      <div className="postProjectMidiaBox" style={{ width: `${continerWidth}%` }}>
        {/* Displaying Images */}
        <div className="postProjectImagesDisplayBox" style={{ height: boxHeight}} >
            {imgUrlsList  && imgUrlsList.length == 0 ?
            <img src={blankuploadVideo} alt="" className="uploadImgIcon" />
            : 
            (youTube.isYoutubeVideo ?
              <YouTubeEmbed url={imageUrl} className={`displayImage ${displayImgClass}`} />
              :
              <video
                id={`${fileId}_video`}
                src={imageUrl}
                controls
                className={`displayImage ${displayImgClass}`}
                alt=""
              />
            )}
        </div>


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
            <div className="newUploadDetailsTextBox">
                <div className="newUploadDetailsTextInnerBox">
                    <p className="videoUploadBoxHeading">Select a file or drag and drop here</p>

                    {/* Displaying Media Files */}
                    {imgUrlsList && imgUrlsList.length > 0 && !youTube.isYoutubeVideo ?
                    <div className="displayingEditIconsAndText">
                        <span className="videoUploadFileAddedText">File added </span>
                        <p className="videoUploadFileNameTextWithIcons">  
                            <FileIcon className="videoFileAndDeleteIcons videoUploadFileSvg" onClick={()=>("")} />
                            <span>movie.mp4</span>
                            {smallGrayDot}
                            <span className="videoDataLimitText">{dataLimit} MB </span>
                            <ImagePreviewEyeIcon className="videoFileAndDeleteIcons" onClick={()=>onImagePopup("OPEN", title, "S", "V", mediaFilesList, imgUrlsList, fileId, dataLimit, 0)} />
                            <label className="editVideoIconClass" htmlFor={fileId}>
                              <EditIcon className="videoFileAndDeleteIcons" onClick={()=>("")} />
                            </label>
                            <DeleteIcon className="videoFileAndDeleteIcons" onClick={() => onRemoveImage(imgUrlsList[0], fileId)} />
                        </p>
                    </div>
                    :
                    <p className="ifNoVideoUrlText">MP4, MPVI , file size not more than {dataLimit}MB</p>
                    }

                </div>

                <label htmlFor={fileId} className="newVideoUploadBtn">{((imgUrlsList !== undefined && imgUrlsList.length === 0) || youTube.isYoutubeVideo) ? "Select File" : "Replace video"} </label>
            </div>

            <div className="videoUploadBoxHr" >
                <hr/>
                <span>or</span>
            </div>

            <div className="uTubeVideoURLuploadFieldBox">
                <Input
                    required = "false"
                    key={`uTube_${fileId}`}
                    inputId={`uTube_${fileId}`}
                    name={fileId}
                    onChange={(e)=>uploadingVideo(e)}
                    placeholder="Enter Youtube URL"
                    type="search"
                    className="uTubeVideoURLuploadField"
                    containerClassName="uTubeVideoURLuploadFieldCon"
                    inputOuterContainerClassName="uTubeVideoURLuploadFieldOuterCon"
                    value={youTube.url}                  
                />

                <SingleButton
                    key={`videoURL_${fileId}`}
                    name="submit"
                    buttonId={`videoURL_${fileId}`}
                    containerClassName="videoURLuploadBtnCon"
                    buttonClassName="videoURLuploadBtn"
                    onSubmit={(e)=>uploadingVideo(e)}
                    // title={((imageUrl !== null && imageUrl !== "") || youTube.isYoutubeVideo) ? "REPLACE URL" : "Add URL"}
                    title={!youTube.isYoutubeVideo ? "Add URL" : (imageUrl === undefined || imageUrl === null || imageUrl === "") ? "Add URL" : "Replace URL" }
                />
            </div>
            
            <span id={`postProp_err_msg_${fileId}`} style={{ display: "none" }} className="mediaErrMsg" >
                File size more than {dataLimit} MB is not accepted. Try another file.
            </span>

            <span id={`videoErrorMsg_${fileId}`} style={{ display: "none" }} className="mediaErrMsg" >
                Please Enter Youtube Video Url
            </span>
        </div>
      </div>
    </div>
  );
};

export default memo(UpoloadVideoBox);
