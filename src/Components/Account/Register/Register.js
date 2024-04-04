import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import api from '../../../api/axiosConfig';


export default function Register() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/login')
    }

    const createAccount = async () => {
        try {
            let usernameTxt = document.getElementById('usernametxt').value
            let passwordTxt = document.getElementById('passwordtxt').value
            let dateOfBirthTxt = document.getElementById('dateOfBirthtxt').value
            let emailTxt = document.getElementById('emailtxt').value
            let educationalRoleTxt = document.getElementById('educationalroletxt').value
            
            api.post("/api/v1/accounts/createAccount", { 
                username: `${usernameTxt}`,
                password: `${passwordTxt}`,
                email: `${emailTxt}`,
                dateOfBirth: `${dateOfBirthTxt}`,
                educationalRoleTxt: `${educationalRoleTxt}`,
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
            <form>
                <label>
                    <p>Username</p>
                    <input type='text' id='usernametxt'/>
                </label>
                <label>
                    <p>Password</p>
                    <input type='text' id='passwordtxt'/>
                </label>
                <label>
                    <p>DateOfBirth</p>
                    <input type='text' id='dateOfBirthtxt'/>
                </label>
                <label>
                    <p>Email</p>
                    <input type='text' id='emailtxt'/>
                </label>
                <label>
                    <p>Educational Role</p>
                    <input type='text' id='educationalroletxt'/>
                </label>
                <div>
                    <button type='button' onClick={createAccount}>Submit</button>
                    <button onClick={handleClick}>Login Page</button>
                </div>
            </form>
        </div>
    )
}