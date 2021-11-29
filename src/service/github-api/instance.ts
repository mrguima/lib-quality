import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: 'https://api.github.com/',
    headers: {
        'Accept': 'application/vnd.GitHub.v3+json',
    },
});

export default api;