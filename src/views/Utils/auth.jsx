// utils/auth.js
export const isAuthenticated = () => {
    return !!localStorage.getItem('user_id');
  };
  