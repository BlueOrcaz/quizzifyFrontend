import React from 'react';
import api from '../../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function Editor() {
    const navigate = useNavigate();
    return (
        <h2>Flashcards Editor</h2>
    )
}