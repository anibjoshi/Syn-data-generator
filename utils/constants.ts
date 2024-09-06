export type DatabaseType = 'PostgreSQL' | 'MySQL';
export type DataType = 'Numeric' | 'String' | 'Date/Time' | 'Boolean' | 'Array' | 'Geometric' | 'JSON' | 'UUID' | 'Binary' | 'ENUM' | 'Network' | 'Text Search' | 'XML' | 'Key-Value' | 'Unknown';

export const SUPPORTED_DATABASES: DatabaseType[] = ['PostgreSQL', 'MySQL'];

export const dataTypes: Record<DatabaseType, Record<string, DataType>> = {
  "PostgreSQL": {
    "SERIAL": "Numeric",
    "SMALLSERIAL": "Numeric",
    "BIGSERIAL": "Numeric",
    "INTEGER": "Numeric",
    "SMALLINT": "Numeric",
    "BIGINT": "Numeric",
    "DECIMAL": "Numeric",
    "NUMERIC": "Numeric",
    "REAL": "Numeric",
    "DOUBLE PRECISION": "Numeric",
    "MONEY": "Numeric",
    "CHAR": "String",
    "VARCHAR": "String",
    "TEXT": "String",
    "BYTEA": "Binary",
    "DATE": "Date/Time",
    "TIME": "Date/Time",
    "TIMESTAMP": "Date/Time",
    "TIMESTAMPTZ": "Date/Time",
    "INTERVAL": "Date/Time",
    "BOOLEAN": "Boolean",
    "UUID": "UUID",
    "ARRAY": "Array",
    "JSON": "JSON",
    "JSONB": "JSON",
    "POINT": "Geometric",
    "LINE": "Geometric",
    "LSEG": "Geometric",
    "BOX": "Geometric",
    "PATH": "Geometric",
    "POLYGON": "Geometric",
    "CIRCLE": "Geometric",
    "CIDR": "Network",
    "INET": "Network",
    "MACADDR": "Network",
    "TSVECTOR": "Text Search",
    "TSQUERY": "Text Search",
    "XML": "XML",
    "HSTORE": "Key-Value"
  },
  "MySQL": {
    "TINYINT": "Numeric",
    "SMALLINT": "Numeric",
    "MEDIUMINT": "Numeric",
    "INT": "Numeric",
    "INTEGER": "Numeric",
    "BIGINT": "Numeric",
    "DECIMAL": "Numeric",
    "NUMERIC": "Numeric",
    "FLOAT": "Numeric",
    "DOUBLE": "Numeric",
    "BIT": "Numeric",
    "CHAR": "String",
    "VARCHAR": "String",
    "TINYTEXT": "String",
    "TEXT": "String",
    "MEDIUMTEXT": "String",
    "LONGTEXT": "String",
    "BINARY": "Binary",
    "VARBINARY": "Binary",
    "BLOB": "Binary",
    "TINYBLOB": "Binary",
    "MEDIUMBLOB": "Binary",
    "LONGBLOB": "Binary",
    "ENUM": "String",
    "SET": "String",
    "DATE": "Date/Time",
    "TIME": "Date/Time",
    "DATETIME": "Date/Time",
    "TIMESTAMP": "Date/Time",
    "YEAR": "Date/Time",
    "BOOLEAN": "Boolean",
    "JSON": "JSON",
    "POINT": "Geometric",
    "LINESTRING": "Geometric",
    "POLYGON": "Geometric",
    "MULTIPOINT": "Geometric",
    "MULTILINESTRING": "Geometric",
    "MULTIPOLYGON": "Geometric",
    "GEOMETRY": "Geometric",
    "GEOMETRYCOLLECTION": "Geometric"
  }
};

export const modifierExamples: Partial<Record<DataType, string>> = {
  "Numeric": "**Range:** min: 0, max: 1000\n**Distribution:** uniform, normal, exponential, log-normal\n**Precision:** 2\n**Step:** 2",
  "String": "**Length:** minLength: 5, maxLength: 50\n**Pattern:** '[A-Z]{3}[0-9]{3}'\n**Character Set:** alphabetical, alphanumeric, custom\n**Random Data:** names, email",
  "Date/Time": "**Range:** start: '2020-01-01', end: '2023-12-31'\n**Format:** 'YYYY-MM-DD'\n**Distribution:** uniform, skewed\n**Interval:** '1 hour'",
  "Boolean": "**Probability:** probabilityTrue: 0.7",
  "Array": "**Size:** minElements: 2, maxElements: 10\n**Element Distribution:** (same as base type)",
  "Geometric": "**Range:** x: { min: -100, max: 100 }, y: { min: -100, max: 100 }\n**Shape:** random",
  "JSON": "**Structure:** { minFields: 2, maxFields: 5 }\n**Schema:** { name: 'string', age: 'integer' }",
  "UUID": "**Version:** 'v4'",
  "Binary": "**Length:** minLength: 256, maxLength: 1024\n**Data:** random, predefined",
  "ENUM": "**Values:** ['admin', 'user', 'guest']\n**Distribution:** { admin: 0.1, user: 0.7, guest: 0.2 }"
};

export const modifierPlaceholders: Partial<Record<DataType, string>> = {
  "Numeric": "min, max, precision, distribution",
  "String": "minLength, maxLength, pattern: '[A-Z]{3}'",
  "Date/Time": "start, end, format: 'YYYY-MM-DD'",
  "Boolean": "probabilityTrue",
  "Array": "minElements, maxElements",
  "Geometric": "x: { min: -100, max: 100 }, y: { min: -100, max: 100 }",
  "JSON": "minFields, maxFields",
  "UUID": "version",
  "Binary": "minLength, maxLength",
  "ENUM": "values: ['admin', 'user', 'guest']"
};