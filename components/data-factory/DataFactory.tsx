'use client'

import React, { useState, useEffect } from 'react'
import { DatabaseType, SUPPORTED_DATABASES, DataType } from '../../utils/constants'
import DatabaseSelector from '../database-selector/DatabaseSelector'
import { SchemaInput } from '../schema-input/schema-input'
import { RowCountInput } from '../row-count-input/row-count-input'
import SchemaTable from '../schema-table/SchemaTable'
import OutputFormatSelector from '../output-format-selector/OutputFormatSelector'
import GeneratedDataPreview from '../generated-data-preview/GeneratedDataPreview'
import FileInformation from '../file-information/FileInformation'
import { Loader2, Moon, Sun } from 'lucide-react'
import { useSchemaParser } from '../../hooks/useSchemaParser'
import styles from './DataFactory.module.css'

// Define the structure for a column in the schema
interface ColumnType {
  name: string;
  type: DataType;
  modifier?: string;
}

interface ColumnInfo {
  column_name: string;
  column_type: string;
  column_data_type: string; // Changed from DataType to string
  modifier_list: string[];
}

export default function DataFactory() {
  // State variables
  const [schema, setSchema] = useState('')
  const [editedSchema, setEditedSchema] = useState<ColumnType[]>([])
  const [database, setDatabase] = useState<DatabaseType>(SUPPORTED_DATABASES[0])
  const [rowCount, setRowCount] = useState('')
  const [outputFormat, setOutputFormat] = useState('SQL')
  const [isGenerated, setIsGenerated] = useState(false)
  const [generatedData, setGeneratedData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingFile, setIsGeneratingFile] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Use the useSchemaParser hook inside the component
  const parsedSchema = useSchemaParser(schema, database)

  // Add useEffect for logging
  useEffect(() => {
    if (parsedSchema.length > 0 && editedSchema.length === 0) {
      setEditedSchema(parsedSchema)
    }
  }, [parsedSchema])

  // Handler for schema changes from SchemaInput
  const handleSchemaInputChange = (newSchema: string) => {
    console.log('Schema input changed:', newSchema)
    setSchema(newSchema)
    setEditedSchema([]) // Reset edited schema when raw input changes
  }

  // Handler for schema changes from SchemaTable
  const handleSchemaTableChange = (newSchema: ColumnType[]) => {
    console.log('Schema table changed:', newSchema)
    setEditedSchema(newSchema)
  }

  // Handler for generating sample data
  const handleGenerateData = async () => {
    setIsLoading(true)
    setIsGenerated(false)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate column information based on edited schema
      const columnInfo: ColumnInfo[] = editedSchema.map(col => ({
        column_name: col.name,
        column_type: col.type,
        column_data_type: getBaseColumnType(col.type),
        modifier_list: parseModifiers(col),
      }))
      
      // Log the generated JSON to the console
      console.log('Generated Column Info:', JSON.stringify(columnInfo, null, 2))
      
      setGeneratedData(columnInfo)
      setIsGenerated(true)
    } catch (error) {
      console.error('Error generating data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get the base column type
  function getBaseColumnType(columnType: string): string {
    return columnType.split(/[\s(]/)[0].toLowerCase()
  }

  // Helper function to parse modifiers from the column type
  function parseModifiers(column: ColumnType): string[] {
    return column.modifier ? [column.modifier] : [];
  }

  // Handler for resetting the form
  const handleReset = () => {
    setSchema('')
    setRowCount('')
    setIsGenerated(false)
    setGeneratedData(null)
    setHasGenerated(false)
  }

  // Handler for generating and downloading data
  const handleGenerateAndDownload = async () => {
    setIsGeneratingFile(true)
    try {
      // Simulate file generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Create a mock file and trigger download
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

  // Handler for downloading the previously generated file again
  const handleDownloadAgain = async () => {
    // TODO: Implement the logic to download the previously generated file again
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
      <div className={styles.backgroundGrid}></div>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <h1 className={styles.title}>Data<span className={styles.titleHighlight}>Factory</span></h1>
          <button onClick={toggleTheme} className={styles.themeToggle}>
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            <span className={styles.themeToggleText}>Toggle Theme</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          {/* Left Column - Schema Input and Generate Sample */}
          <div className={styles.column}>
            <DatabaseSelector database={database} setDatabase={setDatabase} />
            <SchemaInput value={schema} onChange={handleSchemaInputChange} />
            {editedSchema.length > 0 ? (
              <SchemaTable
                parsedSchema={editedSchema}
                database={database}
                onSchemaChange={handleSchemaTableChange}
              />
            ) : (
              <div className={styles.noSchemaMessage}>
                <p className={styles.noSchemaText}>
                  {schema ? "No valid schema parsed. Please check your CREATE TABLE statement." : "No schema parsed yet. Enter a CREATE TABLE statement above."}
                </p>
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

          {/* Right Column - Generated Data Preview & Settings */}
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