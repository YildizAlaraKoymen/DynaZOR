import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to ensure only one user is logged in at a time
 * Detects session changes across tabs and redirects to login if needed
 */
export function useAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const userID = localStorage.getItem('userID');
      const loggedInAt = localStorage.getItem('loggedInAt');
      
      if (!userID || !loggedInAt) {
        // No active session, redirect to login
        navigate('/home');
        return false;
      }
      return true;
    };

    // Initial check
    checkAuth();

    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      // If userID was removed or changed in another tab
      if (e.key === 'userID' || e.key === null) {
        const userID = localStorage.getItem('userID');
        if (!userID) {
          // User logged out in another tab
          alert('You have been logged out in another tab');
          navigate('/home');
        } else if (e.oldValue && e.newValue && e.oldValue !== e.newValue) {
          // Different user logged in another tab
          alert('Another user has logged in. Please refresh.');
          navigate('/home');
        }
      }
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  return {
    getUserID: () => localStorage.getItem('userID'),
    isAuthenticated: () => !!localStorage.getItem('userID')
  };
}
