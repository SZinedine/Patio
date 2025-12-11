import { useState, useEffect, useReducer, useRef } from 'react';
import { Thread } from './Components/Thread';
import { Settings as SettingsIcon, Plus, Loader } from 'lucide-react';
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
import { t } from './Utils/i18n';

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
                const [_, data_, settings_] = await Promise.all([
                    loadAndApplyBackground(),
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
        const newThread = createThread(t("thread_new_default_title"));
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
            alert(t("error_cell_data_required"));
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
            alert(t("error_backup_create_file"));
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
            alert(error instanceof Error ? error.message : t("error_restore_backup"));
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
                            <div className="p-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-lg">
                                {logo}
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
                                        title={t("thread_add_new_thread_title")}
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
                                        >
                                            {t("thread_new_thread_label")}
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


const logo = (
    <svg
        viewBox="0 0 128 128"
        className="w-8 h-8 text-white"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill="currentColor"
            d="m 58.332617,12.040051 c -4.393275,0.654676 -8.657769,1.587523 -12.792611,2.793523 -5.254663,1.464397 -9.797345,3.231655 -13.622028,5.299052 -3.841952,2.067402 -7.011379,4.35034 -9.509498,6.848454 -3.014972,3.014976 -4.521476,6.288738 -4.521476,9.820531 0,5.082378 2.410406,9.561299 7.234361,13.437712 4.307087,3.531794 9.087345,5.681491 14.342007,6.456784 h 0.259191 c 0.603002,0.172282 0.904293,0.0448 0.904293,-0.385911 0,-0.344572 -0.254973,-0.558958 -0.771816,-0.645103 C 38.735174,55.40667 37.767586,55.145944 36.957836,54.887514 36.130905,54.62909 35.45871,54.414701 34.941893,54.242411 31.754324,53.036426 29.170314,51.228615 27.189058,48.816642 24.949366,46.060093 23.83107,43.000766 23.83107,39.641214 c 0,-4.048656 1.633997,-7.71061 4.907383,-10.984021 2.411975,-2.498113 5.280155,-4.711528 8.605205,-6.641097 3.307867,-1.9468 7.120401,-3.609772 11.427528,-4.988023 9.929864,-2.340741 17.836769,-4.192127 26.875574,-4.262312 6.805173,0 13.306331,0.816985 19.508572,2.453692 3.273367,0.947536 6.332738,2.112215 9.175428,3.490462 2.84265,1.378299 5.42692,3.058608 7.75274,5.039864 5.68533,4.651661 8.53033,10.034501 8.53033,16.1506 0,9.906321 -7.32386,17.015847 -21.968035,21.322934 -4.651645,1.292154 -8.956801,2.236598 -12.919337,2.839603 -3.962535,0.603126 -7.670775,0.904296 -11.116492,0.904296 h -2.067778 c 2.756556,-5.857667 5.172733,-11.715609 7.240128,-17.57328 2.067393,-5.857668 3.701369,-11.715607 4.907378,-17.573279 0.603019,-2.670401 0.904293,-4.437664 0.904293,-5.299053 0,-1.206007 -0.776423,-1.808591 -2.326968,-1.808591 -2.670414,0 -4.350748,1.292113 -5.03985,3.876374 -0.344594,1.378251 -0.645869,2.670409 -0.904323,3.876373 -0.258335,1.206007 -0.47279,2.196786 -0.645102,2.972081 -0.430707,2.239686 -0.923197,4.37195 -1.47452,6.387663 -0.568545,2.032944 -1.153722,4.037777 -1.756742,6.019033 -2.153536,6.977536 -5.039053,14.017494 -8.657053,21.115584 -3.617925,7.115319 -7.923082,14.334943 -12.919315,21.657007 -9.561795,13.696596 -19.423556,20.545366 -29.588311,20.545366 -5.340807,0 -9.390964,-1.94107 -12.147508,-5.81745 -2.5842607,-3.359553 -3.8763733,-7.751569 -3.8763733,-13.17852 0,-6.374484 1.680324,-12.191895 5.0398633,-17.44656 3.79025,-6.116054 8.697973,-9.175429 14.727916,-9.175429 2.670405,0 4.43762,0.735821 5.299055,2.20026 0.516863,0.603002 0.90506,1.419969 1.16349,2.453692 0.258425,-0.172283 0.385908,-0.473579 0.385908,-0.904295 0,-1.981257 -0.90392,-3.44718 -2.712886,-4.39476 -1.636685,-1.119823 -3.444501,-1.676115 -5.425772,-1.676115 -6.719076,0 -12.36265,2.839188 -16.9281757,8.524569 -4.0486745,5.340805 -6.0708749,11.500083 -6.0708749,18.477572 0,6.719105 1.8947163,12.101906 5.6849637,16.150596 3.7902499,4.13479 8.8717949,6.20335 15.2463019,6.20335 18.520539,0 34.842914,-14.555109 48.970184,-43.67112 9.820213,0.258423 19.038791,-0.906206 27.653002,-3.490466 7.408213,-2.239687 13.526913,-5.33959 18.350863,-9.302145 6.28838,-5.082375 9.42887,-10.812843 9.42887,-17.187371 0,-6.546772 -3.27373,-12.103467 -9.82054,-16.668983 -4.91082,-3.359213 -11.15064,-5.903164 -18.731148,-7.626001 -3.014973,-0.602995 -6.120636,-1.072356 -9.3079,-1.416921 C 86.02381,10.871824 82.663114,10.698007 79.131316,10.698007 72.159933,10.46633 64.729682,11.145023 58.332617,12.040051 Z"
        />
    </svg>
)
