import React, { Fragment } from 'react';
import SingleSelectDropdown2 from '../../commonComponents/SingleSelectDropdown2';
import Input from '../../commonComponents/Input';

export default function ProjectAddressBlock({data, onChange, dropdownNewSearch, dropdownNewSearch2, state, city, locality}) {

    return (
        <Fragment>
            <h2 className="sectionHeading">Address Details</h2>

            <div className="postProjectInputsCon postProjectInputsBottomCon">
                <SingleSelectDropdown2
                    key="state"
                    isInputSearch={true}
                    hideSearhInputField="true"
                    required = "true"
                    inputId="state"
                    name="state"
                    onChange={dropdownNewSearch}
                    searchFieldPlaceholder="Search State"
                    dropdownArray={state}
                    className="animatedInput"
                    containerClassName="input-field"
                    inputOuterContainerClassName="PDinputOuterContainerClassName"
                    label2="Select State"
                    labelClassName2="animatedLabel"
                    value={data.state != undefined && data.state != null ? data.state : ""}  
                    singleSelectDropdownClassName="singleSelectDropdownCon"
                    singleSelectDropdownItemsClassName="singleSelectDropdownItemsCon"
                    dropdownItemClassName="singleSelectDropdownItem"
                    arrowIconClass="postProjBasicDetailsDropdownArrow"
                />

                <SingleSelectDropdown2
                    key="city"
                    isInputSearch={true}
                    hideSearhInputField="true"
                    required = "true"
                    inputId="city"
                    name="city"
                    onChange={dropdownNewSearch2}
                    searchFieldPlaceholder="Search City"
                    dropdownArray={city}
                    className="animatedInput"
                    containerClassName="input-field"
                    inputOuterContainerClassName="PDinputOuterContainerClassName"
                    label2="Select City"
                    labelClassName2="animatedLabel"
                    value={data.city != undefined && data.city != null ? data.city : ""}   
                    singleSelectDropdownClassName="singleSelectDropdownCon"
                    singleSelectDropdownItemsClassName="singleSelectDropdownItemsCon"
                    dropdownItemClassName="singleSelectDropdownItem"  
                    arrowIconClass="postProjBasicDetailsDropdownArrow"
                />


                <div className="localityFieldsMainCon">
                    {((data.customLocalityChange == null || data.customLocalityChange == "N") && (data.locality == null || data.locality < 100000)) &&
                    <SingleSelectDropdown2
                        key="locality"
                        isInputSearch={true}
                        hideSearhInputField="true"
                        required = "true"
                        inputId="locality"
                        name="locality"
                        onChange={dropdownNewSearch2}
                        searchFieldPlaceholder="Search Locality"
                        dropdownArray={locality}
                        className="animatedInput"
                        containerClassName="input-field"
                        inputOuterContainerClassName="PDinputOuterContainerClassName localityMainOuterCon"
                        label2="Select locality"
                        labelClassName2="animatedLabel"
                        value={data.locality != undefined && data.locality != null ? data.locality : ""}    
                        singleSelectDropdownClassName="singleSelectDropdownCon"
                        singleSelectDropdownItemsClassName="singleSelectDropdownItemsCon"
                        dropdownItemClassName="singleSelectDropdownItem"  
                        arrowIconClass="postProjBasicDetailsDropdownArrow"
                        custumOption="Can’t find your Locality? Add Manually"
                        custumOptionClass="custumOptionClass"
                    />
                    }

                    {((data.customLocalityChange != null && data.customLocalityChange == "Y") || (data.locality != null && data.locality > 100000)) &&
                    <Fragment>
                        <Input
                            key="projCustomLocality"
                            required = "true"
                            inputId="customLocality"
                            name="customLocality"
                            onChange={(e)=>onChange(undefined, e.target.name, e.target.value)}
                            type="text"
                            className="animatedInput"
                            containerClassName="input-field"
                            inputOuterContainerClassName="PDinputOuterContainerClassName localityMainOuterCon"
                            label2="Enter Locality Name"
                            labelClassName2={`animatedLabel ${data.customLocality != undefined && data.customLocality != null && data.customLocality != "" ? "afterSelectedLableClass" : ""}`}
                            value={data.customLocality != undefined && data.customLocality != null ? data.customLocality : ""}  
                            maxCheracterLimit={30}                
                        />
                        <button className="custumOptionClass localityCustumFieldBtn" onClick={()=>dropdownNewSearch2("locality","notCustom")}>or Click to find in List</button>
                    </Fragment>
                    }
                </div>

                <Input
                    key="projPincode"
                    required = "true"
                    inputId="pincode"
                    name="pincode"
                    onChange={onChange}
                    className="animatedInput numberInputField"
                    type="number"
                    containerClassName="input-field"
                    inputOuterContainerClassName="PDinputOuterContainerClassName"
                    label2="Enter Pincode"
                    labelClassName2={`animatedLabel ${data.pincode != undefined && data.pincode != null && data.pincode != "" ? "afterSelectedLableClass" : ""}`}
                    compnayDetailsErrorMsg="errMsgPositioningClass"
                    value={data.pincode != undefined && data.pincode != null ? data.pincode : ""}  
                    inputMode="numeric"     
                />
            </div>

            <Input
                key="projaddress"
                required = "true"
                inputId="address"
                name="address"
                onChange={onChange}
                capital={"F"}
                type="text"
                className={`animatedInput addressAnimatedInput ${data.address != undefined && data.address != null && data.address != "" ? "validInput" : ""}`}
                containerClassName="input-field"
                outerContainerClassName="addressFieldInnerOuter"
                inputOuterContainerClassName="addressField"
                label2="Enter Address of the Project"
                labelClassName2={`animatedLabel ${data.address != undefined && data.address != null && data.address != "" ? "afterSelectedLableClass" : ""}`}
                value={data.address != undefined && data.address != null ? data.address : ""}  
                maxCheracterLimit={250}                
            /> 
        </Fragment>
    )
}
