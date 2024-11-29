const express = require("express");
//Database is now defined because in server.js, we ran connectToServer function, can now use getDB
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId //Because Mongo stores ids in a ObjectId data type
const jwt = require('jsonwebtoken');
require("dotenv").config({path: "./config.env"});

let testingRoutes = express.Router();

//Main route operations: Retrieve All, Retrieve One, Create one, update one, delete one (CRUD)

//#1 Retrieve All
//creates route = http://localhost:3000/testing
//await require async function: wait till database is finished collecting from Mongo completely
testingRoutes.route("/testing").get(verifyToken, async(request, response) => {
    let db = database.getDb()
    //Mongo returns an object called 'Mongo Cursor' -> turn into array
    let data = await db.collection("testing").find({}).toArray() //return everything in the collection if no parameter for find

    if (data.length > 0) {
        response.json(data); //return to frontend
    } else {
        throw new Error("Data is an empty array.");
    }
})

//#2 Retrieve One
//:id is replaced with whatever number id it is. like a variable
testingRoutes.route("/testing/:id").get(verifyToken, async(request, response) => {
    let db = database.getDb()
    //findOne returns an object, not a Cursor
    let data = await db.collection("testing").findOne({_id: new ObjectId(request.params.id)}) //Match the param in the route

    //Checking how many properties (keys) are in the data object returned from findOne
    if (Object.keys(data).length > 0) {
        response.json(data);
    } else {
        throw new Error("Data is an empty array.");
    }
})

//#3 Create one, same route name is acceptable if the http method differs
testingRoutes.route("/testing").post(verifyToken, async(request, response) => {
    let db = database.getDb()
    let mongoObj = {
        name: request.body.name,
        email: request.body.email,
        movie_id: request.body.runtime,
        text: request.body.text,
        date: request.body.date
    }
    let data = await db.collection("testing").insertOne(mongoObj)

    response.json(data) //For consistency
    
})

//#4 Update one
testingRoutes.route("/testing/:id").put(verifyToken, async(request, response) => {
    let db = database.getDb()
    let mongoObj = {
        $set: {
            name: request.body.name,
            email: request.body.email,
            movie_id: request.body.runtime,
            text: request.body.text,
            date: request.body.date
        }
        
    }
    let data = await db.collection("testing").updateOne({_id: new ObjectId(request.params.id)}, mongoObj)

    response.json(data)
    
})

//#5 Delete One
//Because verifyToken is an argument, it will call that function first.
testingRoutes.route("/testing/:id").delete(verifyToken, async(request, response) => {
    let db = database.getDb()
    let data = await db.collection("testing").deleteOne({_id: new ObjectId(request.params.id)}) 
    response.json(data);
})

function verifyToken(request, response, next) {
    const authentication = request.headers["Authorization"];
    if (!authentication) {
        return response.status(401).json({message: "Not logged in."});
    }

    const token = authentication.split(" ")[1] //Bearer 12345 (splits by space and get second item)

    if (!token) {
        // If there's no token after "Bearer", return an error
        return response.status(401).json({ message: "Token missing." });
    }

    //Compare token with our secret key. If it's valid, return the user. If it's not, return error.
    jwt.verify(token, process.env.SECRETKEY, (error, user) => {
        if (error) {
            return response.status(403).json({message: "Invalid token."});
        }

        request.body.user = user;
        next(); //proceed to next step. aka the rest of the backend function.
    });
        
}

module.exports = testingRoutes;
