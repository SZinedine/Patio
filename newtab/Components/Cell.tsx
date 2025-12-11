import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CellType } from '../Utils/Types';
import { Pencil, Plus, X } from 'lucide-react';
import { dataUrlToBlob, fetchIconFromBackground, getCachedIcon, storeIcon } from '../Utils/Data';
import { useLock } from '../Context/LockContext';
import { useDataContext } from '../Context/DataContext';
import Sortable from 'sortablejs';
import { t } from '../Utils/i18n';

interface CellProps {
    data: CellType;
    onEdit: (cell: CellType) => void;
    onAddSubCell: (parentCellUuid: string) => void;
    isSubCell?: boolean;
}

const cellButtonClassName = "p-1.5 rounded-md text-gray-400 hover:text-white \
                             hover:bg-gray-400/10 transition-colors";

export const Cell: React.FC<CellProps> = ({ data, onEdit, onAddSubCell, isSubCell = false }) => {
    const [iconSrc, setIconSrc] = useState<string | null>(null);
    const [isHoveringCell, setIsHoveringCell] = useState(false);
    const [isHoveringMenu, setIsHoveringMenu] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const cellRef = useRef<HTMLAnchorElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const { dispatch } = useDataContext();
    const lock = useLock();
    const hasChildren = data.children && data.children.length > 0;
    // Hide the sub-cell menu while the parent cell itself is being dragged so it does not intercept drag events.
    const showMenu = hasChildren && !isDragging && (isHoveringCell || isHoveringMenu);
    const dataRef = useRef(data);
    const iconCacheKey = useMemo(() => new URL(data.link).hostname, [data.link]);

    const listRef = useRef(null);
    const sortable = useRef<Sortable | null>(null);

    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    useEffect(() => {
        let revokedUrl: string | null = null;
        let cancelled = false;

        const loadIcon = async () => {
            try {
                const cached = await getCachedIcon(iconCacheKey);
                if (cancelled) {
                    return;
                }

                if (cached) {
                    revokedUrl = cached;
                    setIconSrc(cached);
                    return;
                }

                const dataUrl = await fetchIconFromBackground(data.link);
                if (cancelled || !dataUrl) {
                    return;
                }

                const blob = dataUrlToBlob(dataUrl);
                await storeIcon(iconCacheKey, blob);
                const objectUrl = URL.createObjectURL(blob);
                revokedUrl = objectUrl;
                setIconSrc(objectUrl);
            } catch (_) {
                console.debug("no icon for " + data.link);
                setIconSrc(null);
            }
        };

        loadIcon();

        return () => {
            cancelled = true;
            if (revokedUrl) {
                URL.revokeObjectURL(revokedUrl);
            }
        };
    }, [iconCacheKey]);

    // Sortable
    useEffect(() => {
        if (!hasChildren || !listRef.current) {
            return;
        }

        const sortableFunctions = {
            onEnd: ({ oldIndex, newIndex }: any) => {
                if (oldIndex == null || newIndex == null) {
                    return;
                }

                const current = dataRef.current;
                if (!current?.children) {
                    return;
                }

                const updated = [...current.children];
                const [moved] = updated.splice(oldIndex, 1);
                updated.splice(newIndex, 0, moved);
                dispatch({ type: 'EDIT_CELL', payload: { ...current, children: updated } });
            },
        }

        sortable.current = Sortable.create(listRef.current, {
            animation: 150,
            draggable: ".cell-item",
            ghostClass: "ghost",     // class applied while dragging
            chosenClass: "chosen",   // class when selected
            dragClass: "drag",       // class while dragging item
            filter: ".no-drag",      // class for non dragging elements
            disabled: lock.locked,
            onEnd: sortableFunctions.onEnd,
        });

        return () => sortable.current?.destroy();
    }, [hasChildren]);

    useEffect(() => {
        if (sortable.current) {
            sortable.current.option("disabled", lock.locked);
        }
    }, [lock.locked]);


    const handleDeleteCell = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm(t("confirm_delete_cell"))) {
            dispatch({ type: 'DELETE_CELL', payload: data.uuid });
        }
    };

    const handleEditCell = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit(data);
    };

    const handleAddSubCell = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddSubCell(data.uuid);
    };

    const updateMenuPosition = () => {
        if (!cellRef.current || !menuRef.current) {
            return;
        }

        const cellRect = cellRef.current.getBoundingClientRect();
        const menuRect = menuRef.current.getBoundingClientRect();
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const margin = 0;

        // Default: position to the right and aligned to the top of the hovered cell.
        let left = cellRect.right + margin;
        let top = cellRect.top;

        // Flip horizontally if there isn't enough space on the right.
        if (left + menuRect.width > winW) {
            left = cellRect.left - menuRect.width - margin;
        }

        const maxLeft = Math.max(margin, winW - menuRect.width - margin);
        left = Math.min(Math.max(margin, left), maxLeft);

        // Flip vertically if there isn't enough space below.
        if (top + menuRect.height > winH) {
            top = cellRect.bottom - menuRect.height - margin;
        }

        const maxTop = Math.max(margin, winH - menuRect.height - margin);
        top = Math.min(Math.max(margin, top), maxTop);

        setMenuPosition({ top, left });
    };

    useEffect(() => {
        if (!showMenu) {
            return;
        }
        const handleReposition = () => updateMenuPosition();
        window.addEventListener('scroll', handleReposition, true);
        window.addEventListener('resize', handleReposition);
        return () => {
            window.removeEventListener('scroll', handleReposition, true);
            window.removeEventListener('resize', handleReposition);
        };
    }, [showMenu]);

    useEffect(() => {
        if (showMenu) {
            updateMenuPosition();
        }
    }, [showMenu]);

    return (
        <>
            <a
                ref={cellRef}
                href={data.link}
                title={data.description || data.link}
                rel="noopener noreferrer"
                data-cell-uuid={data.uuid}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                onMouseEnter={() => {
                    setIsHoveringCell(true);
                    updateMenuPosition();
                }}
                onMouseLeave={() => setIsHoveringCell(false)}
                className="cell-item group relative flex items-center gap-3 p-3 rounded-lg bg-white/5
                       border border-white/10 hover:bg-white/10 shadow-sm backdrop-blur-sm hover:shadow-md overflow-visible">

                {/* Icon */}
                <div className="shrink-0 w-8 h-8 rounded-md bg-white/10 p-1
                                flex items-center justify-center overflow-hidden">
                    {
                        iconSrc && (
                            <img
                                src={iconSrc}
                                alt=""
                                className="w-full h-full object-contain"
                                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                            />
                        )
                    }
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate pr-6 leading-tight">
                        {data.title}
                    </h4>
                    <p className="text-xs text-gray-400 truncate">
                        {
                            (() => {
                                try {
                                    return new URL(data.link).hostname;
                                } catch {
                                    console.warn("invalid url in cell: " + data.link);
                                    return data.link;
                                }
                            })()
                        }
                    </p>
                </div>

                {/* Cell Buttons */}
                {!lock.locked &&

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center
                                opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={handleEditCell}
                            title={t("cell_button_edit_title")}
                            className={cellButtonClassName}>
                            <Pencil size={14} />
                        </button>
                        {!isSubCell &&
                            <button
                                onClick={handleAddSubCell}
                                title={t("cell_button_add_subcell_title")}
                                className={cellButtonClassName}>
                                <Plus size={14} />
                            </button>
                        }
                        <button
                            onClick={handleDeleteCell}
                            title={t("cell_button_delete_cell_title")}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-400
                                       hover:bg-red-400/10 transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                }
            </a>

            {/* Sub Cells Menu */}
            {
                hasChildren && createPortal(
                    <div
                        ref={menuRef}
                        className={`fixed transition duration-100 ${showMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                        style={{ top: menuPosition.top, left: menuPosition.left, zIndex: 9999 }}
                        onMouseEnter={() => setIsHoveringMenu(true)}
                        onMouseLeave={() => setIsHoveringMenu(false)}
                    >
                        <div className="w-[310px] max-h-96 rounded-xl bg-gray-700/10 border border-white/10 shadow-2xl backdrop-blur-lg flex flex-col overflow-hidden">
                            <div className="px-3 py-2 text-xs uppercase tracking-wide text-gray-400 shrink-0">
                                {data.title}
                            </div>
                            <div ref={listRef} className="divide-y divide-white/5 overflow-y-auto">
                                {data.children.map((cell: CellType) => (
                                    <Cell
                                        key={cell.uuid}
                                        data={cell}
                                        isSubCell={true}
                                        onEdit={onEdit}
                                        onAddSubCell={(_) => { }}  // Sub-cells cannot have their own sub-cells
                                    />
                                ))}
                            </div>
                        </div>
                    </div>,
                    document.body)
            }
        </>
    );
};
