const URL = window.location.origin;



export const resetPasswordApi = (password, setUpdatedPassword) => {
    const url = `${URL}/user/v1/resetPassword`;

      fetch(url, {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(password)
    })

    .then(response => { return response.json() })
    .then(data => {
        
        if(data.Status === true){
             
                setUpdatedPassword(data)
        }
        else{
                setUpdatedPassword(data)
        }
        })
    .catch((err) => console.error(err));
};