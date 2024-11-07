import React, { useState, useEffect } from "react";
import $ from 'jquery';
import { DropdownArrowIcon } from "../images/commonSvgs";

const MultiSelectBySeaechDropdown = ({
  inputId,
  placeholder,
  containerClassName,
  outerContainerClassName,
  label,
  label2,
  labelClassName,
  labelClassName2,
  required,
  dropdownArray,
  hideSearhInputField,
  hide,
  DropdownConClassName,
  DropdownItemsClassName,
  dropdownItemClassCon,
  ids,
  setIds,
  hideItemsDisplay,
}) => {
  const [isClick, setIsClick] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const onInputClick = () => {
    setIsClick(!isClick);
  };

  const [resultedList, setResultedList] = useState([]);

  //var citiesArray = ["ABC", "WER", "ABC", "WER", "ABC", "WER", "ABC", "WER"];
  const [citiesArray, setCitiesArray] = useState([]);

  const getValue = (e, each) => {
    let id = each.cid != undefined ? each.cid : each.id;
    let elid = e.target.id;
    if (e.target.checked) {
      //append to array
      if (!ids.includes(id)) {
        setIds([...ids, id]);
      }
      $(elid).prop("checked", true);
    } else {
      //remove from array
      let index = ids.indexOf(id);
      if (index > -1) {
        ids.splice(index, 1);
        setIds([...ids]);
      }
      $(elid).prop("checked", false);
    }

    let cityNames = [];
    ids.map((each) => {
      dropdownArray.map((eachCity) => {
        if (each == eachCity.id) {
          cityNames.push(eachCity.name);
        }
      });
    });
    setCitiesArray(cityNames);
  };

  const onDeleteCities = (name) => {
    ids.map((each) => {
      dropdownArray.map((eachCity) => {
        if (eachCity.name == name) {
          //un Check check box
          $(`#select${eachCity.id}`).prop("checked", false);

          //remove id from ids array
          let index = ids.indexOf(eachCity.id);
          let prevArray = [...ids];

          if (index > -1) {
            prevArray.splice(index, 1);
          }
          setIds([...prevArray]);

          // removing name from names array
          let nameIndex = citiesArray.indexOf(name);
          if (nameIndex > -1) {
            citiesArray.splice(nameIndex, 1);
            setCitiesArray(citiesArray);
          }
        }
      });
    });
  };

  useEffect(() => {
    setResultedList(dropdownArray);
  }, [dropdownArray]);

  useEffect(() => {
    let cityNames = [];
    // dropdownArray.map(eachCity=>{
    //     if(ids.includes(eachCity.id)){
    //         cityNames.push(eachCity.name);
    //     }
    // })

    ids.map((each) => {
      dropdownArray.map((eachCity) => {
        if (each == eachCity.id) {
          cityNames.push(eachCity.name);
        }
      });
    });
    setCitiesArray(cityNames);

    ids.map((each) => {
      $("#select" + each).prop("checked", true);
    });
  }, [ids, resultedList]);

  const onSearchByField = (e) => {
    let value = e.target.value;
    let array = [];
    value = value.toLowerCase();

    if (dropdownArray != undefined && dropdownArray != null) {
      dropdownArray.map((each) => {
        setResultedList([]);

        let name =
          each.constDesc != undefined && each.constDesc != null
            ? each.constDesc
            : each.name;
        name = name.toLowerCase();
        if (name.includes(value)) {
          array.push(each);
        }
      });
    }
    setResultedList(array);

    if (value == "") {
      setResultedList(dropdownArray);
    }
  };

  useEffect(() => {
    isClick
      ? $(`multiSelectedDropdown_${inputId}`).show()
      : $(`multiSelectedDropdown_${inputId}`).hide();
    // isClick ? setShowDropdown("flex") : setShowDropdown("none");
  }, [isClick]);

  // id={`multiSelectedDropdown_${inputId}`}

  return (
    <React.Fragment>
      {hide != "true" && (
        <div
          className={`singleSelectBySeaechMainCon  ${outerContainerClassName}`}
        >
          {label &&
          <label className={labelClassName} htmlFor={inputId}>
            {label}
            <span className="requiredStar">
              {required == "true" && label != "" ? "*" : ""}
            </span>
          </label>
          }
          <div
            id={`con${inputId}`}
            className={containerClassName}
            onClick={(e) => onInputClick("M")}
          >

            <div className="citiesArrayCon">
              {citiesArray.length === 0 &&
              <span>{placeholder}</span>
              }

              {hideItemsDisplay != true &&
                citiesArray.map((each, ind) => {
                  return (
                    <div key={ind} className="selectedCities">
                      {each}
                      <svg
                        className="selectBranchCitiesCrossIcon"
                        onClick={() => onDeleteCities(each)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 9 8"
                        fill="none"
                      >
                        <path
                          d="M1.52251 8C0.929331 8 0.612554 7.30112 1.00354 6.85503L3.66403 3.81959C3.74951 3.72206 3.91017 3.78464 3.90715 3.9143C3.90421 4.04093 3.7471 4.09777 3.66382 4.00232L1.17226 1.1467C0.781777 0.699157 1.09963 0 1.69357 0C1.89425 0 2.08504 0.0871333 2.21645 0.238798L4.63012 3.02446C4.72035 3.1286 4.64638 3.29057 4.50859 3.29057C4.3708 3.29057 4.29683 3.1286 4.38706 3.02446L6.80533 0.233481C6.93382 0.0851935 7.12036 0 7.31657 0C7.89835 0 8.20873 0.685749 7.82479 1.12285L5.29572 4.00215C5.20623 4.10404 5.03832 4.03861 5.04134 3.90305C5.04429 3.7709 5.20785 3.71104 5.2954 3.81006L7.97267 6.83808C8.37157 7.28924 8.05126 8 7.44905 8C7.24517 8 7.05146 7.91098 6.91867 7.75628L4.38057 4.7992C4.29018 4.69389 4.37782 4.53268 4.51535 4.55128C4.63424 4.56735 4.68778 4.70901 4.60924 4.7997L2.04418 7.76167C1.9131 7.91303 1.72274 8 1.52251 8Z"
                          fill="#505050"
                        />
                      </svg>
                    </div>
                  );
                })}
            </div>

            <DropdownArrowIcon
              dropdownArrowClass="dropdownArrow"
              iconId={`multiselectedBranches_${inputId}`}
            />
            {label2 &&
            <label htmlFor={inputId} className={labelClassName2}>
              {label2}
              <span className="requiredStar">
                {required == "true" && label2 != "" ? "*" : ""}
              </span>
            </label>
            }
          </div>
          <div id={`err${inputId}`} className="inputErrorMsgCon">
            <span id={`errmsg${inputId}`} className="inputErrorMsg">
              {errMsg}
            </span>
          </div>

          <div className={DropdownConClassName}>
            {hideSearhInputField == true && (
              <div className="singleSelectDropdownSearchFieldCon">
                <svg
                  id="lense-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M20.0313 20.7896C20.4913 21.2496 21.2013 20.5396 20.7413 20.0896L16.9913 16.3296C18.3068 14.8741 19.0339 12.9814 19.0313 11.0196C19.0313 6.62957 15.4613 3.05957 11.0713 3.05957C6.68133 3.05957 3.11133 6.62957 3.11133 11.0196C3.11133 15.4096 6.68133 18.9796 11.0713 18.9796C13.0513 18.9796 14.8813 18.2496 16.2813 17.0396L20.0313 20.7896ZM4.11033 11.0196C4.11033 7.17957 7.24033 4.05957 11.0703 4.05957C14.9103 4.05957 18.0303 7.17957 18.0303 11.0196C18.0303 14.8596 14.9103 17.9796 11.0703 17.9796C7.24033 17.9796 4.11033 14.8596 4.11033 11.0196Z"
                    fill="#767270"
                  />
                </svg>

                <input
                  type="search"
                  placeholder={"Search"}
                  onChange={(e) => onSearchByField(e)}
                  className="singleSelectDropdownSearchField"
                  autoComplete="off"
                />
                
              </div>
            )}

            <div className={DropdownItemsClassName}>
              {resultedList != undefined &&
                resultedList != null &&
                resultedList.map((each, ind) => {
                  let id = each.cid != undefined ? each.cid : each.id;
                  return (
                    <div key={id} className={dropdownItemClassCon}>
                      <input
                        id={`select${id}`}
                        type="checkbox"
                        checked={ids.includes(id) ? true : false}
                        onClick={(e) => getValue(e, each)}
                        className="multiSelectedCheckBox"
                      />
                      <label htmlFor={`select${id}`}>
                        {each.constDesc != undefined && each.constDesc != null
                          ? each.constDesc
                          : each.name}
                      </label>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default MultiSelectBySeaechDropdown;
