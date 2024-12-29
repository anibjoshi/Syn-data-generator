from datetime import datetime, timedelta
import random
from .base import BaseGenerator
from ..utils.modifiers import parse_datetime_modifier

class DateTimeGenerator(BaseGenerator):
    def generate(self) -> str:
        start_date = datetime(2020, 1, 1)
        end_date = datetime.now()
        random_date = start_date + timedelta(
            days=random.randint(0, (end_date - start_date).days),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59),
            seconds=random.randint(0, 59)
        )
        return random_date.isoformat()

    def generate_date(self) -> str:
        start_date = datetime(2020, 1, 1)
        end_date = datetime.now()
        random_date = start_date + timedelta(
            days=random.randint(0, (end_date - start_date).days)
        )
        return random_date.strftime("%Y-%m-%d")

    def generate_with_modifier(self, modifier: str) -> str:
        params = parse_datetime_modifier(modifier)
        delta = params['end'] - params['start']
        random_days = random.randint(0, delta.days)
        date = params['start'] + timedelta(days=random_days)
        return date.strftime(params['format']) 