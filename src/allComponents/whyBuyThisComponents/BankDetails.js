import React, { useState, useEffect, Fragment } from "react";
import $ from 'jquery';
import MultiSelectBySeaechDropdown from "../../commonComponents/MultiSelectBySeaechDropdown";
import Input from "../../commonComponents/Input";
import TextAreaFieldEl from "../../commonComponents/textEl";
import SingleButton from "../../commonComponents/SingleButton";
import PdfPopup from "../../commonComponents/PdfPopup";
import EditDetailsPopup from "./EditDetailsPopup";
import BroucherUploadingBlock from "./BroucherUploadingBlock";

export default function BankDetails({
    setBankDetailsObject, commonData, file, setFile, fileUrl, setFileUrl, banKIds, setBankIds, customBankNames, setCustomBankNames, phaseBrochure, setPhaseBrochure,
    faqsData, setFaqsData, setFaqsObj, faqsObj, approvalsIds, setApprovalsIds, allApprovedByList, phaseArray, setPhaseArray, data, onValueChange
  }) {
  
  const [nonDeletelength, setNonDeletelength] = useState();

  const onChange = (e) => {
    const fileId = e.target.id;
    const files = e.target.files;
    let file = e.target.files[0];
    $('#' + `postProp_err_msg_${fileId}`).css('display', 'none');
    if (files.length > 0) {
      if (file.size > (100 * 1000000)) {
        $('#' + `postProp_err_msg_${fileId}`).css('display', 'block');
        $('#' + `postProp_err_msg_${fileId}`).text('Upload size exceeds limit. please reduce');
        $(`#pdfPopupMaxlimitErrorMsg`).text('Upload size exceeds limit. please reduce');

        setTimeout(()=>{
          $('#' + `postProp_err_msg_${fileId}`).css('display', 'none');
          $(`#pdfPopupMaxlimitErrorMsg`).text(``);
        },3000)

      }else{
        setFile([files[0]]);
        setFileUrl([URL.createObjectURL(files[0])]);
        onValueChange({target: { name: "isEditSingleBroucher", value : true}});
        setPhaseBrochure(prev=>({ ...prev, isChange : false}));
      }
    }
  };

  useEffect(() => {
    setBankDetailsObject({ file, fileUrl, banKIds, customBankNames, faqsData });

    setNonDeletelength( faqsData !== undefined && faqsData != null ? faqsData.filter((each)=> (each.isDeleted != "Y")).length : 0);
  }, [file, fileUrl, banKIds, customBankNames, faqsData,]);

  const [filterArray,setFilterArray] = useState([]);




  useEffect(()=>{
      let array = []
      if(faqsData != null && faqsData.length > 0){
        array.push(...faqsData.filter((each)=>(each.isDeleted !== "Y")))
        array.push(...faqsData.filter((each)=>(each.isDeleted === "Y")))
      }
      setFilterArray(array);
  },[faqsData])

  const onRemoveImage = () => {
    setFile([]);
    setFileUrl([]);
    onValueChange({target: { name: "isEditSingleBroucher", value : true}});
  };

  const onAddingCustumBanks = (identifier, index) => {
    //customBankName
    let prev = [...customBankNames];

    switch (identifier) {
      case "ADD":
        let name = $("#customBankName").val();
        if (name !== "") {
          if(prev.length < 5){
            setCustomBankNames([...prev, name]);
            $("#customBankName").val("");
            setNewValue("");

            $("#customBankNameCon").css("border-color", "#C9C9C9");
            }else{
            $("#customBanksErrMsg").text(
              "Maximum Limit is 5 Exceeded"
            );
          }
        } else {
          $("#customBanksErrMsg").text(
            "Please add bank name before clicking add more"
          );
          $("#customBankNameCon").css("border-color", "#F00");
        }
        break;
      case "DELETE":
        
        prev.splice(index, 1);
        setCustomBankNames(prev);
        break;
      default:
          return "";
    }
  };

  const [newValue, setNewValue] = useState("");
  const onCustomBankChange = (e, index) => {
    $("#customBanksErrMsg").text("");
    $("#customBankNameCon").css("border-color", "#148B16");
    if (index != undefined) {
      let value = e.target.value;

      const items = [...customBankNames];
      if (e.target.value !== "") {
        items[index] = value;
        
        $(`#customBankNameCon_${index}`).css("border-color", "#0073C6");
      }

      if(e.target.value === ""){
        items.splice(index, 1);
      };

      setCustomBankNames(items);
      
    }else{
        if(e.target.value !== "" && e.target.value[0] !== " "){
          setNewValue(e.target.value);
        }else{
          setNewValue();
        }
    }
  };

  const onchangeFaqs = (e, index) => {
    let value = e.target.value;
    let name = e.target.name;
  
    if (index === undefined) {
      if ( value.length < 1002) {
          setFaqsObj((faqsObj) => ({
            ...faqsObj,
            [name]: value,
            isChange: "Y",
            isActive: "Y",
            isDeleted: "N",
          }));

          $("#addNewfaqErrMsg").text("");
          $("#faqQuestion").css("border-color", "#148B16");
          $("#faqAnswer").css("border-color", "#148B16");
      }else{
          $("#faqAnswer").css("border-color", "#F00");
      }
      //setFaqsData(...faqsData,faqsObj)
      

    } else {
      // for edit
      const items = [...faqsData];
      if (value.length < 1002) {
        let currentObj = items[index];
        currentObj[name] = value;
        currentObj.isChange = "Y";
        currentObj.isActive = "Y";
        currentObj.isDeleted = "N";

        $(`#faqQuestion_${index}`).css("border-color", "#148B16");
          $(`#faqAnswer_${index}`).css("border-color", "#148B16");

        $("#highlitesMaxLimitErrMsg").text("");
      } else {
        $("#highlitesMaxLimitErrMsg").text("*Maximum Limit Is 1000 Charecters");
      }

      $(`#addNewfaqErrMsg_${index}`).text("");

      setFaqsData(items);
    }
  };

  const addMoreFaqs = (identifier, index) => {

    switch (identifier) {
      case "SAVE":
        if (
          faqsObj.faqQuestion != undefined &&
          faqsObj.faqQuestion != "" &&
          faqsObj.faqAnswer != undefined &&
          faqsObj.faqAnswer != "" &&
          faqsObj.faqAnswer.length < 1001
        ) {
          if(nonDeletelength < 10 ){
            // faqsObj.id = Math.random()*10;
            setFaqsData([...faqsData, faqsObj]);
            setFaqsObj({});
            $("#addNewfaqErrMsg").text("");
  
          }else{
            $("#addNewfaqErrMsg").text(
              "Maximum Limit is 10 Exceeded"
            );
          }
        } else {
          if ((faqsObj.faqQuestion == undefined || faqsObj.faqQuestion == "") && (faqsObj.faqAnswer != undefined && faqsObj.faqAnswer != "")) {
            //addNewfaqErrMsg
            $("#addNewfaqErrMsg").text("Please Add Your Question");

            $("#faqQuestion").css("border-color", "#F00");
          }else if((faqsObj.faqAnswer == undefined || faqsObj.faqAnswer == "") && (faqsObj.faqQuestion != undefined && faqsObj.faqQuestion != "")){
            //addNewfaqErrMsg
            $("#addNewfaqErrMsg").text("Please Add Your Answer");

            $("#faqAnswer").css("border-color", "#F00")
          }else{
            //addNewfaqErrMsg
            $("#addNewfaqErrMsg").text("Please Add Question/Answer before clicking Add more.");

            $("#faqQuestion").css("border-color", "#F00");
            $("#faqAnswer").css("border-color", "#F00");
          }

        }
        break;

      case "REMOVE":
        let prev = [...faqsData];
        let removedItem = prev.splice(index, 1)[0];
        // let removedItem = prev[index];
        //prev.splice(index, 1);
        removedItem.isDeleted = "Y";
        removedItem.isChange = "Y"
        removedItem.isActive = "N"
        prev.push(removedItem);
        setFaqsData(prev);
        break;
      default:
        return "";
    }
  };

  const removeBank = (id) => {
    let prev = [...banKIds];
    let newList = prev.filter(eachId => eachId != id );
    setBankIds(newList);
  };

  const removePropApprovals = (id) => {
    let prev = [...approvalsIds];
    let newList = prev.filter(eachId => eachId != id );
    setApprovalsIds(newList);
  };

  const onImagePopup = (identifier) => {
    switch (identifier) {
      case "OPEN":
        //setPreviewData(eachRow);
        document.body.style.overflow = "hidden";
        $("#pdfPopup").show();
        break;

      case "CLOSE":
        $("#pdfPopup").hide();
        document.body.style.overflow = "scroll";
        break;
      default:
        return "";
    }
  };

  const deletePhaseUrl = (obj) => {
      setPhaseBrochure(prev=>({ ...prev, isChange : true, broucherType: "P" }));
      setPhaseArray(prevPhases=>{
          let oldList = [...prevPhases];
          oldList.filter(each=>{
              if(each.phaseId === obj.phaseId){
                  each.phaseBrochureFile = null;
                  each.phaseBrochureUrl = null;
              }
          });
          return oldList;
      });
  };

  const onUploadPhaseBroucher = (identifier, e, obj, phaseInputId) => {
      if(identifier === undefined) deletePhaseUrl(phaseBrochure.selectedObj);

      switch(identifier){
          case "ADD":
              let file = e.target.files[0];
              let url = URL.createObjectURL(file);
        
              if (file.size > (50 * 1000000)) {
                  $(`#phasesBrocherErrorMsg`).text('Upload size exceeds limit. please reduce');
                  setTimeout(()=>{
                    $(`#phasesBrocherErrorMsg`).text(``);
                  },3000)
              }else{
                  // uploading phase broucher
                  setPhaseBrochure(prev=>({ ...prev, isChange : true, broucherType: "P", url: url}));
                  onValueChange({target: { name: "isEditSingleBroucher", value : false}});
                  setPhaseArray(prevPhases=>{
                      let oldList = [...prevPhases];
                      oldList.filter(each=>{
                          if(each.phaseId === obj.phaseId){
                              each.phaseBrochureFile = file;
                              each.phaseBrochureUrl = url;
                          }
                      });
                      return oldList;
                  });
              };
              break;
          case "DELETE":
              deletePhaseUrl(obj);
              break;
          case "OPEN":
              setPhaseBrochure(prev=>({...prev, isOpen: true, url: obj.phaseBrochureUrl, selectedObj: obj, phaseInputId: phaseInputId }));
              break;
          case "CLOSE":
              setPhaseBrochure(prev=>({...prev, isOpen: false, url: null, selectedObj: {}, isEditOpen: false}));
              break;
          case "CHANGE":
              let isData = false;
              if(obj == "P"){
                  // IF select phase broucher checking project broucher data
                  if(fileUrl.length !== 0) isData = true;
              }else{
                  // IF select project broucher checking phase broucher data
                  let dataLength = phaseArray.filter(each=>each.phaseBrochureUrl !== undefined && each.phaseBrochureUrl !== null ).length;
                  if(dataLength > 0) isData = true;
              }

              setPhaseBrochure(prev=>({...prev, broucherType: obj }));

              if(isData){
                  setPhaseBrochure(prev=>({...prev, isEditOpen: true}));
              }else{
                  let prevState = obj == "S" ? false : true;
                  onValueChange({target: { name: "isPhaseBroucher", value : prevState}});
              };

              break;
          case "OK":
              let prevState = phaseBrochure.broucherType == "S" ? false : true;
              if(phaseBrochure.broucherType == "P") { 
                  // if phase broucher delete project broucher
                  onRemoveImage();
              }else{
                  setPhaseBrochure(prev=>({ ...prev, isChange : true }));
                  // if project broucher delete phase brouchers
                  setPhaseArray(prevPhases=>{
                      let oldList = [...prevPhases];
                      oldList.filter(each=>{
                          each.phaseBrochureFile = null;
                          each.phaseBrochureUrl = null;
                      });
                      return oldList;
                  });
              }
              onValueChange({target: { name: "isPhaseBroucher", value : prevState, id: e.target.id }});
              setPhaseBrochure(prev=>({...prev, isOpen: false, url: null, selectedObj: {}, isEditOpen: false }));
              break;
              default:
                return "";
      }
    
  };

  return (
    <Fragment>
      <div id="pdfPopup" style={{ display: "none" }}>
        <PdfPopup
          key={"PROJECT_PDF"}
          onImagePopup={onImagePopup}
          onRemoveImage={onRemoveImage}
          fileUrl={fileUrl}
          fileId={"PROJECT_PDF"}
          selectedType={{}}
        />
      </div>

      {phaseBrochure.isOpen &&
      <PdfPopup
          key={phaseBrochure.phaseInputId}
          onImagePopup={onUploadPhaseBroucher}
          onRemoveImage={onUploadPhaseBroucher}
          fileUrl={phaseBrochure.url}
          fileId={phaseBrochure.phaseInputId}
          selectedType={{}}
      />
      }

      {phaseBrochure.isEditOpen &&
      <EditDetailsPopup onSelect={onUploadPhaseBroucher} type={phaseBrochure.broucherType} />
      }

      {/* Approvals */}
      <h1 id="projectDetailsPropertyApprovalsBlock" className="whyBuyThisProjectHeadings">Project Approved By</h1>

      {approvalsIds && approvalsIds.length > 0 &&
      <div className="customBhkNameBoxsCon">
        {allApprovedByList.map((eachItem) => {     
            if (approvalsIds.includes(eachItem.cid)) {
              return (
                <div
                  key={`approvals_${eachItem.cid}`}
                  className="customAmenitiesItemsCon"
                >
                  <span>{eachItem.constDesc}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="amenityCrossIcon"
                    onClick={()=>removePropApprovals(eachItem.cid)}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.79279 6.79299C6.98031 6.60552 7.23462 6.5002 7.49979 6.5002C7.76495 6.5002 8.01926 6.60552 8.20679 6.79299L11.9998 10.586L15.7928 6.79299C15.885 6.69748 15.9954 6.6213 16.1174 6.56889C16.2394 6.51648 16.3706 6.48889 16.5034 6.48774C16.6362 6.48659 16.7678 6.51189 16.8907 6.56217C17.0136 6.61245 17.1253 6.6867 17.2192 6.78059C17.3131 6.87449 17.3873 6.98614 17.4376 7.10904C17.4879 7.23193 17.5132 7.36361 17.512 7.49639C17.5109 7.62917 17.4833 7.76039 17.4309 7.88239C17.3785 8.0044 17.3023 8.11474 17.2068 8.20699L13.4138 12L17.2068 15.793C17.3889 15.9816 17.4897 16.2342 17.4875 16.4964C17.4852 16.7586 17.38 17.0094 17.1946 17.1948C17.0092 17.3802 16.7584 17.4854 16.4962 17.4877C16.234 17.4899 15.9814 17.3891 15.7928 17.207L11.9998 13.414L8.20679 17.207C8.01818 17.3891 7.76558 17.4899 7.50339 17.4877C7.24119 17.4854 6.99038 17.3802 6.80497 17.1948C6.61956 17.0094 6.51439 16.7586 6.51211 16.4964C6.50983 16.2342 6.61063 15.9816 6.79279 15.793L10.5858 12L6.79279 8.20699C6.60532 8.01946 6.5 7.76515 6.5 7.49999C6.5 7.23483 6.60532 6.98052 6.79279 6.79299Z"
                      fill="#192041"
                    />
                  </svg>
                </div>
              );
            }
          })}
      </div>
      }

      <MultiSelectBySeaechDropdown
          hideSearhInputField={true}
          required="flase"
          key="projApprovedByDropdown"
          inputId="propPropApprovals"
          placeholder="--Select Project Approvals--"
          dropdownArray={allApprovedByList}
          containerClassName="branchMultiSelectedDropdownCon"
          outerContainerClassName="banksMultiSelectedDropdownOuterCon"
          label="Select Project Approved By from the below dropdown"
          labelClassName="multiBanksLable"
          setIds={setApprovalsIds}
          ids={approvalsIds}
          DropdownConClassName="multiSelectDropdownCon"
          DropdownItemsClassName="multiSelectDropdownItemsCon"
          dropdownItemClassCon="multiSelectDropdownItem"
          hideItemsDisplay={true}
      />


      <h1 id="projectDetailsBankApprovalsBlock" className="whyBuyThisProjectHeadings">Bank Approvals</h1>
      <p className="bankDetailsHeadingContent">
        Bank affiliation inquiry for project funding support
      </p>

      {/* Display banks names */}

      {commonData.banks !== undefined && commonData.banks != null && commonData.banks.length > 0 && banKIds && banKIds.length > 0 &&
      <div className="customBhkNameBoxsCon">
        {commonData.banks.map((eachItem, index) => {     
            if (banKIds.includes(eachItem.cid)) {
              return (
                <div
                  key={`bank_${eachItem.cid}`}
                  className="customAmenitiesItemsCon"
                >
                  <span>{eachItem.constDesc}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="amenityCrossIcon"
                    onClick={()=>removeBank(eachItem.cid)}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.79279 6.79299C6.98031 6.60552 7.23462 6.5002 7.49979 6.5002C7.76495 6.5002 8.01926 6.60552 8.20679 6.79299L11.9998 10.586L15.7928 6.79299C15.885 6.69748 15.9954 6.6213 16.1174 6.56889C16.2394 6.51648 16.3706 6.48889 16.5034 6.48774C16.6362 6.48659 16.7678 6.51189 16.8907 6.56217C17.0136 6.61245 17.1253 6.6867 17.2192 6.78059C17.3131 6.87449 17.3873 6.98614 17.4376 7.10904C17.4879 7.23193 17.5132 7.36361 17.512 7.49639C17.5109 7.62917 17.4833 7.76039 17.4309 7.88239C17.3785 8.0044 17.3023 8.11474 17.2068 8.20699L13.4138 12L17.2068 15.793C17.3889 15.9816 17.4897 16.2342 17.4875 16.4964C17.4852 16.7586 17.38 17.0094 17.1946 17.1948C17.0092 17.3802 16.7584 17.4854 16.4962 17.4877C16.234 17.4899 15.9814 17.3891 15.7928 17.207L11.9998 13.414L8.20679 17.207C8.01818 17.3891 7.76558 17.4899 7.50339 17.4877C7.24119 17.4854 6.99038 17.3802 6.80497 17.1948C6.61956 17.0094 6.51439 16.7586 6.51211 16.4964C6.50983 16.2342 6.61063 15.9816 6.79279 15.793L10.5858 12L6.79279 8.20699C6.60532 8.01946 6.5 7.76515 6.5 7.49999C6.5 7.23483 6.60532 6.98052 6.79279 6.79299Z"
                      fill="#192041"
                    />
                  </svg>
                </div>
              );
            }
          })}
      </div>
      }

      {/* Bank Selecting Dropdown */}
      <MultiSelectBySeaechDropdown
        hideSearhInputField={true}
        required="flase"
        key="projBankDetailsDropdown"
        inputId="dashboard_banks"
        placeholder="--Select Banks--"
        dropdownArray={
          commonData.banks !== undefined && commonData.banks != null
            ? commonData.banks
            : []
        }
        containerClassName="branchMultiSelectedDropdownCon"
        outerContainerClassName="banksMultiSelectedDropdownOuterCon"
        label="Select Banks from the below dropdown"
        labelClassName="multiBanksLable"
        setIds={setBankIds}
        ids={banKIds}
        DropdownConClassName="multiSelectDropdownCon"
        DropdownItemsClassName="multiSelectDropdownItemsCon"
        dropdownItemClassCon="multiSelectDropdownItem"
        hideItemsDisplay={true}
      />

      {/* Adding Custom Banks */}
      <h3 id="projectDetailsCustomBanksBlock" className="whyBuyThisProjectHeadings">Add Banks Manually</h3>
      <p className="bankDetailsHeadingContent">
        Add banks manually if Bank is not in dropdown{" "}
      </p>

      {customBankNames.length !== 0 &&
      <div className="customBhkNameBoxsCon">
        {customBankNames.map((eachName, index) => {
          return (
            <div
              key={`customBank_${index}`}
              className="customAmenitiesItemsCon"
            >
              <span>{eachName}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="amenityCrossIcon"
                  onClick={() => onAddingCustumBanks("DELETE", index)}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.79279 6.79299C6.98031 6.60552 7.23462 6.5002 7.49979 6.5002C7.76495 6.5002 8.01926 6.60552 8.20679 6.79299L11.9998 10.586L15.7928 6.79299C15.885 6.69748 15.9954 6.6213 16.1174 6.56889C16.2394 6.51648 16.3706 6.48889 16.5034 6.48774C16.6362 6.48659 16.7678 6.51189 16.8907 6.56217C17.0136 6.61245 17.1253 6.6867 17.2192 6.78059C17.3131 6.87449 17.3873 6.98614 17.4376 7.10904C17.4879 7.23193 17.5132 7.36361 17.512 7.49639C17.5109 7.62917 17.4833 7.76039 17.4309 7.88239C17.3785 8.0044 17.3023 8.11474 17.2068 8.20699L13.4138 12L17.2068 15.793C17.3889 15.9816 17.4897 16.2342 17.4875 16.4964C17.4852 16.7586 17.38 17.0094 17.1946 17.1948C17.0092 17.3802 16.7584 17.4854 16.4962 17.4877C16.234 17.4899 15.9814 17.3891 15.7928 17.207L11.9998 13.414L8.20679 17.207C8.01818 17.3891 7.76558 17.4899 7.50339 17.4877C7.24119 17.4854 6.99038 17.3802 6.80497 17.1948C6.61956 17.0094 6.51439 16.7586 6.51211 16.4964C6.50983 16.2342 6.61063 15.9816 6.79279 15.793L10.5858 12L6.79279 8.20699C6.60532 8.01946 6.5 7.76515 6.5 7.49999C6.5 7.23483 6.60532 6.98052 6.79279 6.79299Z"
                    fill="#192041"
                  />
                </svg>
            </div>
          );
        })}
      </div>
      }

      { customBankNames.map((eachName, index) => {
        return (
          <div key={index} id={`customBankNameCon_${index}`} className="customBankNameInputBlock">
            <Input
              key={index}
              required="false"
              inputId={`customBankName_${index}`}
              name="customBankName"
              onChange={(e) => onCustomBankChange(e, index)}
              placeholder="Enter Bank Name"
              type="text"
              className="customBankNameInput"
              containerClassName="customBankNameInputCon"
              outerContainerClassName="customBankNameInputOuterCon"
              inputOuterContainerClassName="customBankNameInputOuterMainCon"
              value={eachName}
              maxCheracterLimit={100}
              hideErrorMsg={true}
            />

            {/* <EditIcon /> */}
          </div>
        );
      })}

      {customBankNames.length < 5 && 
      <div id="customBankNameCon" className="customBankNameInputBlock">
        <Input
          key="customBankName"
          required="false"
          inputId="customBankName"
          name="customBankName"
          onChange={(e) => onCustomBankChange(e, undefined)}
          placeholder="Enter Bank Name"
          type="text"
          className="customBankNameInput"
          containerClassName="customBankNameInputCon"
          outerContainerClassName="customBankNameInputOuterCon"
          inputOuterContainerClassName="customBankNameInputOuterMainCon"
          value={newValue}
          maxCheracterLimit={100}
          hideErrorMsg={true}
        />
      </div>
      }
      
      {customBankNames.length < 5 && 
      <SingleButton
          key="customBanksPlusBtn"
          buttonId="customBanksPlusBtn"
          containerClassName="customBankAddBtnCon"
          buttonClassName="highlightsPlusBtn"
          onSubmit={()=>onAddingCustumBanks("ADD", undefined)}
          title="+ Click to add more Banks"
      />
      }

      <p id="customBanksErrMsg" className="highlitesMaxLimitErrMsg customBanksErrMsg"></p>

      <BroucherUploadingBlock
          file={file}
          fileUrl={fileUrl}
          onChange={onChange} 
          onRemoveImage={onRemoveImage} 
          onImagePopup={onImagePopup}
          phaseArray={phaseArray}
          onUploadPhaseBroucher={onUploadPhaseBroucher}
          data={data}
      />

      <h3 id="projectDetailsFAQsBlock" className="whyBuyThisProjectHeadings">Frequently Asked Questions</h3>
      <p className="bankDetailsHeadingContent">
        Include concise FAQ question and answer when sharing details
      </p>
      <p className="faqsBottonContent">“ We Recommend you to add question and answer” </p>

      {filterArray.map((eachObj, index) => {
        if (eachObj.isDeleted !== "Y") {

          return (
            <div key={`FAQS_${index}`} className="faqQuesAndAnsCon">
              <h2 id={`faq_heading_${index}`} className="faqQuestionHeading">Question {index + 1}</h2>
              <TextAreaFieldEl
                key={`faqQuestion_${index}`}
                required="false"
                inputId={`faqQuestion_${index}`}
                name="faqQuestion"
                capital={"F"}
                onChange={(e) => onchangeFaqs(e, index)}
                placeholder="Start writing from here..."
                className="faqQuestionInput"
                containerClassName="faqQuestionInputCon"
                inputOuterContainerClassName="faqQuestionInputOuterCon"
                label="Add your Question here"
                labelClassName="faqQuestionInputLable"
                rows="1"
                cols="50"
                value={eachObj.faqQuestion !== undefined ? eachObj.faqQuestion : ""}
              />

              <TextAreaFieldEl
                key={`faqAnswer_${index}`}
                required="false"
                inputId={`faqAnswer_${index}`}
                name="faqAnswer"
                capital={"F"}
                onChange={(e) => onchangeFaqs(e, index)}
                placeholder="Start writing from here..."
                className="faqQuestionInput faqAnswerInput"
                containerClassName="faqAnswerCon"
                inputOuterContainerClassName="faqAnswerOuterCon"
                label="Add your Answer  here"
                labelClassName="faqQuestionInputLable"
                rows="2"
                cols="50"
                value={eachObj.faqAnswer !== undefined ? eachObj.faqAnswer : ""}
              />

              <p className="faqsPointsCount"
                style={{
                  color:
                  eachObj.faqAnswer !== undefined && eachObj.faqAnswer.length > 1000
                    ? "#F00"
                    : "#98A5B8",
                }}
              >
                {eachObj.faqAnswer !== undefined && eachObj.faqAnswer.length > 1000 
                  ? "Your text count should not exceed 1000 Characters"
                  : `Maximum ${eachObj.faqAnswer !== undefined &&
                    eachObj.faqAnswer.length !== undefined && 
                    eachObj.faqAnswer.length > 0 ? `${eachObj.faqAnswer.length} /` : "" }1000 characters `}
              </p>

              <div className="faqQuestionBtnsCon">
                <SingleButton
                  key={`removeFaqQuestion_${index}`}
                  buttonId={`removeFaqQuestion_${index}`}
                  buttonClassName="highlightsPlusBtn"
                  onSubmit={() => addMoreFaqs("REMOVE", index)}
                  title="Remove"
                />
                
              </div>
              <p
                id={`addNewfaqErrMsg_${index}`}
                className="highlitesMaxLimitErrMsg faqsErrMsg"
              ></p>
            </div>
          );
        }
      })}


      {/* Questions and answer block */}
        {nonDeletelength < 10 &&
        <div className="faqQuesAndAnsCon">
          <h2 className="faqQuestionHeading">Question { nonDeletelength + 1}</h2>
          <TextAreaFieldEl
            key={`faqQuestion`}
            required="false"
            inputId={`faqQuestion`}
            name="faqQuestion"
            capital={"F"}
            onChange={(e) => onchangeFaqs(e, undefined)}
            placeholder="Start writing from here..."
            className="faqQuestionInput"
            containerClassName="faqQuestionInputCon"
            inputOuterContainerClassName="faqQuestionInputOuterCon"
            label="Add your Question here"
            labelClassName="faqQuestionInputLable"
            rows="1"
            cols="50"
            value={faqsObj.faqQuestion !== undefined ? faqsObj.faqQuestion : ""}
          />

          <TextAreaFieldEl
            key={`faqAnswer`}
            required="false"
            inputId={`faqAnswer`}
            name="faqAnswer"
            capital={"F"}
            onChange={(e) => onchangeFaqs(e, undefined)}
            placeholder="Start writing from here..."
            className="faqQuestionInput faqAnswerInput"
            containerClassName="faqAnswerCon"
            inputOuterContainerClassName="faqAnswerOuterCon"
            label="Add your Answer  here"
            labelClassName="faqQuestionInputLable"
            rows="2"
            cols="50"
            value={faqsObj.faqAnswer !== undefined ? faqsObj.faqAnswer : ""}
          />

          <div className="highlitesMaxLimitErrMsgDisplayCon">
            <p id="addNewfaqErrMsg" className="highlitesMaxLimitErrMsg faqsErrMsg"></p>
          
            <p className="faqsPointsCount"
              style={{
                color:
                faqsObj.faqAnswer !== undefined && faqsObj.faqAnswer.length > 1000
                  ? "#F00"
                  : "#98A5B8",
              }}
            >
              {faqsObj.faqAnswer !== undefined && faqsObj.faqAnswer.length > 1000 
                ? "Your text count should not exceed 1000 Characters"
                : `Maximum ${faqsObj.faqAnswer !== undefined &&
                  faqsObj.faqAnswer.length !== undefined &&
                  faqsObj.faqAnswer.length > 0 ? `${faqsObj.faqAnswer.length} /` : "" }1000 characters `}
            </p>
          </div>

          <SingleButton
              key="addFaqQuestion"
              buttonId="addFaqQuestion"
              containerClassName="faqQuestionBtnsCon"
              buttonClassName="highlightsPlusBtn"
              onSubmit={() => addMoreFaqs("SAVE")}
              title="+ Click to add more FAQ’s"
          />
          
        </div>
        }
      
    </Fragment>
  );
}
