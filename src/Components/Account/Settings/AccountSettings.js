import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../api/axiosConfig';

export default function AccountSettings() {
    const[username, setUsername] = useState('');
    const[currentPassword, setCurrentPassword] = useState('');
    const[newPassword, setNewPassword] = useState('');
    const[dateOfBirth, setDateOfBirth] = useState('');
    const[email, setEmail] = useState('');
    const[educationalRole, setEducationalRole] = useState('');
    
    const navigate = useNavigate();

    const returnHomepage = () => {
        navigate("/home"); // routes
    }

    let userid = localStorage.getItem('currentId'); // retrieve current logged in account id to call to backend
    let substringuserid = userid.substring(1, userid.length - 1) // retrieve current userid without the double quotation marks
    const loadDetails = async () => {
        try {      
            const response = await api.get(`/api/v1/accounts/${substringuserid}`); // get request to the end user
            // console.log(response.data); debug
            setUsername(response.data['username']);
            setDateOfBirth(response.data['dateOfBirth']);
            setEmail(response.data['email']);
            setEducationalRole(response.data['educationalRole']);
        } catch (error) {
            console.log(error);
        }
    
    }



    const updateDetails = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/v1/accounts/update/${substringuserid}`, {
                username: username,
                email: email,
                dateOfBirth: dateOfBirth,
                educationalRole: educationalRole,
                password: newPassword // Always include newPassword, it may be empty
            }, {
                params: {
                    currentPassword: currentPassword // need to pass the current password to verify their changes
                }
            })
            .then(response => {
                console.log("Account updated successfully", response.data);
            })
            .catch(error => {
                console.error(error);
            });
        } catch (e) {
            console.log(e);
        }
    }
    



    useEffect(() => { // synchronize with backend
        loadDetails();
    });
    

    return (
        <div className='settings-wrapper'>
            <h1>Account Settings</h1>
            <div>
            <form onSubmit={updateDetails}>
                <label>
                    <p>Username</p>
                    <input defaultValue={username} type='text' disabled={true}/> {/* Username text disabled - Users cannot change username */}
                </label>
                <label>
                    <p>Current Password</p>
                    <input type='text' onChange={(e) => setCurrentPassword(e.target.value)} /> {/* Sets the current password based off of user input, stores in password const*/}
                </label>
                <label>
                    <p>New Password</p>
                    <input type='text' onChange={(e) => setNewPassword(e.target.value)} />
                </label>
                <label>
                    <p>DateOfBirth</p>
                    <input defaultValue={dateOfBirth} type='text' onChange={(e) => setDateOfBirth(e.target.value)}/>
                </label>
                <label>
                    <p>Email</p>
                    <input defaultValue={email} type='text' onChange={(e) => setEmail(e.target.value)}/>
                </label>
                <label>
                    <p>Educational Role</p>
                    <input defaultValue={educationalRole} type='text' onChange={(e) => setEducationalRole(e.target.value)}/>
                </label>
                <div>
                    <button type='submit'>Update Details</button> {/* On submit it updates the users details based off of the data as well as their password for verification */}
                    <button type='button' onClick={returnHomepage}>Login Page</button> {/* Return to login page */}
                </div>
            </form>
            </div>
        </div>
    )
}