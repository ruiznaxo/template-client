export interface ITable{
    title?: string;
    subtitle?: string;
    data?: any[];
    columns?: Column[];
    actionsColumn?: ActionsColumn;
    searchable?: boolean;
    showEntries?: boolean;
}

export interface ActionsColumn {
    active?: boolean
    buttons?: Button[];
}

export interface Column {
    title?: string;
    data?: string;
}

export interface Button {
    icon?: string;
    tooltip?: string;
    event?: string;
}