import axios from 'axios';
const apiURL = process.env.REACT_APP_APP_DOMAIN; // change later to the backend link once deployed

export default axios.create({
    baseURL: `${apiURL}`,  // url to the backend
    headers: {"ngrok-skip-browser-warning": "true"}
})