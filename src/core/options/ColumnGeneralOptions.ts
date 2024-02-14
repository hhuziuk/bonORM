export interface ColumnGeneralOptions {
    unique?: boolean,
    defaultValue?: any,
    allowNull?: boolean,
    onUpdate?: string
    generated?: boolean | "increment" | "uuid" | "rowid" | "identity",
    name?: string
}