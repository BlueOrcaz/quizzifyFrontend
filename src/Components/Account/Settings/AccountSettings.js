import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Homepage from '../../Main/Homepage/Homepage';
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
        navigate("/home");
    }
    let userid = localStorage.getItem('currentId');
    let substringuserid = userid.substring(1, userid.length - 1)
    const loadDetails = async () => {
        try {      
            const response = await api.get(`/api/v1/accounts/${substringuserid}`);
            console.log(response.data);
            setUsername(response.data['username']);
            setDateOfBirth(response.data['dateOfBirth']);
            setEmail(response.data['dateOfBirth']);
            setEducationalRole(response.data['educationalRole']);
        } catch (error) {
            console.log(error);
        }
    
    }



    const updateDetails = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/v1/accounts/update/${substringuserid}?currentPassword=${currentPassword}`, {
                username: username,
                email: email,
                password: newPassword,
                dateOfBirth: dateOfBirth,
                educationalRole: educationalRole
            })
            .then(response => {
                console.log("Account updated succesfully", response.data);
            })
            .catch(error => {
                console.error(error);
            })
        } catch (e) {
            console.log(e);
        }
    }



    useEffect(() => {
        loadDetails();
    }, []);
    

    return (
        <div className='settings-wrapper'>
            <h1>Account Settings</h1>
            <div>
            <form onSubmit={updateDetails}>
                <label>
                    <p>Username</p>
                    <input defaultValue={username} type='text' id='usernametxt'/>
                </label>
                <label>
                    <p>Current Password</p>
                    <input type='text' onChange={(e) => setCurrentPassword(e.target.value)} id='currentpasswordtxt'/>
                </label>
                <label>
                    <p>New Password</p>
                    <input type='text' onChange={(e) => setNewPassword(e.target.value)} id='newpasswordtxt'/>
                </label>
                <label>
                    <p>DateOfBirth</p>
                    <input defaultValue={dateOfBirth} type='text' id='dateOfBirthtxt'/>
                </label>
                <label>
                    <p>Email</p>
                    <input defaultValue={email} type='text' id='emailtxt'/>
                </label>
                <label>
                    <p>Educational Role</p>
                    <input defaultValue={educationalRole} type='text' id='educationalroletxt'/>
                </label>
                <div>
                    <button type='submit'>Update Details</button>
                    <button type='button' onClick={returnHomepage}>Login Page</button>
                </div>
            </form>
            </div>
        </div>
    )
}