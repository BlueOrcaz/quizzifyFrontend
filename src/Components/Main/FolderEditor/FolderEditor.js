import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api/axiosConfig';

import '../FolderEditor/FolderEditor.css';

export default function FolderEditor() {
    const [flashcardSetIds, setFlashcardSetIds] = useState([]); // array to store all flashcard ids
    const [flashcardSets, setFlashcardSets] = useState([]); // array to store all flashcard objects
    const [existingFlashcardSets, setExistingFlashcardSets] = useState([]); // array to store all existing flashcard objects
    const [folderName, setFolderName] = useState(''); // store folder name input
    const [errorText, setErrorText] = useState(''); // store error text input

    let userid = localStorage.getItem('currentId'); // get the current userid
    let substringuserid = userid.substring(1, userid.length - 1); // remove the double quotes
    const navigate = useNavigate();

    const { id } = useParams(); // get the react route link


    const userCreations = () => { // navigate to user creations
        navigate('/creations');
    }

    const createFolder = async () => {
        const response = await api.post("/api/v1/folders/createFolder", { // send a POST request with the parameters to create a folder entry in the database
            authorId: substringuserid, // params
            folderName: folderName,
            creationDate: Date.now(), // unix time
            storedFlashcardSets: flashcardSetIds // instead of objects, ids are used
        })
        localStorage.setItem('createdFolderId', JSON.stringify(response.data)); // backend returns the flashcard object id as a string
        //console.log(response.data);
        setErrorText('Saved');
        navigate('/creations');
    }

    const addFlashcardId = async (flashcardsetid) => {
        if (flashcardsetid.trim() !== '') {
            try {
                //console.log(flashcardsetid);
                await api.get(`/api/v1/flashcardSets/${flashcardsetid}`); // GET request to get the param

                if (!flashcardSetIds.includes(flashcardsetid)) {
                    // if the id is not a duplicate, add it to the array
                    setFlashcardSetIds(prevArray => [...prevArray, flashcardsetid]); // update the array
                    setErrorText('');
                } else {
                    //console.log("Flashcard set ID already exists in the array.");
                    setErrorText('Already Exists in Folder');
                }
            } catch (error) {
                setErrorText('Error Loading Flashcard Set');
                //console.log("Error adding flashcard set:", error);
            }
        }
        // Clear input value after adding to array
    };

    const loadFlashcardSets = async () => {
        try {
            // Fetch flashcard sets data for the given id from the link input
            const response = await api.get(`/api/v1/folders/${id}`);
            const flashcardIds = response.data['storedFlashcardSets'];
            setFolderName(response.data['folderName']); // update the detals

            // Fetch data for each flashcard set
            const setsData = await Promise.all(flashcardIds.map(async (setId) => { // update details
                const response = await api.get(`/api/v1/flashcardSets/${setId}`);
                return { setId, data: response.data };
            }));

            // Set the loaded flashcard sets and their IDs
            setFlashcardSetIds(flashcardIds); // update details
            setFlashcardSets(setsData);
        } catch (error) {
            setErrorText('Error Loading Flashcard Sets');
            //console.log("Error loading flashcard sets:", error);
        }
    }

    // Load flashcard sets when id changes or when flashcardSetIds change
    useEffect(() => {
        // Load flashcard sets only if id is present
        if (id) {
            loadFlashcardSets();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const removeFlashcardId = async (flashcardsetid) => {
        if (flashcardsetid.trim() !== '') {
            // if the flashcard set is not empty then
            setFlashcardSetIds(async ids => {
                const updatedIds = []; // update ids

                for (let i = 0; i < ids.length; i++) {
                    const currentid = ids[i];
                    if (currentid !== flashcardsetid) { // if the currentid doesnt match the flashcard id then push it to the updatedids stack
                        updatedIds.push(currentid); // push to stack
                    }
                }
                
                const setsData = await Promise.all(updatedIds.map(async (setId) => { // map out all card entries as the set id and then its data
                    const response = await api.get(`/api/v1/flashcardSets/${setId}`);
                    return { setId, data: response.data }; // per index basis
                }));

                setFlashcardSetIds(updatedIds); // update the ids
                setFlashcardSets(setsData); // update the data
                return updatedIds;
            })
        }
    }

    
    useEffect(() => { // update flashcard sets when flashcardSetIds change
        const fetchData = async () => {
            try {
                const setsData = await Promise.all(flashcardSetIds.map(async (setId) => {
                    const response = await api.get(`/api/v1/flashcardSets/${setId}`);
                    return { setId, data: response.data }; // map out all card entries as the set id and its data on per index basis
                }));
                setFlashcardSets(setsData);
            } catch (error) {
                //console.log("Error fetching flashcard sets:", error);
                setErrorText('Error Fetching Flashcard Set');
            }
        };

        // fetch data only if flashcardSetIds exist
        if (flashcardSetIds.length > 0) {
            fetchData();
        }
    }, [flashcardSetIds]);

    const deleteFolder = async () => {
        try {
            await api.delete(`/api/v1/folders/deleteFolder/${id}?authorId=${substringuserid}`); // delete if the author id matches with the current logged in user
            navigate('/creations');
        } catch (error) {
            //console.log(error);
            setErrorText('Error deleteing folder')
        }
    }

    const updateFolder = async () => {
        await api.put(`/api/v1/folders/update/${id}?authorId=${substringuserid}`, { // update the folder if the author id matches with the current logged in user
            authorId: substringuserid, // update all params 
            folderName: folderName,
            storedFlashcardSets: flashcardSetIds
        })
        setErrorText('Saved');
    }

    const redirect = (id) => {
        navigate(`/flashcardSet/${id}`); //redirect to the specified button id
    }

    const loadExistingFlashcardSets = async () => { // load existing flashcards
        const response = await api.get(`/api/v1/accounts/${substringuserid}`); // retrieve current logged-in account
        const flashcardSetsIds = response.data['createdFlashcardSetsArrayList']; // return all of the ids
        const setsData = await Promise.all(flashcardSetsIds.map(async (setId) => { 
            const setObjectResponse = await api.get(`/api/v1/flashcardSets/${setId}`); // perform a GET request on each id entry to retrieve its details
            return { setId, data: setObjectResponse.data }; // return an object with setId and data per index
        }));
        setExistingFlashcardSets(setsData);
    }

    useEffect(() => {
        loadExistingFlashcardSets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);





    return (
        <div className='folder-editor'>
            <h1 className='folder-editor-h1'>Folder Editor</h1>
            <form>
                {/** input details */}
                <label>Folder Name</label>
                <input type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder='Folder Name'></input>
                <label className='labels'>Stored Flashcards</label>
                <div className='flashcard-set-grid'>
                    {/** map out each entry in the flaschard sets as a button and set it as the data name */}
                    {flashcardSets && flashcardSets.length > 0 ? (
                        flashcardSets.map((flashcardSet, index) => (
                            flashcardSet.data ? (
                                <div>
                                    <button type='button' className='delete-button' onClick={() => removeFlashcardId(flashcardSet.setId)}>X</button>
                                    <button type='button' key={index} className='flashcard-set-button' onClick={() => redirect(flashcardSet.setId)}>
                                        {flashcardSet.data.name}
                                    </button>
                                </div>
                            ) : null
                        ))
                    ) : (
                        <p>{flashcardSets.every(set => !set.data) ? 'Empty Folder' : ''}</p>
                    )}
                </div>
                <label className='labels'>Add in Existing Flashcard Sets</label>
                <div className='flashcard-set-grid'>
                    {/** map out each entry in the flaschard sets as a button and set it as the data name */}
                    {existingFlashcardSets && existingFlashcardSets.length > 0 ? (
                        existingFlashcardSets.map((flashcardSet, index) => (
                            <button type='button' key={index} className='flashcard-set-button' onClick={() => addFlashcardId(flashcardSet.setId)}>
                                {flashcardSet.data && flashcardSet.data.name ? flashcardSet.data.name : 'N/A'}
                            </button>
                        ))
                    ) : (
                        <p>No flashcard sets available yet.</p>
                    )}
                </div>
                <br></br>
                <p className='error-text'>{errorText}</p>
                <br></br>
                <div className='folder-buttons'>
                    {/** editor buttons */}
                    <button className='delete-folder-button' type='button' onClick={deleteFolder} disabled={id === undefined}>Delete Folder</button>
                    <button type='button' onClick={updateFolder} disabled={id === undefined}>Save</button>
                    <button type='button' onClick={createFolder} disabled={id !== undefined}>Create Folder</button>
                    <button type='button' onClick={userCreations}>User Creations</button>
                </div>
            </form>
        </div>
    )
}