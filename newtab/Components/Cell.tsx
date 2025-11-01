import { MouseEvent, ReactElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CellType } from "../Utils/Types";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { useEntityContext } from "../Context/EntityContext";
import { useLock } from "../Context/LockContext";
import { createPortal } from "react-dom";
import { useDialogs } from "../Context/DialogContext";
import { deleteCell } from "../Utils/Data";

const baseCellClasses = "cell flex flex-col justify-center group";
const cellLinkClasses = "cell-link block w-full h-full p-2.5";

type CellProps = CellType & {
    parentListUuid: string;     // UUID of parent list
    parentCell?: string;    // if defined, it's a subcell
}

export default function Cell({ parentListUuid, parentCell, ...data }: CellProps): ReactElement {
    return (data.children && data.children.length > 0) ?
        <MenuCell {...data} parentCell={parentCell} parentListUuid={parentListUuid} /> :
        <RegularCell {...data} parentCell={parentCell} parentListUuid={parentListUuid} />
}


function RegularCell({ parentListUuid, parentCell, ...data }: CellProps): ReactElement {
    const lock = useLock();
    return <>
        <li
            className={`${baseCellClasses} z-30 relative`}
            title={data.description || data.link || ""}>
            <a
                className={cellLinkClasses}
                href={data.link}
                rel="noopener noreferrer">
                {data.title}
            </a>
            {!lock.locked && <HoverButtons {...data} parentListUuid={parentListUuid} parentCell={parentCell} />}
        </li>
    </>
}


function MenuCell({ parentListUuid, parentCell, ...data }: CellProps): ReactElement {
    const [menuPos, setMenuPos] = useState<{ top: number, left: number } | null>(null);
    const [hideTimeoutId, setHideTimeoutId] = useState<number | null>(null); // New state for timeout ID
    const cellRef = useRef<HTMLLIElement>(null);    // holds the hovered Cell
    const lock = useLock();

    useEffect(() => {
        return () => {
            if (hideTimeoutId) {
                clearTimeout(hideTimeoutId);
            }
        };
    }, [hideTimeoutId]);

    const handleMouseEnter = () => {
        // Clear any pending hide timeouts when entering the cell (or re-entering)
        if (hideTimeoutId) {
            clearTimeout(hideTimeoutId);
            setHideTimeoutId(null);
        }

        if (cellRef.current) {
            const rect = cellRef.current.getBoundingClientRect();

            setMenuPos({    // Set position immediately on mouse enter
                top: rect.top,
                left: rect.right + 8,
            });
        }
    };

    const handleMenuDelayHide = () => {
        const id = window.setTimeout(() => {
            setMenuPos(null);
            setHideTimeoutId(null);
        }, 200);

        setHideTimeoutId(id);
    };

    const handleMenuCancelHide = () => {
        // Clear the hide timeout if the mouse enters the menu itself
        if (hideTimeoutId) {
            clearTimeout(hideTimeoutId);
            setHideTimeoutId(null);
        }
    };


    return <li
        ref={cellRef}
        className={`${baseCellClasses} relative`}
        onMouseLeave={handleMenuDelayHide}
        onMouseEnter={handleMouseEnter}
        title={data.description || data.link || ""}>
        <a
            className={cellLinkClasses}
            href={data.link}
            rel="noopener noreferrer">
            {data.title}
        </a>

        {!lock.locked && <HoverButtons {...data} parentListUuid={parentListUuid} parentCell={parentCell} />}

        {menuPos && (
            <ul
                onMouseEnter={handleMenuCancelHide}
                onMouseLeave={handleMenuDelayHide}
                style={{ top: menuPos.top, left: menuPos.left }}
                className="fixed min-w-[250px] \
                            flex flex-col gap-1 p-2 rounded-md \
                            bg-base-200/70 backdrop-blur-lg \
                            shadow-xl z-[9999]" >
                {
                    data.children?.map((child: CellType) => (
                        <Cell
                            key={child?.uuid || child.title}
                            {...child}
                            parentListUuid={parentListUuid}
                            parentCell={data.uuid}
                        />
                    ))
                }
            </ul>
        )}
    </li>
}


function HoverButtons({ parentListUuid, parentCell, ...data }: CellProps) {
    const [open, setOpen] = useState(false);
    const { dispatch } = useEntityContext();
    const { showCellDialog } = useDialogs();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [pos, setPos] = useState({ top: 0, left: 0 });

    const onButtonClick = () => setOpen(prev => !prev);

    const stop = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const edit = (e: MouseEvent) => {
        stop(e);
        showCellDialog(parentListUuid, parentCell, data);
    }

    const add = (e: MouseEvent) => {
        stop(e);
        showCellDialog(parentListUuid, data.uuid);
    }

    const del = (e: MouseEvent) => {
        stop(e);
        if (confirm(`Do you really want to remove the Cell "${data.title}" ?`)) {
            dispatch({ type: 'DELETE_CELL', payload: data.uuid });
            deleteCell(data.uuid);
        }
    }

    useLayoutEffect(() => {
        if (open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPos({ top: rect.bottom - 50, left: rect.left - 170 });
        }
    }, [open]);


    const buttonClass = "w-full bg-base-200";
    const menu = (
        <ul
            className="w-[200px] fixed z-50 menu p-1"
            style={{ top: pos.top - 10, left: pos.left }}
            onMouseLeave={() => setOpen(false)}>

            <li onClick={edit} className={buttonClass}>
                <a className="w-full h-full p-3"><FiEdit size={14} /> Edit Cell</a>

            </li>

            {!parentCell &&
                <li onClick={add} className={buttonClass}>
                    <a className="w-full h-full p-3"><FiPlus size={14} /> Add Sub Cell</a>
                </li>
            }

            <li onClick={del} className={buttonClass}>
                <a className="w-full h-full p-3 text-error"><FiTrash2 size={14} /> Delete Cell</a>
            </li>

        </ul>
    );

    return (
        <div className="absolute p-0 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button ref={buttonRef} onClick={onButtonClick} className="btn btn-square">+</button>
            {
                open && createPortal(menu, document.body)
            }
        </div>
    );
}

