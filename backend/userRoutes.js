const express = require("express");
//Database is now defined because in server.js, we ran connectToServer function, can now use getDB
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId //Because Mongo stores ids in a ObjectId data type
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyToken } = require('./auth');
const { mongo } = require("mongoose");
require("dotenv").config({path: "./config.env"});

let userRoutes = express.Router();
const SALT_ROUNDS = 6;

//Main route operations: Retrieve All, Retrieve One, Create one, update one, delete one (CRUD)

//#1 Retrieve All
//creates route = http://localhost:3000/users
//await require async function: wait till database is finished collecting from Mongo completely
userRoutes.route("/users").get(verifyToken, async(request, response) => {
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
userRoutes.route("/users/:id").get(verifyToken, async(request, response) => {
    let db = database.getDb()

    // Check if the id is a valid ObjectId
    if (!ObjectId.isValid(request.params.id)) {
        return response.status(400).json({ message: "Invalid user ID format" });
    }
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

    const emailTaken = await db.collection("users").findOne({email: request.body.email})

    if (emailTaken) {
        response.status(400)
        response.json({message: "This email is taken."})
        
    } else {
        const hash = await bcrypt.hash(request.body.password, SALT_ROUNDS);

        let mongoObj = {
            email: request.body.email,
            password: hash,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            fullName: request.body.firstName + " " + request.body.lastName,
            major: request.body.major,
            gradYear: request.body.gradYear,
            profilePicture: request.body.profilePicture,
            bio: request.body.bio,
            signupDate: new Date(),
            inGroup: request.body.inGroup
        }
         data = await db.collection("users").insertOne(mongoObj)

        response.json(data) //For consistency
    }
    
    
})

//#4 Update one
userRoutes.route("/users/:id").put(verifyToken, async(request, response) => {
    let db = database.getDb()
    let mongoObj = {
        $set: {
            email: request.body.email,
            password: request.body.password,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            fullName: request.body.firstName + " " + request.body.lastName,
            major: request.body.major,
            gradYear: request.body.gradYear,
            profilePicture: request.body.profilePicture,
            bio: request.body.bio,
            inGroup: new ObjectId(request.body.group)
        }
    }
    let data = await db.collection("users").updateOne({_id: new ObjectId(request.params.id)}, mongoObj)

    response.json(data)
    
})

//#5 Delete One
userRoutes.route("/users/:id").delete(verifyToken, async(request, response) => {
    let db = database.getDb()
    let data = await db.collection("users").deleteOne({_id: new ObjectId(request.params.id)}) 
    response.json(data);
})

//Login Route
userRoutes.route("/users/login").post(async(request, response) => {
    let db = database.getDb()

    //Find the email, then check passwords
    const user = await db.collection("users").findOne({email: request.body.email})

    if (user && request.body.password !== null) {
        let checkPassword = await bcrypt.compare(request.body.password, user.password);
        if (checkPassword) {
            const token = jwt.sign(user, process.env.SECRETKEY, {expiresIn: "1h"}); //Encode user data into a jsonwebtoken for page authentication
                                                                                    //process.env.SECRETKEY is stored in config.env.
            response.json({success: true, token})
        } else {
            response.json({success: false, message: "Incorrect Password."})
        }
    } else {
        response.json({success: false, message: "User not found."})
    }
})

//Search through user database using query
userRoutes.route("/usersearch").get(async (request, response) => {
    const search = request.query.fullName;
    if (!search) {
        return response.status(400).json({ error: "Username query parameter is required" });
    }

    try {
        let db = database.getDb();
        let data = await db.collection("users").find({
            fullName: { $regex: search, $options: "i" }}).toArray();

        if (data.length > 0) {
            response.json(data);
        } else {
            response.status(404).json({ message: "No users found matching the query." });
        }
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

module.exports = userRoutes;
