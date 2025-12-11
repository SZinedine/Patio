
const Browser = typeof browser !== "undefined" ? browser : chrome;

export function t(messageName: string, substitutions?: string | string[]): string {
    try {
        const message = Browser?.i18n?.getMessage?.(messageName, substitutions);
        return message && message.length > 0 ? message : messageName;
    } catch {
        return messageName;
    }
}

export function getUiLanguage(): string | undefined {
    try {
        return Browser?.i18n?.getUILanguage?.();
    } catch {
        return undefined;
    }
}

