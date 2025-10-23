import { ReactElement, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { ThreadType, ListType, createList } from "../Utils/Types";
import List from "./List";
import AddListDialog from "../Dialogs/AddListDialog";
import { insertList } from "../Utils/Data";

export default function Thread(data: ThreadType): ReactElement {
    const [lists, setLists] = useState<ListType[]>([]);
    const [showAddListDialog, setShowAddListDialog] = useState<boolean>(false);

    const handleConfirmAddingList = async (title: string) => {
        const newList: ListType = createList(title);
        const response = await insertList(data.uuid, newList);
        if (response.data === true) {
            setLists([...lists, newList]);
        }
    };

    useEffect(() => {
        setLists(data.children);
    }, []);

    return (
        <>
            <ul className="menu block rounded-box w-60 ease-in-out duration-400\
                bg-base-200/60 hover:backdrop-blur-3xl backdrop-blur-lg hover:bg-base-200/80 \
                ">
                <li className="font-extrabold text-lg text-center">
                    <button
                        onClick={() => setShowAddListDialog(true)}
                        className="btn btn-square m-0 h-[30px] w-[30px] float-right absolute right-0 top-0 flex items-center"
                        title="Add a List">
                        <FiPlus size={18} />
                    </button>
                    {data.title}
                </li>
                <div className="overflow-auto relative max-h-[95%]">
                    <div className="overflow-y-auto overflow-x-hidden max-h-full">
                        {
                            lists.map((list: ListType) => <List key={data.uuid} {...list} />)
                        }
                    </div>
                </div>
            </ul>

            <AddListDialog
                open={showAddListDialog}
                onClose={() => setShowAddListDialog(false)}
                onConfirm={handleConfirmAddingList}
            />
        </>
    );
}
