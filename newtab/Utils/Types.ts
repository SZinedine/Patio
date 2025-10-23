
export type CellType = {
    type?: "cell";
    title: string;
    link: string;
    description: string;
    uuid?: string;
    children?: CellType[];
};

export type ListType = {
    type: "list";
    uuid: string;
    title: string;
    children: CellType[];
};

export type ThreadType = {
    type: "thread";
    uuid: string;
    title: string;
    children: ListType[];
}

export type SettingsType = {
    backgroundImage: string;
}

export function createThread(title: string): ThreadType {
    return {
        type: "thread",
        uuid: crypto.randomUUID(),
        title: title,
        children: [],
    }
}

export function createList(title: string): ListType {
    return {
        type: "list",
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
        uuid: crypto.randomUUID()
    }
}

export function createSettings(backgroundImage: string = ""): SettingsType {
    return {
        backgroundImage: backgroundImage,
    }
}
