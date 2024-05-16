import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import '../PublicSets/PublicSets.css';

export default function PublicSets() {
    const [flashcardSets, setFlashcardSets] = useState([]); // store all public flashcard sets inside a singular array
    const loadPublicSets = async () => {
        try {
            const accountResponse = await api.get(`/api/v1/accounts`); // get all accounts 
            const usernames = accountResponse.data.map(user => user.username); // map out only the usernames
            const flashcardSetResponse = await api.get(`/api/v1/flashcardSets`); // get all flashcards set
            const data = await Promise.all(usernames.map(async (user) => {
                const userFlashcardSets = flashcardSetResponse.data.filter(flashcardSet => {
                    // filter out flashcard sets which are public as well as the author username equalling to the current user
                    return flashcardSet['public'] === true && flashcardSet['authorUsername'] === user;
                });
                //console.log({ user, data: userFlashcardSets }) 
                return { user, data: userFlashcardSets }; // each entry in usernames array will consist of the username, as well as their flashcard set data
            }));
            
            setFlashcardSets(data); // update the array list
        } catch (error) {
            console.error("Error loading flashcard sets:", error);
        }
    }

    useEffect(() => {
        loadPublicSets(); // when the page loads load all flashcard sets once
    }, []); // [] means that it loads only once

    const navigate = useNavigate();
    const dashboard = () => { // return back to homepage
        navigate('/home');
    }
    

    const redirect = (id) => { // go to a specific flashcard set id
        navigate(`/flashcardSet/${id}`);
    }




    return (
        <div>
            <h1>Public Flashcard Sets</h1>
            <div>
                <button type="button" onClick={dashboard}>Return to Dashboard</button>
            </div>
            <div className='created-flashcard-sets'>
                {flashcardSets && flashcardSets.length > 0 ? ( // if array has entries and length is greater than zero
                    flashcardSets.map(({user, data}, index) => ( // map out the array into the username, their flashcard set data, and an index
                        <div key={index}>
                            {/* concat value into the label */}
                            <label className='bold-text'>{user}'s FlashcardSets</label> 
                            <div className='public-grid'>
                                {data && data.length > 0  ? ( // if there is userdata then 
                                     data.map((flashcardSet, setIndex) => ( // map out the data with each value being a flashcard obj
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