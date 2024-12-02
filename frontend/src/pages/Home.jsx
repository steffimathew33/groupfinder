import { CreateGroup } from "../components/CreateGroup"
import { SendRequestButton } from "../components/SendRequest";
import { RequestsList } from "../components/RequestsReceived";
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
            <div>
            <h2>Test Group Request</h2>
            <RequestsList />
            </div>
        </>
    );
}