import React, { useState } from 'react';
import api from '../../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function Editor() {
  const [flashcardSetName, setFlashcardSetName] = useState('');
  const [description, setDescription] = useState('');
  const [flashcardSetType, setFlashcardSetType] = useState('');
  const [cards, setCards] = useState([{ id: 1, front: '', back: '' }]); // initial card: front is empty, back is empty

  const [options, setOptions] = useState([{ optionId: 1, option: '', correctAnswer: "" }]);
  const [multipleChoiceCards, setMultipleChoiceCards] = useState([{ id: 1, question: '', allOptions: options }]);

  const [inputId, setInputId] = useState('');

  const navigate = useNavigate();
  let userid = localStorage.getItem('currentId');
  let substringuserid = userid.substring(1, userid.length - 1)

  const dashboard = () => {
    navigate('/home');
  }

  const addFlashcard = (flashcardType) => {
    switch (flashcardType) {
      case "Front, Back":
        let flashcardId;
        if (cards.length > 0) {
          flashcardId = cards[cards.length - 1].id + 1;
        } else {
          flashcardId = 1;
        }
        const newCard = { id: flashcardId, front: '', back: '' };
        const updatedCards = [...cards, newCard];
        setCards(updatedCards);
        break;
      case "Multiple Choice":
        let mcqId;
        if (cards.length > 0) {
          mcqId = multipleChoiceCards[multipleChoiceCards.length - 1].id + 1;
        } else {
          mcqId = 1;
        }
        const newMCQCard = { id: mcqId, question: '', allOptions: options };
        const updatedMCQCards = [...multipleChoiceCards, newMCQCard];
        setMultipleChoiceCards(updatedMCQCards);
        break;
      default:
        break;
    }
  }

  const addOption = (cardId) => {
    const updatedCards = multipleChoiceCards.map(card => {
      if (card.id === cardId) {
        const optionCount = card.allOptions.length + 1;
        const newOption = { optionId: optionCount, option: '', correctAnswer: "" };
        const updatedOptions = [...card.allOptions, newOption];
        return { ...card, allOptions: updatedOptions };
      }
      return card;
    });
    setMultipleChoiceCards(updatedCards);
  }

  const removeOption = (cardId, optionIndex) => {
    const updatedCards = multipleChoiceCards.map(card => {
      if(card.id === cardId) {
        const updatedOptions = card.allOptions.filter((option, index) => index !== optionIndex);
        return { ...card, allOptions: updatedOptions };
      }
      return card;
    });
    setMultipleChoiceCards(updatedCards);
  }

  const removeFlashcard = (id, flashcardType) => {
    switch(flashcardType) {
      case "Front, Back":
        setCards(cards => {
          const updatedCards = [];
    
          for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (card.id !== id) {
              updatedCards.push(card);
            }
          }
    
          refreshIds(updatedCards, "Front, Back");
          return updatedCards;
        });
        break;
      case "Multiple Choice":
        setMultipleChoiceCards(cards => {
          const updatedCards = [];
          for (let i = 0; i < cards.length; i++) {
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
        setCards(updatedCards.map((card, index) => ({ ...card, id: index + 1 })));
        break;
      case "Multiple Choice":
        setMultipleChoiceCards(updatedCards.map((card, index) => ({ ...card, id: index + 1 })));
        break;
      default:
    }

  };

 

  const changeFlashcardSetType = (e) => {
    setFlashcardSetType(e.target.value)
  };

  const changeSide = (id, value, side) => {
    setCards(function (previousCards) {
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
              return { ...card, back: value };
            } else {
              return card;
            }
          })
        default:
      }
    })
  }

  const changeMCQuestion = (id, value) => {
    console.log(id);
    setMultipleChoiceCards(previousCards => {
      return previousCards.map(card => {
        if (card.id === id) {
          return {...card, question: value}
        }
        return card;
      })
    })
  }

  const changeMCQSide = (id, optionIndex, value) => {
    setMultipleChoiceCards(previousCards => {
      return previousCards.map(card => {
        if (card.id === id) {
          const updatedOptions = card.allOptions.map((option, index) => {
            if (index === optionIndex) {
              return { ...option, option: value };
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

  const changeMCQAnswer = (id, optionIndex, value) => {
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
            return { ...card, front: '' }; // If the card's id matches, update the 'front' property
          } else if (side === 'back') {
            return { ...card, back: '' };
          }
        }
          return card;
        
      })
    })
  }

  const clearMCQField = (id, optionIndex) => {
    setMultipleChoiceCards(previousCards => {
      return previousCards.map(card => {
        if (card.id === id) {
          const updatedOptions = card.allOptions.map((option, index) => {
            if (index === optionIndex) {
              return { ...option, option: '' };
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
    setMultipleChoiceCards(previousCards => {
      return previousCards.map(card => {
        if (card.id === id) {
          return {...card, question: ''};
        }
        return card;
      })
    })
  }

  /* Archived the ability to save flashcardsets as a json
  const saveFlashcardSet = (flashcardSetType) => {
    switch(flashcardSetType) {
      case "Front, Back":
        const flashcardSet = {
          authorId: substringuserid,
          setType: flashcardSetType,
          isPublic: false,
          name: flashcardSetName,
          description: description,
          creationDate: Date.now(),
          flashcards: cards.map(card => ({
            id: card.id,
            front: card.front,
            back: card.back
          }))
        }
    
        const JSONSet = JSON.stringify(flashcardSet);
    
        const blob = new Blob([JSONSet], { type: 'application/json' });
        saveAs(blob, 'flashcardSet.json');
        break;
      case "Multiple Choice":
        const MCQSet = {
          authorId: substringuserid,
          setType: flashcardSetType,
          isPublic: false,
          name: flashcardSetName,
          description: description,
          creationDate: Date.now(),
          mcqFlashcards: multipleChoiceCards
        }
    
        const MCQJSONSet = JSON.stringify(MCQSet);
    
        const MCQblob = new Blob([MCQJSONSet], { type: 'application/json' });
        saveAs(MCQblob, 'MCQflashcardSet.json');
        break;
      default:

    }

    <button type='button' onClick={() => saveFlashcardSet('Multiple Choice')} disabled={flashcardSetType === ""}>Save Flashcard Set</button>


  }
  */

  const createDeck = async (flashcardType) => {
    switch(flashcardType) {
      case "Front, Back":
        try {
          const response = await api.post("/api/v1/flashcardSets/createFlashcardSet", {
            authorId: substringuserid,
            setType: flashcardSetType,
            isPublic: false,
            name: flashcardSetName,
            description: description,
            creationDate: Date.now(),
            flashcards: cards.map(card => ({
              id: card.id,
              front: card.front,
              back: card.back
            }))
          });
          localStorage.setItem('createdFlashcardID', JSON.stringify(response.data));
          console.log("flashcardID: ", response.data);
        } catch (error) {
          console.log(error);
        }
      break;
      case "Multiple Choice":
        try {
          const response = await api.post("/api/v1/flashcardSets/createFlashcardSet", {
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
    const response = await api.get(`/api/v1/flashcardSets/${inputId}`);
    let flashcardType = response.data['setType'];
    switch(flashcardType) {
      case "Front, Back":
        try {
          console.log(response.data);
    
          const updatedCards = response.data["flashcards"].map(card => ({
            id: card["id"],
            front: card["front"],
            back: card["back"]
          }));
    
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
        console.log(response.data);
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
    switch(flashcardType) {
      case "Front, Back":
        try {
          const response = await api.put(`/api/v1/flashcardSets/update/${inputId}?authorId=${substringuserid}`, {
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
          console.log(response.data);
        } catch (error) {
          console.log(error);
        }
        break;
      case "Multiple Choice":
        try {
          const response = await api.put(`/api/v1/flashcardSets/update/${inputId}?authorId=${substringuserid}`, {
            setType: flashcardSetType,
            isPublic: false,
            name: flashcardSetName,
            description: description,
            mcqFlashcards: multipleChoiceCards
          })
          console.log(response.data);
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    }
   
  }


  return (
    <div>
      <h2>Flashcard Set Editor</h2>
      <form>

        <div>
          <label>Load in Existing Flashcard Deck</label>
          <input type="text" value={inputId} onChange={(e) => setInputId(e.target.value)}></input>
          <button type="button" onClick={loadFlashcardDetails}>Load in Details</button>
        </div>

        <div>
          <label>Flashcard Set Name:</label>
          <input type="text" id='setName' value={flashcardSetName} onChange={(e) => setFlashcardSetName(e.target.value)}></input>
        </div>

        <br></br>

        <div>
          <label>Flashcard Set description:</label>
          <textarea type="text" id='setDesciption' value={description} onChange={(e) => setDescription(e.target.value)} rows="1"></textarea>
        </div>
        <br></br>
        <div>
          <label>Flashcard Set Type</label>
          <select value={flashcardSetType} onChange={changeFlashcardSetType}>
            <option></option>
            <option value="Front, Back">Front, Back</option>
            <option value="Multiple Choice">Multiple Choice</option>
          </select>
        </div>
        <br></br>

        {flashcardSetType === 'Front, Back' && (
          <div>
            {cards.map(card => (
              <div key={card.id} className="card-container">
                <label>Card {card.id}:</label>
                <div>
                  <button type="button" onClick={() => removeFlashcard(card.id, "Front, Back")} disabled={cards.length === 1}>Remove</button>
                </div>
                <p>Front</p>
                <input type="text" value={card.front} onChange={(e) => changeSide(card.id, e.target.value, "Front")} required />
                <button type='button' onClick={() => clearFlashcardValue(card.id, 'front')} disabled={!card.front}>Clear Front</button>

                <p>Back</p>
                <input type="text" value={card.back} onChange={(e) => changeSide(card.id, e.target.value, "Back")} required />
                <button type='button' onClick={() => clearFlashcardValue(card.id, 'back')} disabled={!card.back}>Clear Back</button>

                <br />
              </div>
            ))}
            <div>
              <button type='button' onClick={() => addFlashcard('Front, Back')}>Add Card</button>
            </div>
          </div>

        )}

        {flashcardSetType === 'Multiple Choice' && (
          <div>
            {multipleChoiceCards.map(card => (
              <div key={card.id}>
                <label>Question {card.id}:</label>
                <div>
                  <button type="button" onClick={() => removeFlashcard(card.id, "Multiple Choice")} disabled={multipleChoiceCards.length === 1}>Remove</button>
                </div>
                <p>Question</p>
                <input type="text" value = {card.question} onChange={(e) => changeMCQuestion(card.id, e.target.value)}/>
                <button type='button' onClick={() => clearMCQQuestion(card.id)}>Clear Question</button>
                <div>
                  {card.allOptions.map((option, index) => (
                    <div key={index}>
                      <p>Option {index + 1}</p>
                      
                      <input 
                        type="text" 
                        value={option.option}
                        onChange={(e) => changeMCQSide(card.id, index, e.target.value)} // Call changeSide with card ID, option index, and new value
                      />
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

      
      <div>
        <button type='button' onClick={() => createDeck(flashcardSetType)} disabled={flashcardSetType===""}>Create Deck</button>
        <button type='button' onClick={() => updateFlashcardSet(flashcardSetType)} disabled = {flashcardSetType===""}>Update Flashcard Set</button>
        <br></br>
        <button type='button' onClick={dashboard}>Return to Homepage</button>
      </div>
    </div>
  )
}