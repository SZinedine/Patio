import React, { useEffect, forwardRef, useRef } from 'react';
import { SettingsType } from '../Utils/Types';
import { loadAndApplyBackground, storeImage } from '../Utils/SettingsUtils';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: SettingsType | null;
    onSave: (settings: SettingsType) => void;
    onBackup: () => Promise<void>;
    onRestore: (file: File) => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave, onBackup, onRestore }) => {
    const bgImageRef = useRef<HTMLInputElement>(null);
    const restoreFileRef = useRef<HTMLInputElement>(null);
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

    const onBackupClicked = async () => {
        try {
            await onBackup();
        } catch (error) {
            console.error(error);
            alert("Failed to create backup file.");
        }
    };

    const onRestoreSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        try {
            await onRestore(file);
        } catch (error) {
            console.error(error);
            alert("Failed to restore from the selected backup.");
        } finally {
            e.target.value = "";
        }
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
                <BackupRestoreControls
                    onBackupClicked={onBackupClicked}
                    onRestoreSelected={onRestoreSelected}
                    restoreFileRef={restoreFileRef}
                />

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


type BackupRestoreProps = {
    onBackupClicked: () => void;
    onRestoreSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
    restoreFileRef: React.RefObject<HTMLInputElement>;
};

const BackupRestoreControls: React.FC<BackupRestoreProps> = ({ onBackupClicked, onRestoreSelected, restoreFileRef }) => {
    return (
        <fieldset className="fieldset mt-4">
            <legend className="fieldset-legend text-xl">Backup & Restore</legend>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <button className="btn btn-outline" type="button" onClick={onBackupClicked}>
                    Backup
                </button>
                <div className="flex items-center gap-3">
                    <input
                        ref={restoreFileRef}
                        type="file"
                        accept="application/json"
                        className="file-input bg-base-200/60"
                        onChange={onRestoreSelected}
                    />
                    <p className="text-xs opacity-70">Select a backup file to restore.</p>
                </div>
            </div>
        </fieldset>
    );
};
