import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';

export default function Login() {
    const navigate = useNavigate();
    const registerPage = () => {
        navigate('/register')
    };


    const verifyAccount = async () => {
        try {
            let username = document.getElementById('usernametxt').value
            let password = document.getElementById('passwordtxt').value
            const response = await api.get("api/v1/accounts");
            const databaseData = response.data;
            for(let i = 0; i < databaseData.length; i++) {
                if(databaseData[i].username === username && databaseData[i].password === password) {
                    console.log("Correct!");
                    navigate('/home');
                    break;
                } else {
                    console.log("Incorrect");
                }
            }
            
        } catch (err) {
            console.log(err);
        }
    }

    return(
        <div className='login-wrapper'>
            <h1>Login Page</h1>
            <form>
                <label>
                    <p>Username</p>
                    <input type='text' id='usernametxt'/>
                </label>
                <label>
                    <p>Password</p>
                    <input type='text' id='passwordtxt'/>
                </label>

                <div>
                    <button onClick={verifyAccount} type='button'>Submit</button>
                    <button onClick={registerPage}>Register Page</button>
                </div>
            </form>
        </div>
    )
}
