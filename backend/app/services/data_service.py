from typing import Dict, Any, List
import openai
import os
import json
import asyncio
import logging
from aiohttp import ClientSession
import aiohttp
from ..models.schema import ColumnSchema
from .faker_service import FakerService
from dotenv import load_dotenv
import ssl
import certifi

class DataService:
    def __init__(self, faker_service: FakerService, generators: Dict):
        self.faker_service = faker_service
        self.generators = generators
        
        # Load environment variables and initialize OpenAI client
        load_dotenv()
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.client = openai

        # Configuration for parallel processing
        self.max_requests_per_minute = 1500
        self.max_tokens_per_minute = 6250000
        self.max_attempts = 3
        self.logging_level = logging.INFO

        # Add SSL context configuration
        self.ssl_context = ssl.create_default_context(cafile=certifi.where())

    async def generate_data(
        self,
        columns: List[ColumnSchema],
        total_rows: int,
        batch_size: int = 20,
        save_filepath: str = None,
    ) -> List[Dict[str, Any]]:
        """Generate synthetic data with parallel processing."""
        # Prepare batches of prompts
        requests = self.prepare_requests(columns, total_rows, batch_size)

        # Parallel processing of requests
        results = await self.process_requests(
            requests=requests,
            save_filepath=save_filepath,
        )

        return results

    def prepare_requests(self, columns: List[ColumnSchema], total_rows: int, batch_size: int) -> List[Dict[str, Any]]:
        """Prepare request payloads for OpenAI API."""
        requests = []
        for batch_start in range(0, total_rows, batch_size):
            batch_prompt = (
                f"Generate {min(batch_size, total_rows - batch_start)} rows of JSON data with these columns:\n"
            )
            for col in columns:
                if col.column_name != "Unknown":
                    batch_prompt += f"- {col.column_name}: {col.column_type}"
                    if col.modifier_list:
                        batch_prompt += f" with constraints: {', '.join(col.modifier_list)}"
                    batch_prompt += "\n"

            requests.append({
                "model": "gpt-4",
                "messages": [
                    {"role": "system", "content": "You are a data generation assistant. Respond with ONLY a valid JSON array of objects. No explanations or additional text."},
                    {"role": "user", "content": batch_prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 1000,
            })
        return requests

    async def process_requests(self, requests: List[Dict], save_filepath: str = None) -> List[Dict[str, Any]]:
        """Process OpenAI API requests with parallel handling."""
        # Create ClientSession with SSL context
        async with ClientSession(connector=aiohttp.TCPConnector(ssl=self.ssl_context)) as session:
            tasks = [
                self.call_api_with_retry(session, request, idx)
                for idx, request in enumerate(requests)
            ]
            results = await asyncio.gather(*tasks, return_exceptions=True)

        # Collect and save results
        all_data = []
        for result in results:
            if isinstance(result, list):
                all_data.extend(result)
            else:
                logging.error(f"Error processing request: {result}")

        if save_filepath:
            with open(save_filepath, "w") as f:
                json.dump(all_data, f)

        return all_data

    async def call_api_with_retry(
        self, session: ClientSession, request: Dict, task_id: int
    ) -> List[Dict[str, Any]]:
        """Call OpenAI API with retry mechanism."""
        for attempt in range(self.max_attempts):
            try:
                async with session.post(
                    url="https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {openai.api_key}"},
                    json=request,
                ) as response:
                    response_data = await response.json()
                    if "error" in response_data:
                        raise Exception(f"API error: {response_data['error']}")

                    # Parse and return data
                    content = response_data["choices"][0]["message"]["content"].strip()
                    return json.loads(content)

            except Exception as e:
                logging.warning(f"Attempt {attempt + 1} for task {task_id} failed: {e}")
                await asyncio.sleep(2**attempt)  # Exponential backoff

        logging.error(f"Task {task_id} failed after {self.max_attempts} attempts.")
        return []

    def generate_row_default(self, columns: List[ColumnSchema]) -> Dict[str, Any]:
        """Fallback method using Faker and basic generators."""
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
