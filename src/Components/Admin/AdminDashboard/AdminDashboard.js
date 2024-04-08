import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';



export default function AdminDashboard() {
    const[currentUser, setCurrentUser] = useState('');
    const[currentAccountType, setCurrentAccountType] = useState('');

    const navigate = useNavigate();

    useEffect(() => {  // retrieve data from localstorage and update the <p> on screen
        const userJson = JSON.parse(localStorage.getItem('currentUser')); 
        setCurrentUser(userJson); 
        const accountTypeJson = JSON.parse(localStorage.getItem('currentRole'));
        setCurrentAccountType(accountTypeJson);
    }, []);


    const signOut = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/v1/accounts/logout'); // inform backend that the user is logging out.
            localStorage.removeItem('currentUser'); // remove the current user and current role logged in so that others can log in
            localStorage.removeItem('currentRole');
            navigate('/login'); // go back to the login page
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    
    const accountSettings = () => {
        navigate('/accountsettings'); // go to account settings
    }
    
    
    return (
        <div>
            <h1>Quizzify - Admin Dashboard</h1>
            <h2>Current Logged In Account:</h2>
            {currentUser ? ( 
                <div>
                    <p>Username: {currentUser}</p>
                    <p>Account Type: {currentAccountType} </p>
                </div>
            ) : (
                <p>No user logged in</p>
            )} {/* if there is a current user logged in, then return the username and account type. If not, then there is no user logged in */}
            <button type="button" onClick={signOut}>Sign Out</button> {/* Sign Out */}
            <button type="button" onClick={accountSettings}>Account Settings</button>
        </div>
        
        
    )
}