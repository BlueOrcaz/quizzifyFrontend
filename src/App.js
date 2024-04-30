import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './Components/Account/Login/Login'
import Register from './Components/Account/Register/Register'
import Homepage from './Components/Main/Homepage/Homepage';
import Editor from './Components/Main/Editor/FlashcardEditor';
import FlashcardSetPage from './Components/Main/FlashcardSetPage/FlashcardSetPage';
import UserCreations from './Components/Main/UserCreations/UserCreations';
import FolderEditor from './Components/Main/FolderEditor/FolderEditor';
import PublicSets from './Components/Main/PublicSets/PublicSets';

import ErrorPage from './Components/404/ErrorPage';

import UserRoute from './util/UserRoute';

function App() {
  return (
    <div className='wrapper'>
      <BrowserRouter>
        <Routes>
          {/*Accessible to everyone */}
          <Route element={<Login/>} path='/login'/>
          <Route element={<Register/>} path='/register' />
          <Route element={<Login/>} path='/'/>

          {/* If user goes on any other route which isn't this then it will return a 404 error */}
          <Route element={<ErrorPage/>} path='*'/>


          {/*Only accessible to those in the "user role" */}
          <Route element={<UserRoute/>}>
            <Route element={<Homepage/>} path='/home' />
            <Route element={<Editor/>} path='/editor'/>
            <Route element={<Editor/>} path='/editor/:id'/> 
            <Route element={<FlashcardSetPage/>} path='/flashcardSet/:id'/>
            <Route element={<UserCreations/>} path='/creations'/>
            <Route element={<FolderEditor/>} path='/folderEditor'/>
            <Route element={<FolderEditor/>} path='/folderEditor/:id'/>
            <Route element={<PublicSets/>} path='/allSets'/>
          </Route>    
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
