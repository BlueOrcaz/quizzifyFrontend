import React, { useEffect, useState } from 'react';
import { json, useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';


export default function AdminDashboard() {
    const[currentUser, setCurrentUser] = useState(null);
    const[currentAccountType, setCurrentAccountType] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userJson = localStorage.getItem('currentUser');
        const user = userJson ? JSON.parse(userJson) : null;
        setCurrentUser(user);

        const accountTypeJson = localStorage.getItem('currentRole');
        const type = accountTypeJson ? JSON.parse(accountTypeJson) : null;
        setCurrentAccountType(type);
    }, []);


    const signOut = async (e) => {
        e.preventDefault();
        try {
            await api.post('http://localhost:8080/api/v1/accounts/logout');
            localStorage.removeItem('currentUser'); 
            localStorage.removeItem('currentRole');
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };
    
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
            )}
            <button type="button" onClick={signOut}>Sign Out</button>
        </div>
        
        
    )
}