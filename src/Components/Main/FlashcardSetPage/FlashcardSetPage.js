import api from '../../../api/axiosConfig'
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import './FlashcardSetPage.css'; // Importing CSS file


export default function FlashcardSetPage() {
    // constants
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('');

    const [currentId, setCurrentId] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const [cards, setCards] = useState([{ id: 1, front: '', back: '' }]);

    const showNextCard = () => {
        setCurrentId(currentId < cards.length - 1 ? currentId + 1 : currentId);
        setIsFlipped(false);
    };

    const showPrevCard = () => {
        setCurrentId(currentId > 0 ? currentId - 1 : currentId);
        setIsFlipped(false);
    };

    const flipCard = () => {
        setIsFlipped(!isFlipped);
    };


    const { id } = useParams(); // use parameters based off of the route link id

    useEffect(() => {
        const fetchFlashcardDetails = async () => {
            try {
                const response = await api.get(`/api/v1/flashcardSets/${id}`); // load in details about the flashcard using get request 
                setName(response.data['name']);
                setDescription(response.data['description']);
                setDate(response.data['creationDate']);
                setType(response.data['setType']);
                const updatedCards = response.data['flashcards'].map(card => ({
                    id: card['id'],
                    front: card['front'],
                    back: card['back']
                }))
                
                setCards(updatedCards);
                console.log(cards);
            } catch (error) {
                console.log(error);
            }
        };
    
        fetchFlashcardDetails();
        
    }, []);
    const milliseconds = date; // Example timestamp in milliseconds
    const seconds = milliseconds / 1000; // Convert milliseconds to seconds
    const myDate = new Date(seconds * 1000); // Create Date object from seconds

    const navigate = useNavigate();

    const dashboard = () => {
        navigate('/home'); // return back to the dashboard
    }
    
    return (
        <div>
            <h3>Flashcard Name: {name}</h3>
            <h4>Description:</h4>
            <p>{description}</p>
            <h4>Creation Date: {myDate.toDateString()}</h4>
            <h4>Set Type: {type}</h4>
            <div>
            <button type='button' >Return to Homepage</button>
            </div>

                <div>
                <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={flipCard}>
                    <div className="front">{cards[currentId].front}</div>
                    <div className="back">{cards[currentId].back}</div>
                </div>
                <div>
                    <button type="button" onClick={showPrevCard}>Previous</button>
                    <button type="button" onClick={flipCard}>Flip</button>
                    <button type="button" onClick={showNextCard}>Next</button>
                </div>
                </div>
        </div>

    )
}

