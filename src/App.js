import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './Components/Account/Login/Login'
import Register from './Components/Account/Register/Register'
import Homepage from './Components/Main/Homepage/Homepage';

function App() {
  return (
    <div className='wrapper'>
      <h1>Quizzify</h1>
      <BrowserRouter>
        <Routes>
          <Route path='/login' Component={Login}/>
          <Route path='/register' Component={Register} />
          <Route path='/home' Component={Homepage} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
