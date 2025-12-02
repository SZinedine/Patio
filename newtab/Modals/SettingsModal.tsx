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


    return (
        <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
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
        <fieldset className="fieldset center mt-7">
            <legend className="fieldset-legend text-xl">Wallpaper</legend>
            <input ref={ref} type="file" accept="image/*" className="file-input place-self-center" />
        </fieldset>
    );
});
