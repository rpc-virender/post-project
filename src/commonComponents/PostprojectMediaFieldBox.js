import React, {useEffect, useState} from "react";
import $ from 'jquery';
import { formatBytes } from "../images/commonImages";

var photoIcon = "https://d1eia5vwbzlltl.cloudfront.net/photo.png";
var videoIcon = "https://d1eia5vwbzlltl.cloudfront.net/no-video.png";

const PostprojectMediaFieldBox = ({ fileId, title, type, selectedType, required, media, setMedia, imgUrl, 
                                    setImgUrl, dataLimit ,statusList,setStatusList, errorMsg, onImagePopup}) => {
    const [ isError, setIsError ] = useState(false);
    const [displayImagesArray, setDisplayImagesArray ] = useState([]);

    useEffect(() => {
        
        if(displayImagesArray != undefined && displayImagesArray.length != 0 && fileId == "other_images") {
            displayImagesArray.map((eachImage, index)=>{
                if(index == 0) {
                    $(`#${index}_others`).addClass('active');
                }else {
                    //remove class active
                    $(`#${index}_others`).removeClass('active');
                }
            })
                
        }

    },[displayImagesArray]);
    

    useEffect(() => {
        setDisplayImagesArray([...imgUrl]);
	},[imgUrl]);
    
    const onUploadBtnClick = (e) => {
        if (e.target.files !== null && e.target.files.length > 0) {
            let file = e.target.files[0];

            if (file !== null && media != undefined && imgUrl != undefined) {
        		// For SINGLE Selected media
                if(selectedType == "S"){
                    if(file.size > (dataLimit * 1000000)){
                        $('#' + `err_msg_${fileId}`).css('display', 'block');
                        setIsError(true);
                    }else{
                        setMedia([file]);
                        setImgUrl([URL.createObjectURL(file)]);
                        if(fileId === "cover_image") {
							 setStatusList(prevStatusList => {
							            const updatedStatusList = [...prevStatusList];
							            updatedStatusList[0] = "Y";
							            return updatedStatusList;
							          });
						}
						if(fileId === "project_video"){
							 setStatusList(prevStatusList => {
							            const updatedStatusList = [...prevStatusList];
							            updatedStatusList[1] = "Y";
							            
							            return updatedStatusList;
							            
							          });
						}
						if(fileId === "master_plan"){
							 setStatusList(prevStatusList => {
							            const updatedStatusList = [...prevStatusList];
							            updatedStatusList[2] = "Y";
							            
							            return updatedStatusList;
							            
							          });
						}
						
                        // onChange(null,"logoData",file);
                        $('#' + `err_msg_${fileId}`).css('display', 'none');
                        setIsError(false);
                    }
                }else{
        // For MULTI Selected media
                    if(file.size > (dataLimit * 1000000)){
                        $('#' + `err_msg_${fileId}`).css('display', 'block');
                        setIsError(true);
                    }else{
                        if(media.length < 5){
							
					    if (fileId === "other_images") {
					        for (let i = 0; i < 5; i++) {
								
					           if (media[i] === undefined && statusList[i+3] != "A") {
								    // Upload the file and update the media array and imgUrl array
								    setMedia(prevMedia => {
								        const updatedMedia = [...prevMedia];
								        updatedMedia[i] = file;
								        return updatedMedia;
								    });
								    
								    setImgUrl(prevImgUrls => {
								        const updatedImgUrls = [...prevImgUrls];
								        updatedImgUrls[i] = URL.createObjectURL(file);
								        return updatedImgUrls;
								    });

					            /*    setMedia([ ...media, file]);
					                setImgUrl([ ...imgUrl, URL.createObjectURL(file)]);*/
					                 $('#' + `err_msg_${fileId}`).css('display', 'none');
                           			 setIsError(false);
					                setStatusList(prevStatusList => {
							            const updatedStatusList = [...prevStatusList];
							            updatedStatusList[i+3] = "Y";
							            
							            return updatedStatusList;
							          });
					                break;
					            }
					            
					        }
					    }
							
                       //     setMedia([ ...media, file]);
                         //   setImgUrl([ ...imgUrl, URL.createObjectURL(file)]);
                            // onChange(null,"logoData",file);
                          //  $('#' + `err_msg_${fileId}`).css('display', 'none');
                         //   setIsError(false);
                        }else{
                            $('#' + `err_msg_${fileId}`).css('display', 'block');

                            $('#' + `err_msg_${fileId}`).text('*Can’t add more than 5 images');
                            setTimeout(()=>{
                                $('#' + `err_msg_${fileId}`).text('');
                            }, 3000);
                        }
                    }
                }
                
            }        
        }
    };


    
    const onRemoveImage = (each, e) => {
        let index = media.indexOf(each);

        if (media != undefined && media[index] != undefined && imgUrl != undefined && imgUrl[index] != undefined) {
            const updatedMedia = [...media];
            updatedMedia.splice(index, 1); 
            setMedia(updatedMedia); 

            const updatedImgUrl = [...imgUrl]; 
            updatedImgUrl.splice(index, 1); 
            setImgUrl(updatedImgUrl);

            if (fileId === "other_images") {
	            setStatusList(prevStatusList => {
	            	const updatedStatusList = [...prevStatusList];
	                updatedStatusList[index+3] = "Y";
	                return updatedStatusList;
	            });
	        }
	        else{
	            setStatusList(prevStatusList => {
		            const updatedStatusList = [...prevStatusList];
		            updatedStatusList[index] = "Y";
		            return updatedStatusList;
	            });
	        }

        }
    };


    return(
        <div className="postProjectMidiaMainCon">
            <h3 className="postProjectMidiaBoxHeading" >{title}<span className="mediaRequired">{ required == true ? "*" : "" }</span></h3>

            <p id="projNameMissingErrorMsg" style={{display: "none"}} className="errorMsgForPropmedia">{errorMsg}</p>

            <div className="postProjectMidiaBox">

{/* Displaying Images */}
                <div className="postProjectImagesDisplayBox">

                    { displayImagesArray != undefined && displayImagesArray != null && displayImagesArray.length == 0 ? (
                        <img src={ type == "P" ? photoIcon : videoIcon } alt="" className="uploadImgIcon" />   
                    ) : (

                        selectedType != "S" ? (

                        <div id={`carouselExampleIndicators_${fileId}`} className="carousel slide" data-ride="carousel">
                            <ol className="carousel-indicators">

                                <li data-target={`#carouselExampleIndicators_${fileId}`} data-slide-to="0" className="active"></li>
                                { displayImagesArray !== undefined && displayImagesArray !== null && displayImagesArray.length != 0 &&
                                displayImagesArray.map((eachPhoto, ind)=>{
                                    if(ind != 0 && ind >= 0){
                                        return(
                                            <li key={ind+"slide"} data-target={`#carouselExampleIndicators_${fileId}`} data-slide-to={ind}></li>
                                        )
                                    }
                                })}
                                

                            </ol>
                            <div className="carousel-inner">
                                { displayImagesArray !== undefined && displayImagesArray !== null && displayImagesArray.length != 0 &&
                                displayImagesArray.map((eachPhoto, ind)=>{
                                    let size=displayImagesArray.length;
                                    return(
                                        <div key={`${ind}_${fileId}`} id={`${ind}_others`} className="carousel-item">
                                            <img src={eachPhoto != undefined && eachPhoto != null && eachPhoto != "" ? eachPhoto : ""} className="displayImage" alt="..."/>
                                        </div>                                   
                                    )
                                }) }

                            </div>
                            <a className="carousel-control-prev" href={`#carouselExampleIndicators_${fileId}`} role="button" data-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="sr-only">Previous</span>
                            </a>
                            <a className="carousel-control-next" href={`#carouselExampleIndicators_${fileId}`} role="button" data-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                            </a>
                        </div>    
                        
                        ) : (
                            type == "P" ? (
                                <img id={fileId} src={displayImagesArray[0]} className="displayImage" alt="..."/>
                            ):(
                                <video id={fileId} src={displayImagesArray[0]} controls className="displayImage" alt="..."/>
                            )
                        )
                    )}
                    

                </div>

{/* Uploading Media From Input */}
                <div className="postProjectImagesUploadBox">
                    <div className={`insideCon ${media.length != 0 || isError ? "ifMediaAdded" : "" }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="84" height="81" viewBox="0 0 84 81" fill="none" className="cloudIcon">
                            <path d="M55.8327 54L41.9993 40.5L28.166 54" stroke="black" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M42 40.5V70.875" stroke="black" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M71.015 62.0658C74.388 60.2712 77.0526 57.4315 78.5883 53.9949C80.1239 50.5583 80.4431 46.7204 79.4955 43.0871C78.5479 39.4538 76.3875 36.2319 73.3551 33.9299C70.3228 31.6279 66.5913 30.377 62.7496 30.3745H58.3921C57.3453 26.4232 55.3942 22.7549 52.6856 19.6454C49.977 16.5358 46.5813 14.066 42.7538 12.4216C38.9263 10.7771 34.7666 10.0009 30.5875 10.1511C26.4083 10.3014 22.3184 11.3743 18.6253 13.2891C14.9322 15.204 11.7319 17.911 9.26512 21.2066C6.79833 24.5022 5.12919 28.3007 4.3832 32.3165C3.6372 36.3322 3.83375 40.4608 4.95809 44.3918C6.08242 48.3227 8.10527 51.9538 10.8746 55.012" stroke="black" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M55.8327 54L41.9993 40.5L28.166 54" stroke="black" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>

                        <div>
                            <p>Select a file or drag and drop here</p>
                            <span>JPG, WEBP, JFIF, PNG or JPEG, file size no more than {dataLimit} MB</span>
                        </div>

                        
                            <label className="upoladMediaFileBtn" htmlFor={fileId}>Select file
                            <input 
                                id={fileId}
                                style={{display:"none"}}
                                type="file"
                                accept={ type == "P" ? ".png, .jpg,.webp,.jfif, .JPEG" : ".mov,.mp4"}
                                onChange={(e)=>onUploadBtnClick(e)}
                            />
                            </label>
                    </div>
                    
                    <span id={`err_msg_${fileId}`} style={{display: "none"}} className="mediaErrMsg">File size more than <span>{ dataLimit }</span> MB is not accepted. Try another file.</span>

{/* Displaying Media Files */}
                    { media != undefined && media != null && media.length != 0 && 
                    <div className="imageFilesCon">
                        <p className="filesAddingHeading">File added</p>
                        { media != undefined && media != null && media.length != 0 && 
                        media.map((each, index)=>{
                            return(
                                <div key={index} className="mediaDetailsMainCon">
                                    <div className="mediaNameDislayBox">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="fileAndDeleteIcons" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M9.75293 10.5C10.0484 10.5 10.341 10.4418 10.614 10.3287C10.887 10.2157 11.135 10.0499 11.3439 9.84099C11.5529 9.63206 11.7186 9.38402 11.8317 9.11104C11.9447 8.83806 12.0029 8.54547 12.0029 8.25C12.0029 7.95453 11.9447 7.66194 11.8317 7.38896C11.7186 7.11598 11.5529 6.86794 11.3439 6.65901C11.135 6.45008 10.887 6.28434 10.614 6.17127C10.341 6.0582 10.0484 6 9.75293 6C9.15619 6 8.5839 6.23705 8.16194 6.65901C7.73998 7.08097 7.50293 7.65326 7.50293 8.25C7.50293 8.84674 7.73998 9.41903 8.16194 9.84099C8.5839 10.2629 9.15619 10.5 9.75293 10.5Z" fill="#0F91D2"/>
                                            <path d="M21 21C21 21.7956 20.6839 22.5587 20.1213 23.1213C19.5587 23.6839 18.7956 24 18 24H6C5.20435 24 4.44129 23.6839 3.87868 23.1213C3.31607 22.5587 3 21.7956 3 21V3C3 2.20435 3.31607 1.44129 3.87868 0.87868C4.44129 0.316071 5.20435 0 6 0L14.25 0L21 6.75V21ZM6 1.5C5.60218 1.5 5.22064 1.65804 4.93934 1.93934C4.65804 2.22064 4.5 2.60218 4.5 3V18L7.836 14.664C7.95422 14.5461 8.10843 14.4709 8.27417 14.4506C8.43992 14.4302 8.60773 14.4657 8.751 14.5515L12 16.5L15.2355 11.97C15.2988 11.8815 15.3806 11.8078 15.4753 11.754C15.5699 11.7003 15.6751 11.6678 15.7836 11.6588C15.8921 11.6498 16.0012 11.6645 16.1034 11.702C16.2056 11.7394 16.2985 11.7986 16.3755 11.8755L19.5 15V6.75H16.5C15.9033 6.75 15.331 6.51295 14.909 6.09099C14.4871 5.66903 14.25 5.09674 14.25 4.5V1.5H6Z" fill="#0F91D2"/>
                                        </svg>
                                        <p>{ each.name != undefined && each.name != undefined ? each.name : "" } . <span>{formatBytes( each.size != undefined && each.size != undefined ? each.size : "")}</span></p>
                                    </div>    

                                    <div className="mediaBoxSideIcons">
                                        <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>onImagePopup("OPEN")} width="21" height="22" viewBox="0 0 21 22" fill="none" className="fileAndDeleteIcons">
                                            <g clipPath="url(#clip0_473_6938)">
                                                <path d="M10.6132 4.12493C16.8632 4.14473 20.5914 11.0316 20.5914 11.0316C20.5914 11.0316 16.8197 17.8947 10.5697 17.8749C4.31971 17.8551 0.591507 10.9682 0.591507 10.9682C0.591507 10.9682 4.36326 4.10514 10.6132 4.12493ZM10.6093 5.37493C6.20929 5.36099 3.09394 9.4149 2.06025 10.9729C3.0828 12.5361 6.17241 16.6109 10.5736 16.6249C14.9736 16.6388 18.089 12.5849 19.1227 11.0269C18.1001 9.46367 15.0105 5.38887 10.6093 5.37493ZM10.6053 6.62492C11.7656 6.6286 12.877 7.09305 13.6948 7.91612C14.5127 8.73919 14.9701 9.85344 14.9664 11.0138C14.9628 12.1741 14.4983 13.2854 13.6752 14.1033C12.8522 14.9211 11.7379 15.3786 10.5776 15.3749C9.41728 15.3712 8.30595 14.9067 7.48808 14.0837C6.67021 13.2606 6.2128 12.1464 6.21648 10.986C6.22015 9.82573 6.68461 8.71439 7.50768 7.89652C8.33074 7.07866 9.445 6.62125 10.6053 6.62492ZM10.6014 7.87491C9.77286 7.87328 8.97754 8.20032 8.38985 8.7843C7.80216 9.36828 7.47009 10.1615 7.46647 10.99C7.46102 12.7125 8.85782 14.1194 10.5816 14.1249C12.3053 14.1303 13.711 12.7323 13.7164 11.0098C13.7219 9.28731 12.3251 7.88037 10.6014 7.87491Z" fill="#767270"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_473_6938">
                                                <rect width="20" height="20" fill="white" transform="translate(0.621094 0.968262) rotate(0.181465)"/>
                                                </clipPath>
                                            </defs>
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none" className="fileAndDeleteIcons">
                                            <path d="M1.88218 17.2221L19.3821 17.2775L19.3781 18.5275L1.87822 18.4721L1.88218 17.2221ZM16.5408 6.64347C17.0423 6.14505 17.0447 5.39506 16.5463 4.89347L14.3034 2.63636C13.805 2.13478 13.055 2.1324 12.5534 2.63082L3.1488 11.9761L3.13613 15.9761L7.13611 15.9887L16.5408 6.64347ZM13.4257 3.50858L15.6685 5.7657L13.7876 7.63475L11.5447 5.37764L13.4257 3.50858ZM4.39009 14.73L4.39721 12.48L10.667 6.24986L12.9098 8.50698L6.64007 14.7371L4.39009 14.73Z" fill="#0073C6"/>
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" className="fileAndDeleteIcons"  width="21" height="22" viewBox="0 0 21 22" fill="none" onClick={(e)=>onRemoveImage(each, e)}>
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

export default PostprojectMediaFieldBox;