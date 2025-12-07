import { getBackgroundBlob } from "./SettingsUtils";
import { ThreadType, SettingsType } from "./Types";

export type BackupBackground = {
    dataUrl: string;
    type: string;
};

export type BackupBundle = {
    version: number;
    threads: ThreadType[];
    settings: SettingsType;
    background: BackupBackground;
};

const BACKUP_VERSION = 1;

export async function buildBackupBundle(threads: ThreadType[], settings: SettingsType | null): Promise<BackupBundle> {
    const backgroundBlob = await getBackgroundBlob();
    if (!backgroundBlob) {
        throw new Error("Could not find a background image to include in the backup.");
    }

    const backgroundUrl = await blobToDataUrl(backgroundBlob);
    const safeSettings = settings ?? { locked: false };

    return {
        version: BACKUP_VERSION,
        threads: threads ?? [],
        settings: safeSettings,
        background: {
            dataUrl: backgroundUrl,
            type: backgroundBlob.type || "application/octet-stream"
        }
    };
}

export async function backupBundleToBlob(bundle: BackupBundle): Promise<Blob> {
    const serialized = JSON.stringify(bundle);
    return new Blob([serialized], { type: "application/json" });
}

export async function parseBackupFile(file: File): Promise<BackupBundle> {
    const text = await file.text();

    let parsed: unknown;
    try {
        parsed = JSON.parse(text);
    } catch (error) {
        throw new Error("Backup file is not valid JSON.");
    }

    return validateBackupBundle(parsed);
}

function validateBackupBundle(value: any): BackupBundle {
    if (!value || typeof value !== "object") {
        throw new Error("Backup file is missing required data.");
    }

    if (value.version !== BACKUP_VERSION) {
        throw new Error("Backup file version is not supported.");
    }

    if (!Array.isArray(value.threads)) {
        throw new Error("Backup file is missing threads data.");
    }

    if (!value.settings || typeof value.settings !== "object") {
        throw new Error("Backup file is missing settings.");
    }

    if (!value.background || typeof value.background !== "object" || typeof value.background.dataUrl !== "string") {
        throw new Error("Backup file is missing a background image.");
    }

    return {
        version: value.version,
        threads: value.threads,
        settings: value.settings,
        background: {
            dataUrl: value.background.dataUrl,
            type: typeof value.background.type === "string" ? value.background.type : "application/octet-stream"
        }
    };
}

function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            if (typeof result === "string") {
                resolve(result);
            } else {
                reject(new Error("Failed to read background image."));
            }
        };
        reader.onerror = () => reject(new Error("Unable to convert background image to data URL."));
        reader.readAsDataURL(blob);
    });
}
