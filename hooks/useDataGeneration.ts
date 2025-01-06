import { useState } from 'react';
import { ColumnType, GeneratedRow, ApiResponse } from '../types/data-factory';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../constants/api';

export function useDataGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<GeneratedRow[]>([]);

  // Helper function to calculate increment based on row count
  function calculateIncrement(totalRows: number): number {
    if (totalRows <= 100) return 4;
    if (totalRows <= 1000) return 2;
    if (totalRows <= 10000) return 1;
    return 0.5;
  }

  // Helper function to calculate interval based on row count
  function calculateInterval(totalRows: number): number {
    if (totalRows <= 100) return 500;
    if (totalRows <= 1000) return 750;
    if (totalRows <= 10000) return 1000;
    return 1500;
  }

  async function generatePreview(
    schema: ColumnType[],
    setProgress: (progress: number) => void,
    setIsFinishing: (isFinishing: boolean) => void
  ) {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    
    const rowCount = 10; // Preview always uses 10 rows
    const increment = calculateIncrement(rowCount);
    const interval = calculateInterval(rowCount);
    
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += increment;
      if (progress <= 60) {
        setProgress(Math.min(progress, 60));
      }
    }, interval);
    
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
      const gradualProgress = setInterval(() => {
        progress += increment / 2;
        if (progress > 60 && progress <= 80) {
          setProgress(Math.min(progress, 80));
        }
      }, interval);

      const response = await api.post<ApiResponse>(API_ENDPOINTS.PROCESS, request);
      clearInterval(gradualProgress);
      
      setProgress(80);
      setIsFinishing(true);
      
      setTimeout(() => {
        setProgress(90);
        setTimeout(() => {
          setProgress(100);
        }, interval / 2);
      }, interval / 2);

      setData(response.results);
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsGenerating(false);
        setIsFinishing(false);
      }, interval);
    }
  }

  async function generateFile(
    schema: ColumnType[], 
    rowCount: number, 
    outputFormat: string,
    setProgress: (progress: number) => void,
    setIsFinishing: (isFinishing: boolean) => void
  ) {
    setProgress(0);
    
    const increment = calculateIncrement(rowCount);
    const interval = calculateInterval(rowCount);
    
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += increment;
      if (progress <= 60) {
        setProgress(Math.min(progress, 60));
      }
    }, interval);

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
    
    try {
      const gradualProgress = setInterval(() => {
        progress += increment / 2;
        if (progress > 60 && progress <= 80) {
          setProgress(Math.min(progress, 80));
        }
      }, interval);

      const response = await api.post<ApiResponse>(API_ENDPOINTS.PROCESS, request);
      clearInterval(gradualProgress);
      
      setProgress(80);
      setIsFinishing(true);
      
      setTimeout(() => {
        setProgress(90);
        setTimeout(() => {
          setProgress(100);
        }, interval / 2);
      }, interval / 2);

      return response.results;
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsFinishing(false);
      }, interval);
    }
  }

  return { 
    data, 
    isGenerating, 
    error, 
    generatePreview,
    generateFile 
  };
} 