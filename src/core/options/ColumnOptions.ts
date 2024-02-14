import {ColumnGeneralOptions} from "./ColumnGeneralOptions";

export interface ColumnOptions extends ColumnGeneralOptions{
    type: any,
    length?: string | number,
    primary?: boolean,
    onUpdate?: string
}