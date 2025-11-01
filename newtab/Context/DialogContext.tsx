import { createContext, useContext } from 'react';
import { CellType, ListType, ThreadType } from '../Utils/Types';

export type DialogContextType = {
    showThreadDialog: (thread?: ThreadType) => void;
    showListDialog: (threadUuid: string, list?: ListType) => void;
    showCellDialog: (parentListUuid: string, parentCellUuid?: string, cell?: CellType) => void;
};

export const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function useDialogs(): DialogContextType {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialogs must be used within a DialogProvider');
    }
    return context;
}
