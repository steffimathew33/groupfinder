import { CreateGroup } from "../components/CreateGroup"
import { SendRequestButton } from "../components/SendRequest";
import { RequestsList } from "../components/RequestsReceived";

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
            <RequestsList />
            </div>
        </>
    );
}