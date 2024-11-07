import React from "react";

import {EditIcon} from '../images/commonSvgs';

import '../styles/postProjectLeftSideCon.css';

const LeftSideTrackingCon = ({imageForStep ,trackeForProject}) => {
    

    return(
        <div className="newTrackerMainCon">
            <div className="leftSideMainContainer">
                <div className="leftSideHRlinesCon">
                    <hr className="postProjTrackerLine" />
                    <hr className="postProjTrackerLine" />
                    <hr className="postProjTrackerLine" />
                    <hr className="postProjTrackerLine" />
                    <hr className="postProjTrackerLine" />
                </div>

                <div className="leftSideMainCon">
                    <div className="statusBarNamesMainCon" onClick={()=>trackeForProject(0)}>
                        <span className="statusIconClass">{imageForStep.step0}</span>
                        <div className="statusNames">
                            Project Details
                            <span id="basicDetailsEditIcon" style={{display:"none"}}>
                                <EditIcon className={"postProjTrackerEditIcon"} iconId={"proj_PD"} />
                            </span>
                        </div>
                    </div>
                    
                    <div className="statusBarNamesMainCon" onClick={()=>trackeForProject(1)}>
                        <span className="statusIconClass">{imageForStep.step1}</span>
                        <div className="statusNames">
                            Property Details
                            <span id="propDetailsEditIcon" style={{display:"none"}}>
                            <EditIcon  className={"postProjTrackerEditIcon"} iconId={"proj_PRD"} />
                            </span>
                        </div>
                    </div>

                    <div className="statusBarNamesMainCon" onClick={()=>trackeForProject(2)}>
                        <span className="statusIconClass">{imageForStep.step2}</span>
                        <div className="statusNames">
                            Project Images
                            <span id="imagesEditIcon" style={{display:"none"}}>
                            <EditIcon className={"postProjTrackerEditIcon"} iconId={"proj_PI"} />  
                            </span>   
                        </div>
                    </div>

                    <div className="statusBarNamesMainCon" onClick={()=>trackeForProject(3)}>
                        <span className="statusIconClass">{imageForStep.step3}</span>
                        <div className="statusNames">
                            Specifications
                            <span id="specificationsEditIcon" style={{display:"none"}}>
                            <EditIcon  className={"postProjTrackerEditIcon"} iconId={"proj_SPE"} />  
                            </span>
                        </div>
                    </div>

                    <div className="statusBarNamesMainCon" onClick={()=>trackeForProject(4)}>
                        <span className="statusIconClass">{imageForStep.step4}</span>
                        <div className="statusNames">
                            <span>Amenities</span>
                            <span id="amenitiesEditIcon" style={{display:"none"}}>
                            <EditIcon className={"postProjTrackerEditIcon"} iconId={"proj_AME"} />
                            </span>
                        </div>
                    </div>

                    <div className="statusBarNamesMainCon" onClick={()=>trackeForProject(5)}>
                        <span className="statusIconClass">{imageForStep.step5}</span>
                        <div className="statusNames">
                            Why Buy This Project?
                            <span id="whyBuyThisEditIcon" style={{display:"none"}}>
                            <EditIcon  className={"postProjTrackerEditIcon"} iconId={"proj_WBT"} />
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};

export default LeftSideTrackingCon;