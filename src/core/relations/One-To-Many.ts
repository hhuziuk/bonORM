export const createOneToManyRelation = function(
    tableName: string,
    key: string,
    referenceTable: string,
    referenceKey: string
): string {
    const query = `${key} INTEGER REFERENCES ${referenceTable}("${referenceKey}") ON DELETE SET NULL ON UPDATE CASCADE`;
    return `ALTER TABLE ${tableName} ADD ${query};`;
};