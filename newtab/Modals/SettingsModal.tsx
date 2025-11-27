import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { SettingsType } from '../Utils/Types';
import { X, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { loadAndApplyBackground, storeImage } from '../Utils/SettingsUtils';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: SettingsType | null;
    onSave: (settings: SettingsType) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
    const bgRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadAndApplyBackground();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const file = bgRef.current?.files?.[0];
        if (file) {
            await storeImage(file);
            await loadAndApplyBackground();
        }

        if (settings) {
            onSave({ ...settings });
        }

        onClose();
    };

    const handleCancel = () => {
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                    <h2 className="text-xl font-semibold text-white">Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>



                <form onSubmit={handleSave} className="p-6 space-y-6">
                    <div>
                        <BackgroundImage ref={bgRef} />
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                        >
                            <RefreshCw size={14} /> Reset Default
                        </button>

                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>




            </div>
        </div>
    );
};


const BackgroundImage = forwardRef<HTMLInputElement>((_props, ref) => {
    return (
        <fieldset className="fieldset center mt-7">
            <legend className="fieldset-legend text-xl">Wallpaper</legend>
            <input ref={ref} type="file" accept="image/*" className="file-input place-self-center" />
        </fieldset>
    );
});


