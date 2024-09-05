import React from 'react';

interface DataPreviewProps {
  data: any[]
}

export function DataPreview({ data }: DataPreviewProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Data Preview</h2>
      {data.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="border border-gray-300 p-2">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value: any, cellIndex) => (
                  <td key={cellIndex} className="border border-gray-300 p-2">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data to preview</p>
      )}
    </div>
  )
}