'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Download, RefreshCw } from 'lucide-react'

export default function DataFactory() {
  const [schema, setSchema] = useState('')
  const [database, setDatabase] = useState('PostgreSQL')
  const [rowCount, setRowCount] = useState('')
  const [outputFormat, setOutputFormat] = useState('SQL')
  const [parsedSchema, setParsedSchema] = useState<Array<{ name: string; type: string }>>([])
  const [isGenerated, setIsGenerated] = useState(false)

  const databases = ['PostgreSQL', 'MySQL', 'SQLite', 'Oracle', 'SQL Server']
  const outputFormats = ['SQL', 'CSV', 'JSON', 'Parquet', 'Avro']

  useEffect(() => {
    // Simple parser for demonstration purposes
    const parsed = schema
      .match(/$$([^)]+)$$/)?.[1]
      .split(',')
      .map(column => {
        const [name, type] = column.trim().split(' ')
        return { name, type }
      }) || []
    setParsedSchema(parsed)
  }, [schema])

  const handleGenerateData = () => {
    // Placeholder for data generation logic
    setIsGenerated(true)
  }

  const handleReset = () => {
    setSchema('')
    setRowCount('')
    setIsGenerated(false)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-[#333333] py-4 border-b-2 border-[#FF7F11]">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">DataFactory</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form Input */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select your Database
              </label>
              <div className="flex flex-wrap gap-2">
                {databases.map((db) => (
                  <button
                    key={db}
                    onClick={() => setDatabase(db)}
                    className={`px-3 py-1 rounded-md transition-colors duration-300 ${
                      database === db
                        ? 'bg-[#FF7F11] text-white'
                        : 'bg-[#333333] text-white hover:bg-[#444444]'
                    }`}
                  >
                    {db}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="schema" className="block text-sm font-medium mb-1">
                Paste your CREATE TABLE statement
              </label>
              <textarea
                id="schema"
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                placeholder="CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(50), email VARCHAR(100));"
                className="w-full h-40 bg-[#333333] text-white placeholder-[#777777] border border-[#777777] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#FF7F11]"
              />
            </div>

            <div>
              <label htmlFor="rowCount" className="block text-sm font-medium mb-1">
                Number of Rows
              </label>
              <input
                type="number"
                id="rowCount"
                value={rowCount}
                onChange={(e) => setRowCount(e.target.value)}
                placeholder="Enter the number of rows to generate"
                className="w-full bg-[#333333] text-white placeholder-[#777777] border border-[#777777] rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF7F11]"
              />
            </div>

            {parsedSchema.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Customize Data for Each Column</h3>
                {parsedSchema.map((column, index) => (
                  <div key={index} className="mb-4 p-4 bg-[#333333] rounded-md">
                    <h4 className="font-medium mb-2">{column.name} ({column.type})</h4>
                    {column.type.toLowerCase().includes('int') ? (
                      <div className="flex space-x-4">
                        <input
                          type="number"
                          placeholder="Min Value"
                          className="w-1/2 bg-black text-white placeholder-[#777777] border border-[#777777] rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#FF7F11]"
                        />
                        <input
                          type="number"
                          placeholder="Max Value"
                          className="w-1/2 bg-black text-white placeholder-[#777777] border border-[#777777] rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#FF7F11]"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`random-${index}`}
                          className="rounded text-[#FF7F11] focus:ring-[#FF7F11]"
                        />
                        <label htmlFor={`random-${index}`}>Generate Random Data</label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div>
              <label htmlFor="outputFormat" className="block text-sm font-medium mb-1">
                Select Output Format
              </label>
              <div className="relative">
                <select
                  id="outputFormat"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="block w-full bg-[#333333] border border-[#777777] rounded-md py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-[#FF7F11] appearance-none"
                >
                  {outputFormats.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#777777]" />
              </div>
            </div>

            <button
              onClick={handleGenerateData}
              className="w-full bg-[#FF7F11] text-white py-2 px-4 rounded-md hover:bg-white hover:text-[#FF7F11] transition-colors duration-300 shadow-md"
            >
              Generate Data
            </button>
          </div>

          {/* Right Column - Live Preview & Download */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="bg-[#333333] p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Live Schema Preview</h3>
              <pre className="text-sm">
                <code>
                  {parsedSchema.map((column, index) => (
                    <div key={index}>
                      <span className="text-[#FF7F11]">{column.name}</span>{' '}
                      <span className="text-white">{column.type}</span>
                      {index < parsedSchema.length - 1 && ','}
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {isGenerated && (
              <div className="bg-[#333333] p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">File Information</h3>
                <p>Rows generated: {rowCount}</p>
                <p>File format: {outputFormat}</p>
                <p>Approximate file size: 1.2 MB</p>
                <button className="mt-4 w-full bg-[#FF7F11] text-white py-2 px-4 rounded-md hover:bg-white hover:text-[#FF7F11] transition-colors duration-300 flex items-center justify-center">
                  <Download className="mr-2" />
                  Download File
                </button>
                <button
                  onClick={handleReset}
                  className="mt-2 w-full bg-transparent text-[#FF7F11] py-2 px-4 rounded-md border border-[#FF7F11] hover:bg-[#FF7F11] hover:text-white transition-colors duration-300 flex items-center justify-center"
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