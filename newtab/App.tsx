import { useState, useEffect, useReducer, useRef } from 'react';
import { Thread } from './Components/Thread';
import { Settings as SettingsIcon, Plus, LayoutGrid, Loader } from 'lucide-react';
import { CellType, createThread, SettingsType, ThreadType } from './Utils/Types';
import { fetchData, fetchSettings, saveData, saveSettings } from './Utils/Data';
import { CellModal } from './Modals/CellModal';
import { SettingsModal } from './Modals/SettingsModal';
import Lock from './Components/Lock';
import { LockContext } from "./Context/LockContext";
import { reducer } from './Utils/Reducer';
import { DataContext } from './Context/DataContext';
import Sortable from 'sortablejs';

export default function App() {
    // Application State
    const [data, dispatch] = useReducer(reducer, []);
    const [settings, setSettings] = useState<SettingsType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [locked, setLocked] = useState<boolean>(true);
    const [cellToEdit, setCellToEdit] = useState<CellType | null>(null);
    const threadsRef = useRef(null);
    const sortable = useRef<Sortable | null>(null);

    // Modal State
    const [activeModal, setActiveModal] = useState<'add-cell' | 'settings' | null>(null);
    const [targetThreadId, setTargetThreadId] = useState<string | null>(null);

    // Initialization
    useEffect(() => {
        const init = async () => {
            try {
                const [data_, settings_] = await Promise.all([
                    fetchData(),
                    fetchSettings()
                ]);
                dispatch({ type: 'SET_DATA', payload: data_ });
                setSettings(settings_);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, []);

    // Persistence Effects
    useEffect(() => {
        if (!isLoading && data.length >= 0) {
            saveData(data);
        }
    }, [data, isLoading]);

    useEffect(() => {
        if (!isLoading && settings) {
            saveSettings(settings);
        }
    }, [settings, isLoading]);

    // Ensure modals reset state on close
    useEffect(() => {
        if (activeModal === null) {
            setTargetThreadId(null);
            setCellToEdit(null);
        }
    }, [activeModal]);

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
                if (oldIndex == null || newIndex == null) {
                    return;
                }

                const updated = [...data];
                const [moved] = updated.splice(oldIndex, 1);
                updated.splice(newIndex, 0, moved);
                dispatch({ type: 'SET_DATA', payload: updated });
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
        setActiveModal('add-cell');
    };

    const handleOpenEditCell = (cell: CellType) => {
        if (!cell) {
            console.error("Cell data is required to add a cell.");
        }

        setCellToEdit(cell);
        setActiveModal('add-cell');
    };

    const handleAddCell = (cell: CellType) => {
        if (!targetThreadId)
            return;

        dispatch({ type: 'ADD_CELL', payload: { threadUuid: targetThreadId, cell: cell } });
        setActiveModal(null);
    };

    const handleEditCell = (cell: CellType) => {
        if (!cellToEdit) {
            console.warn("did not edit a cell")
            return;
        }

        dispatch({ type: 'EDIT_CELL', payload: cell });
        setActiveModal(null);
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
                                onClick={() => setActiveModal('settings')}
                                className="p-2.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80
                                       hover:text-white backdrop-blur-md border border-white/10
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
                    isOpen={activeModal === 'add-cell'}
                    onClose={() => setActiveModal(null)}
                    onAdd={handleAddCell}
                    onEdit={handleEditCell}
                    cell={cellToEdit}
                />
                <SettingsModal
                    isOpen={activeModal === 'settings'}
                    onClose={() => setActiveModal(null)}
                    settings={settings}
                    onSave={setSettings}
                />
            </div>
        </DataContext.Provider>
    </LockContext.Provider>
};

