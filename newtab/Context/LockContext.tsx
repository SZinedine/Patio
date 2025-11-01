import { createContext, useContext, Dispatch, SetStateAction } from "react";

export type LockContextType = {
    locked: boolean;
    setLocked: Dispatch<SetStateAction<boolean>>;
};

export const LockContext = createContext<LockContextType | undefined>(undefined);

export function useLock(): LockContextType {
    const ctx = useContext(LockContext);
    if (!ctx) {
        throw new Error("useLock must be used within a LockContext.Provider");
    }
    return ctx;
}

