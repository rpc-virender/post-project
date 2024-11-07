import React from "react";
import './styles/postProject.css';

import RightSideContainer from "./allComponents/RightSideContainer";
import Header from "./allComponents/Header";

const PostProject = () => {
    return(
        <div className="mainPostProjectCon">
            <Header  />
            <div className="postProjectBottomCon">
                <RightSideContainer />
            </div>        
        </div> 
    )
};

export default PostProject;
