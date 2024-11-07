import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';

import {completed, current, next} from '../images/commonSvgs';

const TrackerComponent = ({signupDetails,step}) => {
    const [status , setStatus] = useState({ box1:"ingCompleted", box2:"statusPointersHeadingCurrent", box3:"statusPointersHead", box4:"" });

	const [show,setShow] = useState({ box1:"none", box2:"none", box3:"none", box4:"none" });



	useEffect(() => {
		
		if(signupDetails != undefined && signupDetails != null &&
			 signupDetails.usertype != undefined && signupDetails.usertype != null ) {

			let stepOneEl = document.getElementById("stp1");
			let stepTwoEl = document.getElementById("stp2");
			let stepThreeEl = document.getElementById("stp3");
			let stepFourEl = document.getElementById("stp4");

			
				 
			if(signupDetails.usertype == 'I') {
				// block all
				setShow({ box1:"flex", box2:"none", box3:"none", box4:"none" })
			}
			
			if(signupDetails.usertype == 'A') {
				// block last 2 details
				if(step != undefined && step != null) {
					if(step > 1) {
						if(stepTwoEl != undefined && stepTwoEl != null) {
							ReactDOM.render(current, stepTwoEl);
							setStatus({ box1:"ingCompleted", box2:"statusPointersHeadingCurrent", box3:"statusPointersHead", box4:"" })
						} 

						if(stepOneEl != undefined && stepOneEl != null){
							ReactDOM.render(completed, stepOneEl);
							setStatus({ box1:"ingCompleted", box2:"statusPointersHeadingCurrent", box3:"statusPointersHead", box4:"" })
						}		
					}
				}
				setShow({ box1:"flex", box2:"flex", box3:"none", box4:"none" });
			}
			
			if(signupDetails.usertype == 'B') {
				// open all states
				
				if(step != undefined && step != null) {
					if(step == 4) {

						if(stepTwoEl != undefined && stepTwoEl != null) {
							ReactDOM.render(current, stepTwoEl);

						} 

						if(stepOneEl != undefined && stepOneEl != null){
							ReactDOM.render(completed, stepOneEl);

						}
					}else if(step == 5) {
						if(stepThreeEl != undefined && stepThreeEl != null) {
							ReactDOM.render(current, stepThreeEl);
						}

						if(stepTwoEl != undefined && stepTwoEl != null) {
							ReactDOM.render(completed, stepTwoEl);
						} 

					}else if(step == 6) {
						if(stepFourEl != undefined && stepFourEl != null) {
							ReactDOM.render(current, stepFourEl);
						}

						if(stepThreeEl != undefined && stepThreeEl != null) {
							ReactDOM.render(completed, stepThreeEl);
						}

					}else if(step > 6) {
						if(stepFourEl != undefined && stepFourEl != null) {
							ReactDOM.render(completed, stepFourEl);
						}
					}
				}
				setShow({ box1:"flex", box2:"flex", box3:"flex", box4:"flex" });
			}
		}
	},[signupDetails.usertype,step]);

	//className="statusPointers"

    return(
        <div className="ver-order">
            <div className="trackerImgAlignmentLgSgGtp statusPointersCon">
                	<div id="stp1" style={{display:`${show.box1}`}}>{current}</div>
                	
                	<hr className="HrLineTracking"/>
                	<div id="stp2" style={{display:`${show.box4}`}}>{next}</div>
                	
	                <hr className="HrLineTracking"/>
	                <div id="stp3" style={{display:`${show.box3}`}}>{next}</div>
	                
	                <hr className="HrLineTracking"/>
	                <div id="stp4" style={{display:`${show.box2}`}}>{next}</div>
            </div>

            <div className="trackerImgAlignmentLgSgGtp">
                <span style={{display:`${show.box1}`}} className={`statusPointersHeading ${status.box1}`} >Personal Detail</span>
                <span style={{display:`${show.box2}`}} className={`statusPointersHeading ${status.box2}`} >Address & Other</span>
                <span style={{display:`${show.box3}`}} className={`statusPointersHeading ${status.box3}`} >Company Details</span>
                <span style={{display:`${show.box4}`}} className={`statusPointersHeading ${status.box4}`} >Description</span>
            </div>
        </div>
    )
};

export default TrackerComponent;