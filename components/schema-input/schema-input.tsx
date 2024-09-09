import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import styles from './schema-input.module.css'

interface SchemaInputProps {
  value: string
  onChange: (value: string) => void
}

export function SchemaInput({ value, onChange }: SchemaInputProps) {
  return (
    <div className={styles.container}>
      <Label htmlFor="schema" className={styles.label}>
        Paste your CREATE TABLE statement
      </Label>
      <Textarea
        id="schema"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(50), email VARCHAR(100));"
        className={styles.textarea}
        spellCheck="false"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  )
}