import { useEffect, useState } from "react";
import { CellType, ListType } from "../Utils/Types";
import Cell from "./Cell";

const STORAGE_LIST_KEY = "list_expanded";

export default function List(data: ListType) {

    const [expandedLists, setExpandedLists] = useState<string[]>([]);

    const toggle = (uuid: string) => {
        console.log("toggle()")
        const contains = expandedLists.includes(uuid);
        const lst = contains ? expandedLists.filter((u) => u !== uuid) : [...expandedLists, uuid];
        setExpandedLists(lst);
        localStorage.setItem(STORAGE_LIST_KEY, JSON.stringify(lst));
    };

    // save/retrieve expanded lists
    useEffect(() => {
        const lst = localStorage.getItem(STORAGE_LIST_KEY);
        if (lst)
            setExpandedLists(JSON.parse(lst));
    }, []);


    return <ul key={data.uuid} className="list">
        <li>
            <details open={expandedLists.includes(data.uuid)} onToggle={() => toggle(data.uuid)}>
                <summary className="list-title">{data.title}</summary>
                <ul className="cells">
                    {
                        data.children.map((c: CellType) => <Cell {...c} />)
                    }
                </ul>
            </details>
        </li>
    </ul>


    // return <ul key={data.uuid} className="list">
    //     <summary className="list-title">{data.title}</summary>
    //     <details className={`list-content ${ready ? "ready" : ""} ${expandedLists.includes(data.uuid) ? "expanded" : ""}`}  onToggle={() => toggle(data.uuid)}>
    //         {
    //             // expandedLists.includes(data.uuid) &&
    //             data.children.map((c: CellType) => <Cell {...c} />)
    //         }
    //     </details>
    // </ul>
}
