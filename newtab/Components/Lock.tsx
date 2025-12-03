import { FaLock, FaLockOpen } from "react-icons/fa6";
import { useLock } from "../Context/LockContext";

export default function Lock() {
    const { locked, setLocked } = useLock();

    const clicked = () => {
        const newLocked = !locked;
        setLocked(newLocked);
    };

    return <button onClick={clicked}
        className="fixed bottom-4 right-4 p-2.5 rounded-lg bg-white/5 hover:bg-white/20
                   text-white backdrop-blur-md border border-white/20
                   transition-all hover:scale-105 active:scale-95"
        title="Lock/unlock">
        {
            locked ? <FaLock size={20} /> : <FaLockOpen size={20} />
        }
    </button>
}
