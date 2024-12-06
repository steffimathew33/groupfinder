const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId //Because Mongo stores ids in a ObjectId data type
const { verifyToken } = require('./auth');
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
    try {
        let db = database.getDb()
        //findOne returns an object, not a Cursor
        let d = new ObjectId(request.params.id);
        let data = await db.collection("groups").findOne({_id: new ObjectId(request.params.id)})

        if (data) {
            response.json(data);
        } else {
            throw new Error("Data is an empty array.");
        }
    } catch (error) {
        console.log("Something went wrong with retrieving a group.")
    }
});
//#3 Create one
groupRoutes.route("/groups").post(async(request, response) => {
    let db = database.getDb()

    const isItFull = request.body.maxPeople === 1;

    let mongoObj = {
        groupName: request.body.groupName,
        description: request.body.description,
        createdBy: request.body.createdBy,
        members: [request.body.createdBy], //Group start with the member that created the group
        projectTitle: request.body.projectTitle,
        isFull: isItFull,
        maxPeople: request.body.maxPeople,
        tags: request.body.tags || [],
        createdDate: new Date()
    };
    try {
        let data = await db.collection("groups").insertOne(mongoObj);

        response.status(200).json({message: "Group created successfully", groupId: data.insertedId });
    } catch (error) {
        // Handle database or other errors
        console.error("Error creating group:", error);
        response.status(500).json({ message: "Failed to create group", error: error.message });
    }
});


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

//Accept a request that had been made
groupRoutes.route("/groups/:groupId/acceptRequest").patch(async (request, response) => {
    const db = database.getDb();
    let group = await db.collection("groups").findOne({_id: new ObjectId(request.params.groupId)})
    let sender = await db.collection("users").findOne({_id: new ObjectId(request.body.senderId)})
    let recipient = await db.collection("users").findOne({_id: new ObjectId(request.body.recipientUserId)})

    if (!sender) { return response.status(404).json({message: "Sender not found"})};
    if (!recipient) { return response.status(404).json({message: "Recipient not found"})};

    if (!group) {
        return response.status(404).json({ message: "Group not found" });
    }

    // Check if the group is full
    if (group.members.length >= group.maxPeople) {
        return response.status(400).json({ message: "Group is full" });
    }

    // Add the sender to the group's members
    group.members.push(request.body.senderId);
    group.currentMembers += 1;

    const isFull = group.members.length === group.maxPeople;

    recipient.inGroup = group._id;

    await db.collection("groups").updateOne({ _id: new ObjectId(request.params.groupId) }, { $set: { members: group.members, isFull: isFull } });
    await db.collection("users").updateOne({ _id: new ObjectId(request.body.recipientUserId) }, { $set: { inGroup: request.params.groupId } });

    response.status(200).json({ message: "Request accepted, user added to the group" });
    
});



//Get All Requests
groupRoutes.route("/requests").get(async (request, response) => {

    const db = database.getDb();
    try {
        let data = await db.collection("requests").find({}).toArray()
        response.json(data);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Failed to fetch requests." });
    }
});

//Delete a request
groupRoutes.route("/requests/:id").delete(verifyToken, async(request, response) => {
    let db = database.getDb()
    let data = await db.collection("requests").deleteOne({_id: new ObjectId(request.params.id)}) 
    response.json(data);
})

module.exports = groupRoutes;
