import React, { memo, useState } from "react";
import $ from 'jquery';

import '../styles/whyBuyThisProject.css';

import SingleButton from "../commonComponents/SingleButton";
import TextAreaFieldEl from "../commonComponents/textEl";
import Loader from "../commonComponents/Loader";
import TextPad from "../commonComponents/TextPad";
import { convertToPlainText } from "../images/constant";
import { saveProjectBrochure } from "../apis/postApi";
import { EditIcon } from "../images/commonSvgs";
import BankDetails from "./whyBuyThisComponents/BankDetails";

const WhyBuyThisProject = ({
  data,
  onChange,
  onNextclick,
  highlights,
  setHighlights,
  setBankDetailsObject,
  bankDetailsObject,
  bankDetailsResponse,
  commonData,
  file,
  setFile,
  fileUrl,
  setFileUrl,
  banKIds,
  setBankIds,
  customBankNames,
  setCustomBankNames,
  faqsData,
  setFaqsData,
  setFaqsObj,
  faqsObj,
  approvalsIds, setApprovalsIds,
  allApprovedByList,
  phaseArray,
  setPhaseArray

}) => {
  // const sliceStringIntoChunks = (inputString, chunkSize = 5000) => {
  //   const chunks = [];
  //   for (let i = 0; i < inputString.length; i += chunkSize) {
  //     data.whyBuyThisProject = inputString.slice(i, i + chunkSize);
  //   }
  //   return chunks;
  // };

  const [newHighlight, setNewHighlight] = useState("");
  const [phaseBrochure, setPhaseBrochure ] = useState({isOpen: false, url: null, selectedObj: {}, isEditOpen: false, broucherType: "", isChange: false, phaseInputId: "" });

  const onValueChange = (e, ind) => {
    if (ind === undefined) {
      setNewHighlight(e.target.value);
      let el = document.getElementById("_addingInputField");
      if (el !== undefined && el !== undefined) {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      }
    } else {
      // EDIT Existing Values
      const items = [...highlights];
      let value = e.target.value;
      if (e.target.value !== "" && e.target.value.length < 160) {
        items[ind] = value;
        $("#highlitesMaxLimitErrMsg").text("");
      } else {
        $("#highlitesMaxLimitErrMsg").text("*Maximum Limit Is 160 Charecters");
      };

      if(e.target.value === ""){
        items.splice(ind, 1);
      };

      setHighlights(items);

      let el = document.getElementById(`_${ind}`);
      if (el !== undefined && el !== undefined) {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      }
    }
  };

  var el = document.getElementById("_addingInputField");

  const onItemAdding = (e) => {
    if(highlights.length < 10){
      if (el !== undefined && el != null) {
          let value = el !== undefined && el != null ? el.value.replace(/\s+/g, " ").trim()  : "";

          if (value !== "") {
            if (value.length <= 160) {
              setHighlights([...highlights, value]);
              setNewHighlight("")
              el.value = "";
              $("#highlitesMaxLimitErrMsg").text("");
            } else {
              $("#highlitesMaxLimitErrMsg").text(
                "*Maximum Limit Is 160 Charecters"
              );
            }
          }else{
            // need to check once for whole paghe this method is getting callled
              $("#highlightsErrText").show();
              setTimeout(() => {
                $("#highlightsErrText").hide();
              }, 2000);          
          }

          // For Auto height changing of textArea fields...
          el.style.height = "auto";
          el.style.height = el.scrollHeight + "px";
      }
    }else{
      $("#highlitesMaxLimitErrMsg").text("*Can't add more than 10 Highlights");
      setTimeout(()=>{
        $("#highlitesMaxLimitErrMsg").text("");
      }, 2000);
    }
  };

  const onRemoveHighlights = (ind) => {
    const items = [...highlights];
    items.splice(ind, 1);
    setHighlights(items);
  };

  const [editFieldId, setEditFieldId] = useState("");

  const onEditHighlights = (ind) => {
    setEditFieldId(ind);
    if (ind !== editFieldId) {
      $(`#highliteBox_${editFieldId}`).css("border-color", "#148B16");
    }

    $(`#highliteBox_${ind}`).css("border-color", "#0073C6");

    let ele = document.getElementById(`_${ind}`);
    if(ele){
        ele.focus();
        ele.selectionStart = ele.selectionEnd = ele.value.length;
    }
  };

  const onSubmitWhyBuyThis = () => {
      if(phaseBrochure.isChange || (data.isEditSingleBroucher !== undefined && data.isEditSingleBroucher === true)){
        if(phaseBrochure.isChange){
          saveProjectBrochure("P", phaseArray, onNextclick, onChange);
        }
        
        if(data.isEditSingleBroucher !== undefined && data.isEditSingleBroucher === true){
          saveProjectBrochure("S", file, onNextclick, onChange);
        }
      }else{
        onNextclick();
      }
  };

  return (
    <div className="whyBuyThisProjectMainCon" >
      <h1 className="whyBuyThisProjectHeadings">Why buy this project?<span className="requiredStar">*</span></h1>

      <TextPad
          key="whyBuyThisProject"
          inputId="whyBuyThisProject"
          onChange={onChange}
          placeholder="Start writing from here..."
          name="whyBuyThisProject"
          value={data.whyBuyThisProject !== undefined && data.whyBuyThisProject != null ? data.whyBuyThisProject : ""}
          required={true}      
          className="projDetailsTextAreaInputField" 
          maxLimit={5000}         
      />

      {data.whyBuyThisProject !== undefined && data.whyBuyThisProject.length !== undefined && convertToPlainText(data.whyBuyThisProject).length > 5000
          ? <p className="maximumExcedlimiterror">Your text count should not exceed 5000 Characters</p>
          : <p  className="maximumExcedlimit">Maximum {data.whyBuyThisProject !== undefined && data.whyBuyThisProject.length !== undefined && convertToPlainText(data.whyBuyThisProject).length > 0 ? `${convertToPlainText(data.whyBuyThisProject).length} / ` : "" }5000 characters</p> 
      }

      <div className="highlightsAndCountCon">
          <h1 id="projectDetailsHighlightsBlock" className="whyBuyThisProjectHeadings">Highlights</h1>
          {highlights !== undefined &&
            highlights != null &&
            highlights.length > 0 && (
              <p className="whyByThisPointsCount highlitePointsCount">
                {highlights.length === 1 ? "Only 1 Highlight is Added " : `${highlights.length} Highlights Added`}
              </p>
          )}
      </div>

      {highlights !== undefined && highlights != null && highlights.length !== 0 &&
        highlights.map((eachHighlight, ind) => {
          // For Auto height changing of textArea fields...
          let el = document.getElementById(`_${ind}`);
          if (el !== undefined && el != null) {
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }

          return (
            <div key={`_${ind}`} id={`highliteBox_${ind}`} className="whyBuyThisPointsConBox highlitesAddedCon" >
              <svg onClick={() => onRemoveHighlights(ind)} className="whyBuyThisplusIcon"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path d="M12.8865 14.7174C13.1899 15.0068 13.5959 15.1638 14.0151 15.1538C14.4343 15.1439 14.8324 14.9678 15.1218 14.6644C15.4111 14.3609 15.5681 13.9549 15.5582 13.5357C15.5482 13.1166 15.3722 12.7185 15.0687 12.4291L10.1107 7.70092L14.8389 2.74293C15.1283 2.43948 15.2853 2.0335 15.2753 1.61431C15.2654 1.19511 15.0893 0.797039 14.7859 0.507658C14.4824 0.218275 14.0764 0.0612902 13.6572 0.0712369C13.2381 0.0811815 12.84 0.257244 12.5506 0.560693L7.82242 5.51869L2.86443 0.790511C2.56098 0.501129 2.155 0.344143 1.73581 0.354089C1.31662 0.364035 0.918541 0.540099 0.629159 0.843546C0.339777 1.14699 0.182791 1.55297 0.192737 1.97216C0.202683 2.39136 0.378746 2.78943 0.682194 3.07882L5.64019 7.80699L0.912012 12.765C0.62263 13.0684 0.465644 13.4744 0.475591 13.8936C0.485536 14.3128 0.6616 14.7109 0.965048 15.0003C1.2685 15.2896 1.67447 15.4466 2.09367 15.4367C2.51286 15.4267 2.91093 15.2507 3.20032 14.9472L7.92849 9.98922L12.8865 14.7174Z"fill="#8E9CB1" />
              </svg>

              <TextAreaFieldEl
                key={`_${ind}`}
                required="true"
                inputId={`_${ind}`}
                name="highlights"
                capital={"F"}
                onChange={(e) => onValueChange(e, ind)}
                placeholder="Write Highlights"
                className="whyBuyThisPoints"
                containerClassName="whyBuyThisPointsCon"
                inputOuterContainerClassName="whyBuyThisPointsOuterCon"
                rows="1"
                cols="50"
                value={eachHighlight}
              />
              <EditIcon onClick={()=>onEditHighlights(ind)} className="highlitesEditButton"  />
            </div>
          );
        })}

      {highlights.length < 10 &&
      <div className="whyBuyThisPointsConBox">
        <TextAreaFieldEl
          key="_addingInputField"
          required="true"
          inputId="_addingInputField"
          name="highlights"
          capital={"F"}
          onChange={(e) => onValueChange(e, undefined)}
          placeholder={`Add Highlight ${highlights.length + 1}`}
          className="whyBuyThisPoints"
          containerClassName="whyBuyThisPointsCon"
          inputOuterContainerClassName="whyBuyThisPointsOuterCon"
          rows="1"
          cols="50"
          value={newHighlight}
          maxCheracterLimit={160}
        />
      </div>
      }

      {/* <p id="highlitesMaxLimitErrMsg" className="highlitesMaxLimitErrMsg"></p> */}
      {highlights.length < 10 &&
      <SingleButton
        key="highlightsPlusBtn"
        buttonId="highlightsPlusBtn"
        buttonClassName="highlightsPlusBtn"
        onSubmit={()=>onItemAdding()}
        title="+ Click to add more Highlights"
        name="+ Click to add more Highlights"
      />
      }

      <p style={{display: "none"}} id="highlightsErrText" className="maxFieldsIndicatar highlightsErrText">Please add Highlights  before clicking add more</p>

      {/* Bank Details Part */}

      <BankDetails
        bankDetailsObject={bankDetailsObject}
        setBankDetailsObject={setBankDetailsObject}
        bankDetailsResponse={bankDetailsResponse}
        commonData={commonData}
        file={file}
        setFile={setFile}
        fileUrl={fileUrl}
        setFileUrl={setFileUrl}
        banKIds={banKIds}
        setBankIds={setBankIds}
        customBankNames={customBankNames}
        setCustomBankNames={setCustomBankNames}
        faqsData={faqsData}
        setFaqsData={setFaqsData}
        setFaqsObj = {setFaqsObj}
        faqsObj= {faqsObj}
        approvalsIds={approvalsIds}
        setApprovalsIds={setApprovalsIds}
        allApprovedByList={allApprovedByList}
        phaseArray={phaseArray}
        setPhaseArray={setPhaseArray}
        data={data}
        onValueChange={onChange}
        phaseBrochure={phaseBrochure} 
        setPhaseBrochure={setPhaseBrochure}
      />

      <div id="loaderForProjectreason">
        <Loader message="Please wait for few seconds will redirect you to next page" />
      </div>

      <p id="finalErrorMsg_whyBuyThis" style={{display:"none"}} className="validationaErrorMessageForAllPages">Please Fill All The Required Mandatory Fields</p>

      <SingleButton
        key="whyBuythisButton"
        buttonId="whyBuythisButton"
        containerClassName="postProjectButtonMainCon"
        buttonClassName="postProjectButton"
        onSubmit={()=>onSubmitWhyBuyThis()}
        title="SAVE & CONTINUE"
        name="SAVE & CONTINUE"
      />
    </div>
  );
};

export default memo(WhyBuyThisProject);
