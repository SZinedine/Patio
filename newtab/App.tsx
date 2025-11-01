import { ReactElement, RefObject, useEffect, useReducer, useRef, useState } from "react";
import { CellType, ListType, ThreadType } from "./Utils/Types";
import { fetchData, fetchSettings } from "./Utils/Data";
import Thread from "./Components/Thread";
import SettingsDialog from "./Dialogs/SettingsDialog";
import { FiMenu } from "react-icons/fi";
import ThreadAddingDialog from "./Dialogs/ThreadAddingDialog";
import ListAddingDialog from "./Dialogs/ListAddingDialog";
import CellAddingDialog from "./Dialogs/CellAddingDialog";
import Lock from "./Components/Lock";
import { LockContext } from "./Context/LockContext";
import { EntityContext } from "./Context/EntityContext";
import { applyThreadSettings } from "./Utils/SettingsUtils";
import { reducer } from "./state/reducer";
import { DialogContext, useDialogs } from "./Context/DialogContext";


export default function App(): ReactElement {
    const [data, dispatch] = useReducer(reducer, []);
    const [locked, setLocked] = useState<boolean>(false);

    // Dialogs state
    const [editingThread, setEditingThread] = useState<ThreadType | undefined>(undefined);
    const [editingList, setEditingList] = useState<ListType | undefined>(undefined);
    const [editingCell, setEditingCell] = useState<CellType | undefined>(undefined);
    const [listDialogThreadUuid, setListDialogThreadUuid] = useState<string | null>(null);
    const [cellDialogData, setCellDialogData] = useState<{ parentListUuid: string, parentCellUuid?: string } | undefined>(undefined);

    const listAddingDialogRef = useRef<HTMLDialogElement>(null);
    const threadAddingDialogRef = useRef<HTMLDialogElement>(null);
    const cellAddingDialogRef = useRef<HTMLDialogElement>(null);
    const settingsDialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        fetchData()
            .then((data_: ThreadType[]) => {
                dispatch({ type: 'SET_DATA', payload: data_ });
                setTimeout(() => document.body.classList.remove("no-anim"), 200);
            })
            .catch(err => console.error("Error fetching initial data:", err));
    }, []);

    useEffect(() => {
        const applySettingsForThreads = async () => {
            try {
                const settings = await fetchSettings();
                applyThreadSettings(settings);
            } catch (e) {
                console.error("Failed to apply settings:", e);
            }
        };

        if (data.length > 0) {
            applySettingsForThreads();
        }
    }, [data.length]);

    // use this for closing list and cell dialogs
    const handleListDialogClose = () => {
        setListDialogThreadUuid(null);
        setEditingList(undefined);
    };

    const handleCellDialogClose = () => {
        setCellDialogData(undefined);
        setEditingCell(undefined);
    }

    const handleThreadDialogClose = () => {
        setEditingThread(undefined);
    }

    const dialogContextValue = {
        showThreadDialog: (thread?: ThreadType) => {
            setEditingThread(thread);
            threadAddingDialogRef.current?.showModal();
        },

        showListDialog: (threadUuid: string, list?: ListType) => {
            setListDialogThreadUuid(threadUuid);
            setEditingList(list);
            listAddingDialogRef.current?.showModal();
        },

        showCellDialog: (parentListUuid: string, parentCellUuid?: string, cell?: CellType) => {
            setCellDialogData({ parentListUuid, parentCellUuid });
            setEditingCell(cell);
            cellAddingDialogRef.current?.showModal();
        }
    };

    const threads = data.map((tr: ThreadType) => (
        <Thread
            key={tr.uuid}
            {...tr}
        />
    ));

    const dialogs = (
        <>
            <SettingsDialog dialogRef={settingsDialogRef} />
            <ThreadAddingDialog
                thread={editingThread}
                onClose={handleThreadDialogClose}
                dialogRef={threadAddingDialogRef}
            />
            <ListAddingDialog
                threadUuid={listDialogThreadUuid}
                onClose={handleListDialogClose}
                list={editingList}
                dialogRef={listAddingDialogRef}
            />
            <CellAddingDialog
                cell={editingCell}
                cellDialogData={cellDialogData}
                onClose={handleCellDialogClose}
                dialogRef={cellAddingDialogRef}
            />
        </>
    );

    return <LockContext.Provider value={{ locked, setLocked }}>
        <EntityContext.Provider value={{ dispatch }}>
            <DialogContext.Provider value={dialogContextValue}>
                <div className="z-0 h-[90vh] w-[90vw]">
                    <div className="threads h-full w-full center flex flex-row justify-center p-3 gap-5">
                        {threads}
                    </div>
                </div>
                <div className="buttons float-end flex flex-col justify-between">
                    <HamburgerMenu
                        settingsDialogRef={settingsDialogRef} />
                    <Lock />
                </div>
                {dialogs}
            </DialogContext.Provider>
        </EntityContext.Provider>
    </LockContext.Provider>
}

type HamburgerMenuProps = {
    settingsDialogRef: RefObject<HTMLDialogElement | null>;
}

function HamburgerMenu({ settingsDialogRef }: HamburgerMenuProps) {
    const { showThreadDialog } = useDialogs();
    const showSettingDialog = () => {
        settingsDialogRef.current?.showModal()
    }

    const showThreadAddingDialog = () => {
        showThreadDialog();
    }

    return <div className="dropdown dropdown-left dropdown-start float-end h-1/3">
        <div tabIndex={0} role="button" className="m-1 p-2 cursor-pointer"><FiMenu size={22} className="menu-icon" /></div>
        <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li><button onClick={showSettingDialog}>Settings</button></li>
            <li><button onClick={showThreadAddingDialog}>Add New Thread</button></li>
        </ul>
    </div>
}
