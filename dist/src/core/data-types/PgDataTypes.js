"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgDataType = void 0;
var pgDataType;
(function (pgDataType) {
    // Numeric Data Types
    pgDataType["Integer"] = "INTEGER";
    pgDataType["Float"] = "REAL";
    pgDataType["SmallInt"] = "SMALLINT";
    pgDataType["SmallSerial"] = "SMALLSERIAL";
    pgDataType["Serial"] = "SERIAL";
    pgDataType["Double"] = "DOUBLE PRECISION";
    // String Data Types
    pgDataType["String"] = "VARCHAR";
    pgDataType["Text"] = "TEXT";
    // Date and Time Data Types
    pgDataType["Date"] = "DATE";
    pgDataType["Timestamp"] = "TIMESTAMP";
    pgDataType["TimestampWithTimeZone"] = "TIMESTAMP WITH TIME ZONE";
    pgDataType["Time"] = "TIME";
    pgDataType["TimeWithTimeZone"] = "TIME WITH TIME ZONE";
    pgDataType["Interval"] = "INTERVAL";
    // Boolean Data Types
    pgDataType["Boolean"] = "BOOLEAN";
    // Binary Data Types
    pgDataType["Object"] = "JSON";
    pgDataType["ObjectB"] = "JSONB";
    // Other Data Types
    pgDataType["UUID"] = "UUID";
    pgDataType["XML"] = "XML";
    pgDataType["Money"] = "MONEY";
    pgDataType["Inet"] = "INET";
    pgDataType["PgSnapshot"] = "PG_SNAPSHOT";
    pgDataType["TsQuery"] = "TSQUERY";
    pgDataType["TsVector"] = "TSVECTOR"; // text search document
})(pgDataType = exports.pgDataType || (exports.pgDataType = {}));
;
