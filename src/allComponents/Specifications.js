import React, {useState, useEffect, memo} from "react";
import $ from 'jquery';
import SingleButton from "../commonComponents/SingleButton";
import { specificationsList } from "../images/commonImages";
import TextAreaFieldEl from '../commonComponents/textEl';
import Loader from '../commonComponents/Loader';
import { infoIcon } from "../images/commonSvgs";

import '../styles/specificationsIcons.css';

const Specifications = ({data,onChange,onNextclick,specificationData,isEdit,setSpecificationData,setspecificationprev, errorIds}) => {
	
    const [ category, setCategory ] = useState("Structure");
    const [ categoryId, setCategoryId ] = useState(401);
    const [ categoryImg, setCategoryImg ] = useState(specificationsList.get(401).url);
    const [ newData, setNewData ] = useState(new Map());
    const [ keys,setKeys ]=useState([]);
    const [ editSpecification , setEditSpecification] = useState(false);
    const [ onChangeData , setOnChangeData] = useState({});
    const [isSubmiting, setisSubmiting ] = useState(false);

    const maxCount = 7;
    const allKeys = [...specificationsList.keys()];
	
    useEffect(() => {
        if (Object.keys(specificationData).length > 0) {
            const map = new Map();

            for (const key in specificationData) {
                if (key != null && specificationData.hasOwnProperty(key)){
                map.set(parseInt(key), specificationData[key]);
                }
            }

            setNewData(map);
            setSpecificationData(map);
        }else {
            if(specificationData !== undefined && specificationData != null) {
                setNewData(specificationData);
            }
        }
    }, [specificationData]);

    function inWords (num) {
        var a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
        var b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

        if ((num = num.toString()).length > 9) return 'overflow';
        let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (n[1] !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
        str += (n[2] !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
        str += (n[3] !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        str += (n[4] !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        str += (n[5] !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
        return str;
    }
  
    useEffect(() => {
        setspecificationprev(newData);
        
        if(editSpecification){
            setSpecificationData(newData);
        }
    },[newData]);
	
    useEffect(() => {		
	    setKeys([...newData.keys()]);
    },[newData, categoryId]);
    

    const getCategory = ( each, identifier, ind) => {
        
        if(isSubmiting){
            setisSubmiting(false);
        };
        setCategory(each.name);
        setCategoryImg(each.url);
        setCategoryId(each.id);

        // Auto Adding Details If User Change Category Without Adding Clickking Add More 
        onAddingItems();

        if( identifier === "D" ){
            $('#' + `input_${each.id}__${ind}` ).css( 'border', '0.8px solid var(--secondary-blue-1, #0073C6)');
        }
        
    };

    const hideInput = () => {
        let status;
        if(newData.has(categoryId) && newData.get(categoryId) !== undefined && newData.get(categoryId).length !== undefined){
            if(newData.get(categoryId).length === maxCount){
                status = true;
            }else{
                status = false;
            }
        }
        return status;
    };


    
    const onAddingItems = () => {
        setEditSpecification(false);
		setOnChangeData({});
        let inputId=categoryId+"_";
        var el = document.getElementById(inputId);
        
        let value = el !== undefined && el != null ? el.value : "" ;
        let val=[];
        if(value !== ""){
            if( value.length < 5000 ){
                if(!newData.has(categoryId)){
                    val=[value.trim()];
                }else{
                    if(newData.get(categoryId).length < maxCount){
                        var preArray = newData.get(categoryId);
                        preArray.push(value.trim());
                        val=preArray;
                    }
                }
                setSpecificationData(new Map(newData.set(categoryId, val)));
                setNewData(newData => new Map(newData.set(categoryId, val)));

                $("#specificationsMaxLimitErrMsg").text("");
                
                el.value = "" ;
            }else{
                $("#specificationsMaxLimitErrMsg").text("*Maximum Limit Is 5000 Charecters");
            }

        }

        if(el){
            el.style.height = "26px";
        }
       
    };
    
    const onSaveSpecification = ()=>{
		if(onChangeData != null){
			for (const key in onChangeData) {
			  if (onChangeData.hasOwnProperty(key)) {
			    if (specificationData.has(Number(key))) {
			      const existingArray = specificationData.get(Number(key));
			      const updatedArray = existingArray.concat(onChangeData[key]);
			      specificationData.set(Number(key), updatedArray);
			    }else{
					specificationData.set(Number(key), onChangeData[key]);
				}
			  }
			}
		}
		setSpecificationData(specificationData);
		let categoryIdOfChange = Object.keys(onChangeData)[0]
		var el = document.getElementById(categoryIdOfChange+"_");
		if(el !== undefined && el != null) el.value = "" ;
		setOnChangeData({})
	}

    
	const onWithoutEditValueChange = (e)=>{
        if(isSubmiting){
            setisSubmiting(false);
        }

        setEditSpecification(false);
        
		const value = e.target.value;

        if(value.length <= 1000){
            const newCategoryId = categoryId
            const updatedOnChangeData = {[newCategoryId]: [value] };
            setOnChangeData(updatedOnChangeData);
            
            let el = document.getElementById(`${categoryId}_`);
            el.style.height = 'auto';
            el.style.height = (el.scrollHeight) + 'px';
        }
        
    }
    
    
    const onValueChange = (e, ind) => {
		setEditSpecification(true);
		if(isSubmiting){
            setisSubmiting(false);
        };
		onChange(e);  

        // $('#' + `input_${categoryId}_${ind}` ).css( 'border', 'green');
		
        setNewData((prevData) => {
            const newDataMap = new Map(prevData);
            const inputEl = [...newDataMap.get(categoryId)]; 
            inputEl[ind] = e.target.value;
            newDataMap.set(categoryId, inputEl);
            return newDataMap;
        });
	    
	    setSpecificationData(newData);


        // For Auto height changing of textArea fields...
        let el = document.getElementById(`${categoryId}_${ind}`);
        el.style.height = 'auto';
        el.style.height = (el.scrollHeight) + 'px';

        if(e.target.value === ""){
            onDeleteItem(categoryId, ind);
        }
	};

    const onDeleteItem = (value, ind) => {
        var valueList = newData.get(value);
        valueList.splice(ind, 1);   

        const updatedData = new Map(newData);
        if (valueList.length === 0) {
            updatedData.delete(value);
        } else {
            updatedData.set(value, valueList);
        }

        setSpecificationData(updatedData);
        setNewData(updatedData);

        // setCategoryId(parseInt(value));
    };


    const onfocusInput = (ind) =>{
        $('#' + `input_${categoryId}__${ind}` ).css( 'border', '0.8px solid var(--secondary-blue-1, #0073C6)');
    };

    
    const onSubmitingFinal = (e) => {
        onSaveSpecification();
        const divEl = document.getElementById("specificationsSectionHoldingCon");
        
        if(e.target.value === "submit"){
            if([...newData.keys()] != undefined && [...newData.keys()].length !== undefined && [...newData.keys()].length >= 13 ){
                //onSaveSpecification();
                onNextclick();
            }else{
                setisSubmiting(true);
                if(divEl){
                    divEl.scrollIntoView();
                }
            }
        }else{
            if(e.target.value === "Y"){
                //onSaveSpecification();
                onNextclick();
                setisSubmiting(false);
            }else{
                setisSubmiting(false);
            }
        }  
    }

    const focusInput = (ind) => {
        let ele = document.getElementById(`${categoryId}_${ind}`);
        if(ele){
            ele.focus();
            ele.selectionStart = ele.selectionEnd = ele.value.length;
        }
    };

    
    return(
        <div className="PropjectDetailsMainCon">

                <div className="specTopHeadingCon" id="specificationsSectionHoldingCon">
                    <h2 className="specTopHeading">Select almost {maxCount} categories from below to give Specifications about your project.</h2>

{/* selected Notification */}
                    {isSubmiting &&
                    <div className="selectedNotificationTextCon">
                        <p className="selectedNotificationText selectedNotifiTextDone">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="23" viewBox="0 0 20 23" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M1.01061 11.9715C1.01816 9.58903 1.97184 7.3071 3.66187 5.62775C5.35189 3.9484 7.63982 3.00919 10.0223 3.01673C12.4048 3.02428 14.6868 3.97796 16.3661 5.66799C18.0455 7.35801 18.9847 9.64594 18.9771 12.0284C18.9696 14.411 18.0159 16.6929 16.3259 18.3722C14.6359 20.0516 12.3479 20.9908 9.96542 20.9833C7.58291 20.9757 5.30098 20.022 3.62163 18.332C1.94228 16.642 1.00307 14.3541 1.01061 11.9715ZM9.46905 15.8432L14.6615 9.39404L13.7296 8.64367L9.30196 14.1406L6.18643 11.528L5.41694 12.4454L9.46905 15.8444L9.46905 15.8432Z" fill="#148B16"/>
                            </svg>
                            Added
                        </p>

                        <p className="selectedNotificationText">
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                <circle cx="10.0586" cy="10" r="10" fill="#FFD600"/>
                            </svg>
                            Pending
                        </p>
                    </div>
                    }
                </div>
                
                <div className="specificationsBoxsCon">
                    {specificationsList !== undefined && specificationsList != null &&
                    allKeys.map((keyName, ind)=>{  
                        let selectedKeys = newData !== undefined && newData.keys !== undefined ? [...newData.keys()] : [];                       
                        return(
                            <div 
                                id={`C_${keyName}`} key={keyName} 
                                className={
                                    `specificationsBox hor-order 
                                    ${selectedKeys.includes(keyName) ? "selectedBoxes" : "" } 
                                    ${isSubmiting && !selectedKeys.includes(keyName) ? "unSelectedSpec" : "" }
                                    ${categoryId === keyName ? "showCategory" : ""}`
                                } 
                                onClick={(e)=>getCategory( specificationsList.get(keyName) , "")}
                            >
                                <span>{specificationsList.get(keyName).name}</span>
                                <span className="specificationsIcon">{specificationsList.get(keyName).url}</span>
                            
                                <svg 
                                    id={`done_${keyName}`} 
                                    className="categoryDoneIcon"xmlns="http://www.w3.org/2000/svg" width="20" height="23" viewBox="0 0 20 23" fill="none"
                                    style={{display: selectedKeys.includes(keyName) ? "block" : "none" }}
                                >
                                    <path fillRule="evenodd" clipRule="evenodd" d="M1.01452 11.9715C1.02206 9.58903 1.97575 7.3071 3.66577 5.62775C5.3558 3.9484 7.64372 3.00919 10.0262 3.01673C12.4087 3.02428 14.6907 3.97796 16.37 5.66799C18.0494 7.35801 18.9886 9.64594 18.981 12.0284C18.9735 14.411 18.0198 16.6929 16.3298 18.3722C14.6398 20.0516 12.3518 20.9908 9.96933 20.9833C7.58682 20.9757 5.30489 20.022 3.62554 18.332C1.94618 16.642 1.00697 14.3541 1.01452 11.9715ZM9.47296 15.8432L14.6654 9.39404L13.7335 8.64367L9.30587 14.1406L6.19033 11.528L5.42085 12.4454L9.47295 15.8444L9.47296 15.8432Z" fill="#148B16"/>
                                </svg>
                            </div>
                            )
                        })
                    } 
                </div>

{/* seleting specifications Popup */}
                {isSubmiting &&
                <div className="seletingSpecificationsPopup">
                    <div className="seletingSpecPopupLeftCon">
                        {infoIcon}

                        <p>
                            {[...newData.keys()] != undefined && [...newData.keys()].length != undefined && [...newData.keys()].length > 0 ? 
                            `You’ve added ${inWords([...newData.keys()] != undefined && [...newData.keys()].length !== undefined ? [...newData.keys()].length : 0)} ${[...newData.keys()].length === 1 ? "specification" : "specifications"}. I hope you have captured all Specifications, Click yes to proceed.`
                            :
                            "No specifications is added. Are you sure you want to continue with this?"
                            }
                        </p>
                    
                    </div>
                    <div className="seletingSpecPopupBtnsCon">
                        <SingleButton
                            key="seletingSpecYesBtn"
                            buttonId="seletingSpecYesBtn"
                            buttonClassName="seletingSpecPopupBtn"
                            onSubmit={(e)=>onSubmitingFinal(e)}
                            title="Yes"
                            value="Y"
                        />

                        <SingleButton
                            key="seletingSpecNoBtn"
                            buttonId="seletingSpecNoBtn"
                            buttonClassName="seletingSpecPopupNoBtn"
                            onSubmit={(e)=>onSubmitingFinal(e)}
                            title="No"
                            value="N"
                        />
                    </div>
                </div>
                }

                

                <div className="sepecificationsBottomCon">

{/* Left side con */}
                    <div className="sepecificationsDisplayMainCon">
                        <p className="specificationsSectionHeadingCon">Specifications overview</p>

                        <div className="sepecificationsDisplayCon" id="sepecifications_Display_Con">

                            {newData !== undefined && newData != null && keys.length !== 0 ?
                            keys.map((value)=>{
                                return(
                                    // RENDER IMAGE AND NAME
                                    newData.get(value) !== undefined && newData.get(value) != null && newData.get(value).map((eachValue, ind)=>{
                                        var data = specificationsList.get(value);
                                        return(
                                            <div id={`category_display_${data.id}`} className="itemDisplayEachCon">
                                                <span className="displayBoxInsideHeading" style={{ display : ind === 0 ? "block" : "none" }} >{data.url} { data !== undefined && data != null ? data.name : ""} </span>
                                                <div key={`dispaly_${ind}_${value}`} id={`dispaly_${ind}_${value}`} className="itemDisplayCon">
                                                    <span className="itemDisplayIcon">{ data !== undefined && data != null ? data.url : ""}</span>
                                                    <span className="itemDisplayContant" onClick={(e)=>getCategory( data , "D", ind)}>{eachValue}</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" className="itemDisplayConCancelIcon" height="26" viewBox="0 0 26 26" fill="none" onClick={()=>onDeleteItem(value, ind)} style={{alignSelf: "flex-start", cursor: "pointer"}}>
                                                        <path d="M16.29 17.6793C16.5059 17.8852 16.7948 17.9969 17.0931 17.9899C17.3914 17.9828 17.6746 17.8575 17.8805 17.6416C18.0865 17.4257 18.1982 17.1368 18.1911 16.8385C18.184 16.5402 18.0587 16.257 17.8428 16.051L14.3149 12.6866L17.6793 9.15869C17.8852 8.94277 17.9969 8.65389 17.9898 8.35561C17.9827 8.05732 17.8575 7.77406 17.6415 7.56815C17.4256 7.36224 17.1367 7.25053 16.8384 7.25761C16.5402 7.26468 16.2569 7.38996 16.051 7.60589L12.6866 11.1338L9.15864 7.76942C8.94271 7.5635 8.65383 7.4518 8.35555 7.45888C8.05726 7.46595 7.77401 7.59123 7.56809 7.80716C7.36218 8.02308 7.25047 8.31196 7.25755 8.61024C7.26463 8.90853 7.38991 9.19178 7.60583 9.3977L11.1338 12.7621L7.76936 16.2901C7.56345 16.506 7.45174 16.7949 7.45882 17.0931C7.4659 17.3914 7.59118 17.6747 7.8071 17.8806C8.02302 18.0865 8.3119 18.1982 8.61019 18.1911C8.90847 18.1841 9.19173 18.0588 9.39764 17.8429L12.7621 14.3149L16.29 17.6793Z" fill="#192041"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        )
                                    })
                                )
                            })  
                            :
                            <div className="specificationEmptyCon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="57" height="56" viewBox="0 0 57 56" fill="none">
                                    <path d="M18.8985 23.87L28.5002 8.08032L38.1042 23.8747L18.8985 23.87ZM41.3335 49.5367C38.896 49.5367 36.8357 48.6959 35.1525 47.0143C33.4694 45.3328 32.6279 43.2724 32.6279 40.8333C32.6279 38.3942 33.4694 36.3339 35.1525 34.6523C36.8357 32.9708 38.896 32.1292 41.3335 32.1277C43.7711 32.1261 45.8314 32.9677 47.5145 34.6523C49.1977 36.337 50.0392 38.3973 50.0392 40.8333C50.0392 43.2693 49.1977 45.3297 47.5145 47.0143C45.8314 48.699 43.7711 49.5406 41.3335 49.539M9.29688 48.3723V33.2943H24.3702V48.3723H9.29688ZM41.3335 47.2057C43.1162 47.2057 44.6243 46.5897 45.8579 45.3577C47.0914 44.1257 47.7074 42.6175 47.7059 40.8333C47.7043 39.0491 47.0883 37.541 45.8579 36.309C44.6274 35.077 43.1193 34.461 41.3335 34.461C39.5478 34.461 38.0397 35.077 36.8092 36.309C35.5788 37.541 34.9628 39.0491 34.9612 40.8333C34.9597 42.6175 35.5757 44.1257 36.8092 45.3577C38.0428 46.5897 39.5509 47.2057 41.3335 47.2057ZM11.6302 46.039H22.0369V35.6277H11.6302V46.039ZM22.9632 21.539H34.0372L28.5002 12.663L22.9632 21.539Z" fill="#0073C6"/>
                                </svg>

                                <p>Your added specification will be shown here as per your selected categories...</p>
                            </div>
                            }

                        </div>
                    </div>

{/* right side con */}
                    <div className="sepecificationsInputsMainCon">
                        <div className="specificationsSectionHeadingCon">
                            <span className="specificationsSectionImg">{categoryImg}</span>
                            <span>{category}</span>
                        </div>

                        <div className="sepecificationsInputsCon">

                            {newData !== undefined && newData != null && newData.get(categoryId) !== undefined && newData.get(categoryId) != null &&
                            newData.get(categoryId).map((each, ind)=>{

                            // For Auto height changing of textArea fields...
                            let el = document.getElementById(`${categoryId}_${ind}`);
                            if(el !== undefined && el != null){
                                el.style.height = 'auto';
                                el.style.height = (el.scrollHeight) + 'px';
                            }

                                return(
                                    <div key={`${categoryId}__${ind}`} id={`input_${categoryId}__${ind}`} onClick={()=>onfocusInput(ind)} className="specificationsInputBox addPointToField">
                                        <svg className="itemRemovingIcon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" onClick={()=>onDeleteItem(categoryId, ind)}>
                                            <path d="M9.28755 10.7819C9.50348 10.9878 9.79236 11.0995 10.0906 11.0924C10.3889 11.0853 10.6722 10.96 10.8781 10.7441C11.084 10.5282 11.1957 10.2393 11.1886 9.94104C11.1816 9.64275 11.0563 9.3595 10.8404 9.15358L7.31242 5.78917L10.6768 2.26123C10.8827 2.04531 10.9944 1.75643 10.9874 1.45815C10.9803 1.15986 10.855 0.876604 10.6391 0.670689C10.4232 0.464775 10.1343 0.353069 9.836 0.360147C9.53772 0.367223 9.25446 0.492504 9.04855 0.708427L5.68414 4.23637L2.15619 0.871958C1.94027 0.666043 1.65139 0.554338 1.35311 0.561415C1.05482 0.568492 0.771567 0.693773 0.565652 0.909696C0.359738 1.12562 0.248032 1.4145 0.255109 1.71278C0.262186 2.01107 0.387467 2.29432 0.60339 2.50024L4.13133 5.86465L0.766921 9.39259C0.561007 9.60851 0.449301 9.89739 0.456378 10.1957C0.463455 10.494 0.588736 10.7772 0.804659 10.9831C1.02058 11.189 1.30946 11.3008 1.60775 11.2937C1.90603 11.2866 2.18929 11.1613 2.3952 10.9454L5.75961 7.41745L9.28755 10.7819Z" fill="#192041"/>
                                        </svg>
                                        
                                        <TextAreaFieldEl
                                            key={`${categoryId}_${ind}`}
                                            required = "true"
                                            inputId={`${categoryId}_${ind}`}
                                            name="Specification"
                                            capital={"F"}
                                            onChange={(e)=>onValueChange(e, `${ind}`)}
                                            placeholder="Write Specification"
                                            className="specificationsInputField"
                                            containerClassName="specificationsInputConClassName" 
                                            inputOuterContainerClassName="specificationsInputOuterCon"
                                            rows="1" 
                                            cols="50" 
                                            value={each}  
                                            maxCheracterLimit={1000} 
                                        />
                                    
                                    <svg className="highlitesEditButton" xmlns="http://www.w3.org/2000/svg" width="25" height="25" onClick={()=>focusInput(ind)} viewBox="0 0 25 25" fill="none">
                                        <path d="M1.09143 20.7655L22.0913 20.832L22.0866 22.332L1.08668 22.2655L1.09143 20.7655ZM18.6817 8.07118C19.2836 7.47309 19.2865 6.57309 18.6884 5.97119L15.9969 3.26265C15.3988 2.66076 14.4988 2.65791 13.8969 3.256L2.61137 14.4703L2.59617 19.2703L7.39615 19.2855L18.6817 8.07118ZM14.9436 4.30932L17.6351 7.01786L15.3779 9.26072L12.6865 6.55219L14.9436 4.30932ZM4.10092 17.7751L4.10947 15.0751L11.6332 7.59886L14.3246 10.3074L6.8009 17.7836L4.10092 17.7751Z" fill="#0073C6"/>
                                    </svg>
                                        
                                    </div>
                                )
                            })}
                        
                            { hideInput() !== true &&
                            <div className="specificationsInputBox">
                                <TextAreaFieldEl
                                    key={`${categoryId}_`}
                                    required = "true"
                                    inputId={`${categoryId}_`}
                                    capital={"F"}
                                    name="Specification"
                                    onChange={(e)=>onWithoutEditValueChange(e)}
                                    placeholder={`Add ${category} ${newData.get(categoryId) === undefined ? 1 : newData.get(categoryId).length + 1}`}
                                    className="specificationsInputField"
                                    containerClassName="specificationsInputConClassName" 
                                    inputOuterContainerClassName="specificationsInputOuterCon"
                                    rows="1" 
                                    cols="50"    
                                    maxCheracterLimit={1000}            
                                />    
                            </div>
                            }

                            <p id="specificationsMaxLimitErrMsg" className="highlitesMaxLimitErrMsg"></p>
                            
                            {newData && newData.get(categoryId) !== undefined && newData.get(categoryId) != null && newData.get(categoryId).length !== undefined && newData.get(categoryId).length >= maxCount ? "" :
                            <div className="specificationsPlusIconCon" onClick={()=>onAddingItems()}>
                                + Click to add more Specifications
                            </div>
                            }

                            <span 
                                className="maxFieldsIndicatar" 
                                //style={{ color : hideInput() == true ? "#F00" : "#B5ABAC" }}
                            > 
                                {hideInput() === true ? 
                                    "You can add only Seven specifications per categories." 
                                    : 
                                    `You can add maximum ${maxCount} ${category} variations`
                                    }
                            </span>
                        </div>
                    </div>
                    
                </div>

                <div className="bottomBtnsAndErrCon">
                    <div id="loaderForProjectspecification">
                        <Loader message="Please wait for few seconds will redirect you to next page"/>
                    </div>

                    <p id="finalErrorMsg_spec" style={{display:"none"}} className="validationaErrorMessageForAllPages">Note: * Is mandatory to fill. Please select {maxCount} categories to write your property specifications</p>


                    <SingleButton
                        key="specSubmitButton"
                        buttonId="specSubmitButton"
                        containerClassName="postProjectButtonMainCon"
                        buttonClassName="postProjectButton"
                        onSubmit={(e)=>onSubmitingFinal(e)}
                        title="SAVE & CONTINUE"
                        value="submit"
                    />
                </div>
        </div>
    )
};

export default memo(Specifications);