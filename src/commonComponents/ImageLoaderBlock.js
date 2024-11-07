import React from 'react'
import { FileIcon } from '../images/commonSvgs'

export default function ImageLoaderBlock({ value }) {
    return (
        <div className='ImageLoaderBlockMainCon'>
            <FileIcon className="fileAndDeleteIcons" onClick={()=>("")} />
            <div className='progressBarSection'>
                <div className='progressBarInnerSection'>
                    <span className='progressBarText'>Image.png</span>
                    <span className='progressBarText'>{value}%</span>
                </div>
                <div className="progressBarHoldingCon">
                    <div className="progressBar" style={{ width: `${value}%` }}></div>
                </div>
            </div>
        </div>
    )
};
