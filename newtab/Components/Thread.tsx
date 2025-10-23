import { ThreadType, ListType } from "../Utils/Types";
import List from "./List";

export default function Thread(data: ThreadType) {
    return (
        <div className="thread">
            <div className="thread-title">some thread</div>
            <div className="thread-content">
                {
                    data.children.map((list: ListType) => <List {...list} />)
                }
            </div>
        </div>
    );
}
