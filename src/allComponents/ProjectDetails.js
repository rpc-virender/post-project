import React, { useEffect, useState, useRef, memo } from "react";
import $ from 'jquery';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

import SingleButton from '../commonComponents/SingleButton';
import { getStatesDetails, getCitiesDetails, getGroupList, getLocalityDetails } from "../apis/cityAndStateApi";
import Loader from '../commonComponents/Loader';
import { convertToPlainText } from "../images/constant";
import TextPad from "../commonComponents/TextPad";
import SinglePhaseBox from "./pojectDetailsComponents/SinglePhaseBox";
import PhaseSelectBlock from "./pojectDetailsComponents/PhaseSelectBlock";
import ProjectAddressBlock from "./pojectDetailsComponents/ProjectAddressBlock";
import ProjectMapBlock from "./pojectDetailsComponents/ProjectMapBlock";
import ProjectBasicDetailsBlock from "./pojectDetailsComponents/ProjectBasicDetailsBlock";
import { convertAllDateToBasic } from "./LoginsignUpValidator";
import PhaseDetailsBox from "./pojectDetailsComponents/PhaseDetailsBox";

const ProjectDetails = ({data, onChange, onChnagePhasesinputs, NoOfPhase, onDeletePhase, setBasicDetails,
                        onChangePhase, phaseArray, setPhaseArray, city, setCities, locality, setLocality, setIsEdit}) => {
	
	const [state,setState] = useState([]);
	const [commonData,setCommonData] = useState([]);
    const [dateRequired , setDateRequired] = useState(false);
    const containerRef = useRef(null);
    const [phaseButtonToggle, setPhaseButtonToggle] = useState("S");

    useEffect(()=>{
        // const container = containerRef.current;
        // const handleScroll = () => {
        //     // .pac-container
        //     let placeDropDownCon = document.getElementsByClassName("pac-container");
        //     if(placeDropDownCon){
        //         if(placeDropDownCon[0].style.display !== "none" ){
        //             placeDropDownCon[0].style.display = "none" 
        //         }
        //     }

        //     if (container) {
        //         // Check if container is scrolled
        //         if (container.scrollTop > 0) {
        //             var launchD = flatpickr("#launchDate", {
        //                                 dateFormat: "d/m/Y",
        //                                 maxDate: phaseArray[0].possassionDate ? new Date(new Date(phaseArray[0].possassionDate.split("/").reverse().join("-"))
        //                                         .getTime() - 24 * 60 * 60 * 1000): null,
        //                                     onChange:function(selectedDates, dateStr, instance){
        //                                     onChnagePhasesinputs(dateStr, "LanuchDate_phaseing0","LD");
        //                                 },
        //                             });
        //             var possessionD = flatpickr("#possessionDate", {
        //                                         dateFormat: "d/m/Y",
        //                                         minDate: phaseArray[0].launchDate ? new Date(new Date(phaseArray[0].launchDate.split("/").reverse().join("-"))
        //                                                 .getTime() + 24 * 60 * 60 * 1000): null,
        //                                         onChange:function(selectedDates, dateStr, instance){
        //                                         onChnagePhasesinputs(dateStr,"possassionDate_phaseing0","PD");

        //                                         let checkboxEl = document.getElementById(`completionDateCheckBox`);
        //                                         if(checkboxEl && checkboxEl.checked === true){
        //                                             onChnagePhasesinputs(dateStr, "expectedCompletion0", "CD");
        //                                         }
        //                                     } 
        //                             });
        //             var expectedCompletionD = flatpickr("#expectedCompletion", {
        //                                 dateFormat: "d/m/Y",
        //                                 minDate: phaseArray[0].launchDate ? new Date(new Date(phaseArray[0].launchDate.split("/").reverse().join("-"))
        //                                         .getTime() + 24 * 60 * 60 * 1000): null,
        //                                 onChange:function(selectedDates, dateStr, instance){
        //                                 onChnagePhasesinputs(dateStr,"expectedCompletion0","CD");
        //                                 let checkboxEl = document.getElementById(`completionDateCheckBox`);
        //                                 if(checkboxEl){
        //                                     checkboxEl.checked = false;
        //                                 }
        //                             } 
        //                             });             
                
        //             if(launchD && launchD.close) launchD.close();
        //             if(possessionD && possessionD.close) possessionD.close();
        //             if(expectedCompletionD && expectedCompletionD.close) expectedCompletionD.close();
                
        //             for(let i=0;i<phaseArray.length;i++) {
        //                 let multiLaunchDatePick = flatpickr(`#LanuchDate_phaseing${i}`, {
        //                                             dateFormat: "d/m/Y",
        //                                             maxDate: phaseArray[i].possassionDate ? new Date(new Date(phaseArray[i].possassionDate.split("/").reverse().join("-"))
        //                                                     .getTime() - 24 * 60 * 60 * 1000): null,
        //                                             onChange:function(selectedDates, dateStr, instance){
        //                                                 onChnagePhasesinputs(dateStr, instance._input.id,"LD")
        //                                             }
        //                                         });

        //                 let multiPossessionDatePick = flatpickr(`#possassionDate_phaseing${i}`, {
        //                                                     minDate: phaseArray[i].launchDate ? new Date(new Date(phaseArray[i].launchDate.split("/").reverse().join("-"))
        //                                                                 .getTime() + 24 * 60 * 60 * 1000): null,
        //                                                     dateFormat: "d/m/Y",
        //                                                     onChange:function(selectedDates, dateStr, instance){
        //                                                         onChnagePhasesinputs(
        //                                                             dateStr, instance._input.id ,"PD");

        //                                                         let checkboxEl = document.getElementById(`completionDateCheckBox_${i}`);
        //                                                         if(checkboxEl && checkboxEl.checked === true){
        //                                                             onChnagePhasesinputs(dateStr,`expectedCompletion${i}`,"CD");
        //                                                         }
        //                                                     }
        //                                                 });

        //                 let expectedCompletionDatePick = flatpickr(`#expectedCompletion${i}`, {
        //                                                     minDate: phaseArray[i].launchDate ? new Date(new Date(phaseArray[i].launchDate.split("/").reverse().join("-"))
        //                                                                 .getTime() + 24 * 60 * 60 * 1000): null,
        //                                                     dateFormat: "d/m/Y",
        //                                                     onChange:function(selectedDates, dateStr, instance){
        //                                                         onChnagePhasesinputs(dateStr, instance._input.id ,"CD");
        //                                                         let checkboxEl = document.getElementById(`completionDateCheckBox_${i}`);
        //                                                         if(checkboxEl){
        //                                                             checkboxEl.checked = false;
        //                                                         }
        //                                                     }
        //                                                 });

        //                 if(multiLaunchDatePick && multiLaunchDatePick.close) multiLaunchDatePick.close();                        
        //                 if(multiPossessionDatePick && multiPossessionDatePick.close) multiPossessionDatePick.close();
        //                 if(expectedCompletionDatePick && expectedCompletionDatePick.close) expectedCompletionDatePick.close();
        //             }
        //         } 
        //     }
        // };

        if(NoOfPhase !== undefined && NoOfPhase !== null && NoOfPhase !== "" && NoOfPhase > 1 && phaseArray !== undefined && phaseArray.length !== undefined && phaseArray.length > 1){
            phaseArray.map((eachPhaseObj, ind)=>{
                if(eachPhaseObj.possassionDate && eachPhaseObj.expectedCompletion && eachPhaseObj.possassionDate == eachPhaseObj.expectedCompletion && eachPhaseObj.isActive !== "N"){
                    let checkboxEl = document.getElementById(`completionDateCheckBox_${ind}`);
                    if(checkboxEl) checkboxEl.checked = true;
                }
            })
        };
        
        if(NoOfPhase !== undefined && NoOfPhase !== null && NoOfPhase !== "" && NoOfPhase === 1 && phaseArray !== undefined && phaseArray.length !== undefined && phaseArray.length > 0){
            if(phaseArray[0].possassionDate && phaseArray[0].expectedCompletion && phaseArray[0].possassionDate === phaseArray[0].expectedCompletion){
                let checkboxEl = document.getElementById(`completionDateCheckBox`);
                if(checkboxEl) checkboxEl.checked = true;
            }
        };

        
        // if (container) {
        //   container.addEventListener("scroll", handleScroll);
        //   return () => {
        //     container.removeEventListener("scroll", handleScroll);
        //   };
        // }
    },[NoOfPhase, phaseArray ,dateRequired, phaseButtonToggle]);

    const [sequenceArray, setSequenceArray] = useState([])

    useEffect(() => {
        if(NoOfPhase !== undefined && NoOfPhase !== null && NoOfPhase !== "" && NoOfPhase > 0){
            let sampleArray = [];
            [...Array(NoOfPhase)].map((x, i) => {
                let obj = { id: i+1, name: `Phase ${i+1}` }
                sampleArray = [...sampleArray, obj];
            });
            setSequenceArray(sampleArray);
        };
            
        flatpickr("#launchDate", {
            dateFormat: "d/m/Y",
            maxDate: phaseArray[0] && phaseArray[0].possassionDate ? new Date(new Date(phaseArray[0].possassionDate.split("/").reverse().join("-"))
                    .getTime() - 24 * 60 * 60 * 1000): null,
            onChange:function(selectedDates, dateStr, instance){
                onChnagePhasesinputs(dateStr, "LanuchDate_phaseing0","LD")
            },
        });
        
        flatpickr("#possessionDate", {
                    dateFormat: "d/m/Y",
                    minDate: phaseArray[0] && phaseArray[0].launchDate ? new Date(new Date(phaseArray[0].launchDate.split("/").reverse().join("-"))
                            .getTime() + 24 * 60 * 60 * 1000): null,
                    onChange:function(selectedDates, dateStr, instance){
					onChnagePhasesinputs(dateStr,"possassionDate_phaseing0","PD");

                    let checkboxEl = document.getElementById(`completionDateCheckBox`)
                    if(checkboxEl && checkboxEl.checked === true){
                        onChnagePhasesinputs(dateStr,"expectedCompletion0","CD");
                    }
				} 
        });

        flatpickr("#expectedCompletion", {
                dateFormat: "d/m/Y",
                minDate: phaseArray[0] && phaseArray[0].launchDate ? new Date(new Date(phaseArray[0].launchDate.split("/").reverse().join("-"))
                        .getTime() + 24 * 60 * 60 * 1000): null,
                onChange:function(selectedDates, dateStr, instance){
                onChnagePhasesinputs(dateStr,"expectedCompletion0","CD");
                let checkboxEl = document.getElementById(`completionDateCheckBox`);
                if(checkboxEl){
                    checkboxEl.checked = false;
                }
            } 
        });

        if(phaseArray[0] !== undefined && phaseArray[0].possassionDate !== undefined && phaseArray[0].expectedCompletion !== undefined && 
            phaseArray[0].possassionDate === phaseArray[0].expectedCompletion
        ){
            let checkboxEl = document.getElementById(`completionDateCheckBox`);
            if(checkboxEl){
                checkboxEl.checked = true;
            }
        };
        

        for(let i=0;i<phaseArray.length;i++) {
        let newAdded=[];
		     flatpickr(`#LanuchDate_phaseing${i}`, {
		        dateFormat: "d/m/Y",
                maxDate: phaseArray[i] && phaseArray[i].possassionDate ? new Date(new Date(phaseArray[i].possassionDate.split("/").reverse().join("-"))
                        .getTime() - 24 * 60 * 60 * 1000): null,
		        onChange:function(selectedDates, dateStr, instance){
					onChnagePhasesinputs(dateStr, instance._input.id,"LD")
				}
		    });

		    flatpickr(`#possassionDate_phaseing${i}`, {
                minDate: phaseArray[i] && phaseArray[i].launchDate ? new Date(new Date(phaseArray[i].launchDate.split("/").reverse().join("-"))
                            .getTime() + 24 * 60 * 60 * 1000): null,
		        dateFormat: "d/m/Y",
		        onChange:function(selectedDates, dateStr, instance){
					onChnagePhasesinputs(dateStr, instance._input.id ,"PD");

                    let checkboxEl = document.getElementById(`completionDateCheckBox_${i}`);
                    if(checkboxEl && checkboxEl.checked === true){
                        onChnagePhasesinputs(dateStr,`expectedCompletion${i}`,"CD");
                    }
				}
		    });

            flatpickr(`#expectedCompletion${i}`, {
                minDate: phaseArray[i] && phaseArray[i].launchDate ? new Date(new Date(phaseArray[i].launchDate.split("/").reverse().join("-"))
                            .getTime() + 24 * 60 * 60 * 1000): null,
		        dateFormat: "d/m/Y",
		        onChange:function(selectedDates, dateStr, instance){
					onChnagePhasesinputs(dateStr, instance._input.id ,"CD");

                    let checkboxEl = document.getElementById(`completionDateCheckBox_${i}`);
                    if(checkboxEl){
                        checkboxEl.checked = false;
                    }
				}
		    });

            if(phaseArray[i] !== undefined && phaseArray[i].possassionDate !== undefined && phaseArray[i].expectedCompletion !== undefined && 
                phaseArray[i].possassionDate === phaseArray[i].expectedCompletion
            ){
                let checkboxEl = document.getElementById(`completionDateCheckBox_${i}`);
                if(checkboxEl){
                    checkboxEl.checked = true;
                }
            };

            newAdded.push(i);
        }

    },[NoOfPhase, phaseArray ,dateRequired ,phaseButtonToggle]);

    // const onDateSelected=(selectedDates, dateStr, instance)=> {
    //   onChange(undefined,instance._input.id,dateStr);
    // }

    const singleSelectRadioField = document.getElementById("singleSelectedRadioField");
    const multiSelectRadioField = document.getElementById("multiSelectedRadioField");

	useEffect(() => {
        if (state !== undefined && state != null && state.length === 0) {
            getStatesDetails(setState);
            getGroupList(setCommonData, ["state", "rerastatus", "projectstatus"]);
        }

        // Commented part
        if(singleSelectRadioField && multiSelectRadioField){
            if (NoOfPhase != null) {
                if (NoOfPhase <= 1) {
                    singleSelectRadioField.checked = true;
                    multiSelectRadioField.checked = false;
                } else {
                    singleSelectRadioField.checked = false;
                    multiSelectRadioField.checked = true;
                }
            }else {
                singleSelectRadioField.checked = true;
                multiSelectRadioField.checked = false;
            }
        }

        setDateRequired(true);
    }, []);
    
	// for cid values
	const dropdownNewSearch = (key,obj) => {
        if(key === "reraStatus"){
            onChnagePhasesinputs(obj.cid,"rera_status_0","RS")
        }else{
            if(obj !== undefined && obj.cid !== undefined && key !== undefined && key != null ){
                if(key === 'state') {
                    getCitiesDetails(setCities,obj.cid);
                }
		    }
		    onChange(null,key,obj.cid);
        }		
	};
	
	// for cid values
	const dropdownNewSearch2 = (key,obj) => {
		if(obj !== undefined && obj.id !== undefined && key !== undefined && key != null ){
			if(key === 'city') {
				getLocalityDetails(setLocality, obj.id);
			}
		}

        if(typeof obj != "object"){
            onChange(null, key, obj);
        }else{
            onChange(null, key, obj.id);
        }
	};

    const getDateValues = (each,identifier) => {
        //using for the landate  and posdat in single phasee component so we are setting the isedit is true (reference)
        setIsEdit(true)
        switch(identifier){
            case "L":
                return (each !== undefined && each.launchDate !== undefined)
			      ? convertAllDateToBasic(each.launchDate) : "";
                break; 
            case "P":
                return (each !== undefined && each.possassionDate !== undefined )
					? convertAllDateToBasic(each.possassionDate) : "" 
                break;
            case "E":
                return (each !== undefined && each.expectedCompletion !== undefined )
					? convertAllDateToBasic(each.expectedCompletion) : "" 
                break; 
            default:
                return ""
        };
    };

    const onSequenceChange = (e, itemIndex)=> {
        let name = e.target.name;
        let value = name === "sequence" ? parseInt(e.target.value) : e.target.value;
        let isChecked = e.target.checked;

        phaseArray.map((_, index)=>{
            $(`#phaseDetailsBoxErrorMsg_${index}`).hide();
            $(`#sequense_${index}`).css("border-color", "");
        });

        if(name === "completionDateCheckBox"){
            if(isChecked){
                if(phaseArray[itemIndex] && phaseArray[itemIndex].possassionDate !== undefined && phaseArray[itemIndex].possassionDate !== null && phaseArray[itemIndex].possassionDate !== "" ){
                    onChnagePhasesinputs(phaseArray[itemIndex].possassionDate, `expectedCompletion${itemIndex}` ,"CD");
                }
            }else{
                onChnagePhasesinputs("", `expectedCompletion${itemIndex}` ,"CD");
            }
        }else{
            setPhaseArray(prev=>{
                let oldPhaseArray = [...prev];
                oldPhaseArray.filter((eachPhase ,ind)=>{ 
                    if(ind === itemIndex) {
                        return eachPhase[name] = value;
                    }else{
                        return eachPhase;
                    }
                });
                return oldPhaseArray;
            });
        }
    };


    return(
        <div id="allPropjectDetailsMainCon" ref={containerRef} className="PropjectDetailsMainCon">
            <ProjectBasicDetailsBlock
                data={data} 
                onChange={onChange}
            />

            <ProjectMapBlock 
                data={data} 
                onChange={onChange} 
                setBasicDetails={setBasicDetails} 
            />

            <ProjectAddressBlock 
                data={data} 
                onChange={onChange} 
                dropdownNewSearch={dropdownNewSearch} 
                dropdownNewSearch2={dropdownNewSearch2} 
                state={state} 
                city={city} 
                locality={locality}
            />              

            <PhaseSelectBlock 
                data={data} 
                onChangePhase={onChangePhase} 
                phaseButtonToggle={phaseButtonToggle} 
                setPhaseButtonToggle={setPhaseButtonToggle}
            />

            {NoOfPhase !== 0 && NoOfPhase !== "" && phaseArray != null && multiSelectRadioField && multiSelectRadioField.checked === true &&
               phaseArray.map((each, ind) => {
                    if (ind < NoOfPhase) {
                        return (
                            <PhaseDetailsBox
                                key={`PhaseDetailsBox_${ind}`}
                                NoOfPhase={NoOfPhase} 
                                each={each} 
                                ind={ind} 
                                onSequenceChange={onSequenceChange} 
                                onChnagePhasesinputs={onChnagePhasesinputs} 
                                getDateValues={getDateValues} 
                                sequenceArray={sequenceArray} 
                                onDeletePhase={onDeletePhase} 
                                commonData={commonData}
                            />
                        )
                    }
                }
            )}
                
			{NoOfPhase !== 0 && NoOfPhase !== "" && parseInt(NoOfPhase) === 1 && singleSelectRadioField && singleSelectRadioField.checked === true &&
			<SinglePhaseBox 
                phaseArray={phaseArray} 
                getDateValues={getDateValues} 
                onSequenceChange={onSequenceChange} 
                dropdownNewSearch={dropdownNewSearch} 
                onChnagePhasesinputs={onChnagePhasesinputs}
                reraStatusList={commonData.rerastatus}
            />
            }
        
            <TextPad 
                key="aboutproject"
                inputId="aboutproject"
                onChange={onChange}
                placeholder="Add some details about your Project"
                label="About Project"
                labelClassName="sectionHeading"
                name="aboutproject"
                value={data.aboutproject !== undefined && data.aboutproject != null ? data.aboutproject : ""} 
                required={true}      
                className="projDetailsTextAreaInputField" 
                maxLimit={5000}         
            />

            {data.aboutproject !== undefined && data.aboutproject.length !== undefined && convertToPlainText(data.aboutproject).length > 5000
                ? <p className="maximumExcedlimiterror">Your text count should not exceed 5000 Characters</p>
                : <p  className="maximumExcedlimit">Maximum {data.aboutproject !== undefined && data.aboutproject.length !== undefined && convertToPlainText(data.aboutproject).length > 0 ? `${convertToPlainText(data.aboutproject).length} / ` : "" }5000 characters</p> 
            }
          
            <div className="bottomBtnsAndErrCon">
                <div id="loaderForProject" className="projDetailsLoader">
                    <Loader message="Please wait for few seconds will redirect you to next page"/>
                </div>

                <p id="finalErrorMsg_basicDetails" style={{display:"none"}} className="validationaErrorMessageForAllPages">Please Fill All The Required Mandatory Fields</p>

                <p id="dupilcateProjectNameErrMsg" style={{display:"none"}} className="validationaErrorMessageForAllPages">
                    Project: {data.projName !== undefined && data.projName != null && data.projName !== "" ? data.projName : "Project Name"} is already exist, Please Contact Our Internal Team.
                </p>
            
                <SingleButton
                    key="projDetailsButton"
                    name="OPEN"
                    buttonId="projDetailsButton"
                    containerClassName="postProjectSubmitButtonMainCon"
                    buttonClassName="postProjectButton"
                    onSubmit={(e)=>onDeletePhase(e)}
                    title="SAVE & CONTINUE"
                />
            </div>
        </div>
    )
};

export default memo(ProjectDetails);