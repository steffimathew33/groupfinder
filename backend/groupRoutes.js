const express = require("express");
//Database is now defined because in server.js, we ran connectToServer function, can now use getDB
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId //Because Mongo stores ids in a ObjectId data type
const jwt = require('jsonwebtoken');
require("dotenv").config({path: "./config.env"});

let groupRoutes = express.Router();

//Main route operations: Retrieve All, Retrieve One, Create one, update one, delete one (CRUD)

//#1 Retrieve All
//creates route = http://localhost:3000/groups
//await require async function: wait till database is finished collecting from Mongo completely
groupRoutes.route("/groups").get(verifyToken, async(request, response) => {
    let db = database.getDb()
    //Mongo returns an object called 'Mongo Cursor' -> turn into array
    let data = await db.collection("groups").find({}).toArray() //return everything in the collection if no parameter for find

    if (data.length > 0) {
        response.json(data); //return to frontend
    } else {
        throw new Error("Data is an empty array.");
    }
})

//#2 Retrieve One
//:id is replaced with whatever number id it is. like a variable
groupRoutes.route("/groups/:id").get(verifyToken, async(request, response) => {
    let db = database.getDb()
    //findOne returns an object, not a Cursor
    let data = await db.collection("groups").findOne({_id: new ObjectId(request.params.id)}) //Match the param in the route

    //Checking how many properties (keys) are in the data object returned from findOne
    if (Object.keys(data).length > 0) {
        response.json(data);
    } else {
        throw new Error("Data is an empty array.");
    }
})

//#3 Create one, same route name is acceptable if the http method differs
groupRoutes.route("/groups").post(async(request, response) => {
    let db = database.getDb()

    let mongoObj = {
        groupName: request.body.groupName,
        description: request.body.description,
        createdBy: request.body.createdBy,
        members: [request.body.createdBy], //Group start with the member that created the group
        projectTitle: request.body.projectTitle,
        isFull: false, // Default to not full
        maxPeople: request.body.maxPeople,
        tags: request.body.tags || [],
        createdDate: new Date()
    };
    let data = await db.collection("groups").insertOne(mongoObj)

    response.json(data) //For consistency
    
})

//#4 Update one
groupRoutes.route("/groups/:id").put(verifyToken, async(request, response) => {
    let db = database.getDb()
    let mongoObj = {
        $set: {
            groupName: request.body.groupName,
            description: request.body.description,
            projectTitle: request.body.projectTitle,
            isFull: request.body.isFull,
            maxPeople: request.body.maxPeople,
            tags: request.body.tags
        },
        $addToSet: {
            members: { $each: request.body.members || [] }
        }
    };
    let data = await db.collection("groups").updateOne({_id: new ObjectId(request.params.id)}, mongoObj)

    response.json(data)
    
})

//#5 Delete One
//Because verifyToken is an argument, it will call that function first.
groupRoutes.route("/groups/:id").delete(verifyToken, async(request, response) => {
    let db = database.getDb()
    let data = await db.collection("groups").deleteOne({_id: new ObjectId(request.params.id)}) 
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

        request.user = user;
        next(); //proceed to next step. aka the rest of the backend function.
    });
        
}


module.exports = groupRoutes;
