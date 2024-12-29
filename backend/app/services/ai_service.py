from typing import Dict, List
import openai
import os
from datetime import datetime
from dotenv import load_dotenv

class AIService:
    def __init__(self):
        # Load environment variables and initialize OpenAI client
        load_dotenv()
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.cache: Dict[str, List[str]] = {}
    
    async def get_string_values(self, column_name: str, modifier: str = None, count: int = 10) -> List[str]:
        """Generate multiple string values using AI with caching"""
        cache_key = f"{column_name}:{modifier if modifier else 'default'}"
        
        if cache_key in self.cache:
            return self.cache[cache_key]

        try:
            context = f"for column named '{column_name}'"
            if modifier:
                context += f" with requirements: {modifier}"

            prompt = f"""Generate {count} different realistic string values {context}.
                        Values should be appropriate for a database column.
                        Return ONLY the values, one per line, no explanations."""
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a data generator. Respond only with generated values, one per line."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=200
            )
            
            values = [v.strip() for v in response.choices[0].message.content.strip().split('\n') if v.strip()]
            self.cache[cache_key] = values
            return values
                
        except Exception as e:
            print(f"Error generating AI values: {e}")
            return []

    def should_use_ai_for_string(self, column_name: str, faker_keys: List[str]) -> bool:
        """Determine if we should use AI for string generation"""
        # Use Faker for common personal/contact information
        if any(key in column_name.lower() for key in faker_keys):
            return False
        
        # Use AI for more context-specific fields
        context_keywords = [
            'title', 'description', 'comment', 'status', 'category', 
            'tag', 'role', 'position', 'skill', 'qualification',
            'product', 'service', 'feature', 'benefit'
        ]
        
        return any(keyword in column_name.lower() for keyword in context_keywords) 