export interface ITable{
    title?: string;
    subtitle?: string;
    data?: any[];
    buttons?: Button[];
    actionsColumn?: ActionsColumn;
    searchable?: boolean;
    columns?: Column[];
    showEntries?: boolean;
    auxData?: any[];
}

export interface ActionsColumn {
    active?: boolean
    buttons?: Button[];
}

export interface Column {
    prop?: string;
    name?: string;
}

export interface Button {
    icon?: string;
    tooltip?: string;
    event?: string;
    text?: string;
}