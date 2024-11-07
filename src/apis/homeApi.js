
const URL = window.location.origin;

export const newlyLaunchedProjectApi = (setNewLaunchProject,newProjectList,setNewProjectList,page,setPageNoProject) => {
	
    const url = `${URL}/post-project/new-launch-project?page=${page}`;
    fetch(url, {
	  method: 'GET',
	  headers: {
	    'Content-Type': 'application/json'
	  }
	})
    .then(response => { return response.json() })
    .then(res => { 
		if(res.status == true){
			if(res.project.length > 0){
				setNewLaunchProject(res.project);
				setPageNoProject(page)
				if(page != 1){
					setNewProjectList([...newProjectList,res.project]);
				}else{
					setNewProjectList([res.project])
				}
			}else{
				setPageNoProject(page-1)
			}
		}
    })
    .catch((err) => console.error(err));
};

export const newlyLaunchedPropertyApi = (setNewLaunchProperty,newPropertyList,setNewPropertyList,page,category,setPageNoProperty) => {
	const queryParams = [];
	if (page !== null && page != "undefined" && page != "") {
		  queryParams.push(`page=${page}`);
	}
	
	if (category !== null && category != "undefined" && category != "") {
		  queryParams.push(`category=${category}`);
	}
	
    const url = `${URL}/post-listing/v1/new-launch-property?${queryParams.join('&')}`;
    fetch(url, {
	  method: 'GET',
	  headers: {
	    'Content-Type': 'application/json'
	  }
	})
    .then(response => { return response.json() })
    .then(res => { 
		if(res.status == true){
			if(res.property.length > 0){
				setNewLaunchProperty(res.property);
				setPageNoProperty(page);
				if(page != 1){
					setNewPropertyList([...newPropertyList,res.property]);
				}else{
					setNewPropertyList([res.property])
				}
			}else{
				setPageNoProperty(page-1)
			}
		}
		

    })
    .catch((err) => console.error(err));
};