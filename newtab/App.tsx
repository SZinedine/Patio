import { useState, useEffect, useReducer, useRef } from 'react';
import { Thread } from './Components/Thread';
import { Settings as SettingsIcon, Plus, LayoutGrid, Loader } from 'lucide-react';
import { CellType, createThread, SettingsType, ThreadType } from './Utils/Types';
import { fetchData, fetchSettings, saveData, saveSettings } from './Utils/Data';
import { CellModal, CellModalModeType } from './Modals/CellModal';
import { SettingsModal } from './Modals/SettingsModal';
import Lock from './Components/Lock';
import { LockContext } from "./Context/LockContext";
import { reducer } from './Utils/Reducer';
import { DataContext } from './Context/DataContext';
import Sortable from 'sortablejs';
import { applyBackgroundDataUrl, loadAndApplyBackground } from './Utils/SettingsUtils';
import { backupBundleToBlob, buildBackupBundle, parseBackupFile } from './Utils/Backup';


const Browser = typeof browser !== "undefined" ? browser : chrome;

export default function App() {
    // Application State
    const [data, dispatch] = useReducer(reducer, []);
    const [settings, setSettings] = useState<SettingsType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [locked, setLocked] = useState<boolean>(true);
    const threadsRef = useRef(null);
    const sortable = useRef<Sortable | null>(null);

    // Modal State
    const [openSettingsModal, setOpenSettingsModal] = useState(false);
    const [targetThreadId, setTargetThreadId] = useState<string | null>(null);
    const [cellModalMode, setCellModalMode] = useState<CellModalModeType>("");
    const [cellToEdit, setCellToEdit] = useState<CellType | null>(null);
    const [parentCell, setParentCell] = useState<string | null>(null);

    // Initialization
    useEffect(() => {
        const init = async () => {
            try {
                const [data_, settings_] = await Promise.all([
                    fetchData(),
                    fetchSettings()
                ]);
                dispatch({ type: 'SET_DATA', payload: data_ });
                const loadedSettings = settings_ && typeof settings_.locked === "boolean"
                    ? settings_
                    : { locked: false };

                setSettings(loadedSettings);
                setLocked(Boolean(loadedSettings.locked));
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, []);


    // Storage Change Listener to prevent multiple tabs desync
    useEffect(() => {
        function handleChange(
            changes: { [key: string]: chrome.storage.StorageChange },
            area: string
        ) {
            if (area === "local" && changes.data) {
                const newData = changes.data.newValue;
                if (newData) {
                    dispatch({ type: 'SET_DATA', payload: newData });
                }
            }
        }

        Browser.storage.onChanged.addListener(handleChange);
        return () => Browser.storage.onChanged.removeListener(handleChange);
    }, []);

    useEffect(() => {
        if (!isLoading && settings) {
            saveSettings(settings);
        }
    }, [settings, isLoading]);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        setSettings((prev) => {
            const current = prev ?? { locked };
            if (current.locked === locked) {
                return current;
            }
            return { ...current, locked };
        });
    }, [locked, isLoading]);

    // Ensure modals reset state on close
    useEffect(() => {
        if (cellModalMode === "") {
            setTargetThreadId(null);
            setCellToEdit(null);
        }
    }, [cellModalMode]);

    useEffect(() => {
        if (!threadsRef.current) {
            return;
        }

        sortable.current = Sortable.create(threadsRef.current, {
            animation: 250,
            delay: 40,
            ghostClass: "ghost",
            chosenClass: "chosen",
            dragClass: "drag",
            filter: ".no-drag",
            disabled: locked,
            onEnd: ({ oldIndex, newIndex }) => {
                if (oldIndex == null || newIndex == null || oldIndex === newIndex) {
                    return;
                }

                dispatch({ type: 'REORDER_THREADS', payload: { oldIndex, newIndex } });
            }
        });

        return () => sortable.current?.destroy();
    }, [isLoading, data, locked]);

    // Handlers
    const handleAddThread = () => {
        const newThread = createThread("New Thread");
        dispatch({ type: 'ADD_THREAD', payload: newThread });
    };

    const handleOpenAddCell = (threadId: string) => {
        setTargetThreadId(threadId);
        setCellModalMode('add-cell');
    };

    const handleOpenAddSubCell = (cellUuid: string) => {
        setParentCell(cellUuid)
        setCellModalMode('add-subcell');
    };

    const handleOpenEditCell = (cell: CellType) => {
        if (!cell) {
            console.error("Cell data is required to add a cell.");
            alert("Cell data is required to add a cell.");
            return;
        }

        setCellToEdit(cell);
        setCellModalMode('edit');
    };

    const handleAddCell = (cell: CellType) => {
        if (cellModalMode === "add-cell") {
            if (!targetThreadId) {
                console.error("no target thread to add the new cell to");
                return;
            }

            dispatch({ type: 'ADD_CELL', payload: { threadUuid: targetThreadId, cell: cell } });
        } else if (cellModalMode === "add-subcell") {
            if (!parentCell) {
                console.error("no target parent cell to add the new cell to");
                return;
            }

            dispatch({ type: 'ADD_SUB_CELL', payload: { parentCellUuid: parentCell, cell } });
        }

        setCellModalMode("");
    };

    const handleEditCell = (cell: CellType) => {
        if (!cellToEdit) {
            console.warn("did not edit a cell")
            return;
        }

        dispatch({ type: 'EDIT_CELL', payload: cell });
        setCellModalMode("");
    };

    const handleBackup = async () => {
        try {
            const backup = await buildBackupBundle(data, settings);
            const blob = await backupBundleToBlob(backup);
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `patio-backup-${new Date().toISOString()}.patio`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to create backup:", error);
            alert("Failed to create backup file.");
        }
    };

    const handleRestore = async (file: File) => {
        try {
            const backup = await parseBackupFile(file);

            await saveData(backup.threads);
            dispatch({ type: 'SET_DATA', payload: backup.threads });

            setSettings(backup.settings);
            setLocked(Boolean(backup.settings?.locked));
            await saveSettings(backup.settings);

            if (backup.background?.dataUrl) {
                await applyBackgroundDataUrl(backup.background.dataUrl);
            } else {
                await loadAndApplyBackground();
            }
        } catch (error) {
            console.error("Failed to restore backup:", error);
            alert(error instanceof Error ? error.message : "Failed to restore backup.");
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
                <Loader className="animate-spin" />
            </div>
        );
    }

    return <LockContext.Provider value={{ locked, setLocked }}>
        <DataContext.Provider value={{ dispatch }}>
            <div className="relative h-screen w-screen overflow-hidden bg-cover bg-center transition-all duration-500">

                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" />

                {/* Main Content */}
                <div className="relative z-10 h-full flex flex-col">

                    {/* Header */}
                    <header className="flex-none px-8 py-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-lg">
                                <LayoutGrid className="text-white" size={24} />
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">Patio</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setOpenSettingsModal(true)}
                                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/20 text-white
                                       backdrop-blur-md border border-white/20
                                       transition-all hover:scale-105 active:scale-95">
                                <SettingsIcon size={20} />
                            </button>
                        </div>
                    </header>

                    {/* Threads Container */}
                    <main className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8">
                        <div ref={threadsRef} className="h-full flex flex-nowrap gap-6 justify-center">
                            {
                                data.map((thread: ThreadType) => (
                                    <Thread
                                        key={thread.uuid}
                                        data={thread}
                                        onAddCell={handleOpenAddCell}
                                        onEditCell={handleOpenEditCell}
                                        onAddSubCell={handleOpenAddSubCell}
                                    />
                                ))
                            }

                            {/* Add Thread Button */}
                            {!locked &&
                                <div className="no-drag flex flex-col w-16 shrink-0 h-full pt-11">
                                    <button
                                        onClick={handleAddThread}
                                        title="Add New Thread"
                                        className="w-12 h-full max-h-[80vh] rounded-2xl border-2 border-dashed
                                           border-white/20 hover:border-white/50 hover:bg-white/5 flex
                                           flex-col items-center justify-center gap-4 text-white/40 hover:text-white transition-all group" >
                                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/20 transition-colors">
                                            <Plus size={24} />
                                        </div>
                                        <span
                                            className="vertical-text text-sm font-medium tracking-widest opacity-0
                                               group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
                                            style={{ writingMode: 'vertical-rl' }}
                                        > NEW THREAD
                                        </span>
                                    </button>
                                </div>
                            }
                        </div>
                    </main>

                    {/* Lock Button */}
                    <Lock />

                </div>


                {/* Modals */}
                <CellModal
                    mode={cellModalMode}
                    onClose={() => setCellModalMode("")}
                    onAdd={handleAddCell}
                    onEdit={handleEditCell}
                    cell={cellToEdit}
                />
                <SettingsModal
                    isOpen={openSettingsModal}
                    onClose={() => setOpenSettingsModal(false)}
                    settings={settings}
                    onSave={setSettings}
                    onBackup={handleBackup}
                    onRestore={handleRestore}
                />
            </div>
        </DataContext.Provider>
    </LockContext.Provider>
};
