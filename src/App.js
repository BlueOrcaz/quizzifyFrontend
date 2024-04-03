import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './Components/Account/Login/Login'
import Register from './Components/Account/Register/Register'
import Homepage from './Components/Main/Homepage/Homepage';
import AdminDashboard from './Components/Admin/AdminDashboard/AdminDashboard';

function App() {
  return (
    <div className='wrapper'>
      <h1>Quizzify</h1>
      <BrowserRouter>
        <Routes>
          <Route path='/login' Component={Login}/>
          <Route path='/register' Component={Register} />
          <Route path='/home' Component={Homepage} />
          <Route path='/adminDashboard' Component={AdminDashboard}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
