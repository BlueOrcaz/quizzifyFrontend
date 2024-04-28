import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api/axiosConfig';

import '../FolderEditor/FolderEditor.css';

export default function FolderEditor() {
    const [flashcardSetIds, setFlashcardSetIds] = useState([]);
    const [flashcardSets, setFlashcardSets] = useState([]);

    const [existingFlashcardSets, setExistingFlashcardSets] = useState([]);

    const [folderName, setFolderName] = useState('');
    const [errorText, setErrorText] = useState('');

    let userid = localStorage.getItem('currentId');
    let substringuserid = userid.substring(1, userid.length - 1) // remove the stupid double quotations from my string
    const navigate = useNavigate();

    const { id } = useParams();


    const userCreations = () => {
        navigate('/creations');
    }

    const createFolder = async () => {
        const response = await api.post("/api/v1/folders/createFolder", {
            authorId: substringuserid,
            folderName: folderName,
            creationDate: Date.now(),
            storedFlashcardSets: flashcardSetIds
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
                await api.get(`/api/v1/flashcardSets/${flashcardsetid}`);

                if (!flashcardSetIds.includes(flashcardsetid)) {
                    // if the id is not a duplicate, add it to the array
                    setFlashcardSetIds(prevArray => [...prevArray, flashcardsetid]);
                    setErrorText('');
                } else {
                    //console.log("Flashcard set ID already exists in the array.");
                    setErrorText('Already Exists in Folder');
                }
            } catch (error) {
                setErrorText('Error Loading Flashcard Set');
                console.log("Error adding flashcard set:", error);
            }
        }
        // Clear input value after adding to array
    };

    const loadFlashcardSets = async () => {
        try {
            // Fetch flashcard sets data for the given id
            const response = await api.get(`/api/v1/folders/${id}`);
            const flashcardIds = response.data['storedFlashcardSets'];
            setFolderName(response.data['folderName']);

            // Fetch data for each flashcard set
            const setsData = await Promise.all(flashcardIds.map(async (setId) => {
                const response = await api.get(`/api/v1/flashcardSets/${setId}`);
                return { setId, data: response.data };
            }));

            // Set the loaded flashcard sets and their IDs
            setFlashcardSetIds(flashcardIds);
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
                const updatedIds = [];

                for (let i = 0; i < ids.length; i++) {
                    const currentid = ids[i];
                    if (currentid !== flashcardsetid) {
                        updatedIds.push(currentid);
                    }
                }
                
                const setsData = await Promise.all(updatedIds.map(async (setId) => {
                    const response = await api.get(`/api/v1/flashcardSets/${setId}`);
                    return { setId, data: response.data };
                }));

                setFlashcardSetIds(updatedIds); // update the ids
                setFlashcardSets(setsData); // update the data
                return updatedIds;
            })
        }
    }

    // Update flashcard sets when flashcardSetIds change
    useEffect(() => {
        const fetchData = async () => {
            try {
                const setsData = await Promise.all(flashcardSetIds.map(async (setId) => {
                    const response = await api.get(`/api/v1/flashcardSets/${setId}`);
                    return { setId, data: response.data };
                }));
                setFlashcardSets(setsData);
            } catch (error) {
                console.log("Error fetching flashcard sets:", error);
                setErrorText('Error Fetching Flashcard Set');
            }
        };

        // Fetch data only if flashcardSetIds exist
        if (flashcardSetIds.length > 0) {
            fetchData();
        }
    }, [flashcardSetIds]);

    const deleteFolder = async () => {
        try {
            await api.delete(`/api/v1/folders/deleteFolder/${id}?authorId=${substringuserid}`);
            navigate('/creations');
        } catch (error) {
            //console.log(error);
            setErrorText('Error deleteing folder')
        }
    }

    const updateFolder = async () => {
        await api.put(`/api/v1/folders/update/${id}?authorId=${substringuserid}`, {
            authorId: substringuserid,
            folderName: folderName,
            storedFlashcardSets: flashcardSetIds
        })
        setErrorText('Saved');
    }

    const redirect = (id) => {
        navigate(`/flashcardSet/${id}`)
    }

    const loadExistingFlashcardSets = async () => {
        const response = await api.get(`/api/v1/accounts/${substringuserid}`);
        const flashcardSetsIds = response.data['createdFlashcardSetsArrayList'];
        const setsData = await Promise.all(flashcardSetsIds.map(async (setId) => {
            const setObjectResponse = await api.get(`/api/v1/flashcardSets/${setId}`);
            return { setId, data: setObjectResponse.data }; // return an object with setId and data
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
                <label>Folder Name</label>
                <input type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder='Folder Name'></input>
                
                <label className='labels'>Stored Flashcards</label>
                <div className='flashcard-set-grid'>
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
                    <button className='delete-folder-button' type='button' onClick={deleteFolder} disabled={id === undefined}>Delete Folder</button>
                    <button type='button' onClick={updateFolder} disabled={id === undefined}>Save</button>
                    <button type='button' onClick={createFolder} disabled={id !== undefined}>Create Folder</button>
                    <button type='button' onClick={userCreations}>User Creations</button>
                </div>
            </form>
        </div>
    )
}