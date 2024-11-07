import React from "react";
import { PopupCrossMark } from "../images/commonSvgs";

const PropertyCard = ({setPreviewPopup, eachRow, heading, number}) => {
    return(
        <div className="rowDetailsPreviewBox">
            
            <div className="rowDetailsImageCon">
                <img src={eachRow.floorPlanUrl !== undefined
                     ? eachRow.floorPlanUrl : ""} alt="" className="rowDetailsImage" />
                <div className="rowDetailsImageHeading">Floor Plan</div>
            </div>
            <div className="rowDetailsDetailsCon" >
                    <p className="previewImgHeading">{heading} {number}<img src="https://d1eia5vwbzlltl.cloudfront.net/correctly-matched.png" alt="" className="rowHeadingRightIcon" /></p>
                    <div className="rowPreviewDetailsItemsCon">
                        {eachRow.bhk !== undefined &&
                        <p className="rowPreviewDetailsItem">Unit Type - <span>{eachRow.bhk}</span></p>
                        }
                        {eachRow.unitNumber !== undefined &&
                        <p className="rowPreviewDetailsItem">Unit Number - <span>{eachRow.unitNumber}</span></p>
                        }
                        {eachRow.tower !== undefined &&
                        <p className="rowPreviewDetailsItem">Towers - <span>{eachRow.tower}</span></p>
                        }
                        {eachRow.floor !== undefined &&
                        <p className="rowPreviewDetailsItem">Floors - <span>{eachRow.floor}</span></p>
                        }
                        {eachRow.gardenArea !== undefined &&
                        <p className="rowPreviewDetailsItem">Garden Space - <span>{eachRow.gardenArea}</span></p>
                        }
                        {eachRow.terraceArea !== undefined &&
                        <p className="rowPreviewDetailsItem">Terrace Space - <span>{eachRow.terraceArea}</span></p>
                        }
                        {eachRow.block !== undefined &&

                        <p className="rowPreviewDetailsItem">No: Of Blocks - <span>{eachRow.block}</span></p>
                        }
                        {eachRow.superBuildUpArea !== undefined &&
                        <p className="rowPreviewDetailsItem">Super Built-up Area - <span>{eachRow.superBuildUpArea}</span></p>
                        }
                        {eachRow.carpetArea !== undefined &&
                        <p className="rowPreviewDetailsItem">Carpet Area - <span>{eachRow.carpetArea}</span></p>
                        }
                        {eachRow.plotArea !== undefined &&
                        <p className="rowPreviewDetailsItem">Area - <span>{eachRow.plotArea}</span></p>
                        }
                        {eachRow.plotArea !== undefined &&
                        <p className="rowPreviewDetailsItem">Plot Area - <span>{eachRow.plotArea}</span></p>
                        }
                        {eachRow.length !== undefined &&
                        <p className="rowPreviewDetailsItem">Length of Plot - <span>{eachRow.length}</span></p>
                        }
                        {eachRow.width !== undefined &&
                        <p className="rowPreviewDetailsItem">Breadth of Plot - <span>{eachRow.width}</span></p>
                        }
                        {eachRow.plotFacing !== undefined &&
                        <p className="rowPreviewDetailsItem">Plot Facing - <span>{eachRow.plotFacing}</span></p>
                        }
                        {eachRow.bathrooms !== undefined &&
                        <p className="rowPreviewDetailsItem">Bathrooms - <span>{eachRow.bathroom}</span></p>
                        }
                        {eachRow.balcony !== undefined &&
                        <p className="rowPreviewDetailsItem">Balcony - <span>{eachRow.balcony}</span></p>
                        }


                    </div>
            </div>

            {setPreviewPopup !== "edit" ? 
                <PopupCrossMark id="propCradPopupCrossIcon" key="propCradPopupCrossIcon" className="crossIconForInnerCon" onClick={()=>setPreviewPopup("none")} />
            :
                ("")
            }
            
        </div>
    )
};

export default PropertyCard;