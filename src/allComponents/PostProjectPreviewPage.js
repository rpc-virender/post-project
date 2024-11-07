import React, { Fragment, memo, useEffect, useState } from 'react';
import '../styles/postProjPreviewPage.css';

import SingleButton from '../commonComponents/SingleButton'
import { compassIcon, customAmenityIcon, highlightsIcon, launchDateIcon, mapChartIcon, possessionDateIcon, previewBuildingIcon, reraIdIcon, reraStatusForPreviewIcon } from '../images/commonSvgs'
import MapPage from '../commonComponents/MapPage';
import { amenitiesGroupList, BankDetailsList, formatPriceToCommaPrice, noBankImage, rowSuccessGif } from '../images/commonImages';

// preview page Components
import PreviewImagesBlock from './previewPageComponents/PreviewImagesBlock';
import PreviewSpecifications from './previewPageComponents/PreviewSpecifications';
import HeadingAndEditBox from './previewPageComponents/HeadingAndEditBox';
import PreviewFaqsBlock from './previewPageComponents/PreviewFaqsBlock';
import HeadingBox from './previewPageComponents/HeadingBox';
import ProjDetailBox from './previewPageComponents/ProjDetailBox';
import PreviewPropertyDetails from './previewPageComponents/PreviewPropertyDetails';
import ImagesRenderingPopup from '../commonComponents/ImagesRenderingPopup';
import Loader from '../commonComponents/Loader';
import MultipleImagesRenderingPopup from '../commonComponents/MultipleImagesRenderingPopup';
import { convertSqmetersIntoAcres, fixedToTw0Decimals } from '../images/constant';
import BrochureBox from './previewPageComponents/BrochureBox';
import { getUnit } from '../images/constant';


