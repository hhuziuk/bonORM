export enum dataType {
    Integer = 'INTEGER', // signed four-byte integer
    String = 'VARCHAR', // variable-length character string
    Date = 'DATE', // calendar date (year, month, day)
    Boolean = 'BOOLEAN', // logical Boolean (true/false)
    Object = 'JSON', // textual JSON data
    ObjectB = 'JSONB', // binary JSON data, decomposed
    Enum = 'ENUM', // enumeration
    UUID = 'UUID', // universally unique identifier
    XML = 'XML', // XML data
    Money = 'MONEY', // currency amount
    Inet = 'INET', // IPv4 or IPv6 host address
};
