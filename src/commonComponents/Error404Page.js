import React, { useEffect } from "react";
import SingleButton from "./SingleButton";
import { error404Image } from "../images/commonImages";
const ReactDOM = require('react-dom');

const Error404Page = () => {

    useEffect(()=>{
        document.body.style.overflow = "hidden";
    },[]);

    
    const onRedirectToHomePage =()=>{
        window.location.href = (`${window.location.origin}/home`)
    };

    return(
        <div className="error404Page">
            {/* <Header /> */}
            <div className="colorCircles colorCircleTop"></div>
            <div className="colorCircles colorCircleTopTite"></div>
            <img alt="" src={error404Image} className="error404Img" />
            <h2 className="error404PageHeading"><sapn>404!</sapn> PAGE NOT FOUND</h2>
            <SingleButton
                key="error404Btn"
                buttonId="error404Btn"
                containerClassName=""
                buttonClassName="error404Btn"
                onSubmit={(e)=>onRedirectToHomePage()}
                title="Go To Homepage"
            />
            <div className="colorCircles colorCircleBottom"></div>
            <div className="colorCircles colorCircleBottomLite"></div>
        </div>
    )
};


ReactDOM.render(<div><Error404Page/></div>,error404);
