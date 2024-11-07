import React, {useState} from "react";

let sqSize_= 200;
let strokeWidth= 10;

const CircularProgressBar = ({percentage}) => {

      // Size of the enclosing square
      const sqSize = sqSize_;
      // SVG centers the stroke width on the radius, subtract out so circle fits in square
      const radius = (sqSize_ - strokeWidth) / 2;
      // Enclose cicle in a circumscribing square
      const viewBox = `0 0 ${sqSize} ${sqSize}`;
      // Arc length at 100% coverage is the circle circumference
      const dashArray = radius * Math.PI * 2;
      // Scale 100% coverage overlay with the actual percent
      const dashOffset = dashArray - dashArray * percentage / 100;
  
      return (
        <div className="topHeaderRightSideCon">
            <div>
                <p className="propertyScoreName">Property Score</p>
                <p className="propertyScoreContant">Complete your profile for better vision</p>
            </div>
            
            <svg
                className="circularProgressBar"
                viewBox={viewBox}>
                <circle
                  className="circle-background"
                  cx={sqSize_ / 2}
                  cy={sqSize_ / 2}
                  r={sqSize_}
                  strokeWidth={`${strokeWidth}px`} />
                <circle
                  className="circle-progress"
                  cx={sqSize_ / 2}
                  cy={sqSize_ / 2}
                  r={radius}
                  strokeWidth={`${strokeWidth}px`}
                  // Start progress marker at 12 O'Clock
                  transform={`rotate(-90 ${sqSize_ / 2} ${sqSize_ / 2})`}
                  style={{
                    strokeDasharray: dashArray,
                    strokeDashoffset: dashOffset
                  }} />
                <text
                  className="circle-text"
                  x="50%"
                  y="50%"
                  dy=".3em"
                  textAnchor="middle">
                  {`${percentage}%`}
                </text>
            </svg>
        </div>
      );
    
  };

export default CircularProgressBar;
  

//   <CircularProgressBar
//               strokeWidth="10"
//               sqSize="200"
//               percentage={this.state.percentage}
//             />
  


  
 