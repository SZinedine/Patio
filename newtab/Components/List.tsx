import { ReactElement, useEffect, useRef, useState } from "react";
import { CellType, createCell, ListType } from "../Utils/Types";
import Cell from "./Cell";
import AddCellDialog from "../Dialogs/AddCellDialog";
import { insertCell } from "../Utils/Data";
import { FiPlus } from "react-icons/fi";
const STORAGE_LIST_KEY = "list_expanded";

export default function List(data: ListType): ReactElement {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [cells, setCells] = useState<CellType[]>([]);
    const ref = useRef<HTMLDetailsElement>(null);

    const toggle = () => {
        if (!ref.current) {
            return;
        }

        const isOpen = ref.current.open;

        chrome.storage.local.get([STORAGE_LIST_KEY], (res) => {
            let uuidArray: string[] = res[STORAGE_LIST_KEY] || [];

            if (isOpen) {
                uuidArray = [...new Set([...uuidArray, data.uuid])];
            } else {
                uuidArray = uuidArray.filter(u => u !== data.uuid);
            }

            chrome.storage.local.set({ [STORAGE_LIST_KEY]: uuidArray });
            setExpanded(isOpen);
        });
    };

    useEffect(() => {
        setCells(data.children);
        chrome.storage.local.get([STORAGE_LIST_KEY], (res) => {
            const lst: string[] = res[STORAGE_LIST_KEY] || [];
            setExpanded(lst.includes(data.uuid));
        });
    }, []);

    const handleConfirm = async (title: string, link: string, description: string) => {
        const newCell: CellType = createCell(title, link, description);
        const response = await insertCell(data.uuid, newCell);
        if (response.data === true) {
            setCells([...cells, newCell]);
        }
    };

    return <>
        <li>
            <button
                onClick={() => setShowDialog(true)}
                className="btn btn-square float-right absolute h-[30px] w-[30px] right-9 top-3 border-none flex items-center"
                title="Add a Cell">
                <FiPlus size={18} />
            </button>
            <details ref={ref} open={expanded} onToggle={toggle}>
                <summary className="font-bold p-4">{data.title}</summary>
                <ul>
                    {
                        cells.map((c: CellType) => (
                            <Cell key={c.uuid || c.description || c.link} {...c} />
                        ))
                    }
                </ul>
            </details>
        </li>

        <AddCellDialog
            open={showDialog}
            onClose={() => setShowDialog(false)}
            onConfirm={handleConfirm} />
    </>
}
