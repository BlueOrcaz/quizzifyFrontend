import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../api/axiosConfig';

import '../Settings/AccountSettings.css'

export default function AccountSettings() {
    const[username, setUsername] = useState(''); // username input
    const[currentPassword, setCurrentPassword] = useState(''); // current password 
    const[newPassword, setNewPassword] = useState(''); // new password
    const[dateOfBirth, setDateOfBirth] = useState(''); // current date of birth
    const[email, setEmail] = useState(''); // current email
    const[educationalRole, setEducationalRole] = useState(''); // currnent educational role

    const[status, setStatus] = useState(''); // message when an error occurs
    
    const navigate = useNavigate(); // react routes

    const returnHomepage = () => {
        navigate("/home"); // return to the homepage
    }



    let userid = localStorage.getItem('currentId'); // retrieve current logged in account id to call to backend
    let substringuserid = userid.substring(1, userid.length - 1) // retrieve current userid without the double quotation marks
    const loadDetails = async () => {
        try {      
            const response = await api.get(`/api/v1/accounts/${substringuserid}`); // get request to the end user
            setUsername(response.data['username']); // fill in details
            setDateOfBirth(response.data['dateOfBirth']); // fill in details
            setEmail(response.data['email']); // fill in details
            setEducationalRole(response.data['educationalRole']);
        } catch (error) {
            console.log(error); // return an error if the account cannot be retrieves
        }
    
    }


    const deleteAccount = async () => {
        const confirm = window.confirm("Are you sure you want to delete your account? This action cannot be undone."); // Confirmation dialog
        if(confirm) {
            try {
                await api.delete(`/api/v1/accounts/deleteAccount/${substringuserid}`, { // send DELETE request
                    params: {
                        currentPassword: currentPassword.toString() // parameters required to delete an account
                    }
                });
                localStorage.removeItem('currentUser'); // remove the current user so another account can be made
                localStorage.removeItem('currentRole'); // remove the current role so another account can be made
                navigate('/login'); // return to login page
            } catch (error) {
                setStatus('Enter in your current password to delete account'); // inform end user on the instructions
                //console.log(error);
            }
        }
    }
    



    const updateDetails = async (e) => {
        const confirm = window.confirm("Are you sure you want to update your account?")
        e.preventDefault();
        if (confirm) {
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
                    //console.log("Account updated successfully", response.data);
                    setStatus('Account Updated Successfully!');
                })
                .catch(error => {
                    setStatus('Please double-check your password!');
                    console.error(error);
                });
            } catch (e) {
                console.log(e);
            }
        }
    }
    



    useEffect(() => { // synchronize with backend
        loadDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    

    return (
        <div className='settings-wrapper'>
            <h1>Account Settings</h1>
            <div className='settings-form'>
            <form onSubmit={updateDetails}>
                <label>
                    <input defaultValue={username} type='text' disabled={true}/> {/* Username text disabled - Users cannot change username */}
                </label>
                <label>
                    <input type='password' onChange={(e) => setCurrentPassword(e.target.value)} placeholder='Current Password'/> {/* Sets the current password based off of user input, stores in password const*/}
                </label>
                <label>
                    <input type='password' onChange={(e) => setNewPassword(e.target.value)} placeholder='New Password'/>
                </label>
                <label>
                    <input defaultValue={dateOfBirth} type='date' onChange={(e) => setDateOfBirth(e.target.value)} placeholder='Date Of Birth'/>
                </label>
                <label>
                    <input defaultValue={email} type='email' onChange={(e) => setEmail(e.target.value)} placeholder='Email'/>
                </label>
                <label>
                    <input defaultValue={educationalRole} type='text' onChange={(e) => setEducationalRole(e.target.value)} placeholder='Educational Role'/>
                </label>
                <p className='settings-status-msg'>{status}</p>
                <br></br>
                <div className='account-button'>
                <button type='submit' disabled={currentPassword === ''}>Update Details</button> {/* On submit it updates the users details based off of the data as well as their password for verification */}
                </div>
                <button type='button' onClick={returnHomepage}>Dashboard</button> {/* Return to login page */}
                <div className='account-button'>
                <button type='button' onClick={deleteAccount} disabled={currentPassword === ''}>Delete Account</button> {/* Deletes the user account */}
                </div>
            </form>
            </div>
        </div>
    )
}