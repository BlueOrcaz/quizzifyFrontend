import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';

export default function Homepage() {
    const[currentUser, setCurrentUser] = useState(''); // const arrays
    const[currentAccountType, setCurrentAccountType] = useState('');

    const navigate = useNavigate(); // react routes

    useEffect(() => { // retrieve data from localstorage and update current user and currentrole
        const userJson = JSON.parse(localStorage.getItem('currentUser'));
        setCurrentUser(userJson);
        const accountTypeJson = JSON.parse(localStorage.getItem('currentRole'));
        setCurrentAccountType(accountTypeJson);
    }, []);


    const signOut = async (e) => {
        e.preventDefault(); // prevent default error from occurring
        try {
            await api.post('/api/v1/accounts/logout'); // post request to let the backend know you are logged out.
            localStorage.removeItem('currentUser'); 
            localStorage.removeItem('currentRole');
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const accountSettings = () => {
        navigate('/accountsettings');
    }

    const quizEditor = () => {
        navigate('/editor');
    }
    
    return (
        <div>
            <h1>Quizzify - Home</h1>
            <h2>Current Logged In Account:</h2>
            {/* checks if there is a current user; if not, then no user is logged in. If there is then you assign currentuser and current account type to the two paras*/}
            {currentUser ? (
                <div>
                    <p>Username: {currentUser}</p>
                    <p>Account Type: {currentAccountType} </p>
                </div>
            ) : (
                <p>No user logged in</p>
            )}
            {/* Call out consts on click */}
            <button type="button" onClick={signOut}>Sign Out</button>
            <button type="button" onClick={accountSettings}>Account Settings</button>

            <div>
                <button type="button" onClick={quizEditor}>Flashcards Editor</button>
            </div>
        </div>
        
        
        
        
    )
}