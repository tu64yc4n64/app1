// src/utils/api.js
import axios from 'axios';

const baseURL = 'https://tiosone.com';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
});

const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${baseURL}/refresh`, { token: refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        return accessToken;
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        throw error;
    }
};

const fetchData = async (url) => {
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                const newAccessToken = await refreshAccessToken();
                api.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                const retryResponse = await api.get(url);
                return retryResponse.data;
            } catch (retryError) {
                console.error('Failed to retry with new access token:', retryError);
                throw retryError;
            }
        } else {
            throw error;
        }
    }
};

export { fetchData };
