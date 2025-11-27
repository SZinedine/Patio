import { FaLock, FaLockOpen } from "react-icons/fa6";
import { useLock } from "../Context/LockContext";
import { fetchSettings, saveSettings } from "../Utils/Data";
import { useEffect } from "react";

export default function Lock() {
    const { locked, setLocked } = useLock();

    useEffect(() => {
        fetchSettings()
            .then(settings => setLocked(Boolean(settings.locked)))
            .catch(() => console.error("error while loading the lock status"));
    }, []);

    const clicked = () => {
        const newLocked = !locked;
        setLocked(newLocked);
        fetchSettings().then(async (settings) => {
            settings = { ...settings, locked: newLocked };
            await saveSettings(settings);
        });
    };

    return <button onClick={clicked}
        className="fixed bottom-4 right-4 p-2.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80
                   hover:text-white backdrop-blur-md border border-white/10
                   transition-all hover:scale-105 active:scale-95"
        title="Lock/unlock">
        {
            locked ? <FaLock size={20} /> : <FaLockOpen size={20} />
        }
    </button>
}
