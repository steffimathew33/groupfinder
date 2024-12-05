import './MyGroup.css';
import { getUser} from "../api"
import { getGroup } from "../api";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { updateGroup, updateUser } from "../api"


export function MyGroup() {
    const [originalGroup, setOriginalGroup] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [group, setGroup] = useState(null); // State to store group data
    const [error, setError] = useState(null); // State to handle any error
    const [members, setMembers] = useState([]);
    useEffect(() => {
        async function loadUserGroup() {
            const token = sessionStorage.getItem("User");
            if (token) {
                const decodedUser = jwtDecode(token);
                setCurrentUser(decodedUser);
                const groupId = decodedUser.inGroup;

                if (groupId != null) {
                    try {
                        // Fetch the group data based on groupId
                        const groupData = await getGroup(groupId);
                        setOriginalGroup(groupData);
                        setGroup(groupData); // Set the fetched group data

                        const memberDetails = await Promise.all(
                            groupData.members.map(async (memberId) => {
                                const memberData = await getUser(memberId);
                                return memberData;
                            })
                        )
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
    }, []); // Empty dependency array ensures this runs only once when the component mounts

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

    const leaveGroup = async () => {
        const updatedUser = {
            ...currentUser,
            inGroup: null,
        }

        try {
            let userResult = await updateUser(currentUser._id, updatedUser);
            if (userResult.status === 200) {
                console.log("user data updated successfully");
            }

            const updatedGroup = {
                ...originalGroup,
                members: originalGroup.members.filter((memberId) => memberId !== currentUser._id),
            };

            let groupResult = await updateGroup(originalGroup._id,updatedGroup);
            
            if (groupResult.status === 200) {
                console.log("group updated");
            }

            } catch (err) {
                console.error("error while leaving group")
            }
    }
    
    return (

        <div className="my-group">
            <h1 style={{ textDecoration: 'underline'}}> My Group</h1>
            <h2>{group.groupName || "No Group"}</h2> {/* Display the group name */}
            <h3>Group Size: {group.maxPeople}</h3>
            <h4>
                Current Members: {group.members.length} 
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                Members Needed: {group.maxPeople - group.members.length}
            </h4>
            
            <div className="group-info">
                <p>Group Description: {group.description || "" }</p>  {/*Display group description */}
                <p>Project Name: {group.projectTitle || "Untitled"}</p>
            </div>
            
            <h5> Members</h5>
            <div className='members-list'>
            {members.map((member, index) => (
                    <div key={index} className="member-card">
                        <button className="peopleButton"onClick={() => handleClick(member)}>
                            {member.firstName} {member.lastName}
                        </button>
                    </div> 
                ))}
            <button className="leaveGroup"onClick={() => handleClick(leaveGroup)}>
                Leave Group
            </button>
            </div>
        </div>
        
    );
}

