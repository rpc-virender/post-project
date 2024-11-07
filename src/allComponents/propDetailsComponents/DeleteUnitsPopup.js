import React from 'react'
import { PopupCrossMark } from '../../images/commonSvgs';
import { bhkDetails } from '../../images/commonImages';
import SingleButton from '../../commonComponents/SingleButton';

export default function DeleteUnitsPopup({onDeleteUnits, selectedFilteredBhk}) {
    const onMainConClick = (e) => {
        var baxEl = document.getElementById("deleteUnitsPopupInnerCon");
        if (baxEl && !baxEl.contains(e.target)){
            onDeleteUnits("cancel");
        }
    };

    return (
        <div className="imagesConPopupStaticCon" onClick={(e)=>onMainConClick(e)}>
            <div id='deleteUnitsPopupInnerCon' className="imagesPopupinnerPopupCon deleteUnitsInnerPopupCon">
                <PopupCrossMark id="deletePopupCrossIcon" key="deletePopupCrossIcon" className="csvPopupSuccessCrossIcon" onClick={()=>onDeleteUnits("cancel")} />

                <h2>Are you sure?</h2>
                <p>Are you sure you want to delete {
                    selectedFilteredBhk !== null ? 
                    selectedFilteredBhk < 100000 && bhkDetails && bhkDetails.get(parseInt(selectedFilteredBhk)) && bhkDetails.get(parseInt(selectedFilteredBhk)).name ? 
                    `${bhkDetails.get(parseInt(selectedFilteredBhk)).name} units ` : "Custom units " : "All the units "
                    } ? This action cannot be undone.
                </p>

                <div className='csvPopupUploadBtnsCon'>
                    <SingleButton
                        key="csvCancelPopupUploadBtn"
                        buttonId="csvCancelPopupUploadBtn"
                        buttonClassName="csvUploadSubmitBtn"
                        onSubmit={()=>onDeleteUnits("cancel")}
                        title="Cancel"
                    />

                    <SingleButton
                        key="csvPopupUploadBtn"
                        buttonId="csvPopupUploadBtn"
                        buttonClassName="csvPopupUploadBtn"
                        onSubmit={()=>onDeleteUnits("delete")}
                        title={`Delete ${
                            selectedFilteredBhk !== null ? 
                            selectedFilteredBhk < 100000 && bhkDetails && bhkDetails.get(parseInt(selectedFilteredBhk)) && bhkDetails.get(parseInt(selectedFilteredBhk)).name ? 
                            `${bhkDetails.get(parseInt(selectedFilteredBhk)).name} units ` : "Custom units " : "All the units "}`
                        }
                    />
                </div>
            </div>
        </div>
    )
}
