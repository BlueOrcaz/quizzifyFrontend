import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

export default function Register() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/login')
    }

    return (
        <div className='register-wrapper'>
            <h1>Sign Up Page</h1>
            <form>
                <label>
                    <p>Username</p>
                    <input type='text' />
                </label>
                <label>
                    <p>Password</p>
                    <input type='text' />
                </label>
                <label>
                    <p>DateOfBirth</p>
                    <input type='text' />
                </label>
                <label>
                    <p>Email</p>
                    <input type='text' />
                </label>
                <label>
                    <p>Educational Role</p>
                    <input type='text' />
                </label>
                <div>
                    <button type='submit'>Submit</button>
                    <button onClick={handleClick}>Login Page</button>
                </div>
            </form>
        </div>
    )
}