import React, {useEffect,useState} from "react";
import {leftArrow, rightArrow, defaultImageUrl, blankuploadimage, blankuploadVideo, isBlobURL} from '../images/commonImages';


const NewMediaUploadBox = ({ fileId, title, mediaType, selectedType, required, mediaFilesList, 
                                     imgUrlsList, hideIcon, displayImgClass,icon, boxHeight, data,
                                     dataLimit, errorMsg, onUploadBtnClick, onRemoveImage, isError, hideNamesList,
                                     cssForText, onImagePopup, hideImageDisplayBox, hideNotificationText, continerWidth,acceptedFile, innerTextContent}) => {
    
    const [imageUrl , setImageUrl] = useState(null);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    const SelectingImage = (identifier) => {    
        if(imgUrlsList != undefined){  

            if(identifier == "R"){
                if(imgUrlsList[currentImgIndex + 1] != undefined){
                    setCurrentImgIndex(currentImgIndex + 1);
                }
            }else if(identifier == "L"){
                if(imgUrlsList[currentImgIndex - 1] != undefined){
                    setCurrentImgIndex(currentImgIndex - 1);
                }
            }
        }
    };
    
    
    useEffect(()=>{
		if(imgUrlsList != undefined && imgUrlsList.length > 0 && typeof imgUrlsList[0] !== 'object'){
		    if ((mediaType === "P" || mediaType === "V") && imgUrlsList.length > 0 ) {
			  	if(!isBlobURL(imgUrlsList[0])){
					const cacheBuster = Math.random(); 
		   			setImageUrl(`${imgUrlsList[0]}?v=${cacheBuster}`)
				}else{
					setImageUrl(imgUrlsList[0]);
				}
			} 
		}

        if(imgUrlsList != undefined && imgUrlsList.length != 0 && imgUrlsList[currentImgIndex] == undefined ){
            setCurrentImgIndex(currentImgIndex - 1);
        }
		  
	},[imgUrlsList])


    const getIputText = () => {
            if(imgUrlsList != undefined && imgUrlsList.length == 0){
                if(title == ""){
                    return "Select File"
                }else{
                    return title;
                } 
            }else{
                if(mediaType == "P" && selectedType == "M"){
                    return "ADD MORE";
                }else if(mediaType == "P" && selectedType == "S"){
                    return "Replace Image";
                }else{
                    return "Replace video";
                }
            }

    };

    const overrideEventDefaults = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }


    const onDropFun = (dargged) => {
        if(dargged != undefined && dargged != null) {
            dargged.preventDefault();
            dargged.stopPropagation();
            //let fileId = id;
            let files = dargged.dataTransfer.files;
            let f=files[0];
            let allowedExtensions=(mediaType == "P" ? /(\.png|\.jpg|\.webp|\.jfif|\.JPEG)$/i : /(\.mov|\.mp4)$/i );
         
            if (allowedExtensions.test(f.name) == true) {
                onUploadBtnClick({"target":{"id":fileId,"files":files}});
            }

            
        } 
    }
    

    return(
        <div className="NewMediaUploadBoxMainCon">
            
            <input 
                id={fileId}
                style={{display:"none"}}
                type="file"
                accept={ mediaType == "P" ? ".png, .jpg,.webp,.jfif, .JPEG" : ".mov,.mp4"}
                onChange={(e)=>onUploadBtnClick(e)}
                onClick={(e) => e.target.value = ''}
            />

            { title != undefined && title != null && title != "" && hideNotificationText != "true" &&
            <h3 className="postProjectMidiaBoxHeading" >{title}<span className="mediaRequired">{ required == true ? "*" : "" }</span></h3>
            }
            <p id={`${fileId}_ErrorMsg`} style={{display: "none"}} className="errorMsgForPropmedia">{errorMsg}</p>

            <div className="postProjectMidiaBox" style={{ width: `${continerWidth}%` }}>

{/* Displaying Images */}
                {hideImageDisplayBox != "true" &&
                <div className="newMediaImagesDisplayBox" style={{  height : boxHeight }}>

                    { imgUrlsList != undefined && imgUrlsList != null && imgUrlsList.length == 0 ? (
                        <img src={ mediaType == "P" ? blankuploadimage : blankuploadVideo } alt="" className="newUploadImgIcon" />   
                    ) : (

                        selectedType != "S" ? (

                      
                        
                        <div className="imagesCarosalsMainCon">
                            <div className="imagesCarosalsCon">
                                { imgUrlsList !== undefined && imgUrlsList !== null && imgUrlsList.length != 0 &&                               
                                    <img
                                        src={imgUrlsList[currentImgIndex]} 
                                        className="newDisplayImage"
                                        alt={`Image ${currentImgIndex + 1}`}
                                    />
                                }
                            </div>

                            <div className="imageBoxArrowsCon">
                                <img src={leftArrow} alt="" className="imageBoxLeftAndRightArrow" onClick={()=>SelectingImage("L")} />
                                <img src={rightArrow} alt="" className="imageBoxLeftAndRightArrow" onClick={()=>SelectingImage("R")} />
                            </div>
                        </div>

                        
                        ) : (
                            mediaType == "P" ? (
                                <img id={`${fileId}_SingleImg`} src={imageUrl} className={`newDisplayImage ${displayImgClass}`} style={{  height : boxHeight }} alt="..."/>
                            ):(
                                <video id={`${fileId}_video`} src={imageUrl} controls className={`newDisplayImage ${displayImgClass}`} alt="..."/>
                            )
                        )
                    )}
                    

                </div>
                }

{/* Uploading Media From Input */}
                <div className="newMediaImagesUploadBox"  onDrop={(e) => onDropFun(e)} onDragEnter={overrideEventDefaults} onDragLeave={overrideEventDefaults} onDragOver={overrideEventDefaults} id={`mediaBox_${fileId}`} style={{  height : boxHeight }}>
                    <div  className={`insideCon newInsideCon ${imgUrlsList != undefined && imgUrlsList.length != undefined && imgUrlsList.length != 0 || isError ? "ifMediaAdded" : "" } ${cssForText != undefined ? cssForText : ""}`} style={{ order: hideIcon == true ? "2" : "1" }}>
                        <div className="newMediaboxtextCon" style={{ display: hideNotificationText == "true" && imgUrlsList.length != 0 ? "none" : "block" }}>
                            <p>{innerTextContent != undefined ? "Add specific Floor Plan" : "Select a file or drag and drop here"}</p>
                            <span> {`${mediaType == "P" ? "JPG, PNG orJPEG," : "MP4, MOV, WMV, FLV, AVI,"} file size not more than`} {dataLimit} MB</span>
                        </div>

                        <label htmlFor={fileId} className="upoladMediaFileBtn">
                            {getIputText()}
                            {icon != undefined && icon != null ? icon : ""} 
                        </label>

                    </div>
                    
                    <span id={`postProp_err_msg_${fileId}`} style={{display: "none"}} className="mediaErrMsg newMediaBoxErrMsg">File size more than <span>{ dataLimit }</span> MB is not accepted. Try another file.</span>

{/* Displaying Media Files */}
                    { imgUrlsList != undefined && imgUrlsList != null && imgUrlsList.length != 0 && 
                    <div className="imageFilesCon" style={{ display: hideNamesList == "true" ? "none" : "flex", order: hideIcon == true ? "1" : "2" }}>
                        {hideIcon != undefined && hideIcon != true &&
                        <p className="filesAddingHeading">File added</p>
                        }
                        { imgUrlsList != undefined && imgUrlsList != null && imgUrlsList.length != 0 && 
                        imgUrlsList.map((each, index)=>{
                            return(
                                <div key={index} className="mediaDetailsMainCon">
                                    <div className="mediaNameDislayBox newMediaBoxContant">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="fileAndDeleteIcons" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M9.75293 10.5C10.0484 10.5 10.341 10.4418 10.614 10.3287C10.887 10.2157 11.135 10.0499 11.3439 9.84099C11.5529 9.63206 11.7186 9.38402 11.8317 9.11104C11.9447 8.83806 12.0029 8.54547 12.0029 8.25C12.0029 7.95453 11.9447 7.66194 11.8317 7.38896C11.7186 7.11598 11.5529 6.86794 11.3439 6.65901C11.135 6.45008 10.887 6.28434 10.614 6.17127C10.341 6.0582 10.0484 6 9.75293 6C9.15619 6 8.5839 6.23705 8.16194 6.65901C7.73998 7.08097 7.50293 7.65326 7.50293 8.25C7.50293 8.84674 7.73998 9.41903 8.16194 9.84099C8.5839 10.2629 9.15619 10.5 9.75293 10.5Z" fill="#0F91D2"/>
                                            <path d="M21 21C21 21.7956 20.6839 22.5587 20.1213 23.1213C19.5587 23.6839 18.7956 24 18 24H6C5.20435 24 4.44129 23.6839 3.87868 23.1213C3.31607 22.5587 3 21.7956 3 21V3C3 2.20435 3.31607 1.44129 3.87868 0.87868C4.44129 0.316071 5.20435 0 6 0L14.25 0L21 6.75V21ZM6 1.5C5.60218 1.5 5.22064 1.65804 4.93934 1.93934C4.65804 2.22064 4.5 2.60218 4.5 3V18L7.836 14.664C7.95422 14.5461 8.10843 14.4709 8.27417 14.4506C8.43992 14.4302 8.60773 14.4657 8.751 14.5515L12 16.5L15.2355 11.97C15.2988 11.8815 15.3806 11.8078 15.4753 11.754C15.5699 11.7003 15.6751 11.6678 15.7836 11.6588C15.8921 11.6498 16.0012 11.6645 16.1034 11.702C16.2056 11.7394 16.2985 11.7986 16.3755 11.8755L19.5 15V6.75H16.5C15.9033 6.75 15.331 6.51295 14.909 6.09099C14.4871 5.66903 14.25 5.09674 14.25 4.5V1.5H6Z" fill="#0F91D2"/>
                                        </svg>
                                        { each != undefined && each != null &&  mediaType !=undefined && mediaType != null && mediaType == "P" ?  
                                            <p>{"Image"}</p>:
                                            <p>{"video"+".mp4"}</p>
                                        }
                                        
                                        {/* <p>{ each != undefined && each != null ? "Image"+(index+1)+".jpg": "" }</p> */}
                                    </div>  
                                    
                                    <div className="mediaBoxSideIcons newMediaBoxIcons">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="fileAndDeleteIcons" onClick={()=>onImagePopup("OPEN", data)}>
                                            <g clipPath="url(#clip0_460_6712)">
                                                <path d="M10.4335 3.15667C16.6835 3.17647 20.4117 10.0633 20.4117 10.0633C20.4117 10.0633 16.64 16.9264 10.39 16.9066C4.14003 16.8868 0.41182 9.99997 0.41182 9.99997C0.41182 9.99997 4.18357 3.13688 10.4335 3.15667ZM10.4296 4.40667C6.02961 4.39273 2.91425 8.44663 1.88056 10.0046C2.90312 11.5679 5.99273 15.6427 10.394 15.6566C14.7939 15.6705 17.9093 11.6166 18.943 10.0587C17.9204 8.49541 14.8308 4.4206 10.4296 4.40667ZM10.4256 5.65666C11.5859 5.66033 12.6973 6.12479 13.5151 6.94786C14.333 7.77092 14.7904 8.88518 14.7867 10.0455C14.7831 11.2058 14.3186 12.3171 13.4955 13.135C12.6725 13.9529 11.5582 14.4103 10.3979 14.4066C9.2376 14.4029 8.12626 13.9385 7.3084 13.1154C6.49053 12.2924 6.03312 11.1781 6.03679 10.0178C6.04047 8.85746 6.50492 7.74613 7.32799 6.92826C8.15106 6.11039 9.26531 5.65298 10.4256 5.65666ZM10.4217 6.90665C9.59317 6.90502 8.79785 7.23206 8.21016 7.81604C7.62247 8.40002 7.2904 9.19325 7.28679 10.0217C7.28133 11.7442 8.67813 13.1512 10.4019 13.1566C12.1256 13.1621 13.5313 11.764 13.5368 10.0415C13.5422 8.31904 12.1454 6.91211 10.4217 6.90665Z" fill="#767270"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_460_6712">
                                                <rect width="20" height="20" fill="white" transform="translate(0.441406) rotate(0.181465)"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        
                                    
                                        <label className="editIconForSecondMediaLable" htmlFor={fileId}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="fileAndDeleteIcons">
                                                <path d="M1.70445 16.2538L19.2044 16.3093L19.2004 17.5593L1.70049 17.5038L1.70445 16.2538ZM16.363 5.6752C16.8646 5.17679 16.867 4.42679 16.3686 3.92521L14.1257 1.6681C13.6273 1.16652 12.8773 1.16414 12.3757 1.66256L2.97107 11.0078L2.9584 15.0078L6.95838 15.0205L16.363 5.6752ZM13.2479 2.54032L15.4908 4.79744L13.6099 6.66649L11.367 4.40937L13.2479 2.54032ZM4.21235 13.7618L4.21948 11.5118L10.4892 5.2816L12.7321 7.53871L6.46234 13.7689L4.21235 13.7618Z" fill="#0073C6"/>
                                            </svg>
                                        </label>

                                        <svg xmlns="http://www.w3.org/2000/svg" className="fileAndDeleteIcons"  width="21" height="22" viewBox="0 0 21 22" fill="none" onClick={(e)=>onRemoveImage(each, fileId)}>
                                            <path d="M13.81 8.51106L13.7836 16.8444L7.11694 16.8232L7.14333 8.48995L13.81 8.51106ZM12.5758 3.50713L8.40916 3.49393L7.57319 4.32462L4.65654 4.31538L4.65126 5.98204L16.3179 6.01899L16.3231 4.35233L13.4065 4.3431L12.5758 3.50713ZM15.4819 6.84968L5.48195 6.81801L5.45028 16.818C5.44738 17.7346 6.195 18.487 7.11166 18.4899L13.7783 18.511C14.695 18.5139 15.4473 17.7663 15.4502 16.8496L15.4819 6.84968Z" fill="#FF0000"/>
                                        </svg>
                                    </div>
                                    
                                </div>
                                )
                            })}
                    </div>
                    }



                </div>
            </div>
        </div>
    )
};

export default NewMediaUploadBox;