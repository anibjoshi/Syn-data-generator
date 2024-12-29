import { OutputFormat } from '../types/data-factory';

function formatJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export async function downloadFile(content: unknown, format: OutputFormat) {
  const formattedContent = format === 'JSON' 
    ? formatJson(content)  // No need to parse, already have the data
    : String(content);  // Convert to string for other formats

  const a = document.createElement('a');
  const fileExtension = format === 'SQL (Insert Statements)' ? 'sql' 
    : format.toLowerCase();
  
  const href = `data:text/plain;charset=utf-8,${encodeURIComponent(formattedContent)}`;
  
  try {
    a.href = href;
    a.download = `generated_data.${fileExtension}`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
  } finally {
    document.body.removeChild(a);
  }
} 

function estimateFileSize(data: unknown, format: OutputFormat, rowCount?: string): string {
  if (!Array.isArray(data) || data.length === 0 || !rowCount) {
    return 'N/A';
  }

  // Calculate average row size based on current data
  const sampleRow = data[0];
  let bytesPerRow = 0;

  Object.entries(sampleRow).forEach(([_, value]) => {
    if (typeof value === 'string') {
      bytesPerRow += (value as string).length * 2; // UTF-16 encoding
    } else if (typeof value === 'number') {
      bytesPerRow += 8; // 64-bit number
    } else if (typeof value === 'boolean') {
      bytesPerRow += 1;
    }
  });

  // Add overhead for formatting
  switch (format) {
    case 'JSON':
      bytesPerRow += Object.keys(sampleRow).length * 4; // Quotes and comma
      break;
    case 'CSV':
      bytesPerRow += Object.keys(sampleRow).length; // Commas
      break;
    case 'SQL (Insert Statements)':
      bytesPerRow += 50; // SQL syntax overhead
      break;
  }

  // Calculate total size
  const numRows = parseInt(rowCount) || 0;
  const totalBytes = bytesPerRow * numRows;

  // Format size
  if (totalBytes === 0) return 'N/A';
  if (totalBytes < 1024) return `${totalBytes} B`;
  if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)} KB`;
  return `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Export the function
export { estimateFileSize }; 