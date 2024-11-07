const URL = window.location.origin;

export const getStatesDetails = (setStates) => {
    const url = `${URL}/common/getStateList`;
    fetch(url, {
        method: 'post',
        headers: { 'Content-Type':'application/json' },
    })
    .then(response => {return response.json() })
    .then(res => { 
        setStates(res)
    }) 
    .catch((err) => console.error(err));
};

export const getAllCitiesDetails = (setAllCities,increaseStep)=> {
	
	const url = `${URL}/common/getAllCities`;
	fetch(url, {
        method: 'post',
        headers: { 'Content-Type':'application/json' },
    })
    .then(response => {return response.json() })
    .then(res => { 
        setAllCities(res.cities)
        if(res.status && increaseStep != undefined){
			increaseStep(1);
		}
    }) 
    .catch((err) => console.error(err));
	
};



export const getCitiesDetails = (setCities, cId) => {
    const url = `${URL}/common/getCityList?statecid=${cId}`; 
    fetch(url, {method: 'post'})
    .then(response => { return response.json()})
    .then(res => { 
        return setCities(res) })
    .catch((err) => console.error(err));
};

export const getLocalityDetails = (setLocality, cId) => {
    const url = `${URL}/common/getLocalityfromCity?cityId=${cId}`; 
    fetch(url, {method: 'post'})
    .then(response => { return response.json()})
    .then(res => { 
        return setLocality(res);
     })
    .catch((err) => console.error(err));
};


export const getGroupList =(setCommonData,list) => {
	const UR2L = window.location.origin;
	const url = `${UR2L}/common/getConstantList`;
    fetch(url, {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(list)
    })
    .then(response => { return response.json() })
    .then(data => { 
		setCommonData(data);
	})
    .catch((err) => {
		console.error(err);
    });
};





