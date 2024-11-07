import React, { Fragment, memo, useEffect, useState } from 'react';
import $ from 'jquery';

import Input from '../../commonComponents/Input';
import MapLocationSearchBox from '../../commonComponents/MapLocationSearchBox';

const ProjectMapBlock = ({data, onChange, setBasicDetails}) => {
    const [mapSearchValue, setMapSearchValue] = useState($("selectByLocation_2").val());

    useEffect(()=>{
        if(data.address && data.address !== ""){
            setMapSearchValue(data.address || $("selectByLocation_2").val());
        }else{
            setMapSearchValue("");
        }
    },[data.address]);

    return (
        <Fragment>
            <h2 className="googleMapHeading">Google Map Preview</h2>
            <div className="googleMapConMianCon">
                <Input
                	key="new_new"
                    required = "false"
                    inputId="selectByLocation_2"
                    name="selectByLocation_2"
                    type="search"
                    className="googleMapSearchField"
                    hide="false"
                    containerClassName="AminputContainer"
                    inputOuterContainerClassName="googleMapSearchFieldOuterCon"
                    label2={<p className="aminityLableElement">
                            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                            <path d="M21.9159 22.895C22.4143 23.3933 23.1834 22.6242 22.6851 22.1367L18.6226 18.0633C20.0477 16.4866 20.8354 14.4362 20.8326 12.3108C20.8326 7.555 16.9651 3.6875 12.2093 3.6875C7.45344 3.6875 3.58594 7.555 3.58594 12.3108C3.58594 17.0667 7.45344 20.9342 12.2093 20.9342C14.3543 20.9342 16.3368 20.1433 17.8534 18.8325L21.9159 22.895ZM4.66819 12.3108C4.66819 8.15083 8.05902 4.77083 12.2082 4.77083C16.3682 4.77083 19.7482 8.15083 19.7482 12.3108C19.7482 16.4708 16.3682 19.8508 12.2082 19.8508C8.05902 19.8508 4.66819 16.4708 4.66819 12.3108Z" fill="#242424"/>
                            </svg>
                            Search by Location, City, or Address
                        </p>}
                    labelClassName2={`searchMapFieldLable ${(mapSearchValue === "" ) ? "" : "hideLable"}`}
                />

{/* Google Map Container for initialize map */}
                <div id="displayGoogleMapComponent" style={{display: "none"}}></div>

{/* Open Source Leaflet map */}
                {/* <MapLocationSearchBox
                    key="projLocationMap"
                    id="projLocationMap"
                    lat={data.latitude !== undefined && data.latitude != null ? data.latitude : ""}
                    lan={data.longtitude !== undefined && data.longtitude != null ? data.longtitude : ""}
                    setBasicDetails={setBasicDetails}
                /> */}


                <p className="sectionHeading textForLatAndLong"><span>Or</span> <br/>Add directly by google latitude and longitude</p>

                <div className="postProjectInputsCon postProjectInputsBottomCon">
                    <Input
                        key="projlatitude"
                        required = "true"
                        inputId="latitude"
                        name="latitude"
                        onChange={onChange}
                        type="number"
                        className={`animatedInput numberInputField ${data.latitude != undefined && data.latitude != null && data.latitude != "" && data.latitude != 0 ? "validInput" : ""}`}
                        containerClassName="input-field"
                        inputOuterContainerClassName="PDinputOuterContainerClassName"
                        label2="Latitude"
                        labelClassName2={`animatedLabel ${data.latitude != undefined && data.latitude != null && data.latitude != ""  ? "latLongInputsLable" : ""}`}
                        value={data.latitude != undefined && data.latitude != null ? data.latitude : ""}   
                        maxCheracterLimit={32}
                        inputMode="numeric"
                    />
                    
                    <Input
                        key="projlongtitude"
                        required = "true"
                        inputId="longtitude"
                        name="longtitude"
                        onChange={onChange}
                        type="number"
                        className={`animatedInput ${data.longtitude != undefined && data.longtitude != null && data.longtitude != "" && data.longtitude != 0 ? "validInput" : ""}`}
                        containerClassName="input-field"
                        inputOuterContainerClassName="PDinputOuterContainerClassName"
                        label2="Longitude"
                        labelClassName2={`animatedLabel ${data.longtitude != undefined && data.longtitude != null &&  data.longtitude != ""? "latLongInputsLable" : ""}`}
                        value={data.longtitude != undefined && data.longtitude != null ? data.longtitude : ""}   
                        maxCheracterLimit={32} 
                        inputMode="numeric"              
                    />
                </div>
            </div>
        </Fragment>
    )
};

export default memo(ProjectMapBlock);
