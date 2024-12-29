from pydantic import BaseModel
from typing import Dict, List

class ColumnSchema(BaseModel):
    column_name: str
    column_type: str
    column_data_type: str
    modifier_list: List[str]

class InputSchema(BaseModel):
    schema: List[ColumnSchema]
    rowCount: int
    outputFormat: str 