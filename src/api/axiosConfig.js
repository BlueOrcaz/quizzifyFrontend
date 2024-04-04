import axios from 'axios';
const apiURL = process.env.REACT_APP_APP_DOMAIN;

export default axios.create({
    baseURL: `${apiURL}`,
    headers: {"ngrok-skip-browser-warning": "true"}
})