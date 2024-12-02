const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId //Because Mongo stores ids in a ObjectId data type
const jwt = require('jsonwebtoken');
require("dotenv").config({path: "./config.env"});

let groupRoutes = express.Router();


//#1 Retrieve All
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
    let data = await db.collection("groups").findOne({_id: new ObjectId(request.params.id)})

    //Checking how many properties (keys) are in the data object returned from findOne
    if (Object.keys(data).length > 0) {
        response.json(data);
    } else {
        throw new Error("Data is an empty array.");
    }
})

//#3 Create one
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

//Add to the requests DB when someone sends a request to someone else
groupRoutes.route("/groups/:groupId/sendRequest").post(async (request, response) => {
    const groupId = request.params.groupId;
    const { recipientUserId } = request.body; // ID of the user being invited

    // Make sure the recipient user is valid
    const db = database.getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(recipientUserId) });

    if (!user) {
        return response.status(404).json({ message: "User not found" });
    }

    // Create a new request document
    const requestDoc = {
        groupId: new ObjectId(groupId),
        senderId: new ObjectId(request.body.senderId),  // The user who is sending the invite (e.g., group creator)
        recipientUserId: new ObjectId(recipientUserId),
        status: "pending", // 'pending', 'accepted', or 'declined'
        dateSent: new Date(),
    };

    // Insert the request into the requests collection
    await db.collection("requests").insertOne(requestDoc);

    response.status(200).json({ message: "Request sent successfully" });
});

//Get All Requests
groupRoutes.route("/requests").get(async (request, response) => {

    const db = database.getDb();
    try {
        let data = await db.collection("requests").find({}).toArray()

        if (data.length > 0) {
            return response.status(200).json(data);
        } else {
            return response.status(404).json({ message: "No requests found." });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Failed to fetch requests." });
    }
});


module.exports = groupRoutes;
