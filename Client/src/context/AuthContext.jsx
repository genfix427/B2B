import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registrationData, setRegistrationData] = useState({});

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const fetchWithAuth = async (url, options = {}) => {
        const defaultOptions = {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, defaultOptions);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Something went wrong');
        }

        return response.json();
    };

    const checkUserLoggedIn = async () => {
        try {
            const data = await fetchWithAuth('http://localhost:5000/api/auth/profile');
            setUser(data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const data = await fetchWithAuth('http://localhost:5000/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            setUser(data);
            toast.success('Login successful!');
            return data;
        } catch (error) {
            toast.error(error.message || 'Login failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await fetchWithAuth('http://localhost:5000/api/auth/logout', { method: 'POST' });
            setUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    const register = async (formData) => {
        try {
            const data = await fetchWithAuth('http://localhost:5000/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            setUser(data);
            toast.success('Registration submitted successfully');
            return data;
        } catch (error) {
            toast.error(error.message || 'Registration failed');
            throw error;
        }
    };

    const uploadDocuments = async (formData) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/upload-documents', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Upload failed');
            }

            const data = await response.json();
            toast.success('Documents uploaded successfully');
            return data;
        } catch (error) {
            toast.error(error.message || 'Upload failed');
            throw error;
        }
    };

    const updateRegistrationData = (step, data) => {
        setRegistrationData(prev => ({
            ...prev,
            [step]: data
        }));
    };

    const clearRegistrationData = () => {
        setRegistrationData({});
    };

    const value = {
        user,
        loading,
        login,
        logout,
        register,
        uploadDocuments,
        registrationData,
        updateRegistrationData,
        clearRegistrationData,
        fetchWithAuth,
        checkUserLoggedIn
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};