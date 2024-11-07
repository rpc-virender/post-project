import React from "react";
import {PopupCrossMark, pdfDeleteSvg, pdfWhiteIcon } from "../images/commonSvgs";

export default function PdfPopup({
  onImagePopup,
  fileUrl,
  onRemoveImage,
  selectedType,
  fileId
}) {
  const onDleteClick = () => {
    if(Object.keys(selectedType).length > 0){
      onRemoveImage(fileUrl, selectedType.id);
    }else{
      onRemoveImage();
    }
    
    onImagePopup("CLOSE");
  };
  
  return (
    <div className="multIImagesConPopupStaticCon">
      <div className="pdfPopupinnerPopupCon">
        {/* Header */}
        <div className="pdfPopupheadingAndCrossCon">
          <h3>BROCHURE PREVIEW</h3>

          <div className="pdfPopupRightSideCon">
            <span id="pdfPopupMaxlimitErrorMsg" className="pdfPopupMaxlimitErrorMsg"></span>
            <p>
              <span
                className="pdfPopupDeleteIconCss"
                id="pdfPopupDeleteIcon"
                onClick={() => onDleteClick()}
              >
                {pdfDeleteSvg}
              </span>
            </p>

            <label className="pdfPopupUploadButton" htmlFor={fileId}>
              {pdfWhiteIcon}
              Replace Pdf
            </label>

            {/* <PopupCrossIcon
              onClick={() => onImagePopup("CLOSE")}
              className="pdfPopupCrossIcon"
              fill="#F00"
            /> */}

            <PopupCrossMark id="pdfPopupCrossIcon" key="pdfPopupCrossIcon" className="pdfPopupCrossIcon" onClick={()=>onImagePopup("CLOSE")} />


          </div>
        </div>

        {/* bottom block */}
        <div className="pdfPopupBottomCon">
          {fileUrl != "" && (
            <iframe src={fileUrl} className="pdfDisplayIframe" />
          )}
        </div>
      </div>
    </div>
  );
}
