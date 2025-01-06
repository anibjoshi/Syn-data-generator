import React from 'react'
import { Download, RefreshCw, Loader2 } from 'lucide-react'
import styles from './FileInformation.module.css'
import { estimateFileSize } from '../../utils/file-utils'
import { OutputFormat, GeneratedRow } from '../../types/data-factory'
import { Progress } from '../ui/progress'

interface FileInformationProps {
  rowCount: string;
  outputFormat: OutputFormat;
  onReset: () => void;
  onGenerateAndDownload: () => void;
  onDownloadAgain: () => void;
  isGenerating: boolean;
  hasGenerated: boolean;
  data: GeneratedRow[];
  progress: number;
  isFinishing: boolean;
}

export default function FileInformation({
  rowCount,
  outputFormat,
  onReset,
  onGenerateAndDownload,
  onDownloadAgain,
  isGenerating,
  hasGenerated,
  data,
  progress,
  isFinishing
}: FileInformationProps) {
  const estimatedSize = estimateFileSize(data, outputFormat, rowCount);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>File Information</h3>
      
      <div className={styles.settingsSection}>
        <h4 className={styles.settingsTitle}>Generation Settings</h4>
        <p>Rows to generate: {rowCount}</p>
        <p>File format: {outputFormat}</p>
        <p>Estimated file size: {estimatedSize}</p>
      </div>
      
      <button
        onClick={onGenerateAndDownload}
        disabled={isGenerating}
        className={`${styles.generateButton} ${isGenerating ? styles.generateButtonDisabled : ''}`}
      >
        {isGenerating ? (
          <div className={styles.generatingContainer}>
            <div className={styles.progressText}>
              {isFinishing ? 'Finishing up...' : `Generating... ${progress}%`}
            </div>
            <Progress value={progress} className={styles.progressBar} />
          </div>
        ) : (
          <>
            <Download className={styles.buttonIcon} />
            Generate and Download
          </>
        )}
      </button>
      
      {hasGenerated && (
        <button
          onClick={onDownloadAgain}
          className={styles.downloadButton}
        >
          <RefreshCw className={styles.buttonIcon} />
          Download Again
        </button>
      )}
      
      <button
        onClick={onReset}
        className={styles.resetButton}
      >
        Start Over
      </button>
    </div>
  );
}