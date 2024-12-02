import { createGroup } from "../api"
import { useState } from "react"

export function CreateGroup() {

    const [group, setGroup] = useState({
        groupName: "",       // Group name field
        description: "",     // Description of the group
        createdBy: "",       // User ID or name of the creator (if needed for display)
        projectTitle: "",    // Project title
        tags: "",            // Tags, can be a comma-separated string or array
        isFull: false        // Boolean to indicate if the group is full (default false)
    });

    const handleChange = (e) => {
        setGroup({ ...group, [e.target.name]: e.target.value });
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
                type="text"
                name="tags"
                placeholder="Tags (comma-separated)"
                value={group.tags}
                onChange={handleChange}
            />
            <button type="submit">Create Group</button>
        </form>
    );
}