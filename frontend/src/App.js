// import logo from './logo.svg';
import './App.css';
//import { useState, useEffect } from 'react'
//import { getTests, getTest, createTests, updateTests, deleteTests } from './api';
//pages

import {HashRouter as Router, Routes, Route} from "react-router-dom"
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Profile } from './pages/Profile'

//navbar and layout 
import { Navbar } from './components/Navbar';
import { Layout } from './components/Layout';

function App() {

  // const [data, setData] = useState()

  //   function updateUser() {
  //     let postObject = {
  //       name: "Katie Dinh",
  //       email: "ikatiedinh@gmail.com",
  //       text: "update",
  //       date: new Date()
  //     }

  //     updateTests("6739559ba1f13899db8cd84c", postObject)
  //   }
  
  //pages
  // Login (landing page - sign in/create profile)
    // Home (home feed)
    //Profile (view profile)
    //Matches
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route element={<Layout/>}>
          
          <Route path="/home" element={<Home/>}/>
          <Route path="/profile" element={<Profile/>}/>

        </Route>
      </Routes>
    </Router>
  )
}

export default App;
