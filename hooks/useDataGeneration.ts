import { useState } from 'react';
import { ColumnType, GeneratedRow, ApiResponse } from '../types/data-factory';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../constants/api';

export function useDataGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<GeneratedRow[]>([]);

  async function generatePreview(schema: ColumnType[]) {
    setIsGenerating(true);
    setError(null);
    
    const request = {
      columns: schema.map(col => ({
        column_name: col.name,
        column_type: col.type,
        column_data_type: col.type,
        modifier_list: col.modifier ? [col.modifier] : []
      })),
      rowCount: 10,
      outputFormat: 'JSON'
    };
    
    try {
      const response = await api.post<ApiResponse>(API_ENDPOINTS.PROCESS, request);
      setData(response.results);
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  }

  async function generateFile(schema: ColumnType[], rowCount: number, outputFormat: string) {
    const request = {
      columns: schema.map(col => ({
        column_name: col.name,
        column_type: col.type,
        column_data_type: col.type,
        modifier_list: col.modifier ? [col.modifier] : []
      })),
      rowCount,
      outputFormat
    };
    
    const response = await api.post<ApiResponse>(API_ENDPOINTS.PROCESS, request);
    return response.results;
  }

  return { 
    data, 
    isGenerating, 
    error, 
    generatePreview,
    generateFile 
  };
} 