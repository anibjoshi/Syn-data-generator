import React from 'react'
import { Loader2 } from 'lucide-react'
import styles from './GeneratedDataPreview.module.css'

interface Column {
  name: string;
  type: string;
  modifier?: string;
}

interface GeneratedRow {
  [key: string]: string | number | boolean | null;
}

interface GeneratedDataPreviewProps {
  data: GeneratedRow[];
  columns: Column[];
  isLoading: boolean;
}

export default function GeneratedDataPreview({ data, columns, isLoading }: GeneratedDataPreviewProps) {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Generated Data Preview</h3>
        <div className={styles.loadingContainer}>
          <Loader2 className={`${styles.loadingSpinner}`} size={24} />
          <p className={styles.loadingText}>Generating data...</p>
        </div>
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Generated Data Preview</h3>
        <div className={styles.loadingContainer}>
          <p className={styles.noDataText}>
            Click Generate Sample Data to see a preview
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Generated Data Preview</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              {columns.map((column) => (
                <th key={column.name} className={styles.tableHeaderCell}>
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className={styles.tableRow}>
                {columns.map((column) => (
                  <td key={column.name} className={styles.tableCell}>
                    {row[column.name]?.toString() ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}