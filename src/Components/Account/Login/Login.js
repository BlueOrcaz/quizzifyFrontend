import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';

import '../Login/Login.css'

export default function Login() {
    const [username, setUsername] = useState('');  // stores username input
    const [password, setPassword] = useState(''); // store password input
    const [signedIn, setSignedIn] = useState(''); // boolean

    const navigate = useNavigate(); // react route

    const registerPage = () => {
        navigate('/register'); // return back to the register page
    };

    const loginDetails = async (e) => {
        e.preventDefault(); 
        try {
            const response = await api.post(`/api/v1/accounts/login`, {
                username: `${username}`,
                password: `${password}`
            }); // send a POST request to backend to verify account details
            localStorage.setItem('currentRole', JSON.stringify(response.data["role"])); // store backend response
            localStorage.setItem('currentUser', JSON.stringify(response.data["username"])); // store backend response
            localStorage.setItem('currentId', JSON.stringify(response.data["id"])); // store backend response
            localStorage.setItem('loggedIn', true); // set logged in state as true
            var role = localStorage.getItem('currentRole'); // retrieve current role
            if(role === '"User"') {
                navigate('/home') // navigate to the homepage 
            } else {
                console.log('no current role found');
            }
        } catch (error) {
            setSignedIn("Incorrect Username or Password!"); // when the username/password doesnt match in the backend
            //console.log(error);
        }
    };
    

    return(
        <div>
        <h1>Quizzify</h1>
        <div className='login-wrapper' >
            <h1 className='login'>Login</h1>
            <form onSubmit={loginDetails} className='login-form'> {/* on submit, it calls the API request */}
                <label>
                    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username'/>  {/* Reads the inputted text and assign it to username const */}
                </label>
                <label>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/> {/* Reads the inputted text and assign it to password const */}
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
