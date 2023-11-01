export const createManyToManyRelation = function(
    tableName: string,
    intermediateTableName: string,
    referenceTableName: string
): string {
    const query = `CREATE TABLE IF NOT EXISTS "${intermediateTableName}" (
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "${tableName}Id" INTEGER REFERENCES "${tableName}" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "${referenceTableName}Id" INTEGER REFERENCES "${referenceTableName}" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY ("${tableName}Id","${referenceTableName}Id")
)`;
    return query;
};