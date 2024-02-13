export enum mySqlDataType {
    // Numeric Data Types
    Integer = 'INTEGER', // whole number, signed
    SmallInt = 'SMALLINT', // small integer, signed
    Decimal = 'DECIMAL', // fixed-point number
    Numeric = 'NUMERIC', // fixed-point number
    Float = 'FLOAT', // floating-point number (single precision)
    Real = 'REAL', // floating-point number (single precision)
    BigInt = 'BIGINT', // large integer, signed
    // Boolean Data Types
    Boolean = 'BOOLEAN', // logical Boolean (true/false)
    // String Data Types
    Char = 'CHAR', // fixed-length character string
    Varchar = 'VARCHAR', // variable-length character string
    Text = 'TEXT', // variable-length character string (large)
    // Date and Time Data Types
    Date = 'DATE', // calendar date (year, month, day)
    Time = 'TIME', // time of day
    DateTime = 'DATETIME', // date and time
    Timestamp = 'TIMESTAMP', // date and time
    // Binary Data Types
    Binary = 'BINARY', // fixed-length binary string
    Varbinary = 'VARBINARY', // variable-length binary string
    Blob = 'BLOB', // binary large object
    // Spatial Data Types
    Geometry = 'GEOMETRY', // geometric object
    Point = 'POINT', // geometric point
    LineString = 'LINESTRING', // geometric line
    Polygon = 'POLYGON', // geometric polygon
    MultiPoint = 'MULTIPOINT', // collection of points
    MultiLineString = 'MULTILINESTRING', // collection of lines
    MultiPolygon = 'MULTIPOLYGON', // collection of polygons
    GeometryCollection = 'GEOMETRYCOLLECTION' // collection of geometric objects
};
