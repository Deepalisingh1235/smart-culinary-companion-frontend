import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import api from '../api';

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
      return handleError('Name, Email, and Password are required');
    }

    try {
      console.log('Sending Signup info:', signupInfo);

     const res = await api.post('/auth/signup', { name, email, password });
const result = res.data;



      if (response.ok && result.success) {
        handleSuccess(result.message);
        setTimeout(() => {
          navigate('/login'); 
        }, 1000);
      } else {
        const errorMsg = result.error?.details?.[0]?.message || result.message || 'Signup failed';
        handleError(errorMsg);
      }
    } catch (err) {
      handleError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>
      <div className='w-full max-w-md bg-white shadow-md rounded-lg p-8'>
        <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>Signup</h1>
        <form onSubmit={handleSignup} className='space-y-4'>
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700'>Name</label>
            <input
              onChange={handleChange}
              type='text'
              name='name'
              placeholder='Enter your name...'
              value={signupInfo.name}
              className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
            <input
              onChange={handleChange}
              type='email'
              name='email'
              placeholder='Enter your email...'
              value={signupInfo.email}
              className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
            <input
              onChange={handleChange}
              type='password'
              name='password'
              placeholder='Enter your password...'
              value={signupInfo.password}
              className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200'
          >
            Signup
          </button>
          <p className='text-sm text-gray-600 text-center'>
            Already have an account?{' '}
            <Link to="/login" className='text-blue-600 hover:underline'>Login</Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Signup;

