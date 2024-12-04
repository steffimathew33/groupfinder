import { CreateGroup } from "../components/CreateGroup"
import { SendRequestButton } from "../components/SendRequest";
import { RequestsList } from "../components/RequestsReceived";
import { SearchBar } from "../components/SearchBar";

export function Home() {
    return (
        <>
            <div>
            <h1>Test Group Request</h1>
            <SendRequestButton />
            </div>
            <div>
            <RequestsList />
            </div>
            <div>
            <SearchBar />
            </div>
            <div className="create-group">
                <CreateGroup />
            </div>
            
        </>
    );
}