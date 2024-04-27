import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';

import './UserCreations.css'; // Import CSS file for styling

export default function UserCreations() {
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [folders, setFolders] = useState([]);

    const navigate = useNavigate();


    let userid = localStorage.getItem('currentId'); // retrieve user id
    let substringuserid = userid.substring(1, userid.length - 1); // remove the double quotations from the string

    const loadFlashcardSets = async () => {
        const response = await api.get(`/api/v1/accounts/${substringuserid}`);
        const flashcardSetsIds = response.data['createdFlashcardSetsArrayList'];

        const setsData = await Promise.all(flashcardSetsIds.map(async (setId) => {
            const setObjectResponse = await api.get(`/api/v1/flashcardSets/${setId}`);
            return { setId, data: setObjectResponse.data }; // return an object with setId and data
        }));
        setFlashcardSets(setsData);
    }

    const loadFolders = async () => {
        const response = await api.get(`/api/v1/accounts/${substringuserid}`);
        const folderIds = response.data['createdFoldersArrayList'];

        const folderData = await Promise.all(folderIds.map(async (folderId) => {
            const setObjectResponse = await api.get(`/api/v1/folders/${folderId}`);
            return { folderId, data: setObjectResponse.data };
        }));
        setFolders(folderData);
    }



    useEffect(() => {
        loadFlashcardSets();
        loadFolders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);




    const redirect = (id) => {
        navigate(`/flashcardSet/${id}`);
    }

    const folderRedirect = (id) => {
        navigate(`/folderEditor/${id}`);
    }

    const dashboard = () => {
        navigate('/home');
    }

    const quizEditor = () => {
        navigate('/editor');
    }

    const folderEditor = () => {
        navigate('/folderEditor');
    }

    return (
        <div className='user-creations-wrapper'>
            <h1 className='h-load'>User Creations</h1>
            <h2 className='h-load'>Created Folders: </h2>
            <div className='created-folders-wrapper'>
                <div className='created-folders-grid'>
                    {folders && folders.length > 0 ? (
                        folders.map((folder, index) => (
                            <button key={index} className='folder-button' onClick={() => folderRedirect(folder.folderId)}>{folder.data.folderName}</button>
                        ))
                    ) : (
                        <p>No Folders available yet.</p>
                    )}

                </div>
                <br></br>
            </div>
            <h2 className='h-load'>Created Flashcard Sets:</h2>

            <div className='created-flashcard-sets-wrapper'>
                <div className='flashcard-set-grid'>
                    {flashcardSets && flashcardSets.length > 0 ? (
                        flashcardSets.map((flashcardSet, index) => (
                            <button key={index} className='flashcard-set-button' onClick={() => redirect(flashcardSet.setId)}>
                                {flashcardSet.data && flashcardSet.data.name ? flashcardSet.data.name : 'N/A'}
                            </button>
                        ))
                    ) : (
                        <p>No flashcard sets available yet.</p>
                    )}

                </div>
            </div>
            <br></br>
            <div className='dashboard-button'>
                <button onClick={folderEditor}>Create Folder</button>
                <button type='button' onClick={quizEditor}>Create Flashcard Set</button>
                <br></br>
                <button type='button' onClick={dashboard}>Dashboard</button>
            </div>
        </div>
    )
}