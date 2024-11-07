import React, { useState, useEffect} from "react";
import $ from 'jquery';

import {loadergifuserprofile, rowSuccessGif} from '../../images/commonImages';

const PropertyRowLoader = ({ statusType, rowId}) => {

    const [eachrowId, setEachrowId] = useState("");

    useEffect(()=>{
        $("#rowLoaderAndStatusCon").hide();
        $("#rowDeleteStatusCon_"+rowId).hide();
    },[]);

    useEffect(()=>{
        if(rowId != undefined && rowId != null && rowId != ""){
            setEachrowId(rowId);
        }
    },[rowId]);

    return(
        <div className="rorStatusComponent">
            {statusType == "add" &&
            <div className="rowLoaderMainCon">
                <div id="rowLoaderStatus" className="rowLoaderCon">
                    <img src={loadergifuserprofile} alt="" className="rowLoaderGif" />
                    <span id="rowStatusPopupErrMsg" className="rowLoaderMeesage">Saving your details</span>
                </div>

                <div id="rowSuccesStatus" className="rowLoaderCon" style={{display: "none"}}>
                    <img src={rowSuccessGif} alt="" className="rowLoaderGif" />
                    <span className="rowLoaderMeesage">Saving your details</span>
                </div>
            </div>
            }

            {statusType == "delete" &&
                <div className="rowDeleteStatusMainCon">
                    <div id="rowDeleteStatus" className="rowLoaderCon">
                        <img src={loadergifuserprofile} alt="" className="rowLoaderGif" />
                        <span className="rowLoaderMeesage" style={{color:"var(--Mandatory, #F00)"}}>Deleting Unit</span>
                    </div>
                </div>
            }

            {statusType == "edit" &&
                 <div className="rowDeleteStatusMainCon rowEditStatusMainCon">
                    <div id="rowEditStatus" className="rowLoaderCon">
                        <img src={loadergifuserprofile} alt="" className="rowLoaderGif" />
                        <span className="rowLoaderMeesage">Editing details</span>
                    </div>
                </div>
            }
        </div>
    )
};

export default PropertyRowLoader;