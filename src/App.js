import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './Components/Account/Login/Login'
import Register from './Components/Account/Register/Register'
import Homepage from './Components/Main/Homepage/Homepage';
import AdminDashboard from './Components/Admin/AdminDashboard/AdminDashboard';
import AccountSettings from './Components/Account/Settings/AccountSettings';
import Editor from './Components/Main/Editor/Editor';

import AdminRoute from './util/AdminRoute';
import UserRoute from './util/UserRoute';

function App() {
  return (
    <div className='wrapper'>
      <h1>Quizzify</h1>
      <BrowserRouter>
        <Routes>
          {/*Accessible to everyone */}
          <Route element={<Login/>} path='/login'/>
          <Route element={<Register/>} path='/register' />

          {/*Only accessible to those in the "user role" */}
          <Route element={<UserRoute/>}>
            <Route element={<Homepage/>} path='/home' />
            <Route element={<AccountSettings/>} path='/accountsettings'/>
            <Route element={<Editor/>} path='/editor'/>
          </Route>

          {/*Only accessible to those in the "admin role" */}
          <Route element={<AdminRoute/>}>
            <Route element={<AdminDashboard/>} path='/admin'/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
