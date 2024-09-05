import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface SchemaInputProps {
  value: string
  onChange: (value: string) => void
}

export function SchemaInput({ value, onChange }: SchemaInputProps) {
  return (
    <div>
      <Label htmlFor="schema" className="block text-sm font-medium mb-1 text-gray-700">
        Paste your CREATE TABLE statement
      </Label>
      <Textarea
        id="schema"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(50), email VARCHAR(100));"
        className="w-full h-40 bg-white text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
  )
}