const PostProjectPreviewPage = ({ onNextclick, data, projectMedia, specificationData, amenitiesData, customAmenities, allApprovedByList,
                                                idValidatar, commonData, city, locality, phaseArray, propPricing, setStep, amenitiesFromDB, apartmentTypeList,
                                                propertyTypeDetails, noOfTower, towers, combinedPropertyDetails, isMailSent, bankDetailsObject
                                                }) => {
    const [readMoreVission, setReadMoreVission] = useState([600, 600, 5, 34]);
    const allSpecificationsKeys = [...specificationData.keys()];
    let amenityCount = 0;
    const Amenitieskeys = Object.keys(amenitiesFromDB);
    
    const onReadMore = (value, identifier) => {
        let prevAbout = [...readMoreVission];

        switch(identifier){
            case "about":
                if(prevAbout[value] > 600){
                    prevAbout[value] = 600;
                }else{
                    prevAbout[value] = 5000; 
                }
                break;
            case "highlights":
                if(prevAbout[value] > 5){
                    prevAbout[value] = 5;
                }else{
                    prevAbout[value] = 1000; 
                }
                break; 
            case "amenities":
                amenityCount = 0;
                if(prevAbout[value] > 34){
                    prevAbout[value] = 34;
                }else{
                    prevAbout[value] = 1000; 
                }
                break; 
            default:
                return "";
        }

        setReadMoreVission(prevAbout);
    };

    const [imagePreviewInPg, setimagePreviewInPg]=useState({});
    const [displayFloorPlan, setDisplayFloorPlan]=useState(false);

    const [displayMediaPopup, setDisplayMediaPopup]=useState(false);
    const [selectedType, setSelectedType] = useState({ id: "", type: "S", mediaType: "", boxTitle: '', dataLimit: 0, urlsArray:[] });  

    const onImagePopup = (identifier, eachRow) => {
        switch (identifier) {
            case "OPEN":
                setimagePreviewInPg(eachRow);
                document.body.style.overflow = "hidden";
                setDisplayFloorPlan(true);
                break;
            case "CLOSE":
                setimagePreviewInPg({});
                document.body.style.overflow = "scroll";
                setDisplayFloorPlan(false);
                break;
            default:
                return "";
          }
    };

    const onMediaPopup = (identifier, urlList, title) => {
        switch (identifier) {
            case "OPEN":

                let urlType = "";
                if(title.includes("Video")){
                    urlType = "V";
                }else {
                    urlType = "P";
                }

                setSelectedType((prev) => {
                    return { ...prev, mediaType: urlType, boxTitle: title, urlsArray: urlList };
                });
                
                document.body.style.overflow = "hidden";           
                setDisplayMediaPopup(true);
                break;
            case "CLOSE":
                setSelectedType((prev) => {
                    return { id: "", type: "S", mediaType: "", boxTitle: '', dataLimit: 0, urlsArray:[] };
                });
                
                document.body.style.overflow = "scroll";
                setDisplayMediaPopup(false);
                break;
            default:
                return "";
          }
    };

    const onPreviewSumbit = () => {
        window.location.href = `${window.location.origin}/my-profile#step_C`;
    };

    useEffect(()=>{
        if(isMailSent === true){
            setTimeout(()=>{
                onPreviewSumbit();
            },10000);
        }
    },[isMailSent]);
    
    return (
        <div className='poetProjPreviewMainCon'>
            {displayFloorPlan &&
            <ImagesRenderingPopup
                key="key-for-image-edit-popup-preview"
                onImagePopup={onImagePopup}
                filesList={
                    imagePreviewInPg !== undefined && imagePreviewInPg.floorPlan !== undefined
                    ? [imagePreviewInPg.floorPlan]
                    : []
                }
                urlsList={
                    imagePreviewInPg !== undefined && imagePreviewInPg.floorPlanUrl !== undefined
                    ? [imagePreviewInPg.floorPlanUrl]
                    : []
                }
                BlockTitle="Floor Plan Preview"
                onUploadBtnClick={""}
                onRemoveImage={""}
                prevPgIden={true}
            />
            }

            {displayMediaPopup &&
                <MultipleImagesRenderingPopup
                    key="multiRenderingPopup"
                    onImagePopup={onMediaPopup}
                    filesList={[]}
                    urlsList={selectedType.urlsArray}
                    fileId={selectedType.id}
                    BlockTitle="Other images"
                    selectedType={selectedType}
                    showUploadBox={false} 
                />
            }

            {/* <div className="staticHeadingTextsPreviewCon">
                <h2>Preview Page</h2>
                <span>Go through all the details you have filled in case is their any Field you want to change click the edit icon</span>
            </div> */}

            <HeadingBox heading="Basic Details" subHeading="Check the basic details you filled for the project like Project Name, Address, Phase details and about project" setStep={setStep} />

{/* project details */}
            <div className='previewDetailsHoldCon'>
                <HeadingAndEditBox key="0PreviewHeading" heading="Project details" identifier={0} setStep={setStep} />

                <div className='previewDetailsHoldInnerCon'>
                    <ProjDetailBox key="ProjectName" icon={previewBuildingIcon} name="Project Name" value={data.projName} />
                    <ProjDetailBox key="TotalLandArea" icon={previewBuildingIcon} name="Total Land Area of Project" value={`${formatPriceToCommaPrice(convertSqmetersIntoAcres(data.totalLandArea, "sqmts"))} Sqm - (${formatPriceToCommaPrice(fixedToTw0Decimals(data.totalLandArea))} in Acres)`} />
                </div>
            </div>

{/* Address details */}
            <div className='previewDetailsHoldCon'>
                <HeadingAndEditBox key="1PreviewHeading" heading="Address details" identifier={1} setStep={setStep} />

                <div className='previewDetailsHoldInnerCon'>
                    <ProjDetailBox key="state" icon={mapChartIcon} name="State" value={getUnit(data.state, commonData.state)} />
                    <ProjDetailBox key="City" icon={mapChartIcon} name="City" value={getUnit(data.city, city)} />
                    <ProjDetailBox key="Locality" icon={mapChartIcon} name="Locality" value={data.locality && data.locality !== "" && data.locality < 100000 ? getUnit(data.locality, locality) : data.customLocality && data.customLocality !== "" ? data.customLocality : "" } />
                    <ProjDetailBox key="Pincode" icon={compassIcon} name="Pincode" value={data.pincode} />
                    <ProjDetailBox key="Latitude" icon={compassIcon} name="Latitude" value={data.latitude} />
                    <ProjDetailBox key="Longitude" icon={compassIcon} name="Longitude" value={data.longtitude} />
                </div>

                <h3 className='previewMapHaeding'>Google Map Preview</h3>

                <MapPage 
                    key="postProjpreviewMap" 
                    lat={data.latitude} 
                    lan={data.longtitude} 
                    projName={data.projName} 
                />

                <ProjDetailBox key="address" icon={compassIcon} name="Address" value={data.address} />
            </div>

{/* Phase details */}
            <div className='previewDetailsHoldCon'>
                <h1 className='phaseDetailsHeading'>Phase Details | <span>{data.phaseCount > 1 ? "Multiple Phase" : "Single Phase"}</span></h1>

                {/* Multi Phase details */}
                {phaseArray !== undefined && phaseArray != null && phaseArray.length !== undefined && phaseArray.length > 0 && 
                phaseArray.map((eachPhase, ind)=>{
                    if(ind < data.phaseCount ){
                        return(
                            <Fragment key={`eachPhaseCard_${ind}`}>
                                <hr className='phaseDetailsHrLine' />
                                <HeadingAndEditBox key={`${ind}_PreviewHeading`} heading={data.phaseCount > 1 ? `Phase ${ind+1}` : "Phase"} identifier={2} setStep={setStep} />
                                <p className='phaseDetailsContant'>{`Check the Phase ${data.phaseCount > 1 ? `${ind+1} ` : ""}details you filled like RERA Start Date, RERA End Date`}</p>
                                <div className='previewDetailsHoldInnerCon previewDetailsPhasesCon'>

                                    {phaseArray !== undefined && phaseArray != null && phaseArray.length !== undefined && phaseArray.length > 1 && 
                                    <ProjDetailBox className="previewPhaseBox" key="PhaseName" icon={mapChartIcon} name="Phase Name" value={eachPhase.phaseName} />
                                    }
                                    <ProjDetailBox className="previewPhaseBox" key="LaunchDate" icon={launchDateIcon} name="RERA Start Date" value={eachPhase.launchDate} />
                                    <ProjDetailBox className="previewPhaseBox" key="PossessionDate" icon={possessionDateIcon} name="RERA End Date" value={eachPhase.possassionDate} />
                                    <ProjDetailBox className="previewPhaseBox" key="expectedCompletionPr" icon={possessionDateIcon} name="Expected Completion Date" value={eachPhase.expectedCompletion} />
                                    {eachPhase.phasePromoter !== undefined && eachPhase.phasePromoter !== null && eachPhase.phasePromoter !== "" &&
                                    <ProjDetailBox className="previewPhaseBox" key="phasePromoter" icon={possessionDateIcon} name="Phase Promoter Name" value={eachPhase.phasePromoter} />
                                    }
                                    <ProjDetailBox className="previewPhaseBox" key="RERASTATUS" icon={reraStatusForPreviewIcon} name="RERA Status" value={getUnit(eachPhase.reraStatus, commonData.rerastatus)} />
                                    {eachPhase.reraId && eachPhase.reraId !== "" && eachPhase.reraStatus !== "103" &&  eachPhase.reraStatus !== "104" &&
                                        <ProjDetailBox className="previewPhaseBox" key="RERAID" icon={reraIdIcon} name={`${getUnit(eachPhase.reraStatus, commonData.rerastatus) === "Recieved" ? "RERA ID" : "RERA Acknowledgement No." }`} value={eachPhase.reraId} />
                                    }
                                </div>
                            </Fragment>
                        )
                    }
                })}
                
            </div>

{/* About Project  */}
            <div className='previewDetailsHoldCon'>
                <HeadingAndEditBox key="3PreviewHeading" heading="About Project" identifier={3} setStep={setStep} />
                <div className='previewAboutScrollContainer'>
                    <pre key="aboutprojectPreview" className='previewAbout' dangerouslySetInnerHTML={{ __html: data.aboutproject }}></pre>
                </div>
            </div>

{/* Property Details */}
            <PreviewPropertyDetails 
                propertyTypeDetails={propertyTypeDetails} 
                noOfTower={noOfTower} 
                towers={towers} 
                phaseArray={phaseArray} 
                propPricing={propPricing}
                combinedPropertyDetails={combinedPropertyDetails}
                idValidatar={idValidatar}
                onImagePopup={onImagePopup}
                setStep={setStep}
                apartmentTypeList={apartmentTypeList}
                data={data}
            />

{/* project images Details */}
            <HeadingBox heading="project images" subHeading="A little preview of what you uploaded in Project Images" setStep={setStep} />
            <PreviewImagesBlock projectMedia={projectMedia} setStep={setStep} onImagePopup={onMediaPopup} page="proj" />

{/* specifications */}
            {allSpecificationsKeys && allSpecificationsKeys.length !== undefined && allSpecificationsKeys.length > 0 ?
            <Fragment>
                <HeadingBox heading="Specifications" subHeading="Select the specification category to see the filled details" setStep={setStep} />
                <PreviewSpecifications specificationData={specificationData} allKeys={allSpecificationsKeys} setStep={setStep} />
            </Fragment>
            :
            <div className='previewDetailsHoldCon'>
                <HeadingAndEditBox key="_PreviewHeading" heading="Specifications Are Not Added Yet" identifier={14} setStep={setStep} />
            </div>
            }

{/* AMENITIES */}
            {amenitiesData && amenitiesData.length !== undefined && amenitiesData.length > 0 ?
            <Fragment>
                <HeadingBox headingWithEdit="Amenities" subHeading="Experience the ultimate in comfort with our amenities" setStep={setStep} />
                <div className="propertyTypeBtnCon previewAmenityBoxsCon">
                    {Amenitieskeys.length > 0 && amenitiesFromDB !== undefined && amenitiesData !== undefined &&
                    Amenitieskeys.map((group) => {
                      return amenitiesFromDB && amenitiesFromDB[group] &&
                          Object.keys(amenitiesFromDB[group]).map((eachSub) => {
                            return amenitiesFromDB[group][eachSub] && amenitiesFromDB[group][eachSub].map(eachOne=>{
                              if(amenitiesData.includes(eachOne.cid) && amenityCount < readMoreVission[3]){
                                amenityCount = amenityCount + 1;
                                return (
                                    <p key={`PreviewAmin__${group}_${eachSub}_${amenityCount}`} className='previewAmenityBox'>{amenitiesGroupList.get(eachOne.cid)} {eachOne.constDesc}</p>
                                );
                              }
                            })
                          }
                      )}
                    )}

                    {amenitiesData.length > 34 &&
                        <SingleButton
                            key="previewAmenityShowMoreBtn"
                            buttonId="previewAmenityShowMoreBtn"
                            buttonClassName="previewShowMoreBtn previewAmenityShowMoreBtn"
                            onSubmit={()=>onReadMore(3, "amenities")}
                            title={readMoreVission[3] > 34 ? "View Less" : `View More (${amenitiesData.length - 34})`}
                        />
                    }
                </div>
            </Fragment>
            :
            <div className='previewDetailsHoldCon'>
                <HeadingAndEditBox key="_PreviewHeading" heading="Amenities Are Not Added Yet" identifier={13} setStep={setStep} />
            </div>
            }

{/* CUSTOM AMENITIES */}
            {customAmenities && customAmenities.length !== undefined && customAmenities.length > 0 && 
                <Fragment>
                    <HeadingBox headingWithEdit="Custom Amenities" subHeading="Experience the ultimate in comfort with our custom amenities" setStep={setStep} />
                    <div className="propertyTypeBtnCon previewAmenityBoxsCon">
                        {customAmenities.map((eachItem, index) => {
                            return (
                                <p key={`PreviewCustomAmin_${index}`} className='previewAmenityBox'>{customAmenityIcon} {eachItem}</p>
                            );
                        })}
                    </div>
                </Fragment>
            }


{/* Why buy this project? */}
            <HeadingBox heading="Why buy this project?" subHeading="Check the filled details for Why buy this project you filled...." setStep={setStep} />
            <div className='previewDetailsHoldCon'>
                <HeadingAndEditBox key="7PreviewHeading" heading="Why buy this project?" identifier={7} setStep={setStep} />

                <div className='previewAboutScrollContainer'>
                    <pre key="whyBuyThisProjectPreview" className='previewAbout' dangerouslySetInnerHTML={{ __html: data.whyBuyThisProject }}></pre>
                </div>
            </div>

{/* Project Highlight? */}
            {data.highlights !== undefined && data.highlights.length > 0 &&  
            <Fragment>
                <HeadingAndEditBox key="8PreviewHeading" heading="Project Highlights" identifier={8} setStep={setStep} />

                <div className='previewHighlightPointsCon'>
                    {data.highlights.map((eachOne, ind)=>{
                        if(ind < readMoreVission[2]){
                            return(
                                <p key={ind} className='previewHighlightPoints'>{highlightsIcon} {eachOne}</p>
                            )
                        }
                    })}

                    {data.highlights.length > 5 &&
                    <SingleButton
                        key="previewShowMoreBtn"
                        buttonId="previewShowMoreBtn"
                        buttonClassName="previewShowMoreBtn"
                        onSubmit={()=>onReadMore(2, "highlights")}
                        title={readMoreVission[2] > 5 ? "Show Less" : `Show ${data.highlights.length - 5} more Highlights`}
                    />
                    }
                </div>
            </Fragment>
            }

            {data.projAuthority !== undefined && data.projAuthority.length > 0 &&  
            <Fragment>
                <HeadingAndEditBox key="8PreviewHeading" heading="Project Approved By" identifier={15} setStep={setStep} />

                <div className='previewHighlightPointsCon'>
                    {allApprovedByList.map( eachOne => {
                        if(data.projAuthority.includes(eachOne.cid)){
                            return(
                                <p key={eachOne.cid} className='previewHighlightPoints'>{highlightsIcon} {eachOne.constDesc}</p>
                            )
                        }
                    })}
                </div>
            </Fragment>
            }
            

{/* Banks Approvals */}
            {bankDetailsObject && bankDetailsObject.banKIds && bankDetailsObject.banKIds.length !== undefined && bankDetailsObject.banKIds.length > 0 && 
            <div className='previewDetailsHoldCon'>
                <HeadingAndEditBox key="8PreviewHeading" heading="Banks Approvals" identifier={9} setStep={setStep} />
                <div className="propertyTypeBtnCon previewBanksBoxsCon">
                    {commonData && commonData.banks && commonData.banks.map((eachBank, index)=>{
                        if(bankDetailsObject.banKIds.includes(eachBank.cid)){
                            let bankUrl = BankDetailsList && BankDetailsList.get(eachBank.cid) ? BankDetailsList.get(eachBank.cid).url : "";
                        return(
                            <div className='previewBankCardCon'>
                                <img alt="" src={bankUrl && bankUrl !== "" ? bankUrl : noBankImage} />
                                <p>{eachBank.constDesc}</p>
                            </div>
                        )}
                    })}
                </div>
            </div>
            }

{/* Custom Banks Approvals */}
            {bankDetailsObject && bankDetailsObject.customBankNames && bankDetailsObject.customBankNames.length !== undefined && bankDetailsObject.customBankNames.length > 0 && 
            <div className='previewDetailsHoldCon'>
                <HeadingAndEditBox key="8PreviewHeading" heading="Custom Banks Approvals" identifier={10} setStep={setStep} />
                <div className="propertyTypeBtnCon previewAmenityBoxsCon">
                    {bankDetailsObject.customBankNames.map((eachBank, index)=>{
                        return(
                            <ProjDetailBox key={`CustomBank_${index}`} className="previewPhaseBox customBankNameCard" name={`Custom Bank ${index+1}`} value={eachBank} />
                        )
                    })}
                </div>
            </div>
            }

{/* brochure */}
            {bankDetailsObject !== undefined && bankDetailsObject.fileUrl !== undefined && bankDetailsObject.fileUrl[0] !== undefined &&
            (data.isPhaseBroucher === undefined || data.isPhaseBroucher === false) &&
                <BrochureBox key="projectBroucher" setStep={setStep} title="Project Brochure" BroucherUrl={bankDetailsObject.fileUrl[0]} />
            }

{/* FAQ */}
            {bankDetailsObject !== undefined && bankDetailsObject.faqsData !== undefined && bankDetailsObject.faqsData.length !== undefined && bankDetailsObject.faqsData.length > 0 &&
            <Fragment>
                <HeadingBox headingWithEdit="FAQ" subHeading="Frequently Asked Question" setStep={setStep} />
                <PreviewFaqsBlock faqsData={bankDetailsObject.faqsData} />
            </Fragment>
            }


            {isMailSent === false && (
                <div className="previewPageBottomBtnsAndErrCon">
                <div id="loaderForProjectPrev" className="projDetailsLoader">
                    <Loader message="Saving Final Details, Please wait for few seconds" />
                </div>
                    <SingleButton
                        key="PreviewSubmitButton"
                        buttonId="PreviewSubmitButton"
                        containerClassName="PreviewSubmitBtnCon"
                        buttonClassName="PreviewSubmitButton"
                        onSubmit={()=>onNextclick()}
                        title="Submit Project"
                    />
                </div>
            )}

            {isMailSent === true && (
                <div id="project-final-submission-success-msg" className="prevPageSuccessPopupBox" >
                    <div className="prevPageSuccessPopupInnerBox">
                        <img alt="" src={rowSuccessGif} />
                        <p> Your Project has been sent to us Successfully. Please wait for our confirmation.
                            <span onClick={() => onPreviewSumbit()}>
                                Click here to go to Dashboard{" "}
                            </span>
                            to check Project Status
                        </p>
                    </div>
                </div>
            )}

        </div>
  )
};

export default memo(PostProjectPreviewPage);
