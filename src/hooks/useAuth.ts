import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  name?: string;
  role?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if token is expired
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }, []);

  // Validate token and get user info
  const validateToken = useCallback(async (token: string) => {
    try {
      // You can add a call to your backend to validate the token
      // const response = await authAPI.getProfile();
      // return response.data.user;
      
      // For now, decode the token to get basic info
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        email: payload.email || 'admin@mrcog.com',
        name: payload.name || 'Admin User',
        role: payload.role || 'admin'
      };
    } catch (error) {
      console.error('Token validation failed:', error);
      return null;
    }
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Call your login API
      const response = await fetch('http://localhost:3010/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('loginTime', Date.now().toString());
        
        const userInfo = await validateToken(data.token);
        if (userInfo) {
          setUser(userInfo);
          setIsAuthenticated(true);
          navigate('/');
          return { success: true };
        }
      }
      
      return { success: false, message: data.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error occurred' };
    } finally {
      setIsLoading(false);
    }
  }, [navigate, validateToken]);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loginTime');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('loginTime');
        setIsAuthenticated(false);
        return;
      }

      // Validate token and get user info
      const userInfo = await validateToken(token);
      if (userInfo) {
        setUser(userInfo);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [isTokenExpired, validateToken, logout]);

  // Auto-logout after inactivity (optional)
  useEffect(() => {
    const handleActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    const checkInactivity = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      const loginTime = localStorage.getItem('loginTime');
      
      if (lastActivity && loginTime) {
        const inactiveTime = Date.now() - parseInt(lastActivity);
        const maxInactiveTime = 30 * 60 * 1000; // 30 minutes
        
        if (inactiveTime > maxInactiveTime) {
          logout();
        }
      }
    };

    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, handleActivity));
    
    // Check inactivity every minute
    const inactivityInterval = setInterval(checkInactivity, 60000);
    
    // Set initial activity time
    handleActivity();

    return () => {
      events.forEach(event => document.removeEventListener(event, handleActivity));
      clearInterval(inactivityInterval);
    };
  }, [logout]);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  };
};
