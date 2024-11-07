import React from 'react'
import { EditIcon, PopupCrossMark } from '../../images/commonSvgs'
import SingleButton from '../../commonComponents/SingleButton'

export default function EditDetailsPopup({onSelect, type, status}) {

    const onMainConClick = (e) => {
        var boxEl = document.getElementById("editPopupInnerContainer");
    
        if (boxEl && !boxEl.contains(e.target)){
            onSelect("close");
        }
    };

    return (
        <div className="projectAdminPreviewStaticCon" onClick={(e)=>onMainConClick(e)}>
                <div id='editPopupInnerContainer' className="floorplanDetailsPopupInnerCon editPopupMainContainer">

                    <PopupCrossMark id="editPopupCrossIcon" key="editPopupCrossIcon" className="editPopupBtnsCrossIcon" onClick={()=>onSelect("close")} />

                    <h2 className='editPopupMainHeading'>Are you sure you want to edit {status ? "Approved" : ""} {type}?</h2>

                    {status &&
                    <h3 className='editPopupDescription'>Note: After editing the approved {type} will go under review and marked as pending.</h3>
                    }
                    
                    <div className="editPopupBtnsContainer">
                        <SingleButton
                            key={`editPopupCancelBtn_`}
                            buttonId={`editPopupCancelBtn`}
                            containerClassName=""
                            buttonClassName="editPopupBtns"
                            onSubmit={()=>onSelect("cancel")}
                            title="Cancel"
                            icon=""
                            toolTip="Click To Cancel"
                        />

                        <SingleButton
                            key={`editPopupEditBtn_`}
                            buttonId={`editPopupEditBtn`}
                            containerClassName=""
                            buttonClassName="editPopupBtns editPopupEditBtn"
                            onSubmit={()=>onSelect("edit")}
                            title="Continue Edit"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
                                    <path d="M0.604302 19.8947L23.3374 19.9667L23.3322 21.5905L0.599159 21.5185L0.604302 19.8947ZM19.6464 6.15262C20.2979 5.50516 20.301 4.53088 19.6536 3.87931L16.74 0.947231C16.0925 0.295657 15.1183 0.292572 14.4667 0.940031L2.24969 13.0799L2.23324 18.276L7.42937 18.2925L19.6464 6.15262ZM15.5997 2.08028L18.5133 5.01236L16.0699 7.44034L13.1563 4.50826L15.5997 2.08028ZM3.86217 16.6574L3.87143 13.7345L12.0161 5.64131L14.9297 8.57339L6.78499 16.6666L3.86217 16.6574Z" fill="white"/>
                                </svg>}
                            toolTip="Click To Edit"
                        />
                    </div>
                </div>
        </div>
    )
}
