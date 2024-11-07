import React, { Fragment } from 'react'
import HeadingAndEditBox from './HeadingAndEditBox'
import { pdfuploaded } from '../../images/commonImages'
import { pdfNameIcon } from '../../images/commonSvgs'

export default function BrochureBox({setStep, BroucherUrl, title}) {
    return (
        <Fragment>
            <HeadingAndEditBox key="12PreviewHeading" heading={title} identifier={16} setStep={setStep} />
            <div className='previewBrochureCard'>
                <img alt="" src={pdfuploaded} />

                <div className='previewBrochureCardInner'>
                    <h3>{pdfNameIcon} Brochure.pdf</h3>
                    <a target="_blank" href={BroucherUrl}>Preview</a>
                </div>
            </div>
        </Fragment>
    )
}
