import { createGroup } from "../api"
import { useState } from "react"

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

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Check if the name is "tags" to handle it as an array
        if (name === "tags") {
            // Split the value by commas and trim any spaces around each tag
            setGroup({...group, [name]: value.split(",").map(tag => tag.trim())});
        } else if (name === "maxPeople") {
            setGroup({...group, [name]: value === "" ? 0 : parseInt(value, 10) // Automatically parse to integer, default to 0 if empty
            });
        } else {
            setGroup({...group, [name]: value});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let response = await createGroup(group);
        if (response.status !== 200) {
            alert("Account could not be created.");
        }
        console.log(group);
    };

    return (
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
    );
}