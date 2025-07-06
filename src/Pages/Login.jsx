import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils'; 
import api from '../api'; 
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError('Email and password are required');
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      const result = res.data;
      console.log("🧪 Login result:", result);

      if (res.status === 200 && result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);

        handleSuccess('✅ Login successful!');

        setTimeout(() => {
          window.dispatchEvent(new Event("storage")); // For syncing login state across tabs/components
          navigate('/home');
        }, 1000);
      } else {
        handleError(result.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      handleError(message);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>
      <div className='w-full max-w-md bg-white shadow-md rounded-lg p-8'>
        <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>Login</h1>
        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              name='email'
              value={loginInfo.email}
              onChange={handleChange}
              placeholder='Enter your email'
              className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              name='password'
              value={loginInfo.password}
              onChange={handleChange}
              placeholder='Enter your password'
              className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200'
          >
            Login
          </button>
          <p className='text-sm text-gray-600 text-center'>
            Don’t have an account?{' '}
            <Link to='/signup' className='text-blue-600 hover:underline'>
              Signup
            </Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;


