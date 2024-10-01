import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../redux/authSlice';
import classes from './register.module.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) throw new Error('Passwords do not match');
    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      console.log(data);
      dispatch(register(data));
      navigate('/');
    } catch (error) {
      setError((prev) => true);
      setTimeout(() => setError((prev) => false), 1000);
      console.log(error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2 className={classes.title}>Register</h2>
        <form className={classes.form} onSubmit={handleRegister}>
          <label htmlFor='username'>
            <input
              onChange={(e) => setUsername((prev) => e.target.value)}
              type='text'
              id='username'
              placeholder='Enter username'
            />
          </label>
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
          <label htmlFor='confirmPassword'>
            <input
              onChange={(e) => setConfirmPassword((prev) => e.target.value)}
              type='password'
              id='confirmPassword'
              placeholder='Confirm password'
              className={classes.input}
            />
          </label>
          <button className={classes.submitBtn}>Register</button>
          <Link to='/login' className={classes.link}>
            Already have an account? <p className={classes.register}>Login now</p>
          </Link>
        </form>
        {error && <div className={classes.errorMessage}>Wrong email or password</div>}
      </div>
    </div>
  );
};

export default Register;
