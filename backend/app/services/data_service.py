from typing import Dict, Any, List
from ..models.schema import ColumnSchema
from .faker_service import FakerService

class DataService:
    def __init__(self, faker_service: FakerService, generators: Dict):
        self.faker_service = faker_service
        self.generators = generators
        
    def generate_row(self, schema: List[ColumnSchema]) -> Dict[str, Any]:
        """Generate a single row of data"""
        row = {}
        
        for column in schema:
            if column.column_name == "Unknown" or column.column_type == "Unknown":
                continue

            # Try Faker first for strings
            if column.column_type == "String":
                faker_func = self.faker_service.get_faker_function(column.column_name)
                if faker_func:
                    row[column.column_name] = faker_func()
                    continue

            # Use generators for other types or fallback
            generator = self.generators.get(column.column_type)
            if not generator:
                continue

            if column.modifier_list and "," in column.modifier_list[0]:
                value = generator.generate_with_modifier(column.modifier_list[0])
                row[column.column_name] = value
            else:
                row[column.column_name] = generator.generate()

        return row 