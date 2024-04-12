import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api/axiosConfig';

import '../FolderEditor/FolderEditor.css';

export default function FolderEditor() {
    const [flashcardSetIds, setFlashcardSetIds] = useState([]);
    const [flashcardSets, setFlashcardSets] = useState([]);

    const [folderName, setFolderName] = useState('');
    const [setId, setSetId] = useState('');

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
        console.log(response.data);
    }

    const addFlashcardId = async () => {
        if (setId.trim() !== '') {
            try {
                await api.get(`/api/v1/flashcardSets/${setId}`);

                if (!flashcardSetIds.includes(setId)) {
                    // If the ID is not a duplicate, add it to the array
                    setFlashcardSetIds(prevArray => [...prevArray, setId]);
                } else {
                    console.log("Flashcard set ID already exists in the array.");
                }
            } catch (error) {
                console.log("Error adding flashcard set:", error);
            }
        }
        // Clear input value after adding to array
        setSetId('');
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
            console.log("Error loading flashcard sets:", error);
        }
    }
    
    // Load flashcard sets when id changes or when flashcardSetIds change
    useEffect(() => {
        // Load flashcard sets only if id is present
        if (id) {
            loadFlashcardSets();
        }
    }, [id]);
    
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
            }
        };
    
        // Fetch data only if flashcardSetIds exist
        if (flashcardSetIds.length > 0) {
            fetchData();
        }
    }, [flashcardSetIds]);

    const updateFolder = async () => {
        await api.put(`/api/v1/folders/update/${id}?authorId=${substringuserid}`, {
            authorId: substringuserid,
            folderName: folderName,
            storedFlashcardSets: flashcardSetIds
        })
    }
    
    const redirect = (id) => {
        navigate(`/flashcardSet/${id}`)
    }

    

    
    

    return (
        <div>
            <h1 className='folder-editor'>Folder Editor</h1>
            <form>
                <label>Folder Name</label>
                <input type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder='Folder Name'></input>
                <label>Stored Flashcards</label>
                <div className='flashcard-set-grid'>
                {flashcardSets.map((flashcardSet, index) => (
                    <button type='button' key={index} className='flashcard-set-button' onClick={() => redirect(flashcardSet.setId)}>
                    {flashcardSet.data.name}
                </button>
                ))}
                
                </div>
                
                <label>Add in Flashcard Sets</label>
                <div className="add-container">
                    <input type="text" value={setId} onChange={(e) => setSetId(e.target.value)} placeholder='Set Name/ID/Link'></input>
                    <button type='button' onClick={addFlashcardId}>+</button>   
                </div>
                <br></br>
                <div className='folder-buttons'>
                    <button type='button' onClick={updateFolder} disabled={id === undefined}>Save</button>
                    <button type='button' onClick={createFolder} disabled={id !== undefined}>Create Folder</button>
                    <button type='button' onClick={userCreations}>User Creations</button>
                </div>
            </form>
        </div>
    )
}