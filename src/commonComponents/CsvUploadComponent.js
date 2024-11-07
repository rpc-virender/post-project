import React from 'react'
import SingleButton from './SingleButton'
import {formatBytes, csvLoader } from '../images/commonImages'
import CsvInstructionsBox from './CsvInstructionsBox';
import SimpleSuccessPopup from './SimpleSuccessPopup';
import { PopupCrossMark } from '../images/commonSvgs';

export default function CsvUploadComponent({onCsvFunction, csvFile, selectedPhase, phaseArray, csvUploadRes, seeMore, setSeeMore, showAndHidePopper }) {

  const getPhaseName = (phaseId) => {
    for (let item of phaseArray) {
        if (item.phaseId == phaseId) {
            let name = ""
            name = phaseArray.length > 1 && item.phaseName !== null ? !item.phaseName.toLowerCase().includes("phase") ? `Phase ${item.phaseName}` : item.phaseName : "";
            return name;
        }
    }
  };

  const overrideEventDefaults = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDropFun = (dargged) => {
    if (dargged != undefined && dargged != null) {
      dargged.preventDefault();
      dargged.stopPropagation();
      let files = dargged.dataTransfer.files;
      let f = files[0];

      let allowedExtensions = /(\.csv)$/i
        
      if (allowedExtensions.test(f.name) == true) {

        onCsvFunction("upload", { target: { files: files } });
      }
    }
  };


  const onMainConClick = (e) => {

    var boxEl = document.getElementById("csvUploadPopupInnerBox");

    if (boxEl && !boxEl.contains(e.target)){
        onCsvFunction("close");
    }
};

  return (
    <div className="imagesConPopupStaticCon" onClick={(e)=> !csvUploadRes.loader ? onMainConClick(e) : ("")}>
{/* Upload csv Block */}
        {!csvUploadRes.response &&
        <div id='csvUploadPopupInnerBox' className="imagesPopupinnerPopupCon csvPopupInnerPopupCon">
            <div className="headingAndCrossCon csvPopupHeadingAndCrossCon">
                <h3>Upload CSV</h3>
                {!csvUploadRes.loader &&
                <PopupCrossMark id="csvCrossIcon" key="csvCrossIcon" className="imagesPopupCrossIcon" onClick={()=>onCsvFunction("close")} />
                }
            </div>

            <div 
                className="cvgPopupBottomCon"
                onDrop={(e) => onDropFun(e)}
                onDragEnter={overrideEventDefaults}
                onDragLeave={overrideEventDefaults}
                onDragOver={overrideEventDefaults}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="83" height="82" viewBox="0 0 83 82" fill="none">
                    <path d="M55.3307 54.5L41.4974 41L27.6641 54.5" stroke="black" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M41.5 41V71.375" stroke="black" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M70.513 62.5658C73.8861 60.7712 76.5507 57.9315 78.0863 54.4949C79.622 51.0583 79.9412 47.2204 78.9936 43.5871C78.046 39.9538 75.8855 36.7319 72.8532 34.4299C69.8208 32.1279 66.0893 30.877 62.2476 30.8745H57.8901C56.8433 26.9232 54.8923 23.2549 52.1837 20.1454C49.4751 17.0358 46.0794 14.566 42.2519 12.9216C38.4244 11.2771 34.2647 10.5009 30.0855 10.6511C25.9063 10.8014 21.8165 11.8743 18.1233 13.7891C14.4302 15.704 11.23 18.411 8.76317 21.7066C6.29638 25.0022 4.62724 28.8007 3.88124 32.8165C3.13525 36.8322 3.3318 40.9608 4.45613 44.8918C5.58047 48.8227 7.60332 52.4538 10.3726 55.512" stroke="black" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M55.3307 54.5L41.4974 41L27.6641 54.5" stroke="black" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <p>Select a file or drag and drop here</p>
                <span className='cvgPopupUploadContant'>Only CSV file can be uploaded {csvFile === null ? 
                <CsvInstructionsBox 
                    key="propCsvInstruction" 
                    id="csvInTwo" 
                    seeMore={seeMore} 
                    setSeeMore={setSeeMore} 
                    showAndHidePopper={showAndHidePopper} 
                /> 
                : ""}</span>

                {csvUploadRes.csvErrorMsg !== "" &&
                <p className='csvErrorMsg'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 17C12.2833 17 12.521 16.904 12.713 16.712C12.905 16.52 13.0007 16.2827 13 16C12.9993 15.7173 12.9033 15.48 12.712 15.288C12.5207 15.096 12.2833 15 12 15C11.7167 15 11.4793 15.096 11.288 15.288C11.0967 15.48 11.0007 15.7173 11 16C10.9993 16.2827 11.0953 16.5203 11.288 16.713C11.4807 16.9057 11.718 17.0013 12 17ZM11 13H13V7H11V13ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88334 20.6867 5.825 19.9743 4.925 19.075C4.025 18.1757 3.31267 17.1173 2.788 15.9C2.26333 14.6827 2.00067 13.3827 2 12C1.99933 10.6173 2.262 9.31733 2.788 8.1C3.314 6.88267 4.02633 5.82433 4.925 4.925C5.82367 4.02567 6.882 3.31333 8.1 2.788C9.318 2.26267 10.618 2 12 2C13.382 2 14.682 2.26267 15.9 2.788C17.118 3.31333 18.1763 4.02567 19.075 4.925C19.9737 5.82433 20.6863 6.88267 21.213 8.1C21.7397 9.31733 22.002 10.6173 22 12C21.998 13.3827 21.7353 14.6827 21.212 15.9C20.6887 17.1173 19.9763 18.1757 19.075 19.075C18.1737 19.9743 17.1153 20.687 15.9 21.213C14.6847 21.739 13.3847 22.0013 12 22Z" fill="#FF0000"/>
                    </svg>
                    {csvUploadRes.csvErrorMsg}
                </p>
                }

                {csvFile !== null && csvUploadRes.csvErrorMsg === "" &&
                <div className='csvPopupUploadedFileCon'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M7 11H12M7 13H14M7 15H10M17 16V9L12 4H7C6.46957 4 5.96086 4.21071 5.58579 4.58579C5.21071 4.96086 5 5.46957 5 6V16C5 16.5304 5.21071 17.0391 5.58579 17.4142C5.96086 17.7893 6.46957 18 7 18H15C15.5304 18 16.0391 17.7893 16.4142 17.4142C16.7893 17.0391 17 16.5304 17 16Z" stroke="#0073C6" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 4V7C12 7.53043 12.2107 8.03914 12.5858 8.41421C12.9609 8.78929 13.4696 9 14 9H17" stroke="#0073C6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <p className='csvPopupUploadedFile'>{csvFile.name != undefined ? csvFile.name : "" }-<span className='csvPopupUploadedPhaseName'>{getPhaseName(selectedPhase)}</span> <span>({formatBytes(csvFile.size)})</span></p>
                    
                    {!csvUploadRes.loader &&
                    <svg className='csvPopupFileBinIcon' xmlns="http://www.w3.org/2000/svg" onClick={()=>onCsvFunction("remove")} width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M11.9972 6.76555L11.9735 14.2464L5.98885 14.2274L6.01254 6.74659L11.9972 6.76555ZM10.8893 2.27349L7.14888 2.26164L6.39843 3.00735L3.78013 2.99906L3.77539 4.49523L14.2486 4.5284L14.2533 3.03223L11.635 3.02394L10.8893 2.27349ZM13.4981 5.27412L4.52111 5.24569L4.49268 14.2227C4.49007 15.0456 5.16121 15.721 5.98411 15.7236L11.9688 15.7426C12.7917 15.7452 13.4671 15.074 13.4697 14.2511L13.4981 5.27412Z" fill="#FF0000"/>
                    </svg>
                    }
                </div>
                }

                {!csvUploadRes.loader &&
                <div className='csvPopupUploadBtnsCon'>
                    {csvFile !== null &&
                    <SingleButton
                        key="csvSubmitPopupUploadBtn"
                        buttonId="csvSubmitPopupUploadBtn"
                        containerClassName=""
                        buttonClassName="csvPopupUploadBtn"
                        onSubmit={()=>onCsvFunction("submit")}
                        title="Submit"
                    />
                    }

                    <label 
                        htmlFor="fileSelect"
                        className={csvFile === null ? "csvPopupUploadBtn" : "csvUploadSubmitBtn"}
                    >
                        {csvFile === null ? "Upload CSV" : "Replace CSV"}
                    </label>
                </div>
                }

                {csvUploadRes.loader && 
                    <p className='csvLoaderMessege'>
                        <img src={csvLoader} className="csvLoaderimg" alt="" />
                        Please Wait File is Uploading
                    </p>
                }

                <input 
                    id="fileSelect" 
                    type="file" 
                    style={{display:"none"}}
                    accept=".csv" 
                    onChange={(e)=>onCsvFunction("upload", e)}
                    onClick={(e) => e.target.value = ""}
                />

            </div>
        </div>
        }

{/* Success csv Block */}
        {csvUploadRes.response &&
        <SimpleSuccessPopup 
            key="csvSuccessPopup"
            boxId='csvSuccessPopup'
            onFunction={onCsvFunction} 
            contant={`Your CSV of ${csvUploadRes.totalUnits} units has been uploaded successfully and all the data filled in property table`}
            note="*Note: please do upload the floor plans" 
        />
        }
    </div>
  )
}
