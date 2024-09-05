import React from 'react';
import { Label } from "../ui/label"

interface RowCountInputProps {
  value: string
  onChange: (value: string) => void
}

export function RowCountInput({ value, onChange }: RowCountInputProps) {
  return (
    <div>
      <Label htmlFor="rowCount" className="block text-sm font-medium mb-1 text-gray-700">
        Number of Rows
      </Label>
      <input
        type="number"
        id="rowCount"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter the number of rows to generate"
        className="w-full bg-white text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
  )
}