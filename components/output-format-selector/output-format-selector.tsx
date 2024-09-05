'use client'
import React from 'react';
import { useState } from 'react'

const outputFormats = ['JSON', 'CSV', 'SQL']

export default function OutputFormatSelector() {
  const [selectedFormat, setSelectedFormat] = useState(outputFormats[0])

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Output Format</label>
      <div className="flex space-x-4">
        {outputFormats.map((format) => (
          <button
            key={format}
            onClick={() => setSelectedFormat(format)}
            className={`px-4 py-2 rounded-md ${
              selectedFormat === format
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {format}
          </button>
        ))}
      </div>
    </div>
  )
}