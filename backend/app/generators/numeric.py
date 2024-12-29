import random
from .base import BaseGenerator
from ..utils.modifiers import parse_numeric_modifier

class NumericGenerator(BaseGenerator):
    def generate(self) -> int:
        return random.randint(1, 1000000)

    def generate_with_modifier(self, modifier: str) -> float:
        params = parse_numeric_modifier(modifier)
        if params['distribution'] == 'uniform':
            value = random.uniform(params['min'], params['max'])
        else:
            value = random.gauss((params['max'] + params['min']) / 2, 
                               (params['max'] - params['min']) / 6)
        return round(value, params['precision']) 