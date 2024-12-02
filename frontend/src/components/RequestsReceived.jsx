import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getAllRequests, getUser } from "../api";


export function RequestsList() {
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
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
                    // Using a for loop to fetch user data for each senderId
                    for (const req of filteredRequests) {
                        const user = await getUser(req.senderId);
                        usersData.push({
                            senderId: req.senderId,
                            userName: `${user.firstName} ${user.lastName}`
                        });
                    }
                    setUsers(usersData)
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
                        const sender = users.find(user => user.senderId === request.senderId);
                        return (
                            <li key={request._id}>
                                Group ID: {request.groupId} <br />
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
