const express = require("express");
//Database is now defined because in server.js, we ran connectToServer function, can now use getDB
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId //Because Mongo stores ids in a ObjectId data type
const bcrypt = require("bcrypt");

let userRoutes = express.Router();
const SALT_ROUNDS = 6;

//Main route operations: Retrieve All, Retrieve One, Create one, update one, delete one (CRUD)

//#1 Retrieve All
//creates route = http://localhost:3000/users2
//await require async function: wait till database is finished collecting from Mongo completely
userRoutes.route("/users2").get(async(request, response) => {
    let db = database.getDb()
    //Mongo returns an object called 'Mongo Cursor' -> turn into array
    let data = await db.collection("users2").find({}).toArray() //return everything in the collection if no parameter for find

    if (data.length > 0) {
        response.json(data); //return to frontend
    } else {
        throw new Error("Data is an empty array.");
    }
})

//#2 Retrieve One
//:id is replaced with whatever number id it is. like a variable
userRoutes.route("/users2/:id").get(async(request, response) => {
    let db = database.getDb()
    //findOne returns an object, not a Cursor
    let data = await db.collection("users2").findOne({_id: new ObjectId(request.params.id)}) //Match the param in the route

    //Checking how many properties (keys) are in the data object returned from findOne
    if (Object.keys(data).length > 0) {
        response.json(data);
    } else {
        throw new Error("Data is an empty array.");
    }
})

//#3 Create one, same route name is acceptable if the http method differs
userRoutes.route("/users2").post(async(request, response) => {
    let db = database.getDb()

    const emailTaken = await db.collection("users2").findOne({email: request.body.email})
    console.log(emailTaken);
    
    if (emailTaken) {
        response.json({message: "This email is taken."})
        response.status(400)
    } else {
        const hash = await bcrypt.hash(request.body.password, SALT_ROUNDS);

        let mongoObj = {
            name: request.body.name,
            email: request.body.email,
            password: hash,
            joinDate: new Date(),
            //major: request.body.major
        }
         data = await db.collection("users2").insertOne(mongoObj)

        response.json(data) //For consistency
    }
    
    
})

//#4 Update one
userRoutes.route("/users2/:id").put(async(request, response) => {
    let db = database.getDb()
    let mongoObj = {
        $set: {
            name: request.body.name,
            email: request.body.email,
            password: request.body.password,
            joinDate: request.body.joinDate,
            //major: request.body.major
        }
        
    }
    let data = await db.collection("users2").updateOne({_id: new ObjectId(request.params.id)}, mongoObj)

    response.json(data)
    
})

//#5 Delete One
userRoutes.route("/users2/:id").delete(async(request, response) => {
    let db = database.getDb()
    let data = await db.collection("users2").deleteOne({_id: new ObjectId(request.params.id)}) 
    response.json(data);
})

module.exports = userRoutes;
