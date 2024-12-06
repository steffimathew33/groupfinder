import axios from "axios"

const URL = "http://localhost:3000"

export async function getAllTests() {
    const response = await axios.get(`${URL}/testing`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function getTest(id) {
    const response = await axios.get(`${URL}/testing/${id}`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function createTests(newTest) {
    const response = await axios.post(`${URL}/testing`, newTest)

    return response
}

export async function updateTests(id, updatedTest) {
    const response = await axios.put(`${URL}/testing/${id}`, updatedTest)

    return response
}

export async function deleteTests(id) {
    const response = await axios.delete(`${URL}/testing/${id}`)

    return response //For debugging, deleting doesn't need to return any info.
}

//USER FUNCTIONALITY

export async function getAllUsers() {
    const response = await axios.get(`${URL}/users`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function getUser(id) {
    const response = await axios.get(`${URL}/users/${id}`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function createUser(newUser) {
    const response = await axios.post(`${URL}/users`, newUser)

    return response
}

export async function updateUser(id, updatedUser) {
    const response = await axios.put(`${URL}/users/${id}`, updatedUser)

    return response
}

export async function verifyUser(user) {
    const response = await axios.post(`${URL}/users/login`, user);
    console.log(response)
    if (response.data.success) {
        return response.data.token;
    } else {
        return
    }
}

export async function searchUser(search) {
    try {
        const response = await axios.get(`${URL}/usersearch`, {params: { fullName: search }});
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
        alert(`Error: ${errorMessage}`);
    }
}


// GROUP FUNCTIONALITY

export async function getAllGroups() {
    const response = await axios.get(`${URL}/groups`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function getGroup(id) {
    const response = await axios.get(`${URL}/groups/${id}`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function createGroup(newGroup) {
    try {
        const response = await axios.post(`${URL}/groups`, newGroup);
        alert("Group created successfully!");
        return response;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
        alert(`Error: ${errorMessage}`);
    }
}

export async function updateGroup(id, updatedGroup) {
    const response = await axios.put(`${URL}/groups/${id}`, updatedGroup)

    return response
}

export async function leaveGroup(userId, groupId) {
    const response = await axios.put(`${URL}/leavegroup`, {userId, groupId});
    return response;
}


//REQUEST FUNCTIONALITY

export async function sendGroupRequest(groupId, requestData) {
    const response = await axios.post(`${URL}/groups/${groupId}/sendRequest`, requestData);

    return response;
}

export async function getAllRequests() {
    const response = await axios.get(`${URL}/requests`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function acceptRequest(groupId, senderId, recipientUserId) {
    try {
        const response = await axios.patch(`${URL}/groups/${groupId}/acceptRequest`, {senderId, recipientUserId});

        if (response.status === 200) {
            return response.data; // Return success response
        } else {
            throw new Error("Failed to accept the request");
        }
    } catch (error) {
        console.error("Error in acceptRequest:", error);
        throw error; // Throw the error to be handled by the calling function
    }
}

export async function deleteRequest(id) {
    const response = await axios.delete(`${URL}/requests/${id}`)

    return response //For debugging, deleting doesn't need to return any info.
}
