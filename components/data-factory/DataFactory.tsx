'use client'

import React, { useState } from 'react'
import { DatabaseType, SUPPORTED_DATABASES, DataType } from '../../utils/constants'
import DatabaseSelector from './DatabaseSelector'
import { SchemaInput } from '../schema-input/schema-input'
import { RowCountInput } from '../row-count-input/row-count-input'
import SchemaTable from './SchemaTable'
import OutputFormatSelector from './OutputFormatSelector'
import GeneratedDataPreview from './GeneratedDataPreview'
import FileInformation from './FileInformation'
import { Loader2 } from 'lucide-react'
import { useSchemaParser } from '../../hooks/useSchemaParser'
import styles from './DataFactory.module.css'

interface ColumnType {
  name: string;
  type: DataType;
  modifier?: string;
}

export default function DataFactory() {
  const [schema, setSchema] = useState('')
  const [database, setDatabase] = useState<DatabaseType>(SUPPORTED_DATABASES[0])
  const [rowCount, setRowCount] = useState('')
  const [outputFormat, setOutputFormat] = useState('SQL')
  const [isGenerated, setIsGenerated] = useState(false)
  const [generatedData, setGeneratedData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingFile, setIsGeneratingFile] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  const parsedSchema = useSchemaParser(schema, database)

  const handleSchemaChange = (newSchema: ColumnType[]) => {
    console.log('Schema updated:', newSchema)
  }

  const handleGenerateData = async () => {
    setIsLoading(true)
    setIsGenerated(false)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const mockData = Array.from({ length: 5 }, (_, i) => 
        parsedSchema.reduce((acc, col) => ({ ...acc, [col.name]: `Sample ${col.type} ${i + 1}` }), {})
      )
      setGeneratedData(mockData)
      setIsGenerated(true)
    } catch (error) {
      console.error('Error generating data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSchema('')
    setRowCount('')
    setIsGenerated(false)
    setGeneratedData(null)
    setHasGenerated(false)
  }

  const handleGenerateAndDownload = async () => {
    setIsGeneratingFile(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      const blob = new Blob(['Mock file content'], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `generated_data.${outputFormat.toLowerCase()}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      setHasGenerated(true)
    } catch (error) {
      console.error('Error generating and downloading file:', error)
    } finally {
      setIsGeneratingFile(false)
    }
  }

  const handleDownloadAgain = async () => {
    // Implement the logic to download the previously generated file again
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroundGrid}></div>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <h1 className={styles.title}>Data<span className={styles.titleHighlight}>Factory</span></h1>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.column}>
            <DatabaseSelector database={database} setDatabase={setDatabase} />
            <SchemaInput value={schema} onChange={setSchema} />
            {parsedSchema.length > 0 ? (
              <SchemaTable
                parsedSchema={parsedSchema}
                database={database}
                onSchemaChange={handleSchemaChange}
              />
            ) : (
              <div className={styles.noSchemaMessage}>
                <p className={styles.noSchemaText}>No schema parsed yet. Enter a CREATE TABLE statement above.</p>
              </div>
            )}
            <button
              onClick={handleGenerateData}
              disabled={isLoading}
              className={`${styles.generateButton} ${isLoading ? styles.generateButtonDisabled : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className={`${styles.generateButtonIcon} animate-spin`} />
                  Generating...
                </>
              ) : (
                'Generate Sample Data'
              )}
            </button>
          </div>

          <div className={styles.column}>
            <GeneratedDataPreview generatedData={generatedData} parsedSchema={parsedSchema} isLoading={isLoading} />
            <div className={styles.settingsContainer}>
              <h3 className={styles.settingsTitle}>Data Generation Settings</h3>
              <div className={styles.settingsContent}>
                <RowCountInput value={rowCount} onChange={setRowCount} />
                <OutputFormatSelector outputFormat={outputFormat} setOutputFormat={setOutputFormat} />
              </div>
            </div>
            {isGenerated && (
              <FileInformation
                rowCount={rowCount}
                outputFormat={outputFormat}
                onReset={handleReset}
                onGenerateAndDownload={handleGenerateAndDownload}
                onDownloadAgain={handleDownloadAgain}
                isGenerating={isGeneratingFile}
                hasGenerated={hasGenerated}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}