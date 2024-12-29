export type DatabaseType = 'MySQL' | 'PostgreSQL';

export const SUPPORTED_DATABASES: DatabaseType[] = ['MySQL', 'PostgreSQL'];

export const API_ENDPOINTS = {
  PROCESS: '/api/process',
  DOWNLOAD: '/api/process/download'
} as const;

export const OUTPUT_FORMATS = {
  SQL: 'SQL (Insert Statements)',
  JSON: 'JSON',
  CSV: 'CSV'
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];
export type OutputFormat = typeof OUTPUT_FORMATS[keyof typeof OUTPUT_FORMATS]; 