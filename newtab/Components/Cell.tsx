import React, { useEffect, useMemo, useState } from 'react';
import { CellType } from '../Utils/Types';
import { X } from 'lucide-react';
import { dataUrlToBlob, fetchIconFromBackground, getCachedIcon, storeIcon } from '../Utils/Data';
import { useLock } from '../Context/LockContext';
import { useDataContext } from '../Context/DataContext';

interface CellProps {
    data: CellType;
}

export const Cell: React.FC<CellProps> = ({ data }) => {
    const [iconSrc, setIconSrc] = useState<string | null>(null);
    const { dispatch } = useDataContext();
    const lock = useLock();
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

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: 'DELETE_CELL', payload: data.uuid });
    };

    return (
        <a
            href={data.link}
            rel="noopener noreferrer"
            className="group relative flex items-center gap-3 p-3 rounded-lg bg-white/5
                       border border-white/10 hover:bg-white/10 shadow-sm backdrop-blur-sm hover:shadow-md">

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
                        new URL(data.link).hostname
                    }
                </p>
            </div>

            {/* Hover Actions */}
            {!lock.locked &&

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={handleDelete}
                        title="Delete Cell"
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-400
                               hover:bg-red-400/10 transition-colors">
                        <X size={14} />
                    </button>
                </div>
            }
        </a>
    );
};
