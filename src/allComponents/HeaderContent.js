import React from 'react'

export default function HeaderContent({headerText, contentText}) {
  return (
    <div className="topHeaderCon">
        <div className="topHeaderLeftSideCon">
            <div>
                <p className="nameWithHandImg">{headerText}</p>
                <p className="headingContent">{contentText}</p>
            </div>
        </div>
                
        {/* <CircularProgressBar percentage={percentage} /> */}
        
    </div> 
  )
}
