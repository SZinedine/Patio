import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import { fetchData } from "../../newtab/Utils/Data";

function Settings() {
    const [data, setData] = useState<string>("");

    const fetch = async () => {
        const fetched = await fetchData();
        const res: string = JSON.stringify(fetched.data);
        setData(res);
    }

    useEffect(() => {
        fetch();
    }, []);


    return (<>
        <div> Settings </div>
        <textarea value={data} name="postContent" rows={40} cols={60} />

        <div className="buttons">
            <button onClick={() => alert("NOT IMPLEMENTED")}>Save</button>
            <button onClick={() => fetch()}>Reset</button>
        </div>

    </>);
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Settings />);
