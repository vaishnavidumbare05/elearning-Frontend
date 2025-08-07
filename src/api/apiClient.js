import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost/learning/backend/api', // Adjust base URL based on your server
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
