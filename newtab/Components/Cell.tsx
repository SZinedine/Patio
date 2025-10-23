import { ReactElement, useEffect, useRef, useState } from "react";
import { CellType } from "../Utils/Types";

export default function Cell(data: CellType): ReactElement {
    const [hovering, setHovering] = useState<boolean>(false);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const parentStyle = "p-0 cursor-pointer"  // hover:bg-slate-300 
    const linkStyle = "h-full w-full p-3"

    const openMenu = () => {
        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
        setHovering(true);
    };

    const scheduleClose = () => {
        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
        }
        hideTimerRef.current = setTimeout(() => {
            setHovering(false);
        }, 180);
    };

    useEffect(() => {
        return () => {
            if (hideTimerRef.current) {
                clearTimeout(hideTimerRef.current);
            }
        };
    }, []);

    const defaultCell = (data: CellType): ReactElement => {
        return <li className={`${parentStyle}`}>
            <a
                href={data.link}
                title={data.description || ""}
                className={linkStyle}
            >
                {data.title}
            </a>

        </li>
    }


    const CellMenu = (data: CellType): ReactElement => {
        return (
            <li
                className={`dropdown dropdown-right w-full ${parentStyle} ${hovering ? "dropdown-open" : ""}`}
                onMouseEnter={openMenu}
                onMouseLeave={scheduleClose}>
                <a
                    className={linkStyle}
                    href={data.link}
                    aria-expanded={hovering}>
                    {data.title}
                </a>
                <ul
                    className="dropdown-content menu bg-base-100 rounded-box z-9999 w-52 p-2 m-0 shadow-sm fixed"
                    onMouseEnter={openMenu}
                    onMouseLeave={scheduleClose}
                >
                    {data.children?.map((child: CellType) => <Cell {...child} />)}
                </ul>
            </li>
        );
    };


    return (data.children && data.children.length > 0)
        ? CellMenu(data)
        : defaultCell(data);
}
