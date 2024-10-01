import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../redux/authSlice';
import classes from './login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log('API Response:', data); // Log API response
      if (!data || !data.token) {
        throw new Error('Invalid response from server');
      }
      dispatch(login(data));
      navigate('/'); // Navigate after successful login
    } catch (error) {
      setError(true);
      setTimeout(() => setError(false), 1000);
      console.error(error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2 className={classes.title}>Login</h2>
        <form onSubmit={handleLogin} className={classes.form}>
          <label htmlFor='email'>
            <input
              onChange={(e) => setEmail((prev) => e.target.value)}
              type='email'
              id='email'
              placeholder='Enter email'
              className={classes.input}
            />
          </label>
          <label htmlFor='password'>
            <input
              onChange={(e) => setPassword((prev) => e.target.value)}
              type='password'
              id='password'
              placeholder='Enter password'
              className={classes.input}
            />
          </label>
          <button className={classes.submitBtn}>Login</button>
          <Link to='/register' className={classes.link}>
            Don't have an account? <p className={classes.register}>Register now</p>
          </Link>
        </form>
        {error && <div className={classes.errorMessage}>Wrong email or password</div>}
      </div>
    </div>
  );
};

export default Login;
