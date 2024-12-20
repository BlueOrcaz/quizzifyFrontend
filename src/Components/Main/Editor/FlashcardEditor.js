import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import '../Editor/FlashcardEditor.css';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'header': [2, false] }],
    ['bold', 'italic', 'underline'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}]
  ],
}

const descriptionModules = {
  toolbar: [
    [{ 'header': [2, false] }],
    ['bold', 'italic', 'underline']
  ],
}



export default function FlashcardsEditor() {
  // general constants
  const [flashcardSetName, setFlashcardSetName] = useState(''); // input
  const [description, setDescription] = useState(''); // input
  const [flashcardSetType, setFlashcardSetType] = useState(''); // input
  const [author, setAuthor] = useState(''); // input


  // flashcard constants
  const [cards, setCards] = useState([{ id: 1, front: '', back: '' }]); // each flashcard index will consist of another array with all values for easy access
  

  // multiple choice card constants
  const [options, setOptions] = useState([{ optionId: 1, option: '', correctAnswer: "" }]); // singular index in the allOptions part of the array
  const [multipleChoiceCards, setMultipleChoiceCards] = useState([{ id: 1, question: '', allOptions: options }]); // consists of id, q and all the possible options


  // flashcard creation/update error messages
  const [createMsg, setCreateMsg] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');


  const { id } = useParams(); // get the values from the flashcard set page.

  // retrieve user id
  let userid = localStorage.getItem('currentId');
  let authorUser = localStorage.getItem('currentUser');
  let substringAuthorUser = authorUser.substring(1, authorUser.length - 1);
  let substringuserid = userid.substring(1, userid.length - 1); // remove the stupid double quotations from my string


  // utilise react routes
  const navigate = useNavigate();
  const dashboard = () => {
    navigate('/home'); // return back to the dashboard
  }

    // public or not?
  const [isPublic, setIsPublic] = useState(false);
  const handlePublic = (e) => {
    setIsPublic(e.target.checked);
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

          refreshIds(updatedCards, "Multiple Choice"); // refresh the ids so they start from 1
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
    // reset all values

    setCards([{ id: 1, front: '', back: '' }]);
    setMultipleChoiceCards([{ id: 1, question: '', allOptions: options }]);
    setOptions([{ optionId: 1, option: '', correctAnswer: "" }]);

    // change the flashcard type set
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

  const clearMCQOption = (id, optionIndex) => {
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

  const clearMCQ = (id) => {
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
            authorUsername: substringAuthorUser,
            setType: flashcardSetType,
            isPublic: isPublic,
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
          //console.log("flashcardID: ", response.data);
          setCreateMsg("");
          navigate('/creations');
        } catch (error) {
          setCreateMsg("Failed to Create Flashcard Set");
          console.log(error);
        }
        break;
      case "Multiple Choice":
        try {
          const response = await api.post("/api/v1/flashcardSets/createFlashcardSet", { // send it for mcq cards
            authorId: substringuserid,
            authorUsername: substringAuthorUser,
            setType: flashcardSetType,
            isPublic: isPublic,
            name: flashcardSetName,
            description: description,
            creationDate: Date.now(),
            mcqFlashcards: multipleChoiceCards
          });
          localStorage.setItem('createdFlashcardID', JSON.stringify(response.data));
          //console.log("flashcardID: ", response.data);
          setCreateMsg("");
          navigate('/creations');
        } catch (error) {
          setCreateMsg("Failed to Create Flashcard Set");
          console.log(error);
        }
        break;
      default:
    }
  }

  const loadFlashcardDetails = async () => {
    try {
      const response = await api.get(`/api/v1/flashcardSets/${id}`); // GET method to retrive the flashcard set based off of the objectID
      let flashcardType = response.data['setType']; // set the flashcard type from the data retrieved
      switch (flashcardType) { // switch case statement dependent on the flashcard type
        case "Front, Back": // if the flashcard type is a double-sided flashcard type
          try {
            const updatedCards = response.data["flashcards"].map(card => ({ // map out each flashcard in the array as an index which consists of the id, front and back
              id: card["id"],
              front: card["front"],
              back: card["back"]
            }));
            // update all details based off of the given object from GET request
            setCards(updatedCards); // update the cards array
            setIsPublic(response.data['public']); // set the checkbox
            setFlashcardSetName(response.data['name']); // set the name
            setDescription(response.data['description']); // set the description
            setFlashcardSetType(response.data['setType']); // set the flashcard set type
            setAuthor(response.data['authorUsername']); // set the author

            if (response.data['authorUsername'] !== substringAuthorUser) { // if a flashcard set is duplicated instead
              navigate('/editor'); // load the data, however get rid of the id parameter
            }
          } catch (error) {
            console.log(error); // if an error occurs
            navigate('/editor'); // reset
          }
          break;
        case "Multiple Choice": // if the flashcard type is a multiple choice flashcard type
          try {
            // update all details based off of the given object from GET request
            setIsPublic(response.data['public']); // set the checkbox
            setAuthor(response.data['authorUsername']); // set the author
            setFlashcardSetName(response.data['name']); // set the name
            setDescription(response.data['description']); // set description
            setFlashcardSetType(response.data['setType']); // set type drop down menu
            setMultipleChoiceCards(response.data['mcqFlashcards']); // set the mcq array

            if (response.data['authorUsername'] !== substringAuthorUser) { // if a flashcard set is duplicated instead
              navigate('/editor'); // load the data, but get rid of id param
            }
          } catch (error) { // catch error
            console.log(error);
            navigate('/editor');
          }
          break;
        default: // default case if theres no type, then navigate to editor
          navigate('/editor');
          break;
      }
    } catch (error) {
      navigate('/editor');
    }
  }

  // load flashcard sets when there is an id or an id change
  useEffect(() => {
    // load flashcard sets only if id is present
    if (id) {
      loadFlashcardDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  const updateFlashcardSet = async (flashcardType) => {
    switch (flashcardType) {
      case "Front, Back":
        try {
          await api.put(`/api/v1/flashcardSets/update/${id}?authorId=${substringuserid}`, { // put request to update the details, with the userid to prevent other users from updating the flashcard set by themselves. 
            name: flashcardSetName,
            isPublic: isPublic,
            setType: flashcardSetType,
            description: description,
            flashcards: cards.map(card => ({
              id: card.id,
              front: card.front,
              back: card.back
            }))
          });
          //console.log(response.data); debugging
          setUpdateMsg("")
          navigate('/creations');
        } catch (error) {
          setUpdateMsg("Failed to Update Flashcard Set!")
          console.log(error);
        }
        break;
      case "Multiple Choice":
        try {
          await api.put(`/api/v1/flashcardSets/update/${id}?authorId=${substringuserid}`, { // put request to update the details, with the userid to prevent other users from updating the flashcard set by themselves.
            setType: flashcardSetType,
            isPublic: isPublic,
            name: flashcardSetName,
            description: description,
            mcqFlashcards: multipleChoiceCards
          });
          setUpdateMsg("")
          navigate('/creations');
          //console.log(response.data);
        } catch (error) {
          setUpdateMsg("Failed to Update Flashcard Set!")
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
          <label>{author}</label>
          <label className='card-label'>Set Name:</label>
          <input type="text" id='setName' value={flashcardSetName} onChange={(e) => setFlashcardSetName(e.target.value)} placeholder='Flashcard Set Name'></input>

          <label className='card-label'>Set Description:</label>
          <div className='quill-editor'>
            <ReactQuill value={description} onChange={(e) => setDescription(e)} modules={descriptionModules} placeholder='Description'/>
          </div>
          <div className='set-type'>
            <label className='card-label'>Flashcard Set Type</label>
            <select value={flashcardSetType} onChange={changeFlashcardSetType} className='select-editor' disabled={id !== undefined}>
              <option value="Empty"></option>
              <option value="Front, Back">Front, Back</option>
              <option value="Multiple Choice">Multiple Choice</option>
            </select>
          </div>
          <br></br>
          <label className='card-label'>Public?</label>
          <input type="checkbox" checked={isPublic} onChange={handlePublic}/>
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
                  <ReactQuill value={card.front} onChange={(e) => changeSide(card.id, e, "Front")} modules={modules} placeholder='Front of Flashcard'/>

                  <br></br>
                  <button type='button' onClick={() => clearFlashcardValue(card.id, 'front')} disabled={!card.front}>Clear Front</button>

                  <p className='card-label'>Back</p>
                  {/* input for the back side of the flashcard */}
                  <ReactQuill value={card.back} onChange={(e) => changeSide(card.id, e, "Back")} modules={modules} placeholder='Back of Flashcard'/>
                  <br></br>
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
          <div className='mcq-components'>
            {/* iterates over each element in cards array and returns each card as a container. When it starts, then there will only be one card container. But when preloading, it will load in the number of ids in flashcards */}
            {multipleChoiceCards.map(card => (
              <div key={card.id} className="mcq-container">
                <label>Question {card.id}:</label>
                <div className='remove-button'>
                  <button type="button" onClick={() => removeFlashcard(card.id, "Multiple Choice")} disabled={multipleChoiceCards.length === 1}>Remove</button>
                </div>
                <p className='card-label'>Question</p>
                <input type="text" value={card.question} onChange={(e) => changeMCQuestion(card.id, e.target.value)} />
                <button type='button' onClick={() => clearMCQ(card.id)}>Clear Question</button>
                <div>
                  {card.allOptions.map((option, index) => (
                    <div key={index}>
                      <p className='card-label'>Option {index + 1}</p>
                      <br></br>
                      <div className='description-reactquill'>
                      <ReactQuill value={option.option} onChange={(e) => changeMCQSide(card.id, index, e)} modules={modules} placeholder='Option'/>
                      </div>
                      <br></br>
                      <button type='button' onClick={() => clearMCQOption(card.id, index)}>Clear Option</button>
                      <button type='button' onClick={() => removeOption(card.id, index)} disabled={card.allOptions.length === 1}>Remove Option</button>
                      <select value={option.correctAnswer} onChange={(e) => changeMCQAnswer(card.id, index, e.target.value)} className='select-editor'>
                        <option value="">Select Answer</option>
                        <option value="true">Correct Option</option>
                        <option value="false">Incorrect Option</option>
                      </select>
                      <br></br>
                      <br></br>
                    </div>
                  ))}
                </div>
                <div className='mcq-add-option'>
                  <button type='button' onClick={() => addOption(card.id)} disabled={card.allOptions.length === 4}>+</button>
                </div>

              </div>
            ))}
            <br></br>
            <div className='add-button'>
              <button type='button' onClick={() => addFlashcard('Multiple Choice')}>+</button>
            </div>
          </div>

        )}
      </form>
      

      <div className='editor-buttons'>
        {/* calls const based on the click */}
        {/* buttons are disabled when any value is not filled. */}
        <button type='button' onClick={() => createDeck(flashcardSetType)} disabled={
          flashcardSetName === "" ||
          flashcardSetType === "" ||
          id !== undefined
        }>Create Deck</button>
        {/* Error Messages/created flashcard Link */}
        <p className='creation-error-label'>{createMsg}</p>
        <button type='button' onClick={() => updateFlashcardSet(flashcardSetType)} disabled={flashcardSetName === "" ||
          flashcardSetType === "" ||
          id === undefined
        }>Update Flashcard Set</button> 
        {/* Error Messages*/}
        <p className='creation-error-label'>{updateMsg}</p>

        {/* return back to the homepage */}
        <button type='button' onClick={dashboard}>Return to Homepage</button>
      </div>
      <br></br>
    </div>
  )
}