import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';

import '../Login/Login.css'

export default function Login() {
    const [usernameTxt, setUsername] = useState('');  // stores the username input
    const [passwordTxt, setPassword] = useState(''); // store password input
    const [signedIn, setSignedIn] = useState('');

    const navigate = useNavigate();

    const registerPage = () => {
        navigate('/register')
    };

    const loginDetails = async (e) => {
        e.preventDefault(); 
        try {
            const response = await api.post(`/api/v1/accounts/login`, {
                username: `${usernameTxt}`,
                password: `${passwordTxt}`
            }); // send a request to backend to verify account details
            localStorage.setItem('currentRole', JSON.stringify(response.data["role"])); // store backend response
            localStorage.setItem('currentUser', JSON.stringify(response.data["username"]));
            localStorage.setItem('currentId', JSON.stringify(response.data["id"]));
            localStorage.setItem('loggedIn', true);
            var role = localStorage.getItem('currentRole')
            if(role === '"User"') {
                navigate('/home') // navigate to the homepage if not admin
            } else if (role === '"Admin"') {
                navigate('/admin')
            } else {
                console.log('no current role found');
            }
        } catch (error) {
            setSignedIn("Incorrect Username or Password!");
            console.log(error);
        }
    };
    

    return(
        <div>
        <h1>Quizzify</h1>
        <div className='login-wrapper' >
            <h1 className='login'>Login</h1>
            <form onSubmit={loginDetails} className='login-form'> {/* Calls the api */}
                <label>
                    <input type='text' value={usernameTxt} onChange={(e) => setUsername(e.target.value)} placeholder='Username'/>  {/* Reads the inputted text and assign it to username const */}
                </label>
                <label>
                    <input type='password' value={passwordTxt} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/> {/* Reads the inputted text and assign it to password const */}
                </label>
                <p className='signin-text'>{signedIn}</p>
                <div className='buttons'>
                    <button type='submit'>Submit</button>
                    <button onClick={registerPage}>Register</button> {/* Navigate */}
                </div>
            </form>
        </div>
        </div>
    )
}
