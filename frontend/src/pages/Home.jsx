import { SendRequestButton } from "../components/SendRequest";
import { RequestsList } from "../components/RequestsReceived";

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
        </>
    );
}