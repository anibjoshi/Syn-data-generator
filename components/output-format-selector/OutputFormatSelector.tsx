import React from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './OutputFormatSelector.module.css'

interface OutputFormatSelectorProps {
  outputFormat: string;
  setOutputFormat: (format: string) => void;
}

export default function OutputFormatSelector({ outputFormat, setOutputFormat }: OutputFormatSelectorProps) {
  const outputFormats = ['SQL', 'CSV', 'JSON', 'Parquet', 'Avro']

  return (
    <div className={styles.container}>
      <label htmlFor="outputFormat" className={styles.label}>
        Select Output Format
      </label>
      <div className={styles.selectContainer}>
        <select
          id="outputFormat"
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
          className={styles.select}
        >
          {outputFormats.map((format) => (
            <option key={format} value={format}>
              {format}
            </option>
          ))}
        </select>
        <ChevronDown className={styles.icon} />
      </div>
    </div>
  )
}