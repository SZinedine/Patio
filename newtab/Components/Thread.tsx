import { ReactElement } from "react";
import { ListType, ThreadType } from "../Utils/Types";
import List from "./List";
import { GiSettingsKnobs } from "react-icons/gi";
import { useLock } from "../Context/LockContext";
import { useEntityContext } from "../Context/EntityContext";
import { useDialogs } from "../Context/DialogContext";
import { deleteThread } from "../Utils/Data";

export default function Thread({ ...data }: ThreadType): ReactElement {
    const lock = useLock();
    const { dispatch } = useEntityContext();
    const { showListDialog, showThreadDialog } = useDialogs();

    const onAddListClicked = () => {
        showListDialog(data.uuid);
    }

    const onDeleteThreadClicked = () => {
        const res = confirm(`Do you really want to remove the Thread '${data?.title}'? It will delete its containing lists.`);

        if (res) {
            dispatch({ type: 'DELETE_THREAD', payload: data.uuid });
            deleteThread(data.uuid)
                .catch(() => alert("Error. No thread have been deleted"));
        }
    }

    const onEditThreadClicked = () => {
        showThreadDialog(data);
    }

    return <>
        <div className="thread relative flex flex-col justify-start w-[300px] h-[95%]
                        shadow-xl hover:bg-base-200/80 bg-base-200/60 transition-colors duration-300 ease-in-out">
            <div className="thread-overlay blur absolute inset-0 backdrop-blur-lg -z-10"></div>
            <div className="thread-title text-primary-content text-center p-3 text-xl font-bold">
                {data?.title}
                <div className="dropdown dropdown-bottom float-right relative right-8 top-0">
                    {
                        !lock.locked &&
                        <div tabIndex={0} role="button" className="btn btn-sm btn-square border-none m-1 bg-base-200/40 hover:bg-base-300/80">
                            <GiSettingsKnobs size={18} />
                        </div>
                    }
                    <ul tabIndex={0} className="dropdown-content menu rounded-box\
                                    w-52 p-2 m-0 shadow-sm absolute z-50\
                                    bg-base-200/70 backdrop-blur-lg">
                        <li> <a className="p-3" onClick={onEditThreadClicked}> Edit Thread </a> </li>
                        <li> <a className="p-3" onClick={onAddListClicked} > Add a New List </a> </li>
                        <li> <a className="p-3 text-red-400" onClick={onDeleteThreadClicked} > Delete Thread </a> </li>
                    </ul>
                </div>
            </div>
            <div className="thread-content flex flex-col justify-start overflow-y-auto">
                {
                    data?.children.map((child: ListType) => {
                        return <List
                            key={child.uuid}
                            {...child} />
                    })
                }
            </div>
        </div>
    </>
}
