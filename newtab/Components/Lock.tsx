import { FaLock, FaLockOpen } from "react-icons/fa6";
import { useLock } from "../Context/LockContext";
import { fetchSettings, saveSettings } from "../Utils/Data";
import { useEffect } from "react";

export default function Lock() {
    const { locked, setLocked } = useLock();

    useEffect(() => {
        fetchSettings()
            .then(settings => setLocked(Boolean(settings.locked)))
            .catch(_ => console.error("error while loading the lock status"));
    }, []);

    const clicked = () => {
        const newLocked = !locked;
        setLocked(newLocked);
        fetchSettings().then(async (settings) => {
            settings = { ...settings, locked: newLocked };
            await saveSettings(settings);
        });
    };

    return <button onClick={clicked} className="cursor-pointer m-1 p-2" title="Lock/unlock">
        {
            locked ? <FaLock size={15} /> : <FaLockOpen size={15} />
        }
    </button>
}
