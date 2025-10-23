import { ReactElement } from "react";
import { FiMenu } from "react-icons/fi";


type MenuAction = {
    name: string,
    callback: () => void;
}

type MenuProps = {
    data: MenuAction[]
};


export default function Menu({ data }: MenuProps): ReactElement {

    return <>
        <div className="dropdown dropdown-left dropdown-start">
            <div tabIndex={0} role="button" className="m-1 p-2 cursor-pointer"><FiMenu size={22} className="menu-icon" /></div>
            <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                {
                    data.map((m: MenuAction) => <li><button onClick={m.callback}>{m.name}</button></li>)
                }
            </ul>
        </div>
    </>
}

