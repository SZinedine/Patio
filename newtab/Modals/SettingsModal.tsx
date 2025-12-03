import React, { useEffect, forwardRef, useRef } from 'react';
import { SettingsType } from '../Utils/Types';
import { loadAndApplyBackground, storeImage } from '../Utils/SettingsUtils';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: SettingsType | null;
    onSave: (settings: SettingsType) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
    const bgImageRef = useRef<HTMLInputElement>(null);
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (isOpen) {
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [isOpen]);

    useEffect(() => {
        loadAndApplyBackground();
    }, []);

    const onOkClicked = async (e: React.FormEvent) => {
        e.preventDefault();

        const file = bgImageRef.current?.files?.[0];
        if (file) {
            await storeImage(file);
            await loadAndApplyBackground();
        }

        if (settings) {
            onSave({ ...settings });
        }

        onClose();
    };

    const onCancelClicked = () => {
        onClose();
    };

    const onKeyDown = (e: any) => {
        if (e.key === "Escape") {
            onCancelClicked();
        }
    }

    return (
        <dialog ref={ref} className="modal modal-bottom sm:modal-middle" onKeyDown={onKeyDown}>
            <div className="modal-box bg-base-100/40 backdrop-blur-2xl">
                <h2 className="font-bold text-3xl text-center">Settings</h2>

                <BackgroundImage ref={bgImageRef} />

                <div className="modal-action">
                    <button className="btn" onClick={onCancelClicked}>Cancel</button>
                    <button className="btn" onClick={onOkClicked}>OK</button>
                </div>
            </div>
        </dialog>
    );
};


const BackgroundImage = forwardRef<HTMLInputElement>((_props, ref) => {
    return (
        <fieldset className="fieldset center mt-3">
            <legend className="fieldset-legend text-xl">Wallpaper</legend>
            <input ref={ref} type="file" accept="image/*" className="file-input place-self-center bg-base-200/60" />
        </fieldset>
    );
});
