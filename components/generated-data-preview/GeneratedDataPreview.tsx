import React from 'react'
import { Loader2 } from 'lucide-react'
import styles from './GeneratedDataPreview.module.css'

interface GeneratedDataPreviewProps {
  generatedData: any[] | null;
  parsedSchema: { name: string; type: string; modifier?: string }[];
  isLoading: boolean;
}

export default function GeneratedDataPreview({ generatedData, parsedSchema, isLoading }: GeneratedDataPreviewProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Generated Data Preview</h3>
      <div className={styles.previewArea}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <Loader2 className={`${styles.loadingSpinner}`} size={24} />
            <p className={styles.loadingText}>Generating data...</p>
          </div>
        ) : generatedData ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  {parsedSchema.map((column) => (
                    <th key={column.name} className={styles.tableHeaderCell}>{column.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {generatedData.map((row, index) => (
                  <tr key={index} className={styles.tableRow}>
                    {parsedSchema.map((column) => (
                      <td key={column.name} className={styles.tableCell}>{row[column.name]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.loadingContainer}>
            <p className={styles.noDataText}>
              Click Generate Sample Data to see a preview
            </p>
          </div>
        )}
      </div>
    </div>
  )
}