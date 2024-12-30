from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from app.models.schema import InputSchema
from app.generators.numeric import NumericGenerator
from app.generators.string import StringGenerator
from app.generators.datetime import DateTimeGenerator
from app.generators.boolean import BooleanGenerator
from app.services.faker_service import FakerService
from app.services.data_service import DataService

# Initialize services
faker_service = FakerService()

# Initialize generators
generators = {
    "Numeric": NumericGenerator(),
    "String": StringGenerator(),
    "Date/Time": DateTimeGenerator(),
    "Boolean": BooleanGenerator()
}

data_service = DataService(faker_service, generators)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/process")
async def process_data(input_data: InputSchema):
    try:
        if not 1 <= input_data.rowCount <= 10000:
            raise HTTPException(
                status_code=400,
                detail="Row count must be between 1 and 10000"
            )

        results = []
        batch_size = 20
        
        # Generate data in batches
        for i in range(0, input_data.rowCount, batch_size):
            current_batch_size = min(batch_size, input_data.rowCount - i)
            batch_results = await data_service.generate_batch(input_data.columns, current_batch_size)
            results.extend(batch_results)

        return {
            "results": results[:input_data.rowCount],  # Ensure we don't return more than requested
            "metadata": {
                "generated_rows": len(results),
                "timestamp": datetime.now().isoformat(),
                "schema_processed": [col.column_name for col in input_data.columns 
                                   if col.column_name != "Unknown"],
                "generation_method": "AI with fallback to Faker/Basic"
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 