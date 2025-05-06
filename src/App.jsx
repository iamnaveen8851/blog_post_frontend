
import { UserProvider } from './context/UserContext'
import './App.css'
import SignupForm from './components/SignUp'
import AllRoute from './components/AllRoute'
import Navbar from './components/Navbar'

function App() {
  return (
    <UserProvider>
      <>
       
        <AllRoute/>
      </>
    </UserProvider>
  )
}

export default App