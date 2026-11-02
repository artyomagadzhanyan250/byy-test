import './App.css';

import { Routes, Route } from 'react-router-dom';

// Pages
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<SignIn />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/' element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
