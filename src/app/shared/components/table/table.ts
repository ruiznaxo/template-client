export interface ITable{
    title?: string;
    subtitle?: string;
    data?: any[]; //add disabled field for each action button
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
    type?: TypeData; 
}

export interface Button {
    icon?: string;
    tooltip?: string;
    event?: string;
    text?: string;
    fieldDisabledValue?: string;
    disabledTooltip?: string;
}

export type TypeData =
  | 'checkbox'
  | 'text'
  | 'decimal'
  | 'textArray'
  | 'transform'
  | 'enum'
  | 'edit'
  | 'dropdown'
  | 'lookup'
  | 'upload'
  | 'download'
  | 'link'
  | 'rowspan'
  | 'autocomplete'
  | 'editSection'
  | 'section'
  | 'uploadFile'
  | 'note'
  | 'editTray'
  | 'file'
  | 'calendar'
  | 'period'
  | 'tick'
  | 'textButton';