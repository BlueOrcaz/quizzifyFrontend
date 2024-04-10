import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';

export default function Homepage() {
    const navigate = useNavigate(); // react routes





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
            <h1>Quizzify Dashboard</h1>
            {/* Call out consts on click */}
            <button type="button">Your Flashcard Sets</button>
            <button type="button" onClick={quizEditor}>Flashcards Editor</button>
            <button type="button" onClick={accountSettings}>Account Settings</button>
            <button type="button" onClick={signOut}>Sign Out</button>
        </div>
        
        
        
        
    )
}