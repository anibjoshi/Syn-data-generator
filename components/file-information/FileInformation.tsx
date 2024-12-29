import React from 'react'
import { Download, RefreshCw, Loader2 } from 'lucide-react'
import styles from './FileInformation.module.css'
import { estimateFileSize } from '../../utils/file-utils'
import { OutputFormat } from '../../types/data-factory'

interface FileInformationProps {
  rowCount: string;
  outputFormat: OutputFormat;
  onReset: () => void;
  onGenerateAndDownload: () => Promise<void>;
  onDownloadAgain: () => Promise<void>;
  isGenerating: boolean;
  hasGenerated: boolean;
  data: unknown;
}

export default function FileInformation({ 
  rowCount, 
  outputFormat, 
  onReset, 
  onGenerateAndDownload,
  onDownloadAgain,
  isGenerating,
  hasGenerated,
  data
}: FileInformationProps) {
  const estimatedSize = estimateFileSize(data, outputFormat, rowCount)

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>File Information</h3>
      <p className={styles.info}>Rows to generate: {rowCount}</p>
      <p className={styles.info}>File format: {outputFormat}</p>
      <div className={styles.fileSize}>
        Estimated file size: {estimatedSize}
      </div>
      <div className={styles.buttonContainer}>
        {!hasGenerated ? (
          <button 
            onClick={onGenerateAndDownload}
            disabled={isGenerating}
            className={`${styles.button} ${styles.primaryButton} ${isGenerating ? styles.disabledButton : ''}`}
          >
            {isGenerating ? (
              <>
                <Loader2 className={`${styles.buttonIcon} animate-spin`} />
                Generating...
              </>
            ) : (
              <>
                <Download className={styles.buttonIcon} />
                Generate and Download
              </>
            )}
          </button>
        ) : (
          <>
            <button 
              onClick={onGenerateAndDownload}
              disabled={isGenerating}
              className={`${styles.button} ${styles.primaryButton} ${isGenerating ? styles.disabledButton : ''}`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className={`${styles.buttonIcon} animate-spin`} />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className={styles.buttonIcon} />
                  Generate New
                </>
              )}
            </button>
            <button 
              onClick={onDownloadAgain}
              disabled={isGenerating}
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              <Download className={styles.buttonIcon} />
              Download Again
            </button>
          </>
        )}
        <button
          onClick={onReset}
          disabled={isGenerating}
          className={`${styles.button} ${styles.resetButton} ${isGenerating ? styles.disabledButton : ''}`}
        >
          <RefreshCw className={styles.buttonIcon} />
          Generate Another Dataset
        </button>
      </div>
    </div>
  )
}