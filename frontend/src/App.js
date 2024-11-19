// import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'
import { getTests, getTest, createTests, updateTests, deleteTests } from './api';

function App() {

  const [data, setData] = useState()

    function updateUser() {
      let postObject = {
        name: "Katie Dinh",
        email: "ikatiedinh@gmail.com",
        text: "update",
        date: new Date()
      }

      updateTests("6739559ba1f13899db8cd84c", postObject)
    }
  /*useEffect(() => {
    async function loadAllTests() {
      let data = await getTests()
      if (data) {
        setData(data)
      }
    }

    loadAllTests()
  }, [])*/ //Empty dependency array means this only runs on first launch



  

  return (
    <>
      <button onClick={updateUser}>Update User</button>
    </>
  );
}

export default App;
