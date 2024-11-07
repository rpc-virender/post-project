import React, { Fragment, memo } from 'react'
import Input from '../../commonComponents/Input';
import { formatPriceToCommaPrice } from '../../images/commonImages';
import { convertSqmetersIntoAcres } from '../../images/constant';

const ProjectBasicDetailsBlock = ({ data = {}, onChange = () => {}}) => {

    const handleChange = (event) => {
        const { value: inputValue } = event.target;
        event.target.value = formatPriceToCommaPrice(inputValue);
        let val = event.target.value ? event.target.value.replace(/\,/g,'') : "";
        if(event.target.name === "totalLandArea" && val !== ""){
            onChangeUnitType(event, val === "" ? "" : val)
        }else{
            onChange({target: {value: val == "" ? "" : val, id: event.target.id, name: event.target.name } });
        }
    };

    const onChangeUnitType = (e, value) => {
        const modifiedEvent = Object.assign({}, e, {
            target: {
                ...e.target,
                value: convertSqmetersIntoAcres(value, "acres"),
                name: e.target.name,
                id:e.target.id,
                checked:e.target.checked
            },
        });
        if(onChange){
            onChange(modifiedEvent);
        };
    };

    return (
        <Fragment>
            <h2 className="sectionHeading">Basic Details</h2>
            <div className="postProjectInputsCon">
                <Input
                    key="projprojName"
                    required = "true"
                    inputId="projName"
                    name="projName"
                    onChange={onChange}
                    capital={"A"}
                    type="text"
                    className="animatedInput"
                    containerClassName="input-field"
                    inputOuterContainerClassName="PDinputOuterContainerClassName"
                    label2="Project Name"
                    labelClassName2={`animatedLabel ${data.projName != undefined && data.projName != null && data.projName != "" ? "afterSelectedLableClass" : ""}`}
                    value={data.projName != undefined && data.projName != null && data.projName !== "" ? data.projName : ""}  
                    maxCheracterLimit={200}
                />

                <Input
                    key="projtotalLandArea"
                    required = "true"
                    inputId="totalLandArea"
                    name="totalLandArea"
                    onChange={handleChange}
                    type="text"
                    className="animatedInput"
                    disabled={false}
                    hide="false"
                    containerClassName="input-field"
                    inputOuterContainerClassName="PDinputOuterContainerClassName"
                    label2={<span>Project’s Total Land Area <span className="lableInnerSmallText">(in sq.m)</span></span>}
                    labelClassName2={`animatedLabel ${data.totalLandArea != undefined && data.totalLandArea != null && data.totalLandArea != "" ? "afterSelectedLableClass" : ""}`}
                    spanLable="sq.m"
                    spanLableClassName="inputsSqftLable"
                    value={
                        data != undefined && data.totalLandArea && data.totalLandArea !== ""
                          ? formatPriceToCommaPrice(`${convertSqmetersIntoAcres(data.totalLandArea, "sqmts" )}`)
                          : ""
                    }
                    maxCheracterLimit={{count: 10, type:"C"}}
                />
            </div>
        </Fragment>
    )
};

export default memo(ProjectBasicDetailsBlock);
