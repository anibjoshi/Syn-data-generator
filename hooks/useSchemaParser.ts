import { useState, useEffect } from 'react'
import { DatabaseType, DataType, dataTypes } from '../utils/constants'

interface ColumnType {
  name: string;
  type: DataType;
  modifier?: string;
}

export function useSchemaParser(schema: string, database: DatabaseType) {
  const [parsedSchema, setParsedSchema] = useState<ColumnType[]>([])

  useEffect(() => {
    const parseCreateTableStatement = (sql: string, database: DatabaseType): ColumnType[] => {
      console.log("Parsing SQL:", sql); // Debug log
      const tableMatch = sql.match(/CREATE TABLE\s+["`]?(\w+)["`]?\s*\(([\s\S]+)\)/i);
      if (!tableMatch) {
        console.log("No table match found"); // Debug log
        return [];
      }

      const columnsPart = tableMatch[2];
      const columnDefinitions = columnsPart.split(',').map(col => col.trim());

      return columnDefinitions.map(colDef => {
        const columnMatch = colDef.match(/^["`]?(\w+)["`]?\s+([\w\s()]+)(\[\])?\s*(.*)$/);
        if (!columnMatch) return { name: 'Unknown', type: 'Unknown' as DataType, modifier: '' };

        let [_, name, type, isArray, constraints] = columnMatch;
        name = name.replace(/["`]/g, '');
        type = type.trim().toUpperCase();

        // Handle array types
        if (isArray) {
          type = `${type}[]`;
        }

        console.log("name, type", name, type)
        // Handle specific types
        if (type.startsWith('SERIAL')) {
          type = 'SERIAL';
        } else if (type.includes('INT')) {
          type = 'INTEGER';
        } else if (type === 'NUMERIC' || type === 'DECIMAL') {
          type = 'NUMERIC';
        } else if (type.includes('BOOLEAN')) {
          type = 'BOOLEAN';
        } else if (type.includes('TIMESTAMP')) {
          type = 'TIMESTAMP';
        } else if (type.includes('UUID')) {
          type = 'UUID';
        }

        const baseType = type.split('(')[0].trim().replace('[]', '');
        let generalType = (dataTypes[database][baseType as keyof typeof dataTypes[typeof database]] as DataType) || "Unknown";

        // Append '[]' to generalType if it's an array
        if (isArray) {
          generalType = `${generalType}[]` as DataType;
        }

        return { name, type: generalType, modifier: constraints.trim() };
      });
    };

    if (schema && database) {
      const parsed = parseCreateTableStatement(schema, database);
      setParsedSchema(parsed);
    } else {
      setParsedSchema([]);
    }
  }, [schema, database]);

  return parsedSchema;
}