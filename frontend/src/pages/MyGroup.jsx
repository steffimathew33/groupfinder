import './MyGroup.css';
import { getUser } from "../api";
import { getGroup } from "../api";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import LeaveGroupButton from '../components/LeaveGroup';

export function MyGroup() {
    const [group, setGroup] = useState(null); // State to store group data
    const [error, setError] = useState(null); // State to handle any error
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Get token and decode user information
    const token = sessionStorage.getItem("User");
    const decodedUser = jwtDecode(token);

    const currentGroupId = decodedUser.inGroup;  // Assuming the group ID is in 'inGroup'
    const userId = decodedUser._id;  // Assuming _id is the user ID in the token

    // Success handler when user leaves the group
    const onLeaveSuccess = () => {
        // Handle the success case here, like updating the UI
        setGroup(null); // You can reset the group data or show a success message
    };

    // Fetch group and member data
    useEffect(() => {
        async function loadUserGroup() {
            if (token) {
                const decodedUser = jwtDecode(token);
                const groupId = decodedUser.inGroup;

                if (groupId != null) {
                    try {
                        // Fetch the group data based on groupId
                        const groupData = await getGroup(groupId);
                        setGroup(groupData); // Set the fetched group data

                        const memberDetails = await Promise.all(
                            groupData.members.map(async (memberId) => {
                                const memberData = await getUser(memberId);
                                return memberData;
                            })
                        );
                        setMembers(memberDetails); 
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
    }, [token]); // Empty dependency array ensures this runs only once when the component mounts

    // Handle leaving the group
    const handleLeaveGroup = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/users/${userId}/leaveGroup`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // Assuming token is in localStorage
                },
                body: JSON.stringify({ group: currentGroupId })
            });

            if (!response.ok) {
                // If the response is not ok, log it and show an error
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Failed to leave group');
            }

            const data = await response.json();  // Only parse JSON if the response is okay
            // Handle success
            onLeaveSuccess();
            alert('You have successfully left the group.');
        } catch (error) {
            setError(error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Show loading message while group data is being fetched
    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!group) {
        return <div>Loading...</div>;
    }

    const handleClick = (member) => {
        setMembers(member);
    }

    const membersCount = group.members?.length || 0; // Fallback to 0 if undefined
    const membersNeeded = group.maxPeople - membersCount || 0; // Fallback to 0 if undefined

    return (
        <div className="my-group">
            <h1 style={{ textDecoration: 'underline'}}> My Group</h1>
            <h2>{group.groupName || "No Group"}</h2> {/* Display the group name */}
            <h3>Group Size: {group.maxPeople}</h3>
            <h4>
                Current Members: {membersCount} 
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                Members Needed: {membersNeeded}
            </h4>
            
            <div className="group-info">
                <p>Group Description: {group.description || "" }</p>  {/*Display group description */}
                <p>Project Name: {group.projectTitle || "Untitled"}</p>
            </div>
            
            <h5>Members</h5>
            <div className='members-list'>
                {members.map((member, index) => (
                    <div key={index} className="member-card">
                        <button className="peopleButton" onClick={() => handleClick(member)}>
                            {member.firstName} {member.lastName}
                        </button>
                    </div>
                ))}
            </div>

            {/* Pass the necessary props to LeaveGroupButton */}
            <LeaveGroupButton 
                userId={userId}  // Pass userId
                currentGroupId={currentGroupId}  // Pass currentGroupId
                onLeaveSuccess={onLeaveSuccess}  // Pass onLeaveSuccess callback
            />
        </div>
    );
}
