import React, { Fragment, useEffect, useState } from 'react';
import $ from 'jquery';

import HeadingBox from './HeadingBox';
import SingleButton from '../../commonComponents/SingleButton';
import { bhkDetails, formatPriceToCommaPrice, inWords, itemScrollIntoView, projectprops, propertyDetailsTypes } from '../../images/commonImages';
import HeadingAndEditBox from './HeadingAndEditBox';
import ProjDetailBox from './ProjDetailBox';
import { basementIcon, cashIcon, elevationIcon, floorsIcon, noUnitsSvgIcon, podiumIcon, towerIcon } from '../../images/commonSvgs';
import { convertSqmetersIntoSqft, fixedToTw0Decimals, repeatCounterForMinMax } from '../../images/constant';
import BrochureBox from './BrochureBox';
import PropertyTypeTable from '../propDetailsComponents/PropertyTypeTable';

export default function PreviewPropertyDetails({propertyTypeDetails, noOfTower, towers, phaseArray, propPricing, combinedPropertyDetails, 
                                                idValidatar, onImagePopup, setStep, apartmentTypeList, data}) {
    const [allKeys, setAllKeys ] = useState([]);
    const [propCgId, setPropCgId ] = useState("");
    const [selectedPhaseId, setSelectedPhaseId] = useState(phaseArray[0].phaseId);
    const [overView, setOverView ] = useState({});
    const [selectedFilteredBhk, setSelectedFilteredBhk] = useState(null);

    let phaseCount = data && data.phaseCount ? data.phaseCount : 1;

    let selectedPhaseBroucher = phaseArray && phaseArray.length > 1 && phaseArray.filter(each=>each.phaseId == selectedPhaseId)[0] !== null && 
                                phaseArray.filter(each=>each.phaseId == selectedPhaseId)[0].phaseBrochureUrl !== null && 
                                phaseArray.filter(each=>each.phaseId == selectedPhaseId)[0].phaseBrochureUrl !== null ?
                                phaseArray.filter(each=>each.phaseId == selectedPhaseId)[0].phaseBrochureUrl : "";

    let towerCount = 0;
    
    let prevKeys = [];

    useEffect(()=>{   
        prevKeys = [];    

        if(propertyTypeDetails && Object.keys(propertyTypeDetails).length > 0){
            Object.keys(propertyTypeDetails).map(eachProp=>{
                propertyTypeDetails[eachProp].map(eachBhk=>{
                    if(eachBhk.phaseId == selectedPhaseId && !prevKeys.includes(eachProp)){
                        prevKeys.push(parseInt(eachProp));
                    };
                });
            });

            if(prevKeys.length > 0 ){
                // reference to sort array
                let a = [35, 33, 31, 34, 32];
                let sortedArray = [];

                // Create an array of objects containing both values and their corresponding index
                let indexedB = prevKeys.map((value, index) => ({ value, index }));

                // Sort indexedB based on the order defined by array a
                indexedB.sort((obj1, obj2) => {
                    let index1 = a.indexOf(obj1.value);
                    let index2 = a.indexOf(obj2.value);
                    return index1 - index2;
                });

                // Extract the sorted values from indexedB
                indexedB.map(obj => {
                    if(!sortedArray.includes(obj.value)){
                        sortedArray.push(obj.value);
                    }
                });

                prevKeys = sortedArray;

                setAllKeys(prevKeys);
                if(prevKeys[0] !== undefined && prevKeys[0] !== null ){
                    setPropCgId(prevKeys[0]);
                };
            }else{
                setAllKeys([]);
                setPropCgId("");
            }
            
        }
    },[propertyTypeDetails, selectedPhaseId]);

    useEffect(()=>{
        let prevOverView = {};
        
        let propCg = propCgId !== "" ? propCgId : prevKeys[0];

        if(propCg && combinedPropertyDetails && combinedPropertyDetails[propCg] && combinedPropertyDetails[propCg].length != undefined && combinedPropertyDetails[propCg].length > 0){
            combinedPropertyDetails[propCg].filter((each)=>{
                if(each.phaseId == selectedPhaseId){
                    if(each.noOfTower){
                        prevOverView.noOfTower = each.noOfTower;
                    };

                    if(each.noOfUnit){
                        prevOverView.noOfUnit = each.noOfUnit;
                    };

                    if(each.noOfBlock){
                        prevOverView.noOfBlock = each.noOfBlock;
                    };

                    if(each.landArea){
                        prevOverView.landArea = each.landArea;
                    };

                    if(each.basePrice){
                        prevOverView.basePrice = each.basePrice;
                    };
                }
            });

            setOverView(prevOverView);
        };

    },[propCgId, selectedPhaseId, propertyTypeDetails, selectedFilteredBhk]);


    return (
        <div id='projPreviewPropertyDetailsBlock' className='previewPagePropertyDetailsMainCon'>
            <HeadingBox heading="Property Details" subHeading="Check the Property Details you filled for the project" setStep={setStep} />

            {phaseArray !== undefined && phaseArray != null && phaseArray.length !== undefined && phaseArray.length > 1 && phaseCount > 1 &&
            <Fragment>
                <p className='propsPreviewText'>See your property details as per phases you filled</p>
                
                <div className="propertyTypeBtnCon">
                    {phaseArray.map((eachPhase, ind)=>{
                            if(ind < phaseCount){
                                return(
                                    <SingleButton
                                        key={`eachPhaseCard_${eachPhase.phaseId}`}
                                        buttonId={`PreviewProp_${eachPhase.phaseId}`}
                                        containerClassName=""
                                        buttonClassName={`shortListPropTypeBtn ${selectedPhaseId == eachPhase.phaseId ? "propTypeBtnSelected" : ""}`}
                                        onSubmit={()=>{
                                            setSelectedPhaseId(eachPhase.phaseId); 
                                            setSelectedFilteredBhk(null);
                                            $("#previewMinAndMaxMainCon").hide();
                                            setTimeout(()=>{
                                                $("#phaseNumberText").text(ind+1);
                                                $("#phaseNumberText2").text(ind+1);
                                            },100);
                                        }}
                                        title={eachPhase.phaseName.toLowerCase().includes("phase") ? eachPhase.phaseName : `Phase ${eachPhase.phaseName}` }
                                    />
                                )
                            }
                        })}
                </div>
            </Fragment>
            }

            {propCgId !== "" && propertyDetailsTypes.get(propCgId) !== undefined && propertyDetailsTypes.get(propCgId).name !== undefined ?
            <Fragment>
                {propertyTypeDetails && allKeys && allKeys.length > 0 &&
                <Fragment>
                    <p className='propsPreviewText'>See the data for the property types details you added in Phases</p>
                    <div className="propertyTypeBtnCon previewPropTypeBtnsCon">
                        {allKeys.map((keyName)=>{    
                            keyName = keyName; 
                            if(keyName != projectprops["Independent House/Building"] && propertyDetailsTypes && propertyDetailsTypes.get(keyName) !== undefined && propertyDetailsTypes.get(keyName) !== null){      
                                let data = propertyDetailsTypes.get(keyName);         
                                return(
                                    <SingleButton
                                        key={keyName}
                                        buttonId={`PreviewProp_${keyName}`}
                                        containerClassName=""
                                        buttonClassName={`shortListPropTypeBtn ${propCgId == keyName ? "propTypeBtnSelected" : ""}`}
                                        onSubmit={()=>{
                                            setSelectedFilteredBhk(null);
                                            setPropCgId(data.id); $("#previewMinAndMaxMainCon").hide();
                                            itemScrollIntoView("projPreviewPropertyDetailsBlock");
                                        }}
                                        title={data.name}
                                        icon={data.url}
                                    />
                                )
                            }})
                        }
                    </div>
                </Fragment>
                }

                {Object.keys(overView).length > 0 && 
                <div className='verticalContainer'>
                    {phaseArray != undefined && phaseArray != null && phaseArray.length != undefined && phaseArray.length > 1 && 
                    <p className='phaseAndPropShower'>Showing details for <span>“ {propertyDetailsTypes.get(propCgId).name}- Phase <span id='phaseNumberText'>1</span> ”</span></p>
                    }

                    <HeadingAndEditBox key="4PreviewHeading" heading={`Basic Details of ${propertyDetailsTypes.get(propCgId).name}`} identifier={4} setStep={setStep} />
                    <div className='previewDetailsHoldInnerCon previewDetailsPhasesCon'>
                        {overView.noOfTower != undefined && overView.noOfTower != 0 &&
                        <ProjDetailBox className="previewPhaseBox previewPriseBox" icon={towerIcon} key="Towers" iconWithText="Total No: of Towers" name={overView.noOfTower} />
                        }
                        {overView.noOfBlock != undefined && overView.noOfBlock != 0 &&
                        <ProjDetailBox className="previewPhaseBox previewPriseBox" icon={floorsIcon} key="Blocks" iconWithText="Total No: of Blocks" name={overView.noOfBlock} />
                        }
                        {overView.noOfUnit != undefined && overView.noOfUnit !== 0 &&
                        <ProjDetailBox className="previewPhaseBox previewPriseBox" icon={floorsIcon} key="Units" iconWithText="Total No: of Units" name={formatPriceToCommaPrice(overView.noOfUnit)} />
                        }
                        {overView.landArea != undefined && overView.landArea != 0 &&
                        <ProjDetailBox className="previewPhaseBox previewPriseBox" icon={floorsIcon} key="TotalLandArea" iconWithText="Total Land Area" name={`${formatPriceToCommaPrice(convertSqmetersIntoSqft(overView.landArea, "sqmts"))} Sqm - (${formatPriceToCommaPrice(fixedToTw0Decimals(overView.landArea))} in Sq.ft)`} />
                        }
                        {overView.basePrice != undefined && overView.basePrice != 0 &&
                        <ProjDetailBox className="previewPhaseBox previewPriseBox" icon={cashIcon} key="BasePrice" iconWithText="Base Price" name={`₹ ${formatPriceToCommaPrice(overView.basePrice)} /sq.ft`} />
                        }
                    </div>
                </div>
                }

    {/* Tower details */}
                {(propCgId == projectprops.apartment || propCgId == projectprops.villament) && towers && towers.length && towers.length > 0 && overView.noOfTower && overView.noOfTower != 0 &&
                <div className='previewDetailsHoldCon previewMinAndMaxMainCon'>
                    <h1 className='phaseDetailsHeading'>Tower details | <span>No: of Towers: {overView.noOfTower}</span></h1>
                    {towers.map((eachTower, index)=>{
                        if(eachTower.phaseId == selectedPhaseId && eachTower.propType == propCgId && eachTower.isActive != "N"){
                            towerCount = towerCount + 1;
                            return(
                                <Fragment key={`eachTowerCrad_${eachTower.towerId}`}>
                                    <hr className='phaseDetailsHrLine' />
                                    <HeadingAndEditBox key="5PreviewHeading" heading={`Tower ${towerCount}`} identifier={5} setStep={setStep} />
                                    <p className='phaseDetailsContant'>Check the Tower {towerCount} details you filled like Name, Elevations</p>
                                    <div className='previewDetailsHoldInnerCon previewDetailsPhasesCon'>
                                        {noOfTower && noOfTower > 1 &&
                                        <ProjDetailBox className="previewPhaseBox" key="TowerName" icon={towerIcon} name="Tower Name" value={eachTower.towerName} />
                                        }
                                        <ProjDetailBox className="previewPhaseBox" key="TowerFloors" icon={floorsIcon} name="Total No: of Floors" value={eachTower.totalFloor} />

                                        <ProjDetailBox className="previewPhaseBox" key="towerBasement" icon={basementIcon} name="Basement" value={`${eachTower.elevationBasement}`} />
                                        {eachTower.noOfPodium !== undefined && eachTower.noOfPodium !== 0 &&
                                        <ProjDetailBox className="previewPhaseBox" key="noOfPodium" icon={podiumIcon} name="Podium" value={`${eachTower.noOfPodium}`} />
                                        }
                                        {(eachTower.elevationGround !== undefined || eachTower.elevationStilt !== undefined || eachTower.groundAndStilt !== undefined) &&
                                        <ProjDetailBox className="previewPhaseBox" key="towerRERASTATUS" icon={elevationIcon} name="Elevation" value={eachTower.elevationStilt !== undefined ? "Stilt" : eachTower.elevationGround !== undefined ? "Ground" : "Ground+Stilt" } />
                                        }
                                    </div>
                                </Fragment>
                        )}
                    })}
                </div>
                }

    {/* --- Tble comes HERE --- */}
                {propertyTypeDetails && propertyTypeDetails[propCgId] && propertyTypeDetails[propCgId].filter(each=>each.phaseId == selectedPhaseId).length > 0 ?
                <Fragment>
                    <HeadingAndEditBox key="12PreviewHeading" heading={`Unit Details Table Of ${propertyDetailsTypes.get(propCgId).name}`} identifier={12} setStep={setStep} />

                    <PropertyTypeTable
                        // prevPgIden={true}
                        data={propertyTypeDetails[propCgId].filter(each=>each.phaseId == selectedPhaseId)}
                        identifier={propCgId}
                        propertyTypeDetails={propertyTypeDetails}
                        idValidatar={idValidatar}
                        hideThings="true"
                        towers={towers}
                        propId={propCgId}
                        // externalCssForRows="externalCssForRows"
                        onImagePopup={onImagePopup}
                        selectedFilteredBhk={selectedFilteredBhk}
                        setSelectedFilteredBhk={setSelectedFilteredBhk}
                        setStep={setStep}
                        towercount={towers && selectedPhaseId !== undefined ? towers.filter(eachTower=> eachTower.propType == propCgId && eachTower.phaseId == selectedPhaseId && eachTower.isActive != "N").length : 0}
                        apartmentTypeList={apartmentTypeList}
                    />
                </Fragment>
                :
                <div className='verticalContainer'>
                    <p className='phaseAndPropShower'>{noUnitsSvgIcon} Currently, no units are available in Phase <span id='phaseNumberText2'> 1</span></p>
                </div>
                }

    {/* Maximum and Minimum Price Details */}
                {propPricing && propPricing[propCgId] && Object.keys(propPricing[propCgId]).length > 0 &&
                <div id='previewMinAndMaxMainCon' className='previewDetailsHoldCon previewMinAndMaxMainCon' style={{display: "none"}}>
                    <h1 className='phaseDetailsHeading'>Maximum and Minimum Price | <span>{propertyDetailsTypes.get(propCgId).name}</span></h1>
                    { repeatCounterForMinMax && repeatCounterForMinMax.get("count") === 0 && 
                    Object.keys(propPricing[propCgId]).map((eachKey, index)=>{
                        let priceData = propPricing[propCgId][eachKey][0]; 
                        if(priceData.phaseId == selectedPhaseId && priceData.isActive != "N"){
                            $("#previewMinAndMaxMainCon").show();
                            // repeatCounterForMinMax.set("count", 1);
                            return(
                                <Fragment key={`${priceData.id}`}>
                                    <hr className='phaseDetailsHrLine' />
                                    <HeadingAndEditBox key={`${priceData.id}PreviewHeading`} heading={propCgId != projectprops.plot ? bhkDetails && bhkDetails.get(parseInt(priceData.bhkId)) && bhkDetails.get(parseInt(priceData.bhkId)).name ? bhkDetails.get(parseInt(priceData.bhkId)).name : `${priceData.bhkCustom} BHK` : priceData.dimentions && priceData.dimentions.replace("_"," X ")} identifier={6} setStep={setStep} />
                                    <p className='phaseDetailsContant'>Check the minimum and maximum price</p>
                                    <div className='previewDetailsHoldInnerCon previewDetailsPhasesCon previewMinMaxBoxCon'>
                                        <ProjDetailBox className="previewPhaseBox previewPriseBox minAndMaxPricePreview" icon={cashIcon} key="MinimumPrice" iconWithText="Minimum Price" name={`₹ ${formatPriceToCommaPrice(priceData.minPrice)}`} value={inWords(priceData.minPrice)}/>
                                        <ProjDetailBox className="previewPhaseBox previewPriseBox minAndMaxPricePreview" icon={cashIcon} key="MaximumPrice" iconWithText="Maximum Price" name={`₹ ${formatPriceToCommaPrice(priceData.maxPrice)}`} value={inWords(priceData.maxPrice)} />
                                    </div>
                                </Fragment>
                            )
                        }
                    })}
                </div>
                }

                {/* phase Broucher */}
                {selectedPhaseBroucher !== undefined && selectedPhaseBroucher !== "" && data.isPhaseBroucher !== undefined && data.isPhaseBroucher == true && phaseCount > 1 &&
                <BrochureBox key="phaseBroucher1" setStep={setStep} title="Phase Brochure" BroucherUrl={selectedPhaseBroucher} />
                }
                
            </Fragment>
            : 
            <Fragment>
                <div className='previewDetailsHoldCon previewDetailsEmptyCon'>
                    <HeadingAndEditBox key="_PreviewHeading" heading="Properties Are Not Added Yet" identifier={4} setStep={setStep} />
                </div>

                {/* phase Broucher */}
                {selectedPhaseBroucher !== undefined && selectedPhaseBroucher !== "" && data.isPhaseBroucher !== undefined && data.isPhaseBroucher == true && phaseCount > 1 &&
                <BrochureBox key="phaseBroucher2" setStep={setStep} title="Phase Brochure" BroucherUrl={selectedPhaseBroucher} />
                }
            </Fragment>
            }
        </div>
  )
}
