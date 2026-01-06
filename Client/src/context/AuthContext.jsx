import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { API_URL } from '../components/OtherContent/BaseURL';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationData, setRegistrationData] = useState({});

  useEffect(() => {
    checkUserLoggedIn();
    // eslint-disable-next-line
  }, []);

  /* -----------------------------------
     SAFE FETCH HELPER
  ----------------------------------- */
  const fetchWithAuth = async (endpoint, options = {}) => {
    const response = await fetch(`${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    // If unauthorized, return null (used by /me)
    if (response.status === 401) return null;

    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200));
      throw new Error('Invalid server response');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  };

  /* -----------------------------------
     CHECK AUTH STATUS
  ----------------------------------- */
  const checkUserLoggedIn = async () => {
    try {
      const data = await fetchWithAuth(`${API_URL}/auth/me`);
      setUser(data);
    } catch (error) {
      setUser(null);
      console.error('Auth check failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------
     LOGIN
  ----------------------------------- */
  const login = async (email, password) => {
    try {
      const data = await fetchWithAuth(`${API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setUser(data);
      toast.success('Login successful');
      return data;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  /* -----------------------------------
     LOGOUT
  ----------------------------------- */
  const logout = async () => {
    try {
      await fetchWithAuth('/auth/logout', { method: 'POST' });
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  /* -----------------------------------
     REGISTER
  ----------------------------------- */
  const register = async (formData) => {
    try {
      const data = await fetchWithAuth(`${API_URL}/auth/register`, {
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

  /* -----------------------------------
     UPLOAD DOCUMENTS
  ----------------------------------- */
  const uploadDocuments = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/auth/upload-documents`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Invalid server response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      toast.success('Documents uploaded successfully');
      return data;
    } catch (error) {
      toast.error(error.message || 'Upload failed');
      throw error;
    }
  };

  /* -----------------------------------
     REGISTRATION DATA (FRONTEND ONLY)
  ----------------------------------- */
  const updateRegistrationData = (step, data) => {
    setRegistrationData(prev => ({
      ...prev,
      [step]: data,
    }));
  };

  const clearRegistrationData = () => {
    setRegistrationData({});
  };

  /* -----------------------------------
     CONTEXT VALUE
  ----------------------------------- */
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
    checkUserLoggedIn,
     fetchWithAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
