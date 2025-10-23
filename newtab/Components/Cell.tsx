import { CellType } from "../Utils/Types";

export default function Cell(data: CellType) {
    const click = () => window.location.href = data.link;

    return <li
        className="cell"
        onClick={click}
        key={data.description}
    >
        {data.title}
    </li>
}
