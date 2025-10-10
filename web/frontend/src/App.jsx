import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import EventCalendar from './EventCalendar'
import Home from './Home'
import Settings from './Settings'
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
        <Route path="/settings" element={<Settings />} />
        <Route path="/eventcalendar" element={<EventCalendar />} />
      </Routes>
    </Router>
  )
}

export default App
