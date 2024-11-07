import React, { useState, useEffect } from "react";

const RangeSlider = ({ data, name, points, startingPoint, rangeSliderMainContainer, id, onChange, showPlusValue}) => {

  const onChangingSlider = (e, i) => {
      const modifiedEvent = Object.assign({}, e, {
        target: {
                ...e.target,
                value: data != undefined && data != null ? data : i ,
                name: name,
                id: id != undefined ? id : "tempB",
                checked:e.target.checked
            },
      });
      if(onChange){
        onChange(modifiedEvent);
      };
  };

  return (
    <div className={rangeSliderMainContainer}>

      <div className="datalist">
        {[...Array(points+1)].map((x, i) =>{
            var startingNum = startingPoint && startingPoint !== "" ? startingPoint : 0;
            if(i >= startingNum ){
              return(
                <span 
                    key={`rangeSliderOptions${i}`} 
                    className="datalistOption"
                    onClick={(e)=>onChangingSlider(e, i)}  
                    style={{
                        color: i == data ? "#148B16" : "",
                        fontWeight: i == data ? "600" : "400",
                    }}
                >
                    {showPlusValue && points == i ? `${i}+` : i}
                </span>
              )
          }
        })}

        {/* {startingPoint &&
        <span 
            key={`rangeSliderOptions${points}`} 
            className="datalistOption"
            onClick={()=>onChange({target: { 
                            id: id != undefined ? id : "tempB", 
                            name: name, 
                            value: data != undefined && data != null ? data : points
                          }})}  
            style={{
                color: points == data ? "#148B16" : "",
                fontWeight: points == data ? "600" : "400",
            }}
        >
            {showPlusValue ? `${points}+` : points}
        </span>
        } */}
      </div>
      

      <input
        className="inputRangeWithLabels"
        type="range"
        name={name}
        id={id !== undefined ? id : "tempB"}
        defaultValue={startingPoint ? startingPoint : 0}
        onChange={(e) => onChange(e)}
        value={data !== undefined && data !== null ? data : 0}
        list="values"
        min={startingPoint ? `${startingPoint}` : "0"}
        max={points}
        style={{
          // Ensure compatibility with iOS Safari
          WebkitAppearance: "none", // Override default iOS styles
          appearance: "none", // Ensure consistent appearance across browsers
        }}
      />
    </div>
  );
};

export default RangeSlider;



