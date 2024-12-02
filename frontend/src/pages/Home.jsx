import { CreateGroup } from "../components/CreateGroup"
import { SendRequestButton } from "../components/SendRequest";
import './CSS_Files/CreateGroup.css';

export function Home() {
    return (
        <>
            <div className="create-group">
                <CreateGroup />
            </div>
            <div>
            <h1>Test Group Request</h1>
            <SendRequestButton />
            </div>
        </>
    );
}