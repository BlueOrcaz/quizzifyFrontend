import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import Login from './Components/Account/Login/Login'
import Register from './Components/Account/Register/Register'
import Homepage from './Components/Main/Homepage/Homepage';
import AdminDashboard from './Components/Admin/AdminDashboard/AdminDashboard';
import AccountSettings from './Components/Account/Settings/AccountSettings';

import PrivateRoutes from './util/PrivateRoutes';

function App() {
  return (
    <div className='wrapper'>
      <h1>Quizzify</h1>
      <BrowserRouter>
        <Routes>
          <Route element={<Login/>} path='/login'/>
          <Route element={<Register/>} path='/register' />
          <Route element={<Homepage/>} path='/home' />
          <Route element={<AccountSettings/>} path='/accountsettings'/>
          <Route element={<PrivateRoutes/>}>
            <Route element={<AdminDashboard/>} path='/admin'/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
