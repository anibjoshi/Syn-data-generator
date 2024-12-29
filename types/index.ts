import { OutputFormat } from '../constants';

export interface ColumnType {
  name: string;
  type: string;
  modifier?: string;
}

export interface ColumnInfo {
  column_name: string;
  column_type: string;
  column_data_type: string;
  modifier_list: string[];
}

export interface GenerationRequest {
  schema: ColumnInfo[];
  rowCount: number;
  outputFormat: OutputFormat;
}

export interface GeneratedRow {
  [key: string]: string | number | boolean | null;
}

export interface ApiResponse {
  results: GeneratedRow[];
  metadata: {
    generated_rows: number;
    timestamp: string;
    schema_processed: string[];
    faker_generated_columns: string[];
  }
} 