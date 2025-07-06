import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const signup = (userData) => axios.post(`${API}auth/signup`, userData);
export const login = (credentials) => axios.post(`${API}/auth/login`, credentials);
