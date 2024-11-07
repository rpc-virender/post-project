import React from 'react'
import { PopupCrossMark } from '../../images/commonSvgs';
import SingleButton from '../../commonComponents/SingleButton';

export default function DeletePhasesPopup({onSelect}) {

    const onMainConClick = (e) => {
        var boxEl = document.getElementById("deletePhasesPopupInnerCon");
    
        if (boxEl && !boxEl.contains(e.target)){
            onSelect("CLOSE");
        }
    };

    return (
        <div className="projectAdminPreviewStaticCon" onClick={(e)=>onMainConClick(e)}>
                <div id='deletePhasesPopupInnerCon' className="floorplanDetailsPopupInnerCon editPopupMainContainer">

                    <PopupCrossMark id="phasePopupCrossIcon" key="phasePopupCrossIcon" className="editPopupBtnsCrossIcon" onClick={()=>onSelect({target: {name: "CLOSE"}})} />

                    <h2 className='editPopupMainHeading'>Are you sure you want to Delete Phases</h2>
                    
                    <div className="editPopupBtnsContainer">
                        <SingleButton
                            key={`phasePopupCancelBtn`}
                            buttonId={`phasePopupCancelBtn`}
                            name="NO"
                            containerClassName=""
                            buttonClassName="editPopupBtns"
                            onSubmit={(e)=>onSelect(e)}
                            title="Cancel"
                        />

                        <SingleButton
                            key={`phasePopupDeleteBtn`}
                            buttonId={`phasePopupDeleteBtn`}
                            name="YES"
                            containerClassName=""
                            buttonClassName="editPopupBtns editPopupEditBtn"
                            onSubmit={(e)=>onSelect(e)}
                            title="Delete"
                        />
                    </div>
                </div>
        </div>
    )
}
