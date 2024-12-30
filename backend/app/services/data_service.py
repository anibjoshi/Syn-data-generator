from typing import Dict, Any, List
import openai
import os
import json
from ..models.schema import ColumnSchema
from .faker_service import FakerService
from dotenv import load_dotenv

class DataService:
    def __init__(self, faker_service: FakerService, generators: Dict):
        self.faker_service = faker_service
        self.generators = generators
        
        # Load environment variables and initialize OpenAI client
        load_dotenv()
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.client = openai

    async def generate_batch(self, columns: List[ColumnSchema], batch_size: int = 20) -> List[Dict[str, Any]]:
        """Generate a batch of rows using AI"""
        prompt = (
            f"Generate {batch_size} rows of data in JSON array format. "
            f"Return ONLY a valid JSON array with no additional text. "
            f"Each object should have these columns:\n"
        )
        for col in columns:
            if col.column_name != "Unknown":
                prompt += f"- {col.column_name}: {col.column_type}"
                if col.modifier_list:
                    prompt += f" with constraints: {', '.join(col.modifier_list)}"
                prompt += "\n"
        print(prompt)
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a data generation assistant. Respond with ONLY a valid JSON array of objects. No explanations or additional text."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            
            content = response.choices[0].message.content.strip()
            print(content)
            # Clean up the response if needed
            if not content.startswith('['):
                # Find the first '[' and last ']'
                start = content.find('[')
                end = content.rfind(']') + 1
                if start != -1 and end != 0:
                    content = content[start:end]
            
            try:
                return json.loads(content)
            except json.JSONDecodeError as e:
                print(f"JSON parsing error: {e}")
                print(f"Content received: {content}")
                return [self.generate_row_default(columns) for _ in range(batch_size)]
                
        except Exception as e:
            print(f"AI generation failed: {e}")
            return [self.generate_row_default(columns) for _ in range(batch_size)]

    def generate_row_default(self, columns: List[ColumnSchema]) -> Dict[str, Any]:
        """Fallback method using Faker and basic generators"""
        row = {}
        for column in columns:
            if column.column_name == "Unknown" or column.column_type == "Unknown":
                continue

            if column.column_type == "String":
                faker_func = self.faker_service.get_faker_function(column.column_name)
                if faker_func:
                    row[column.column_name] = faker_func()
                    continue

            generator = self.generators.get(column.column_type)
            if generator:
                if column.modifier_list and "," in column.modifier_list[0]:
                    row[column.column_name] = generator.generate_with_modifier(column.modifier_list[0])
                else:
                    row[column.column_name] = generator.generate()

        return row 