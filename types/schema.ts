export interface ColumnDefinition {
  name: string
  type: string
  constraints: string[]
}

export interface Schema {
  tableName: string
  columns: ColumnDefinition[]
}