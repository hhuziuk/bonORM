"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mySqlDataType = void 0;
var mySqlDataType;
(function (mySqlDataType) {
    // Numeric Data Types
    mySqlDataType["Integer"] = "INTEGER";
    mySqlDataType["SmallInt"] = "SMALLINT";
    mySqlDataType["Decimal"] = "DECIMAL";
    mySqlDataType["Numeric"] = "NUMERIC";
    mySqlDataType["Float"] = "FLOAT";
    mySqlDataType["Real"] = "REAL";
    mySqlDataType["BigInt"] = "BIGINT";
    // Boolean Data Types
    mySqlDataType["Boolean"] = "BOOLEAN";
    // String Data Types
    mySqlDataType["Char"] = "CHAR";
    mySqlDataType["Varchar"] = "VARCHAR(255)";
    mySqlDataType["Text"] = "TEXT";
    // Date and Time Data Types
    mySqlDataType["Date"] = "DATE";
    mySqlDataType["Time"] = "TIME";
    mySqlDataType["DateTime"] = "DATETIME";
    mySqlDataType["Timestamp"] = "TIMESTAMP";
    // Binary Data Types
    mySqlDataType["Binary"] = "BINARY";
    mySqlDataType["Varbinary"] = "VARBINARY";
    mySqlDataType["Blob"] = "BLOB";
    // Spatial Data Types
    mySqlDataType["Geometry"] = "GEOMETRY";
    mySqlDataType["Point"] = "POINT";
    mySqlDataType["LineString"] = "LINESTRING";
    mySqlDataType["Polygon"] = "POLYGON";
    mySqlDataType["MultiPoint"] = "MULTIPOINT";
    mySqlDataType["MultiLineString"] = "MULTILINESTRING";
    mySqlDataType["MultiPolygon"] = "MULTIPOLYGON";
    mySqlDataType["GeometryCollection"] = "GEOMETRYCOLLECTION";
    // UUID
    mySqlDataType["UUID"] = "UUID";
})(mySqlDataType = exports.mySqlDataType || (exports.mySqlDataType = {}));
;
