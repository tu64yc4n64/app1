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
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
        console.error('No refresh token found in local storage.');
        window.location.href = '/auth-login'; // Refresh token yoksa login sayfasına yönlendir
        return null;
    }

    try {
        const response = await axios.post("https://tiosone.com/api/token/refresh/", {
            refresh: refreshToken
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const newAccessToken = response.data.access;
        localStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
    } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error("Refresh token is invalid or expired. User needs to re-login.");
            window.location.href = '/auth-login'; // Hata durumunda login sayfasına yönlendir
        } else {
            console.error("Error refreshing access token", error);
        }
        return null;
    }
};


const fetchData = async (url) => {
    let accessToken = localStorage.getItem('accessToken');

    try {
        const response = await api.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            accessToken = await refreshAccessToken();
            if (accessToken) {
                try {
                    const retryResponse = await api.get(url, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    return retryResponse.data;
                } catch (retryError) {
                    console.error("Retry error after refreshing token", retryError);
                    throw retryError;
                }
            } else {
                window.location.href = '/auth-login'; // Hata durumunda login sayfasına yönlendir
            }
        } else {
            throw error;
        }
    }
};



export { fetchData };
