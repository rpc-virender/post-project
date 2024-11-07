import React from "react";

import { loader } from "../images/commonImages";

const Loader = ({message}) => {
    return(
        <div style={{  width: "100%" }}>
            <div className="loaderContainer">
                <img src={loader} alt="" className="loaderGif" ></img>
                <span>{message}</span>
            </div>
        </div>
        
    )
};

export default Loader;