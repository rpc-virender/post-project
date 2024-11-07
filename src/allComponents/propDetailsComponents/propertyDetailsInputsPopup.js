import React, {useState, useEffect} from "react";
import '../../styles/projectPropertyDetailsPopup.css';

import Dropdown from '../../commonComponents/Dropdown';
import Input from '../../commonComponents/Input';
import NewMediaUploadBox from '../../commonComponents/NewMediaUploadBox';
import SingleButton from '../../commonComponents/SingleButton';
import { PopupCrossMark } from "../../images/commonSvgs";
import { formatPriceToCommaPrice, projectprops } from "../../images/commonImages";
import { getUnit } from "../../images/constant";


const PropertyDetailsInputsPopup = ({onValuesChange, rows, floors, bathRooms, bhktypeData, singleRow, onUploadBtnClick, onRemoveImage, 
                                    openParking, groundFloors, identifier, title, onButtonClick, floorplanImageFile, 
                                    floorplanImgUrl, onImagePopup,closeEditPopUp, idValidatar,
                                    towers,towercount,selectedPhase, basementFloors, apartmentTypeList}) => {

    const [towerList,setTowerList]=useState([]);
    const [towerFloor,setTowerFloor] = useState(rows);

    const formatChange = (event) => {
        const { value: inputValue } = event.target;
        event.target.value = formatPriceToCommaPrice(inputValue);
        let val = event.target.value.replace(/\,/g,'');
        onValuesChange({target: {value: val === "" ? "" : val, id: event.target.id, name: event.target.name } });
    };

    useEffect(() => {
        if(towercount != null && towers != null && towers.length !== 0 && selectedPhase != null) {
            let tow=[];
            let count=0;
            for (let i = 0; i < towers.length && count<towercount; i++) {
                let t=towers[i];
                if(t.propType === identifier && t.towerId != null && t.phaseId === selectedPhase) {
                    count++;
                    tow.push({"id":t.towerId,"name":t.towerName});
                }
            }
            setTowerList(tow);
        }

        if(towercount === 1){
            setTimeout(()=>{
                onTowerSelect({target: {value: towers[0].towerId}})
            }, 200);
        };
    },[towers,identifier,towercount,selectedPhase]);

    useEffect(() => {
        if(singleRow !== undefined && singleRow != null && singleRow.tower !== undefined) {
            if(identifier === projectprops.apartment || identifier === projectprops.villament) {
                //singleRow.tower
                let selectedId=singleRow.tower;
                let tow={};
                towers.forEach((each) => {
                    if(each.towerId === selectedId) {
                        tow=each;
                    }
                });
                
    
                if(tow !== undefined && tow != null && tow.towerId !== undefined && tow.towerId != null) {
                    let flo=tow.totalFloor;
                    let arr=[];
                    // let i = (tow.elevationGround != undefined && tow.elevationGround != null) || (tow.groundAndStilt != undefined && tow.groundAndStilt != null) ? 0 : 1;
                    let i = 0 ;
                    for(i;i<=flo;i++) {
                        arr.push(i);
                    }
                    setTowerFloor(arr);
                }  
            }
        };
    },[singleRow, towers]);

    const onTowerSelect = (e) => {
        if(identifier === projectprops.apartment || identifier == projectprops.villament) {
            //singleRow.tower
            let selectedId=e.target.value;
            let tow={};
            towers.forEach((each) => {
                if(each.towerId === selectedId) {
                    tow = each;
                }
            });

            if(tow !== undefined && tow != null && tow.towerId !== undefined && tow.towerId != null) {
                let flo=tow.totalFloor;
                let arr=[];
                // let i = (tow.elevationGround != undefined && tow.elevationGround != null) || (tow.groundAndStilt != undefined && tow.groundAndStilt != null) ? 0 : 1;
                let i = 0 ;
                for(i;i<=flo;i++) {
                    arr.push(i);
                }
                setTowerFloor(arr);
            }
        }
        onValuesChange(e);
    };

    const onValuesChangeParking = (e) => {
        onValuesChange(e);
        if(e.target.value == 0) {
            let event = {
                target : {
                    value:"parkingType",
                    name:"none"
                }
            }

            onValuesChange(event);
        }  
    };

    let elevationsArray = (identifier == projectprops.rowHouse || identifier == projectprops.villa) ? 
                        singleRow.isBasement != undefined && singleRow.isBasement == "Y" && basementFloors != undefined && basementFloors.length > 0  ? 
                        basementFloors : groundFloors : towerFloor

    const showCheckboxes = (event) => {
        var checkboxes = document.getElementById(`checkboxes_${identifier}`);
        if(checkboxes){
            if (checkboxes.style.display == "none") {
                checkboxes.style.display = "block";
            } else {
                checkboxes.style.display = "none";
            }
        };
        if(event){
            onValuesChange(event);
        };
    };

    const onMainConClick = (e) => {
        // var boxEl = document.getElementById("projectDetailsInnerPopupCon");
        // if (boxEl && !boxEl.contains(e.target)){
        //     closeEditPopUp();
        // }

        var fieldEl = document.getElementById("elevationDropdownCon");

        var checkboxes = document.getElementById(`checkboxes_${identifier}`);
        if(fieldEl){
            if (!fieldEl.contains(e.target)){
                if(checkboxes && checkboxes.style.display == "block"){
                    checkboxes.style.display = "none";
                }
            }
        };
    }

    return(
        <div className="projectAdminPreviewStaticCon" onClick={(e)=>onMainConClick(e)}>
            <div id="projectDetailsInnerPopupCon" className="projectAdminPreviewinnerPopupCon">
                <div className="projectAdminPreviewPopupHeadingCon">
                    <h3>{title}</h3>

                    <PopupCrossMark id="inputDetailsPopupCrossIcon" key="inputDetailsPopupCrossIcon" className="propCrossIcon" onClick={closeEditPopUp} />
                </div>

                <div className="popupBottomContainer">
                    <div className="popupInputsMainContainer">

                        {idValidatar("aptType", identifier) && (identifier == projectprops.apartment || identifier == projectprops.villament ) &&
                        <div id="aptType_con" className="popupInputBlock">
                            <Dropdown 
                                key="aptType__"
                                required = "true"
                                inputId="aptType"
                                name="aptType"
                                onChange={onValuesChange}
                                type="text"
                                placeholder=""
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                dropdownArray={apartmentTypeList}
                                label2={`${identifier == projectprops.apartment ? "Apartment" : "Villament"} Type`}
                                labelClassName2={`propAnimatedLabelClass ${singleRow.aptType != undefined && singleRow.aptType != null ? "validPropAnimatedLabelClass" : ""} `}
                                value={singleRow.aptType != undefined && singleRow.aptType != null ? singleRow.aptType : ""} 
                            />
                        </div>
                        }

                        {idValidatar("unitType", identifier) &&
                        <div id="unitType_con" className="popupInputBlock">
                            <div className="unitTypeFirstCon">
                                <Dropdown 
                                    key="propDetaiosunitType"
                                    required = "true"
                                    inputId="unitType"
                                    name="bhk"
                                    onChange={onValuesChange}
                                    placeholder=""
                                    type="text"
                                    className="propAnimatedInputClass"
                                    containerClassName= "propAnimatedInputContainerClass"
                                    inputOuterContainerClassName={`propAnimatedInputOuterContainer ${ (singleRow != undefined && singleRow.bhk != undefined && singleRow.bhk != null && (singleRow.bhk == "custom" || parseInt(singleRow.bhk) > 100000 )) || 
                                                                (singleRow.bhkCustom != undefined && singleRow.bhkCustom != "") ? "IfCoustumCon" : "" }`}
                                    custumOption="Custom"
                                    dropdownArray={bhktypeData.bhktype}
                                    label2={`${ (singleRow != undefined && singleRow.bhk != undefined && singleRow.bhk != null && (singleRow.bhk == "custom" || parseInt(singleRow.bhk) > 100000 )) || 
                                                singleRow.bhkCustom != undefined && singleRow.bhkCustom != "" ? "" : "No.of BHK" }`}
                                    labelClassName2={`${ (singleRow != undefined && singleRow.bhk != undefined && singleRow.bhk != null && (singleRow.bhk == "custom" || parseInt(singleRow.bhk) > 100000 )) || 
                                                (singleRow.bhkCustom != undefined && singleRow.bhkCustom != "") ? "" : 
                                                `propAnimatedLabelClass ${singleRow.bhk != undefined && singleRow.bhk != null && singleRow.bhk !== "" ? "validPropAnimatedLabelClass" : ""}`}`}
                                    value={singleRow != undefined && singleRow.bhk != undefined && singleRow.bhk != null ? singleRow.bhk : ""} 
                                />
                            

                                {/* {singleRow != undefined && singleRow.bhkCustomChange != undefined  && singleRow.bhkCustomChange == "Y" && */}

                                { (singleRow != undefined && (singleRow.bhk != undefined && singleRow.bhk != null && (singleRow.bhk == "custom" || parseInt(singleRow.bhk) > 100000 ))) || 
                                (singleRow.bhkCustom != undefined && singleRow.bhkCustom != "")  ?  
                                    
                                    <Input 
                                        key="customUnitType"
                                        required = "true"
                                        inputId="customUnitType"
                                        name="bhkCustom"
                                        onChange={onValuesChange}
                                        placeholder="Enter No.of BHK Manually"
                                        type="number"
                                        className="propAnimatedInputClass"
                                        containerClassName= "propAnimatedInputContainerClass"
                                        inputOuterContainerClassName="propAnimatedInputOuterContainer customInputCom"
                                        label2="No.of BHK"
                                        labelClassName2={`propAnimatedLabelClass customDetailsInputLableCl ${singleRow.bhkCustom != undefined && singleRow.bhkCustom != null && singleRow.bhkCustom !== "" ? "validPropAnimatedLabelClass" : ""} `}
                                        spanLable="BHK"
                                        spanLableClassName="propertyDetailsLandAreaStaticLable insideInputDetailsPopupAreaSpan"
                                        value={singleRow.bhkCustom != undefined && singleRow.bhkCustom != null ? singleRow.bhkCustom : ""}   
                                        maxCheracterLimit={{type: "INT"}} 
                                    />
                                : "" }
                            </div>
                        </div>
                        }

                        {idValidatar("towers", identifier) && towercount !== 1 &&
                        <div id="towers_con" className="popupInputBlock">
                            <Dropdown 
                                key="propDetailstowers"
                                required = "true"
                                inputId="towers"
                                name="tower"
                                onChange={onTowerSelect}
                                type="text"
                                placeholder=""
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                dropdownArray={towerList}
                                label2="Select Tower"
                                labelClassName2={`propAnimatedLabelClass ${singleRow.tower !== undefined && singleRow.tower != null && singleRow.tower !== "" ? "validPropAnimatedLabelClass" : ""}`}
                                value={singleRow.tower !== undefined && singleRow.tower != null ? singleRow.tower : ""}  
                            />
                        </div>
                        }
                    
                        {idValidatar("blocks", identifier) &&
                        <div id="blocks_con" className="popupInputBlock">
                            <Input 
                                key="propeDetailsblocks"
                                required = "false"
                                inputId="blocks"
                                name="block"
                                onChange={onValuesChange}
                                type="text"
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                label2="Block (Optional)"
                                labelClassName2={`propAnimatedLabelClass ${singleRow.block !== undefined && singleRow.block != null && singleRow.block !== "" ? "validPropAnimatedLabelClass" : ""}`}
                                value={singleRow.block !== undefined && singleRow.block != null ? singleRow.block : ""}  
                                maxCheracterLimit={45}   
                            />
                        </div>
                        }

                        {idValidatar("floors", identifier) && ((singleRow.tower !== undefined && singleRow.tower != null) || towercount === 1) &&
                        <div id="floors_con" className="popupInputBlock">
                            <Dropdown 
                                key="floors__"
                                required = "true"
                                inputId="floor"
                                name="floor"
                                onChange={onValuesChange}
                                type="text"
                                placeholder=""
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                dropdownArray={ (identifier === projectprops.rowHouse || identifier === projectprops.villa) ?
                                                singleRow.isBasement !== undefined && singleRow.isBasement === "Y" && basementFloors !== undefined && basementFloors.length > 0 ? basementFloors : groundFloors : towerFloor }
                                label2={ identifier === projectprops.villa ? "Elevation" : "Select Unit on Floor"}
                                labelClassName2={`propAnimatedLabelClass ${singleRow.floor !== undefined && singleRow.floor != null && singleRow.floor !== "" ? "validPropAnimatedLabelClass" : ""} `}
                                value={singleRow.floor !== undefined && singleRow.floor !== null ? singleRow.floor : ""} 
                                disabled={(singleRow.tower !== undefined && singleRow.tower !== null) || towercount === 1 ? false: true}
                                zeroValue="G"
                            />
                        </div>
                        }

                        {idValidatar("Elevations", identifier) &&
                            <div id="elevationDropdownCon" class="multiselect">
                                <div class="selectBox" onClick={()=>showCheckboxes()}>
                                    <select
                                    /*  id={`elevation_${identifier}`} */
                                    id="floor"
                                        className="propAnimatedInputClass"
                                        value={singleRow.floor !== undefined && singleRow.floor != null && singleRow.floor !== "" ? getUnit(singleRow.floor, elevationsArray) : "" }
                                    >
                                        <option>{singleRow.floor !== undefined && singleRow.floor != null && singleRow.floor !== "" ? getUnit(singleRow.floor , elevationsArray) : "" }</option>
                                    </select>
                                    <label id="elevationLable" className={`basementLabelClass ${singleRow.floor !== undefined && singleRow.floor != null && singleRow.floor !== "" ? "basementLabelSelected" : "" }`}>Elevation<span className="requiredStar" /* style={{color:"red"}} */>*</span></label>

                                    <div class="overSelect"></div>
                                </div>

                                <div id={`checkboxes_${identifier}`} className="basementDropdown" style={{display:"none"}}>
                                    <label htmlFor={`elevationCheckbox_${identifier}`}>
                                        <input 
                                            // onChange={()=> setIsBasement(isBasement => !isBasement)} 
                                            onChange={(e)=>onValuesChange(e)} 
                                            type="checkbox" 
                                            id={`elevationCheckbox_${identifier}`}  
                                            name="isBasement"
                                            value={singleRow.isBasement !== undefined && singleRow.isBasement != null ? singleRow.isBasement : "N"}
                                            checked={singleRow.isBasement !== undefined && singleRow.isBasement != null && singleRow.isBasement === "Y" ? true : false }
                                        />
                                        Basement
                                    </label>

                                    {elevationsArray !== undefined && elevationsArray.length !== undefined && elevationsArray.length > 0 && 
                                        elevationsArray.map((eachItem, ind)=>{
                                            return(
                                                <button 
                                                    id={eachItem.id}
                                                    key={ind+"ele"}
                                                    name="floor" 
                                                    value={eachItem.id} 
                                                    className={`innerOptionBtns ${singleRow.floor !== undefined && singleRow.floor != null && singleRow.floor == `${eachItem.id}` ? "optionBtnSelected" : ""} `}
                                                    onClick={(e)=>showCheckboxes(e)}
                                                >
                                                    {eachItem.name}
                                                </button>
                                            )
                                    })}

                                </div>
                            </div>
                        }
                        
                        
                        {idValidatar("unitNumber", identifier) &&
                        <div id="unitNumber_con" className="popupInputBlock">
                            <Input 
                                key="propertyDetailsUnitnumber"
                                required = "true"
                                inputId="unitNumber"
                                name="unitNumber"
                                onChange={onValuesChange}
                                type="text"
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                label2="Unit Number"
                                labelClassName2={`propAnimatedLabelClass ${singleRow.unitNumber != undefined && singleRow.unitNumber != null && singleRow.unitNumber !== "" ? "validPropAnimatedLabelClass" : ""} `}
                                value={singleRow.unitNumber !== undefined && singleRow.unitNumber != null ? singleRow.unitNumber : ""}
                                maxCheracterLimit={45}  
                            />
                        </div>
                        }

                        {idValidatar("unitFacing", identifier) &&
                        <div id="unitFacing_con" className="popupInputBlock">

                            <div className="unitTypeFirstCon">
                                <Dropdown 
                                    key="unitFacing"
                                    required = "true"
                                    inputId="unitFacing"
                                    name="facing"
                                    onChange={onValuesChange}
                                    type="text"
                                    placeholder=""
                                    className="propAnimatedInputClass"
                                    containerClassName= "propAnimatedInputContainerClass"
                                    inputOuterContainerClassName={`propAnimatedInputOuterContainer ${ singleRow != undefined && singleRow.facing != undefined && 
                                                                    singleRow.facing != null && singleRow.facing == "custom" || singleRow.facingCustom != undefined && 
                                                                    singleRow.facingCustom != ""? "IfCoustumCon" : "" }`}
                                    custumOption="Custom"
                                    dropdownArray={bhktypeData.facing}
                                    label2={`${ singleRow != undefined && singleRow.facing != undefined && 
                                                singleRow.facing != null && singleRow.facing == "custom" || singleRow.facingCustom != undefined && 
                                                singleRow.facingCustom != ""? "" : "Unit Facing" }`}
                                    labelClassName2={`${ singleRow != undefined && singleRow.facing != undefined && 
                                        singleRow.facing != null && singleRow.facing == "custom" || singleRow.facingCustom != undefined && 
                                        singleRow.facingCustom != ""? "" : 
                                        `propAnimatedLabelClass ${singleRow.facing != undefined && singleRow.facing != null && singleRow.facing !== "" ? "validPropAnimatedLabelClass" : ""}` }`}
                                    value={singleRow != undefined && singleRow.facing != undefined && singleRow.facing != null ? singleRow.facing : ""} 
                                />
                            

                                {singleRow != undefined && singleRow.facing != undefined && singleRow.facing != null && 
                                singleRow.facing == "custom" || singleRow.facingCustom != undefined && singleRow.facingCustom != ""  ? 
                                <Input 
                                    key="customUnitFacing"
                                    required = "true"
                                    inputId="customUnitFacing"
                                    name="facingCustom"
                                    onChange={onValuesChange}
                                    placeholder="Enter Unit Facing Manually"
                                    type="text"
                                    className="propAnimatedInputClass"
                                    containerClassName= "propAnimatedInputContainerClass"
                                    inputOuterContainerClassName="propAnimatedInputOuterContainer customInputCom"
                                    label2="Unit Facing"
                                    labelClassName2={`propAnimatedLabelClass customDetailsInputLableCl ${singleRow.facingCustom != undefined && singleRow.facingCustom != null && singleRow.facingCustom !== "" ? "validPropAnimatedLabelClass" : ""} `}
                                    value={singleRow.facingCustom != undefined && singleRow.facingCustom != null ? singleRow.facingCustom : ""}   
                                    maxCheracterLimit={45}  
                                />
                                : "" }

                            </div>

                        </div>
                        }

                        {idValidatar("plotArea", identifier) &&
                        <div id="plotArea_con" className="popupInputBlock">
                            <Input 
                                key="propDetailsPlotArea"
                                required = "true"
                                inputId="plotArea"
                                name="plotArea"
                                onChange={(e)=>formatChange(e)}
                                type="text"
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                label2="Plot Area ( in sq.ft )"
                                labelClassName2={`propAnimatedLabelClass ${singleRow.plotArea != undefined && singleRow.plotArea != null && singleRow.plotArea !== "" ? "validPropAnimatedLabelClass" : ""} `}
                                spanLable="sq.ft."
                                spanLableClassName="propertyDetailsLandAreaStaticLable insideInputDetailsPopupAreaSpan"
                                value={singleRow.plotArea != undefined && singleRow.plotArea != null ? formatPriceToCommaPrice(`${singleRow.plotArea}`) : ""} 
                                maxCheracterLimit={{count: 10, type: "C"}}  
                            />
                        </div>
                        }

                        {idValidatar("superBuildUpArea", identifier) &&
                        <div id="superBuildUpArea_con" className="popupInputBlock">
                            <Input 
                                key="propDetailsSuperBuildUpArea"
                                required = "true"
                                inputId="superBuildUpArea"
                                name="superBuildUpArea"
                                onChange={(e)=>formatChange(e)}
                                type="text"
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                label2="Super Built-up Area ( in sq.ft )"
                                labelClassName2={`propAnimatedLabelClass  ${singleRow.superBuildUpArea != undefined && singleRow.superBuildUpArea != null && singleRow.superBuildUpArea !== "" ? "validPropAnimatedLabelClass" : ""} `}
                                spanLable="sq.ft."
                                spanLableClassName="propertyDetailsLandAreaStaticLable insideInputDetailsPopupAreaSpan"
                                value={singleRow.superBuildUpArea != undefined && singleRow.superBuildUpArea != null ? formatPriceToCommaPrice(`${singleRow.superBuildUpArea}`) : ""} 
                                maxCheracterLimit={{count: 10, type: "C"}}  
                                skipOnFocus={true} 
                            />
                        </div>
                        }

                        {idValidatar("carpetArea", identifier) &&
                        <div id="carpetArea_con" className="popupInputBlock">
                            <Input 
                                key="propDetailsCarpetArea"
                                required = "true"
                                inputId="carpetArea"
                                name="carpetArea"
                                onChange={(e)=>formatChange(e)}
                                type="text"
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                label2="Carpet Area ( in sq.ft )"
                                labelClassName2={`propAnimatedLabelClass ${singleRow.carpetArea != undefined && singleRow.carpetArea != null && singleRow.carpetArea !== "" ? "validPropAnimatedLabelClass" : ""}`}
                                spanLable="sq.ft."
                                spanLableClassName="propertyDetailsLandAreaStaticLable insideInputDetailsPopupAreaSpan"
                                value={singleRow.carpetArea != undefined && singleRow.carpetArea != null ? formatPriceToCommaPrice(`${singleRow.carpetArea}`) : ""} 
                                maxCheracterLimit={{count: 10, type: "C"}} 
                                skipOnFocus={true} 
                            />
                        </div>
                        }

                        {idValidatar("gardenSpace", identifier) &&
                        <div id="gardenSpace_con" className="popupInputBlock">
                            <Input 
                                key="propDetailsGardenSpace"
                                required = "false"
                                inputId="gardenSpace"
                                name="gardenArea"
                                onChange={(e)=>formatChange(e)}
                                type="text"
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                label2="Garden Area ( in sq.ft )"
                                labelClassName2={`propAnimatedLabelClass ${singleRow.gardenArea != undefined && singleRow.gardenArea != null && singleRow.gardenArea !== "" ? "validPropAnimatedLabelClass" : ""}`}
                                spanLable="sq.ft."
                                spanLableClassName="propertyDetailsLandAreaStaticLable insideInputDetailsPopupAreaSpan"
                                value={singleRow.gardenArea != undefined && singleRow.gardenArea != null ? formatPriceToCommaPrice(`${singleRow.gardenArea}`) : ""} 
                                maxCheracterLimit={{count: 10, type: "C"}}  
                            />
                        </div>
                        }

                        {idValidatar("terracespace", identifier) &&
                        <div id="terracespace_con" className="popupInputBlock">
                            <Input 
                                key="propDetailsTerracespace"
                                required = "false"
                                inputId="terracespace"
                                name="terraceArea"
                                onChange={(e)=>formatChange(e)}
                                type="text"
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                label2="Terrace Area ( in sq.ft )"
                                labelClassName2={`propAnimatedLabelClass ${singleRow.terraceArea != undefined && singleRow.terraceArea != null && singleRow.terraceArea !== "" ? "validPropAnimatedLabelClass" : ""}`}
                                spanLable="sq.ft."
                                spanLableClassName="propertyDetailsLandAreaStaticLable insideInputDetailsPopupAreaSpan"
                                value={singleRow.terraceArea != undefined && singleRow.terraceArea != null ? formatPriceToCommaPrice(`${singleRow.terraceArea}`) : ""} 
                                maxCheracterLimit={{count: 10, type: "C"}}  
                            />
                        </div>
                        }

        {/* parking */}
                        {idValidatar("carParking", identifier) &&
                        <div id="carParking_con" className="popupInputBlock">
                            <Dropdown 
                                key="carParking"
                                required = "true"
                                inputId="carParking"
                                name="noOfCarParking"
                                onChange={(e) => onValuesChangeParking(e)}
                                type="text"
                                placeholder=""
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                dropdownArray={floors}
                                labelClassName=""
                                label2="No. of Car Parking"
                                labelClassName2={`propAnimatedLabelClass ${singleRow.noOfCarParking != undefined && singleRow.noOfCarParking != null && singleRow.noOfCarParking !== "" ? "validPropAnimatedLabelClass" : ""}`}
                                addPlusOption={10}
                                value={singleRow.noOfCarParking != undefined && singleRow.noOfCarParking != null ? singleRow.noOfCarParking : ""}
                            />
                        </div>
                                        }

                        {idValidatar("area", identifier) &&
                        <div id="plotArea_con" className="popupInputBlock">
                            <Input 
                                key="propDetailsParkingArea"
                                required = "false"
                                inputId="area"
                                name="parkingArea"
                                onChange={(e)=>formatChange(e)}
                                type="text"
                                className="propAnimatedInputClass"
                                disabled={singleRow.noOfCarParking != undefined && singleRow.noOfCarParking != null && singleRow.noOfCarParking == 0 ? true : false}
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                label2="Total Parking Area ( in sq.ft )"
                                labelClassName2={`propAnimatedLabelClass ${singleRow.parkingArea != undefined && singleRow.parkingArea != null && singleRow.parkingArea !== "" ? "validPropAnimatedLabelClass" : ""}`}
                                spanLable="sq.ft."
                                spanLableClassName="propertyDetailsLandAreaStaticLable insideInputDetailsPopupAreaSpan"
                                value={singleRow.parkingArea != undefined && singleRow.parkingArea != null ? formatPriceToCommaPrice(`${singleRow.parkingArea}`) : ""} 
                                maxCheracterLimit={{count: 10, type: "C"}}  
                            />
                        </div>
                        }

                        {idValidatar("openParking", identifier) &&
                        <div id="openParking_con" className="popupInputBlock">
                            <Dropdown 
                                key="openParking"
                                required = "false"
                                inputId="openParking"
                                name="parkingType"
                                onChange={onValuesChange}
                                type="text"
                                placeholder=""
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                dropdownArray={openParking && singleRow.noOfCarParking && singleRow.noOfCarParking != 0 ?  openParking.slice(1,3) : openParking.slice(0,1) }
                                label2="Parking Open/Covered"
                                labelClassName2={`propAnimatedLabelClass ${singleRow.parkingType != undefined && singleRow.parkingType != null && singleRow.parkingType !== "" ? "validPropAnimatedLabelClass" : ""}`}
                                value={singleRow.parkingType != undefined && singleRow.parkingType != null ? singleRow.parkingType : ""}  
                            />
                        </div>
                        }
                        
                        {idValidatar("lengthOfPlot", identifier) &&
                        <div id="lengthOfPlot_con" className="popupInputBlock">
                            <Input 
                                key="propDetailslengthOfPlot"
                                required = "true"
                                inputId="lengthOfPlot"
                                name="length"
                                onChange={(e)=>formatChange(e)}
                                type="text"
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                label2="Length Of Plot ( in feet )"
                                labelClassName2={`propAnimatedLabelClass ${singleRow.length != undefined && singleRow.length != null && singleRow.length !== "" ? "validPropAnimatedLabelClass" : ""}`}
                                spanLable="ft."
                                spanLableClassName="propertyDetailsLandAreaStaticLable"
                                value={singleRow.length != undefined && singleRow.length != null ? formatPriceToCommaPrice(`${singleRow.length}`) : ""} 
                                maxCheracterLimit={{count: 10, type: "C"}}  
                            />
                        </div>
                        }

                        {idValidatar("breadthOfPlot", identifier) &&
                        <div id="breadthOfPlot_con" className="popupInputBlock">
                            <Input 
                                key="propDetailsbreadthOfPlot"
                                required = "true"
                                inputId="breadthOfPlot"
                                name="width"
                                onChange={(e)=>formatChange(e)}
                                type="text"
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                label2="Breadth Of Plot ( in feet )"
                                labelClassName2={`propAnimatedLabelClass ${singleRow.width != undefined && singleRow.width != null && singleRow.width !== "" ? "validPropAnimatedLabelClass" : ""}`}
                                spanLable="ft."
                                spanLableClassName="propertyDetailsLandAreaStaticLable"
                                value={singleRow.width != undefined && singleRow.width != null ? formatPriceToCommaPrice(`${singleRow.width}`) : ""} 
                                maxCheracterLimit={{count: 10, type: "C"}}  
                            />
                        </div>
                    }

                        {idValidatar("plotFacing", identifier) &&
                        <div id="plotFacing_con" className="popupInputBlock">
                            <div className="unitTypeFirstCon">
                                <Dropdown 
                                    key="plotFacing"
                                    required = "true"
                                    inputId="plotFacing"
                                    name="facing"
                                    onChange={onValuesChange}
                                    type="text"
                                    placeholder=""
                                    className="propAnimatedInputClass"
                                    containerClassName= "propAnimatedInputContainerClass"
                                    inputOuterContainerClassName={`propAnimatedInputOuterContainer ${ singleRow != undefined && singleRow.facing != undefined && singleRow.facing != null && singleRow.facing == "custom" || singleRow.facingCustom != undefined && 
                                    singleRow.facingCustom != ""? "IfCoustumCon" : "" } `}
                                    dropdownArray={bhktypeData.facing}
                                    custumOption="Custom"
                                    label2={`${ singleRow != undefined && singleRow.facing != undefined && 
                                                    singleRow.facing != null && singleRow.facing == "custom" || singleRow.facingCustom != undefined && 
                                                    singleRow.facingCustom != ""? "" : "Plot Facing" }`}
                                    labelClassName2={`${ singleRow != undefined && singleRow.facing != undefined && 
                                        singleRow.facing != null && singleRow.facing == "custom" || singleRow.facingCustom != undefined && 
                                        singleRow.facingCustom != ""? "" : 
                                        `propAnimatedLabelClass ${singleRow.facing != undefined && singleRow.facing != null && singleRow.facing !== "" ? "validPropAnimatedLabelClass" : ""}` }`}
                                    value={singleRow.facing != undefined && singleRow.facing != null ? singleRow.facing : ""}  
                                />


                                {singleRow != undefined && singleRow.facing != undefined && 
                                    singleRow.facing != null && singleRow.facing == "custom" || singleRow.facingCustom != undefined && 
                                    singleRow.facingCustom != ""  ? 
                                    <Input 
                                        key="customUnitFacing"
                                        required = "true"
                                        inputId="customUnitFacing"
                                        name="facingCustom"
                                        onChange={onValuesChange}
                                        placeholder="Enter Manually"
                                        type="text"
                                        className="propAnimatedInputClass"
                                        containerClassName= "propAnimatedInputContainerClass"
                                        inputOuterContainerClassName="propAnimatedInputOuterContainer customInputCom"
                                        label2="Plot Facing"
                                        labelClassName2={`propAnimatedLabelClass customDetailsInputLableCl ${singleRow.facingCustom != undefined && singleRow.facingCustom != null && singleRow.facingCustom !== "" ? "validPropAnimatedLabelClass" : ""} `}
                                        value={singleRow.facingCustom != undefined && singleRow.facingCustom != null ? singleRow.facingCustom : ""}  
                                        maxCheracterLimit={45}   
                                    />
                                    : "" }
                            </div>
                        </div>
                        }
                    
                    {idValidatar("balcony", identifier) &&
                        <div id="balcony_con" className="popupInputBlock">
                            <Dropdown 
                                key="balcony"
                                required = "true"
                                inputId="balcony"
                                name="balcony"
                                onChange={onValuesChange}
                                type="text"
                                placeholder=""
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                dropdownArray={floors}
                                label2="Total No: of Balconies"
                                labelClassName2={`propAnimatedLabelClass ${singleRow.balcony != undefined && singleRow.balcony != null && singleRow.balcony !== "" ? "validPropAnimatedLabelClass" : ""}`}
                                addPlusOption={10}
                                value={singleRow.balcony != undefined && singleRow.balcony != null ? singleRow.balcony : ""}  
                            />
                        </div>
                        }

                        {idValidatar("totalBalconySize", identifier) &&
                        <div id="breadthOfPlot_con" className="popupInputBlock">
                            <Input 
                                key="totalBalconySize"
                                required = "false"
                                inputId="totalBalconySize"
                                name="balconyArea"
                                onChange={(e)=>formatChange(e)}
                                type="text"
                                className="propAnimatedInputClass"
                                disabled={singleRow.balcony != undefined && singleRow.balcony != null && singleRow.balcony == 0 ? true : false}
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer" 
                                label2="Total Balcony Size ( in sq.ft )"
                                labelClassName2={`propAnimatedLabelClass ${singleRow.balconyArea != undefined && singleRow.balconyArea != null && singleRow.balconyArea !== "" ? "validPropAnimatedLabelClass" : ""}`}
                                spanLable="sq.ft."
                                spanLableClassName="propertyDetailsLandAreaStaticLable insideInputDetailsPopupAreaSpan"
                                value={singleRow.balconyArea != undefined && singleRow.balconyArea != null ? formatPriceToCommaPrice(`${singleRow.balconyArea}`) : ""} 
                                maxCheracterLimit={{count: 10, type: "C"}}  
                            />
                        </div>
                        }

                        {idValidatar("bathrooms", identifier) &&
                        <div id="bathrooms_con" className="popupInputBlock">
                            <Dropdown 
                                key="bathrooms"
                                required = "true"
                                inputId="bathrooms"
                                name="bathroom"
                                onChange={onValuesChange}
                                type="text"
                                placeholder=""
                                className="propAnimatedInputClass"
                                containerClassName= "propAnimatedInputContainerClass"
                                inputOuterContainerClassName="propAnimatedInputOuterContainer"
                                dropdownArray={bathRooms}
                                label2="Total No: of Bathrooms"
                                labelClassName2={`propAnimatedLabelClass ${singleRow.bathroom != undefined && singleRow.bathroom != null && singleRow.bathroom !== "" ? "validPropAnimatedLabelClass" : ""}`}
                                value={singleRow.bathroom != undefined && singleRow.bathroom != null ? singleRow.bathroom : ""}  
                            />
                        </div>
                        }

                    </div> 

                    <div className="popupMediaUploadPart">
                        <NewMediaUploadBox  
                            key={`prop_flootplan_image_${identifier}`}
                            fileId={`prop_flootplan_image_${identifier}`}
                            title="Upload" 
                            innerTextContent="Add specific Floor Plan"
                            mediaType="P" 
                            selectedType="S"
                            mediaFilesList={floorplanImageFile} 
                            imgUrlsList={floorplanImgUrl} 
                            required={false}
                            dataLimit={5}
                            errorMsg="Please upload the Floor Plan image"
                            onUploadBtnClick={onUploadBtnClick}
                            onRemoveImage={onRemoveImage}
                            onImagePopup={onImagePopup}
                            data={singleRow}
                            cssForText="cssForText"
                            displayImgClass="displayFloorplanImgClass"
                            hideIcon={true}
                            hideNotificationText="true"
                            // continerWidth={95}
                            buttonTitle={ singleRow.floorplan != undefined && singleRow.floorplan != null && singleRow.floorplan == 1 ? "Replace Image" : "Upload"}
                            icon={<svg id="styleForUploadIcon" xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M4.72656 12.1869C4.87575 12.1869 5.01882 12.2461 5.12431 12.3516C5.2298 12.4571 5.28906 12.6002 5.28906 12.7494V14.2494C5.28906 14.3529 5.37306 14.4369 5.47656 14.4369H14.4766C14.5263 14.4369 14.574 14.4171 14.6091 14.382C14.6443 14.3468 14.6641 14.2991 14.6641 14.2494V12.7494C14.6641 12.6002 14.7233 12.4571 14.8288 12.3516C14.9343 12.2461 15.0774 12.1869 15.2266 12.1869C15.3757 12.1869 15.5188 12.2461 15.6243 12.3516C15.7298 12.4571 15.7891 12.6002 15.7891 12.7494V14.2494C15.7891 14.5975 15.6508 14.9313 15.4046 15.1775C15.1585 15.4236 14.8247 15.5619 14.4766 15.5619H5.47656C5.12847 15.5619 4.79463 15.4236 4.54848 15.1775C4.30234 14.9313 4.16406 14.5975 4.16406 14.2494V12.7494C4.16406 12.6002 4.22333 12.4571 4.32881 12.3516C4.4343 12.2461 4.57738 12.1869 4.72656 12.1869ZM9.03006 12.0946C8.84393 12.0948 8.6645 12.0252 8.52718 11.8995C8.38987 11.7739 8.30464 11.6013 8.28831 11.4159C8.1734 10.1015 8.15335 8.78061 8.22831 7.46338C8.04296 7.45301 7.8577 7.44101 7.67256 7.42738L6.55506 7.34563C6.45664 7.33842 6.36178 7.30578 6.27977 7.25091C6.19775 7.19604 6.13138 7.12081 6.08716 7.03259C6.04293 6.94437 6.02237 6.84618 6.02748 6.74764C6.03259 6.64909 6.0632 6.55355 6.11631 6.47038C6.91273 5.22379 7.93896 4.14003 9.14031 3.27688L9.58806 2.95513C9.70128 2.87382 9.83717 2.83008 9.97656 2.83008C10.116 2.83008 10.2518 2.87382 10.3651 2.95513L10.8128 3.27763C12.0141 4.14057 13.0403 5.22407 13.8368 6.47038C13.8899 6.55355 13.9205 6.64909 13.9256 6.74764C13.9308 6.84618 13.9102 6.94437 13.866 7.03259C13.8217 7.12081 13.7554 7.19604 13.6734 7.25091C13.5913 7.30578 13.4965 7.33842 13.3981 7.34563L12.2806 7.42738C12.0961 7.44088 11.9108 7.45288 11.7256 7.46263C11.8006 8.78038 11.7796 10.1011 11.6641 11.4151C11.6479 11.6006 11.5629 11.7732 11.4257 11.899C11.2885 12.0248 11.1092 12.0946 10.9231 12.0946H9.03006Z" fill="#0073C6"/>
                                </svg>}
                        />
                    </div>

                    <p id={`popup_details_err_msg_${identifier}`} style={{display:"none"}} className="errorMsgForPopupDetailDropdown">*Note: Please fill in all mandatory required fields</p>

                    <SingleButton
                        key="postPropertySubmitButton"
                        buttonId="postPropertySubmitButton"
                        containerClassName="popupSubmitButtonCon"
                        buttonClassName="popupSubmitButton"
                        onSubmit={()=>onButtonClick(singleRow)}
                        title="Save Unit Details"
                        icon=""
                    />

                </div>
                
            </div>
        </div>
    )
};

export default PropertyDetailsInputsPopup;