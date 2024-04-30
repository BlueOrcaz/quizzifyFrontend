import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';

import './UserCreations.css'; // Import CSS file for styling

export default function UserCreations() {
    const [flashcardSets, setFlashcardSets] = useState([]); // array to store all flashcards set for a specific account
    const [folders, setFolders] = useState([]); // array to store all folders for a specific account

    const navigate = useNavigate();


    let userid = localStorage.getItem('currentId'); // retrieve user id
    let substringuserid = userid.substring(1, userid.length - 1); // remove the double quotations from the string

    const loadFlashcardSets = async () => {
        const response = await api.get(`/api/v1/accounts/${substringuserid}`); // get request of an account
        const flashcardSetsIds = response.data['createdFlashcardSetsArrayList']; // get their flashcard set ids

        const setsData = await Promise.all(flashcardSetsIds.map(async (setId) => { // map out all of their ids by calling out a get request for each
            const setObjectResponse = await api.get(`/api/v1/flashcardSets/${setId}`); // call get REQUEST
            return { setId, data: setObjectResponse.data }; // return an index with setId and data
        }));
        setFlashcardSets(setsData); // update the flashcard sets
    }

    const loadFolders = async () => { // load all folders from a specific account
        const response = await api.get(`/api/v1/accounts/${substringuserid}`); // GET request of an account
        const folderIds = response.data['createdFoldersArrayList']; // get all their folder ids

        const folderData = await Promise.all(folderIds.map(async (folderId) => { // map  out all of their ids by calling a GET request for each
            const setObjectResponse = await api.get(`/api/v1/folders/${folderId}`); // call GET request
            return { folderId, data: setObjectResponse.data }; // return index with set id, and data
        }));
        setFolders(folderData); // update the folder arrays
    }



    useEffect(() => {
        loadFlashcardSets(); // load flashcard sets and folders when the page loads
        loadFolders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    // navigation pages
    const redirect = (id) => {
        navigate(`/flashcardSet/${id}`); // redirect to a specific flashcard set page
    }

    const folderRedirect = (id) => {
        navigate(`/folderEditor/${id}`); // redirect to a specific folder
    }

    const dashboard = () => {
        navigate('/home'); // navigate to dashboard
    }

    const quizEditor = () => {
        navigate('/editor'); // navigate to the quiz editor
    }

    const folderEditor = () => {
        navigate('/folderEditor'); // navigate to the folder editor
    }

    return (
        <div className='user-creations-wrapper'>
            {/**  */}
            <h1 className='h-load'>User Creations</h1>
            <h2 className='h-load'>Created Folders: </h2>
            <div className='created-folders-wrapper'>
                {/** map out all folders as buttons with their name  */}
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
                    {/** map out all flashcard sets as buttons with their name  */}
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
                {/** all buttons in the usercreations page  */}
                <button onClick={folderEditor}>Create Folder</button>
                <button type='button' onClick={quizEditor}>Create Flashcard Set</button>
                <br></br>
                <button type='button' onClick={dashboard}>Dashboard</button>
            </div>
        </div>
    )
}