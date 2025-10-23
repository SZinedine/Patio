

export type CellType = {
    title: string;
    link: string;
    description: string;
};

export type ListType = {
    type: string;
    uuid: string;
    title: string;
    children: CellType[];
};

export type ThreadType = {
    type: string;
    uuid: string;
    title: string;
    children: ListType[];
}
