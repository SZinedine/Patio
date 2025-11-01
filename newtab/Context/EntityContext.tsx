import { createContext, Dispatch, useContext } from "react";
import { Action } from "../state/reducer";

export type EntityContexttType = {
    dispatch: Dispatch<Action>;
}

export const EntityContext = createContext<EntityContexttType | undefined>(undefined);

/**
 * Return functions to add/delete threads, lists, and cells
 */
export function useEntityContext(): EntityContexttType {
    const ctx = useContext(EntityContext);
    if (!ctx) {
        throw new Error("useEntityContext must be used within a EntityContext.Provider");
    }
    return ctx;
}
