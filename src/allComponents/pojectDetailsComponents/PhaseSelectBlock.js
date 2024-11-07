import React, { Fragment, memo } from 'react';
import Input from '../../commonComponents/Input';

const PhaseSelectBlock = ({data, onChangePhase, phaseButtonToggle, setPhaseButtonToggle}) => {
    return (
        <Fragment>
            <h2 id="projectDetailsPhaseBlock" className="sectionHeading">Phase<span className="requiredStar">*</span></h2>
            <h3 className="phasesSectionHeading">Select Phase you planning to launch</h3>
            <div className="projectDetailsPhasesRadioCon">
                <Input
                    key="projsingleSelectedRadioField"
                    required = "false"
                    inputId="singleSelectedRadioField"
                    name="phaseCount"
                    onChange={(e)=>{
                        onChangePhase(e);
                        setPhaseButtonToggle("S");
                    }}
                    type="radio"
                    className="phaseRadioInput"
                    containerClassName="phaseRadioInputCon"
                    label2="Single Phase"
                    labelClassName2={`phaseRadioInputLable ${ data != undefined && data.phaseCount != undefined && data.phaseCount == 1 && phaseButtonToggle == "S" ? "selectedPhaseRadioInput" : ""}`}
                    checked={data != undefined && data.phaseCount != undefined && data.phaseCount == 1 && phaseButtonToggle == "S" ? true : false }
                    value={1}             
                />

                <Input
                    key="projmultiSelectedRadioField"
                    required = "false"
                    inputId="multiSelectedRadioField"
                    name="phaseCount"
                    onChange={(e)=>{
                        onChangePhase(e);
                        setPhaseButtonToggle("M");
                    }}
                    type="radio"
                    className="phaseRadioInput"
                    containerClassName="phaseRadioInputCon"
                    label2="Multiple Phase"
                    labelClassName2={`phaseRadioInputLable ${data != undefined && data.phaseCount != undefined && (data.phaseCount == "" || data.phaseCount >= 2 || phaseButtonToggle != "S") ? "selectedPhaseRadioInput" : ""}`}
                    checked={data != undefined && data.phaseCount != undefined && (data.phaseCount == "" || data.phaseCount >= 2 || phaseButtonToggle != "S") ? true : false }
                    value={""}   
                />

                {data != undefined && data.phaseCount != undefined && (data.phaseCount == "" || data.phaseCount >= 2 || phaseButtonToggle != "S") &&
                <Input
                    key="phaseCountElement"
                    required = "true"
                    inputId="NoOfPhase"
                    name="phaseCount"
                    hideErrorMsg={true}
                    onChange={(e)=>{
                        onChangePhase(e);
                        setPhaseButtonToggle(`M-${e.target.value}`);
                    }}
                    placeholder="Add no: of phases"
                    type="number"
                    className="pricingInputClassInDropdownACRMAXMINBtmunderLine"
                    value={data != undefined && data.phaseCount != undefined && data.phaseCount != null ? data.phaseCount : ""}               
                />
                }
            </div>

            <p className="phaseNotificationMsg"> 
                {data != undefined && data.phaseCount != undefined && data.phaseCount == 1 ? 
                "(Select the phase type you are launching and fill in all the details; add numeric value in case of multiple phase )"
                :
                "( Phases will be more than 1 )"
                }
            </p>
        </Fragment>
    )
};

export default memo(PhaseSelectBlock);
