export interface TableColumn {
    Header: string,
    accessor?: string | Function,
    columns?: TableColumn[]
}