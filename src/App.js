import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './Components/Account/Login/Login'
import Register from './Components/Account/Register/Register'
import Homepage from './Components/Main/Homepage/Homepage';
import AdminDashboard from './Components/Admin/AdminDashboard/AdminDashboard';
import AccountSettings from './Components/Account/Settings/AccountSettings';
import Editor from './Components/Main/Editor/Editor';
import FlashcardSetPage from './Components/Main/FlashcardSetPage/FlashcardSetPage';

import ErrorPage from './Components/404/ErrorPage';

import AdminRoute from './util/AdminRoute';
import UserRoute from './util/UserRoute';
import BothRoutes from './util/BothRoute';

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
            <Route element={<FlashcardSetPage/>} path='/flashcardSet/:id'/>
          </Route>

          {/*Only accessible to those in the "admin role" */}
          <Route element={<AdminRoute/>}>
            <Route element={<AdminDashboard/>} path='/admin'/>
            
          </Route>

          {/*Accessible to both routes */} 
          <Route element={<BothRoutes/>}>
            <Route element={<AccountSettings/>} path='/accountsettings'/>
          </Route>
          

          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
