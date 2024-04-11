import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../api/axiosConfig';

import '../Register/Register.css'


export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [email, setEmail] = useState('');
    const [educationalRole, setEducationalRole] = useState('');

    const navigate = useNavigate();
    const login = () => {
        navigate('/login')
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
                console.log("Account has been successfully created!");
                navigate("/login");
            })
            .catch(function (error) {
                
                console.log("Error:" + error);
            });

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='register-wrapper'>
            <h1>Sign Up</h1>
            <form onSubmit={createAccount} className='register-form'> {/* Calls the api */}
                <label>
                    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" /> {/* Reads the inputted text and assign it the const */}
                </label>
                <label>
                    <input type='text' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
                </label>
                <label>
                    <input type='text' value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} placeholder="Date of Birth"/>
                </label>
                <label>
                    <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
                </label>
                <label>
                    <input type='text' value={educationalRole} onChange={(e) => setEducationalRole(e.target.value)} placeholder="Educational Role"/>
                </label>
                <div>
                    <button type='submit'>Submit</button>
                    <button onClick={login}>Login Page</button>  {/* Navigate back to login page */}
                </div>
            </form>
        </div>
    )
}