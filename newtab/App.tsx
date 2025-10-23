import { useState, useEffect } from "react";
import { ThreadType } from "./Utils/Types";
import { fetchData } from "./Utils/Data";
import Thread from "./Components/Thread";

export default function App() {
    const [data, setData] = useState<ThreadType[]>();

    useEffect(() => {
        (async () => {
            const fetched = await fetchData();
            const res: ThreadType[] = fetched.data;
            console.log(res);
            setData(res);
        })();
    }, []);

    return <> {
        data ?
            data.map((th: ThreadType) => <Thread {...th} />) :
            <div>Loading...</div>
    }</>
}
