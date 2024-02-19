export interface ColumnGeneralOptions {
    primaryKey?: boolean,
    autoIncrement?: boolean,
    length?: number,
    width?: number,
    name?: string,
    type: string,
    unique?: boolean,
    defaultValue?: string,
    allowNull?: boolean,
    onUpdate?: string,
}
