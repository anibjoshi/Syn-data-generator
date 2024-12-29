'use client'

import React, { useState, useEffect } from 'react'
import { DatabaseType, SUPPORTED_DATABASES } from '../../utils/constants'
import { Loader2, Moon, Sun } from 'lucide-react'
import { 
  ColumnType, 
  GeneratedRow, 
  OUTPUT_FORMATS,
  OutputFormat 
} from '../../types/data-factory'
import { useSchemaParser } from '../../hooks/useSchemaParser'
import { useDataGeneration } from '../../hooks/useDataGeneration'
import { downloadFile } from '../../utils/file-utils'
import { handleApiError } from '../../utils/error-handling'
import styles from './DataFactory.module.css'
import Image from 'next/image'

// Components
import DatabaseSelector from '../database-selector/DatabaseSelector'
import { SchemaInput } from '../schema-input/schema-input'
import SchemaTable from '../schema-table/SchemaTable'
import { RowCountInput } from '../row-count-input/row-count-input'
import OutputFormatSelector from '../output-format-selector/OutputFormatSelector'
import GeneratedDataPreview from '../generated-data-preview/GeneratedDataPreview'
import FileInformation from '../file-information/FileInformation'
import { Toast } from '../ui/toast'

// Handlers
async function handlePreviewGeneration(
  schema: ColumnType[],
  generatePreview: (schema: ColumnType[]) => Promise<void>,
  setIsGenerated: (value: boolean) => void
) {
  try {
    await generatePreview(schema);
    setIsGenerated(true);
  } catch (error) {
    handleApiError(error);
    setIsGenerated(false);
  }
}

async function handleFileGeneration(
  schema: ColumnType[],
  rowCount: string,
  outputFormat: OutputFormat,
  generateFile: (schema: ColumnType[], rowCount: number, format: string) => Promise<GeneratedRow[]>,
  setIsGeneratingFile: (value: boolean) => void,
  setHasGenerated: (value: boolean) => void,
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) {
  setIsGeneratingFile(true);
  try {
    const numRows = parseInt(rowCount);
    const results = await generateFile(schema, numRows, outputFormat);
    await downloadFile(results, outputFormat);
    setHasGenerated(true);
    onSuccess('File generated and downloaded successfully');
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Failed to generate file');
  } finally {
    setIsGeneratingFile(false);
  }
}

async function handleDownload(data: GeneratedRow[], format: OutputFormat) {
  try {
    await downloadFile(data, format);
  } catch (error) {
    handleApiError(error);
  }
}

function handleReset(
  setSchema: (s: string) => void,
  setRowCount: (r: string) => void,
  setIsGenerated: (g: boolean) => void,
  setHasGenerated: (h: boolean) => void
) {
  setSchema('');
  setRowCount('');
  setIsGenerated(false);
  setHasGenerated(false);
}

export default function DataFactory() {
  // State
  const [schema, setSchema] = useState('')
  const [editedSchema, setEditedSchema] = useState<ColumnType[]>([])
  const [database, setDatabase] = useState<DatabaseType>(SUPPORTED_DATABASES[0])
  const [rowCount, setRowCount] = useState('')
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(OUTPUT_FORMATS.SQL)
  const [isGenerated, setIsGenerated] = useState(false)
  const [isGeneratingFile, setIsGeneratingFile] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Hooks
  const parsedSchema = useSchemaParser(schema, database)
  const { data, isGenerating, generatePreview, generateFile } = useDataGeneration()

  // Effects
  useEffect(() => {
    if (parsedSchema.length > 0 && editedSchema.length === 0) {
      setEditedSchema(parsedSchema)
    }
  }, [parsedSchema])

  // Event Handlers
  const handleSchemaChange = (newSchema: string) => {
    setSchema(newSchema)
    setEditedSchema([])
  }

  const handleSchemaTableChange = (newSchema: ColumnType[]) => {
    setEditedSchema(newSchema)
  }

  const showError = (message: string) => setToast({ message, type: 'error' });
  const showSuccess = (message: string) => setToast({ message, type: 'success' });

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
      <div className={styles.backgroundGrid} />
      
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.titleWrapper}>
            <Image 
              src="/images/logo.png"
              alt="DataFactory Logo"
              width={266}
              height={96}
              className={styles.logo}
              priority
            />
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={styles.themeToggle}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            <span className={styles.themeToggleText}>Toggle Theme</span>
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.column}>
            <DatabaseSelector 
              database={database} 
              setDatabase={setDatabase} 
            />
            <SchemaInput 
              value={schema} 
              onChange={handleSchemaChange} 
            />
            {editedSchema.length > 0 ? (
              <SchemaTable
                parsedSchema={editedSchema}
                database={database}
                onSchemaChange={handleSchemaTableChange}
              />
            ) : (
              <div className={styles.noSchemaMessage}>
                <p className={styles.noSchemaText}>
                  {schema 
                    ? "No valid schema parsed. Please check your CREATE TABLE statement." 
                    : "No schema parsed yet. Enter a CREATE TABLE statement above."
                  }
                </p>
              </div>
            )}
            <button
              onClick={() => handlePreviewGeneration(editedSchema, generatePreview, setIsGenerated)}
              disabled={isGenerating}
              className={`${styles.generateButton} ${isGenerating ? styles.generateButtonDisabled : ''}`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className={`${styles.generateButtonIcon} animate-spin`} />
                  Generating...
                </>
              ) : 'Generate Sample Data'}
            </button>
          </div>

          <div className={styles.column}>
            <GeneratedDataPreview 
              data={data} 
              columns={parsedSchema} 
              isLoading={isGenerating} 
            />
            <div className={styles.settingsContainer}>
              <h3 className={styles.settingsTitle}>Data Generation Settings</h3>
              <div className={styles.settingsContent}>
                <RowCountInput 
                  value={rowCount} 
                  onChange={setRowCount} 
                />
                <OutputFormatSelector 
                  outputFormat={outputFormat} 
                  setOutputFormat={setOutputFormat} 
                />
              </div>
            </div>
            {isGenerated && (
              <FileInformation
                rowCount={rowCount}
                outputFormat={outputFormat}
                onReset={() => handleReset(
                  setSchema,
                  setRowCount,
                  setIsGenerated,
                  setHasGenerated
                )}
                onGenerateAndDownload={() => handleFileGeneration(
                  editedSchema,
                  rowCount,
                  outputFormat,
                  generateFile,
                  setIsGeneratingFile,
                  setHasGenerated,
                  showSuccess,
                  showError
                )}
                onDownloadAgain={() => handleDownload(data, outputFormat)}
                isGenerating={isGeneratingFile}
                hasGenerated={hasGenerated}
                data={data}
              />
            )}
          </div>
        </div>
      </main>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}