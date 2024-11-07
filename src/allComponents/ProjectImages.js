import React, { memo, useEffect, useState } from "react";
import $ from 'jquery';

import '../styles/postProjectMedia.css';

import SingleButton from "../commonComponents/SingleButton";
import PostPropertyMediaFieldBox from '../commonComponents/PostPropertyMediaFieldBox';

import Loader from '../commonComponents/Loader';
import MultipleImagesRenderingPopup from '../commonComponents/MultipleImagesRenderingPopup';
import PdfPopup from "../commonComponents/PdfPopup";
import { isBlobURL } from "../images/commonImages";

import { compressImageTo2MB, extractYouTubeVideoID } from "../images/constant";
import UpoloadVideoBox from "../commonComponents/UpoloadVideoBox";

const ProjectImages = ({ onNextclick, projectMedia, setStatusList, statusList, imageForStep, masterPlanUrl, setMasterPlanUrl, coverImgUrl, setCoverImgUrl ,
                        getMediaResponse, setImageForStep, isEdit, walkThroughUtube, setWalkThroughUtube, projectUtube, setProjectUtube }) => {

    const current = "https://d1eia5vwbzlltl.cloudfront.net/button.png";
    const completed = "https://d1eia5vwbzlltl.cloudfront.net/tick-mark.png";
    const [otherImagesFiles, setOtherImagesFiles] = useState([]);
    const [otherImgUrls, setOtherImgUrls] = useState([]);
    const [coverImageFile, setCoverImageFile] = useState([]);
    const [masterPlanFile, setMasterPlanFile] = useState([]);
    const [videoFile, setVideoFile] = useState([]);
    const [videoUrl, setvideoUrl] = useState([]);
    const [walkThroughVideoFile, setWalkThroughVideoFile] = useState([]);
    const [walkThroughVideoUrl, setWalkThroughvideoUrl] = useState([]);
    const [masterFileType,setMasterFileType] = useState("N");

    const [imageIndex, setImageIndex ] = useState(0);

    const [isError, setIsError] = useState(false);

    const [showUploadBox, setShowUploadBox] = useState(false);

    const getUploadDataType=(str,lastSign)=>{
        const lastSlashIndex = str.lastIndexOf(lastSign);
        if (lastSlashIndex !== -1) {
            let type = str.substring(lastSlashIndex + 1);
            if(type == "pdf"){
                return "PDF"
            }else{
                return "P"
            }
        } else {
            return "N";
        }
    }

    useEffect(() => {
        if (isEdit === true) {
            if (getMediaResponse !== undefined && getMediaResponse != null) {
                if (getMediaResponse.coverUrl !== undefined && getMediaResponse.coverUrl != null && getMediaResponse.coverUrl.length > 0) {
                    setCoverImgUrl([getMediaResponse.coverUrl]);
                }
                if (getMediaResponse.projOtherImagesUrl !== undefined && getMediaResponse.projOtherImagesUrl != null
                    && getMediaResponse.projOtherImagesUrl.length > 0) {
                    setOtherImgUrls(getMediaResponse.projOtherImagesUrl);
                }

                if (getMediaResponse.projMasterPlanUrl !== undefined && getMediaResponse.projMasterPlanUrl != null &&
                    getMediaResponse.projMasterPlanUrl.length > 0) {
                    if(typeof getMediaResponse.projMasterPlanUrl == "object"){
                        let url = getMediaResponse.projMasterPlanUrl[0].type;
                        setMasterFileType(getUploadDataType(url,"/"))
                    }else{
                        setMasterFileType(getUploadDataType(getMediaResponse.projMasterPlanUrl,"."))
                    }
                    
                    setMasterPlanUrl([getMediaResponse.projMasterPlanUrl]);
                }

                if (getMediaResponse.projVideo !== undefined && getMediaResponse.projVideo != null && getMediaResponse.projVideo.length > 0) {
                    setvideoUrl([getMediaResponse.projVideo]);
                    if(getMediaResponse.projVideo.includes("https://www.youtube.com/embed/")){
                        setProjectUtube({url: getMediaResponse.projVideo, isYoutubeVideo: true});
                    }
                }

                if (getMediaResponse.projWalkThroughVideoUrl !== undefined && getMediaResponse.projWalkThroughVideoUrl != null &&
                    getMediaResponse.projWalkThroughVideoUrl.length > 0) {
                    setWalkThroughvideoUrl([getMediaResponse.projWalkThroughVideoUrl]);
                    if(getMediaResponse.projWalkThroughVideoUrl.includes("https://www.youtube.com/embed/")){
                        setWalkThroughUtube({url: getMediaResponse.projWalkThroughVideoUrl, isYoutubeVideo: true});
                    }
                }
            }
        }
    }, [getMediaResponse]);


    useEffect(() => {
        let stepKey = `step${1}`;
        if (imageForStep[stepKey] === completed) {
            setImageForStep(prevImageForStep => ({
                ...prevImageForStep,
                [stepKey]: current
            }));
        }
    }, [otherImagesFiles, otherImgUrls, coverImageFile, masterPlanFile, videoFile]);


    const onAddingMedia = (e) => {
        projectMedia.cover.push(...coverImageFile);
        projectMedia.other.push(...otherImagesFiles);
        projectMedia.masterplan.push(...masterPlanFile);
        projectMedia.video.push(...videoFile);
        projectMedia.statusList.push(...statusList);
        projectMedia.walkThroughVideo.push(...walkThroughVideoFile);
        onNextclick(e);
    };

    const [selectedType, setSelectedType] = useState({ id: "", type: "", mediaType: "", boxTitle: '', dataLimit: 0 });
    const [filesArray, setFilesArray] = useState([]);
    const [urlsArray, setUrlsArray] = useState([]);


    const onImagePopup = (identifier, title, type, mediaType, files, urls, id, dataLimit, index) => {

        setSelectedType({ id: id, type: type, mediaType: mediaType, boxTitle: title, dataLimit: dataLimit });
        setFilesArray(files);
        setUrlsArray(urls);
        setImageIndex(index);
        setProgress(prev=>({...prev,  index: index }));

        switch (identifier) {
            case "OPEN":
                //setPreviewData(eachRow);
                document.body.style.overflow = "hidden";
                $("#multiImagesRenderingPopup").show();
                break;

            case "CLOSE":
                $("#multiImagesRenderingPopup").hide();
                document.body.style.overflow = "scroll";
                break;
            default:
                return ""
        }
    };

    const [progress, setProgress] = useState({ status: false, loader: 0, index: 0, id : "" });
    const maxFileSize = 2 * 1024 * 1024;

    const updateProgress = (value) => {
        setProgress(prev=>({...prev, loader: value }));
    };

    const onSingleMediaUploading = (file, dataLimit, fileId) => {
        let errSplitedTextId = fileId ? fileId.split("_") : "";
        let errorTextId = errSplitedTextId[0] + "_" + errSplitedTextId[1] ;
        $(`#singleImagesPopupMaxLimit_${fileId}`).hide();
        $(`#singleImagesPopupMaxLimit_${fileId}_replace`).hide();

        if (file.size > (dataLimit * 1000000)) {
            $('#' + `postProp_err_msg_${errorTextId}`).css('display', 'block');
            $('#' + `postProp_err_msg_${errorTextId}`).text(`File size more than ${dataLimit} MB is not accepted. Please use another file`);
            setIsError(true);
            if(fileId.includes("_replace")){
                $(`#singleImagesPopupMaxLimit_${fileId}_replace`).show();
            };

            $(`#singleImagesPopupMaxLimit_${fileId}`).show();

            if(fileId.includes("master_plan")){
                $(`#pdfPopupMaxlimitErrorMsg`).text(`File size more than ${dataLimit} MB`);
            };

            setTimeout(()=>{
                $('#' + `postProp_err_msg_${errorTextId}`).css('display', 'none');
                $(`#singleImagesPopupMaxLimit_${fileId}`).hide();
                $(`#singleImagesPopupMaxLimit_${fileId}_replace`).hide();
                if(fileId.includes("master_plan")){
                    $(`#pdfPopupMaxlimitErrorMsg`).text(``);
                };
            },5000);
        } else {
            if (fileId.includes("cover_image")) {
				$("#mediaBox_cover_image").css("border-color", "#0073C6");

                const onUpdate = (newFile) => {
                    setCoverImageFile([newFile]);
                    setCoverImgUrl([URL.createObjectURL(newFile)]);
                    setProgress(prev=>({...prev, status: false, loader: 0, index: 0, id: fileId }));
                    setStatusList(prevStatusList => {
                        const updatedStatusList = [...prevStatusList];
                        updatedStatusList[0] = "Y";
                        return updatedStatusList;
                    });
                };

                if(file.size > maxFileSize){
                    setProgress(prev=>({...prev, status: true, index: 0, id: fileId }));
                    compressImageTo2MB(file, maxFileSize, updateProgress)
                    .then((compressedFile) => {
                        onUpdate(compressedFile);
                        setProgress(prev=>({...prev, status: false, loader: 0, index: 0, id: "" }));
                    }).catch((error) => {
                        console.error('Compression failed:', error);
                    });
                }else{
                    onUpdate(file);
                };

            } else if (fileId.includes("project_video")) {
                setProjectUtube(prev => ({...prev, url:"", isYoutubeVideo: false}));
                setVideoFile([file]);
                setvideoUrl([URL.createObjectURL(file)]);

                setStatusList(prevStatusList => {
                    const updatedStatusList = [...prevStatusList];
                    updatedStatusList[1] = "Y";

                    return updatedStatusList;
                });
            } else if (fileId.includes("master_plan")){
                let currentType = getUploadDataType(file.type,'/');
                if(fileId.includes("master_plan")){
                    setSelectedType({ ...selectedType, id: "master_plan", type: "S", mediaType: currentType, dataLimit: 10 });
                };

				$("#mediaBox_master_plan").css("border-color", "#0073C6");

                const onUpdate = (newFile) => {
                    setMasterPlanFile([newFile]);
                    setMasterPlanUrl([URL.createObjectURL(newFile)]);
                    setMasterFileType(currentType);
                    setStatusList(prevStatusList => {
                        const updatedStatusList = [...prevStatusList];
                        updatedStatusList[2] = "Y";
                        return updatedStatusList;
                    });
                };

                if(currentType !== "PDF"){
                    if(file.size > maxFileSize){
                        setProgress(prev=>({...prev, status: true, index: 0, id: fileId }));
                        compressImageTo2MB(file, maxFileSize, updateProgress)
                        .then((compressedFile) => {
                            onUpdate(compressedFile);
                            setProgress(prev=>({...prev, status: false, loader: 0, index: 0 }));
                        }).catch((error) => {
                            console.error('Compression failed:', error);
                        });
                    }else{
                        onUpdate(file);
                    };
                }else{
                    onUpdate(file);
                };

            } else {
                //walk_through_video
                setWalkThroughUtube(prev => ({...prev, url:"", isYoutubeVideo: false}));
                setWalkThroughVideoFile([file]);
                setWalkThroughvideoUrl([URL.createObjectURL(file)]);

                setStatusList(prevStatusList => {
                    const updatedStatusList = [...prevStatusList];
                    updatedStatusList[8] = "Y";

                    return updatedStatusList;
                });
            }

            setFilesArray([file]);
            setUrlsArray([URL.createObjectURL(file)]);
            setShowUploadBox(false);

            $('#' + `postProp_err_msg_${errorTextId}`).css('display', 'none');
            setIsError(false);
        }
    };

    const onMultipleImagesUploading = (file, dataLimit, fileId, isReplaceImg) => {
        let errSplitedTextId = fileId ? fileId.split("_") : "";
        let errorTextId = errSplitedTextId[0] + "_" + errSplitedTextId[1];
        $(`#multiImagesPopupMaxLimit_${fileId}`).hide();
        $(`#multiImagesPopupMaxLimit_${fileId}_replace`).hide();

        if (file.size > (dataLimit * 1000000)) {
            $('#' + `postProp_err_msg_${errorTextId}`).css('display', 'block');
            setIsError(true);
            if(fileId.includes("_replace")){
                $(`#multiImagesPopupMaxLimit_${fileId}_replace`).show();
            }
            $(`#multiImagesPopupMaxLimit_${fileId}`).show();

            setTimeout(()=>{
                $('#' + `postProp_err_msg_${errorTextId}`).css('display', 'none');
                $(`#multiImagesPopupMaxLimit_${fileId}`).hide();
                $(`#multiImagesPopupMaxLimit_${fileId}_replace`).hide();
            },5000);
            
        }else{

            const onUpdate = (newFile, index, identifier) => {
                otherImagesFiles[index] = newFile;
                setOtherImagesFiles(otherImagesFiles);
    
                if(identifier === "ADD"){
                    if(statusList[index+3] === "Y"){
                        otherImgUrls.splice(index, 0, URL.createObjectURL(newFile));
                        setOtherImgUrls(otherImgUrls);
                    }else{
                        otherImgUrls[index] = URL.createObjectURL(newFile);
                        setOtherImgUrls(otherImgUrls);
                    }
                }else{
                    otherImgUrls[index] = URL.createObjectURL(newFile);
                    setOtherImgUrls(otherImgUrls);
                };
                
                setStatusList(prevStatusList => {
                    const updatedStatusList = [...prevStatusList];
                    updatedStatusList[index+3] = "Y";
                    return updatedStatusList;
                });
            };
            
            if(isReplaceImg === true && imageIndex != null){
                if(file.size > maxFileSize){
                    setProgress(prev=>({...prev, status: true, index: imageIndex, id: errorTextId }));
                    compressImageTo2MB(file, maxFileSize, updateProgress)
                    .then((compressedFile) => {
                        onUpdate(compressedFile, imageIndex);
                        setProgress(prev=>({...prev, status: false, loader: 0, index: 0 }));
                    }).catch((error) => {
                        console.error('Compression failed:', error);
                    });
                }else{
                    onUpdate(file, imageIndex);
                };
               
            }else{
                if (otherImgUrls.length < 5) {
                    for (let i = 0; i < 5; i++) {
                        if ( statusList[i+3] !== "A" && otherImagesFiles[i] === undefined) {
                            setImageIndex(otherImgUrls.length);
                            setShowUploadBox(false);

                            if(file.size > maxFileSize){
                                setProgress(prev=>({...prev, status: true, index: i, id: fileId }));
                                compressImageTo2MB(file, maxFileSize, updateProgress)
                                .then((compressedFile) => {
                                    onUpdate(compressedFile, i, "ADD");
                                    setProgress(prev=>({...prev, status: false, loader: 0, index: 0 }));
                                }).catch((error) => {
                                    console.error('Compression failed:', error);
                                });
                            }else{
                                onUpdate(file, i, "ADD");
                            };
                            
                            $(`#postProp_err_msg_${errorTextId}`).css('display', 'none');
                            setIsError(false);
                            break;
                        }
                    }
                }else{
                    $(`#postProp_err_msg_${fileId}`).css('display', 'block');
                    $(`#postProp_err_msg_${fileId}`).text('*Sorry, only 5 images can be added');
                    setTimeout(() => {
                        $(`#postProp_err_msg_${fileId}`).text('');
                    }, 5000);
                }
            }
        }
    };

    const onUploadBtnClick = (e,dargged,id, isReplaceImg, otherImageReplaceIndex) => {
        if(e.target.files !== null && e.target.files.length > 0) {
            let fileId = e.target.id;
            let file = e.target.files[0];

            getUploadDataType(file.type,'/');

            if (file !== undefined && file != null) {
                if ( fileId.includes("cover_image")) {
                    onSingleMediaUploading(file, 10, fileId);
                } else if (fileId.includes("other_images")) {
                    onMultipleImagesUploading(file, 5, fileId, isReplaceImg);
                } else if (fileId.includes("project_video")){
                    onSingleMediaUploading(file, 20, fileId);
                } else if ( fileId.includes("master_plan")) {
                    onSingleMediaUploading(file, 10, fileId);
                }else{
                    onSingleMediaUploading(file, 20, fileId);
                }
            }
        };
    };

    const uploadingVideo = (e) => {
        let name = e.target.name;
        let id = e.target.id;
        
        if(name !== "submit"){
            let value = e.target.value;
            if(name === "project_video"){
                setProjectUtube(prev => ({...prev, url: value }));
            }else{
                setWalkThroughUtube(prev => ({...prev, url: value }));
            }

            if(value === ""){
                if(name === "project_video"){
                    onRemoveImage(undefined, "project_video");
                }else{
                    onRemoveImage(undefined, undefined);
                }
            };
        }else{
            if(id.includes("project_video")){
                if(projectUtube.url !== ""){
                    setProjectUtube(prev => ({...prev, isYoutubeVideo: true }));
                    let videoId = extractYouTubeVideoID(projectUtube.url);
                    let utubeUrl = videoId != null ? `https://www.youtube.com/embed/${videoId}` : projectUtube.url;

                    setvideoUrl([utubeUrl]);
                    setVideoFile([utubeUrl]);

                    setStatusList(prevStatusList => {
                        const updatedStatusList = [...prevStatusList];
                        updatedStatusList[1] = "Y";

                        return updatedStatusList;
                    });
                }else{
                    $(`#videoErrorMsg_${"project_video"}`).show();            
                    setTimeout(() => {
                        $(`#videoErrorMsg_${"project_video"}`).hide();
                    }, 3000);
                }
            }else{
                if(walkThroughUtube.url !== ""){
                    setWalkThroughUtube(prev => ({...prev, isYoutubeVideo: true }));
                    let videoId = extractYouTubeVideoID(walkThroughUtube.url);
                    let utubeUrl = videoId != null ? `https://www.youtube.com/embed/${videoId}` : walkThroughUtube.url;

                    setWalkThroughvideoUrl([utubeUrl]);
                    setWalkThroughVideoFile([utubeUrl]);

                    setStatusList(prevStatusList => {
                        const updatedStatusList = [...prevStatusList];
                        updatedStatusList[8] = "Y";
                        return updatedStatusList;
                    });
                }else{
                    $(`#videoErrorMsg_${"walkThrough_video"}`).show();
                    setTimeout(() => {
                        $(`#videoErrorMsg_${"walkThrough_video"}`).hide();
                    }, 3000);
                }
            }
        }
    };


    const onRemoveImage = (each, fileId) => {
        if (fileId === "cover_image") {
            if (coverImgUrl !== undefined && coverImgUrl != null && coverImgUrl.length !== 0) {
                setCoverImageFile([]);
                setCoverImgUrl([]);
                setFilesArray([]);
                setUrlsArray([]);
                setStatusList(prevStatusList => {
                    const updatedStatusList = [...prevStatusList];
                    updatedStatusList[0] = "Y";
                    return updatedStatusList;
                });
            }

        } else if (fileId === "other_images") {
            let index = otherImgUrls.indexOf(each);
            let statusIndex
            if (!isBlobURL(each)) {
                statusIndex = parseInt(each.match(/\/(\d+)\./)[1], 10);
            }

            if (otherImgUrls !== undefined && otherImgUrls[index] !== undefined) {

                const updatedMedia = [...otherImagesFiles];
                updatedMedia.splice(index, 1);
                setOtherImagesFiles(updatedMedia);

                setFilesArray(updatedMedia);

                const updatedImgUrl = [...otherImgUrls];
                updatedImgUrl.splice(index, 1);
                setOtherImgUrls(updatedImgUrl);
                
                if(updatedImgUrl.length === 0){
                    $("#multiImagesRenderingPopup").hide();
                }else{
                    if(imageIndex > 0){
                        setImageIndex(imageIndex-1);
                    }
                }
                setUrlsArray(updatedImgUrl);
            };
            
            setStatusList(prevStatusList => {
                const updatedStatusList = [...prevStatusList];
                if (statusIndex !== undefined && statusIndex != null) {
                    updatedStatusList[statusIndex + 3] = "Y";
                } else {
                    updatedStatusList[index + 3] = "Y";
                }
                return updatedStatusList;
            });



        } else if (fileId === "project_video") {
            if (videoUrl !== undefined && videoUrl != null && videoUrl.length !== 0) {
                setVideoFile([]);
                setvideoUrl([]);
                setFilesArray([]);
                setUrlsArray([]);
                setProjectUtube({url: "", isYoutubeVideo: false});
                setStatusList(prevStatusList => {
                    const updatedStatusList = [...prevStatusList];
                    updatedStatusList[1] = "Y";
                    return updatedStatusList;
                });
            }
        } else if (fileId === "master_plan") {
            if (masterPlanUrl !== undefined && masterPlanUrl.length !== undefined) {
                setMasterPlanFile([]);
                setMasterPlanUrl([]);
                setMasterFileType("N");
                setFilesArray([]);
                setUrlsArray([]);

                setStatusList(prevStatusList => {
                    const updatedStatusList = [...prevStatusList];
                    updatedStatusList[2] = "Y";
                    return updatedStatusList;
                });
            }
        } else {
            //walk_through_video
            if (walkThroughVideoUrl !== undefined && walkThroughVideoUrl.length !== undefined) {
                setWalkThroughVideoFile([]);
                setWalkThroughvideoUrl([]);

                setFilesArray([]);
                setUrlsArray([]);

                setWalkThroughUtube({url: "", isYoutubeVideo: false});

                setStatusList(prevStatusList => {
                    const updatedStatusList = [...prevStatusList];
                    updatedStatusList[8] = "Y";
                    return updatedStatusList;
                });
            }
        }
    };

  
    return (		
		<div className="postProjectMidiaPageMainCon">

            <h2 className="sectionHeading">Upload your Project Media in below sections</h2>
{/* cover image */}
            <PostPropertyMediaFieldBox  
                key="cover_image"
                fileId="cover_image"
                title="Cover Image" 
                mediaType="P" 
                selectedType="S" 
                mediaFilesList={coverImageFile} 
                imgUrlsList={coverImgUrl} 
                required={true} 
                dataLimit={10}
                errorMsg="Please upload cover image"
                onUploadBtnClick={onUploadBtnClick}
                onRemoveImage={onRemoveImage}
                isError={isError}
                buttonTitle="Select File"
                onImagePopup={onImagePopup} 
                hideIcon="true"
                hideNotificationText="false"
                progress={progress.id === "cover_image" ? progress : undefined}
            />   


{/* other images */}
            <PostPropertyMediaFieldBox  
                key="other_images"
                fileId="other_images"
                title="Other Images" 
                mediaType="P" 
                selectedType="M" 
                mediaFilesList={otherImagesFiles} 
                imgUrlsList={otherImgUrls} 
                required={false} 
                dataLimit={5}
                errorMsg="Please upload Other images"
                onUploadBtnClick={onUploadBtnClick}
                onRemoveImage={onRemoveImage}
                isError={isError}
                buttonTitle="Select File"
                onImagePopup={onImagePopup} 
                hideIcon="true"
                hideNotificationText="false"
                setImageIndex={setImageIndex}
                progress={progress.id === "other_images" ? progress : undefined}
            />
{/* project video */}
            <UpoloadVideoBox  
                key="project_video"
                fileId="project_video"
                title="Project Video" 
                mediaFilesList={videoFile} 
                imgUrlsList={videoUrl} 
                required={false} 
                dataLimit={20}
                errorMsg="Please upload Project Video"
                onUploadBtnClick={onUploadBtnClick}
                onRemoveImage={onRemoveImage}
                onImagePopup={onImagePopup} 
                hideIcon="true"
                uploadingVideo={uploadingVideo}
                youTube={projectUtube}
            />

{/* master plan */}
            <PostPropertyMediaFieldBox  
                key="master_plan"
                fileId="master_plan"
                title="Master Plan" 
                mediaType={masterFileType}
                selectedType="S" 
                mediaFilesList={masterPlanFile} 
                imgUrlsList={masterPlanUrl} 
                required={true} 
                dataLimit={10}
                errorMsg="Please upload Master Plan"
                onUploadBtnClick={onUploadBtnClick}
                onRemoveImage={onRemoveImage}
                isError={isError}
                buttonTitle="Select File"
                onImagePopup={onImagePopup}
                hideIcon="true"
                hideNotificationText="false"
                progress={progress.id === "master_plan" ? progress : undefined}
            />
{/* Walk Through Video */}
            <UpoloadVideoBox  
                key="walk_through_video"
                fileId="walkThrough_video"
                title="Walk Through Video" 
                mediaFilesList={walkThroughVideoFile} 
                imgUrlsList={walkThroughVideoUrl} 
                required={false} 
                dataLimit={20}
                errorMsg="Please upload Project Walk Through Video"
                onUploadBtnClick={onUploadBtnClick}
                onRemoveImage={onRemoveImage}
                onImagePopup={onImagePopup} 
                hideIcon="true"
                uploadingVideo={uploadingVideo}
                youTube={walkThroughUtube}
            />

            <div id="multiImagesRenderingPopup" style={{ display: "none" }}>
                {selectedType.mediaType !== "PDF" && 
                <MultipleImagesRenderingPopup
                    key="multiRenderingPopup"
                    onImagePopup={onImagePopup}
                    filesList={filesArray}
                    urlsList={urlsArray}
                    fileId={selectedType.id}
                    BlockTitle="Other images"
                    onUploadBtnClick={onUploadBtnClick}
                    onRemoveImage={onRemoveImage}
                    selectedType={selectedType}
                    imageIndex={imageIndex}
                    setImageIndex={setImageIndex}
                    showUploadBox={showUploadBox} 
                    setShowUploadBox={setShowUploadBox}
                />
                }
                {selectedType.mediaType === "PDF" && 
                    <PdfPopup
                        onImagePopup={onImagePopup}
                        onRemoveImage={onRemoveImage}
                        file={filesArray}
                        fileUrl={urlsArray[0]}
                        selectedType={selectedType}
                        fileId={selectedType.id}
                    />
                }
            </div>
            
            
            <div id="loaderForProjectimages">
                <Loader message="Please wait for few seconds will redirect you to next page" />
            </div>

            <p id="finalErrorMsg_media" style={{display:"none"}} className="validationaErrorMessageForAllPages">Please Fill All The Required Mandatory Fields</p>

            <SingleButton
                buttonId="projectMediaSubmitButton"
                containerClassName="postProjectButtonMainCon"
                buttonClassName="postProjectButton"
                onSubmit={(e) => onAddingMedia(e)}
                title="SAVE & CONTINUE"
            />



        </div>
    )
};

export default memo(ProjectImages);