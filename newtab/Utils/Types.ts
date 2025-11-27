
export type CellType = {
    type?: "cell";
    title: string;
    link: string;
    description: string;
    uuid: string;
    children: CellType[];
};

export type ThreadType = {
    type?: "thread";
    uuid: string;
    title: string;
    children: CellType[];
}

export type SettingsType = {
    locked: boolean;
}

export type HistoryType = {
  uuid: string;
  title?: string;
  url?: string;
}

/**
 * when the add button of a cell is pressed, these are the information that are passed
 */
export type CellAddingDataType = {
    parentListUuid: string;
    cellUuid?: string;
    parentCellUuid?: string;
};


export function createThread(title: string): ThreadType {
    return {
        type: "thread",
        uuid: crypto.randomUUID(),
        title: title,
        children: [],
    }
}

export function createCell(title: string, link: string, description: string): CellType {
    return {
        type: "cell",
        title: title,
        link: link,
        description: description,
        uuid: crypto.randomUUID(),
        children: []
    }
}

export function createSettings(
        locked: boolean = false,
): SettingsType {
    return {
        locked: locked,
    }
}
