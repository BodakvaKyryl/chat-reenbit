import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Register from './components/register/Register';

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <div>
      <Routes>
        <Route path='/' element={token ? <Home /> : <Navigate to='/login' />} />
        <Route path='/login' element={!token ? <Login /> : <Navigate to='/' />} />
        <Route path='/register' element={!token ? <Register /> : <Navigate to='/' />} />
      </Routes>
    </div>
  );
}

export default App;
