import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
           
const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        if (!accessToken || !refreshToken) {
            navigate('/login');
        } else {
            const checkTokenExpiration = async () => { 
                try {
                    const response = await axios.post('/api/user/verifyToken', {}, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    if (response.status === 200) {
                        console.log("Token is valid:", response.data);
                        return true;
                    } else {
                        console.log("Token is valid, but not as expected:", response.data);
                        return false;
                    }
                } catch (error) {
                    if (error.response && error.response.status === 400) {
                        return await refreshAccessToken(refreshToken);
                    }
                    return false;
                }
            };

            const refreshAccessToken = async (refreshToken) => {
                try {
                    const response = await axios.post('/api/user/refreshToken', {}, {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`
                        }
                    });
                    const { accessToken, refreshToken: newRefreshToken } = response.data;
                    localStorage.setItem('accessToken', accessToken); 
                    Cookies.set('refreshToken', newRefreshToken); 
                    return true;
                } catch (error) {
                    console.error('Failed to refresh token:', error);
                    return false;
                }
            };

            checkTokenExpiration().then(isValid => { 
                if (!isValid) {
                    navigate('/login');
                }
            });
        }
    }, [navigate]);

    return null;
};

export default useAuth;
