'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronDown, Download, RefreshCw, X, HelpCircle } from 'lucide-react'
import { SchemaInput } from './schema-input/schema-input'
import { RowCountInput } from './row-count-input/row-count-input'
import { dataTypes, modifierExamples, modifierPlaceholders, DatabaseType, DataType, SUPPORTED_DATABASES } from '../utils/constants'

interface Database {
  name: DatabaseType;
  logo: string;
}

interface ColumnType {
  name: string;
  type: DataType;
  modifier?: string;
}

export default function DataFactory() {
  const [schema, setSchema] = useState('')
  const [database, setDatabase] = useState<DatabaseType>(SUPPORTED_DATABASES[0])
  const [rowCount, setRowCount] = useState('')
  const [outputFormat, setOutputFormat] = useState('SQL')
  const [parsedSchema, setParsedSchema] = useState<ColumnType[]>([])
  const [isGenerated, setIsGenerated] = useState(false)
  const [generatedData, setGeneratedData] = useState<any[] | null>(null)

  const databases: Database[] = SUPPORTED_DATABASES.map(db => ({
    name: db,
    logo: `/images/${db.toLowerCase()}-logo.png`
  }));

  const outputFormats = ['SQL', 'CSV', 'JSON', 'Parquet', 'Avro']

  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setActiveTooltip(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const parseCreateTableStatement = (sql: string, database: DatabaseType): ColumnType[] => {
      const tableMatch = sql.match(/CREATE TABLE\s+["`]?(\w+)["`]?\s*\(([\s\S]+)\)/i);
      if (!tableMatch) return [];

      const columnsPart = tableMatch[2];
      const columnDefinitions = columnsPart.split(',').map(col => col.trim());

      return columnDefinitions.map(colDef => {
        const columnMatch = colDef.match(/^["`]?(\w+)["`]?\s+([\w\s()]+)(.*)$/);
        if (!columnMatch) return { name: 'Unknown', type: 'Unknown', modifier: '' };

        let [_, name, type, constraints] = columnMatch;

        name = name.replace(/["`]/g, '');
        type = type.trim().toUpperCase();

        // Handle array types
        if (type.endsWith('[]')) {
          type = 'ARRAY';
        }

        // Handle specific types
        if (type.startsWith('SERIAL')) {
          type = 'SERIAL';
        } else if (type.includes('INT')) {
          type = 'INTEGER';
        } else if (type === 'NUMERIC' || type === 'DECIMAL') {
          type = 'NUMERIC';
        } else if (type === 'BOOLEAN') {
          type = 'BOOLEAN';
        } else if (type.includes('TIMESTAMP')) {
          type = 'TIMESTAMP';
        } else if (type.includes('UUID')) {
          type = 'UUID';
        }

        const baseType = type.split('(')[0].trim();
        const generalType = (dataTypes[database][baseType as keyof typeof dataTypes[typeof database]] as DataType) || "Unknown";

        return { name, type: generalType, modifier: '' };
      });
    };

    const parsed = parseCreateTableStatement(schema, database);
    setParsedSchema(parsed);
  }, [schema, database]);

  const handleGenerateData = async () => {
    setIsGenerated(true);
    try {
      console.log('Sending request to generate data...');
      const response = await fetch('/api/generate-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schema: parsedSchema, rowCount: parseInt(rowCount) || 10 }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      setGeneratedData(data);
    } catch (error) {
      console.error('Error generating data:', error);
      setGeneratedData(null);
      // Optionally, set an error state here to display to the user
    }
  }

  const handleReset = () => {
    setSchema('')
    setRowCount('')
    setIsGenerated(false)
    setGeneratedData(null)
  }

  const handleDeleteColumn = (indexToDelete: number) => {
    setParsedSchema(prevSchema => prevSchema.filter((_, index) => index !== indexToDelete));
  };

  const handleChangeColumnType = (index: number, newType: string) => {
    setParsedSchema(prevSchema => 
      prevSchema.map((column, i) => 
        i === index ? { ...column, type: newType as DataType } : column
      )
    );
  };

  const handleChangeModifier = (index: number, newModifier: string) => {
    setParsedSchema(prevSchema => 
      prevSchema.map((column, i) => 
        i === index ? { ...column, modifier: newModifier } : column
      )
    );
  };

  const uniqueDataTypes = Array.from(new Set(Object.values(dataTypes[database]).flat()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 text-gray-800">
      <div className="absolute inset-0 bg-grid-indigo-500/[0.025] -z-10"></div>
      <header className="bg-white bg-opacity-70 backdrop-blur-lg py-6 shadow-sm border-b-2 border-indigo-200">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-indigo-700">Data<span className="text-orange-500">Factory</span></h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Form Input */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="bg-white bg-opacity-80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-indigo-100">
              <label className="block text-lg font-medium mb-4 text-indigo-800">
                Select your Database
              </label>
              <div className="flex justify-center gap-6">
                {databases.map((db) => (
                  <button
                    key={db.name}
                    onClick={() => setDatabase(db.name)}
                    className={`w-40 h-24 p-2 rounded-lg transition-all duration-300 relative overflow-hidden ${
                      database === db.name
                        ? 'ring-4 ring-indigo-500 shadow-lg scale-105'
                        : 'hover:ring-2 hover:ring-indigo-300 hover:shadow-md hover:scale-105'
                    }`}
                    title={db.name}
                  >
                    <Image
                      src={db.logo}
                      alt={`${db.name} logo`}
                      layout="fill"
                      objectFit="contain"
                      className="p-2 transition-transform duration-300 transform hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            </div>

            <SchemaInput value={schema} onChange={setSchema} />
            <RowCountInput value={rowCount} onChange={setRowCount} />

            {parsedSchema.length > 0 && (
              <div className="bg-white bg-opacity-80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-indigo-100">
                <h3 className="text-xl font-medium mb-4 text-indigo-800">Schema</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 w-1/4">Column Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 w-1/4">Data Type</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Modifiers</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedSchema.map((column, index) => (
                        column.name !== 'Unknown' && (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-2">
                              <span className="font-medium text-gray-700">{column.name}</span>
                            </td>
                            <td className="px-4 py-2">
                              <select
                                value={column.type}
                                onChange={(e) => handleChangeColumnType(index, e.target.value)}
                                className={`w-full bg-white border rounded-md py-1 px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                  column.type === 'Unknown' ? 'border-red-500' : 'border-gray-300'
                                }`}
                              >
                                {uniqueDataTypes.map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                                {column.type === 'Unknown' && <option value="Unknown">Unknown</option>}
                              </select>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center">
                                <input
                                  type="text"
                                  value={column.modifier || ''}
                                  onChange={(e) => handleChangeModifier(index, e.target.value)}
                                  placeholder={column.type === 'Unknown' ? "Unknown Column Type" : (modifierPlaceholders[column.type as keyof typeof modifierPlaceholders] || "Enter modifiers")}
                                  className="w-full bg-white border border-gray-300 rounded-md py-1 px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <div className="relative ml-2 flex-shrink-0 group">
                                  <button
                                    onClick={() => setActiveTooltip(activeTooltip === index ? null : index)}
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                  >
                                    <HelpCircle size={18} />
                                  </button>
                                  {activeTooltip === index && (
                                    <div
                                      ref={tooltipRef}
                                      className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white text-gray-800 text-xs rounded-md py-2 px-3 shadow-lg w-64 whitespace-pre-wrap border border-gray-200 z-10 mt-2"
                                      onMouseLeave={() => setActiveTooltip(null)}
                                    >
                                      <div className="font-semibold mb-1 text-indigo-600">Suggestion:</div>
                                      <div dangerouslySetInnerHTML={{ __html: (modifierExamples[column.type as keyof typeof modifierExamples] || "No specific modifiers available").replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold text-indigo-600">$1</span>') }} />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => handleDeleteColumn(index)}
                                className="text-red-500 hover:text-red-700 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                title="Remove column"
                              >
                                <X size={18} />
                              </button>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-white bg-opacity-80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-indigo-100">
              <label htmlFor="outputFormat" className="block text-lg font-medium mb-4 text-indigo-800">
                Select Output Format
              </label>
              <div className="relative">
                <select
                  id="outputFormat"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all duration-300"
                >
                  {outputFormats.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={handleGenerateData}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
            >
              Generate Data
            </button>
          </div>

          {/* Right Column - Generated Data Preview & Download */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="bg-white bg-opacity-80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-indigo-100">
              <h3 className="text-xl font-medium mb-4 text-indigo-800">Generated Data Preview</h3>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg h-[400px] overflow-auto">
                {generatedData ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          {parsedSchema.map((column) => (
                            <th key={column.name} className="px-2 py-1 text-left">{column.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {generatedData.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            {parsedSchema.map((column) => (
                              <td key={column.name} className="px-2 py-1">{row[column.name]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 text-center">
                      Click Generate Data to see a sample of data
                    </p>
                  </div>
                )}
              </div>
            </div>

            {isGenerated && (
              <div className="bg-white bg-opacity-80 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-indigo-100">
                <h3 className="text-xl font-medium mb-4 text-indigo-800">File Information</h3>
                <p className="text-gray-600">Rows generated: {rowCount}</p>
                <p className="text-gray-600">File format: {outputFormat}</p>
                <p className="text-gray-600">Approximate file size: 1.2 MB</p>
                <button className="mt-6 w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center">
                  <Download className="mr-2" />
                  Download File
                </button>
                <button
                  onClick={handleReset}
                  className="mt-4 w-full bg-white text-indigo-600 py-3 px-6 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors duration-300 flex items-center justify-center transform hover:-translate-y-1 active:translate-y-0"
                >
                  <RefreshCw className="mr-2" />
                  Generate Another Dataset
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}