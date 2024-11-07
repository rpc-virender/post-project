import React, { useEffect, useState } from "react";
import $ from 'jquery';

import Input from "../../commonComponents/Input";
import { projectprops, inWords, formatPriceToCommaPrice } from "../../images/commonImages";
import { convertSqmetersIntoSqft } from "../../images/constant";
import ProjProptowerComp from "./propjProptowerComp";

const PropertiesFeedingBlock = ({
  propTypeId,
  data,
  onChange,
  towers,
  setTowers,
  setNoofTower,
  setvillamenttower,
  selectedPhase,
  setSelectedPhase,
  setIsEditTower,
}) => {
  const [currentTowers, setCurrentTowers] = useState([]);

  useEffect(() => {
    if (
      propTypeId === projectprops.apartment ||
      propTypeId === projectprops.villament
    ) {
      const dd = towers.filter(
        (c) => c.propType === propTypeId && c.phaseId === selectedPhase
      );
      setCurrentTowers(dd || []);
    }

    if (propTypeId === projectprops.villament) {
      setvillamenttower(data ? data.noOfTower : 0);
    }
  }, [propTypeId, selectedPhase, towers]);

  useEffect(() => {
    if (propTypeId === projectprops.apartment) {
      setNoofTower( data !== undefined && data.noOfTower !== undefined && data.noOfTower != null ? data.noOfTower : 0 );
      if (
        (data !== undefined && data.elevationGround != null) ||
        (data !== undefined && data.elevation === "elevationGround")
      ) {
        $("#elevationGround_" + propTypeId).prop("checked", true);
      } else if (
        (data !== undefined && data.elevationStilt != null) ||
        (data !== undefined && data.elevation === "elevationStilt")
      ) {
        $("#elevationStilt_" + propTypeId).prop("checked", true);
      } else {
        $("#elevationGround_" + propTypeId).prop("checked", false);
        $("#elevationStilt_" + propTypeId).prop("checked", false);
      }
    }
  }, [data]);

  const updateNoofTower = (e) => {
    let towerCount;
    let value = (e.target.value !== "" && e.target.value !== 0) ? Math.trunc(e.target.value) : "";
    if (value <= 150 || value === "") {
      towerCount = value !== undefined && value !== "" ? value : 0;
      onChange(e);

      if (propTypeId === projectprops.apartment) {
        setNoofTower(towerCount);
      } else if (propTypeId === projectprops.villament) {
        setvillamenttower(towerCount);
      };

      let i = 0;
      const newdata = towers ? 
          towers.filter( (c) => (selectedPhase !== null && selectedPhase !== undefined && c && c.propType === propTypeId && c.phaseId === selectedPhase ) ||
              (selectedPhase === null && c && c.propType === propTypeId)
          ).map((c) => { i++;
            return c;
          })
      : [];

      const newaddedTower = [];
      for (; i < parseInt(towerCount); i++) {
        let newTowerName = parseInt(towerCount) === 1 ? "Single Tower" : ""

        newdata.push({
          towerName: newTowerName,
          propType: propTypeId,
          phaseId: selectedPhase != null ? selectedPhase : null,
        });

        newaddedTower.push({
          towerName: newTowerName,
          propType: propTypeId,
          phaseId: selectedPhase != null ? selectedPhase : null,
        });
      }

      if(parseInt(towerCount) === 1){
          let firstObj = newdata[0] !== undefined ? {...newdata[0]} : {};
          if(firstObj.towerName !== "Single Tower"){
            firstObj.towerName = "Single Tower";
            newdata[0] = firstObj
          }

          if(newaddedTower.length > 0){
            let newfirstObj = newaddedTower[0] !== undefined ? {...newaddedTower[0]} : {};
            if(newfirstObj.towerName !== "Single Tower"){
              newfirstObj.towerName = "Single Tower";
              newaddedTower[0] = newfirstObj
            }
          }
      };
      
      setCurrentTowers(newdata);

      const list = newaddedTower.concat(towers);

      if(parseInt(towerCount) === 1){
        let prevArray = [...towers, ...newaddedTower];

        prevArray.filter(c=>{
          if(
            (selectedPhase !== null && selectedPhase !== undefined && c && c.propType === propTypeId && c.phaseId === selectedPhase ) ||
            (selectedPhase === null && c && c.propType === propTypeId)
          ){
            if(c.towerName !== "Single Tower"){
              c.towerName = "Single Tower";
              return c;
            };
          }
        });

        setTowers(prevArray);
      }else{
        setTowers([...towers, ...newaddedTower]);
      }
    }else{
        return;
    }
  };

  const elevationTypes = ["elevationGround", "elevationStilt", "groundAndStilt"];

  // Testing Code
  const ontowerDetailsChange = (e, ind, each) => {
    let name = e.target.name;
    let value = e.target.value;
    setIsEditTower(true);

    if (name === "elevation") {
      // adding selected elevation
      $("#elevationAndFloorCon_" + ind).css("border-color", "#c9c9c9");
      each[name] = value;
      each.totalFloor = "";

      if(value !== "none"){
        each[value] = "";
      }else{
        delete each.elevation;
      };

      // Deleteing remaining elevations
      elevationTypes.forEach((eachKey)=>{
          if(value !== eachKey){
            delete each[eachKey];
          }
      });

    }else {
      if(elevationTypes.includes(name)){
        $(`#groundAndStiltNOoOfFloors_${ind}`).css("border-color", "#148B16");
        $("#elevationAndFloorCon_" + ind).css("border-color", "#c9c9c9");
        // each.totalFloor = value;
        if(parseInt(value) > 0 && parseInt(value) <= 200 && value !== ""){
          each = { ...each, 
            [name]: Math.trunc(value), 
            totalFloor: Math.trunc(value)  
          };
          $(`#groundAndStiltNOoOfFloors_${ind}`).css("border-color", "#148B16");
        }else{

          // value == "" ? each = { ...each, [name]: value } : "";

          if(value === ""){
            each = { ...each, [name]: value }
          }
          
          $(`#groundAndStiltNOoOfFloors_${ind}`).css("border-color", "#F00");
        }
      }else if (name === "elevationBasement" || name === "noOfPodium") {
        $(`#basement_${ind}`).css("border-color", "#148B16");
        if (value <= 5 && value > -1 && value !== "" ) {
          each = { ...each, [name]: Math.trunc(value) };
        }else{
          // value === "" ? each = { ...each, [name]: value } : "";

          if(value === ""){
            each = { ...each, [name]: value }
          }

          if (name === "elevationBasement"){
            $(`#basement_${ind}`).css("border-color", "#F00");
          }
          if (name === "noOfPodium"){
            $(`#podium_${ind}`).css("border-color", "#F00");
          }
        };
      }else{
        each = { ...each, [name]: (name === "totalFloor" && value !== "") ? Math.trunc(value) : value };
      }
    };
    
    let id = e.target.id;
    if (name !== "elevationBasement" && !elevationTypes.includes(name)) {
      $(`#${id}`).css("border", "0.8px solid var(--Brand-green-primary, #148B16)");
    };

    const newdata = currentTowers.map((obj, i) => {
      if (obj.towerId !== undefined && each.towerId !== undefined && obj.towerId === each.towerId ) {
        return each;
      };
      if (i === ind) {
        return each;
      } else {
        return obj;
      }
    });
    setCurrentTowers(newdata);
    updateTowers(newdata);
  };

  // Original changing tower data
  // const ontowerDetailsChange = (e, ind, each) => {
  //   let name = e.target.name;
  //   let value = e.target.value;
  //   let namespliced = name != undefined && name != null && name.split("_")[0];
  //   setIsEditTower(true);
  //   if (namespliced == "selected") {
  //     let id = e.target.id;
  //     name = id.split("_")[0];
  //     let prevvalue =
  //       each.elevationGround != undefined && each.elevationGround != null && each.elevationGround != ""
  //         ? each.elevationGround
  //         : each.elevationStilt != undefined && each.elevationStilt != null && each.elevationStilt != ""
  //         ? each.elevationStilt 
  //         : each.elevationBoth != undefined && each.elevationBoth != null && each.elevationBoth != ""
  //         ? each.elevationBoth 
  //         : "";
  //     if (name == "Ground") {
  //       each = {
  //         ...each,
  //         elevation: "elevationGround",
  //         elevationGround: prevvalue,
  //         totalFloor: prevvalue,
  //         elevationStilt: undefined,
  //         [name]: value,
  //       };
  //     } else {
  //       each = {
  //         ...each,
  //         elevation: "elevationStilt",
  //         elevationGround: undefined,
  //         totalFloor: prevvalue,
  //         elevationStilt: prevvalue,
  //         elevationBoth: prevvalue,
  //         [name]: value,
  //       };
  //     }
  //   } else if (name == "elevationStilt") {
  //     each = {
  //       ...each,
  //       elevation: "elevationStilt",
  //       [name]: value,
  //       totalFloor: value,
  //     };
  //   } else if (name == "elevationGround") {
  //     each = {
  //       ...each,
  //       elevation: "elevationGround",
  //       [name]: value,
  //       totalFloor: value,
  //     };
  //   } else if (name == "elevationBasement") {
  //     if (value <= 5 ) {
  //     each = { ...each, [name]: value };
  //     }
  //     if (value == "" || value > 5 ) {
  //       $(`#basement_${ind}`).css(
  //         "border",
  //         "0.8px solid var(--mandatory, #F00)"
  //       );
  //     } else {
  //       $(`#basement_${ind}`).css(
  //         "border",
  //         "0.8px solid var(--Brand-green-primary, #148B16)"
  //       );
  //       $(`#elevationBasement_slider_${ind}`).css(
  //         "border",
  //         "0.8px solid var(#CBE9FF , #70C3FF)"
  //       );
  //     }
  //   } else {
  //     each = { ...each, [name]: value };
  //   }

  //   let id = e.target.id;
  //   if (name != "elevationBasement") {
  //     $(`#${id}`).css(
  //       "border",
  //       "0.8px solid var(--Brand-green-primary, #148B16)"
  //     );
  //   }

  //   const newdata = currentTowers.map((obj, i) => {
  //     if (obj.towerId !== undefined && each.towerId !== undefined && obj.towerId === each.towerId ) {
  //       return each;
  //     }
  //     if (i == ind) {
  //       return each;
  //     } else {
  //       return obj;
  //     }
  //   });
  //   setCurrentTowers(newdata);
  //   updateTowers(newdata);
  // };




  /*    const updateTowers = (newData) => {
        const oldData = []
        if(selectedPhase != null){
			towers.map((c) => {
	            if ( c.propType != propTypeId || c.phaseId != selectedPhase) {
	                oldData.push(c);
	    	    }
        	});
		}else{
			towers.map((c) => {
	            if ( c.propType != propTypeId) {
	                oldData.push(c);
	            }
        	});
		}
        
        const list = newData.concat(oldData);
        setTowers(list);
    } */

  //updating list which goes to backend / which has all the data
  const updateTowers = (newData) => {
    const oldData = towers.filter(
      (c) =>
        (selectedPhase !== null &&
          (c.propType !== propTypeId || c.phaseId !== selectedPhase)) ||
        (selectedPhase === null && c.propType !== propTypeId)
    );

    // const updatedTowers = newData.concat(oldData).reduce((acc, current) => {
    //   // Check if the id already exists in the accumulated array
    //   if (!acc.some(item => item.towerId === current.towerId)) {
    //     acc.push(current);
    //   }
    //   return acc;
    // }, []);

    const updatedTowers = newData.concat(oldData).reduce((acc, current) => {
        // If the item has an id, check for duplicates, otherwise allow it through
        if (current.towerId) {
            if (!acc.some(item => item.towerId === current.towerId)) {
                acc.push(current);
            }
        } else {
            // If no id, push the item without id to the accumulated array
            acc.push(current);
        }
        return acc;
    }, []);
    // const updatedTowers = newData.concat(oldData);
    setTowers(updatedTowers);
  };

  const handleChange = (event) => {
    const { value: inputValue } = event.target;
    event.target.value = formatPriceToCommaPrice(inputValue);
    let val = event.target.value ? event.target.value.replace(/\,/g,'') : "";
    if(event.target.name === "landArea" && val !== ""){
      onChangeLandArea(event, val === "" ? "" : val)
    }else{
      onChange({target: {value: val === "" ? "" : val, id: event.target.id, name: event.target.name } });
    }
  };

  const onChangeLandArea = (e, value) => {
    const modifiedEvent = Object.assign({}, e, {
        target: {
            ...e.target,
            value: convertSqmetersIntoSqft(value, "sqft"),
            name: e.target.name,
            id:e.target.id,
            checked:e.target.checked
        },
    });

    if(onChange){
      onChange(modifiedEvent);
    };
    // checkForDateChanges();
    // onChange(e);
};

  return (
    <div id={`${propTypeId}_ContainerBlock`} className="pdBottomContainer">
      <h3>
        Kindly fill in the details below<span className="requiredStar">*</span>
      </h3>

      <div className="propertyNoOfFieldConMainCon">
        <Input
          key={`landArea_${propTypeId}`}
          required="true"
          inputId={`landArea_${propTypeId}`}
          name="landArea"
          onChange={handleChange}
          type="text"
          className="propertyDetailsNoOfField"
          containerClassName="propertyDetailsNoOfFieldCon"
          inputOuterContainerClassName="PpdInputOuterContainerClassName"
          spanLable="sq.m"
          spanLableClassName="propertyDetailsLandAreaStaticLable"
          label2={
            propTypeId != projectprops.plot
              ? "Total Land Area (in sq.m)"
              : "Total Land Area (in sq.m)"
          }
          labelClassName2={`propertyDetailsAnimatedLabel ${data && data.landArea != undefined && data.landArea != "" ? "basePriceInputLable" : ""}`}
          value={
            data != undefined && data.landArea && data.landArea !== ""
              ? formatPriceToCommaPrice(`${convertSqmetersIntoSqft(data.landArea, "sqmts")}`)
              : ""
          }
          maxCheracterLimit={{count: 9, type:"C", convert: "sqft"}}
        />

        {(propTypeId === projectprops.apartment ||
          propTypeId === projectprops.villament) && (
          <Input
            key={`noOfTower_${propTypeId}`}
            required="true"
            inputId={`noOfTower_${propTypeId}`}
            name="noOfTower"
            onChange={updateNoofTower}
            type="number"
            className="propertyDetailsNoOfField" // animatedInput
            containerClassName="propertyDetailsNoOfFieldCon" //input-field
            inputOuterContainerClassName="PpdInputOuterContainerClassName"
            label2="Total no: of Towers"
            labelClassName2={`propertyDetailsAnimatedLabel ${data && data.noOfTower != undefined && data.noOfTower != "" ? "basePriceInputLable" : ""}`}
            value={ data != undefined && data.noOfTower != undefined && data.noOfTower != null && data.noOfTower !== "" ? data.noOfTower : "" }
            maxCheracterLimit={{type: "INT"}}  
          />
        )}

        {propTypeId == projectprops.apartment && (
          <Input
            key={`noOfBlock_${propTypeId}`}
            required="false"
            inputId={`noOfBlock_${propTypeId}`}
            name="noOfBlock"
            onChange={onChange}
            type="number"
            className="propertyDetailsNoOfField" // animatedInput
            containerClassName="propertyDetailsNoOfFieldCon" //input-field
            inputOuterContainerClassName="PpdInputOuterContainerClassName"
            label2="Total no: of Blocks (Optional)"
            labelClassName2={`propertyDetailsAnimatedLabel ${data && data.noOfBlock != undefined && data.noOfBlock != "" ? "basePriceInputLable" : ""}`}
            value={
              data != undefined &&
              data.noOfBlock != undefined &&
              data.noOfBlock != null
                ? data.noOfBlock
                : ""
            }
            maxCheracterLimit={{type: "INT"}} 
          />
        )}

        <Input
          key={`noOfUnit_${propTypeId}`}
          required="true"
          inputId={`noOfUnit_${propTypeId}`}
          name="noOfUnit"
          onChange={(e)=>handleChange(e)}
          type="text"
          className="propertyDetailsNoOfField" // animatedInput
          containerClassName="propertyDetailsNoOfFieldCon" //input-field
          inputOuterContainerClassName="PpdInputOuterContainerClassName"
          label2={
            projectprops.plot != propTypeId
              ? "Total No: of Units"
              : "Total No: of Plots"
          }
          labelClassName2={`propertyDetailsAnimatedLabel ${data && data.noOfUnit != undefined && data.noOfUnit != "" ? "basePriceInputLable" : ""}`}
          value={
            data != undefined &&
            data.noOfUnit != undefined &&
            data.noOfUnit != null
              ? formatPriceToCommaPrice(`${data.noOfUnit}`)
              : ""
          }
          maxCheracterLimit={{type:"INT"}}  
        />
      </div>

      <h3>
        Kindly fill in the Generic Base Price/ sq.ft below
        <span className="requiredStar">*</span>
      </h3>

      <div className="propertyNoOfFieldConMainCon">
        <Input
          key={`basePrice_${propTypeId}`}
          required="true"
          inputId={`basePrice_${propTypeId}`}
          name="basePrice"
          onChange={(e) => e.target.value !== null && data.basePrice !== null && e.target.value !== data.basePrice ? handleChange(e) : null}
          type="text"
          className="propertyDetailsNoOfField basePriceClassName"
          containerClassName="propertyDetailsNoOfFieldCon"
          inputOuterContainerClassName="PpdInputOuterContainerClassName outerConForBaseprice"
          inputMode="numeric"
          pattern="[0-9\s]{13,19}"
          label2="Base Price / sq.ft (In Rupees)"
          labelClassName2={`propertyDetailsAnimatedLabel ${data.basePrice != undefined && data.basePrice != null && data.basePrice != "" ? "basePriceInputLable" : ""}`}
          spanLable="/ sq.ft."
          spanLableClassName="propertyDetailsLandAreaStaticLable"
          frontIcon="₹"
          frontIconClassName="frontIconClassName"
          value={data.basePrice != undefined && data.basePrice != null ? formatPriceToCommaPrice(`${data.basePrice}`)  : ""}  
          maxCheracterLimit={{count: 9, type:"C"}}
        />
      </div>
      {data != undefined && data.basePrice != undefined && data.basePrice != null && data.basePrice != "" &&
        <span className="postPropMinAndMaxPriceDisplayText inWordsPriveForBP">{inWords(data.basePrice)}</span>
      }

      {(propTypeId == projectprops.apartment || propTypeId == projectprops.villament) && data != undefined && data != null && (
        <div className="apartmentTowerDetailMainCon">
          <ProjProptowerComp
            key="kljhgfd"
            ontowerDetailsChange={ontowerDetailsChange}
            towers={currentTowers}
            towerCount={data != undefined && data != null ? data.noOfTower : 0}
          />
        </div>
      )}
    </div>
  );
};

export default PropertiesFeedingBlock;
