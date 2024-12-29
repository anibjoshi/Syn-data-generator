export const API_ENDPOINTS = {
  PROCESS: '/api/process',
  DOWNLOAD: '/api/process/download'
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS]; 