import './MyGroup.css';
import { getUser} from "../api"
import { getGroup } from "../api";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export function MyGroup() {
    const [group, setGroup] = useState(null); // State to store group data
    const [error, setError] = useState(null); 
    const [members, setMembers] = useState([]);
    useEffect(() => {
        async function loadUserGroup() {
            const token = sessionStorage.getItem("User");
            if (token) {
                const decodedUser = jwtDecode(token);
                const groupId = decodedUser.inGroup;

                if (groupId != null) {
                    try {
                        // Fetch group data based on ID
                        const groupData = await getGroup(groupId);
                        setGroup(groupData); // Set fetched group data

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
                    setGroup("No Group"); // If user is not in a group, set state to "No Group"
                }
            }
        }
        loadUserGroup();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!group) {
        return <div>Loading...</div>;
    }

    const handleClick = (member) => {
        setMembers(member);
    }

    const membersCount = group.members?.length || 0; 
    const membersNeeded = group.maxPeople - membersCount || 0; 

    return (
        <div className="my-group">
            <h1 style={{ textDecoration: 'underline'}}> My Group</h1>
            <h2>{group.groupName || "No Group"}</h2> {}
            <h3>Group Size: {group.maxPeople}</h3>
            <h4>
                Current Members: {membersCount} 
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                Members Needed: {membersNeeded}
            </h4>
            
            <div className="group-info">
                <p>Group Description: {group.description || "" }</p>  {}
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
            </div>
        </div>
        
    );
}

