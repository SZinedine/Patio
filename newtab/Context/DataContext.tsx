import { createContext, Dispatch, useContext } from "react";
import { Action } from "../Utils/Reducer";

export type DataContextType = {
    dispatch: Dispatch<Action>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * Return functions to add/delete threads, lists, and cells
 */
export function useDataContext(): DataContextType {
    const ctx = useContext(DataContext);
    if (!ctx) {
        throw new Error("useDataContext must be used within a DataContext.Provider");
    }
    return ctx;
}

