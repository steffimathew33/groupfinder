const express = require("express");
//Database is now defined because in server.js, we ran connectToServer function, can now use getDB
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId //Because Mongo stores ids in a ObjectId data type

let userRoutes = express.Router();

//Main route operations: Retrieve All, Retrieve One, Create one, update one, delete one (CRUD)

//#1 Retrieve All
//creates route = http://localhost:3000/users
//await require async function: wait till database is finished collecting from Mongo completely
userRoutes.route("/users").get(async(request, response) => {
    let db = database.getDb()
    //Mongo returns an object called 'Mongo Cursor' -> turn into array
    let data = await db.collection("users").find({}).toArray() //return everything in the collection if no parameter for find

    if (data.length > 0) {
        response.json(data); //return to frontend
    } else {
        throw new Error("Data is an empty array.");
    }
})

//#2 Retrieve One
//:id is replaced with whatever number id it is. like a variable
userRoutes.route("/users/:id").get(async(request, response) => {
    let db = database.getDb()
    //findOne returns an object, not a Cursor
    let data = await db.collection("users").findOne({_id: new ObjectId(request.params.id)}) //Match the param in the route

    //Checking how many properties (keys) are in the data object returned from findOne
    if (Object.keys(data).length > 0) {
        response.json(data);
    } else {
        throw new Error("Data is an empty array.");
    }
})

//#3 Create one, same route name is acceptable if the http method differs
userRoutes.route("/users").post(async(request, response) => {
    let db = database.getDb()
    let mongoObj = {
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        joinDate: new Date(),
        major: request.body.major
    }
    let data = await db.collection("users").insertOne(mongoObj)

    response.json(data) //For consistency
    
})

//#4 Update one
userRoutes.route("/users/:id").put(async(request, response) => {
    let db = database.getDb()
    let mongoObj = {
        $set: {
            name: request.body.name,
            email: request.body.email,
            password: request.body.password,
            joinDate: request.body.joinDate,
            major: request.body.major
        }
        
    }
    let data = await db.collection("users").updateOne({_id: new ObjectId(request.params.id)}, mongoObj)

    response.json(data)
    
})

//#5 Delete One
userRoutes.route("/users/:id").delete(async(request, response) => {
    let db = database.getDb()
    let data = await db.collection("users").deleteOne({_id: new ObjectId(request.params.id)}) 
    response.json(data);
})

module.exports = userRoutes;
