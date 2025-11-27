import React, { useState, useEffect } from 'react';
import { HistoryType, CellType, createCell } from '../Utils/Types';
import { getHistory, getBookmarks } from '../Utils/Data';
import { X, Globe, Clock, Bookmark, Loader2 } from 'lucide-react';

interface AddLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (link: CellType) => void;
}

type Tab = 'manual' | 'history' | 'bookmarks';
const tabClassName = "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all "
const activeTabClassName = "bg-blue-600 text-white";
const inactiveTabClassName = "text-gray-400 hover:bg-gray-800 hover:text-gray-200";


export const AddCellModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [activeTab, setActiveTab] = useState<Tab>('manual');

    // Form State
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');

    // Data State
    const [historyItems, setHistoryItems] = useState<HistoryType[]>([]);
    const [bookmarkItems, setBookmarkItems] = useState<HistoryType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset
            setUrl('');
            setTitle('');
            setActiveTab('manual');
            loadData();
        }
    }, [isOpen]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [history, bookmarks] = await Promise.all([getHistory(), getBookmarks()]);
            setHistoryItems(history);
            setBookmarkItems(bookmarks);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        let formattedUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            formattedUrl = 'https://' + url;
        }

        const newCell = createCell(title || new URL(formattedUrl).hostname, formattedUrl, "");
        onAdd(newCell);
    };

    const handleItemClick = (item: HistoryType) => {
        if (!item.url)
            return;
        const c = createCell(item.title || 'Untitled', item.url, "");
        onAdd(c);
    };

    if (!isOpen)
        return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900">
                    <h2 className="text-xl font-semibold text-white">Add Link</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex p-2 gap-1 bg-gray-900 border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={`${tabClassName} ${activeTab === 'manual' ? activeTabClassName : inactiveTabClassName}`}
                    >
                        <Globe size={16} /> Manual
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`${tabClassName} ${activeTab === 'history' ? activeTabClassName : inactiveTabClassName}`}
                    >
                        <Clock size={16} /> History
                    </button>
                    <button
                        onClick={() => setActiveTab('bookmarks')}
                        className={`${tabClassName} ${activeTab === 'bookmarks' ? activeTabClassName : inactiveTabClassName}`}
                    >
                        <Bookmark size={16} /> Bookmarks
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6 overflow-y-auto flex-1">
                    {activeTab === 'manual' && (
                        <form onSubmit={handleManualSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">URL</label>
                                <input
                                    type="text"
                                    placeholder="https://example.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    autoFocus
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Title (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="My Awesome Site"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!url}
                                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-3 rounded-lg transition-colors mt-4"
                            >
                                Add Link
                            </button>
                        </form>
                    )}

                    {
                        (activeTab === 'history' || activeTab === 'bookmarks') && (
                            <div className="space-y-2">
                                {
                                    isLoading ? (
                                        <div className="flex items-center justify-center py-12 text-gray-500">
                                            <Loader2 className="animate-spin mr-2" /> Loading...
                                        </div>
                                    ) : (
                                        (activeTab === 'history' ? historyItems : bookmarkItems).map(item => (
                                            <button
                                                key={item.uuid}
                                                onClick={() => handleItemClick(item)}
                                                className="w-full text-left p-3 rounded-lg border border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition-all group"
                                            >
                                                <div className="font-medium text-gray-200 truncate group-hover:text-blue-400">
                                                    {item.title || item.url}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                    {item.url}
                                                </div>
                                            </button>
                                        ))
                                    )
                                }
                                {
                                    !isLoading && (activeTab === 'history' ? historyItems : bookmarkItems).length === 0 &&
                                    <div className="text-center py-8 text-gray-500">No items found.</div>

                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};
