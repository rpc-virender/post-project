import React, { Fragment } from 'react'
import Dropdown from '../../commonComponents/Dropdown'
import Input from '../../commonComponents/Input'
import SingleButton from '../../commonComponents/SingleButton'
import { DeleteIcon } from '../../images/commonSvgs'

export default function PhaseDetailsBox({ NoOfPhase, each, ind, onSequenceChange, onChnagePhasesinputs, getDateValues, sequenceArray, onDeletePhase, commonData }) {
    return (
        <Fragment>
            <div id={`allPhasesCon_B_${ind}`} className="allPricingPropBoxsConInDropdownACRMAXMIN">
                <div className="flexsPhasesContainerfomain">
                    {NoOfPhase > 1 &&
                    <div className="DatePhases_container">
                        <p className="pricingLableACRMAXMINForDate ">Which Phase is this?<span className="requiredStar">*</span></p>
                        <Dropdown
                            key={`sequense_${ind}`}
                            required = "true"
                            inputId={`sequense_${ind}`}
                            name="sequence"
                            onChange={(e) => onSequenceChange(e, ind)}
                            placeholder="Select Phase Sequence"
                            className="forallclassnamewidth"
                            containerClassName= "pricingInputClassInputConACRMAXMIN"
                            inputOuterContainerClassName="phaseSequenceFieldOuterCon"
                            dropdownArray={sequenceArray}
                            value={each && each.sequence !== undefined && each.sequence !== null ? each.sequence : ''}  
                        />
                    </div>
                    }
                
                    <div className="DatePhases_container ">
                        <p className="pricingLableACRMAXMINForDate ">Phase Name {NoOfPhase === 1 ? "" :<span className="requiredStar">*</span> }</p>
                        <Input
                            key={`PhaseName${ind}`}
                            required={NoOfPhase === 1 ? "false" : "true"}
                            inputId={`PhaseName${ind}`}
                            name="phaseName"
                            capital={"A"}
                            onChange={(e) => onChnagePhasesinputs(e.target.value, e.target.id, "PN")}
                            placeholder="Enter Phase Name"
                            type="text" 
                            className="forallclassnamewidth"
                            containerClassName="pricingInputClassInputConACRMAXMIN"
                            inputOuterContainerClassName="pricingInputClassInputOuterConACRMAXMIN raraFields phaseDetailsBoxPhasenameEl"
                            outerContainerClassName="pricingInputInputSecondOuterConACRMAXMIN"
                            compnayDetailsErrorMsg="newLaunchDtaeErrMsgClass"
                            value={each.phaseName !== undefined && each.phaseName != null ? each.phaseName : ""}
                            maxCheracterLimit={100}
                        />
                    </div>

                
                    <div id="flatpickr-container" className="DatePhases_container">
                        <p className="pricingLableACRMAXMINForDate ">RERA Start Date<span className="requiredStar">*</span></p>
                        <Input
                            key={`LanuchDate_phaseing${ind}`}
                            required="true"
                            inputId={`LanuchDate_phaseing${ind}`}
                            name="launchDate"
                            placeholder="Select Date"
                            type="text"
                            className="forallclassnamewidth"
                            containerClassName="pricingInputClassInputConACRMAXMIN"
                            inputOuterContainerClassName="pricingInputClassInputOuterConACRMAXMIN phaseDetailsBoxDatesEl"
                            outerContainerClassName="pricingInputInputSecondOuterConACRMAXMIN"
                            compnayDetailsErrorMsg="newLaunchDtaeErrMsgClass"
                            value={getDateValues(each,"L") }
                        />
                    </div>

                    <div className="DatePhases_container">
                        <p className="pricingLableACRMAXMINForDate ">RERA End Date<span className="requiredStar">*</span></p>
                        <Input
                            key={`possassionDate_phaseing${ind}`}
                            required="true"
                            inputId={`possassionDate_phaseing${ind}`}
                            name="possassionDate"
                            placeholder="Select Date"
                            type="text"
                            className=" forallclassnamewidth"
                            containerClassName="pricingInputClassInputConACRMAXMIN"
                            inputOuterContainerClassName="pricingInputClassInputOuterConACRMAXMIN phaseDetailsBoxDatesEl"
                            outerContainerClassName="pricingInputInputSecondOuterConACRMAXMIN"
                            compnayDetailsErrorMsg="newLaunchDtaeErrMsgClass"
                            value={getDateValues(each,"P")}
                        />
                    </div>

                    <div className="DatePhases_container">
                        <p className="pricingLableACRMAXMINForDate CompletionDateCheckBoxAndLable">
                            <Input
                                key={`CompletionDateCheckBox_${ind}`}
                                required="false"
                                inputId={`completionDateCheckBox_${ind}`}
                                name="completionDateCheckBox"
                                onChange={(e)=>onSequenceChange(e, ind)}
                                inputOuterContainerClassName="completionDateCheckBoxCon"
                                type="checkbox"
                                className="completionDateCheckBox"
                                value={ind}
                            />
                            Expected Completion Date
                        </p>
                        <Input
                            key={`expectedCompletion${ind}`}
                            required="false"
                            inputId={`expectedCompletion${ind}`}
                            name="expectedCompletion"
                            placeholder="Select Date(Optional)"
                            type="text"
                            className="forallclassnamewidth"
                            containerClassName="pricingInputClassInputConACRMAXMIN"
                            inputOuterContainerClassName="pricingInputClassInputOuterConACRMAXMIN phaseDetailsBoxDatesEl"
                            outerContainerClassName="pricingInputInputSecondOuterConACRMAXMIN"
                            compnayDetailsErrorMsg="newLaunchDtaeErrMsgClass"
                            value={getDateValues(each,"E") }
                        />
                    </div>

                    <div className="DatePhases_container">
                        <p className="pricingLableACRMAXMINForDate ">Promotor/legal Name (RERA)</p>
                        <Input
                            key={`phasePromoter_${ind}`}
                            required = "false"
                            inputId={`phasePromoter_${ind}`}
                            name="phasePromoter"
                            placeholder="Enter Promotor/legal Name"
                            onChange={(e) => onSequenceChange(e, ind)}
                            capital={"A"}
                            type="text"
                            className="forallclassnamewidth"
                            containerClassName="pricingInputClassInputConACRMAXMIN"
                            inputOuterContainerClassName="pricingInputClassInputOuterConACRMAXMIN raraFields phaseDetailsBoxPhasenameEl"
                            outerContainerClassName="pricingInputInputSecondOuterConACRMAXMIN"
                            value={each.phasePromoter !== undefined && each.phasePromoter != null && each.phasePromoter !== "" ? each.phasePromoter : ""}  
                            maxCheracterLimit={200}
                        />
                    </div>

                    <div className="DatePhases_container raraFieldsMainCon">
                        <p className="pricingLableACRMAXMINForDate ">RERA Status<span className="requiredStar">*</span></p>
                        <Dropdown
                            key={`rera_status_${ind}`}
                            required = "true"
                            inputId={`rera_status_${ind}`}
                            name="reraStatus"
                            onChange={(e) => onChnagePhasesinputs(e.target.value, e.target.id, "RS")}
                            placeholder="--Select--"
                            type="text"
                            className="forallclassnamewidth"
                            containerClassName= "pricingInputClassInputConACRMAXMIN"
                            inputOuterContainerClassName="pricingInputClassInputOuterConACRMAXMIN raraFields phaseDetailsBoxReraStatusEl"
                            dropdownArray={commonData.rerastatus}
                            value={each.reraStatus !== undefined && each.reraStatus != null ? each.reraStatus : ""}  
                        />
                    </div>

                    {each.reraStatus != undefined && each.reraStatus != null && each.reraStatus !== 103 &&  each.reraStatus !== 104 && 
                    <div className="DatePhases_container raraFieldsMainCon">
                        <p className="pricingLableACRMAXMINForDate ">{each.reraStatus !== undefined && each.reraStatus != null && each.reraStatus === 102 ? "RERA Ack. No." : "RERA ID"}<span className="requiredStar">*</span></p>
                        <Input
                            key={`rera_id_${ind}`}
                            required="true"
                            inputId={`rera_id_${ind}`}
                            name="reraId"
                            onChange={(e) => onChnagePhasesinputs(e.target.value, e.target.id, "RI")}
                            placeholder={`${each.reraStatus !== undefined && each.reraStatus != null && each.reraStatus === 102 ? "RERA Acknowledgement no." : "RERA ID"}`}
                            type="text"
                            className="forallclassnamewidth"
                            containerClassName="pricingInputClassInputConACRMAXMIN"
                            inputOuterContainerClassName="pricingInputClassInputOuterConACRMAXMIN raraFields phaseDetailsBoxReraIdEl"
                            outerContainerClassName="pricingInputInputSecondOuterConACRMAXMIN"
                            compnayDetailsErrorMsg="newLaunchDtaeErrMsgClass"
                            value={each.reraId !== undefined && each.reraId != null ? each.reraId : ""}
                            maxCheracterLimit={50}
                        />
                    </div>
                    }
                </div>

                <div className="pricingPropBoxHeadingACRMAXMINFirstcon projectPhasesTopHeadingCon">                                        
                    {Object.keys(each).length > 1 &&
                    <SingleButton
                        key={`projPhaseClearBtn_${ind + 1}`}
                        buttonId={`projPhaseClearBtn_${ind + 1}`}
                        name="clear"
                        containerClassName="projPhaseDeleteBtnCon projPhaseClearBtnCon"
                        buttonClassName="projPhaseDeleteBtn"
                        onSubmit={(e)=>onDeletePhase(e, each, ind)}
                        title="Clear"
                    />
                    }

                    {NoOfPhase > 1 &&
                    <SingleButton
                        key={`projPhaseDeleteBtn_${ind + 1}`}
                        buttonId={`projPhaseDeleteBtn_${ind + 1}`}
                        name="phaseDelete"
                        containerClassName="projPhaseDeleteBtnCon"
                        buttonClassName="projPhaseDeleteBtn"
                        onSubmit={(e)=>onDeletePhase(e, each, ind)}
                        title="Delete"
                        icon={<DeleteIcon iconColor="#F00" />}
                    />
                    }                                        
                </div>
            </div>

            <p id={`phaseDetailsBoxErrorMsg_${ind}`} style={{display:"none"}} className="phaseBoxErrorMessage">Duplicate Sequences are Present in Phase Please Change</p>
        </Fragment>
    )
};
