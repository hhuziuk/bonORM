import "reflect-metadata";
import buildTableQuery from "../../queries/buildTableQuery";

const columnsMetadataKey = "columns";

export function Entity(tableName: string): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata('tableName', tableName, target);
        const columns = Reflect.getMetadata(columnsMetadataKey, target.prototype) || [];
        const columnsStrings = columns.map(buildTableQuery.buildColumnDefinition);

        async function createModel(this: any): Promise<void> {
            if (!columnsStrings || columnsStrings.length === 0) {
                return Promise.resolve();
            }
            const tableName = Reflect.getMetadata('tableName', target);
            const query: string = buildTableQuery.buildCreateTableQuery(tableName, columnsStrings);
            await this.runQuery(query);
        }

        target.prototype.createModel = createModel;
        createModel.call(target.prototype);
    };
}