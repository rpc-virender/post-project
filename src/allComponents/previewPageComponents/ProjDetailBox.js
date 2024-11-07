import React from 'react'

export default function ProjDetailBox({icon, iconWithText, name, value, className}) {
    return(
        <div className={`projDetailsCardMianCon ${className}`}>
            {iconWithText && <p className='priceIconWithText'>{icon} {iconWithText}</p>}
            
            {!iconWithText && icon && <span>{icon}</span>}

            {name && <p className='projDetailsCardHeading'>{name}</p>}
            {value && <p className='projDetailsCardText'>{value}</p>}
        </div>
    )
};
