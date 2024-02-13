export enum pgDataType {
    Integer = 'INTEGER', // signed four-byte integer
    String = 'VARCHAR', // variable-length character string
    Date = 'DATE', // calendar date (year, month, day)
    TsQuery = 'TSQUERY', // text search query
    TsVector = 'TSVECTOR', // text search document
    Boolean = 'BOOLEAN', // logical Boolean (true/false)
    Object = 'JSON', // textual JSON data
    ObjectB = 'JSONB', // binary JSON data, decomposed
    UUID = 'UUID', // universally unique identifier
    XML = 'XML', // XML data
    Money = 'MONEY', // currency amount
    Inet = 'INET', // IPv4 or IPv6 host address
    PgSnapshot = 'PG_SNAPSHOT', // user-level transaction ID snapshot
    Float = 'REAL', // single precision floating-point number (4 bytes)
    SmallInt = 'SMALLINT', // signed two-byte integer
    SmallSerial = 'SMALLSERIAL', // autoincrementing two-byte integer
    Serial = 'SERIAL', // autoincrementing four-byte integer
    Double = 'DOUBLE PRECISION', // double precision floating-point number (8 bytes)
    Text = 'TEXT', // variable-length character string
    Timestamp = 'TIMESTAMP', // date and time (no time zone)
    TimestampWithTimeZone = 'TIMESTAMP WITH TIME ZONE', // date and time, including time zone
    Time = 'TIME', // time of day (no date)
    TimeWithTimeZone = 'TIME WITH TIME ZONE', // time of day, including time zone
    Interval = 'INTERVAL', // time interval
};
