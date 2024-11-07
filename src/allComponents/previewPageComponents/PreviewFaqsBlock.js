import React, { useEffect } from 'react'
import { useState } from 'react'

export default function PreviewFaqsBlock({faqsData}) {

    const [readMore, setReadMore] = useState([]);
    const maxCount = 300;

    useEffect(()=>{
        setReadMore([...faqsData.map(eachItem => maxCount )]);
    },[faqsData]);

    const onReadMore = (value) =>{
        let prevArray = [...readMore];
        if(prevArray[value] > maxCount){
            prevArray[value] = maxCount;
        }else{
            prevArray[value] = 1000;
        }
        setReadMore(prevArray);
    };

    return (
        <div className='PreviewFaqsBlockMainCon'>
            {faqsData && faqsData.map((eachItem, index) => {
                if (eachItem.isDeleted && eachItem.isDeleted != "Y") {
                    return (
                      <div  key={index} className='PreviewFaqsBlockCrad'>
                          <h3>{eachItem.faqQuestion}</h3>
                          <p>
                              {eachItem.faqAnswer.length > readMore[index] ?
                                <span>{`${eachItem.faqAnswer.slice(0, maxCount)}...`}</span>
                                :
                                <span>{eachItem.faqAnswer}</span>
                              }

                              {eachItem.faqAnswer != undefined && eachItem.faqAnswer.length > maxCount &&
                              <span onClick={()=>onReadMore(index)} className="dashboardReadMoreSpan">
                                  {readMore[index] > maxCount ? " Read Less" : "Read more"}
                              </span>
                              }
                          </p>
                      </div>
                    )
                }
            })}
        </div>
    )
}
