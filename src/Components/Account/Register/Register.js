import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../api/axiosConfig';

import '../Register/Register.css'


export default function Register() {
    const [username, setUsername] = useState(''); // stores username input
    const [password, setPassword] = useState(''); // stores password input
    const [dateOfBirth, setDateOfBirth] = useState(''); // stores date of birth input
    const [email, setEmail] = useState(''); // stores email input
    const [educationalRole, setEducationalRole] = useState(''); // stores educational role input
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();
    const login = () => {
        navigate('/login'); // navigate to the login page when called.
    }

    const createAccount = async (e) => {
        e.preventDefault();
        try { 
            api.post("/api/v1/accounts/createAccount", {  // send post request to register new account in the backend 
                username: `${username}`,
                password: `${password}`,
                email: `${email}`,
                dateOfBirth: `${dateOfBirth}`,
                educationalRole: `${educationalRole}`,
                role: "User",
                createdFlashcardSetsArrayList: [],
                createdFoldersArrayList: [] 
            })
            .then(function () {
                //console.log("Account has been successfully created!");
                navigate("/login");
            })
            .catch(function (error) {
                setErrMsg("An Error Occured.");
                console.log("Error:" + error); // call an error in the console
            });

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='register-wrapper'>
            <h1>Sign Up</h1>
            <form onSubmit={createAccount} className='register-form'> {/* calls the API to register an account */}
                <label>
                    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" /> {/* reads the inputted text */}
                </label>
                <label>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/> {/* reads the inputted text */}
                </label>
                <label>
                    <input type='date' value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} placeholder="Date of Birth"/> {/* reads the inputted text */}
                </label>
                <label>
                    <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/> {/* reads the inputted text */}
                </label>
                <label>
                    <input type='text' value={educationalRole} onChange={(e) => setEducationalRole(e.target.value)} placeholder="Educational Role"/> {/* reads the inputted text */}
                </label>
                <label>{errMsg}</label>
                <div>
                    <button type='submit'>Submit</button>
                    <button onClick={login}>Login Page</button>  {/* Navigate back to login page */}
                </div>
            </form>
        </div>
    )
}