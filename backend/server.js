const connect = require("./connect"); //Runs the file connect.js, and sets connect = connect's module.exports
const express = require("express");
const cors = require("cors");
const testing = require("./testingRoutes") 

const app = express();
const PORT = 3000;

app.use(cors()) //helps set up middleware
app.use(express.json()) //parse requests in json format
app.use(testing) //make routes accessible to other parts of the code

app.listen(PORT, () => {
    connect.connectToServer() //Connects us to Mongo
    console.log(`Server is running on port ${PORT}`)
})