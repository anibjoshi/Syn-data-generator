export class DataFactoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'DataFactoryError';
  }
}

export function handleApiError(error: unknown): never {
  if (error instanceof DataFactoryError) {
    throw error;
  }
  
  throw new DataFactoryError(
    'An unexpected error occurred',
    'UNEXPECTED_ERROR',
    error
  );
} 