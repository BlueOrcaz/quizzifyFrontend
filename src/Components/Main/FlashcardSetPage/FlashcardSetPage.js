import api from '../../../api/axiosConfig'
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify';

import './FlashcardSetPage.css'; // Importing CSS file


export default function FlashcardSetPage() {
    // constants
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('');

    let authorUser = localStorage.getItem('currentUser');
    let substringAuthorUser = authorUser.substring(1, authorUser.length - 1);

    const [currentId, setCurrentId] = useState(0);

    // front, back - checks whether or not the card is flipped
    const [isFlipped, setIsFlipped] = useState(false);

    // structure for front/back 
    const [cards, setCards] = useState([{ id: 1, front: '', back: '' }]);

    // sanitized front and back to prevent html attacks
    const sanitizedFrontHTML = DOMPurify.sanitize(cards[currentId].front);
    const sanitizedBackHTML = DOMPurify.sanitize(cards[currentId].back);
    const sanitizedDescription = DOMPurify.sanitize(description);



    // structure for mcq flashcards
    const [options] = useState([{ optionId: 1, option: '', correctAnswer: "" }]);
    const [multipleChoiceCards, setMultipleChoiceCards] = useState([{ id: 1, question: '', allOptions: options }]);



    const [correct, setCorrect] = useState('');
    const [selectedValues, setSelectedValues] = useState([]); // arr used to collect all selected answers to compare

    const { id } = useParams(); // use parameters based off of the route link id

    // retrieve user id
    let userid = localStorage.getItem('currentId');
    let substringuserid = userid.substring(1, userid.length - 1) // remove the stupid double quotations from my string


    const navigate = useNavigate();

    const dashboard = () => {
        navigate('/home'); // return back to the dashboard
    }

    const editor = () => {
        navigate(`/editor/${id}`);
    }

    const showNextCard = (flashcardType) => {
        if (flashcardType === "Front, Back") {
            setCurrentId(currentId < cards.length - 1 ? currentId + 1 : currentId); // if the current id is less then the card length, then increment it by 1. If not, then it stays the same
        } else if (flashcardType === "Multiple Choice") {
            setCurrentId(currentId < multipleChoiceCards.length - 1 ? currentId + 1 : currentId); // same thing but for mcq cards
        }
    };

    const deleteFlashcardSet = async () => {
        try {
            await api.delete(`/api/v1/flashcardSets/deleteFlashcardSet/${id}?authorId=${substringuserid}`);
            navigate('/home');
        } catch (error) {
            console.log(error);
        }
    }

    const showPrevCard = () => {
        setCurrentId(currentId > 0 ? currentId - 1 : currentId); // checks if the current id is greater then 0. If it is, then that means its not on last index and can decrement
        setIsFlipped(false);
        setCorrect(''); // remove correct
    };

    const flipCard = () => {
        setIsFlipped(!isFlipped);
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) { // if checkbox is checked, add its value to the array
            setSelectedValues([...selectedValues, value]);
        } else { // if not then remove value from array
            setSelectedValues(selectedValues.filter((val) => val !== value));
        }
    };

    const checkValues = () => {
        let isCorrect = true;
        // loop through selectedValues array
        // if there is any "false" value, set isCorrect to false
        for (let i = 0; i < selectedValues.length; i++) {
            if (selectedValues[i] === 'false') {
                isCorrect = false;
                break; // No need to continue checking once we found a 'false' value
            }
        }
        if (selectedValues.length === 0) {
            isCorrect = false;
        }
        // Update the correct state based on the final result
        setCorrect(isCorrect ? 'Correct' : 'Incorrect'); // if it is correct, then setcorrect to "correct". if not then set to incorrect
    }

    const fetchFlashcardDetails = async () => {
        try {
            const response = await api.get(`/api/v1/flashcardSets/${id}`); // load in details about the flashcard using get request 
            setName(response.data['name']);
            setAuthor(response.data['authorUsername']);
            setDescription(response.data['description']);
            setDate(response.data['creationDate']);
            setType(response.data['setType']);
            setMultipleChoiceCards(response.data['mcqFlashcards']);
            const updatedCards = response.data['flashcards'].map(card => ({
                id: card['id'],
                front: card['front'],
                back: card['back']
            }))
            setCards(updatedCards);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => { // so it prevents multiple api get requests
        fetchFlashcardDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const seconds = date / 1000;
    const myDate = new Date(seconds * 1000);  // epoch time - dunno why it doesnt work properly if not divided by 1000 then multiplied by 1000


    return (
        <div className='set-page'>
            <div className='editor-wrapper'>
                {/* Flashcard Set Details which is taken from the consts and they are taken from api get req */}
                <h3 >Flashcard Name: {name}</h3>
                <h4>Flashcard Author: {author}</h4>
                <h4>Description:</h4>
                <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
                <h4>Creation Date: {myDate.toDateString()}</h4>
                <h4>Set Type: {type}</h4>
                <br />


                {/* if the deck type is front, back then itll display differing buttons and ability to flip cards */}
                {type === 'Front, Back' && (
                    <div className='front-back-wrapper'>
                        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={flipCard}>
                            <div className="front">
                                <p className='p-bold'>Front: </p>
                                <br></br>
                                <div dangerouslySetInnerHTML={{ __html: sanitizedFrontHTML }} />
                            </div>
                            <div className="back">
                                <p className='p-bold'>Back: </p>
                                <br></br>
                                <div dangerouslySetInnerHTML={{ __html: sanitizedBackHTML }} />
                            </div>
                        </div>
                        <div className='flashcard-buttons'>
                            {/* previous and next buttons, as well as "flip" button. Plays animation in css */}
                            <button type="button" onClick={showPrevCard}>Previous</button>
                            <button type="button" onClick={flipCard}>Flip</button>
                            <button type="button" onClick={() => showNextCard("Front, Back")}>Next</button>
                        </div>
                    </div>
                )}
                {/* if the deck type is mcq then itll display option buttons and prevent user from flipping cards */}
                {type === 'Multiple Choice' && (
                    <div>
                        <div className='multiple-choice-set' >
                            <div className='question-id'>
                                Question {multipleChoiceCards[currentId].id}
                            </div>
                            <div className='question'>
                                {multipleChoiceCards[currentId].question}
                            </div>

                            <div className='options'>
                                {multipleChoiceCards[currentId].allOptions.map(option => (
                                    <div>
                                        {/* Label for each checkbox */}
                                        <label>
                                            Option {option.optionId}: <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(option.option) }} />
                                        </label>
                                        {/* checkbox which returns the boolean value of the option: if it is correct, it returns true, if not itll return false */}
                                        <input type="checkbox" id={`option${option.optionId}`} name={`option${option.optionId}`} value={option.correctAnswer} onChange={handleCheckboxChange} />
                                    </div>
                                ))}

                            </div>
                            <br></br>
                            {/* once submitted it calls to check values and if it is all correct, returns "correct", vice versa */}
                            <button type='button' onClick={checkValues}>Submit</button>
                            <p>{correct}</p>
                        </div>
                        <br></br>
                        <div className='buttons'>
                            {/* previous and next buttons */}

                            <button type="button" onClick={() => showNextCard("Multiple Choice")}>Next</button>
                            <button type="button" onClick={showPrevCard}>Previous</button>
                        </div>
                    </div>
                )}



            </div>
            
            <br></br>
            <div className='homepage-button'>
                {/* return to homepage button */}

                { author === substringAuthorUser ? (
                    <div>
                    <button type='button' onClick={editor}>Edit FlashcardSet</button>
                    <button className='red-button' type='button' onClick={deleteFlashcardSet}>Delete FlashcardSet</button>
                    </div>
                ): (
                    <button type='button' onClick={editor}>Duplicate Flashcard Set</button>
                )}
                <button type='button' onClick={dashboard} >Return to Homepage</button>
            </div>

        </div>
    )
}

