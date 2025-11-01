import { CellType, ListType, ThreadType } from "../Utils/Types";

export type Action =
    | { type: 'SET_DATA'; payload: ThreadType[] }
    | { type: 'ADD_THREAD'; payload: ThreadType }
    | { type: 'EDIT_THREAD'; payload: ThreadType }
    | { type: 'DELETE_THREAD'; payload: string } // payload is thread UUID
    | { type: 'ADD_LIST'; payload: { threadUuid: string; list: ListType } }
    | { type: 'EDIT_LIST'; payload: ListType }
    | { type: 'DELETE_LIST'; payload: string } // payload is list UUID
    | { type: 'ADD_CELL'; payload: { listUuid: string; cell: CellType } }
    | { type: 'EDIT_CELL'; payload: CellType }
    | { type: 'DELETE_CELL'; payload: string } // payload is cell UUID
    | { type: 'ADD_SUB_CELL'; payload: { parentCellUuid: string; cell: CellType } };


export function reducer(state: ThreadType[], action: Action): ThreadType[] {
    switch (action.type) {
        case 'SET_DATA':
            return action.payload;

        case 'ADD_THREAD':
            return [...state, action.payload];

        case 'EDIT_THREAD':
            return state.map(thread =>
                thread.uuid === action.payload.uuid ? action.payload : thread
            );

        case 'DELETE_THREAD':
            return state.filter(thread => thread.uuid !== action.payload);

        case 'ADD_LIST':
            return state.map(thread =>
                thread.uuid === action.payload.threadUuid
                    ? { ...thread, children: [...thread.children, action.payload.list] }
                    : thread
            );

        case 'EDIT_LIST':
            return state.map(thread => ({
                ...thread,
                children: thread.children.map(list =>
                    list.uuid === action.payload.uuid ? action.payload : list
                )
            }));

        case 'DELETE_LIST':
            return state.map(thread => ({
                ...thread,
                children: thread.children.filter(list => list.uuid !== action.payload)
            }));

        case 'ADD_CELL': {
            const { listUuid, cell } = action.payload;
            return state.map(thread => ({
                ...thread,
                children: thread.children.map(list =>
                    list.uuid === listUuid
                        ? { ...list, children: [...list.children, cell] }
                        : list
                )
            }));
        }

        case 'EDIT_CELL': {
            const newCell = action.payload;
            const findAndEditCell = (cells: CellType[]): CellType[] => {
                return cells.map(cell => {
                    if (cell.uuid === newCell.uuid) {
                        return newCell;
                    }
                    if (cell.children && cell.children.length > 0) {
                        return { ...cell, children: findAndEditCell(cell.children) };
                    }
                    return cell;
                });
            };

            return state.map(thread => ({
                ...thread,
                children: thread.children.map(list => ({
                    ...list,
                    children: findAndEditCell(list.children)
                }))
            }));
        }

        case 'DELETE_CELL': {
            const cellUuid = action.payload;
            const removeCell = (cells: CellType[]): CellType[] => {
                return cells
                    .filter(cell => cell.uuid !== cellUuid)
                    .map(cell => ({
                        ...cell,
                        children: removeCell(cell.children || [])
                    }));
            };

            return state.map(thread => ({
                ...thread,
                children: thread.children.map(list => ({
                    ...list,
                    children: removeCell(list.children || [])
                }))
            }));
        }

        case 'ADD_SUB_CELL': {
            const { parentCellUuid, cell: newCell } = action.payload;
            const findAndAddSubCell = (cells: CellType[]): CellType[] => {
                return cells.map(cell => {
                    if (cell.uuid === parentCellUuid) {
                        return { ...cell, children: [...(cell.children || []), newCell] };
                    }
                    if (cell.children && cell.children.length > 0) {
                        return { ...cell, children: findAndAddSubCell(cell.children) };
                    }
                    return cell;
                });
            };

            return state.map(thread => ({
                ...thread,
                children: thread.children.map(list => ({
                    ...list,
                    children: findAndAddSubCell(list.children)
                }))
            }));
        }

        default:
            return state;
    }
}
