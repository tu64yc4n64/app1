import axios from 'axios';

const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token yenileme fonksiyonu
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('https://api.example.com/auth/refresh', { token: refreshToken });
        const { access } = response.data;

        localStorage.setItem('accessToken', access);
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

        return access;
    } catch (error) {
        console.error('Token yenileme hatası:', error);
        return null;
    }
};

// Axios interceptor ekle
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } else {
                // Token yenilenemezse, kullanıcıyı logout et
                window.location.href = '/auth-login';
            }
        }
        return Promise.reject(error);
    }
);

api.interceptors.request.use(
    async config => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default api;
