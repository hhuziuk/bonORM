import "reflect-metadata";
import { v4 } from 'uuid';

const columnsMetadataKey = "columns";
export function Entity(tableName: string): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata('tableName', tableName, target);
        const columns = Reflect.getMetadata(columnsMetadataKey, target.prototype) || [];
        const columnsStrings = columns.map(({ propertyKey, options }: any) => {
            const { type, allowNull, defaultValue, autoIncrement, primaryKey } = options;
            let columnDefinition: string = `${propertyKey} ${type}`;
            columnDefinition += (!allowNull) ? " NOT NULL" : "";
            if(defaultValue){
                columnDefinition += ` DEFAULT '${defaultValue}'`;
            } else {
                if(type === 'TIMESTAMP' || type === 'DATE'){
                    columnDefinition += ` DEFAULT ${type === 'TIMESTAMP' ? 'CURRENT_TIMESTAMP' : 'CURRENT_DATE'}`;
                }
            }
            columnDefinition += (primaryKey) ? " PRIMARY KEY" : "";
            if (type === 'UUID') {
                columnDefinition += (process.env.DB_TYPE === 'postgres') ? " DEFAULT uuid_generate_v4()" : ""; // PostgreSQL
                columnDefinition += (process.env.DB_TYPE === 'mysql') ? ` DEFAULT '${v4()}'` : ""; // MySQL
            }
            columnDefinition += (autoIncrement && type === 'INTEGER') ? " GENERATED ALWAYS AS IDENTITY" : "";
            return columnDefinition;
        });

        const createModel = async function (this: any): Promise<void> {
            if (!columnsStrings || columnsStrings.length === 0) {
                return Promise.resolve();
            }
            const columnsQuery = columnsStrings.join(", ");
            const tableName = Reflect.getMetadata('tableName', target);
            const query: string = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsQuery});`;
            await this.runQuery(query);
        };

        target.prototype.createModel = createModel;
        createModel.call(target.prototype);
    };
}