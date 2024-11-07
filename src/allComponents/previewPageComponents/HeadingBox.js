import React from 'react'
import { previewSiseBorderIcon } from '../../images/commonSvgs';
import SingleButton from '../../commonComponents/SingleButton';
import { itemScrollIntoView } from '../../images/commonImages';

export default function HeadingBox({heading, headingWithEdit, subHeading, setStep}) {

    const onEditBlock = (identifier) =>{
        switch(identifier){
            case "Amenities":
                setStep(4);
                break;
            case "FAQ":
                setStep(5);
                itemScrollIntoView("projectDetailsFAQsBlock");
                break;
            case "Custom Amenities":
                setStep(4);
                itemScrollIntoView("custoAmenityHeadings");   
                break;
            default:
                return "";
        }
    };

    return(
        <div className='previewProjAndContant'>
            {previewSiseBorderIcon}
            <div className='previewProjAndContantInnerBox'>

                {heading && <h2>{heading}</h2>}

                {headingWithEdit &&
                <div className='detailsNameAndEditCon'>
                    <p className='headingDetailsNameText'>{headingWithEdit}</p>
                    <SingleButton
                        key={`${headingWithEdit}_PreviewBtn`}
                        buttonId={`${headingWithEdit}_PreviewBtn`}
                        containerClassName=""
                        buttonClassName="projectDetailsPreviewBtn projectheadingPreviewBtn"
                        onSubmit={()=>onEditBlock(headingWithEdit)}
                        title="Edit"
                        icon={<svg  className="postProjPreviewEditBtn" xmlns="http://www.w3.org/2000/svg" width="33" height="34" viewBox="0 0 33 34" fill="none">
                                <path d="M2.52555 26.9706L30.5254 27.0593L30.5191 29.0593L2.51922 28.9706L2.52555 26.9706ZM25.9793 10.0448C26.7818 9.24732 26.7856 8.04732 25.9881 7.24479L22.3996 3.63341C21.6021 2.83088 20.4021 2.82708 19.5996 3.62454L4.55214 18.577L4.53188 24.9769L10.9318 24.9972L25.9793 10.0448ZM20.9951 5.02897L24.5837 8.64035L21.5742 11.6308L17.9856 8.01945L20.9951 5.02897ZM6.5382 22.9833L6.5496 19.3833L16.5812 9.41501L20.1698 13.0264L10.1382 22.9947L6.5382 22.9833Z" fill="#0073C6"/>
                            </svg>}
                    />
                </div>
                }

                <p>{subHeading}</p>
            </div>
        </div>
    )
};
