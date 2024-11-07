import React from "react";


const PiechartWithGradient = ({ colorOne, colortwo, number, pieChartTextClass, textColor, id, onClickCircle , styles}) =>{
    return(
        <div className="pieChartTextClassCon" onClick={()=> onClickCircle ? onClickCircle() : ("")}>
            <svg className={styles} id={id} xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70" fill="none">
                <path d="M70 35C70 54.33 54.33 70 35 70C15.67 70 0 54.33 0 35C0 15.67 15.67 0 35 0C54.33 0 70 15.67 
                    70 35ZM5.68278 35C5.68278 51.1915 18.8085 64.3172 35 64.3172C51.1915 64.3172 64.3172 51.1915 64.3172 
                    35C64.3172 18.8085 51.1915 5.68278 35 5.68278C18.8085 5.68278 5.68278 18.8085 5.68278 35Z" 
                    fill={`url(#paint0_linear_760_15630_${id})`}
                />
                <defs>
                    <linearGradient id={`paint0_linear_760_15630_${id}`} x1="35" y1="0" x2="35" y2="70" gradientUnits="userSpaceOnUse">
                    <stop stopColor={colorOne}/>
                    <stop offset="1" stopColor={colortwo}/>
                    </linearGradient>
                </defs>
            </svg>

            <span className={pieChartTextClass} style={{color: textColor}}>{number}</span>
        </div>
    )
};

export default PiechartWithGradient;

