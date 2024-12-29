export const OUTPUT_FORMATS = {
  SQL: 'SQL (Insert Statements)',
  JSON: 'JSON',
  CSV: 'CSV'
} as const;

export type OutputFormat = typeof OUTPUT_FORMATS[keyof typeof OUTPUT_FORMATS]; 