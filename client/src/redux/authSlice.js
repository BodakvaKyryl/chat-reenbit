import { createSlice } from '@reduxjs/toolkit';

const USER = 'user';
const TOKEN = 'token';

const _user = localStorage.getItem(USER);

const user = _user ? JSON.parse(_user) : null;
const token = localStorage.getItem(TOKEN) ?? null;

const initialState = {
  token,
  user,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      localStorage.clear();

      const { token, others: user } = action.payload;

      localStorage.setItem(USER, JSON.stringify(user));
      localStorage.setItem(TOKEN, token);

      console.log('New login. Current auth state:', { user, token });

      return { user, token };
    },
    register: (state, action) => {
      localStorage.clear();

      const { token, others: user } = action.payload;

      localStorage.setItem(USER, JSON.stringify(user));
      localStorage.setItem(TOKEN, token);

      return { user: null, token };
    },
    logout: (state) => {
      localStorage.clear();

      return { user: null, token: null };
    },
  },
});

export const { login, register, logout } = authSlice.actions;
export default authSlice.reducer;
