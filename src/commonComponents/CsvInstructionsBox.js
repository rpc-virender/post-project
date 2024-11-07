import React from 'react';
import SingleButton from './SingleButton';
import { forwordSvg } from '../images/commonSvgs';
import { csvDetailsRequirements, csvInstructions } from '../images/constant';

export default function CsvInstructionsBox({id, seeMore, setSeeMore, showAndHidePopper}) {
    
    // csv instructions popup functions
    const popperPopup = document.querySelector(`#popper-popup`);   
    const popperArrow = document.querySelector(`#popper-arrow`);
 
   
    const onMouseover = (identifier) => {
        switch(identifier){
            case "enter":
                if (!(popperPopup && popperPopup.hasAttribute("show-popper"))) {
                    showAndHidePopper("show");
                    if(id === "csvInTwo" && popperArrow){
                        popperArrow.style.display = "none";
                    }else{
                        popperArrow.style.display = "block";
                    }
                }
                break;
            case "leave":
                if (popperPopup && popperPopup.hasAttribute("show-popper")) {
                    showAndHidePopper("hide");
                    setSeeMore(false);
                }
                break;
            default:
                return "";
        }
    };



    return (
    <div className='csvInstructionsBoxMianCon'>
        {/* Popover Testing */}
        <section>
            <svg 
                id={`popper-button`}
                className="csvGenerateCircle" 
                onMouseEnter={(e)=>onMouseover("enter")} 
                //onClick={(e)=>togglePopper(e)} 
                xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none"
            >
                <path d="M11 0.5C8.9233 0.5 6.89323 1.11581 5.16652 2.26957C3.4398 3.42332 2.09399 5.0632 1.29927 6.98182C0.504549 8.90045 0.296614 11.0116 0.701759 13.0484C1.1069 15.0852 2.10693 16.9562 3.57538 18.4246C5.04383 19.8931 6.91476 20.8931 8.95156 21.2982C10.9884 21.7034 13.0996 21.4955 15.0182 20.7007C16.9368 19.906 18.5767 18.5602 19.7304 16.8335C20.8842 15.1068 21.5 13.0767 21.5 11C21.5 8.21523 20.3938 5.54451 18.4246 3.57538C16.4555 1.60625 13.7848 0.5 11 0.5ZM11 5C11.2225 5 11.44 5.06598 11.625 5.1896C11.81 5.31321 11.9542 5.48891 12.0394 5.69448C12.1245 5.90005 12.1468 6.12625 12.1034 6.34448C12.06 6.56271 11.9528 6.76316 11.7955 6.9205C11.6382 7.07783 11.4377 7.18498 11.2195 7.22838C11.0013 7.27179 10.7751 7.24951 10.5695 7.16436C10.3639 7.07922 10.1882 6.93502 10.0646 6.75002C9.94098 6.56501 9.875 6.3475 9.875 6.125C9.875 5.82663 9.99353 5.54048 10.2045 5.3295C10.4155 5.11853 10.7016 5 11 5ZM14 17.0938H8V15.4062H10.1563V11.0938H8.75V9.40625H11.8438V15.4062H14V17.0938Z" fill="#0073C6"/>
            </svg> 
        
            <div id={`popper-popup`} className='popper-popup'>
                <div 
                    onMouseEnter={(e)=>onMouseover("enter")}
                    onMouseLeave={(e) => onMouseover("leave")}
                    className='csvInstructionsBox' 
                    //style={{ position: id == "propCsvInstruction" ? "fixed" : "absolute" }} 
                >
                    <p className='csvInstructionsHeading'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M8.10667 2.5H6.25C5.75272 2.5 5.27581 2.69754 4.92417 3.04917C4.57254 3.40081 4.375 3.87772 4.375 4.375V15.625C4.375 16.1223 4.57254 16.5992 4.92417 16.9508C5.27581 17.3025 5.75272 17.5 6.25 17.5H13.75C14.2473 17.5 14.7242 17.3025 15.0758 16.9508C15.4275 16.5992 15.625 16.1223 15.625 15.625V10M8.10667 2.5C9.1425 2.5 10 3.33917 10 4.375V6.25C10 6.74728 10.1975 7.22419 10.5492 7.57582C10.9008 7.92746 11.3777 8.125 11.875 8.125H13.75C14.2473 8.125 14.7242 8.32254 15.0758 8.67417C15.4275 9.02581 15.625 9.50272 15.625 10M8.10667 2.5C11.1817 2.5 15.625 6.96667 15.625 10" stroke="#0073C6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {seeMore ? "Field Details Requirements:" : "CSV File Requirements"}
                    </p>
                    
                    <div className='csvInstructionsBoxDetailsCon' style={{overflow: !seeMore ? "hidden" : "auto"}}>
                        {!seeMore ? 
                        <ul>
                            {csvInstructions.map((eachOne, index)=>{
                                return(
                                    <li key={index} id={`csvInstructions_${index}`} className='csvInstructionsText'>{eachOne}</li>
                                )
                            })}
                        </ul>
                        :
                        <ul>
                            {csvDetailsRequirements.map((eachOne, index)=>{
                                return(
                                    <li key={index} id={`csvInstructions_${index}`} className='csvInstructionsText'>
                                        <span>{eachOne.name}</span>
                                        {eachOne.contant}
                                    </li>
                                )
                            })}
                        </ul>
                        }
                    </div>

                    <SingleButton
                        key="csvInstructionsBtn"
                        buttonId="csvInstructionsBtn"
                        containerClassName=""
                        buttonClassName={`csvInstructionsBtn ${seeMore ? "csvBackwordBtn" : "csvForwordBtn" }`}
                        onSubmit={()=>setSeeMore(!seeMore)}
                        title= {!seeMore ? "Field Details Requirements:" : "CSV File Requirements"}
                        icon={<span className={`${seeMore ? "csvBackwordSvg" : "csvForwordSvg" }`}>{forwordSvg}</span>} 
                    />
                    
                </div>

                <div id={`popper-arrow`} className='popper-arrow'></div>
            </div>
        </section>
    </div>
  );
};


