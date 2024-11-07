import React, { Fragment } from 'react'
import { DeleteIcon, EditIcon, ImagePreviewEyeIcon } from '../../images/commonSvgs';
import PostPropertyMediaFieldBox from '../../commonComponents/PostPropertyMediaFieldBox';
import Input from '../../commonComponents/Input';

const BroucherUploadingBlock = ({file, fileUrl, onImagePopup, onRemoveImage, phaseArray, 
                                onUploadPhaseBroucher, data, onChange}) => {
    
    const projName = data && data.projName !== undefined ? data.projName : "";
    const phaseCount = data && data.phaseCount !== undefined ? data.phaseCount : 0;

    return (
        <Fragment>
            <h3 id="projectDetailsUploadBrochureBlock" className="whyBuyThisProjectHeadings">Upload Brochure</h3>
            <p className="bankDetailsHeadingContent">
                Upload Brochure in PDF format for compatibility and easy Accessibilty
            </p>

            {phaseCount > 1 &&
            <div className="phaseBrochuresInputsCon">
                <Input
                    required = "false"
                    key="isPhaseBroucher_S"
                    inputId="isPhaseBroucher_S"
                    name="isPhaseBroucher"
                    onChange={(e)=>onUploadPhaseBroucher("CHANGE", e, "S")}
                    type="radio"
                    className="isPhaseBroucherField"
                    containerClassName="isPhaseBroucherFieldCon"
                    label2="Upload Single Brochure"
                    labelClassName2="isPhaseBroucherFieldLable"
                    checked={(data.isPhaseBroucher === undefined || data.isPhaseBroucher == false) ? true : false}
                    value={false}             
                />

                <Input
                    required = "false"
                    key="isPhaseBroucher_P"
                    inputId="isPhaseBroucher_P"
                    name="isPhaseBroucher"
                    onChange={(e)=>onUploadPhaseBroucher("CHANGE", e, "P")}
                    type="radio"
                    className="isPhaseBroucherField"
                    containerClassName="isPhaseBroucherFieldCon"
                    label2="Upload Phase Brochures"
                    labelClassName2="isPhaseBroucherFieldLable"
                    checked={data.isPhaseBroucher == true ? true : false}
                    value={true}          
                />
            </div>
            }

            {(data.isPhaseBroucher === undefined || data.isPhaseBroucher == false || phaseCount === 1) &&
            <PostPropertyMediaFieldBox
                key="PROJECT_PDF"
                fileId="PROJECT_PDF"
                title=""
                mediaType="PDF"
                selectedType="S"
                mediaFilesList={file}
                imgUrlsList={fileUrl}
                required={false}
                dataLimit={200}
                errorMsg="Please upload BROCHURE pdf"
                onUploadBtnClick={onChange}
                onRemoveImage={onRemoveImage}
                buttonTitle="Select File"
                onImagePopup={onImagePopup}
                hideIcon="true"
                hideNotificationText="false"
                hideDataText={true}
                displayImgClass="broucherImgSize"
            />
            }

            {data.isPhaseBroucher == true &&
            <Fragment>
                <p id={`phasesBrocherErrorMsg`} className="errorMsgForPropmedia"></p>

                {phaseArray && phaseArray.length !== undefined && phaseArray.length > 0 &&
                phaseArray.map(eachPhase=>{
                    if(eachPhase.isActive !== "N"){
                        return(
                            <div key={`phaseBrochureBoxCon_${eachPhase.phaseId}`} className="phaseBrochureFieldCon">
                                <input
                                    key={`phaseBrochureField_${eachPhase.phaseId}`}
                                    id={`phaseBrochureField_${eachPhase.phaseId}`}
                                    style={{ display: "none" }}
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e)=>onUploadPhaseBroucher("ADD", e, eachPhase)}
                                    onClick={(e) => (e.target.value = "")}
                                />
                                <p>Upload Brochure For {projName} {eachPhase.phaseName}</p>
                                <label htmlFor={`phaseBrochureField_${eachPhase.phaseId}`} className="upoladMediaFileBtn phaseBrochureLable">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M4.72656 12.1869C4.87575 12.1869 5.01882 12.2461 5.12431 12.3516C5.2298 12.4571 5.28906 12.6002 5.28906 12.7494V14.2494C5.28906 14.3529 5.37306 14.4369 5.47656 14.4369H14.4766C14.5263 14.4369 14.574 14.4171 14.6091 14.382C14.6443 14.3468 14.6641 14.2991 14.6641 14.2494V12.7494C14.6641 12.6002 14.7233 12.4571 14.8288 12.3516C14.9343 12.2461 15.0774 12.1869 15.2266 12.1869C15.3757 12.1869 15.5188 12.2461 15.6243 12.3516C15.7298 12.4571 15.7891 12.6002 15.7891 12.7494V14.2494C15.7891 14.5975 15.6508 14.9313 15.4046 15.1775C15.1585 15.4236 14.8247 15.5619 14.4766 15.5619H5.47656C5.12847 15.5619 4.79463 15.4236 4.54848 15.1775C4.30234 14.9313 4.16406 14.5975 4.16406 14.2494V12.7494C4.16406 12.6002 4.22333 12.4571 4.32881 12.3516C4.4343 12.2461 4.57738 12.1869 4.72656 12.1869ZM9.03006 12.0946C8.84393 12.0948 8.6645 12.0252 8.52718 11.8995C8.38987 11.7739 8.30464 11.6013 8.28831 11.4159C8.1734 10.1015 8.15335 8.78061 8.22831 7.46338C8.04296 7.45301 7.8577 7.44101 7.67256 7.42738L6.55506 7.34563C6.45664 7.33842 6.36178 7.30578 6.27977 7.25091C6.19775 7.19604 6.13138 7.12081 6.08716 7.03259C6.04293 6.94437 6.02237 6.84618 6.02748 6.74764C6.03259 6.64909 6.0632 6.55355 6.11631 6.47038C6.91273 5.22379 7.93896 4.14003 9.14031 3.27688L9.58806 2.95513C9.70128 2.87382 9.83717 2.83008 9.97656 2.83008C10.116 2.83008 10.2518 2.87382 10.3651 2.95513L10.8128 3.27763C12.0141 4.14057 13.0403 5.22407 13.8368 6.47038C13.8899 6.55355 13.9205 6.64909 13.9256 6.74764C13.9308 6.84618 13.9102 6.94437 13.866 7.03259C13.8217 7.12081 13.7554 7.19604 13.6734 7.25091C13.5913 7.30578 13.4965 7.33842 13.3981 7.34563L12.2806 7.42738C12.0961 7.44088 11.9108 7.45288 11.7256 7.46263C11.8006 8.78038 11.7796 10.1011 11.6641 11.4151C11.6479 11.6006 11.5629 11.7732 11.4257 11.899C11.2885 12.0248 11.1092 12.0946 10.9231 12.0946H9.03006Z" fill="#0073C6"/>
                                    </svg>
                                    {eachPhase.phaseBrochureUrl === undefined || eachPhase.phaseBrochureUrl === null ? "Select File" : "Replace File"} 
                                </label>

                                {eachPhase.phaseBrochureUrl !== undefined && eachPhase.phaseBrochureUrl !== null &&
                                <div className="phaseBrochureIconsCon">
                                    <ImagePreviewEyeIcon key={`phaseBrochurePreview_${eachPhase.phaseId}`} className="videoFileAndDeleteIcons" onClick={()=>onUploadPhaseBroucher("OPEN", undefined, eachPhase, `phaseBrochureField_${eachPhase.phaseId}`)} />
                                    <label className="editVideoIconClass" htmlFor={`phaseBrochureField_${eachPhase.phaseId}`}>
                                        <EditIcon key={`phaseBrochureEdit_${eachPhase.phaseId}`} className="videoFileAndDeleteIcons" />
                                    </label>
                                    <DeleteIcon key={`phaseBrochureDetete_${eachPhase.phaseId}`} className="videoFileAndDeleteIcons" onClick={() => onUploadPhaseBroucher("DELETE", undefined, eachPhase)} />
                                </div>
                                }
                            </div>
                        )}
                    })
                }
            </Fragment>
            }
        </Fragment>
    )
};

export default BroucherUploadingBlock;
