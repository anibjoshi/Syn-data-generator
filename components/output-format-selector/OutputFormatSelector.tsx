import React from 'react'
import styles from './OutputFormatSelector.module.css'
import { OUTPUT_FORMATS, OutputFormat } from '../../types/data-factory';

interface OutputFormatSelectorProps {
  outputFormat: OutputFormat;
  setOutputFormat: (format: OutputFormat) => void;
}

export default function OutputFormatSelector({ outputFormat, setOutputFormat }: OutputFormatSelectorProps) {
  return (
    <div className={styles.container}>
      <label htmlFor="outputFormat" className={styles.label}>Output Format:</label>
      <select
        id="outputFormat"
        value={outputFormat}
        onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
        className={styles.select}
      >
        {Object.values(OUTPUT_FORMATS).map((format) => (
          <option key={format} value={format}>
            {format}
          </option>
        ))}
      </select>
    </div>
  )
}