import React, { useState } from 'react';
import api from '../../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import '../Editor/Editor.css';

export default function Editor() {
  // general constants
  const [flashcardSetName, setFlashcardSetName] = useState('');
  const [description, setDescription] = useState('');
  const [flashcardSetType, setFlashcardSetType] = useState('');

  // flashcard constants
  const [cards, setCards] = useState([{ id: 1, front: '', back: '' }]);

  // multiple choice card constants
  const [options] = useState([{ optionId: 1, option: '', correctAnswer: "" }]);
  const [multipleChoiceCards, setMultipleChoiceCards] = useState([{ id: 1, question: '', allOptions: options }]);

  // flashcard set id constant
  const [inputId, setInputId] = useState('');





  // retrieve user id
  let userid = localStorage.getItem('currentId');
  let substringuserid = userid.substring(1, userid.length - 1) // remove the stupid double quotations from my string

  // utilise react routes
  const navigate = useNavigate();
  const dashboard = () => {
    navigate('/home'); // return back to the dashboard
  }

  const addFlashcard = (flashcardType) => { // add a flashcard based off of the two possible flashcard types
    switch (flashcardType) {
      case "Front, Back": // in the case of front, back, it creates an empty object constant with the current flashcard id, as well as as empty front and back values
        let flashcardId;
        if (cards.length > 0) {
          flashcardId = cards[cards.length - 1].id + 1;
        } else {
          flashcardId = 1;
        }
        const newCard = { id: flashcardId, front: '', back: '' };
        const updatedCards = [...cards, newCard]; // combine array
        setCards(updatedCards);  // refresh the current stored cards in cards constant
        break;
      case "Multiple Choice": // in the case of multiple choice, it creates an empty object constant with the current mcq id, as well as an empty question as well as all empty options
        let mcqId;
        if (cards.length > 0) {
          mcqId = multipleChoiceCards[multipleChoiceCards.length - 1].id + 1;
        } else {
          mcqId = 1;
        }
        const newMCQCard = { id: mcqId, question: '', allOptions: options };
        const updatedMCQCards = [...multipleChoiceCards, newMCQCard]; // combine array
        setMultipleChoiceCards(updatedMCQCards); // refresh the current stored cards in cards constant
        break;
      default: // cant get default case 
        break;
    }
  }

  const addOption = (cardId) => { // add an option in mcq flashcards based off of the id
    const updatedCards = multipleChoiceCards.map(card => { // map out the array based off of each card and their value
      if (card.id === cardId) { // if the card id matches the parameter then
        const optionCount = card.allOptions.length + 1; // increment length
        const newOption = { optionId: optionCount, option: '', correctAnswer: "" }; // create a new option
        const updatedOptions = [...card.allOptions, newOption]; // merge it with the existing array
        return { ...card, allOptions: updatedOptions }; // return the new array
      }
      return card; // return the card
    });
    setMultipleChoiceCards(updatedCards); // update the array of multiple choice cards
  }

  const removeOption = (cardId, optionIndex) => { // remove option based off of a card id and the option index to remove
    const updatedCards = multipleChoiceCards.map(card => { // map out all mcq cards
      if (card.id === cardId) { // if the card id matches cardid parameter then 
        const updatedOptions = card.allOptions.filter((option, index) => index !== optionIndex); // filters out all the cards that doesnt equal to the requested optionindex
        return { ...card, allOptions: updatedOptions }; // return the new array
      }
      return card; // return card
    });
    setMultipleChoiceCards(updatedCards); // update the array of mcq cards
  }

  const removeFlashcard = (id, flashcardType) => { // remove a flashcard based off of the id and the flashcard type to remove
    switch (flashcardType) {
      case "Front, Back": // in the case of a regular flashcard
        setCards(cards => {
          const updatedCards = []; // static stack to store the cards that arent the id

          for (let i = 0; i < cards.length; i++) { // loop through the current cards array
            const card = cards[i]; // assign the current index to be the current card
            if (card.id !== id) { // if it doesnt match the id then
              updatedCards.push(card); // push it into the stack
            }
          }

          refreshIds(updatedCards, "Front, Back"); // refresh the ids so that they start from 1
          return updatedCards; // return the new cards
        });
        break;
      case "Multiple Choice": // in the case of mcq cards
        setMultipleChoiceCards(cards => { // update the multiple choice cards
          const updatedCards = [];
          for (let i = 0; i < cards.length; i++) { // same thing as before but for mcq cards
            const card = cards[i];
            if (card.id !== id) {
              updatedCards.push(card);
            }
          }

          refreshIds(updatedCards, "Multiple Choice");
          return updatedCards;
        })
        break;
      default:
        break;
    }

  }

  const refreshIds = (updatedCards, flashcardType) => {
    switch (flashcardType) {
      case "Front, Back":
        setCards(updatedCards.map((card, index) => ({ ...card, id: index + 1 }))); // map out all the cards and start incrementing them
        break;
      case "Multiple Choice":
        setMultipleChoiceCards(updatedCards.map((card, index) => ({ ...card, id: index + 1 }))); // same thing for mcq cards
        break;
      default:
        break; // not possible to occur 
    }

  };




  const changeFlashcardSetType = (e) => { // change flashcard set type when needed
    setFlashcardSetType(e.target.value) // based off of drop down selection
  };

  const changeSide = (id, value, side) => { // update the side of the card based off of the side, value you want to update, and card id
    setCards(function (previousCards) { // function with all cards
      switch (side) {
        case "Front":
          return previousCards.map(function (card) {
            if (card.id === id) {
              return { ...card, front: value }; // If the card's id matches, update the 'front' property
            } else {
              return card;
            }
          })
        case "Back":
          return previousCards.map(function (card) {
            if (card.id === id) {
              return { ...card, back: value }; // same thing but just for 'back' property
            } else {
              return card;
            }
          })
        default:
      }
    })
  }

  const changeMCQuestion = (id, value) => {
    //console.log(id); debug
    setMultipleChoiceCards(previousCards => {
      return previousCards.map(card => {
        if (card.id === id) {
          return { ...card, question: value } // update the question if it matches the id
        }
        return card;
      })
    })
  }

  const changeMCQSide = (id, optionIndex, value) => {
    setMultipleChoiceCards(previousCards => { // same thing as before, but for options
      return previousCards.map(card => {
        if (card.id === id) {
          const updatedOptions = card.allOptions.map((option, index) => {
            if (index === optionIndex) {
              return { ...option, option: value }; // update if the index matches
            } else {
              return option;
            }
          });
          return { ...card, allOptions: updatedOptions }; // return the updated options
        } else {
          return card;
        }
      });
    });
  }

  const changeMCQAnswer = (id, optionIndex, value) => { // same thing as before, but with the correct answer boolean
    setMultipleChoiceCards(previousCards => {
      return previousCards.map(card => {
        if (card.id === id) {
          const updatedOptions = card.allOptions.map((option, index) => {
            if (index === optionIndex) {
              return { ...option, correctAnswer: value };
            } else {
              return option;
            }
          });
          return { ...card, allOptions: updatedOptions };
        } else {
          return card;
        }
      });
    });
  }

  const clearFlashcardValue = (id, side) => {
    return setCards(function (previousCards) {
      return previousCards.map(function (card) {
        if (card.id === id) {
          if (side === 'front') {
            return { ...card, front: '' }; // If the card's id matches, clear the front property
          } else if (side === 'back') {
            return { ...card, back: '' };
          }
        }
        return card;

      })
    })
  }

  const clearMCQField = (id, optionIndex) => {
    setMultipleChoiceCards(previousCards => { // update the previous cards.
      return previousCards.map(card => {
        if (card.id === id) {
          const updatedOptions = card.allOptions.map((option, index) => {
            if (index === optionIndex) {
              return { ...option, option: '' }; // clear the option if it matches the optionindex
            }
            return option;
          });
          return { ...card, allOptions: updatedOptions };
        }
        return card;
      });
    });
  };

  const clearMCQQuestion = (id) => {
    setMultipleChoiceCards(previousCards => { // update previous cards
      return previousCards.map(card => {
        if (card.id === id) {
          return { ...card, question: '' };
        }
        return card;
      })
    })
  }


  const createDeck = async (flashcardType) => {
    switch (flashcardType) {
      case "Front, Back": // in the case of a flashcard
        try {
          const response = await api.post("/api/v1/flashcardSets/createFlashcardSet", { // send axios POST request to the backend with the data
            authorId: substringuserid,
            setType: flashcardSetType,
            isPublic: false,
            name: flashcardSetName,
            description: description,
            creationDate: Date.now(), // unix time
            flashcards: cards.map(card => ({
              id: card.id,
              front: card.front,
              back: card.back
            }))
          });
          localStorage.setItem('createdFlashcardID', JSON.stringify(response.data)); // backend returns the flashcard object id as a string
          console.log("flashcardID: ", response.data);
        } catch (error) {
          console.log(error);
        }
        break;
      case "Multiple Choice":
        try {
          const response = await api.post("/api/v1/flashcardSets/createFlashcardSet", { // send it for mcq cards
            authorId: substringuserid,
            setType: flashcardSetType,
            isPublic: false,
            name: flashcardSetName,
            description: description,
            creationDate: Date.now(),
            mcqFlashcards: multipleChoiceCards
          });
          localStorage.setItem('createdFlashcardID', JSON.stringify(response.data));
          console.log("flashcardID: ", response.data);
        } catch (error) {
          console.log(error);
        }
        break;
      default:
    }
  }

  const loadFlashcardDetails = async () => {
    const response = await api.get(`/api/v1/flashcardSets/${inputId}`); // getter method to retrieve the flashcard set based off of the objectid
    let flashcardType = response.data['setType'];
    switch (flashcardType) {
      case "Front, Back":
        try {
          //console.log(response.data);

          const updatedCards = response.data["flashcards"].map(card => ({
            id: card["id"],
            front: card["front"],
            back: card["back"]
          }));

          // update all details based off of the given object from GET request
          setCards(updatedCards);


          setFlashcardSetName(response.data['name']);
          setDescription(response.data['description']);
          setFlashcardSetType(response.data['setType']);
          setMultipleChoiceCards(response.data['mcqFlashcards']);
        } catch (error) {
          console.log(error);
        }
        break;
      case "Multiple Choice":
        try {
          //console.log(response.data);

          // update all details based off of the given object from GET request
          setFlashcardSetName(response.data['name']);
          setDescription(response.data['description']);
          setFlashcardSetType(response.data['setType']);
          setMultipleChoiceCards(response.data['mcqFlashcards']);
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    }
  }

  const updateFlashcardSet = async (flashcardType) => {
    switch (flashcardType) {
      case "Front, Back":
        try {
          await api.put(`/api/v1/flashcardSets/update/${inputId}?authorId=${substringuserid}`, { // put request to update the details, with the userid to prevent other users from updating the flashcard set by themselves.
            setType: flashcardSetType,
            isPublic: false,
            name: flashcardSetName,
            description: description,
            flashcards: cards.map(card => ({
              id: card.id,
              front: card.front,
              back: card.back
            }))
          });
          //console.log(response.data); debugging
        } catch (error) {
          console.log(error);
        }
        break;
      case "Multiple Choice":
        try {
          await api.put(`/api/v1/flashcardSets/update/${inputId}?authorId=${substringuserid}`, { // put request to update the details, with the userid to prevent other users from updating the flashcard set by themselves.
            setType: flashcardSetType,
            isPublic: false,
            name: flashcardSetName,
            description: description,
            mcqFlashcards: multipleChoiceCards
          })
          //console.log(response.data);
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    }

  }


  return (
    <div className='flashcard-editor'>
      <h1 className='editor-h2'>Flashcard Set Editor</h1>
      <form>
        <div className='default-set'>
          <div className='load-deck'>
            <label className='card-label'>Load in Existing Flashcard Deck</label> {/* Allows users to load in an object id for any flashcard that they've made */}
            <input type="text" value={inputId} onChange={(e) => setInputId(e.target.value)} placeholder='Flashcard ID'></input>
            <button type="button" onClick={loadFlashcardDetails} disabled={inputId === ''}>Load in Exisitng Flashcard Set</button>
          </div>

          <label className='card-label'>Set Name:</label>
          <input type="text" id='setName' value={flashcardSetName} onChange={(e) => setFlashcardSetName(e.target.value)} placeholder='Flashcard Set Name'></input>

          <label className='card-label'>Set Description:</label>
          <textarea type="text" id='setDesciption' value={description} onChange={(e) => setDescription(e.target.value)} rows="15" className='flashcardset-text-area' placeholder='Flashcard Description'></textarea>

        <div className='set-type'>
          <label className='card-label'>Flashcard Set Type</label>
          <select value={flashcardSetType} onChange={changeFlashcardSetType} className='select-editor'>
            <option value="Empty"></option>
            <option value="Front, Back">Front, Back</option>
            <option value="Multiple Choice">Multiple Choice</option>
          </select>
          </div>
          <br></br>
        
        </div>

        {/* if it is a regular flashcard, then it will render the editor for front, back */}
        {flashcardSetType === 'Front, Back' && (
          <div className='front-back-flashcard'>
            {/* iterates over each element in cards array and returns each card as a container. When it starts, then there will only be one card container. But when preloading, it will load in the number of ids in flashcards */}
            {cards.map(card => (
              <div key={card.id} className="card-container">
                <label className='card-label'>Card {card.id}:</label>
                <div className='red-button'>
                  {/* remove flashcard button, but it is disabled when there is only one card (inital card) */}
                  <div className='remove-button'>
                    <button type="button" onClick={() => removeFlashcard(card.id, "Front, Back")} disabled={cards.length === 1}>Remove</button>
                  </div>
                  <p className='card-label'>Front</p>
                  {/* input for the front side of the flashcard */}
                  <input type="text" value={card.front} onChange={(e) => changeSide(card.id, e.target.value, "Front")} placeholder='Front of Flashcard'/>

                  <button type='button' onClick={() => clearFlashcardValue(card.id, 'front')} disabled={!card.front}>Clear Front</button>

                  <p className='card-label'>Back</p>
                  {/* input for the back side of the flashcard */}
                  <input type="text" value={card.back} onChange={(e) => changeSide(card.id, e.target.value, "Back")} placeholder='Back of Flashcard'/>
                  <button type='button' onClick={() => clearFlashcardValue(card.id, 'back')} disabled={!card.back}>Clear Back</button>
                  <br />
                </div>
              </div>
            ))}
            <div className='add-button'>
              <br />
              <button type='button' className='add-card' onClick={() => addFlashcard('Front, Back')}>+</button>
            </div>
          </div>
        )}

        {/* if it is a mcq, then it will render the editor for mcq flashcards */}
        {flashcardSetType === 'Multiple Choice' && (
          <div>
            {/* iterates over each element in cards array and returns each card as a container. When it starts, then there will only be one card container. But when preloading, it will load in the number of ids in flashcards */}
            {multipleChoiceCards.map(card => (
              <div key={card.id} className="card-container">
                <label>Question {card.id}:</label>
                <div className='remove-button'>
                  <button type="button" onClick={() => removeFlashcard(card.id, "Multiple Choice")} disabled={multipleChoiceCards.length === 1}>Remove</button>
                </div>
                <p className='card-label'>Question</p>
                <input type="text" value={card.question} onChange={(e) => changeMCQuestion(card.id, e.target.value)} />
                <button type='button' onClick={() => clearMCQQuestion(card.id)}>Clear Question</button>
                <div>
                  {card.allOptions.map((option, index) => (
                    <div key={index}>
                      <p className='card-label'>Option {index + 1}</p>
                      <input type="text" value={option.option} onChange={(e) => changeMCQSide(card.id, index, e.target.value)} />
                      <select value={option.correctAnswer} onChange={(e) => changeMCQAnswer(card.id, index, e.target.value)}>
                        <option value="">Select Answer</option>
                        <option value="true">Correct Option</option>
                        <option value="false">Incorrect Option</option>
                      </select>
                      <button type='button' onClick={() => removeOption(card.id, index)} disabled={card.allOptions.length === 1}>Remove Option</button>
                      <button type='button' onClick={() => clearMCQField(card.id, index)}>Clear Field</button>
                      <div>
                        <button type='button' onClick={() => addOption(card.id)} disabled={card.allOptions.length === 4}>Add Option</button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
            <br></br>
            <div>
              <button type='button' onClick={() => addFlashcard('Multiple Choice')}>Add MCQ</button>

            </div>
          </div>

        )}
      </form>


      <div className='editor-buttons'>
        <br></br>
        {/* calls const based on the click */}
        <button type='button' onClick={() => createDeck(flashcardSetType)} disabled={flashcardSetName===""}>Create Deck</button>
        <button type='button' onClick={() => updateFlashcardSet(flashcardSetType)} disabled={flashcardSetType === ""}>Update Flashcard Set</button>
        <button type='button' onClick={dashboard}>Return to Homepage</button>
      </div>
    </div>
  )
}