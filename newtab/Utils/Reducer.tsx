import { CellType, ThreadType } from "../Utils/Types";
import { saveData } from "../Utils/Data";

export type Action =
    | { type: 'SET_DATA'; payload: ThreadType[] }
    | { type: 'ADD_THREAD'; payload: ThreadType }
    | { type: 'EDIT_THREAD'; payload: ThreadType }
    | { type: 'DELETE_THREAD'; payload: string } // payload is thread UUID
    | { type: 'REORDER_THREADS'; payload: { oldIndex: number; newIndex: number } }
    | { type: 'ADD_CELL'; payload: { threadUuid: string; cell: CellType } }
    | { type: 'EDIT_CELL'; payload: CellType }
    | { type: 'DELETE_CELL'; payload: string } // payload is cell UUID
    | { type: 'ADD_SUB_CELL'; payload: { parentCellUuid: string; cell: CellType } };


export function reducer(state: ThreadType[], action: Action): ThreadType[] {
    const persistState = (newState: ThreadType[]) => {
        void saveData(newState);
        return newState;
    };

    switch (action.type) {
        case 'SET_DATA':
            if (action.payload) {
                return action.payload;
            } else {
                throw new Error('SET_DATA payload is not defined');
            }

        case 'ADD_THREAD':
            return persistState([...state, action.payload]);

        case 'EDIT_THREAD':
            return persistState(state.map(thread =>
                thread.uuid === action.payload.uuid ? action.payload : thread
            ));

        case 'DELETE_THREAD':
            return persistState(state.filter(thread => thread.uuid !== action.payload));

        case 'REORDER_THREADS': {
            const { oldIndex, newIndex } = action.payload;
            if (
                oldIndex === newIndex ||
                oldIndex < 0 ||
                newIndex < 0 ||
                oldIndex >= state.length ||
                newIndex >= state.length
            ) {
                return state;
            }

            const reordered = [...state];
            const [moved] = reordered.splice(oldIndex, 1);
            reordered.splice(newIndex, 0, moved);
            return persistState(reordered);
        }

        case 'ADD_CELL': {
            const { threadUuid, cell } = action.payload;
            return persistState(state.map(thread =>
                thread.uuid === threadUuid
                    ? { ...thread, children: [...thread.children, cell] }
                    : thread
            ));
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

            return persistState(state.map(thread => ({
                ...thread,
                children: findAndEditCell(thread.children)
            })));
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

            return persistState(state.map(thread => ({
                ...thread,
                children: removeCell(thread.children || [])
            })));
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

            return persistState(state.map(thread => ({
                ...thread,
                children: findAndAddSubCell(thread.children)
            })));
        }

        default:
            return state;
    }
}
