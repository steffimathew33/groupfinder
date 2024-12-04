import { createGroup, updateUser } from "../api"
import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode";

export function CreateGroup() {
    

    const [group, setGroup] = useState({
        groupName: "",
        description: "",
        createdBy: "",
        projectTitle: "",
        tags: [],
        maxPeople: "",
        isFull: false
    });
<<<<<<< HEAD
    const [userData, setUserData] = useState(null);
=======
    const [userData, setUserData] = useState({});
>>>>>>> 75926860bea16422cbfb012e320771becaff53a7

    useEffect(() => {
        async function loadCreatorData() {
            try {
                const token = sessionStorage.getItem("User");
                if (token) {
                    const decodedUser = jwtDecode(token);
                    setUserData(decodedUser);
                    setGroup((prevData) => ({...prevData, createdBy: decodedUser._id}));
                    setUserData(decodedUser);
                }
            } catch (error) {
                alert("Could not verify creator data.")
            }
            
        }
        loadCreatorData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Check if the name is "tags" to handle it as an array
        if (name === "tags") {
            // Split the value by commas and trim any spaces around each tag
            setGroup({...group, [name]: value.split(",").map(tag => tag.trim())});
        } else if (name === "maxPeople") {
            const maxPeople = value === "" ? 0 : parseInt(value, 10);
            setGroup((prevGroup) => ({...prevGroup, [name]: maxPeople}));
        } else {
            setGroup({...group, [name]: value});
        }

        //Check if group is now full
        setGroup((prevGroup) => ({...prevGroup, isFull: prevGroup.members?.length >= prevGroup.maxPeople}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let response = await createGroup(group);
        if (response.status !== 200) {
            alert("Account could not be created.");
        }
        const groupId = response.data._id;
<<<<<<< HEAD
        
        const updatedUser = {
            ...userData,  // Spread the entire user data
            inGroup: groupId  // Modify only the `inGroup` field (group in this case)
        };
        // Update the user's inGroup field with the newly created group ID
        let userUpdateResponse = await updateUser(userData._id, updatedUser);
        
        if (userUpdateResponse.status === 200) {
            console.log("User's inGroup updated successfully");
        } else {
            console.log("Failed to update user's inGroup");
        }
=======
        console.log(groupId);
        const updatedUser = {
            ...userData,
            inGroup: groupId,
        }
        let updatedUserResponse = await updateUser(userData._id, updatedUser)
        if (updatedUserResponse.status === 200) {
            console.log("User inGroup updated successfully")
        }

>>>>>>> 75926860bea16422cbfb012e320771becaff53a7
        console.log(group);
    };

    return (
        <div className="group-container">
            <div className="group-input">
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="groupName"
                placeholder="Group Name"
                value={group.groupName}
                onChange={handleChange}
            />
            <input
                type="text"
                name="description"
                placeholder="Description"
                value={group.description}
                onChange={handleChange}
            />
            <input
                type="text"
                name="projectTitle"
                placeholder="Project Title"
                value={group.projectTitle}
                onChange={handleChange}
            />
            <input
                type="number"
                name="maxPeople"
                placeholder="Max Group Size"
                value={group.maxPeople}
                onChange={handleChange}
            />
            <input
                type="text"
                name="tags"
                placeholder="Tags (comma-separated)"
                value={group.tags.join(", ")}
                onChange={handleChange}
            />
            <button type="submit">Create Group</button>
        </form>
        </div>
        </div>
    );
}