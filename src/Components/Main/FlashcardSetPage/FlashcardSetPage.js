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
    const [options] = useState([{ optionId: 1, option: '', correctAnswer: "" }]);
    const [multipleChoiceCards, setMultipleChoiceCards] = useState([{ id: 1, question: '', allOptions: options }]);

    const [correct, setCorrect] = useState('');


    const showNextCard = (flashcardType) => {
        if (flashcardType === "Front, Back") {
            setCurrentId(currentId < cards.length - 1 ? currentId + 1 : currentId);
            setIsFlipped(false);
        } else if (flashcardType === "Multiple Choice") {
            setCurrentId(currentId < multipleChoiceCards.length - 1 ? currentId + 1 : currentId);
            setIsFlipped(false);
        }
    };


    const showPrevCard = () => {
        setCurrentId(currentId > 0 ? currentId - 1 : currentId);
        setIsFlipped(false);
        setCorrect('');
    };

    const flipCard = () => {
        setIsFlipped(!isFlipped);
        setCorrect('');
    };

    const [selectedValues, setSelectedValues] = useState([]);

    useEffect(() => {
        console.log(correct);
    }, [correct]);

    // Function to handle checkbox change
    const handleCheckboxChange = (event) => {
      const { value, checked } = event.target;
  
      // If checkbox is checked, add its value to the array
      // If checkbox is unchecked, remove its value from the array
      if (checked) {
        setSelectedValues([...selectedValues, value]);
      } else {
        setSelectedValues(selectedValues.filter((val) => val !== value));
      }
    };

    const checkValues = () => {
        console.log(selectedValues);
        // Assume initially correct
        let isCorrect = true;
    
        // loop through selectedValues array
        // if there is any "false" value, set isCorrect to false
        for(let i = 0; i < selectedValues.length; i++) {
            if(selectedValues[i] === 'false') {
                isCorrect = false;
                break; // No need to continue checking once we found a 'false' value
            }
        }
    
        // Update the correct state based on the final result
        setCorrect(isCorrect ? 'Correct' : 'Incorrect');
    
        console.log(correct);
    }
    
    

    

    const { id } = useParams(); // use parameters based off of the route link id


    useEffect(() => {
        const fetchFlashcardDetails = async () => {
            try {
                const response = await api.get(`/api/v1/flashcardSets/${id}`); // load in details about the flashcard using get request 
                setName(response.data['name']);
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
                <button type='button' onClick={dashboard} >Return to Homepage</button>
            </div>
            {type === 'Front, Back' && (
                <div>
                    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={flipCard}>
                        <div className="front">
                            <p>Front: </p>
                            <br></br>
                            {cards[currentId].front}
                        </div>
                        <div className="back">
                            <p>Back: </p>
                            <br></br>
                            {cards[currentId].back}
                        </div>
                    </div>
                    <div className='buttons'>
                        <button type="button" onClick={showPrevCard}>Previous</button>
                        <button type="button" onClick={flipCard}>Flip</button>
                        <button type="button" onClick={() => showNextCard("Front, Back")}>Next</button>
                    </div>
                </div>
            )}

            {type === 'Multiple Choice' && (
                <div>
                    <div className='flashcard' >
                        <div className='Question'>
                            Question {multipleChoiceCards[currentId].id}
                        </div>
                        <div className='Options'>
                            {multipleChoiceCards[currentId].allOptions.map(option => (
                                <div>
                                    <input
                                        type="checkbox"
                                        id={`option${option.optionId}`}
                                        name={`option${option.optionId}`}
                                        value={option.correctAnswer}
                                        onChange={handleCheckboxChange}
                                    />

                                    <label htmlFor={`option${option.optionId}`}>
                                        Option {option.optionId}:  {option.option}
                                    </label>
                                </div>
                            ))}

                        </div>
                        <button type='button' onClick={checkValues}>Submit</button>
                        <p>{correct}</p>
                    </div>


                    
                    <div className='buttons'>
                        <button type="button" onClick={showPrevCard}>Previous</button>
                        <button type="button" onClick={() => showNextCard("Multiple Choice")}>Next</button>
                    </div>
                </div>
            )}

        </div>

    )
}

