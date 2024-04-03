import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';

export default function Login() {
    const [usernameTxt, setUsername] = useState('');
    const [passwordTxt, setPassword] = useState('');
    const navigate = useNavigate();
    const registerPage = () => {
        navigate('/register')
    };

    const home = () => {
        navigate('/home')
    };


    const loginDetails = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("http://localhost:8080/api/v1/accounts/login", {
                username: `${usernameTxt}`,
                password: `${passwordTxt}`
            });
            localStorage.setItem('currentRole', JSON.stringify(response.data["role"]));
            localStorage.setItem('currentUser', JSON.stringify(response.data["username"]));
            console.log(localStorage.getItem('currentRole'));
            var role = localStorage.getItem('currentRole')
            if(role === '"User"') {
                navigate('/home')
            } else if (role === '"Admin"') {
                navigate('/adminDashboard')
            } else {
                console.log('no current role found');
            }
        } catch (error) {
            console.log(error);
        }
    };
    

    return(
        <div className='login-wrapper'>
            <h1>Login Page</h1>
            <form onSubmit={loginDetails}>
                <label>
                    <p>Username</p>
                    <input type='text' value={usernameTxt} onChange={(e) => setUsername(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type='text' value={passwordTxt} onChange={(e) => setPassword(e.target.value)}/>
                </label>

                <div>
                    <button type='submit'>Submit</button>
                    <button onClick={registerPage}>Register Page</button>
                </div>
            </form>
        </div>
    )
}
