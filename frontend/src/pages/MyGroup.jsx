import './MyGroup.css';
import { getGroup } from "../api";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export function MyGroup() {
    const [group, setGroup] = useState(null); // State to store group data
    const [error, setError] = useState(null); // State to handle any error

    useEffect(() => {
        async function loadUserGroup() {
            const token = sessionStorage.getItem("User");
            if (token) {
                const decodedUser = jwtDecode(token);
                const groupId = decodedUser.inGroup;

                if (groupId != null) {
                    try {
                        // Fetch the group data based on groupId
                        const groupData = await getGroup(groupId);
                        setGroup(groupData); // Set the fetched group data
                    } catch (err) {
                        console.error("Error fetching group data:", err);
                        setError("Failed to fetch group data");
                    }
                } else {
                    setGroup("No Group"); // If user is not in a group, set the state to "No Group"
                }
            }
        }
        loadUserGroup();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    // Show loading message while group data is being fetched
    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!group) {
        return <div>Loading...</div>;
    }

    return (
        <div className="my-group">
            <h1 style={{ marginTop: "50px" }}>My Group</h1>
            <h2 style={{ marginTop: "70px" }}>{group.groupName || "No Group"}</h2> {/* Display the group name */}
            <p style={{ marginTop: "85px" }}>{group.description || "" }</p>  {/*Display group description */}
        </div>
    );
}

