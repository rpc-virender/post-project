import React from "react";
import PropertyCard from "../PropertyCard";

const DetailsPreviewPopup = ({setPreviewPopup, eachRow}) => {

    return(
        <div id="popup" className="rowDetailspreviewPopupCon">
            <PropertyCard setPreviewPopup={setPreviewPopup} eachRow={eachRow} />
        </div>
    )
};

export default DetailsPreviewPopup;