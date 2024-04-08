import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../api/axiosConfig';


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

    const createAccount = async () => {
        try { 
            api.post("/api/v1/accounts/createAccount", {  // sennd post request to register new account in the backend 
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
            <h1>Sign Up Page</h1>
            <form onSubmit={createAccount}> {/* Calls the api */}
                <label>
                    <p>Username</p>
                    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}/> {/* Reads the inputted text and assign it the const */}
                </label>
                <label>
                    <p>Password</p>
                    <input type='text' value={password} onChange={(e) => setPassword(e.target.value)}/>
                </label>
                <label>
                    <p>DateOfBirth</p>
                    <input type='text' value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}/>
                </label>
                <label>
                    <p>Email</p>
                    <input type='text' value={email} onChange={(e) => setEmail(e.target.value)}/>
                </label>
                <label>
                    <p>Educational Role</p>
                    <input type='text' value={educationalRole} onChange={(e) => setEducationalRole(e.target.value)}/>
                </label>
                <div>
                    <button type='submit' onClick={login}>Submit</button>
                    <button onClick={login}>Login Page</button>  {/* Navigate back to login page */}
                </div>
            </form>
        </div>
    )
}