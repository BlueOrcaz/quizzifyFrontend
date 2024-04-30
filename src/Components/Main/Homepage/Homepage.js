import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';
import '../Homepage/Homepage.css';

export default function Homepage() {
    const navigate = useNavigate(); // react routes

    const signOut = async (e) => {
        e.preventDefault(); 
        try {
            await api.post('/api/v1/accounts/logout'); // post request to let the backend know you are logged out.
            localStorage.removeItem('currentUser'); // remove the current details so that itll display flashcards properly 
            localStorage.removeItem('currentRole');
            localStorage.removeItem('currentId');
            navigate('/login'); // return to login page
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const accountSettings = () => { // navigate to the settings page
        navigate('/accountsettings');
    }

    const quizEditor = () => { // navigate to the editor
        navigate('/editor');
    }

    const creations = () => { // navigate to user creations
        navigate('/creations');
    }

    const publicSets = () => { // navigate to all public flashcard sets
        navigate('/allSets');
    }
    
    return (
        <div>
            <h1>Quizzify Dashboard</h1>
            {/* Call out functions on click */}
            <button type="button" onClick={creations}>User Creations</button>
            <button type="button" onClick={publicSets}>Public Flashcard Sets</button>
            <button type="button" onClick={quizEditor}>Flashcards Editor</button>
            <button type="button" onClick={accountSettings}>Account Settings</button>
            <div className='signout-button'>
                <button type="button" onClick={signOut}>Sign Out</button>
            </div>
        </div>
    )
}