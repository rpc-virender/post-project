import React, { Fragment, useEffect, useState } from 'react'
import { EditIcon, imagePreviewTabIcon, pdfNameIcon, videoForwardIcon } from '../../images/commonSvgs';
import SingleButton from '../../commonComponents/SingleButton';
import { isBlobURL, pdfuploaded } from '../../images/commonImages';
import YouTubeEmbed from '../../commonComponents/YouTubeEmbed';


export default function PreviewImagesBlock({projectMedia, setStep, onImagePopup, page}) {

    const [selectedType, setSelectedType ] = useState("coverUrl");
    const [selectImageIndex, setSelectImageIndex ] = useState(0);
    const [imageUrlsList, setImageUrlsList] = useState([]);
    const [imageTypes, setImageTypes] = useState(["coverUrl"]);

    const cacheBuster = Math.random(); 

    let imageTypeNames = {
        coverUrl: "Cover Image",
        projOtherImagesUrl: "Other Images",
        projMasterPlanUrl: "Master Plan",
        projVideo: "Project Video",
        projWalkThroughVideoUrl: "Walk Through Video",
        propVideo: "Property Video",
    };

    useEffect(()=>{
        if(projectMedia !== undefined){
            setImageTypes([...Object.keys(projectMedia)]);

            if(!isBlobURL(projectMedia.coverUrl)){
                let imageUrl = `${projectMedia.coverUrl}?v=${cacheBuster}`;
                setImageUrlsList([imageUrl]);
            }else{
                setImageUrlsList([projectMedia.coverUrl]);
            }
        }
    },[projectMedia]);

    // useEffect(()=>{
    //     if(projectMedia != undefined){
    //         setImageTypes([...Object.keys(projectMedia)]);

    //         if(!projectMedia[selectedType].includes(".pdf") && selectedType != "projOtherImagesUrl"){
    //             if(!isBlobURL(projectMedia[selectedType])){
    //                 setImageUrlsList([`${projectMedia[selectedType]}?v=${cacheBuster}`]);
    //             }else{
    //                 setImageUrlsList([projectMedia[selectedType]]);
    //             }
    //         }

    //         if(selectedType == "projOtherImagesUrl" && projectMedia[selectedType] && projectMedia[selectedType].length !== undefined &&projectMedia[selectedType].length > 0){
    //             let newUrlsArray = [];
    //             projectMedia[selectedType].forEach((eachUrl)=>{
    //                 if(!isBlobURL(eachUrl)){
    //                     newUrlsArray.push(`${eachUrl}?v=${cacheBuster}`);
    //                 }else{
    //                     newUrlsArray([...projectMedia[selectedType]]);
    //                 }
    //             })
    //             setImageUrlsList(newUrlsArray);
    //         }
        
        
    //     };
    // },[projectMedia, selectedType]);

    
    const onImageEdit =(identifier) => {
        if(page === "proj"){
            setStep(2);
        }else{
            setStep(3);
        };
        
        // switch(identifier){
        //     case "coverUrl":
        //         console.log("Cover Image");
        //         break;
        //     case "projOtherImagesUrl": 
        //         console.log("Other Images");
        //         break;
        //     case "projVideo":
        //         console.log("Project Video");
        //         break;
        //     case "propVideo":
        //         console.log("Property Video");
        //     case "projMasterPlanUrl":
        //         console.log("Master Plan");
        //         break;
        //     case "projWalkThroughVideoUrl":
        //         console.log("Walk Through Video");
        //         break;
        // }
    };

    const onImageTypeSelect =(keyName) => {
        setSelectedType(keyName);
        let result = projectMedia[keyName];

        if(keyName === "projOtherImagesUrl"){
            setImageUrlsList([...result]);
        }else{
            if(!isBlobURL(result)){ 
                let imageUrl = `${result}?v=${cacheBuster}`;
                setImageUrlsList([imageUrl]);
            }else{
                setImageUrlsList([result]);
            }  
        }
    };

    const onSelectingMedia = (ind) => {
        setSelectImageIndex(ind);

        setTimeout(()=>{
            let videoEl = document.getElementById('myVideo');
            if(videoEl){
                videoEl.play();
            }
        }, 200);
    };

    return (
        <div className='previewImagesBlockMainBlock'>

            <div className='propertyTypeBtnCon previewTypeBtnsCon'>
                {imageTypes.length > 0 && imageTypes.map((keyName, ind)=>{   
                    if(keyName !== "projBroucherUrl"){
                        return(
                            <SingleButton
                                key={keyName}
                                buttonId={`PreviewImageBtn_${keyName}`}
                                containerClassName=""
                                onSubmit={()=>onSelectingMedia(0)}
                                buttonClassName={`imageTypeBtn ${selectedType === keyName ? "imageTypeBtnSelected" : ""}`}
                                title={<span onClick={()=>onImageTypeSelect(keyName)}>{imageTypeNames[keyName]}</span>}
                                icon={selectedType === keyName ? <EditIcon className="imageTypeEditIcon" key={`PrevImageEdit_${keyName}`} iconId={`PreviewImageEditBtn_${keyName}`} onClick={()=>onImageEdit(keyName)} />:""}
                            />
                            )
                        }
                    })
                }
            </div>

            <div className='imageTypeSectionMainCon'>
                <div className='imageTypeSectionImageDisplayBlock'>
                    {imageUrlsList && imageUrlsList[selectImageIndex] !== undefined &&
                    <Fragment>
                        {!selectedType.includes("Video") ? 
                            imageUrlsList[selectImageIndex].includes(".pdf") ? 
                                <iframe src={imageUrlsList[selectImageIndex]} className="imageTypeImageDisplay" />
                                :
                                <img alt='' src={imageUrlsList[selectImageIndex]} className="imageTypeImageDisplay" />
                        :
                            <Fragment>
                                {imageUrlsList[selectImageIndex].includes("https://www.youtube.com/embed/") ?
                                <YouTubeEmbed key={`projPreview`} url={imageUrlsList[selectImageIndex]} className="imageTypeImageDisplay" />
                                :
                                <video id="myVideo" autoplay playsinline loop controls alt='' src={imageUrlsList[selectImageIndex]} className="imageTypeImageDisplay" /> 
                                }
                            </Fragment>
                        }
                    </Fragment>
                    }

                      {/* <ReactPlayer 
                        id="myVideo" playing={true}
                        playsinline loop controls alt='' 
                        url={imageUrlsList[selectImageIndex]} 
                        className="imageTypeImageDisplay" 
                    />  */}

                            {/* <video autoplay loop controls className="imageTypeImageDisplay">
                                <source src={imageUrlsList[selectImageIndex]} type="video/mp4"/>
                            </video> */}

                    {imageUrlsList && imageUrlsList[selectImageIndex] !== undefined && !imageUrlsList[selectImageIndex].includes != undefined && !imageUrlsList[selectImageIndex].includes(".pdf") &&
                    <div className='imagePreviewTabIcon'><span onClick={()=>onImagePopup("OPEN", [imageUrlsList[selectImageIndex]], imageTypeNames[selectedType])}>{imagePreviewTabIcon}</span></div>
                    }
                    </div>

                <div className='imageTypeSectionImageBoxesBlock'>
                    <h2>{imageTypeNames[selectedType]}</h2>
                                            
                    {/* Each image */}
                    <div className='propertyTypeBtnCon previewTypeBtnsCon'>
                        {imageUrlsList.map((eachImage, ind)=>{
                            return(
                                <div key={ind} onClick={()=>onSelectingMedia(ind)} className={`${!eachImage.includes(".pdf") ? "defaultImgBoxCon" : ""} ${selectImageIndex === ind && !eachImage.includes(".pdf") ? "imageTypeEachImageCon" : ""}`}>

                                    {!selectedType.includes("Video") ? 
                                        eachImage.includes(".pdf") ? 
                                            <div className='previewBrochureMiniCard'>
                                                <img alt="" src={pdfuploaded} />
                                
                                                <div className='previewBrochureCardInnerMini'>
                                                    <h3>{pdfNameIcon} Brochure.pdf</h3>
                                                </div>
                                            </div>
                                            :
                                            <img alt='' src={eachImage} className='imageTypeEachImage' />
                                    :
                                    <Fragment>
                                        {eachImage.includes("https://www.youtube.com/embed/") ?
                                        <YouTubeEmbed key={`projPreview`} url={eachImage} className="imageTypeEachImage" />
                                        :
                                        <video id="myVideo" autoplay playsinline loop controls alt='' src={eachImage} className="imageTypeEachImage" /> 
                                        }
                                    </Fragment>
                                    }

                                    {selectedType.includes("Video") &&
                                    <div className='imageTypeEachVideoIcon'>{videoForwardIcon}</div>
                                    }

                                </div>
                                )
                            })
                        }
                    </div>
                    
                </div>
            </div>



        </div>
  )
}
