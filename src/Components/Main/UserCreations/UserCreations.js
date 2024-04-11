import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserCreations() {
    const navigate = useNavigate();

    // perform getAll based off of userid for flashcardSets based off the logged in account

    return (
        <div className='user-creations-wrapper'>
            <h1>User Creations</h1>
            <h2>Created Folders</h2>
            <h2>Created Flashcard Sets</h2>
            <div className='created-flashcard-sets-wrapper'>
                
            </div>
        </div>
    )
}