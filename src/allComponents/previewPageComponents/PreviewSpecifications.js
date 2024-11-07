import React, { useState } from 'react'
import { specificationsList } from '../../images/commonImages';
import { EditIcon } from '../../images/commonSvgs';
import SingleButton from '../../commonComponents/SingleButton';

export default function PreviewSpecifications({specificationData, allKeys, setStep}) {
    const [selectedSpecId, setSelectedSpecId ] = useState(allKeys[0] != undefined ? allKeys[0] : "");

    const onEditSpecications = (specId) => {
        setStep(3);
    };

    return (
        <div className='previewImagesBlockMainBlock'>
            <div className='propertyTypeBtnCon previewTypeBtnsCon'>
                {allKeys.map((specId, ind)=>{    
                    return(
                        <SingleButton
                            key={`PreviewSpecBtn_${specId}`}
                            buttonId={`PreviewSpecBtn_${specId}`}
                            containerClassName=""
                            buttonClassName={`shortListPropTypeBtn prevSpecDefaultBtn ${selectedSpecId == specId ? "propTypeBtnSelected" : ""}`}
                            title={<span onClick={()=>setSelectedSpecId(specId)}>{specificationsList && specificationsList.get(specId) && specificationsList.get(specId).name ? specificationsList.get(specId).name : ""}</span>}
                            icon={selectedSpecId == specId ? <EditIcon className="imageTypeEditIcon" key={`PrevSpecEdit_${specId}`} iconId={`PreviewImageEditBtn_${specId}`} onClick={()=>onEditSpecications(specId)} />:""}
                        />
                        )
                    })
                }
            </div>

            <div className='previewSpecificationsBlock'>
                <h2>{specificationsList && specificationsList.get(selectedSpecId) && specificationsList.get(selectedSpecId).name ? specificationsList.get(selectedSpecId).name : ""}</h2>

                <ul>
                    {specificationData != undefined && specificationData.get(selectedSpecId) &&
                     specificationData.get(selectedSpecId).map((eachOne, index) => {
                        return(
                            <li key={`prevSpec_{${index}}`}>{eachOne}</li>
                        )
                    })} 
                </ul>

            </div>


        </div>
    )
}
