// import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'
import axios from "axios"

function App() {

  const [data, setData] = useState()

    function createUser() {
      let postObject = {
        name: "Katie Dinh",
        email: "ikatiedinh@gmail.com",
        text: "oh god",
        date: new Date()
      }

      axios.post("http://localhost:3000/testing", postObject)
    }
  /*useEffect(() => {
    async function getData() {
      const response = await axios.get("http://localhost:3000/testing/6732e50ba7a10a8d1810d264")

      if (response.status === 200) { //If data fetch was successful
        setData(response.data)
      }
    }

    getData()
  }, [])*/ //Empty dependency array means this only runs on first launch.
  return (
    <>
      <button onClick={createUser}>Create Object</button>
    </>
  );
}

export default App;
