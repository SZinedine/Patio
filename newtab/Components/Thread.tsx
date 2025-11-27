import React, { useState, useRef, useEffect } from 'react';
import { ThreadType } from '../Utils/Types';
import { Cell } from './Cell';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useLock } from '../Context/LockContext';
import { useDataContext } from '../Context/DataContext';
import Sortable from 'sortablejs';

interface ThreadProps {
    data: ThreadType;
    onAddCell: (threadId: string) => void;
}

export const Thread: React.FC<ThreadProps> = ({ data, onAddCell }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(data.title);
    const menuRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef(null);
    const { dispatch } = useDataContext();
    const lock = useLock();
    const sortable = useRef<Sortable | null>(null);

    // Click outside to close menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sortable
    useEffect(() => {
        if (!listRef.current) {
            return;
        }

        const sortableFunctions = {
            onEnd: ({ oldIndex, newIndex }: any) => {
                if (oldIndex == null || newIndex == null) {
                    return;
                }

                const updated = [...data.children];
                const [moved] = updated.splice(oldIndex, 1);
                updated.splice(newIndex, 0, moved);
                data.children = updated;
                dispatch({ type: 'EDIT_THREAD', payload: { ...data } });
            },
        }

        sortable.current = Sortable.create(listRef.current, {
            animation: 150,
            ghostClass: "ghost",     // class applied while dragging
            chosenClass: "chosen",   // class when selected
            dragClass: "drag",       // class while dragging item
            filter: ".no-drag",      // class for non dragging elements
            onEnd: sortableFunctions.onEnd,
        });

        return () => sortable.current?.destroy();
    }, [sortable.current]);


    useEffect(() => {
        sortable.current?.option("disabled", lock.locked);
    }, [lock.locked]);


    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    const validateEdit = () => {
        dispatch({ type: "EDIT_THREAD", payload: { ...data, title: title } });
        setEditing(false);
    };

    const onDeleteThread = (uuid: string) => {
        if (window.confirm("Delete this entire thread?")) {
            dispatch({ type: 'DELETE_THREAD', payload: uuid });
        }
    }

    const titleElement = (editing ? (
        <input
            className='font-bold text-lg text-white/90'
            ref={inputRef}
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            onBlur={validateEdit}
            onKeyDown={(e) => {
                if (e.key === "Enter")
                    validateEdit();
                if (e.key === "Escape") {
                    setTitle(data.title);
                    setEditing(false);
                }
            }}
        />) :
        (<span
            className="font-bold text-lg text-white/90 truncate select-none"
            onDoubleClick={() => !lock.locked && setEditing(true)}
        >
            {title}
        </span>)
    )

    return <div className="flex flex-col w-72 shrink-0 h-full max-h-full">
        {/* Thread Header */}
        <div className="flex items-center justify-between mb-3 px-1">
            {
                titleElement
            }

            {!lock.locked &&
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-1.5 rounded-md transition-colors ${isMenuOpen ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                        <MoreHorizontal size={18} />
                    </button>

                    {/* Context Menu */}
                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                            <button
                                onClick={() => {
                                    onAddCell(data.uuid);
                                    setIsMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-2 transition-colors"
                            >
                                <Plus size={14} />
                                Add New Cell
                            </button>
                            <div className="h-px bg-gray-700 my-0.5" />
                            <button
                                onClick={() => {
                                    onDeleteThread(data.uuid);
                                    setIsMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center gap-2 transition-colors">
                                <Trash2 size={14} />
                                Delete Thread
                            </button>
                        </div>
                    )
                    }
                </div>
            }
        </div>

        {/* Link Stack */}
        <div className="flex-1 overflow-y-auto pr-1 pb-4 scrollbar-hide">
            <div ref={listRef} className="flex flex-col gap-2.5">
                {
                    data.children.length === 0 ?
                        (
                            <div className="py-8 text-center border-2 border-dashed border-white/10 rounded-xl text-gray-500 text-sm">
                                No Cells yet
                            </div>
                        ) :
                        (
                            data.children.map(cell => (
                                <Cell
                                    key={cell.uuid}
                                    data={cell}
                                />
                            ))
                        )
                }

                {/* Quick Add Button at bottom of stack */}
                {!lock.locked &&
                    <button
                        onClick={() => onAddCell(data.uuid)}
                        className="no-drag w-full py-2 mt-1 border border-dashed border-white/10 rounded-lg
                                   text-gray-500 hover:text-white hover:border-white/30 hover:bg-white/5
                                   transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        <Plus size={14} />
                        Add Cell
                    </button>
                }
            </div>
        </div>
    </div>
        ;
};
