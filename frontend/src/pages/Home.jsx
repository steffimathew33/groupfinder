import { CreateGroup } from "../components/CreateGroup"
import './CSS_Files/CreateGroup.css'; // Assuming your CSS is in this file

export function Home() {
    return (
        <>
            <div className="create-group">
                <CreateGroup />
            </div>
        </>
    );
}