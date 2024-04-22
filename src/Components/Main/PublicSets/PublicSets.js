import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import '../PublicSets/PublicSets.css';

export default function PublicSets() {
    const [flashcardSets, setFlashcardSets] = useState([]);
    const navigate = useNavigate();
    const dashboard = () => {
        navigate('/home');
    }

    const loadFlashcardSets = async () => {
        try {
            const accountResponse = await api.get(`/api/v1/accounts`); // get all accounts 
            const usernames = accountResponse.data.map(user => user.username); // map out only the usernames
            const data = await Promise.all(usernames.map(async (user) => {
                const flashcardSetResponse = await api.get(`/api/v1/flashcardSets`); // get all flashcards set
                const userFlashcardSets = flashcardSetResponse.data.filter(flashcardSet => {
                    // filter out flashcard sets which are public as well as the author username equalling to the current user
                    return flashcardSet['public'] === true && flashcardSet['authorUsername'] === user;
                });
                console.log({ user, data: userFlashcardSets })
                return { user, data: userFlashcardSets };
            }));
            
            setFlashcardSets(data);
        } catch (error) {
            console.error("Error loading flashcard sets:", error);
        }
    }
    

    const redirect = (id) => {
        navigate(`/flashcardSet/${id}`);
    }

    useEffect(() => {
        loadFlashcardSets();
    }, []);


    return (
        <div>
            <h1>Public Flashcard Sets</h1>
            <div>
                <button type="button" onClick={dashboard}>Return to Dashboard</button>
            </div>

            <div className='created-flashcard-sets'>
                {flashcardSets && flashcardSets.length > 0 ? (
                    flashcardSets.map(({user, data}, index) => (
                        <div key={index}>
                            <label>{user}'s FlashcardSets</label>
                            <div className='public-grid'>
                                {data && data.length > 0  ? ( 
                                     data.map((flashcardSet, setIndex) => (
                                        <button key={setIndex} className='folder-button' onClick={() => redirect(flashcardSet.id)}>{flashcardSet.name}</button>
                                    ))
                                ): ( 
                                    <p>No Flashcard Sets Available</p>
                                )}
                               
                            </div>
                            <br></br>
                        </div>
                    ))
                ) : (
                    <p>Empty.</p>
                )}
            </div>


        </div>

    )
}