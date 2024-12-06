import './App.css';
import { useState, useEffect } from 'react'
import {HashRouter as Router, Routes, Route} from "react-router-dom"
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Profile } from './pages/Profile'
import { MyGroup } from './pages/MyGroup';
import { OtherUserProfile } from './pages/OtherUserProfile';
//navbar and layout:
import { Navbar } from './components/Navbar';
import { Layout } from './components/Layout';
import axios from 'axios';

function App() {

//Maintain authorization even after refreshing of a page. Session storage persists through refreshes
  useEffect(() => {
    let token = sessionStorage.getItem("User");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route element={<Layout/>}>
          
          <Route path="/home" element={<Home/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/mygroup" element={<MyGroup/>}/>
          <Route path="/profile/:id" element={<OtherUserProfile />} />

        </Route>
      </Routes>
    </Router>
  )
}

export default App;
