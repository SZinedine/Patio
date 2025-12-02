import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CellType } from '../Utils/Types';
import { Pencil, Plus, X } from 'lucide-react';
import { dataUrlToBlob, fetchIconFromBackground, getCachedIcon, storeIcon } from '../Utils/Data';
import { useLock } from '../Context/LockContext';
import { useDataContext } from '../Context/DataContext';

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
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const cellRef = useRef<HTMLAnchorElement>(null);
    const { dispatch } = useDataContext();
    const lock = useLock();
    const hasChildren = data.children && data.children.length > 0;
    const showMenu = hasChildren && (isHoveringCell || isHoveringMenu);
    const faviconUrl = useMemo(() =>
        `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&url=${encodeURIComponent(data.link)}&size=32`,
        [data.link]
    );
    const iconCacheKey = useMemo(() => data.uuid, [data.uuid]);

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

                const dataUrl = await fetchIconFromBackground(faviconUrl);
                if (cancelled || !dataUrl) {
                    return;
                }

                const blob = dataUrlToBlob(dataUrl);
                await storeIcon(iconCacheKey, blob);
                const objectUrl = URL.createObjectURL(blob);
                revokedUrl = objectUrl;
                setIconSrc(objectUrl);
            } catch (_) {
                console.warn("no icon for " + data.link);
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
    }, [faviconUrl, iconCacheKey]);

    const handleDeleteCell = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: 'DELETE_CELL', payload: data.uuid });
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
        // TODO
    };

    const updateMenuPosition = () => {
        if (!cellRef.current) {
            return;
        }
        const rect = cellRef.current.getBoundingClientRect();
        setMenuPosition({
            top: rect.top + window.scrollY,
            left: rect.right + 1 + window.scrollX
        });
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

    return (
        <>
            <a
                ref={cellRef}
                href={data.link}
                rel="noopener noreferrer"
                onMouseEnter={() => {
                    setIsHoveringCell(true);
                    updateMenuPosition();
                }}
                onMouseLeave={() => setIsHoveringCell(false)}
                className="group relative flex items-center gap-3 p-3 rounded-lg bg-white/5
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
                            title="Edit Cell"
                            className={cellButtonClassName}>
                            <Pencil size={14} />
                        </button>
                        {!isSubCell &&
                            <button
                                onClick={handleAddSubCell}
                                title="Add Sub Cell"
                                className={cellButtonClassName}>
                                <Plus size={14} />
                            </button>
                        }
                        <button
                            onClick={handleDeleteCell}
                            title="Delete Cell"
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-400
                                       hover:bg-red-400/10 transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                }
            </a>

            {/* Sub Cells Menu */}
            {
                showMenu && createPortal(
                    <div
                        className="fixed"
                        style={{ top: menuPosition.top, left: menuPosition.left, zIndex: 9999 }}
                        onMouseEnter={() => setIsHoveringMenu(true)}
                        onMouseLeave={() => setIsHoveringMenu(false)}
                    >
                        <div className="min-w-[280px] max-h-96 overflow-y-auto rounded-xl bg-gray-700/10 border border-white/10 shadow-2xl backdrop-blur-lg">
                            <div className="px-3 py-2 text-xs uppercase tracking-wide text-gray-400">
                                {data.title}
                            </div>
                            <div className="divide-y divide-white/5">
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
