import React, { useState, useRef, useEffect } from 'react'
import { HelpCircle } from 'lucide-react'
import { DatabaseType, DataType, dataTypes, modifierExamples, modifierPlaceholders } from '../../utils/constants'
import styles from './SchemaTable.module.css'

interface SchemaTableProps {
  parsedSchema: ColumnType[];
  database: DatabaseType;
  onSchemaChange: (newSchema: ColumnType[]) => void;
}

interface ColumnType {
  name: string;
  type: DataType;
  modifier?: string;
}

export default function SchemaTable({ parsedSchema, database, onSchemaChange }: SchemaTableProps) {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setActiveTooltip(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const uniqueDataTypes = Array.from(new Set(Object.values(dataTypes[database]).flat()));

  const handleTypeChange = (index: number, newType: DataType) => {
    const newSchema = [...parsedSchema];
    newSchema[index].type = newType;
    onSchemaChange(newSchema);
  };

  const handleModifierChange = (index: number, newModifier: string) => {
    const newSchema = [...parsedSchema];
    newSchema[index].modifier = newModifier;
    onSchemaChange(newSchema);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Schema</h3>
      <div className="overflow-x-auto">
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.tableHeaderCell}>Column Name</th>
              <th className={styles.tableHeaderCell}>Data Type</th>
              <th className={styles.tableHeaderCell}>Modifiers</th>
            </tr>
          </thead>
          <tbody>
            {parsedSchema.map((column, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <span className="font-medium text-gray-700">{column.name}</span>
                </td>
                <td className={styles.tableCell}>
                  <select
                    value={column.type}
                    onChange={(e) => handleTypeChange(index, e.target.value as DataType)}
                    className={styles.select}
                  >
                    {uniqueDataTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </td>
                <td className={styles.tableCell}>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={column.modifier || ''}
                      onChange={(e) => handleModifierChange(index, e.target.value)}
                      placeholder={modifierPlaceholders[column.type] || "Enter modifiers"}
                      className={styles.input}
                    />
                    <div className="relative ml-2 flex-shrink-0 group">
                      <button
                        onClick={() => setActiveTooltip(activeTooltip === index ? null : index)}
                        className={styles.tooltipButton}
                      >
                        <HelpCircle size={18} />
                      </button>
                      {activeTooltip === index && (
                        <div
                          ref={tooltipRef}
                          className={styles.tooltip}
                          onMouseLeave={() => setActiveTooltip(null)}
                        >
                          <div className={styles.tooltipTitle}>Suggestion:</div>
                          <div dangerouslySetInnerHTML={{ __html: (modifierExamples[column.type] || "No specific modifiers available").replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold text-indigo-600">$1</span>') }} />
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}