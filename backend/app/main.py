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
    print(input_data)
    try:
        if not 1 <= input_data.rowCount <= 10000:
            raise HTTPException(
                status_code=400,
                detail="Row count must be between 1 and 10000"
            )

        results = []
        for _ in range(input_data.rowCount):
            row = data_service.generate_row(input_data.schema)
            results.append(row)
        print(results)
        return {
            "results": results,
            "metadata": {
                "generated_rows": len(results),
                "timestamp": datetime.now().isoformat(),
                "schema_processed": [col.column_name for col in input_data.schema 
                                   if col.column_name != "Unknown"],
                "faker_generated_columns": [col.column_name for col in input_data.schema 
                                         if faker_service.get_faker_function(col.column_name)]
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 