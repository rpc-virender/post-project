import React, { Fragment, memo } from 'react'
import Input from '../../commonComponents/Input';
import SingleSelectDropdown2 from '../../commonComponents/SingleSelectDropdown2';
import { reraStatusConst } from '../../images/constant';

const SinglePhaseBox = ({phaseArray, getDateValues, onSequenceChange, dropdownNewSearch, onChnagePhasesinputs, reraStatusList}) => {
    return (
        <Fragment>
            <h2 className="sectionHeading">ID Details</h2>
            <div className="postProjectInputsCon postProjectInputsBottomCon">
                <Input
                    key="launchDate"
                    required = "true"
                    inputId="launchDate"
                    name="launchDate"
                    type="text"
                    className="animatedInput"
                    containerClassName="input-field"
                    inputOuterContainerClassName="PDinputOuterContainerClassName"
                    label2="RERA Start Date"
                    labelClassName2={`animatedLabel ${phaseArray[0] && phaseArray[0].launchDate != undefined && phaseArray[0].launchDate != null ? "latLongInputsLable" : ""}`}
                    compnayDetailsErrorMsg="errMsgPositioningClass"
                    value={getDateValues(phaseArray[0],"L") }
                />

                <Input
                    key="possessionDate"
                    required = "true"
                    inputId="possessionDate"
                    name="possessionDate"
                    type="text"
                    className="animatedInput"
                    containerClassName="input-field"
                    inputOuterContainerClassName="PDinputOuterContainerClassName"
                    label2="RERA End Date"
                    labelClassName2={`animatedLabel ${phaseArray[0] && phaseArray[0].possassionDate != undefined && phaseArray[0].possassionDate != null ? "latLongInputsLable" : ""}`}
                    compnayDetailsErrorMsg="errMsgPositioningClass"
                    value={getDateValues(phaseArray[0],"P") }
                />

                <div className="PDinputOuterContainerClassName">
                    <Input
                        key={`expectedCompletion`}
                        required="false"
                        inputId={`expectedCompletion`}
                        name="expectedCompletion"
                        type="text"
                        className="animatedInput"
                        containerClassName="input-field"
                        inputOuterContainerClassName="expectedCompletionOuterCon"
                        label2="Expected Completion Date (Optional)"
                        labelClassName2={`animatedLabel expectedCompletionLabel ${phaseArray[0] && phaseArray[0].expectedCompletion != undefined && phaseArray[0].expectedCompletion != null && phaseArray[0].expectedCompletion != "" ? "latLongInputsLable" : ""}`}
                        compnayDetailsErrorMsg="errMsgPositioningClass"
                        value={getDateValues(phaseArray[0],"E")}
                    />
                    <p className="completionDateCheckBoxAndBottomText">
                        <Input
                            key={`CompletionDateCheckBox`}
                            required="false"
                            inputId={`completionDateCheckBox`}
                            name="completionDateCheckBox"
                            onChange={(e)=>onSequenceChange(e, 0)}
                            inputOuterContainerClassName="completionDateCheckBoxCon"
                            type="checkbox"
                            className="completionDateCheckBox"
                            value={0}
                            // checked={}
                        />
                        is same as RERA End Date?
                    </p>
                </div>

                <Input
                    key="phasePromoter"
                    required = "false"
                    inputId="phasePromoter"
                    name="phasePromoter"
                    type="text"
                    capital={"A"}
                    onChange={(e) => onSequenceChange(e, 0)}
                    className="animatedInput"
                    containerClassName="input-field"
                    inputOuterContainerClassName="PDinputOuterContainerClassName"
                    label2="Enter Promotor/legal Name"
                    labelClassName2={`animatedLabel ${phaseArray[0] && phaseArray[0].phasePromoter != undefined && phaseArray[0].phasePromoter != null && phaseArray[0].phasePromoter != "" ? "latLongInputsLable" : ""}`}
                    compnayDetailsErrorMsg="errMsgPositioningClass"
                    value={phaseArray[0] && phaseArray[0].phasePromoter != undefined && phaseArray[0].phasePromoter != null ? phaseArray[0].phasePromoter : ""}    
                    maxCheracterLimit={200}
                />

                <SingleSelectDropdown2
                    key="reraStatus"
                    isInputSearch={false}
                    hideSearhInputField="false"
                    required = "true"
                    inputId="reraStatus"
                    name="reraStatus"
                    onChange={dropdownNewSearch}
                    placeholder=""
                    dropdownArray={reraStatusList}
                    className="animatedInput"
                    containerClassName="input-field"
                    inputOuterContainerClassName="PDinputOuterContainerClassName"
                    label2="RERA Status"
                    labelClassName2="animatedLabel"
                    value={phaseArray[0] && phaseArray[0].reraStatus != undefined && phaseArray[0].reraStatus != null ? phaseArray[0].reraStatus : ""}    
                    singleSelectDropdownClassName="singleSelectDropdownCon"
                    singleSelectDropdownItemsClassName="singleSelectDropdownItemsCon"
                    dropdownItemClassName="singleSelectDropdownItem"
                    arrowIconClass="postProjBasicDetailsDropdownArrow"
                />

            {phaseArray[0] && phaseArray[0].reraStatus && phaseArray[0].reraStatus != reraStatusConst.Not_Applied && 
            phaseArray[0].reraStatus != reraStatusConst.Ready_to_Move_or_Not_Applicable &&
                <Input
                    key="reraId"
                    required = "true"
                    inputId="reraId"
                    name="reraId"
                    onChange={(e) => onChnagePhasesinputs(e.target.value, "rera_id_0", "RI")}
                    type="text"
                    className="animatedInput"
                    containerClassName="input-field"
                    inputOuterContainerClassName="PDinputOuterContainerClassName"
                    label2={`${phaseArray[0] != null && phaseArray[0].reraStatus != undefined && phaseArray[0].reraStatus != null && phaseArray[0].reraStatus == 102 ? "RERA Acknowledgement no." : "RERA ID"}`}
                    labelClassName2={`animatedLabel ${phaseArray[0].reraId != undefined && phaseArray[0].reraId != null && phaseArray[0].reraId != "" ? "afterSelectedLableClass" : ""}`}
                    value={phaseArray[0] != null && phaseArray[0].reraId != undefined && phaseArray[0].reraId != null ? phaseArray[0].reraId : ""} 
                    maxCheracterLimit={50}                 
                />
            }
            </div>
        </Fragment>
    )
};

export default memo(SinglePhaseBox);