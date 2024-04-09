import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';

import '../Login/Login.css'

export default function Login() {
    const [usernameTxt, setUsername] = useState('');  // stores the username input
    const [passwordTxt, setPassword] = useState(''); // store password input

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
            console.log(error);
        }
    };
    

    return(
        <div className='login-wrapper'>
            <h1>Login</h1>
            <form onSubmit={loginDetails}> {/* Calls the api */}
                <label>
                    <p>Username</p>
                    <input type='text' value={usernameTxt} onChange={(e) => setUsername(e.target.value)}/>  {/* Reads the inputted text and assign it to username const */}
                </label>
                <label>
                    <p>Password</p>
                    <input type='password' value={passwordTxt} onChange={(e) => setPassword(e.target.value)}/> {/* Reads the inputted text and assign it to password const */}
                </label>

                <div>
                    <button type='submit'>Submit</button>
                    <button onClick={registerPage}>Register Page</button> {/* Navigate */}
                </div>
            </form>
        </div>
    )
}
