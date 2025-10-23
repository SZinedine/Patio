import { useState, useEffect } from "react";
import { createThread, ThreadType } from "./Utils/Types";
import { fetchData, insertThread } from "./Utils/Data";
import Thread from "./Components/Thread";
import AddThreadDialog from "./Dialogs/AddThreadDialog";
import Menu from "./Components/Menu";
import SettingsDialog from "./Dialogs/SettingsDialog";

export default function App() {
    const [data, setData] = useState<ThreadType[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const data = await fetchData();
            setData(data);
        })();
    }, []);


    const confirmAddThread = async (title: string) => {
        const newThread: ThreadType = createThread(title);
        const response = await insertThread(newThread);
        if (response.data === true) {
            setData([...data, newThread]);
        }
    };

    const menuData = [
        {
            name: "Settings",
            callback: () => setShowSettings(true)
        },
        {
            name: "Add New Thread",
            callback: () => setShowDialog(true)
        },
    ];

    return <>
        <div className="h-[90vh] w-full flex flex-row justify-center gap-[90px]">
            {
                data.map((thread: ThreadType) => <Thread key={thread.uuid} {...thread} />)
            }
        </div>
        <AddThreadDialog
            open={showDialog}
            onClose={() => setShowDialog(false)}
            onConfirm={confirmAddThread}
        />

        <SettingsDialog
            open={showSettings}
            onClose={() => setShowSettings(false)}
            onConfirm={() => setShowSettings(false)}
        />

        <Menu data={menuData} />
    </>
}
