'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown, Download, RefreshCw } from 'lucide-react'
import { SchemaInput } from './schema-input/schema-input'
import { RowCountInput } from './row-count-input/row-count-input'

interface Database {
  name: string;
  logo: string;
}

export default function DataFactory() {
  const [schema, setSchema] = useState('')
  const [database, setDatabase] = useState('PostgreSQL')
  const [rowCount, setRowCount] = useState('')
  const [outputFormat, setOutputFormat] = useState('SQL')
  const [parsedSchema, setParsedSchema] = useState<Array<{ name: string; type: string }>>([])
  const [isGenerated, setIsGenerated] = useState(false)

  const databases: Database[] = [
    { name: 'PostgreSQL', logo: '/images/postgresql-logo.png' },
    { name: 'MySQL', logo: '/images/mysql-logo.png' }
  ]
  const outputFormats = ['SQL', 'CSV', 'JSON', 'Parquet', 'Avro']

  useEffect(() => {
    const parsed = schema
      .match(/CREATE TABLE \w+ \(([\s\S]*?)\)/i)?.[1]
      ?.split(',')
      .map(column => {
        const [name, ...rest] = column.trim().split(' ')
        return { name, type: rest.join(' ') }
      }) || []
    setParsedSchema(parsed)
  }, [schema])

  const handleGenerateData = () => {
    setIsGenerated(true)
  }

  const handleReset = () => {
    setSchema('')
    setRowCount('')
    setIsGenerated(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-indigo-600">DataFactory</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form Input */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Select your Database
              </label>
              <div className="flex justify-center gap-6">
                {databases.map((db) => (
                  <button
                    key={db.name}
                    onClick={() => setDatabase(db.name)}
                    className={`w-40 h-24 p-2 rounded-lg transition-all duration-300 relative overflow-hidden ${
                      database === db.name
                        ? 'ring-4 ring-indigo-500 shadow-lg'
                        : 'hover:ring-2 hover:ring-gray-300 hover:shadow-md'
                    }`}
                    title={db.name}
                  >
                    <Image
                      src={db.logo}
                      alt={`${db.name} logo`}
                      layout="fill"
                      objectFit="contain"
                      className="p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            <SchemaInput value={schema} onChange={setSchema} />
            <RowCountInput value={rowCount} onChange={setRowCount} />

            {parsedSchema.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2 text-gray-700">Customize Data for Each Column</h3>
                {parsedSchema.map((column, index) => (
                  <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md">
                    <h4 className="font-medium mb-2 text-gray-700">{column.name} ({column.type})</h4>
                    {column.type.toLowerCase().includes('int') ? (
                      <div className="flex space-x-4">
                        <input
                          type="number"
                          placeholder="Min Value"
                          className="w-1/2 bg-white text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Max Value"
                          className="w-1/2 bg-white text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`random-${index}`}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor={`random-${index}`} className="text-gray-700">Generate Random Data</label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div>
              <label htmlFor="outputFormat" className="block text-sm font-medium mb-1 text-gray-700">
                Select Output Format
              </label>
              <div className="relative">
                <select
                  id="outputFormat"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                >
                  {outputFormats.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <button
              onClick={handleGenerateData}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 shadow-sm"
            >
              Generate Data
            </button>
          </div>

          {/* Right Column - Live Preview & Download */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2 text-gray-700">Live Schema Preview</h3>
              <pre className="text-sm bg-gray-50 p-3 rounded-md">
                <code>
                  {parsedSchema.map((column, index) => (
                    <div key={index}>
                      <span className="text-indigo-600">{column.name}</span>{' '}
                      <span className="text-gray-700">{column.type}</span>
                      {index < parsedSchema.length - 1 && ','}
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {isGenerated && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2 text-gray-700">File Information</h3>
                <p className="text-gray-600">Rows generated: {rowCount}</p>
                <p className="text-gray-600">File format: {outputFormat}</p>
                <p className="text-gray-600">Approximate file size: 1.2 MB</p>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center shadow-sm">
                  <Download className="mr-2" />
                  Download File
                </button>
                <button
                  onClick={handleReset}
                  className="mt-2 w-full bg-white text-indigo-600 py-2 px-4 rounded-md border border-indigo-600 hover:bg-indigo-50 transition-colors duration-300 flex items-center justify-center"
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