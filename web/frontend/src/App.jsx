import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './Home'
import SetupAcc from './SetupAcc'
import Signin from './Signin'
import Signup from './Signup'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Signin />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/setupacc" element={<SetupAcc />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
