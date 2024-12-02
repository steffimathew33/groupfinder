import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getAllRequests, getUser, getGroup, acceptRequest, deleteRequest } from "../api";


export function RequestsList() {
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRequestsReceived() {
            try {
                const token = sessionStorage.getItem("User");
                if (token) {
                    const decodedUser = jwtDecode(token);
                    const allRequests = await getAllRequests();
                    const filteredRequests = allRequests.filter((req) => req.recipientUserId === decodedUser._id);
                    setRequests(filteredRequests);

                    let usersData = [];
                    let groupsData = [];
                    let recipientsData = [];
                    // Using a for loop to fetch user data for each senderId
                    for (const req of filteredRequests) {
                        const user = await getUser(req.senderId);
                        const group = await getGroup(req.groupId);
                        const recip = await getUser(req.recipientUserId);
                        usersData.push({
                            senderId: req.senderId,
                            userName: `${user.firstName} ${user.lastName}`
                        });
                        groupsData.push({
                            groupId: req.groupId,
                            groupName: `${group.groupName}`
                        })
                        recipientsData.push({
                            recipientUserId: req.recipientUserId,
                        })
                    }
                    setUsers(usersData);
                    setGroups(groupsData);
                    setRecipients(recipientsData);

                }
            } catch (error) {
                console.error(error);
                alert("An error occurred while fetching requests.");
            } finally {
                setLoading(false);
            }
        }

        fetchRequestsReceived();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    async function handleAccept(requestId, groupId, senderId, recipientUserId) {
        try {
            const response = await acceptRequest(groupId, senderId, recipientUserId);
            
            console.log(response.message); // Log the success message
            alert(response.message); // Notify the user about the successful operation

            // Delete the request after successful acceptance
            try {
                const deleteResponse = await deleteRequest(requestId);
                console.log(deleteResponse.message); // Assuming deleteRequest returns a message
                setRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId));
            } catch (deleteError) {
                console.error("Error deleting the request:", deleteError.message);
                alert("The request was accepted, but could not be deleted from the list.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
            console.error("Error accepting the request:", errorMessage);
            alert(errorMessage);
        }
    }

    async function handleReject(requestId) { }

    return (
        <div>
            <h2>Your Requests</h2>
            {requests.length === 0 ? (
                <p>No requests found.</p>
            ) : (
                <ul>
                    {requests.map((request) => {
                        const sender = users.find((user) => user.senderId === request.senderId);
                        const g = groups.find((group) => group.groupId === request.groupId);
                        const recip = recipients.find((user) => user.recipientUserId === request.recipientUserId);
                        return (
                            <li key={request._id}>
                                Group Name: {g ? g.groupName : 'Loading...'} <br />
                                Sender: {sender ? sender.userName : 'Loading...'} <br />
                                Status: {request.status} <br />
                                Date Sent: {new Date(request.dateSent).toLocaleString()}
                                <div>
                                <button onClick={() => handleAccept(request._id, g.groupId, sender.senderId, recip.recipientUserId)}>Accept</button>
                                <button onClick={() => handleReject(request._id)}>Reject</button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
