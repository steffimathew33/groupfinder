import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getAllRequests, getUser, getGroup } from "../api";


export function RequestsList() {
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
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
                    // Using a for loop to fetch user data for each senderId
                    for (const req of filteredRequests) {
                        const user = await getUser(req.senderId);
                        const group = await getGroup(req.groupId);
                        usersData.push({
                            senderId: req.senderId,
                            userName: `${user.firstName} ${user.lastName}`
                        });
                        groupsData.push({
                            groupId: req.groupId,
                            groupName: `${group.groupName}`
                        })
                    }
                    setUsers(usersData);
                    setGroups(groupsData);

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
                        return (
                            <li key={request._id}>
                                Group Name: {g ? g.groupName : 'Loading...'} <br />
                                Sender: {sender ? sender.userName : 'Loading...'} <br />
                                Status: {request.status} <br />
                                Date Sent: {new Date(request.dateSent).toLocaleString()}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
