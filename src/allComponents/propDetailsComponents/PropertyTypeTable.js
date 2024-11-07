import React, {useState, useEffect, Fragment, useRef} from "react";
import { EditIcon } from "../../images/commonSvgs";
import { bhkDetails, formatPriceToCommaPrice, itemScrollIntoView, loadergifuserprofile, map, projectprops } from "../../images/commonImages";
import SingleButton from "../../commonComponents/SingleButton";
import { getUnit } from "../../images/constant";
import PropertyRowLoader from "./PropertyRowLoader";


const PropertyTypeTable = ({identifier, propertyTypeDetails, idValidatar, hideThings, externalCssForRows,
                            onDeletingRow, previewData, data, openEditPopUp, onImagePopup, towercount, apartmentTypeList,
                            prevPgIden, towers, selectedFilteredBhk, setSelectedFilteredBhk, onDeleteAllUnits, setStep}) => {

    const [statusType, setStatusType ] = useState("add");
    const [nonCustomBhks, setNonCustomBhks] = useState([]);
    const [allCustomBhks, setAllCustomBhks] = useState([]);
    const [allPlots, setAllPlots] = useState([]);
    const [listItemsCount, setListItemsCount] = useState(30);
    const containerRef = useRef(null);

    let rowCount = 0;

    useEffect(()=>{
        rowCount = 0;
        setListItemsCount(30);
        const container = containerRef.current;

        if (container) {
            container.scrollTop = 0; 
        }

        let allBhks = data.length > 0 ? data.map((each)=>parseFloat(each.bhk)).filter((value, index, array) => array.indexOf(value) === index).sort() : [];

        setNonCustomBhks([...allBhks.filter(each=>parseFloat(each)<100000)]);
        setAllCustomBhks([...allBhks.filter(each=>parseFloat(each)>100000)]);
        setAllPlots([...data.filter((each)=>each.length !== undefined)]);

        // let finalArray = data.map((each)=>parseFloat(each.bhk));

        // if(finalArray && finalArray.includes && !finalArray.includes(selectedFilteredBhk)){
        //     setSelectedFilteredBhk(null);
        // }
    },[selectedFilteredBhk, data, statusType]);

    // const fetchMoreItems = (items) => {
    //     if(items.length >= listItemsCount){
    //         setListItemsCount((prevCount)=> prevCount + 30);
    //     }
    // };

    // useEffect(() => {
    //     const container = containerRef.current;
    //     let prevScrollPos = 0;
    
    //     if (container) {
    //     const handleScroll = () => {
    //         const currentScrollPos = container.scrollTop; 
    
    //         if (currentScrollPos > prevScrollPos && container.scrollHeight - container.scrollTop === container.clientHeight) {
    //             // Scrolling down and reached the bottom of the container
    //             fetchMoreItems(data);
    //         }
    
    //         prevScrollPos = currentScrollPos;
    //     };
    
    //     container.addEventListener('scroll', handleScroll);
    //     return () => container.removeEventListener('scroll', handleScroll);
    //     }
    // }, [data]);


    useEffect(() => {
        if(data.length >= listItemsCount){
            const items = document.querySelectorAll('.infinityItem');

            if (!items.length) return;

            const observerCallback = (entries, observer) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        if (entry.target.id === `item-${items.length - 1}`) {
                            // fetchMoreItems(items);
                            setListItemsCount((prevCount)=> prevCount + 30);
                            items.forEach(item => observer.unobserve(item));
                        }
                    } 
                });
            };

            const observerOptions = {
                root: null, // Use the viewport as the container
                rootMargin: '0px',
                threshold: 0.1, // Trigger callback when 10% of the element is visible
            };

            const observer = new IntersectionObserver(observerCallback, observerOptions);
            items.forEach(item => observer.observe(item));

            return () => {
                items.forEach(item => observer.unobserve(item));
            };
        }
       
    }, [listItemsCount, data]);

    
    return(
        <div id="IdForPreviewTable" className={prevPgIden?"propertyTypeHtmlTableConPreviewPage":"propertyTypeTableMainCon"}>

{/* BHK Filters */}
            {nonCustomBhks.length > 1 && identifier !== projectprops.plot &&
            <Fragment>
                <h3 className="bhkFiltersHeading">Quick Filter</h3>
                {hideThings && hideThings === "true" ?
                <p className="bhkFiltersContant">Explore the quick filter for BHK to see the unit details</p>
                :
                <p className="bhkFiltersContant">Make your floor plan upload easy by filter. Select Unit Type for easy floor plan upload</p>
                }
            </Fragment>
            }

            {(nonCustomBhks.length > 0 || allCustomBhks.length > 0) && identifier !== projectprops.plot &&
            <div className="bhkFilterBtnsHoldingCon" style={{ maxWidth: identifier === projectprops.apartment ? "1820px" : "1936px" }}>
                    
                {(nonCustomBhks.length > 1 || (nonCustomBhks.length > 0 && allCustomBhks.length > 0)) &&
                <SingleButton
                    key={`allBhkFilterBtn`}
                    buttonId={`allBhkFilterBtn`}
                    containerClassName=""
                    buttonClassName={`bhksFilterBtn ${selectedFilteredBhk === null ? "bhksFilterSelectedBtn" : "" } `}
                    onSubmit={()=>setSelectedFilteredBhk(null)}
                    title="All BHK"
                />
                }

                {(nonCustomBhks.length > 1 || (nonCustomBhks.length > 0 && allCustomBhks.length > 0)) &&
                nonCustomBhks.map((eachBhk, index)=>{
                    return(
                        <SingleButton
                            key={`filterBtns_${index}`}
                            buttonId={`filterBtns_${index}`}
                            containerClassName=""
                            buttonClassName={`bhksFilterBtn ${selectedFilteredBhk == eachBhk ? "bhksFilterSelectedBtn" : "" } `}
                            onSubmit={()=>setSelectedFilteredBhk(selectedFilteredBhk != eachBhk ? eachBhk : null)}
                            title={bhkDetails && bhkDetails.get(parseInt(eachBhk)) && bhkDetails.get(parseInt(eachBhk)).name ? bhkDetails.get(parseInt(eachBhk)).name : ""}
                        />
                    )
                })}
                
                {nonCustomBhks.length > 0 && allCustomBhks.length > 0 &&
                <SingleButton
                    key={`filterBtns_`}
                    buttonId={`filterBtns_`}
                    containerClassName=""
                    buttonClassName={`bhksFilterBtn ${selectedFilteredBhk === 100000 ? "bhksFilterSelectedBtn" : "" } `}
                    onSubmit={()=>setSelectedFilteredBhk(selectedFilteredBhk !== 100000 ? 100000 : null)}
                    title="Custom BHK’s"
                />
                }

                {hideThings != "true" &&
                <SingleButton
                    key={`DeleteAllUnits`}
                    buttonId={`DeleteAllUnits`}
                    containerClassName="DeleteAllUnitsCon"
                    buttonClassName="DeleteAllUnits"
                    onSubmit={()=>onDeleteAllUnits("open")}
                    title={`Delete ${
                        selectedFilteredBhk !== null ? 
                        selectedFilteredBhk < 100000 && bhkDetails && bhkDetails.get(parseInt(selectedFilteredBhk)) && bhkDetails.get(parseInt(selectedFilteredBhk)).name ? 
                            bhkDetails.get(parseInt(selectedFilteredBhk)).name : "Custom " : "All "} Units`}

                    icon={<svg className="DeleteAllUnitsIcon" xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                            <path d="M13.3723 7.65791L13.3459 15.9912L6.67932 15.9701L6.70571 7.6368L13.3723 7.65791ZM12.1382 2.65398L7.97154 2.64078L7.13557 3.47147L4.21892 3.46224L4.21364 5.12889L15.8802 5.16584L15.8855 3.49919L12.9689 3.48995L12.1382 2.65398ZM15.0443 5.99653L5.04433 5.96486L5.01266 15.9648C5.00975 16.8815 5.75738 17.6338 6.67404 17.6367L13.3407 17.6579C14.2573 17.6608 15.0097 16.9131 15.0126 15.9965L15.0443 5.99653Z" fill="#4D6677"/>
                        </svg>}
                />
                }

            </div>
            }

            {identifier == projectprops.plot && allPlots.length > 0 && hideThings != "true" &&
            <div className="bhkFilterBtnsHoldingCon plotDeleteBtnsHoldingCon">
                <SingleButton
                    key={`DeleteAllPlots`}
                    buttonId={`DeleteAllPlots`}
                    containerClassName="DeleteAllUnitsCon"
                    buttonClassName="DeleteAllUnits"
                    onSubmit={()=>onDeleteAllUnits("open")}
                    title={`Delete All Units`}
                    icon={<svg className="DeleteAllUnitsIcon" xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                            <path d="M13.3723 7.65791L13.3459 15.9912L6.67932 15.9701L6.70571 7.6368L13.3723 7.65791ZM12.1382 2.65398L7.97154 2.64078L7.13557 3.47147L4.21892 3.46224L4.21364 5.12889L15.8802 5.16584L15.8855 3.49919L12.9689 3.48995L12.1382 2.65398ZM15.0443 5.99653L5.04433 5.96486L5.01266 15.9648C5.00975 16.8815 5.75738 17.6338 6.67404 17.6367L13.3407 17.6579C14.2573 17.6608 15.0097 16.9131 15.0126 15.9965L15.0443 5.99653Z" fill="#4D6677"/>
                        </svg>}
                />
            </div>
            }

            {/* Popup Box */}
			
            <div className={`propertyTypeHtmlTableCon propTableRowsHoldingCon ${identifier == projectprops.plot ? "ifPlotTable" : ""}`} ref={containerRef}>
            <table>
                <thead>
                    <tr className="propertyTypeTableHeaderCon">   
                        {/* {hideThings != "true" && */}
                        <th className="headerBlock colOne">S. no</th>
                        
{/* unit number display for plot */}
                        { projectprops.plot == identifier && 
                        <th id="unitNumber_header_one" className="headerBlock colOneUnitNumber">Unit Number ( in sq.ft )<span className="requiredStar">*</span></th>
                        }

                        {idValidatar("aptType", identifier) && (identifier == projectprops.apartment || identifier == projectprops.villament ) &&
                        <th id="aptType_header" className={`headerBlock ${prevPgIden ? "" : "colTwo"}`}>{identifier == projectprops.apartment ? "Apartment" : "Villament"} Type<span className="requiredStar">*</span></th>
                        }

                        {hideThings != "true" &&
                        <th className={`headerBlock ${(identifier == projectprops.apartment || identifier == projectprops.villament ) ? "actionConOne" :  "actionConOne2"}`}>Action</th>  
                        }

                        {idValidatar("unitType", identifier) &&
                        <th id="unitType_header" className="headerBlock carpetArea">Unit Type<span className="requiredStar">*</span></th>
                        }

                        {idValidatar("towers", identifier) &&
                        <th id="towers_header" className="headerBlock carpetArea">Towers<span className="requiredStar">*</span></th>
                        }

                        {idValidatar("blocks", identifier) &&
                        <th id="blocks_header" className="headerBlock carpetArea">Block (if available)</th>
                        }

                        {idValidatar("floors", identifier) &&
                        <th id="floors_header" className="headerBlock">Property on Floor<span className="requiredStar">*</span></th>
                        }
                        {idValidatar("Elevations", identifier) &&
                        <th id="floors_header" className="headerBlock">Elevations<span className="requiredStar">*</span></th>
                        }
{/* unit number hide for plot */}

                        <th id="unitNumber_header" className={`headerBlock ${projectprops.plot != identifier ? "colTwoUnitNumber" : "forPlotColumnTwo"}`}>Unit Number<span className="requiredStar">*</span></th>

                        {idValidatar("unitFacing", identifier) &&
                        <th id="unitFacing_header" className="headerBlock">Unit Facing<span className="requiredStar">*</span></th>
                        }

                        {idValidatar("superBuildUpArea", identifier) &&
                        <th id="superBuildUpArea_header" className="headerBlock superBuildUpArea">{`Super Built-up Area ( in sq.ft )`}<span className="requiredStar">*</span></th> 
                        }

                        {idValidatar("carpetArea", identifier) &&
                        <th id="carpetArea_header" className="headerBlock carpetArea">{`Carpet Area ( in sq.ft )`}<span className="requiredStar">*</span></th>
                        }

                        {idValidatar("carParking", identifier) &&
                        <th id="superBuildUpArea_header" className="headerBlock carpetArea">No: of Car Parking<span className="requiredStar">*</span></th> 
                        }

                        {idValidatar("openParking", identifier) &&
                        <th id="carpetArea_header" className="headerBlock superBuildUpArea">Parking Open/Covered</th>
                        }

                        {idValidatar("area", identifier) &&
                        <th id="area_header" className="headerBlock superBuildUpArea">{`Total Parking Area ( in sq.ft )`}{/* <span className="requiredStar">*</span> */}</th>
                        }

                        {idValidatar("gardenSpace", identifier) &&
                        <th id="gardenSpace_header" className="headerBlock superBuildUpArea">{`Garden Area ( in sq.ft )`}</th>
                        }

                        {idValidatar("terracespace", identifier) &&
                        <th id="terracespace_header" className="headerBlock superBuildUpArea">{`Terrace Area ( in sq.ft )`}</th>
                        }


                        {idValidatar("plotArea", identifier) &&
                        <th id="plotArea_header" className="headerBlock superBuildUpArea">{`Plot Area  ( in sq.ft )`}<span className="requiredStar">*</span></th>
                        }

                        {idValidatar("lengthOfPlot", identifier) &&
                        <th id="lengthOfPlot_header" className="headerBlock lengthAndBreadth">{`Length of Plot ( in feet )`}<span className="requiredStar">*</span></th>
                        }

                        {idValidatar("breadthOfPlot", identifier) &&
                        <th id="breadthOfPlot_header" className="headerBlock lengthAndBreadth">{`Breadth Of Plot ( in feet )`}<span className="requiredStar">*</span></th>
                        }


                        {identifier == 32 &&
                        <th id="plotFacing_header" className="headerBlock">Plot Facing<span className="requiredStar">*</span></th>
                        }

                        {idValidatar("balcony", identifier) &&
                        <th id="balcony_header" className="headerBlock carpetArea">Total No: of Balconies<span className="requiredStar">*</span></th>
                        }

                        {idValidatar("totalBalconySize", identifier) &&
                        <th id="balconySize_header" className="headerBlock superBuildUpArea">{`Total Balcony Size ( in sq.ft )`}{/* <span className="requiredStar">*</span> */}</th>
                        }

                        {idValidatar("bathrooms", identifier) &&
                        <th id="bathrooms_header" className="headerBlock carpetArea">Total No: of Bathrooms<span className="requiredStar">*</span></th>
                        }

                        <th id="tableFloorplansHeader" className="headerBlock floorplanContainerTwo">Floor Plan</th>
                        
                        {hideThings != "true" &&
                        <th className="headerBlock actionConTwo">Action</th>   
                        } 
                    </tr>
                </thead>

{/* Displaying Rows */}
                <tbody>
                    <div>
                    {data != undefined && data != null && data.length != 0 &&
                        data.map((eachRow, index)=>{ 
                            
                            if(eachRow.propType == identifier && eachRow.isDeleted != 'Y'){

                                if((selectedFilteredBhk < 100000 && eachRow.bhk == selectedFilteredBhk) || (selectedFilteredBhk === 100000 && parseInt(eachRow.bhk) > 100000 ) || selectedFilteredBhk === null ){
                                    
                                    rowCount = rowCount + 1;

                                    if(rowCount-1 < listItemsCount){
                                        //onChangeData();
                                        return(
                                            <div key={`rows_${rowCount-1}`} className="infinityItem" id={`item-${rowCount-1}`} >
                                                <tr className={`propertyTypeTableInputsCon ${externalCssForRows && externalCssForRows !== "" ? externalCssForRows : ""}`}>
                                                    {/* {hideThings != "true" && */}
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF",  minWidth:"40.25px"}} className="inputBlock colOne">        
                                                        {rowCount}    
                                                    </td>

        {/* unit number display for plot */}
                                                    { projectprops.plot == identifier && eachRow.unitNumber != undefined && eachRow.unitNumber != null &&
                                                    <td title={eachRow.unitNumber ? eachRow.unitNumber : ""} style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className={`inputBlock colOneUnitNumber`}>
                                                        <span className="towerTableBlock">
                                                            {eachRow.unitNumber.length > 8 ? `${eachRow.unitNumber.slice(0, 8)}...` : eachRow.unitNumber}
                                                        </span>
                                                    </td>
                                                    }

                                                    {idValidatar("aptType", identifier) && (identifier == projectprops.apartment || identifier == projectprops.villament ) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className={`inputBlock ${prevPgIden ? "prevwColone" : "colTwo"}`}>        
                                                        {eachRow.aptType != undefined && eachRow.aptType != null ? getUnit(eachRow.aptType, apartmentTypeList) : identifier == projectprops.apartment ? "Apartment" : "Villament"
                                                        }
                                                    </td>
                                                    }

                                                    {hideThings != "true" &&
                                                    <td style={{background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className={`inputBlock viewIconsCon ${(identifier == projectprops.apartment || identifier == projectprops.villament ) ? "actionConOne" :  "actionConOne2"}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" onClick={()=>{onImagePopup("OPEN", eachRow); setStatusType("")}} height="19" viewBox="0 0 19 19" fill="none" className="viewTools">
                                                            <g clipPath="url(#clip0_1410_6118)">
                                                                <path d="M9.78365 3.12421C15.4086 3.14202 18.764 9.34018 18.764 9.34018C18.764 9.34018 15.3694 15.517 9.74445 15.4991C4.11948 15.4813 0.764095 9.28317 0.764095 9.28317C0.764095 9.28317 4.15867 3.10639 9.78365 3.12421ZM9.78008 4.2492C5.8201 4.23666 3.01628 7.88517 2.08596 9.28736C3.00626 10.6943 5.78691 14.3616 9.74802 14.3742C13.708 14.3867 16.5118 10.7382 17.4421 9.33599C16.5218 7.92907 13.7412 4.26175 9.78008 4.2492ZM9.77652 5.3742C10.8208 5.3775 11.821 5.79552 12.5571 6.53628C13.2932 7.27704 13.7048 8.27986 13.7015 9.32415C13.6982 10.3684 13.2802 11.3686 12.5395 12.1047C11.7987 12.8408 10.7959 13.2525 9.75158 13.2492C8.70729 13.2458 7.70709 12.8278 6.97101 12.0871C6.23493 11.3463 5.82326 10.3435 5.82657 9.29921C5.82988 8.25492 6.24789 7.25472 6.98865 6.51864C7.72941 5.78256 8.73224 5.37089 9.77652 5.3742ZM9.77296 6.49919C9.02731 6.49772 8.31152 6.79206 7.7826 7.31764C7.25368 7.84322 6.95482 8.55713 6.95156 9.30277C6.94665 10.853 8.20377 12.1192 9.75514 12.1242C11.3065 12.1291 12.5716 10.8708 12.5765 9.32058C12.5814 7.77034 11.3243 6.5041 9.77296 6.49919Z" fill="#767270"/>
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_1410_6118">
                                                                <rect width="18" height="18" fill="#EFEFEF" transform="translate(0.791504 0.283203) rotate(0.181465)"/>
                                                                </clipPath>
                                                            </defs>
                                                        </svg>

                                                        <EditIcon  iconId={"editBtn_2"+eachRow.id} className={"propertyTableEditIcon"} onClick={()=>{openEditPopUp(eachRow); setStatusType("edit")}} />
                                    
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none" className="viewTools" onClick={()=>{onDeletingRow({...eachRow,"isDeleted":"Y"}); setStatusType("delete")}}>
                                                            <path d="M12.8832 7.07103L12.8594 14.571L6.85944 14.552L6.8832 7.05203L12.8832 7.07103ZM11.7724 2.56749L8.02244 2.55561L7.27007 3.30323L4.64509 3.29492L4.64033 4.79491L15.1403 4.82817L15.145 3.32817L12.52 3.31986L11.7724 2.56749ZM14.3879 5.57579L5.38796 5.54728L5.35945 14.5472C5.35684 15.3722 6.0297 16.0494 6.85469 16.052L12.8547 16.071C13.6797 16.0736 14.3568 15.4007 14.3594 14.5757L14.3879 5.57579Z" fill="#FF0000"/>
                                                        </svg>
                                                    </td>
                                                    }


                                                    {idValidatar("unitType", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className={`inputBlock carpetArea`}>        
                                                        {eachRow.bhkCustom != undefined && eachRow.bhkCustom != null ? 
                                                            `${eachRow.bhkCustom} BHK` : eachRow.bhk != undefined && eachRow.bhk != null ? 
                                                            bhkDetails && bhkDetails.get(parseInt(eachRow.bhk)) && bhkDetails.get(parseInt(eachRow.bhk)).name ? bhkDetails.get(parseInt(eachRow.bhk)).name : ""
                                                            : ""
                                                        }
                                                    </td>
                                                    }
                                                    
                                                    {idValidatar("towers", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock carpetArea">
                                                        {eachRow.tower != undefined && eachRow.tower != null ? towers.map((eachower,ind)=>{
                                                            if(eachower.towerId ==  eachRow.tower){
                                                            return (
                                                                <div title={eachower.towerName ? eachower.towerName : ""} className="towerNameColBlock">
                                                                    {eachower.towerName !== undefined && eachower.towerName !== null &&
                                                                    <span className="towerTableBlock">
                                                                        {eachower.towerName.length > 8 ? `${eachower.towerName.slice(0, 8)}...` : eachower.towerName}
                                                                    </span>
                                                                    }
                                                                </div>
                                                                )
                                                            }
                                                        }) : ""}                                             
                                                    </td>
                                                    }

                                                    {idValidatar("blocks", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock carpetArea">
                                                        {eachRow.block != undefined && eachRow.block != null && eachRow.block != "" ? 
                                                            <Fragment>
                                                                {eachRow.block.length > 8 ? `${eachRow.block.slice(0, 8)}...` : eachRow.block }
                                                            </Fragment>
                                                        : "NA"}   
                                                    </td>
                                                    }

                                                    {idValidatar("floors", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock">
                                                        {eachRow.floor != undefined && eachRow.floor != null ? eachRow.floor == 0 ? "G" : eachRow.floor : ""}  
                                                    </td>
                                                    }
                                                    {idValidatar("Elevations", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock">
                                                        {eachRow.floor != undefined && eachRow.floor != null ? eachRow.isBasement != undefined && eachRow.isBasement != null && eachRow.isBasement == "Y" ? `B+G+${eachRow.floor}` : `G+${eachRow.floor}`  : ""}  
                                                    </td>
                                                    }
                                                    
                                                    <td title={eachRow.unitNumber ? eachRow.unitNumber : ""} style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className={`inputBlock ${projectprops.plot != identifier ? "colTwoUnitNumber" : "forPlotColumnTwo"}`}>
                                                        <span className="towerTableBlock">
                                                            {eachRow.unitNumber.length > 8 ? `${eachRow.unitNumber.slice(0, 8)}...` : eachRow.unitNumber}
                                                        </span>
                                                    </td>

                                                    {idValidatar("unitFacing", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock">
                                                        {eachRow.facingCustom != undefined && eachRow.facingCustom != null ? 
                                                        eachRow.facingCustom :
                                                        eachRow.facing != undefined && eachRow.facing != null ? map != undefined && map.has(eachRow.facing+"") ? map.get(eachRow.facing+"") : eachRow.facing  : ""
                                                        }                                            
                                                    </td>
                                                    }

                                                    {idValidatar("superBuildUpArea", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock superBuildUpArea">
                                                        {eachRow.superBuildUpArea != undefined && eachRow.superBuildUpArea != null ? formatPriceToCommaPrice(eachRow.superBuildUpArea) : ""}     
                                                    </td>
                                                    }

                                                    {idValidatar("carpetArea", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock carpetArea">
                                                        {eachRow.carpetArea != undefined && eachRow.carpetArea != null ? formatPriceToCommaPrice(eachRow.carpetArea) : ""}   
                                                    </td>
                                                    }

                                                    {idValidatar("carParking", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock carpetArea">
                                                        {eachRow.noOfCarParking != undefined && eachRow.noOfCarParking != null ? eachRow.noOfCarParking === 0 ? "NA" : eachRow.noOfCarParking : ""}   
                                                        
                                                    </td>
                                                    }

                                                    {idValidatar("openParking", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock superBuildUpArea">
                                                        {eachRow.parkingType != undefined && eachRow.parkingType != null ? eachRow.parkingType : "NA" }   
                                                        
                                                    </td>
                                                    }

                                                    {idValidatar("area", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock superBuildUpArea">
                                                        {eachRow.parkingArea != undefined && eachRow.parkingArea != null && eachRow.parkingArea != "" ? formatPriceToCommaPrice(eachRow.parkingArea) : "NA"}   
                                                    </td>
                                                    }


                                                    {idValidatar("gardenSpace", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock superBuildUpArea">
                                                        {eachRow.gardenArea != undefined && eachRow.gardenArea != null && eachRow.gardenArea != ""? formatPriceToCommaPrice(eachRow.gardenArea) : "NA"}   
                                                    </td>
                                                    }

                                                    {idValidatar("terracespace", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock superBuildUpArea">
                                                        {eachRow.terraceArea != undefined && eachRow.terraceArea != null && eachRow.terraceArea != ""?
                                                             formatPriceToCommaPrice(eachRow.terraceArea) : "NA"}     
                                                    </td>
                                                    }

                                                    
                                                    {idValidatar("plotArea", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock superBuildUpArea">
                                                        {eachRow.plotArea != undefined && eachRow.plotArea != null ? formatPriceToCommaPrice(eachRow.plotArea) : ""}   
                                                    </td>
                                                    }

                                                    {idValidatar("lengthOfPlot", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock lengthAndBreadth">
                                                        {eachRow.length != undefined && eachRow.length != null ? formatPriceToCommaPrice(eachRow.length) : ""}   
                                                    </td>
                                                    }

                                                    {idValidatar("breadthOfPlot", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock lengthAndBreadth">
                                                        {eachRow.width != undefined && eachRow.width != null ? formatPriceToCommaPrice(eachRow.width) : ""} 
                                                    </td>
                                                    }

                                                    {idValidatar("plotFacing", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock">
                                                        {eachRow.facingCustom != undefined && eachRow.facingCustom != null ? 
                                                        eachRow.facingCustom :
                                                        eachRow.facing != undefined && eachRow.facing != null ? map != undefined && map.has(eachRow.facing+"") ? map.get(eachRow.facing+"") : eachRow.facing  : ""
                                                        }                                            
                                                    </td>
                                                    }

                                                    {idValidatar("balcony", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock carpetArea">
                                                        {eachRow.balcony != undefined && eachRow.balcony != null ? eachRow.balcony : ""}  
                                                    </td>
                                                    }

                                                    {idValidatar("totalBalconySize", identifier) &&
                                                    <td style={{ background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock superBuildUpArea">
                                                        {eachRow.balconyArea != undefined && eachRow.balconyArea != null && eachRow.balconyArea != "" ? 
                                                            formatPriceToCommaPrice(eachRow.balconyArea) : "NA"}   
                                                    </td>
                                                    }

                                                    {idValidatar("bathrooms", identifier) &&
                                                    <td style={{ background : (rowCount%2) === 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock carpetArea">
                                                        {eachRow.bathroom !== undefined && eachRow.bathroom != null ? eachRow.bathroom : ""}  
                                                    </td>
                                                    }
                                                    <td style={{background : (rowCount%2) === 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock floorplanContainerTwo"  
                                                        // onClick={ hideThings !== "true" ? ()=> {onImagePopup("OPEN", eachRow); setStatusType("")} : eachRow != undefined && eachRow.floorPlanUrl != undefined ? ()=>{onImagePopup("OPEN", eachRow); setStatusType("")} : ()=>{setStep(1), itemScrollIntoView("IdForPreviewTable");}}>
                                                    
                                                        onClick={()=>{
                                                            if(hideThings !== "true"){
                                                                onImagePopup("OPEN", eachRow); setStatusType("")
                                                            }else{
                                                                if(eachRow !== undefined && eachRow.floorPlanUrl !== undefined){
                                                                    onImagePopup("OPEN", eachRow); 
                                                                    setStatusType("");
                                                                }else{
                                                                    setStep(1); 
                                                                    itemScrollIntoView("IdForPreviewTable")
                                                                }
                                                            }
                                                        } 
                                                        }
                                                    >
                                                        

                                                        <label id={"tableImageLable_"+eachRow.id} className="propTableMediaCon">
                                                        {eachRow != undefined && eachRow.floorPlanUrl != undefined ? 
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" viewBox="0 0 10 13" fill="none">
                                                                <path d="M9.5 11C9.5 11.3978 9.34196 11.7794 9.06066 12.0607C8.77936 12.342 8.39782 12.5 8 12.5H2C1.60218 12.5 1.22064 12.342 0.93934 12.0607C0.658035 11.7794 0.5 11.3978 0.5 11V2C0.5 1.60218 0.658035 1.22064 0.93934 0.93934C1.22064 0.658035 1.60218 0.5 2 0.5L6.125 0.5L9.5 3.875V11ZM2 1.25C1.80109 1.25 1.61032 1.32902 1.46967 1.46967C1.32902 1.61032 1.25 1.80109 1.25 2V9.5L2.918 7.832C2.97711 7.77303 3.05421 7.73547 3.13709 7.72528C3.21996 7.71509 3.30386 7.73285 3.3755 7.77575L5 8.75L6.61775 6.485C6.6494 6.44073 6.69031 6.40388 6.73764 6.37701C6.78497 6.35014 6.83757 6.3339 6.89181 6.3294C6.94605 6.32491 7.00061 6.33227 7.05171 6.35098C7.10282 6.36969 7.14924 6.3993 7.18775 6.43775L8.75 8V3.875H7.25C6.95163 3.875 6.66548 3.75647 6.4545 3.5455C6.24353 3.33452 6.125 3.04837 6.125 2.75V1.25H2Z" fill="#0F91D2"/>
                                                            </svg>
                                                            :
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M4.72656 12.1869C4.87575 12.1869 5.01882 12.2461 5.12431 12.3516C5.2298 12.4571 5.28906 12.6002 5.28906 12.7494V14.2494C5.28906 14.3529 5.37306 14.4369 5.47656 14.4369H14.4766C14.5263 14.4369 14.574 14.4171 14.6091 14.382C14.6443 14.3468 14.6641 14.2991 14.6641 14.2494V12.7494C14.6641 12.6002 14.7233 12.4571 14.8288 12.3516C14.9343 12.2461 15.0774 12.1869 15.2266 12.1869C15.3757 12.1869 15.5188 12.2461 15.6243 12.3516C15.7298 12.4571 15.7891 12.6002 15.7891 12.7494V14.2494C15.7891 14.5975 15.6508 14.9313 15.4046 15.1775C15.1585 15.4236 14.8247 15.5619 14.4766 15.5619H5.47656C5.12847 15.5619 4.79463 15.4236 4.54848 15.1775C4.30234 14.9313 4.16406 14.5975 4.16406 14.2494V12.7494C4.16406 12.6002 4.22333 12.4571 4.32881 12.3516C4.4343 12.2461 4.57738 12.1869 4.72656 12.1869ZM9.03006 12.0946C8.84393 12.0948 8.6645 12.0252 8.52718 11.8995C8.38987 11.7739 8.30464 11.6013 8.28831 11.4159C8.1734 10.1015 8.15335 8.78061 8.22831 7.46338C8.04296 7.45301 7.8577 7.44101 7.67256 7.42738L6.55506 7.34563C6.45664 7.33842 6.36178 7.30578 6.27977 7.25091C6.19775 7.19604 6.13138 7.12081 6.08716 7.03259C6.04293 6.94437 6.02237 6.84618 6.02748 6.74764C6.03259 6.64909 6.0632 6.55355 6.11631 6.47038C6.91273 5.22379 7.93896 4.14003 9.14031 3.27688L9.58806 2.95513C9.70128 2.87382 9.83717 2.83008 9.97656 2.83008C10.116 2.83008 10.2518 2.87382 10.3651 2.95513L10.8128 3.27763C12.0141 4.14057 13.0403 5.22407 13.8368 6.47038C13.8899 6.55355 13.9205 6.64909 13.9256 6.74764C13.9308 6.84618 13.9102 6.94437 13.866 7.03259C13.8217 7.12081 13.7554 7.19604 13.6734 7.25091C13.5913 7.30578 13.4965 7.33842 13.3981 7.34563L12.2806 7.42738C12.0961 7.44088 11.9108 7.45288 11.7256 7.46263C11.8006 8.78038 11.7796 10.1011 11.6641 11.4151C11.6479 11.6006 11.5629 11.7732 11.4257 11.899C11.2885 12.0248 11.1092 12.0946 10.9231 12.0946H9.03006Z" fill="#148B16"/>
                                                            </svg>
                                                            }
                                                            <span className={eachRow != undefined && eachRow.floorPlanUrl !== undefined ? "" : "propTableNoMediaName"}> {eachRow != undefined && eachRow.floorPlanUrl != undefined ? "Image" : "Add Image" } </span>
                                                        </label>

                                                        <img id={"tableImageLoader_"+eachRow.id} style={{display: "none"}} src={loadergifuserprofile} alt="Loading..." className="propTableImageLoader" />
                                                        
                                                    </td>

                                                    {hideThings != "true" &&
                                                    <td style={{background : (rowCount%2) == 0 ? "#FCFCFC" : "#EFEFEF"}} className="inputBlock viewIconsCon actionConTwo">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" onClick={()=>{onImagePopup("OPEN", eachRow); setStatusType("")}} height="19" viewBox="0 0 19 19" fill="none" className="viewTools">
                                                            <g clipPath="url(#clip0_1410_6118)">
                                                                <path d="M9.78365 3.12421C15.4086 3.14202 18.764 9.34018 18.764 9.34018C18.764 9.34018 15.3694 15.517 9.74445 15.4991C4.11948 15.4813 0.764095 9.28317 0.764095 9.28317C0.764095 9.28317 4.15867 3.10639 9.78365 3.12421ZM9.78008 4.2492C5.8201 4.23666 3.01628 7.88517 2.08596 9.28736C3.00626 10.6943 5.78691 14.3616 9.74802 14.3742C13.708 14.3867 16.5118 10.7382 17.4421 9.33599C16.5218 7.92907 13.7412 4.26175 9.78008 4.2492ZM9.77652 5.3742C10.8208 5.3775 11.821 5.79552 12.5571 6.53628C13.2932 7.27704 13.7048 8.27986 13.7015 9.32415C13.6982 10.3684 13.2802 11.3686 12.5395 12.1047C11.7987 12.8408 10.7959 13.2525 9.75158 13.2492C8.70729 13.2458 7.70709 12.8278 6.97101 12.0871C6.23493 11.3463 5.82326 10.3435 5.82657 9.29921C5.82988 8.25492 6.24789 7.25472 6.98865 6.51864C7.72941 5.78256 8.73224 5.37089 9.77652 5.3742ZM9.77296 6.49919C9.02731 6.49772 8.31152 6.79206 7.7826 7.31764C7.25368 7.84322 6.95482 8.55713 6.95156 9.30277C6.94665 10.853 8.20377 12.1192 9.75514 12.1242C11.3065 12.1291 12.5716 10.8708 12.5765 9.32058C12.5814 7.77034 11.3243 6.5041 9.77296 6.49919Z" fill="#767270"/>
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_1410_6118">
                                                                <rect width="18" height="18" fill="#EFEFEF" transform="translate(0.791504 0.283203) rotate(0.181465)"/>
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                        
                                                        <EditIcon  iconId={"editBtn_"+eachRow.id} className={"propertyTableEditIcon"} onClick={()=>{openEditPopUp(eachRow); setStatusType("edit")}} />
                                    
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none" className="viewTools" onClick={()=>{onDeletingRow({...eachRow,"isDeleted":"Y"}); setStatusType("delete")}}>
                                                            <path d="M12.8832 7.07103L12.8594 14.571L6.85944 14.552L6.8832 7.05203L12.8832 7.07103ZM11.7724 2.56749L8.02244 2.55561L7.27007 3.30323L4.64509 3.29492L4.64033 4.79491L15.1403 4.82817L15.145 3.32817L12.52 3.31986L11.7724 2.56749ZM14.3879 5.57579L5.38796 5.54728L5.35945 14.5472C5.35684 15.3722 6.0297 16.0494 6.85469 16.052L12.8547 16.071C13.6797 16.0736 14.3568 15.4007 14.3594 14.5757L14.3879 5.57579Z" fill="#FF0000"/>
                                                        </svg>
                                                    </td>
                                                    }

                                                </tr> 
                                                
                                                {hideThings !== "true" &&
                                                <div id={`delete_${eachRow.id}`} style={{display: "none"}} className="propertyTypeTableInputsCon">
                                                    <PropertyRowLoader
                                                        propertyTypeDetails={propertyTypeDetails} 
                                                        statusType={statusType} 
                                                        previewData={eachRow} 
                                                        onDeletingRow={onDeletingRow}
                                                        rowId={eachRow.id}
                                                    />
                                                </div>
                                                }
                                            </div>
                                        )}
                                }
                            }      
                        })
                    }
                    </div>
                </tbody>
            </table>
            </div>


{/* Rows Adding Status with Loader */}
            {hideThings != "true" &&
            <div id="rowLoaderAndStatusCon" className="propertyTypeTableInputsCon">
                <PropertyRowLoader 
                    propertyTypeDetails={propertyTypeDetails} 
                    statusType={statusType} 
                    setStatusType={setStatusType} 
                    previewData={previewData} 
                    onDeletingRow={onDeletingRow}
                />
            </div>
            }

            
            <div className="scrollAddmoreCOn">
                {hideThings != "true" &&
                <button className="propTypesAddMoreBtn" onClick={()=>{openEditPopUp({}); setStatusType("add")}}>
                    {data == undefined || data == null || data.length == 0 ? 
                    "+ Click to Add your First Unit"
                    :
                    "+ Click To Add more Units"
                    }
                </button>
                }

                {data == undefined || data == null || data.length == 0 ? "":
                    <p className="scrollMepara">{ prevPgIden?"Scroll to see all units you added":"scroll to see more"}</p>
                }
            </div>
            
        
        </div>
    )
};

export default PropertyTypeTable;