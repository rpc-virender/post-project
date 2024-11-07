import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';

const URL = window.location.origin;


export const userLogin = (loginDetails, setLoginRes,setErroeMessage) => {

	$("#loginButton").css("disabled", true);
    $("#loginButton").css("cursor", "wait");
    const url = `${URL}/user/v1/doLoginWithMobile`;
    fetch(url, {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(loginDetails)
    })
    .then(response => { return response.json() })
    .then(userRes => {
        setLoginRes(userRes);

        if (userRes.status === true) {
            Cookies.set('token', userRes.token, { secure: true, sameSite: 'Strict', path: '/' });

            const token = Cookies.get('token');

            if (token) {
                getLoggedUserDetails();
            } else {
                console.error('Token was not set correctly.');
            }
        } else {
            setErrorMessage("Please enter a valid Username and Password");
        }

        $("#loginButton").prop("disabled", false).css("cursor", "pointer");
    })
    .catch((err) => console.error(err));
};


export const logOutApi = () => {

    const url = `${URL}/user/v1/logOut`;

    fetch(url)
    .then(response => { return response.json() })
    .then(res => { 
        if(res){
        window.location.reload();
        }
    })
         .catch((err) => console.error(err));
    }