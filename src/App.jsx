import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
